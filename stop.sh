#!/bin/sh

docker compose --file docker-compose-kafka.yaml \
                --file docker-compose.yaml \
                down