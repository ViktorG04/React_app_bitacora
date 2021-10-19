#version de node
FROM node:14-alpine3.14 AS build-step

#crear una carpeta app
RUN mkdir -p /app

#creamos una carpeta en el contenedor donde va estar los archivos de la app
WORKDIR /app

# copiamos los dos archivos package.json
COPY package*.json ./

#copiar los archivos del repositorio
COPY . .

#instalar las dependencias requeridas
RUN npm install

#variable de entorno
ENV REACT_APP_BACKEND_URL=http://159.203.43.147:5000

#compilar proyecto
RUN npm run build

#imagen de nginx
FROM nginx:1.21.3-alpine

#copiamos la carpeta build en la ruta de nginx
COPY --from=build-step /app/build /usr/share/nginx/html
