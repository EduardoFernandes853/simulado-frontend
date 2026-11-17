// Esta função exportada faz o cálculo e fica isolada do React
export const fimDaTentativa = (segundosRestantes: number) => Date.now() + segundosRestantes * 1000;