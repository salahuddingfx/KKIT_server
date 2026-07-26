FROM node:22-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source code
COPY . .

# Create uploads directory structure
RUN mkdir -p public/uploads/users public/uploads/courses public/uploads/team public/uploads/blogs public/uploads/payments public/uploads/portfolio public/uploads/others

EXPOSE 5000

ENV NODE_ENV=production
ENV PORT=5000

CMD ["node", "server.js"]
