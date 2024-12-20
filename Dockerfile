# Base image with Python
FROM python:3.8-slim

# Set up server
WORKDIR /app/server
COPY ./server /app/server
COPY ./server/requirements.txt /app/server/requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Install Node.js (using version 18)
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# Set up client
WORKDIR /app/client
COPY ./client /app/client
ENV NPM_CONFIG_IGNORE_SCRIPTS=true
RUN npm install --legacy-peer-deps

# Expose both ports
EXPOSE 5000
EXPOSE 3000

# Run both server and client with a single command
CMD ["sh", "-c", "python /app/server/node.py & npm start --prefix /app/client"]
