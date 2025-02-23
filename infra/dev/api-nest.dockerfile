FROM node:20-bullseye-slim
RUN apt-get update && apt-get install -y procps

#ENV PNPM_HOME="/pnpm"
#ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
#ENV YARN_CACHE_FOLDER=/cache/yarn

WORKDIR /app

# install dependencies
COPY app/package.json ./
# api-nest/pnpm-lock.yaml ./
#RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install
RUN npm install
# copy app source
COPY app/ ./

RUN ls .

CMD ["npm", "run", "start:dev"]