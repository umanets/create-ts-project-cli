#!/usr/bin/env node

const { execSync, spawnSync } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Function to prompt the user
const promptUser = async (message) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(message, (answer) => {
            rl.close();
            resolve(answer.toLowerCase());
        });
    });
};

(async () => {
    const currentDir = process.cwd();

    // Prompt the user for confirmation
    const confirmation = await promptUser(
        `This will bootstrap a TypeScript project in the current directory: ${currentDir}\nDo you want to continue? [y]/n: `
    );

    if (confirmation === 'n') {
        console.log('Operation cancelled by the user.');
        process.exit(0);
    }

    const browserSupport = await promptUser('Bootstrap for browser? y/[N]: ');

    try {
        const platform = os.platform();
        const scriptPathPowershell = path.join(__dirname, 'setup-ts-project.ps1');
        const scriptPathBash = path.join(__dirname, 'setup-ts-project.sh');
        const tsConfigTemplatePath = path.join(__dirname, 'tsconfig.template.json');
        const jestConfigPath = path.join(__dirname, 'jest.config.js');
        const vscodeLaunchPath = path.join(__dirname, 'launch.json');
        const vscodeDir = path.join(currentDir, '.vscode');

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

        // Add preconfigured files to the current directory
        if (!fs.existsSync(vscodeDir)) {
            fs.mkdirSync(vscodeDir, { recursive: true });
        }

        fs.copyFileSync(tsConfigTemplatePath, path.join(currentDir, 'tsconfig.json'));
        fs.copyFileSync(jestConfigPath, path.join(currentDir, 'jest.config.js'));
        fs.copyFileSync(vscodeLaunchPath, path.join(vscodeDir, 'launch.json'));

        console.log('Installing Jest dependencies...');
        execSync(`npm install --save-dev jest ts-jest @types/jest`, { stdio: 'inherit' });

        const srcDir = path.join(currentDir, 'src');
        if (!fs.existsSync(srcDir)) {
            fs.mkdirSync(srcDir);
        }

        if (browserSupport === 'y') {
            fs.writeFileSync(
                path.join(currentDir, 'index.html'),
                `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TypeScript Browser App</title>
    <style>
        canvas {
            border: 1px solid black;
            display: block;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <canvas id="canvas" width="800" height="800"></canvas>
    <div id="app">Hello World</div>
    <script type="module" src="/src/index.ts"></script>
</body>
</html>`
            );

            fs.writeFileSync(
                path.join(srcDir, 'index.ts'),
                `document.getElementById('app')!.textContent = 'Hello, TypeScript for Browser!';`
            );

            console.log('Installing browser-specific dependencies...');
            execSync(`npm install --save-dev typescript @types/node vite`, { stdio: 'inherit' });
        } else {
            execSync(`npm install --save-dev typescript @types/node nodemon ts-node`, { stdio: 'inherit' });
            // Node.js-specific setup
            fs.writeFileSync(
                path.join(srcDir, 'index.ts'),
                `console.log('Hello, TypeScript with Node.js!');`
            );
        }

        // Add "start" and "test" scripts to package.json
        const packageJsonPath = path.join(currentDir, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.scripts = {
            ...packageJson.scripts,
            start:
                browserSupport === 'y'
                    ? `vite`
                    : 'nodemon --exec ts-node src/index.ts',
            build:
                browserSupport === 'y'
                    ? `vite build`
                    : 'tsc',
            test: 'jest',
            debug: 'node --inspect-brk -r ts-node/register src/index.ts',
        };
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

        console.log(`TypeScript project setup completed in: ${currentDir}`);
    } catch (error) {
        console.error('Error occurred during setup or execution:', error);
        process.exit(1);
    }
})();
