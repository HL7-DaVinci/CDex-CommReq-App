FROM node:22-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package.json package-lock.json ./
# USER node
RUN npm install
# COPY --chown=node:node . .
COPY . .
EXPOSE 9090
CMD [ "npm", "start" ]
