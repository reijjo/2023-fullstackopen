FROM node:16

WORKDIR /usr/src/app

COPY --chown=node:node . .
RUN npm ci

ENV DEBUG=2023-fullstackopen-osa12:*

USER node
CMD npm start