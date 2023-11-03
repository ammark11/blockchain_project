FROM node:18

WORKDIR /app

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 3000

CMD ["node", "start"]