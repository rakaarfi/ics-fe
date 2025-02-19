FROM node:22.12.0-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm i

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
