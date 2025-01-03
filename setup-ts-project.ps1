Set-Location -Path (Get-Location) # Ensure script runs in the current directory
mkdir src -Force

npm init -y
npx tsc --init

# Create a basic index.ts file
"console.log('Hello, TypeScript with Node.js!');" | Out-File -Encoding utf8 src/index.ts

# Create a basic test file
"import { describe, it, expect } from '@jest/globals'; 
describe('Sample Test', () => { 
    it('should pass', () => { 
        expect(1 + 1).toBe(2); 
    }); 
});" | Out-File -Encoding utf8 src/index.test.ts

Write-Host "Project setup in the current directory has been completed successfully."
