FROM node:18

WORKDIR /app

COPY package.json /app

RUN npm install

# Add the 'build' script in package.json
RUN echo '{"scripts":{"build":"echo Build script"}}' > package.json

RUN npm run build

EXPOSE 3000

CMD npm start