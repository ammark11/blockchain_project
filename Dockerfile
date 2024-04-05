
FROM python:3.8-slim


WORKDIR /app


COPY . /app

WORKDIR /app/server
COPY requirements.txt /app/server/requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt



CMD ["python", "./server/node.py"]


WORKDIR /app

FROM node:14

WORKDIR /app/client


COPY ./client /app/client

RUN npm install
CMD ["npm", "start"]
