import { useEffect, useState } from 'react';
import axios from 'axios';
import { AppShell } from './templates/AppShell';
import { GestaoAlunos } from './components/organisms/GestaoAlunos';
import { PainelMonitoria } from './components/organisms/PainelMonitoria';
import { HistoricoResultados } from './components/organisms/HistoricoResultados';
import type { Aluno } from './contracts/index'; 

export default function App() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);

  const carregarAlunos = async () => {
    try {
      const response = await axios.get('http://localhost:3000/alunos');
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  useEffect(() => {
    carregarAlunos();
  }, []);

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        
        {/* Bloco Superior: Ação Principal (Largura Total) */}
        <div className="w-full">
          <PainelMonitoria alunos={alunos} />
        </div>

        {/* Bloco Inferior: Divisão entre Dados e Administração */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          {/* Coluna Principal (2/3): Histórico de Resultados */}
          <div className="lg:col-span-2">
            <HistoricoResultados />
          </div>
          
          {/* Coluna Secundária (1/3): Gestão Administrativa */}
          <div className="lg:col-span-1">
            <GestaoAlunos alunos={alunos} carregarAlunos={carregarAlunos} />
          </div>
          
        </div>
        
      </div>
    </AppShell>
  );
}