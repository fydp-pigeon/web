# Dockerfile
# Use an official Node runtime as the base image
FROM node:alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed packages specified in package.json
RUN npm install

# Bundle the app source inside the Docker image 
COPY . .

# Make port 3000 available to the outside world
RUN npm run build

EXPOSE 3000

# Define the command to run the app
CMD ["npm", "run", "start"]
