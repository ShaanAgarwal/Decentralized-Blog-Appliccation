# Use a base image with Node.js pre-installed
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Truffle globally
RUN npm install -g truffle

# Install project dependencies
RUN npm install

# Copy the entire project directory to the working directory
COPY . .

# Expose port 8545 for connecting to Ganache (if needed)
EXPOSE 7545

# Run Truffle tests
CMD ["truffle", "test"]
