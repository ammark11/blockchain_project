FROM node:18

WORKDIR /app

COPY package.json /app

RUN npm install

EXPOSE 5000

CMD npm start && python node.py