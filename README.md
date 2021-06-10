# Metadata Analyzer UI

## Configuration

Configuration is done via the file `.env` for all available setups.

## Run an Online Docker Image

Pull the current main-branch build from Dockerhub and start a Docker container, listening on port 3010:
```bash
# pull the image (optional)
$ docker-compose pull
# start the container
$ docker-compose up
```

## Build And Run a Local Docker Image

Build and start a Docker container, listening on port 3010:
```bash
# install dependencies
$ npm install

# build the project
$ npm run build

# build the image (if needed) and start the container
$ docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Run in Development Setup

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

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests (currently not used)
$ npm run test:e2e

# test coverage
$ npm run test:cov
```