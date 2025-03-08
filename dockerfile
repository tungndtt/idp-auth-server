FROM node:20

WORKDIR /server

COPY package*.json ./
COPY tsconfig.ts ./
COPY src ./

RUN npm install
RUN npm run build

CMD ["npm", "start"]
