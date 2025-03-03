FROM node:22.12.0-alpine
# FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install
# RUN bun install

# Copy the rest of the application
COPY . .

# Build the Next.js app
# RUN npm run build
RUN bun run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
# CMD ["bun", "run", "start"]
