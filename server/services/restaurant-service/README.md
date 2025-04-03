# Restaurant Service

Service de gestion des restaurants pour CESI Eat.

## Configuration

Créer un fichier `.env` à la racine du projet avec les variables suivantes :

```
# Port du serveur
PORT=3002

# Configuration MySQL
DB_HOST=mysql
DB_PORT=3306
DB_NAME=cesi_eat
DB_USER=root
DB_PASSWORD=password

# Configuration RabbitMQ
RABBITMQ_URI=amqp://guest:guest@rabbitmq:5672

# JWT Secret pour l'authentification
JWT_SECRET=your_secret_key
```

## Initialisation de la base de données

Pour initialiser la base de données avec des données de test :

```bash
# Attendre que la base de données soit accessible
npm run db:wait

# Initialiser la base de données avec des données de test
npm run db:init
```

Le script `db:wait` vérifie si la base de données est accessible et la crée si elle n'existe pas.
Le script `db:init` exécute le fichier `migrations/migration.sql` pour peupler les tables avec des exemples de restaurants et de plats.

## Démarrage du service

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Démarrer en mode production
npm start
```

## Docker

Pour exécuter le service avec Docker :

```bash
docker build -t cesi-eat/restaurant-service .
docker run -p 3002:3002 --env-file .env cesi-eat/restaurant-service
```

Le conteneur Docker utilisera automatiquement le script `docker-entrypoint.sh` qui :
1. Attend que la base de données soit accessible
2. Initialise la base de données avec des données de test
3. Démarre le service

Pour initialiser la base de données manuellement depuis le conteneur Docker :

```bash
docker exec -it <container_id> npm run db:init
``` 