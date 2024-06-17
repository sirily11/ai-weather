FROM node:20-bookworm

RUN apt-get update
RUN apt-get install -y chromium

# Copy everything from your project to the Docker image. Adjust if needed.
COPY package.json package*.json yarn.lock* pnpm-lock.yaml* bun.lockb* tsconfig.json* remotion.config.* ./

# Install the right package manager and dependencies - see below for Yarn/PNPM
RUN corepack enable
RUN pnpm i

COPY api ./api
COPY src ./src
COPY public ./public

ENV LANG "en_US.UTF-8"
ENV LC_ALL "en_US.UTF-8"

# Run your application
CMD ["pnpm", "start"]
