#!/bin/bash

# Deployment script for library application with Railway database

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Step 1: Pull latest changes from repository
echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull

# Step 2: Verify environment variables
echo -e "${YELLOW}Verifying environment variables...${NC}"
if [ ! -f ".env" ]; then
  echo -e "${RED}Error: .env file not found!${NC}"
  exit 1
fi

# Check for required railway DB variables
required_vars=("DB_HOST" "DB_PORT" "DB_USER" "DB_PASSWORD" "DB_NAME")
missing_vars=0

for var in "${required_vars[@]}"; do
  if ! grep -q "${var}" .env; then
    echo -e "${RED}Error: ${var} is missing from .env file${NC}"
    missing_vars=$((missing_vars+1))
  fi
done

if [ $missing_vars -gt 0 ]; then
  echo -e "${RED}Missing required environment variables. Please fix and try again.${NC}"
  exit 1
fi

# Step 3: Build containers
echo -e "${YELLOW}Building Docker containers...${NC}"
docker-compose build

# Step 4: Stop and remove existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down

# Step 5: Start containers
echo -e "${YELLOW}Starting containers...${NC}"
docker-compose up -d

# Step 6: Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
sleep 5 # Wait for containers to initialize

# Check if containers are running
if docker-compose ps | grep -q "Up"; then
  echo -e "${GREEN}Containers started successfully!${NC}"
else
  echo -e "${RED}Deployment failed. Containers are not running.${NC}"
  docker-compose logs
  exit 1
fi

# Check if backend is accessible
echo -e "${YELLOW}Checking backend API...${NC}"
if curl -s --max-time 5 http://localhost/api/health | grep -q "UP"; then
  echo -e "${GREEN}Backend API is accessible!${NC}"
else
  echo -e "${RED}Backend API is not responding.${NC}"
  echo -e "${YELLOW}Showing backend logs:${NC}"
  docker-compose logs backend
fi

# Check if frontend is accessible
echo -e "${YELLOW}Checking frontend...${NC}"
if curl -s --max-time 5 -I http://localhost | grep -q "200 OK"; then
  echo -e "${GREEN}Frontend is accessible!${NC}"
else
  echo -e "${RED}Frontend is not responding.${NC}"
  echo -e "${YELLOW}Showing frontend logs:${NC}"
  docker-compose logs frontend
fi

# Display running containers
echo -e "${YELLOW}Running containers:${NC}"
docker-compose ps

echo -e "${GREEN}Deployment process completed!${NC}"
echo -e "${GREEN}Frontend: http://localhost:80${NC}"
echo -e "${GREEN}Backend API: http://localhost/api${NC}"
echo -e "${GREEN}Using Railway Database: ${DB_HOST}:${DB_PORT}${NC}"