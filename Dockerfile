FROM node:16

RUN mkdir -p /server

WORKDIR /server

COPY package.json .

RUN npm install

COPY . .

ENV PORT=3333

EXPOSE 3333

CMD [ "npm", "start" ]