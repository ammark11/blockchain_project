
FROM python:3.8-slim


WORKDIR /app


COPY . /app

COPY requirements.txt /app/requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt


WORKDIR /app/server

CMD ["python", "./node.py"] &


WORKDIR /app

FROM node:14

WORKDIR /app/client


COPY ./client /app/client

RUN npm install
CMD ["npm", "start"]
