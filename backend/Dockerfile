FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Prisma schema
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy app source
COPY . .

# Build and run
RUN npm run start:build
# RUN npm run start:run
EXPOSE 3000
CMD ["npm", "start"]