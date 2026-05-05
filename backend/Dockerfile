FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN NODE_OPTIONS="--max-old-space-size=2048" npm run build

CMD ["npm", "start"]