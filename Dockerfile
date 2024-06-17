FROM node:20-bookworm

RUN apt-get update
RUN apt-get install -y chromium

# Copy everything from your project to the Docker image. Adjust if needed.
COPY package.json package*.json yarn.lock* pnpm-lock.yaml* bun.lockb* tsconfig.json* remotion.config.* ./
COPY src ./src
COPY api ./api

# Install the right package manager and dependencies - see below for Yarn/PNPM
RUN corepack enable
RUN pnpm i

# Run your application
CMD ["pnpm", "start"]
