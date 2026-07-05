import prismaClient from '../../prisma';

interface CreateWordInput {
  text: string;
  category: string;
  difficulty?: string;
  emoji?: string;
  sound?: string;
  data?: any;
  imageUrl?: string;
  audioUrl?: string;
  gameTypes?: string[];
}

interface UpdateWordInput extends Partial<CreateWordInput> {
  active?: boolean;
}

interface ListWordsFilter {
  gameType?: string;
  category?: string;
  difficulty?: string;
  active?: boolean;
  search?: string;
}

class WordService {
  async create(data: CreateWordInput) {
    return prismaClient.word.create({ data });
  }

  async list(filter: ListWordsFilter = {}) {
    const { gameType, category, difficulty, active, search } = filter;

    return prismaClient.word.findMany({
      where: {
        ...(active !== undefined && { active }),
        ...(category && { category }),
        ...(difficulty && { difficulty }),
        ...(gameType && { gameTypes: { has: gameType } }),
        ...(search && { text: { contains: search, mode: 'insensitive' } }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const word = await prismaClient.word.findUnique({ where: { id } });

    if (!word) throw new Error('Word not found');

    return word;
  }

  async update(id: string, data: UpdateWordInput) {
    await this.findById(id);

    return prismaClient.word.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.findById(id);

    await prismaClient.word.delete({ where: { id } });

    return { message: 'Word deleted successfully' };
  }
}

export { WordService };
