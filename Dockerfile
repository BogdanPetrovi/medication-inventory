FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./

RUN npm install

COPY prisma ./prisma/
COPY src ./src/
COPY prisma.config.ts ./prisma.config.ts

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
