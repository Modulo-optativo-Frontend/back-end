FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]


# 1️⃣ Imagen base oficial de Node.js (usa una versión estable LTS)
# 2️⃣ Directorio de trabajo dentro del contenedor
# 3️⃣ Copiamos los archivos de dependencias primero (para aprovechar la caché de Docker)
# 4️⃣ Instalamos las dependencias del proyecto
# 5️⃣ Copiamos el resto del código de la aplicación
# 6️⃣ Exponemos el puerto 3000

# 7️⃣ Comando por defecto para iniciar la API
