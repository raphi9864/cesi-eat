FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Create necessary directories
RUN mkdir -p migrations scripts

# Make entrypoint script executable
RUN chmod +x docker-entrypoint.sh

EXPOSE 3002

# Use entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["npm", "start"]