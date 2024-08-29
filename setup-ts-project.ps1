$projectName = Read-Host "Enter the name of the project directory"
mkdir $projectName
Set-Location $projectName
mkdir src
npm init -y
npm install --save-dev typescript @types/node nodemon ts-node
npx tsc --init
Write-Output '{ "compilerOptions": { "target": "ES6", "module": "commonjs", "rootDir": "./src", "outDir": "./dist", "esModuleInterop": true, "strict": true }, "include": ["src/**/*"], "exclude": ["node_modules"] }' | Out-File -Encoding utf8 tsconfig.json
"console.log('Hello, TypeScript with Node.js!');" | Out-File -Encoding utf8 src/index.ts
Write-Host "Project $projectName has been set up successfully."
