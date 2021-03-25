#Aqui le digo que version de node voy a ocupar y la descarga
FROM node:14

#Aqui le digo a docker donde va a estar trabajando mi container
WORKDIR /usr/src/app  
                        # también puede ser/opt/app
                        # esta dirección no es en mi compu, sino en el contenedor de docker

# copio el package json y el package-lock.json y los va a pegar en ./
COPY package*.json ./   
                        # ./ es la carpeta donde va a estar tarbajando docker
                        # primero muevo estos archivos porque tienen las dependencias que mi programa necesita

# aquí instalo todas las dependencias de mi proyecto
RUN npm install         

# voy a copiar el resto de los archivos al WORKDIR 
COPY . . 
         # sin embargo no se debe copiar el node_modules, ya que este se genera cuando se ejecuta el npm install
        # dependiendo del s.o.
        # se le debe decir que se ignore, haciendo un .dockerignore

# expon el puerto para que te puedas conectar
EXPOSE 3000 
            # esto es abrir el puerto

# ejecuta el comando node server.js como si lo escribiéramos en la consola
CMD ["node", "server.js"]   
# entrypoint - es la linea principal que ejecuta el container