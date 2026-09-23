import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../atoms/Button';
import type { Aluno } from '../../contracts/index';

interface GestaoAlunosProps {
  alunos: Aluno[];
  carregarAlunos: () => void;
}

export function GestaoAlunos({ alunos, carregarAlunos }: GestaoAlunosProps) {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [email, setEmail] = useState('');

  const cadastrarAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/alunos', { nome, matricula, email });
      setNome(''); setMatricula(''); setEmail('');
      carregarAlunos();
    } catch (error) {
      alert("Erro ao cadastrar.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border-t-4 border-t-green-700">
        <h2 className="mb-4 text-xl font-semibold text-slate-700">Novo Aluno</h2>
        <form onSubmit={cadastrarAluno} className="flex flex-col gap-4">
          <input type="text" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} className="rounded-md border border-slate-300 px-4 py-2 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors" required />
          <input type="text" placeholder="Matrícula" value={matricula} onChange={e => setMatricula(e.target.value)} className="rounded-md border border-slate-300 px-4 py-2 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors" required />
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} className="rounded-md border border-slate-300 px-4 py-2 focus:border-green-600 focus:ring-1 focus:ring-green-600 focus:outline-none transition-colors" required />
          <Button type="submit" variant="primary">Salvar Aluno</Button>
        </form>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="mb-4 text-xl font-semibold text-slate-700">Alunos Matriculados</h2>
        <ul className="max-h-[400px] overflow-y-auto divide-y divide-slate-100">
          {alunos.map(aluno => (
            <li key={aluno.id} className="py-3 flex flex-col gap-1 pr-2">
              <span className="font-medium text-slate-700">{aluno.nome}</span>
              <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded w-fit">Mat: {aluno.matricula}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}