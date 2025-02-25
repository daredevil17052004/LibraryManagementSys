#!/bin/bash

# Deployment script for library application

# Colors for terminal output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Step 1: Pull latest changes from repository
echo -e "${YELLOW}Pulling latest changes...${NC}"
git pull

# Step 2: Build containers
echo -e "${YELLOW}Building Docker containers...${NC}"
docker-compose build

# Step 3: Stop and remove existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose down

# Step 4: Start containers
echo -e "${YELLOW}Starting containers...${NC}"
docker-compose up -d

# Step 5: Verify deployment
echo -e "${YELLOW}Verifying deployment...${NC}"
if docker-compose ps | grep -q "Up"; then
  echo -e "${GREEN}Deployment successful!${NC}"
  echo -e "${GREEN}Frontend: http://localhost:80${NC}"
  echo -e "${GREEN}Backend: http://localhost:3000${NC}"
  echo -e "${GREEN}Database: localhost:3306${NC}"
else
  echo -e "${RED}Deployment failed. Check logs for details.${NC}"
  docker-compose logs
fi

# Display running containers
echo -e "${YELLOW}Running containers:${NC}"
docker-compose ps