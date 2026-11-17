export type Respostas = Record<string, string>;
export type Armazenamento = Pick<Storage, 'length' | 'key' | 'getItem' | 'setItem' | 'removeItem'>;

const PREFIXO = 'prova:';
const VALIDADE_MS = 24 * 3600_000;
const LETRA = /^[A-E]$/;

interface Rascunho { v: 1; salvoEm: number; respostas: Respostas }

const chave = (tentativaId: string) => `${PREFIXO}${tentativaId}`;

// Acessar localStorage pode lançar exceção (modo privado, política do navegador).
function obter(a?: Armazenamento): Armazenamento | null {
  try { return a ?? localStorage; } catch { return null; }
}

// O conteúdo é tratado como não confiável: pode estar corrompido ou ter sido editado.
function interpretar(bruto: string | null): Rascunho | null {
  if (!bruto) return null;
  try {
    const d: unknown = JSON.parse(bruto);
    if (typeof d !== 'object' || d === null) return null;
    const { salvoEm, respostas } = d as Record<string, unknown>;
    if (typeof salvoEm !== 'number' || typeof respostas !== 'object' || respostas === null || Array.isArray(respostas)) return null;
    
    const limpas = Object.fromEntries(
      Object.entries(respostas).filter((par): par is [string, string] => typeof par[1] === 'string' && LETRA.test(par[1])),
    );
    return { v: 1, salvoEm, respostas: limpas };
  } catch {
    return null;
  }
}

export function lerRascunho(tentativaId: string, armazenamento?: Armazenamento): Respostas {
  const a = obter(armazenamento);
  if (!a) return {};
  try { return interpretar(a.getItem(chave(tentativaId)))?.respostas ?? {}; } catch { return {}; }
}

export function salvarRascunho(
  tentativaId: string, respostas: Respostas, armazenamento?: Armazenamento, agora: number = Date.now(),
): boolean {
  const a = obter(armazenamento);
  if (!a) return false;
  try {
    const corpo: Rascunho = { v: 1, salvoEm: agora, respostas };
    a.setItem(chave(tentativaId), JSON.stringify(corpo));
    return true;
  } catch {
    return false;
  }
}

export function limparRascunho(tentativaId: string, armazenamento?: Armazenamento): void {
  const a = obter(armazenamento);
  if (!a) return;
  try { a.removeItem(chave(tentativaId)); } catch { /* ignora */ }
}

function chavesDeRascunho(a: Armazenamento): string[] {
  const chaves: string[] = [];
  for (let i = 0; i < a.length; i++) {
    const k = a.key(i);
    if (k !== null && k.startsWith(PREFIXO)) chaves.push(k);
  }
  return chaves; // coletadas antes de remover, para não bagunçar os índices
}

export function limparTodosRascunhos(armazenamento?: Armazenamento): void {
  const a = obter(armazenamento);
  if (!a) return;
  try { chavesDeRascunho(a).forEach((k) => a.removeItem(k)); } catch { /* ignora */ }
}

export function purgarRascunhosAntigos(armazenamento?: Armazenamento, agora: number = Date.now()): void {
  const a = obter(armazenamento);
  if (!a) return;
  try {
    for (const k of chavesDeRascunho(a)) {
      const r = interpretar(a.getItem(k));
      if (!r || agora - r.salvoEm > VALIDADE_MS) a.removeItem(k);
    }
  } catch { /* ignora */ }
}