FROM node:18

WORKDIR /app

COPY package.json /app

RUN npm install

CMD npm start