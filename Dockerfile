FROM oven/bun:latest

WORKDIR /app

COPY package.json bun.lockb ./
RUN bun install

COPY . .

RUN bun run build

EXPOSE 80

CMD ["bun", "run", "preview", "--", "--host", "0.0.0.0", "--port", "80"]


# With Nginx
# # Stage 1: Build the Vite app
# FROM oven/bun:latest AS builder

# WORKDIR /app
# COPY package.json bun.lockb ./
# RUN bun install
# COPY . .
# RUN bun run build

# # Stage 2: Serve with Nginx
# FROM nginx:alpine

# # Copy Nginx configuration
# COPY nginx.conf /etc/nginx/nginx.conf

# # Copy built assets from the builder stage to Nginx's default location
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
