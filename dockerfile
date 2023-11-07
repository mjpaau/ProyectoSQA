#Imagen oficial de Node.js como base
FROM node:16 

# Establecer el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copiar el archivo package.json y package-lock.json 
COPY package*.json ./ 

# Instalar dependencias del proyecto
RUN npm install

# Copiar al contenedor
COPY . .

EXPOSE 8282 

# Ejecutar tu aplicación
CMD [ "node", "app.js" ]
