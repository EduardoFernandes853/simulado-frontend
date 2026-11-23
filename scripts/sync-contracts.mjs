import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

mkdirSync('src/contracts', { recursive: true });
copyFileSync('../simulado-backend/src/contracts.ts', 'src/contracts/index.ts');
copyFileSync('../simulado-backend/src/domain/privacidade.ts', 'src/lib/privacidade.ts');

// o teste do backend usa os globais do Jest; no front entra o import do Vitest
const teste = readFileSync('../simulado-backend/src/domain/privacidade.test.ts', 'utf8');
writeFileSync('src/lib/privacidade.test.ts', `import { describe, expect, it } from 'vitest';\n${teste}`);
console.log('contratos e privacidade sincronizados a partir do backend');