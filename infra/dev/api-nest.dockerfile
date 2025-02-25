FROM node:20-bullseye-slim
RUN apt-get update && apt-get install -y procps
RUN corepack enable

WORKDIR /app
COPY app/package.json ./
RUN npm install
COPY app/ ./

RUN ls .

CMD ["npm", "run", "start:dev"]