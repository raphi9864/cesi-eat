# Étape de build
FROM node:18-alpine as build

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g react-scripts

# Copie du code source
COPY . .

# Construction de l'application React
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie des fichiers de build de l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 