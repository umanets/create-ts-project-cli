#!/bin/bash

# Ensure the script operates in the current directory
mkdir -p src

# Initialize the project
npm init -y
npx tsc --init

# Create a basic index.ts file
echo "console.log('Hello, TypeScript with Node.js!');" > src/index.ts

# Create a basic test file
echo "import { describe, it, expect } from '@jest/globals';
describe('Sample Test', () => {
    it('should pass', () => {
        expect(1 + 1).toBe(2);
    });
});" > src/index.test.ts

echo "Project setup in the current directory has been completed successfully."
