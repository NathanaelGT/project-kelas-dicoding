# Gunakan image Node.js resmi
FROM node:22.11.0

# Tetapkan direktori kerja
WORKDIR /app

# Salin file package
COPY package*.json .

# Instal dependensi
RUN npm install --production

# Salin seluruh kode proyek
COPY . .

# Expose port
EXPOSE 8080

# Perintah menjalankan aplikasi
CMD ["npm", "start"]