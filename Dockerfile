# 1. Pick a base image — Node 20, since that's what the CI pipeline actually
#    uses in production (nvm use 20).
FROM node:20

# 2. Set a working directory inside the container (same idea as WORKDIR /app
#    in the .NET Dockerfiles).
WORKDIR "/app"

# 3. Copy ONLY the two package files first — not the whole project yet.
#    This is the caching trick discussed: installing dependencies is slow,
#    editing source code is frequent, so we want code changes to NOT
#    invalidate the (cached) install step.
COPY package.json package-lock.json ./

# 4. Install dependencies. npm ci (not npm install) since a lockfile exists —
#    it installs exactly what's in the lockfile, no surprises.
RUN npm ci

# 5. NOW copy the rest of the source code (everything else in the repo).
COPY "src" "."

# 6. Tell Docker which port the app listens on. Check .env.sample.txt for
#    the default HTTP_PORT value.
EXPOSE 3000

# 7. The actual command that runs when the container starts.
#    Recall: skip PM2, run the entry point directly with plain `node`.
#    What was the entry point file we found earlier?
CMD ["node", "index.js"]