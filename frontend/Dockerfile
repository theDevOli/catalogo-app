FROM node

WORKDIR /app

# Copy package.json and install dependencies
COPY ./package.json /app
RUN npm install

# Copy the rest of the application code
COPY . /app

# Build the frontend assets
RUN npm run build

# Expose the port on which the app will be served
EXPOSE 5173

# Ensure the process remains active by using ENTRYPOINT
CMD [ "npm", "run", "dev" ]