docker build -t todo-back . &&
docker compose -f docker-compose.dev.yml up -d &&
REDIS_URL=redis://localhost:6379 MONGO_URL=mongodb://the_username:the_password@localhost:3456/the_database npm run dev