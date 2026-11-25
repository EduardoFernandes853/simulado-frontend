export const AVISO_EM_REVISAO = true;

export interface SecaoAviso {
  titulo: string;
  paragrafos: string[];
}

export const SECOES_AVISO: SecaoAviso[] = [
  {
    titulo: 'Quem cuida dos seus dados',
    paragrafos: [
      'O Simulado Digital é uma ferramenta de estudo do IFPA Campus Tucuruí. Quem decide como os dados são usados (controlador): [CONTROLADOR: a confirmar com a TI e o encarregado de dados do IFPA].',
      'Encarregado de dados para falar sobre este assunto: [NOME E E-MAIL DO ENCARREGADO]. Desenvolvedor do sistema: [SEU NOME E CONTATO].',
    ],
  },
  {
    titulo: 'Quais dados usamos',
    paragrafos: [
      'Seu nome, sua matrícula (que vem do seu e-mail institucional) e o próprio e-mail institucional.',
      'Suas respostas, notas, tempos de prova e os tópicos das questões que você acertou ou errou.',
      'Registros técnicos, como endereço IP e horário de acesso, usados só para segurança e para corrigir defeitos.',
    ],
  },
  {
    titulo: 'Para que usamos',
    paragrafos: [
      'Para mostrar seu desempenho por tópico e ajudar você a estudar o que ainda precisa de reforço.',
      'Quando sua nota fica abaixo de 60% em um simulado, o sistema gera um alerta para o projeto de monitoria de pares oferecer apoio a você.',
      'Não usamos os dados para nota oficial, aprovação ou reprovação, nem para publicidade. Não vendemos dados.',
    ],
  },
  {
    titulo: 'Quem pode ver',
    paragrafos: [
      'Você vê todos os seus resultados.',
      'Professores e monitores do projeto veem nome, matrícula, e-mail, nota e tópicos com dificuldade apenas dos alunos que tiveram alerta. O alerta é um aviso para oferecer apoio: uma pessoa decide o que fazer, não o sistema.',
      'O desenvolvedor acessa os dados apenas quando necessário para manter o sistema funcionando.',
    ],
  },
  {
    titulo: 'Quem guarda os dados por nós',
    paragrafos: [
      'Usamos serviços de terceiros: Supabase (banco de dados, em São Paulo), Render (servidor), Vercel (site), Brevo (envio de e-mails), Sentry (registro de erros, nos Estados Unidos, só com um identificador interno, sem e-mail nem matrícula), Better Stack (verifica se o sistema está no ar, sem dados de alunos) e GitHub (cópia de segurança criptografada).',
      'Alguns desses serviços ficam fora do Brasil. [SALVAGUARDAS DA TRANSFERÊNCIA INTERNACIONAL: a confirmar com o encarregado].',
    ],
  },
  {
    titulo: 'Por quanto tempo guardamos',
    paragrafos: [
      'Enquanto sua conta existir. Contas sem uso por [PRAZO: a confirmar, proposta de 12 meses] são removidas.',
      'Se você excluir sua conta, seus dados saem do sistema na hora. Cópias de segurança criptografadas são apagadas em até 90 dias.',
    ],
  },
  {
    titulo: 'Seus direitos',
    paragrafos: [
      'Em "Minha conta" você pode baixar seus dados, corrigir seu nome e excluir sua conta, sem precisar pedir a ninguém.',
      'Você também pode pedir ao encarregado informações sobre o tratamento dos seus dados, a revisão de um alerta de monitoria e esclarecimentos sobre o compartilhamento. Se não ficar satisfeito, pode procurar a Autoridade Nacional de Proteção de Dados (ANPD).',
    ],
  },
  {
    titulo: 'Se você tem menos de 18 anos',
    paragrafos: [
      '[TEXTO SOBRE ESTUDANTES MENORES DE 18 ANOS E RESPONSÁVEIS: a definir com o encarregado].',
    ],
  },
  {
    titulo: 'Como protegemos',
    paragrafos: [
      'Acesso por login e senha, conexão protegida, regras que impedem um aluno de ver dados de outro, e cópias de segurança criptografadas. Se houver um incidente de segurança que possa causar risco relevante, avisaremos as pessoas afetadas e a ANPD, nos termos da lei.',
    ],
  },
];