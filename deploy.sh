#!/usr/bin/env bash
set -euo pipefail
export AWS_DEFAULT_REGION=ap-northeast-2
export AWS_PAGER=""

repo=$(aws ecr describe-repositories --repository-names umc-app --query 'repositories[0].repositoryUri' --output text)
target_group=$(aws elbv2 describe-target-groups --names umc-app-tg --query 'TargetGroups[0].TargetGroupArn' --output text)
instances=$(aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names umc-asg \
  --query 'AutoScalingGroups[0].Instances[?LifecycleState==`InService`].InstanceId' --output text)
read -r -a instance_ids <<< "$instances"

if (( ${#instance_ids[@]} < 2 )); then
  echo "At least two InService instances are required." >&2
  exit 1
fi

check_healthy() {
  for instance in "${instance_ids[@]}"; do
    state=$(aws elbv2 describe-target-health --target-group-arn "$target_group" \
      --targets "Id=$instance" --query 'TargetHealthDescriptions[0].TargetHealth.State' --output text)
    if [[ "$state" != "healthy" ]]; then
      echo "$instance is $state. Deployment stopped." >&2
      exit 1
    fi
  done
}
check_healthy

registry=${repo%%/*}
commit=$(git rev-parse --short HEAD)
image="$repo:v1.0.0-$(TZ=Asia/Seoul date +%y-%m-%d)-1"
aws ecr get-login-password | docker login --username AWS --password-stdin "$registry"
docker buildx build --platform linux/arm64 --provenance=false -t "$image" --push .
check_healthy
aws ssm put-parameter --name /umc/app/image --type String --value "$image" --overwrite

for instance in "${instance_ids[@]}"; do
  check_healthy
  echo "Deploying $image to $instance"
  aws elbv2 deregister-targets --target-group-arn "$target_group" --targets "Id=$instance"
  aws elbv2 wait target-deregistered --target-group-arn "$target_group" --targets "Id=$instance"

  command_id=$(aws ssm send-command --instance-ids "$instance" --document-name AWS-RunShellScript \
    --parameters 'commands=["bash /opt/umc/swap.sh"]' --query 'Command.CommandId' --output text)

  status=Pending
  for (( attempt=0; attempt<120; attempt++ )); do
    status=$(aws ssm list-command-invocations --command-id "$command_id" --instance-id "$instance" \
      --query 'CommandInvocations[0].Status' --output text)
    case "$status" in
      Pending|InProgress|Delayed|None|"") sleep 5 ;;
      *) break ;;
    esac
  done
  if [[ "$status" != "Success" ]]; then
    echo "$instance deployment status: $status. Target remains deregistered. SSM command: $command_id" >&2
    exit 1
  fi

  aws elbv2 register-targets --target-group-arn "$target_group" --targets "Id=$instance"
  aws elbv2 wait target-in-service --target-group-arn "$target_group" --targets "Id=$instance"
  echo "$instance is healthy."
done

echo "Deployment complete: $image"
