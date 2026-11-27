#!/usr/bin/env bash
set -euo pipefail
export MSYS_NO_PATHCONV=1
export AWS_REGION=ap-northeast-2

SHA=$(git rev-parse --short HEAD)
ECR=$(aws ecr describe-repositories --repository-names umc-app \
        --query 'repositories[0].repositoryUri' --output text)
TG=$(aws elbv2 describe-target-groups --names umc-app-tg \
        --query 'TargetGroups[0].TargetGroupArn' --output text)

echo "SHA=$SHA"
echo "ECR=$ECR"
echo "TG=$TG"

# 1. 이미지
aws ecr get-login-password --region ap-northeast-2 \
  | docker login --username AWS --password-stdin "${ECR%%/*}"
docker buildx build --platform linux/arm64 --provenance=false -t "${ECR}:${SHA}" --push .

# 2. 앞으로 "새로 뜨는" 인스턴스가 읽을 태그
aws ssm put-parameter --name /umc/app/image --type String --value "${ECR}:${SHA}" --overwrite

# 3. "지금 떠 있는" 인스턴스를 한 대씩 교체
for ID in $(aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names umc-asg \
              --query 'AutoScalingGroups[0].Instances[?LifecycleState==`InService`].InstanceId' \
              --output text); do
  echo "── $ID"

  # 트래픽을 끊는다. 처리 중이던 요청은 deregistration_delay 만큼 기다려 준다
  aws elbv2 deregister-targets --target-group-arn "$TG" --targets Id="$ID"
  aws elbv2 wait target-deregistered --target-group-arn "$TG" --targets Id="$ID"
  echo "   deregistered"

  # 컨테이너 교체
  CID=$(aws ssm send-command --instance-ids "$ID" --document-name AWS-RunShellScript \
          --parameters 'commands=["bash /opt/umc/swap.sh"]' \
          --query Command.CommandId --output text)

  until [ "$(aws ssm list-command-invocations --command-id "$CID" \
               --query 'CommandInvocations[0].Status' --output text)" != "InProgress" ]; do
    sleep 5
  done
  ST=$(aws ssm list-command-invocations --command-id "$CID" \
         --query 'CommandInvocations[0].Status' --output text)
  if [ "$ST" != "Success" ]; then
    echo "교체 실패($ST). 이 인스턴스는 타겟에서 빠진 채로 남아 있다."
    aws ssm list-command-invocations --command-id "$CID" --details \
      --query 'CommandInvocations[0].CommandPlugins[0].Output' --output text | tail -20
    exit 1
  fi
  echo "   swapped"

  # 다시 트래픽을 받는다. 정상이 될 때까지 기다린 뒤에야 다음 대로 넘어간다
  aws elbv2 register-targets --target-group-arn "$TG" --targets Id="$ID"
  aws elbv2 wait target-in-service --target-group-arn "$TG" --targets Id="$ID"
  echo "   in service"
done

echo "배포 완료: ${ECR}:${SHA}"
