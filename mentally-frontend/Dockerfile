# Use the official Node.js image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./mentally-frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project files into the container
COPY ./mentally-frontend /app

# Build the React app for production
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Serve the build using a static server
CMD ["npx", "serve", "build"]
