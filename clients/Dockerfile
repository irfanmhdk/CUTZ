FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .

# Ubah ke 4000 sesuai kode Express Anda
EXPOSE 4000

CMD ["node", "index.js"]