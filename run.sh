#!/bin/bash

DOCKER_COMPOSE_FILE="./services/docker-compose.yaml"

# Declare api url variables
WEATHER_API_URL="http://localhost:3000/api"
ROCKETSTATUS_API_URL="http://localhost:3001/api"
MISSIONCONTROL_API_URL="http://localhost:3002/api"
ROCKETDEPARTMENT_API_URL="http://localhost:3003/api"
CUSTOMERCARGO_API_URL="http://localhost:3004/api"
ROCKET_API_URL="http://localhost:3005/api"
CREW_API_URL="http://localhost:3010/api"

# Declare readable url variables
WEATHER_URL="http://weather/api"
ROCKETSTATUS_URL="http://rocketstatus/api"
MISSIONCONTROL_URL="http://missioncontrol/api"
ROCKETDEPARTMENT_URL="http://rocketdepartment/api"
CUSTOMERCARGO_URL="http://customercargo/api"
ROCKET_URL="http://rocket/api"
CREW_URL="http://crew/api"

echo "====================== Gestion des astronautes ======================"
echo "Crew : Ajout de 10 astronautes"
# Définition des données des astronautes
astronauts=(
  '{"firstName":"Marie","lastName":"Dupont","dateOfBirth":"1985-07-12","gender":"Féminin","skills":["ingénieur","physique"],"missionTypes":["exploration","orbit"]}'
  '{"firstName":"John","lastName":"Smith","dateOfBirth":"1982-03-05","gender":"Masculin","skills":["docteur","mathématique"],"missionTypes":["orbit"]}'
  '{"firstName":"Emma","lastName":"Leclair","dateOfBirth":"1990-05-22","gender":"Féminin","skills":["ingénieur","informatique"],"missionTypes":["exploration"]}'
  '{"firstName":"David","lastName":"Johnson","dateOfBirth":"1978-11-16","gender":"Masculin","skills":["ingénieur","botanique"],"missionTypes":["exploration","orbit"]}'
  '{"firstName":"Laura","lastName":"Martin","dateOfBirth":"1983-09-30","gender":"Féminin","skills":["docteur","mécanique"],"missionTypes":["orbit"]}'
  '{"firstName":"Thomas","lastName":"Brown","dateOfBirth":"1975-12-20","gender":"Masculin","skills":["ingénieur","physique"],"missionTypes":["exploration"]}'
  '{"firstName":"Sarah","lastName":"Bernard","dateOfBirth":"1988-04-14","gender":"Féminin","skills":["docteur","mathématique"],"missionTypes":["orbit"]}'
  '{"firstName":"Richard","lastName":"Wilson","dateOfBirth":"1980-02-28","gender":"Masculin","skills":["ingénieur","docteur", "physique", "mécanique"],"missionTypes":["exploration","orbit"]}'
  '{"firstName":"Julie","lastName":"Davis","dateOfBirth":"1986-08-19","gender":"Féminin","skills":["ingénieur","entomologie"],"missionTypes":["exploration"]}'
  '{"firstName":"Alex","lastName":"Moore","dateOfBirth":"1991-01-05","gender":"Masculin","skills":["docteur","informatique"],"missionTypes":["orbit"]}'
)

# Boucle pour envoyer chaque astronaute
for astronaut in "${astronauts[@]}"
do
  curl -s -X POST "$CREW_API_URL/add" \
    -H "Content-Type: application/json" \
    -d "$astronaut"
  echo ""
done

echo "Crew : Selection de 3 astronautes selon les critères ingénieur, mathématique, physique et botanique pour une mission d'exploration"
curl -X GET "$CREW_API_URL/select/3?skills=ingénieur,mathématique,physique,botanique&missionTypes=exploration"
echo ""
echo "----------------------"
echo ""
sleep 2

# Start the launching process
echo "====================== Phase de préparation du lancement ======================"
echo "MissionControl : Vérification de la météo et du statut de la fusée."

# Call the Weather service
echo "Weather Service: Appel de l'API météo"
echo "-- curl : $WEATHER_URL/launch-readiness"
curl "$WEATHER_API_URL/launch-readiness"
echo ""
echo "----------------------"
echo ""
sleep 2

# Call the Rocket status service
echo "Rocketstatus Service: Appel de l'API rocketstatus"
echo "RocketStatus a pour but de vérifier si les données du chargement de la fusée "
echo "concordent avec les données attendues par le service customercargo."
echo ""
sleep 2

# Call the Customer cargo service
echo "CustomerCargo Service: Appel de l'API customercargo"
echo "Données attendues par le service customercargo :"
echo "-- curl : $CUSTOMERCARGO_URL/expected-data"
curl "$CUSTOMERCARGO_API_URL/expected-data"
echo ""
echo "----------------------"
echo ""
sleep 2

# Call the Rocket service
echo "Rocket Service: Appel de l'API rocket"
echo "Données enregistrées par le service rocket :"
echo "-- curl : $ROCKET_URL/payload"
curl "$ROCKET_API_URL/payload"
echo ""
echo "----------------------"
echo ""
sleep 2

# Check the rocket status NO GO
echo "On voit ici que les services n'ont pas encore les données de vol"
echo "Par conséquent, le service rocketstatus renvoie un NO GO"
echo "-- curl : $ROCKETSTATUS_URL/launch-readiness"
curl "$ROCKETSTATUS_API_URL/launch-readiness"
echo ""
echo "----------------------"
echo ""
sleep 2

# Set the customer cargo data
echo "CustomerCargo Service: Envoie des données de vol"
echo "-- curl : $CUSTOMERCARGO_URL/set-data"
curl -X POST -H "Content-Type: application/json" -d '{"trajectory": "Orbite", "altitude": 180000, "payload": "Satellite MarsY_1"}' "$CUSTOMERCARGO_API_URL/set-data"
echo ""
echo "----------------------"
echo ""
sleep 2

# Check customercargo data
echo "On voit ici que le service customercargo a maintenant les données de vol"
echo "-- curl : $CUSTOMERCARGO_URL/expected-data"
curl "$CUSTOMERCARGO_API_URL/expected-data"
echo ""
echo "----------------------"
echo ""
sleep 2

# Check the rocket data
echo "On voit ici que le service rocket a maintenant les données de vol"
echo "-- curl : $ROCKET_URL/payload"
curl "$ROCKET_API_URL/payload"
echo ""
echo "----------------------"
echo ""
sleep 2

# Check the rocket status GO
echo "Le service rocketstatus renvoie maintenant un GO"
echo "-- curl : $ROCKETSTATUS_URL/launch-readiness"
curl "$ROCKETSTATUS_API_URL/launch-readiness"
echo ""
echo "----------------------"
echo ""
sleep 2

# End of the preparation phase
echo "====================== Phase de préparation du lancement terminé ======================"
echo "====================== Phase de lancement ======================"

# Check launch readiness
echo "Le service missioncontrol renvoie maintenant un GO"
echo "-- curl : $MISSIONCONTROL_URL/launch-readiness"
curl "$MISSIONCONTROL_API_URL/launch-readiness"
echo ""
echo "----------------------"
sleep 2

# Launch the rocket
echo "La mission est lancée, suivons les logs"

# Check the logs of the services
timeout 3m docker compose -f $DOCKER_COMPOSE_FILE logs --tail=10 --follow

echo "On reset la fusée"
curl -X POST "$MISSIONCONTROL_API_URL/reset"
sleep 2

echo "On reset les data"
curl -X POST -H "Content-Type: application/json" -d '{"trajectory": "Orbite", "altitude": 180000, "payload": "Satellite MarsY_2"}' "$CUSTOMERCARGO_API_URL/set-data"
sleep 2

echo "On prépare les anomalies"
curl -X POST "$ROCKETSTATUS_API_URL/telemetry/rocket/set-anomaly"
sleep 2

echo "On prépare l'anomalie critique"
curl -X POST "$ROCKET_API_URL/set-anomaly"
sleep 2

echo "On relance la mission"
curl "$MISSIONCONTROL_API_URL/launch-readiness"

timeout 3m docker compose -f $DOCKER_COMPOSE_FILE logs --tail=10 --follow

# Delete the tmp log file
echo "Suppression des fichiers de log temporaire"
rm -rf logs