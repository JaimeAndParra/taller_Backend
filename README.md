## Configuracion inicial del proyecto
---

1. El primer paso es crear el *package.json*, a partir del comando **npm init** 
2. Se debe instalar TypeScript con el comando **npm install typescript**
3. Se instalan las dependencias como typescript, express, ts-node --save-dev, @types/express
4. Crear un *tsconfig.json* utilizando **npx tsc --init**. Se deve activar la opcion **outDir** y definir la carpeta que contiene el archivo main (*app.ts*)
5. Se ejecuta el programa con **npx ts-node src/app.ts**
6. Para hacer el commit se debe ignorar la carpeta node_modules
7. Para las migraciones se debe instalar la dependencia del ORM **npm install knex knex-cli pg --save-dev**
8. Para leer variables de entorno se utiliza la libreria **dotenv** con **npm install dotenv --save-dev**
9. Para correr las migraciones se utiliza el comando **npx knex migrate:latest --knexfile src/db/knexfile.ts**
10. Se utiliza winston para el control de los loggs **npm install winston --save**. Se crea en la carpeta util ya que es utilizable por todos los servicios del programa, y así, es posible reutilizarlo.


### Pruebas unitarias

1. Se utiliza la libreria chai. **npm install --save-dev  chai chai-http chai-spies @types/chai @types/chai-http @types/chai-spies**
2. Jest permite ejecutar las pruebas **npm install --save-dev jest ts-jest @types/jest**
3. Las pruebas unitarias con jest se ejecutan como **npm jest**