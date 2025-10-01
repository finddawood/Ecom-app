# Lightweight Node image
FROM node:18-alpine

WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./
RUN npm install --production

# copy project (views and public are outside backend)
COPY backend ./backend
COPY frontend ./frontend
ENV PORT=3000
WORKDIR /app/backend

EXPOSE 3000
CMD ["node", "server.js"]
