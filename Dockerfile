# Build image
# docker build -t node-master_js:v1.0 .

# Run container
# docker run -p 3901:3900 -d --name backend-node -it node-master_js:v1.0

# Image on Docker Hub
FROM node:alpine3.14

# Create a new app directory
WORKDIR /usr/src/app

# Copy project into defined WORKDIR
COPY package.json .

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose server listen port
EXPOSE 3000

# Start node app in development mode
CMD ["npm", "run" , "dev"]
