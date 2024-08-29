#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

const platform = os.platform();
const scriptPathPowershell = path.join(__dirname, 'setup-ts-project.ps1');
const scriptPathBash = path.join(__dirname, 'setup-ts-project.sh');
const projectNameFilePath = path.join(__dirname, 'project_name.txt');

try {
    // Run the setup script based on the platform
    if (platform === 'win32') {
        execSync(`powershell.exe -File "${scriptPathPowershell}"`, { stdio: 'inherit' });
    } else {
        const result = spawnSync('bash', [scriptPathBash], { stdio: 'inherit' });

        if (result.error) {
            throw result.error;
        }
        if (result.status !== 0) {
            throw new Error(`Bash script failed with status code: ${result.status}`);
        }
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
