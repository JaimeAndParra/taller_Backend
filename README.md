## Configuracion inicial del proyecto
---

1. El primer paso es crear el *package.json*, a partir del comando **npm init** 
2. Se debe instalar TypeScript con el comando **npm install typescript**
3. Se instalan las dependencias como typescript, express, ts-node --save-dev, @types/express
4. Crear un *tsconfig.json* utilizando **npx tsc --init**. Se deve activar la opcion **outDir** y definir la carpeta que contiene el archivo main (*app.ts*)
5. Se ejecuta el programa con **npx ts-node src/app.ts**
6. Para hacer el commit se debe ignorar la carpeta node_modules