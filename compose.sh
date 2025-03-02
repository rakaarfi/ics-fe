docker compose -f docker-compose.yaml pull
docker compose -f docker-compose.yaml up --force-recreate --build -d
docker image prune -f