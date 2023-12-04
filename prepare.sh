#!/bin/bash

# Define Docker Compose file variables
DOCKER_COMPOSE_FILE="./services/docker-compose.yaml"
DOCKER_COMPOSE_KAFKA_FILE="docker-compose-kafka.yaml"

# Initialize flags
DOWN=false
BUILD=false

# Process command line options
while getopts ":db" opt; do
  case $opt in
    d)
      DOWN=true
      ;;
    b)
      BUILD=true
      ;;
    \?)
      echo "Option invalide: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

if $DOWN; then
  # si le paramètre -d est présent, on down les containers
  echo "docker compose down"
  docker compose --file "$DOCKER_COMPOSE_KAFKA_FILE" down
  docker compose --file "$DOCKER_COMPOSE_FILE" down
fi

if $BUILD; then
  # si le paramètre -b est présent, on build les images
  echo "docker compose build"
  docker compose --file "$DOCKER_COMPOSE_KAFKA_FILE" build
  docker compose --file "$DOCKER_COMPOSE_FILE" build
fi

# dans tous les cas, faire ça:
echo "docker compose down"
docker compose --file "$DOCKER_COMPOSE_KAFKA_FILE" down
docker compose --file "$DOCKER_COMPOSE_FILE" down

echo "docker compose build"
docker compose --file "$DOCKER_COMPOSE_KAFKA_FILE" build
docker compose --file "$DOCKER_COMPOSE_FILE" build

# Up all containers
echo "$RED====================== Préparation de l'environnement ======================$RESET"

# Creating tmp log file
if [ ! -d "logs" ]; then
  echo "Création des fichiers de log temporaire"
  mkdir "logs"
fi

# Define an array of service names
SERVICES=("weather" "rocketstatus" "missioncontrol" "rocketdepartment" "customercargo" "rocket" "booster" "payload" "logger" "streaming")

# Create log files for each service
for service in "${SERVICES[@]}"; do
  touch "logs/${service}.log"
done

echo "$RED====================== Démarrage de kafka ======================$RESET"

echo "docker compose --file $DOCKER_COMPOSE_KAFKA_FILE up -d"
docker compose --file "$DOCKER_COMPOSE_KAFKA_FILE" up -d

echo "$RED====================== Création des topics ======================$RESET"
while [ "$(docker compose --file "$DOCKER_COMPOSE_KAFKA_FILE" ps -q kafka-setup)" ]; do
  sleep 5
done

echo "$RED====================== Démarrage des services ======================$RESET"

echo "docker compose --file $DOCKER_COMPOSE_FILE up -d"
docker compose --file "$DOCKER_COMPOSE_FILE" up -d

# Link the services to their log file
echo "Lien des services avec leur fichier de log"
for service in "${SERVICES[@]}"; do
  docker compose --file "$DOCKER_COMPOSE_FILE" logs -f "$service" > "logs/${service}.log" &
done
