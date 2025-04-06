FROM node:16-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN chmod -R 755 node_modules/.bin/
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]