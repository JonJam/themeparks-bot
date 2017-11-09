# Production build requires "yarn build" to have been run.
FROM node:carbon

WORKDIR /app

COPY package.json yarn.lock ./

# Only installs non dev-dependencies.
RUN yarn install --only=production

COPY /dist ./dist

EXPOSE 8080

CMD [ "yarn", "run", "serve" ]