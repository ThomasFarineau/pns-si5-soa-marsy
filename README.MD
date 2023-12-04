# Groupe E

# Description du projet

Attention à l'encodage des sauts de ligne qui se met automatiquement en CRLF par Github (malgré le .gitattributes), il est possible qu'il faille repasser les fichiers.sh en format Unix LF.

Le passage d'un scénario au suivant se fait automatiquement avec un système de `timeout` (précédemment on pouvait CTRL C pour passer d'un scénario à l'autre mais cela a arrêté de fonctionner du jour au lendemain donc nous nous sommes rabattus sur un timeout).

1. **Début du processus de lancement :**
   - La phase de préparation du lancement est introduite.
   - Les disponibilités de lancement sont vérifiées auprès des services météo et "Rocketstatus".
   - Les données attendues par le service "customercargo" sont affichées, tout comme les données actuellement enregistrées par le service "rocket".
   - Il est montré que les données de vol ne sont pas encore disponibles, donnant un statut "NO GO" pour le lancement.
   - Des données de vol sont ensuite envoyées au service "customercargo", et les services "customercargo" et "rocket" mettent à jour leurs informations. Le service "rocketstatus" indique finalement un statut de lancement "GO".
2. **Fin de la phase de préparation et début de la phase de lancement :**
    - La disponibilité au lancement est vérifiée auprès du service "missioncontrol", qui renvoie un statut "GO".
    - La mission est déclarée lancée, invitant l'utilisateur à suivre les journaux (logs) des services.
    - Les logs sont affiché via le service "Logger"
    - La Rocket envoie ses données à Rocket Status afin de les enregistrer dans une base de données.
    - Le booster envoie son niveau de fuel à Rocket Status qui le renvoie au Rocket-Department, lui permettrant de donner l'ordre à la Rocket de split le Booster lorsqu'il n'a plus de fuel.
    - De là, le Booster envoie ses données à Rocket Status pour les enregistrer dans la base de données.
    - Lorsque la Rocket a atteint sa destination, elle envoie l'information que la mission est terminée et split donc le Payload.
    - De là, le Payload va envoyer ses données à Rocket Status pour les enregistrer dans la base de données.
3. **Lancement d'une deuxième fusée qui va faire face à des anomalies :**
    - Mise en place des anomalies dans le service Rocket.
    - Lancement de la fusée.
    - On suit les logs comme précédemment.
    - On voit toujours les logs du payload telemetry car on a relancé une nouvelle mission mais le précédent payload existe toujours.
    - On a des légères anomalies détectées par le Rocket Status et transmises au Rocket Department.
    - On voit que la fusée s'auto-détruit suite à une anomalie critique.
    - Le booster étant déjà détaché, il retourne sur terre de son côté.


# Répartition des points

| Léo | Thomas | Mohamed | Ludovic |
|-----|--------|---------|---------|
| 115 | 115    | 90      | 80      |
