FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY tsconfig.json ./
COPY src ./src
RUN npm install --no-save typescript && npx tsc && npm uninstall typescript
EXPOSE 4000
CMD ["node", "dist/app.js"]
