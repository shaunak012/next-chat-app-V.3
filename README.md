# Setup

## Linux

```bash
npm i pm2 -g
source ./deploy.sh
```

## Windows

```bash
npm i pm2 -g
cd backend
yarn install
pm2 start yarn --interpreter bash --name api -- start
cd ..
cd ..
cd frontend 
yarn install
yarn build
pm2 start yarn --interpreter bash --name api -- start
cd ..
cd ..
```

sorry i haven't learned how to write a script in windows 

# About

Frontend is on [http://localhost:3000](http://localhost:3000) for both windows and linux  
Backend is on [http://localhost:4000](http://localhost:4000)  for both windows and linux  

1. Frontend is in nextjs using recoil and socket.io  
2. Backend is a socket.io server
3. Backend currently does not have a database(mongodb)
4. This is currently deployed on [shaunak.online](https://shaunak.online) (currently this is down)
5. This is currently deployed using Google compute engine
6. This is my first proper project any feedback will be appreciated on <shaunak023@gmail.com>
