# Base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/.next /usr/share/nginx/html

# Copy the public folder (if needed)
COPY --from=build /app/public /usr/share/nginx/html/public

# Copy nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
