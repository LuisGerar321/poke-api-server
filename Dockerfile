# Use the official Node.js image from Docker Hub
FROM node:20.14

# Set the working directory inside the container
WORKDIR /app

# Copy the rest of the application codedocker-compose down
COPY . .
RUN npm install

# Expose the port on which your server is running
EXPOSE 3001

# Command to run your application with watch
CMD ["npm", "run", "dev"]
