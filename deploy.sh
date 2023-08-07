#!/bin/bash
echo "Pull latest commit"
git pull

echo "Pull latest from registry"
docker pull registry.digitalocean.com/so-thai/yoyo-api:latest

echo "Build new image"
docker compose up -d --build --force-recreate prod

echo "Clearing cache"
docker system prune -f


echo "Done"
