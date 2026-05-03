FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# 🔥 BUILD STEP (VERY IMPORTANT)
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]