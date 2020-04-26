## Set up server dev environment ##

### Set up mongo database ###
Run the commands:

`docker pull mongo`

`docker run -d -p 27017:27107 --name mongodb mongo -v /data/db:/data/db`

### Add the env file ###
Add a .env file in `/server/` with the following content:

```
NODE_ENV=debug
PORT=4000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=flat-app
```

### Start the server ###
Run the commands

`cd /server/`

`npm start`

View the APIs by accessing `localhost:4000/`

## Viewing the database ##
1. Install MongoDB Compass Community [https://www.mongodb.com/download-center/community]
2. Connect to 0.0.0.0:27017