# g10-backend

This is the backend application for group 10 in 4474: Human computer interaction.

## Requirements
- docker engine
- docker compose

Follow the instructions here on how to install docker if not already installed: https://docs.docker.com/engine/install/

Follow the instructions here to install docker compose: https://docs.docker.com/compose/install/linux/ 

## Getting Started
1. Clone this repository 
```
git clone  git@github.com:uwohci23/g10-backend.git
```
2. go into the directory
```
cd g10-backend
```
3. build and run the container
```
docker compose up --build
```

The backend application is set to run on localhost:5000

Now you can run the frontend at: https://github.com/uwohci23/g10-frontend/


## Manager Credentials
| Username | Password | 
| :---: | :---: | 
| sawyerh  | password |
| aryam  | password |

The database will be going offline on April 30 2023. A database dump is provided in postgresdb. Change the env file to match your new db.


