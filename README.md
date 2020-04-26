## Set up server dev environment ##

### Set up mongo database ###
Run the commands:

`docker pull bitnami/mongodb`

`docker run -d --name <name> bitnami/mongodb`

### Add the env file ###
Add a .env file in `/server/` with the following content:

```
NODE_ENV=debug
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=flat-app
```

### Start the server ###
Run the commands

`cd /server/`

`npm start`

View the APIs by accessing `localhost:4000/`

## Viewing the database ##
1. Install MongoDB Compass Community [https://www.mongodb.com/download-center/compass]
2. Connect to 127.0.0.1:27017