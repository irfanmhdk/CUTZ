# Stage 1: Build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production menggunakan Nginx
FROM nginx:stable-alpine
# Hapus default config Nginx
RUN rm /etc/nginx/conf.d/default.conf
# Salin file konfigurasi custom kita (akan dibuat di langkah 4)
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Salin hasil build dari stage 1 ke folder statis Nginx
# Jika pakai Vite, foldernya 'dist'. Jika React lama, foldernya 'build'
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]