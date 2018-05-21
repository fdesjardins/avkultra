FROM node:9.4.0

WORKDIR /usr/app

COPY package.json .
RUN npm install --quiet
COPY . .

CMD [ "npm", "start" ]
