#!/bin/bash

read -p "Enter the name of the project directory: " projectName
mkdir -p "$projectName/src"
cd "$projectName"
npm init -y
npm install --save-dev typescript @types/node nodemon ts-node
npx tsc --init
echo '{ "compilerOptions": { "target": "ES6", "module": "commonjs", "rootDir": "./src", "outDir": "./dist", "esModuleInterop": true, "strict": true }, "include": ["src/**/*"], "exclude": ["node_modules"] }' > tsconfig.json
echo "console.log('Hello, TypeScript with Node.js!');" > src/index.ts
echo "Project $projectName has been set up successfully."
cd ..
echo $projectName > "project_name.txt"