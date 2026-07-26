FROM node:22-alpine
RUN apk add --no-cache vips-dev fftw-dev gcc g++ make python3
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3001
CMD ["node", "server.js"]
