# NestJS REST API Boilerplate Project with Prisma

## Install dependencies

```
npm install
```

## Run the application

```
docker-compose up // start database services with docker

npx prisma migrate deploy // deploy database schema

npm run start:dev // start the application in dev mode
```

## E2E test

```
npm run test:e2e
```

## API Documentation

```
http://localhost:3000/docs
```

## Features
- JWT authentication with refresh tokens
- Full CRUD API
- E2E testing
- Prisma integration with PostgreSQL
- Dockerized services
