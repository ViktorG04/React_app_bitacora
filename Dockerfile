#version de node
FROM node:14-alpine3.14

#crear una carpeta app
RUN mkdir -p /app

#creamos una carpeta en el contenedor donde va estar los archivos de la app
WORKDIR /app

# copiamos los dos archivos package.json
COPY package*.json ./

#copiar los archivos del repositorio
COPY . .

ENV REACT_APP_BACKEND_URL=

#instalar las dependencias requeridas
RUN npm install

#instalar servidor serve
RUN npm i -g serve

#compilar proyecto
RUN npm run build

#correr el build
CMD ["serve", "-s", "build"]