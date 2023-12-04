#!/bin/bash

services_dir="../services/"

services=("customercargo" "missioncontrol" "rocket" "rocketdepartment" "rocketstatus" "weather" "booster" "payload" "logger" "streaming")

for service in "${services[@]}"; do
    if [ -d "$services_dir$service" ]; then
        echo "=================== Exécution de npm install dans $service ==================="
        (cd "$services_dir$service" && npm install --silent)
    else
        echo "Le service $service n'existe pas"
    fi
done

for service in "${services[@]}"; do
    if [ -d "$services_dir$service" ]; then
        echo "=================== Exécution de npm install dans $service ==================="
        (cd "$services_dir$service" && (npm run dev &))
    else
        echo "Le service $service n'existe pas"
    fi
done

wait
