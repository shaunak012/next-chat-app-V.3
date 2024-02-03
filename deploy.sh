cd backend
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
pm2 start yarn --interpreter bash --name api -- start
cd ..
cd ..
