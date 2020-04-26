## Set up server dev environment ##

### Set up mongo database ###
Run the commands:

`docker pull bitnami/mongodb`

`docker run -d -p 27800:27017 --name mymongodb bitnami/mongodb`

### Add the env file ###
Add a .env file in `/server/` with the following content:

```
NODE_ENV=debug
PORT=4000
MONGODB_URI=mongodb://localhost:27800
MONGODB_DB=flat-app
```

### Start the server ###
Run the commands

`cd /server/`

`npm start`

View the APIs by accessing `localhost:4000/`

## Viewing the database ##
1. Install MongoDB Compass Community [https://www.mongodb.com/download-center/compass]
2. Connect to localhost:27800