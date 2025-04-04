FROM node:18-alpine

WORKDIR /app

# Copier package.json et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier les scripts et les migrations d'abord pour garder un meilleur caching des layers
COPY scripts/ ./scripts/
COPY migrations/ ./migrations/
COPY .env ./

# Copier le reste du code source
COPY . .

# S'assurer que l'entrypoint est exécutable
RUN chmod +x docker-entrypoint.sh

EXPOSE 3002

# Utiliser le script d'entrypoint
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]