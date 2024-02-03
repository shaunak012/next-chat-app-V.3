#!/bin/bash
export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v20.5.0/bincd backend
yarn install
cp .env.example .env
yarn build-linux
cd build 
pm2 kill
pm2 start server.js
cd ..
cd ..
cd frontend 
yarn install
yarn build
pm2 start "yarn start" --name nextserver
cd ..
cd ..
