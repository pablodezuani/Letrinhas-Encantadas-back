import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

async function main() {
  console.log('🌱 Criando dados de demonstração...\n');

  // ─── LIMPA DADOS ANTERIORES (mantém admins) ───────────────────────────────
  await prisma.gameSessionItem.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.word.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.child.deleteMany();
  await prisma.user.deleteMany({ where: { role: { in: ['PARENT', 'EDUCATOR'] } } });

  const passwordHash = await hash('123456', 8);

  // ─── ADMIN ─────────────────────────────────────────────────────────────────
  const adminExists = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
  if (!adminExists) {
    await prisma.user.create({
      data: { name: 'Administrador', email: 'admin@letrinhas.com', Password: await hash('admin123', 8), role: 'ADMIN' },
    });
    console.log('✅ Admin: admin@letrinhas.com / admin123');
  }

  // ─── EDUCADORES ────────────────────────────────────────────────────────────
  const [edu1, edu2] = await Promise.all([
    prisma.user.create({ data: { name: 'Profª Ana Oliveira', email: 'ana@letrinhas.com', Password: passwordHash, role: 'EDUCATOR' } }),
    prisma.user.create({ data: { name: 'Prof. Carlos Mendes', email: 'carlos@letrinhas.com', Password: passwordHash, role: 'EDUCATOR' } }),
  ]);
  console.log(`✅ Educadores: ana@letrinhas.com / 123456`);
  console.log(`✅ Educadores: carlos@letrinhas.com / 123456`);

  // ─── PAIS ──────────────────────────────────────────────────────────────────
  const [pai1, pai2, pai3, pai4] = await Promise.all([
    prisma.user.create({ data: { name: 'Fernanda Costa', email: 'fernanda@email.com', Password: passwordHash, role: 'PARENT' } }),
    prisma.user.create({ data: { name: 'Ricardo Souza', email: 'ricardo@email.com', Password: passwordHash, role: 'PARENT' } }),
    prisma.user.create({ data: { name: 'Juliana Alves', email: 'juliana@email.com', Password: passwordHash, role: 'PARENT' } }),
    prisma.user.create({ data: { name: 'Marcos Lima', email: 'marcos@email.com', Password: passwordHash, role: 'PARENT' } }),
  ]);
  console.log(`✅ 4 responsáveis criados`);

  // ─── CRIANÇAS ──────────────────────────────────────────────────────────────
  const [c1, c2, c3, c4, c5, c6] = await Promise.all([
    prisma.child.create({ data: {
      name: 'Miguel Costa', nickname: 'Mig', age: 7, gender: 'male',
      hasAutism: 'yes', autismLevel: '1',
      aboutMe: 'Adora dinossauros e quebra-cabeças. Muito curioso e detalhista.',
      specialInterests: ['Dinossauros', 'Trens', 'Matemática'],
      likes: ['Jogos de memória', 'Música clássica'],
      dislikes: ['Barulho alto', 'Mudanças de rotina'],
      skills: ['Memória fotográfica', 'Raciocínio lógico'],
      howToHelp: 'Avisar antecipadamente sobre mudanças. Dar instruções claras e diretas.',
      communication: 'Verbal, prefere frases curtas',
      routine: 'Acordar, café, escola, jogo, jantar, dormir às 21h',
      parentId: pai1.id,
    }}),
    prisma.child.create({ data: {
      name: 'Sofia Souza', nickname: 'Sofi', age: 6, gender: 'female',
      hasAutism: 'yes', autismLevel: '2',
      aboutMe: 'Ama arte e pintura. Expressa-se muito bem através do desenho.',
      specialInterests: ['Pintura', 'Unicórnios', 'Natureza'],
      likes: ['Atividades artísticas', 'Histórias'],
      dislikes: ['Multidões', 'Texturas ásperas'],
      howToHelp: 'Usar recursos visuais. Permitir pausas quando necessário.',
      medicalInfo: 'Em acompanhamento com fonoaudióloga',
      sensoryNeeds: 'Sensível a texturas e sons altos',
      parentId: pai2.id,
    }}),
    prisma.child.create({ data: {
      name: 'Pedro Alves', nickname: 'Pedrinho', age: 8, gender: 'male',
      hasAutism: 'yes', autismLevel: '1',
      aboutMe: 'Fã de super-heróis e ciências. Adora experimentos.',
      specialInterests: ['Super-heróis', 'Ciências', 'Espaço'],
      likes: ['Experimentos', 'Documentários'],
      skills: ['Vocabulário avançado', 'Curiosidade científica'],
      howToHelp: 'Explicar o "porquê" das regras. Dar tempo extra para transições.',
      communication: 'Verbal com tendência a monólogos sobre temas de interesse',
      parentId: pai3.id,
    }}),
    prisma.child.create({ data: {
      name: 'Laura Lima', age: 5, gender: 'female',
      hasAutism: 'no',
      aboutMe: 'Muito criativa e extrovertida. Ama dançar e cantar.',
      specialInterests: ['Dança', 'Música', 'Animais'],
      likes: ['Brincar ao ar livre', 'Teatro'],
      parentId: pai4.id,
    }}),
    prisma.child.create({ data: {
      name: 'Arthur Costa', nickname: 'Art', age: 9, gender: 'male',
      hasAutism: 'yes', autismLevel: '2',
      aboutMe: 'Adora jogos eletrônicos e programação. Muito focado.',
      specialInterests: ['Games', 'Programação', 'Robótica'],
      likes: ['Desafios lógicos', 'Tecnologia'],
      medications: ['Ritalina 10mg (manhã)'],
      howToHelp: 'Usar linguagem direta. Estabelecer metas claras.',
      parentId: pai1.id,
    }}),
    prisma.child.create({ data: {
      name: 'Isabela Souza', age: 6, gender: 'female',
      hasAutism: 'yes', autismLevel: '3',
      aboutMe: 'Comunicação por pictogramas. Adora música e rotina estruturada.',
      communication: 'Por pictogramas e gestos',
      sensoryNeeds: 'Precisa de ambiente calmo com poucos estímulos visuais',
      howToHelp: 'Usar PECS. Manter rotina rígida. Evitar mudanças bruscas.',
      medications: ['Risperidona 0,5mg'],
      parentId: pai2.id,
    }}),
  ]);
  console.log(`✅ 6 crianças criadas`);

  // ─── PALAVRAS ──────────────────────────────────────────────────────────────
  const words = [
    // Animais
    { text: 'cachorro', category: 'animais', difficulty: 'EASY', gameTypes: ['READING', 'WORD_FORMATION', 'VOWELS'] },
    { text: 'gato', category: 'animais', difficulty: 'EASY', gameTypes: ['READING', 'WORD_FORMATION'] },
    { text: 'elefante', category: 'animais', difficulty: 'HARD', gameTypes: ['WORD_FORMATION', 'PHRASE_BUILDER'] },
    { text: 'coelho', category: 'animais', difficulty: 'MEDIUM', gameTypes: ['READING', 'WORD_FORMATION'] },
    { text: 'leão', category: 'animais', difficulty: 'MEDIUM', gameTypes: ['READING', 'VOWELS'] },
    { text: 'pato', category: 'animais', difficulty: 'EASY', gameTypes: ['READING', 'VOWELS'] },
    { text: 'girafa', category: 'animais', difficulty: 'MEDIUM', gameTypes: ['WORD_FORMATION'] },
    { text: 'macaco', category: 'animais', difficulty: 'MEDIUM', gameTypes: ['READING', 'WORD_FORMATION'] },
    // Frutas
    { text: 'maçã', category: 'frutas', difficulty: 'EASY', gameTypes: ['READING', 'VOWELS', 'WORD_FORMATION'] },
    { text: 'banana', category: 'frutas', difficulty: 'EASY', gameTypes: ['READING', 'WORD_FORMATION'] },
    { text: 'laranja', category: 'frutas', difficulty: 'MEDIUM', gameTypes: ['READING', 'WORD_FORMATION', 'PHRASE_BUILDER'] },
    { text: 'uva', category: 'frutas', difficulty: 'EASY', gameTypes: ['VOWELS', 'READING'] },
    { text: 'morango', category: 'frutas', difficulty: 'MEDIUM', gameTypes: ['WORD_FORMATION'] },
    // Cores
    { text: 'azul', category: 'cores', difficulty: 'EASY', gameTypes: ['READING', 'VOWELS'] },
    { text: 'vermelho', category: 'cores', difficulty: 'HARD', gameTypes: ['WORD_FORMATION', 'PHRASE_BUILDER'] },
    { text: 'verde', category: 'cores', difficulty: 'EASY', gameTypes: ['READING', 'WORD_FORMATION'] },
    { text: 'amarelo', category: 'cores', difficulty: 'MEDIUM', gameTypes: ['WORD_FORMATION'] },
    // Ações
    { text: 'comer', category: 'ações', difficulty: 'EASY', gameTypes: ['PHRASE_BUILDER', 'READING'] },
    { text: 'beber', category: 'ações', difficulty: 'EASY', gameTypes: ['PHRASE_BUILDER', 'READING'] },
    { text: 'dormir', category: 'ações', difficulty: 'MEDIUM', gameTypes: ['PHRASE_BUILDER'] },
    { text: 'brincar', category: 'ações', difficulty: 'MEDIUM', gameTypes: ['PHRASE_BUILDER', 'READING'] },
    { text: 'correr', category: 'ações', difficulty: 'MEDIUM', gameTypes: ['PHRASE_BUILDER'] },
    // Objetos
    { text: 'bola', category: 'objetos', difficulty: 'EASY', gameTypes: ['READING', 'VOWELS', 'WORD_FORMATION'] },
    { text: 'casa', category: 'objetos', difficulty: 'EASY', gameTypes: ['READING', 'WORD_FORMATION'] },
    { text: 'livro', category: 'objetos', difficulty: 'EASY', gameTypes: ['READING', 'WORD_FORMATION'] },
  ];

  await prisma.word.createMany({ data: words });
  console.log(`✅ ${words.length} palavras criadas`);

  // ─── SESSÕES DE JOGO ───────────────────────────────────────────────────────
  const gameTypes = ['READING', 'VOWELS', 'WORD_FORMATION', 'PHRASE_BUILDER'] as const;

  const sessionItems = (score: number, maxScore: number) =>
    Array.from({ length: maxScore }, (_, i) => ({
      content: words[i % words.length].text,
      correct: i < score,
      attempts: i < score ? 1 : randomBetween(2, 4),
      timeSpent: randomBetween(5, 30),
    }));

  const childrenList = [c1, c2, c3, c4, c5, c6];
  let totalSessions = 0;

  for (const child of childrenList) {
    const numSessions = randomBetween(8, 20);

    for (let i = 0; i < numSessions; i++) {
      const gameType = gameTypes[randomBetween(0, 3)];
      const maxScore = randomBetween(5, 10);
      // Crianças mais recentes têm progresso crescente
      const progress = Math.min(1, (i / numSessions) * 1.3);
      const score = Math.round(maxScore * (0.3 + progress * 0.6 + (Math.random() * 0.2 - 0.1)));
      const clampedScore = Math.max(0, Math.min(score, maxScore));

      await prisma.gameSession.create({
        data: {
          childId: child.id,
          gameType,
          score: clampedScore,
          maxScore,
          timeSpent: randomBetween(120, 600),
          completed: Math.random() > 0.2,
          playedAt: daysAgo(numSessions - i),
          items: { create: sessionItems(clampedScore, maxScore) },
        },
      });
      totalSessions++;
    }
  }

  console.log(`✅ ${totalSessions} sessões de jogo criadas`);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 Dados de demo prontos!

📌 Acesso ao painel web:
   Admin:     admin@letrinhas.com   / admin123
   Educadora: ana@letrinhas.com     / 123456
   Educador:  carlos@letrinhas.com  / 123456

👶 Crianças criadas: 6
📚 Palavras criadas: ${words.length}
🎮 Sessões criadas: ${totalSessions}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
