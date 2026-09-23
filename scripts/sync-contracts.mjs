import { copyFileSync, mkdirSync } from 'node:fs';
mkdirSync('src/contracts', { recursive: true });
copyFileSync('../simulado-backend/src/contracts.ts', 'src/contracts/index.ts');
console.log('contracts sincronizado a partir do backend');