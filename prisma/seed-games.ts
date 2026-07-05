import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando dados dos jogos...\n');

  // Remove dados antigos dos jogos para evitar duplicatas
  await prisma.word.deleteMany({
    where: {
      gameTypes: {
        hasSome: ['VowelsGame', 'WordFormationGame', 'ReadingGame', 'PhraseBuilder'],
      },
    },
  });

  // ─── VOWELS GAME ─────────────────────────────────────────────────────────────
  // Cada vogal é um registro com a questão completa no campo `data`
  const vowelsData = [
    {
      text: 'A',
      category: 'vowel',
      difficulty: 'easy',
      emoji: '🍍',
      sound: 'ah',
      imageUrl: 'abacaxi',
      data: {
        color: ['#FF6B9D', '#FF8E9B'],
        correct: { label: 'Abacaxi', imageKey: 'abacaxi', emoji: '🍍' },
        wrong: [
          { label: 'Bola', imageKey: 'bola', emoji: '⚽' },
          { label: 'Gato', imageKey: 'gato', emoji: '🐱' },
          { label: 'Lápis', imageKey: 'lapis', emoji: '✏️' },
        ],
      },
      gameTypes: ['VowelsGame'],
    },
    {
      text: 'E',
      category: 'vowel',
      difficulty: 'easy',
      emoji: '🐘',
      sound: 'eh',
      imageUrl: 'elefante',
      data: {
        color: ['#4ECDC4', '#44A08D'],
        correct: { label: 'Elefante', imageKey: 'elefante', emoji: '🐘' },
        wrong: [
          { label: 'Cachorro', imageKey: 'cachorro', emoji: '🐶' },
          { label: 'Flor', imageKey: 'flor', emoji: '🌸' },
          { label: 'Mão', imageKey: 'mao', emoji: '✋' },
        ],
      },
      gameTypes: ['VowelsGame'],
    },
    {
      text: 'I',
      category: 'vowel',
      difficulty: 'easy',
      emoji: '⛪',
      sound: 'ih',
      imageUrl: 'igreja',
      data: {
        color: ['#A8E6CF', '#7FCDCD'],
        correct: { label: 'Igreja', imageKey: 'igreja', emoji: '⛪' },
        wrong: [
          { label: 'Pato', imageKey: 'pato', emoji: '🦆' },
          { label: 'Sol', imageKey: 'sol', emoji: '☀️' },
          { label: 'Faca', imageKey: 'faca', emoji: '🔪' },
        ],
      },
      gameTypes: ['VowelsGame'],
    },
    {
      text: 'O',
      category: 'vowel',
      difficulty: 'easy',
      emoji: '🥚',
      sound: 'oh',
      imageUrl: 'ovo',
      data: {
        color: ['#FFD93D', '#6BCF7F'],
        correct: { label: 'Ovo', imageKey: 'ovo', emoji: '🥚' },
        wrong: [
          { label: 'Gelo', imageKey: 'gelo', emoji: '🧊' },
          { label: 'Chave', imageKey: 'chave', emoji: '🔑' },
          { label: 'Mesa', imageKey: 'mesa', emoji: '🪑' },
        ],
      },
      gameTypes: ['VowelsGame'],
    },
    {
      text: 'U',
      category: 'vowel',
      difficulty: 'easy',
      emoji: '🍇',
      sound: 'uh',
      imageUrl: 'uva',
      data: {
        color: ['#FD79A8', '#E84393'],
        correct: { label: 'Uva', imageKey: 'uva', emoji: '🍇' },
        wrong: [
          { label: 'Casa', imageKey: 'casa', emoji: '🏠' },
          { label: 'Peixe', imageKey: 'peixe', emoji: '🐠' },
          { label: 'Telefone', imageKey: 'telefone', emoji: '📞' },
        ],
      },
      gameTypes: ['VowelsGame'],
    },
  ];

  // ─── WORD FORMATION GAME ─────────────────────────────────────────────────────
  const wordFormationData = [
    { text: 'ABACAXI', emoji: '🍍', imageUrl: 'abacaxi', difficulty: 'hard' },
    { text: 'ELEFANTE', emoji: '🐘', imageUrl: 'elefante', difficulty: 'hard' },
    { text: 'IGREJA', emoji: '⛪', imageUrl: 'igreja', difficulty: 'medium' },
    { text: 'OVO', emoji: '🥚', imageUrl: 'ovo', difficulty: 'easy' },
    { text: 'UVA', emoji: '🍇', imageUrl: 'uva', difficulty: 'easy' },
    { text: 'BOLA', emoji: '⚽', imageUrl: 'bola', difficulty: 'easy' },
    { text: 'GATO', emoji: '🐱', imageUrl: 'gato', difficulty: 'easy' },
    { text: 'LAPIS', emoji: '✏️', imageUrl: 'lapis', difficulty: 'medium' },
    { text: 'CACHORRO', emoji: '🐶', imageUrl: 'cachorro', difficulty: 'hard' },
    { text: 'FLOR', emoji: '🌸', imageUrl: 'flor', difficulty: 'easy' },
    { text: 'MAO', emoji: '✋', imageUrl: 'mao', difficulty: 'easy' },
    { text: 'PATO', emoji: '🦆', imageUrl: 'pato', difficulty: 'easy' },
    { text: 'SOL', emoji: '☀️', imageUrl: 'sol', difficulty: 'easy' },
    { text: 'FACA', emoji: '🔪', imageUrl: 'faca', difficulty: 'easy' },
    { text: 'GELO', emoji: '🧊', imageUrl: 'gelo', difficulty: 'easy' },
    { text: 'CHAVE', emoji: '🔑', imageUrl: 'chave', difficulty: 'medium' },
    { text: 'MESA', emoji: '🪑', imageUrl: 'mesa', difficulty: 'easy' },
    { text: 'CASA', emoji: '🏠', imageUrl: 'casa', difficulty: 'easy' },
    { text: 'PEIXE', emoji: '🐠', imageUrl: 'peixe', difficulty: 'medium' },
  ].map(w => ({ ...w, category: 'word_formation', gameTypes: ['WordFormationGame'] }));

  // ─── READING GAME ─────────────────────────────────────────────────────────────
  // imageUrl define o arquivo em assets/animals/ (sem extensão); null = sem imagem local
  const readingGameData = [
    { text: 'Gato', emoji: '🐱', sound: 'miau', imageUrl: 'gato' },
    { text: 'Cachorro', emoji: '🐶', sound: 'au au', imageUrl: 'cachorro' },
    { text: 'Leão', emoji: '🦁', sound: 'roar', imageUrl: 'leao' },
    { text: 'Elefante', emoji: '🐘', sound: 'trumpet', imageUrl: 'elefante' },
    { text: 'Girafa', emoji: '🦒', sound: 'hmm', imageUrl: 'girafa' },
    { text: 'Zebra', emoji: '🦓', sound: 'neigh', imageUrl: 'zebra' },
    { text: 'Macaco', emoji: '🐵', sound: 'ooh ooh', imageUrl: 'macaco' },
    { text: 'Pato', emoji: '🦆', sound: 'quack', imageUrl: 'pato' },
    { text: 'Urso', emoji: '🐻', sound: 'growl', imageUrl: 'urso' },
    { text: 'Porco', emoji: '🐷', sound: 'oink', imageUrl: 'porco' },
    { text: 'Coelho', emoji: '🐰', sound: 'hop', imageUrl: 'coelho' },
    { text: 'Raposa', emoji: '🦊', sound: 'yip', imageUrl: 'raposa' },
    { text: 'Coruja', emoji: '🦉', sound: 'hoot', imageUrl: 'coruja' },
    { text: 'Tigre', emoji: '🐯', sound: 'roar', imageUrl: 'tigre' },
    { text: 'Tartaruga', emoji: '🐢', sound: 'slow', imageUrl: 'tartaruga' },
    { text: 'Papagaio', emoji: '🦜', sound: 'squawk', imageUrl: 'papagaio' },
    { text: 'Pinguim', emoji: '🐧', sound: 'waddle', imageUrl: 'pinguim' },
    { text: 'Peixe', emoji: '🐠', sound: 'bubble', imageUrl: 'peixe' },
    { text: 'Cavalo', emoji: '🐴', sound: 'relincho', imageUrl: 'cavalo' },
    { text: 'Vaca', emoji: '🐮', sound: 'muuu', imageUrl: null },
    { text: 'Ovelha', emoji: '🐑', sound: 'mééé', imageUrl: null },
    { text: 'Galinha', emoji: '🐔', sound: 'có có', imageUrl: null },
    { text: 'Galo', emoji: '🐓', sound: 'cocoricó', imageUrl: null },
    { text: 'Pintinho', emoji: '🐥', sound: 'piu piu', imageUrl: null },
    { text: 'Passarinho', emoji: '🐦', sound: 'pii pii', imageUrl: null },
    { text: 'Águia', emoji: '🦅', sound: 'screech', imageUrl: null },
    { text: 'Sapo', emoji: '🐸', sound: 'croá', imageUrl: null },
    { text: 'Cobra', emoji: '🐍', sound: 'sss', imageUrl: null },
    { text: 'Jacaré', emoji: '🐊', sound: 'snap', imageUrl: null },
    { text: 'Golfinho', emoji: '🐬', sound: 'click click', imageUrl: null },
    { text: 'Baleia', emoji: '🐳', sound: 'canto', imageUrl: null },
    { text: 'Tubarão', emoji: '🦈', sound: 'chomp', imageUrl: null },
    { text: 'Polvo', emoji: '🐙', sound: 'bloop', imageUrl: null },
    { text: 'Caranguejo', emoji: '🦀', sound: 'cleck', imageUrl: null },
    { text: 'Camelo', emoji: '🐫', sound: 'grunhido', imageUrl: null },
    { text: 'Rinoceronte', emoji: '🦏', sound: 'ronco', imageUrl: null },
    { text: 'Hipopótamo', emoji: '🦛', sound: 'muuu', imageUrl: null },
    { text: 'Canguru', emoji: '🦘', sound: 'pum', imageUrl: null },
    { text: 'Panda', emoji: '🐼', sound: 'grunhido', imageUrl: null },
    { text: 'Gorila', emoji: '🦍', sound: 'uga uga', imageUrl: null },
    { text: 'Lobo', emoji: '🐺', sound: 'auuu', imageUrl: null },
    { text: 'Esquilo', emoji: '🐿️', sound: 'chic chic', imageUrl: null },
    { text: 'Morcego', emoji: '🦇', sound: 'squeak', imageUrl: null },
    { text: 'Rato', emoji: '🐭', sound: 'squeak', imageUrl: null },
    { text: 'Dinossauro', emoji: '🦖', sound: 'roar', imageUrl: null },
    { text: 'Unicórnio', emoji: '🦄', sound: 'relincho mágico', imageUrl: null },
    { text: 'Borboleta', emoji: '🦋', sound: 'silêncio', imageUrl: null },
    { text: 'Joaninha', emoji: '🐞', sound: 'zzz', imageUrl: null },
    { text: 'Abelha', emoji: '🐝', sound: 'bzzz', imageUrl: null },
    { text: 'Formiga', emoji: '🐜', sound: 'silêncio', imageUrl: null },
    { text: 'Aranha', emoji: '🕷️', sound: 'silêncio', imageUrl: null },
  ].map(w => ({ ...w, category: 'animal', difficulty: 'easy', gameTypes: ['ReadingGame'] }));

  // ─── PHRASE BUILDER ────────────────────────────────────────────────────────────
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());

  const phraseBuilderWords = [
    // Básicos
    ...[
      { word: 'Eu', emoji: '🙋' }, { word: 'Você', emoji: '👉' }, { word: 'Nós', emoji: '👥' },
      { word: 'Quero', emoji: '🤲' }, { word: 'Preciso', emoji: '🙏' }, { word: 'Gosto', emoji: '❤️' },
      { word: 'Amo', emoji: '💕' }, { word: 'Sim', emoji: '✅' }, { word: 'Não', emoji: '❌' },
      { word: 'Talvez', emoji: '🤔' }, { word: 'Por favor', emoji: '🙏' }, { word: 'Obrigado', emoji: '🤗' },
      { word: 'De nada', emoji: '😊' }, { word: 'Oi', emoji: '👋' }, { word: 'Tchau', emoji: '👋' },
      { word: 'Ajuda', emoji: '🆘' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Básicos' })),

    // Ações
    ...[
      { word: 'Comer', emoji: '🍽️' }, { word: 'Beber', emoji: '🥤' }, { word: 'Dormir', emoji: '😴' },
      { word: 'Brincar', emoji: '🎮' }, { word: 'Correr', emoji: '🏃' }, { word: 'Pular', emoji: '🤸' },
      { word: 'Andar', emoji: '🚶' }, { word: 'Cantar', emoji: '🎤' }, { word: 'Desenhar', emoji: '🎨' },
      { word: 'Abraçar', emoji: '🤗' }, { word: 'Chorar', emoji: '😢' }, { word: 'Sorrir', emoji: '😊' },
      { word: 'Sentar', emoji: '🪑' }, { word: 'Levantar', emoji: '🧍' }, { word: 'Tomar banho', emoji: '🛁' },
      { word: 'Ler', emoji: '📖' }, { word: 'Escrever', emoji: '✏️' }, { word: 'Ouvir', emoji: '👂' },
      { word: 'Falar', emoji: '💬' }, { word: 'Ver', emoji: '👀' }, { word: 'Estudar', emoji: '📚' },
      { word: 'Escovar', emoji: '🪥' }, { word: 'Vestir', emoji: '👕' }, { word: 'Calçar', emoji: '👟' },
      { word: 'Lavar', emoji: '🧼' }, { word: 'Cozinhar', emoji: '🍳' }, { word: 'Jogar', emoji: '⚽' },
      { word: 'Dançar', emoji: '💃' }, { word: 'Assistir', emoji: '📺' }, { word: 'Pintar', emoji: '🖌️' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Ações' })),

    // Sentimentos
    ...[
      { word: 'Feliz', emoji: '😊' }, { word: 'Triste', emoji: '😢' }, { word: 'Bravo', emoji: '😠' },
      { word: 'Com Medo', emoji: '😨' }, { word: 'Cansado', emoji: '😴' }, { word: 'Animado', emoji: '🤩' },
      { word: 'Calmo', emoji: '😌' }, { word: 'Nervoso', emoji: '😬' }, { word: 'Confuso', emoji: '😕' },
      { word: 'Orgulhoso', emoji: '🦸' }, { word: 'Envergonhado', emoji: '😳' }, { word: 'Amor', emoji: '❤️' },
      { word: 'Surpreso', emoji: '😲' }, { word: 'Entediado', emoji: '😑' }, { word: 'Solitário', emoji: '😔' },
      { word: 'Doente', emoji: '🤒' }, { word: 'Com fome', emoji: '🍽️' }, { word: 'Com sede', emoji: '💧' },
      { word: 'Com sono', emoji: '🥱' }, { word: 'Tímido', emoji: '🫣' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Sentimentos' })),

    // Higiene
    ...[
      { word: 'Escova de Dente', emoji: '🪥' }, { word: 'Pasta de Dente', emoji: '🧴' },
      { word: 'Sabonete', emoji: '🧼' }, { word: 'Shampoo', emoji: '🧴' }, { word: 'Toalha', emoji: '🧺' },
      { word: 'Pente', emoji: '🪮' }, { word: 'Papel Higiênico', emoji: '🧻' }, { word: 'Banho', emoji: '🛁' },
      { word: 'Vaso Sanitário', emoji: '🚽' }, { word: 'Lenço', emoji: '🤧' }, { word: 'Chinelo', emoji: '🩴' },
      { word: 'Máscara', emoji: '😷' }, { word: 'Álcool gel', emoji: '🧴' },
      { word: 'Cortar unha', emoji: '✂️' }, { word: 'Secador', emoji: '💨' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Higiene' })),

    // Comidas
    ...[
      { word: 'Arroz', emoji: '🍚' }, { word: 'Feijão', emoji: '🫘' }, { word: 'Pão', emoji: '🍞' },
      { word: 'Leite', emoji: '🥛' }, { word: 'Suco', emoji: '🧃' }, { word: 'Água', emoji: '💧' },
      { word: 'Maçã', emoji: '🍎' }, { word: 'Banana', emoji: '🍌' }, { word: 'Laranja', emoji: '🍊' },
      { word: 'Uva', emoji: '🍇' }, { word: 'Morango', emoji: '🍓' }, { word: 'Abacaxi', emoji: '🍍' },
      { word: 'Melancia', emoji: '🍉' }, { word: 'Biscoito', emoji: '🍪' }, { word: 'Bolo', emoji: '🎂' },
      { word: 'Chocolate', emoji: '🍫' }, { word: 'Pizza', emoji: '🍕' }, { word: 'Hambúrguer', emoji: '🍔' },
      { word: 'Batata', emoji: '🍟' }, { word: 'Sorvete', emoji: '🍦' }, { word: 'Queijo', emoji: '🧀' },
      { word: 'Iogurte', emoji: '🥣' }, { word: 'Café', emoji: '☕' }, { word: 'Pipoca', emoji: '🍿' },
      { word: 'Cenoura', emoji: '🥕' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Comidas' })),

    // Animais
    ...[
      { word: 'Gato', emoji: '🐱' }, { word: 'Cachorro', emoji: '🐶' }, { word: 'Cavalo', emoji: '🐴' },
      { word: 'Vaca', emoji: '🐮' }, { word: 'Porco', emoji: '🐷' }, { word: 'Galinha', emoji: '🐔' },
      { word: 'Pato', emoji: '🦆' }, { word: 'Peixe', emoji: '🐠' }, { word: 'Pássaro', emoji: '🐦' },
      { word: 'Coelho', emoji: '🐰' }, { word: 'Urso', emoji: '🐻' }, { word: 'Elefante', emoji: '🐘' },
      { word: 'Leão', emoji: '🦁' }, { word: 'Tigre', emoji: '🐯' }, { word: 'Macaco', emoji: '🐵' },
      { word: 'Girafa', emoji: '🦒' }, { word: 'Zebra', emoji: '🦓' }, { word: 'Coruja', emoji: '🦉' },
      { word: 'Borboleta', emoji: '🦋' }, { word: 'Abelha', emoji: '🐝' }, { word: 'Joaninha', emoji: '🐞' },
      { word: 'Tartaruga', emoji: '🐢' }, { word: 'Cobra', emoji: '🐍' }, { word: 'Baleia', emoji: '🐳' },
      { word: 'Dinossauro', emoji: '🦖' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Animais' })),

    // Família
    ...[
      { word: 'Mãe', emoji: '👩' }, { word: 'Pai', emoji: '👨' }, { word: 'Irmão', emoji: '🧒' },
      { word: 'Irmã', emoji: '👧' }, { word: 'Avó', emoji: '👵' }, { word: 'Avô', emoji: '👴' },
      { word: 'Tio', emoji: '👨‍🦱' }, { word: 'Tia', emoji: '👩‍🦱' }, { word: 'Primo', emoji: '🧑' },
      { word: 'Prima', emoji: '👱‍♀️' }, { word: 'Bebê', emoji: '👶' }, { word: 'Filho', emoji: '🧒' },
      { word: 'Filha', emoji: '👧' }, { word: 'Família', emoji: '👨‍👩‍👧‍👦' }, { word: 'Amigo', emoji: '🤝' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Família' })),

    // Cores
    ...[
      { word: 'Vermelho', emoji: '🔴' }, { word: 'Azul', emoji: '🔵' }, { word: 'Amarelo', emoji: '🟡' },
      { word: 'Verde', emoji: '🟢' }, { word: 'Laranja', emoji: '🟠' }, { word: 'Roxo', emoji: '🟣' },
      { word: 'Rosa', emoji: '🌸' }, { word: 'Branco', emoji: '⬜' }, { word: 'Preto', emoji: '⬛' },
      { word: 'Marrom', emoji: '🟫' }, { word: 'Cinza', emoji: '🔘' }, { word: 'Dourado', emoji: '✨' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Cores' })),

    // Tempo/Clima
    ...[
      { word: 'Sol', emoji: '☀️' }, { word: 'Chuva', emoji: '🌧️' }, { word: 'Frio', emoji: '🥶' },
      { word: 'Calor', emoji: '🥵' }, { word: 'Nuvem', emoji: '☁️' }, { word: 'Vento', emoji: '💨' },
      { word: 'Neve', emoji: '❄️' }, { word: 'Trovão', emoji: '⛈️' }, { word: 'Arco-íris', emoji: '🌈' },
      { word: 'Noite', emoji: '🌙' }, { word: 'Dia', emoji: '🌅' }, { word: 'Estrela', emoji: '⭐' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'TempoClima' })),

    // Lugares
    ...[
      { word: 'Casa', emoji: '🏠' }, { word: 'Escola', emoji: '🏫' }, { word: 'Parque', emoji: '🏞️' },
      { word: 'Mercado', emoji: '🛒' }, { word: 'Hospital', emoji: '🏥' }, { word: 'Praia', emoji: '🏖️' },
      { word: 'Cinema', emoji: '🎬' }, { word: 'Restaurante', emoji: '🍽️' }, { word: 'Banheiro', emoji: '🚻' },
      { word: 'Quarto', emoji: '🛏️' }, { word: 'Cozinha', emoji: '🍳' }, { word: 'Sala', emoji: '🛋️' },
      { word: 'Igreja', emoji: '⛪' }, { word: 'Fazenda', emoji: '🌾' }, { word: 'Cidade', emoji: '🏙️' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Lugares' })),

    // Transporte
    ...[
      { word: 'Carro', emoji: '🚗' }, { word: 'Ônibus', emoji: '🚌' }, { word: 'Avião', emoji: '✈️' },
      { word: 'Trem', emoji: '🚆' }, { word: 'Bicicleta', emoji: '🚲' }, { word: 'Moto', emoji: '🏍️' },
      { word: 'Barco', emoji: '⛵' }, { word: 'Caminhão', emoji: '🚚' }, { word: 'Helicóptero', emoji: '🚁' },
      { word: 'Metrô', emoji: '🚇' }, { word: 'Navio', emoji: '🚢' }, { word: 'Foguete', emoji: '🚀' },
    ].map(w => ({ text: w.word, emoji: w.emoji, category: 'Transporte' })),

    // Alfabeto
    ...alphabet.map(l => ({ text: l, emoji: null, category: 'Alfabeto' })),

    // Números
    ...numbers.map(n => ({ text: n, emoji: null, category: 'Números' })),
  ].map(w => ({ ...w, difficulty: 'easy', gameTypes: ['PhraseBuilder'] }));

  // ─── INSERT ───────────────────────────────────────────────────────────────────
  await prisma.word.createMany({ data: vowelsData as any });
  console.log(`✅ VowelsGame: ${vowelsData.length} vogais inseridas`);

  await prisma.word.createMany({ data: wordFormationData });
  console.log(`✅ WordFormationGame: ${wordFormationData.length} palavras inseridas`);

  await prisma.word.createMany({ data: readingGameData });
  console.log(`✅ ReadingGame: ${readingGameData.length} animais inseridos`);

  await prisma.word.createMany({ data: phraseBuilderWords as any });
  console.log(`✅ PhraseBuilder: ${phraseBuilderWords.length} palavras inseridas`);

  const total = vowelsData.length + wordFormationData.length + readingGameData.length + phraseBuilderWords.length;
  console.log(`\n🎮 Total: ${total} registros inseridos nos jogos.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
