#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');

const platform = os.platform();
const scriptPath = path.join(__dirname, 'setup-ts-project.ps1');

try {
    // Run the setup script based on the platform
    if (platform === 'win32') {
        execSync(`powershell.exe -File "${scriptPath}"`, { stdio: 'inherit' });
    } else {
        execSync('bash setup-ts-project.sh', { stdio: 'inherit' });
    }

    // After setting up the project, start the development server
    console.log('Starting the development server with nodemon and ts-node...');
    execSync('npx nodemon --exec ts-node ./src/index.ts', { stdio: 'inherit' });

} catch (error) {
    console.error('Error occurred during setup or execution:', error);
    process.exit(1);
}
