FROM node:18-alpine

WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p /app/logs

# Expose the port your app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm","start"]