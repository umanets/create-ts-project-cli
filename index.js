#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const platform = os.platform();
const scriptPath = path.join(__dirname, 'setup-ts-project.ps1');
const projectNameFilePath = path.join(__dirname, 'project_name.txt');

try {
    // Run the setup script based on the platform
    if (platform === 'win32') {
        execSync(`powershell.exe -File "${scriptPath}"`, { stdio: 'inherit' });
    } else {
        execSync('bash setup-ts-project.sh', { stdio: 'inherit' });
    }

    const projectName = fs.readFileSync(projectNameFilePath, 'utf8').trim();
    fs.unlinkSync(projectNameFilePath);
    console.log(`Project directory created: ${projectName}`);
    console.log(`Navigating to ${projectName} and starting the development server with nodemon and ts-node...`);
    execSync(`cd ${projectName} && npx nodemon --exec ts-node ./src/index.ts`, { stdio: 'inherit' });
} catch (error) {
    console.error('Error occurred during setup or execution:', error);
    process.exit(1);
}
