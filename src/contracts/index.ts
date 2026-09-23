export interface Aluno {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ResultadoSimulado {
  id?: string;
  alunoId: string;
  pontuacao: number;
  encaminhadoMonitoria: boolean;
}

export interface AlertaMonitoria {
  visivel: boolean;
  mensagem: string;
  critico: boolean;
}

export interface ResultadoComAluno {
  id: string;
  nota: number;
  alunoId: string;
  simuladoId: string;
  aluno: {
    nome: string;
    matricula: string;
  };
}