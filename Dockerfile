# Builder stage.
# This state compiles our TypeScript to get the JavaScript code
#
FROM node:16.15.1 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./.env
COPY  ./src ./src
RUN npm i --quiet && npm run build

#
# Production stage.
# This state compile get back the JavaScript code from builder stage
# It will also install the production package only
#
FROM node:16.15.1-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm i --quiet --only=production

## We just need the build to execute the command
COPY --from=builder /usr/src/app/dist ./dist

CMD [ "node", "./dist/index.js" ]