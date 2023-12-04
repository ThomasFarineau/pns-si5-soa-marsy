#!/bin/bash

# Définir le répertoire des services
services_dir="../services/"

# Vérifier si un argument est fourni
if [ $# -eq 0 ]; then
    echo "Aucun nom de service fourni"
    exit 1
fi

# Récupérer le premier argument comme nom du service
service_name="$1"

# Copier le répertoire du template
cp -r ./template ./temp

# Remplacer 'template' par le nom du service en minuscules dans package.json et logger.js
sed -i "s/template/${service_name,,}/g" ./temp/package.json
sed -i "s/template/${service_name,,}/g" ./temp/src/utils/logger.js

# Remplacer 'template' par le nom du service (cas d'origine) dans app.js
sed -i "s/Template/$service_name/g" ./temp/src/app.js

# Renommer le répertoire du template dans le répertoire des services
mv ./temp "$services_dir/${service_name,,}"