# Metadata Analyzer UI

## Runing With Docker

Pull the current main-branch build from Dockerhub and start a Docker container, listening on port 3010:
```bash
# pull the image (if needed) and start the container
$ docker-compose up
```

## Building And Running With Docker

Build and start a Docker container, listening on port 3010:
```bash
# install dependencies
$ npm install

# build the project
$ npm run build

# build the image (if needed) and start the container
$ docker-compose -f docker-compose.dev.yml up --build
```

## Running on Host (Without Docker)

```bash
# install dependencies
$ npm install
```
Choose one:
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run build
$ npm run start:prod
```