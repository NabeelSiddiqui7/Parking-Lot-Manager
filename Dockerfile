# Build stage
FROM node:18-alpine as build-stage

WORKDIR /app
COPY . /app

EXPOSE 5000

RUN npm install
RUN npm run build


# Production build stage
FROM node:18-alpine as production-build-stage

COPY package*.json ./
RUN npm install --omit=dev
COPY --from=build-stage /app/node_modules/.prisma/client /node_modules/.prisma/client
COPY --from=build-stage /app/dist ./dist

CMD ["node", "dist/server.js"]