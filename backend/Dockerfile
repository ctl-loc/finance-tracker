#Build the application
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# Serve the app
FROM node:16-alpine AS production

WORKDIR /app

COPY package*.json .
RUN npm ci --only=production

COPY --from=build /app/dist ./dist

EXPOSE 5000
CMD ["node", "dist/server.js"]
