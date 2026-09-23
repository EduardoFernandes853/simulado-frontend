import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../atoms/Button';
import type { Aluno, AlertaMonitoria } from '../../contracts/index';

interface PainelMonitoriaProps {
  alunos: Aluno[];
}

export function PainelMonitoria({ alunos }: PainelMonitoriaProps) {
  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [pontuacao, setPontuacao] = useState('');
  
  const [alertaMonitoria, setAlertaMonitoria] = useState<AlertaMonitoria | null>(null);

  const lancarResultado = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoSelecionado) {
      alert("Selecione um aluno primeiro!");
      return;
    }

    const nota = Number(pontuacao);

    try {
      // Disparo real do Gatilho para o Backend
      await axios.post('http://localhost:3000/resultados', {
        alunoId: alunoSelecionado,
        pontuacao: nota
      });

      // Feedback visual do App Shell
      if (nota < 60) {
        setAlertaMonitoria({ 
          visivel: true, 
          mensagem: "⚠️ ALERTA DE MONITORIA: Nota registrada no banco e aluno encaminhado.", 
          critico: true 
        });
      } else {
        setAlertaMonitoria({ 
          visivel: true, 
          mensagem: "✅ Desempenho satisfatório. Nota gravada com sucesso no PostgreSQL.", 
          critico: false 
        });
      }
      
      setPontuacao('');
      setAlunoSelecionado('');
      setTimeout(() => setAlertaMonitoria(null), 5000);

    } catch (error) {
      console.error("Erro ao gravar resultado:", error);
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando na porta 3000.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Detalhe visual alterado para verde (border-t-green-700) */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200 border-t-4 border-t-green-700">
        <h2 className="mb-4 text-xl font-semibold text-slate-700">Lançamento de Resultados</h2>
        <p className="text-sm text-slate-500 mb-6">Insira a pontuação do simulado para acionar a análise de monitoria.</p>
        
        {/* Formulário alterado de flex-col para flex lado a lado */}
        <form onSubmit={lancarResultado} className="flex gap-4">
          <select 
            value={alunoSelecionado} 
            onChange={e => setAlunoSelecionado(e.target.value)} 
            className="flex-1 rounded-md border border-slate-300 px-4 py-2 focus:border-green-600 focus:outline-none bg-white transition-colors"
          >
            <option value="">-- Selecione o Aluno --</option>
            {alunos.map(aluno => (
              <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
            ))}
          </select>
          
          <input 
            type="number" 
            placeholder="Pontuação (0 a 100)" 
            value={pontuacao} 
            onChange={e => setPontuacao(e.target.value)} 
            className="w-48 rounded-md border border-slate-300 px-4 py-2 focus:border-green-600 focus:outline-none transition-colors" 
            required 
            min="0" max="100" 
          />
          
          <Button type="submit" variant="secondary">Processar</Button>
        </form>
      </div>

      {alertaMonitoria && (
        <div className={`p-4 rounded-xl shadow-lg border-l-4 transition-all duration-300 ease-in-out ${alertaMonitoria.critico ? 'bg-red-50 border-red-500 text-red-800' : 'bg-emerald-50 border-emerald-500 text-emerald-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${alertaMonitoria.critico ? 'bg-red-100' : 'bg-emerald-100'}`}>
              {alertaMonitoria.critico ? '🚨' : '🏆'}
            </div>
            <p className="font-medium">{alertaMonitoria.mensagem}</p>
          </div>
        </div>
      )}
    </div>
  );
}