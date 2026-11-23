#!/bin/bash
set -euo pipefail
exec > >(tee /var/log/umc-boot.log) 2>&1

dnf install -y docker
systemctl enable --now docker

mkdir -p /opt/umc
cat > /opt/umc/swap.sh <<'SWAP'
#!/bin/bash
set -euo pipefail

REGION=ap-northeast-2
p() {
  aws ssm get-parameter --region "$REGION" --name "/umc/app/$1" \
    --with-decryption --query Parameter.Value --output text
}

IMAGE=$(p image)
DB_HOST=$(p db-host)
DB_USER=$(p db-user)
DB_NAME=$(p db-name)
DB_PASSWORD=$(p db-password)
JWT_SECRET=$(p jwt-secret)

aws ecr get-login-password --region "$REGION" \
  | docker login --username AWS --password-stdin "${IMAGE%%/*}"
docker pull "$IMAGE"

docker rm -f app >/dev/null 2>&1 || true
docker run -d --name app --restart unless-stopped -p 8080:8080 \
  -e SERVER_ADDRESS=0.0.0.0 -e SPRING_DATASOURCE_URL="jdbc:mysql://${DB_HOST}:3306/${DB_NAME}" \
  -e SPRING_DATASOURCE_USERNAME="$DB_USER" \
  -e SPRING_DATASOURCE_PASSWORD="$DB_PASSWORD" \
  -e JWT_SECRET="$JWT_SECRET" \
  "$IMAGE"
SWAP

chmod +x /opt/umc/swap.sh
/opt/umc/swap.sh
