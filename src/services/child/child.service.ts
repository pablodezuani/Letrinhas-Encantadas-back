import prismaClient from "../../prisma";

interface CreateChildInput {
  name: string;
  nickname?: string;
  age?: number;
  gender?: string;
  photo?: string;
  hasAutism?: string;
  autismLevel?: string;
  aboutMe?: string;
  specialInterests?: string[];
  routine?: string;
  communication?: string;
  likes?: string[];
  dislikes?: string[];
  skills?: string[];
  sensoryNeeds?: string;
  howToHelp?: string;
  whenFrustrated?: string;
  whenNeedsAttention?: string;
  difficulties?: string[];
  medicalInfo?: string;
  autismInfo?: string;
  medications?: string[];
  allergies?: string[];
  color?: string;
  lightColor?: string;
  emoji?: string;
  nextAppointment?: string;
  therapies?: any;
  emergencyContacts?: any;
  parentId: string;
}

type UpdateChildInput = Partial<Omit<CreateChildInput, 'parentId'>>;

export class ChildService {
  async create(data: CreateChildInput) {
    const child = await prismaClient.child.create({ data });
    return child;
  }

  async update(id: string, parentId: string, data: UpdateChildInput) {
    const child = await prismaClient.child.findFirst({ where: { id, parentId } });
    if (!child) throw new Error('Child not found or access denied');

    return prismaClient.child.update({ where: { id }, data });
  }

  async delete(id: string, parentId: string) {
    const child = await prismaClient.child.findFirst({ where: { id, parentId } });
    if (!child) throw new Error('Child not found or access denied');

    await prismaClient.child.delete({ where: { id } });
    return { message: 'Child deleted' };
  }

  async findAllWithParent() {
    return prismaClient.child.findMany({
      include: {
        parent: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findByParent(parentId: string) {
    return prismaClient.child.findMany({
      where: { parentId },
      include: {
        parent: { select: { id: true, name: true, email: true } },
        gameSessions: {
          orderBy: { playedAt: 'desc' },
          take: 5,
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
