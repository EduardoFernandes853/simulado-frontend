import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { ResultadoComAluno } from '../../contracts/index';
import { Button } from '../atoms/Button';

export function HistoricoResultados() {
  const [resultados, setResultados] = useState<ResultadoComAluno[]>([]);

  const carregarHistorico = async () => {
    try {
      const response = await axios.get('http://localhost:3000/resultados');
      setResultados(response.data);
    } catch (error) {
      console.error("Erro ao carregar histórico", error);
    }
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-700">Histórico de Diagnósticos</h2>
          <p className="text-sm text-slate-500">Acompanhamento geral e status de monitoria.</p>
        </div>
        <Button variant="secondary" onClick={carregarHistorico}>Atualizar</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-green-50/50 text-green-900 uppercase border-b border-green-100">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Aluno</th>
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3">Pontuação</th>
              <th className="px-4 py-3 rounded-tr-lg">Status do Gatilho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resultados.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Nenhum resultado processado ainda.
                </td>
              </tr>
            ) : (
              resultados.map((resultado) => (
                <tr key={resultado.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-800">{resultado.aluno.nome}</td>
                  <td className="px-4 py-3 font-mono text-xs">{resultado.aluno.matricula}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">{resultado.nota}</td>
                  <td className="px-4 py-3">
                    {resultado.nota < 60 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                        Monitoria Acionada
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Adequado
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}