# be-waffle-shop Backend

This is the backend service for the be-waffle-shop application.

---

## Prerequisites

- [Node.js v22.20.0](https://nodejs.org/) (managed with [nvm](https://github.com/nvm-sh/nvm))
- [Docker](https://docs.docker.com/get-docker/) and **Docker Compose**

---

## Setup Instructions

1. **Initial setup:**

   This project uses Node.js version 22.20.0.

   Run the following commands to clone the repo, install Node, and install dependencies:

   ```bash
   git clone <repo-url> && cd be-waffle-shop && nvm install && nvm use && npm install && cp .env.example .env
   ```

2. **Run the backend:**

   ```bash
   bash ./local-start.sh
   ```
