export type Respostas = Record<string, string>;
export type Armazenamento = Pick<Storage, 'length' | 'key' | 'getItem' | 'setItem' | 'removeItem'>;

export function lerRascunho(_tentativaId: string, _armazenamento?: Armazenamento): Respostas { throw new Error('não implementado'); }
export function salvarRascunho(_tentativaId: string, _respostas: Respostas, _armazenamento?: Armazenamento, _agora?: number): boolean { throw new Error('não implementado'); }
export function limparRascunho(_tentativaId: string, _armazenamento?: Armazenamento): void { throw new Error('não implementado'); }
export function limparTodosRascunhos(_armazenamento?: Armazenamento): void { throw new Error('não implementado'); }
export function purgarRascunhosAntigos(_armazenamento?: Armazenamento, _agora?: number): void { throw new Error('não implementado'); }