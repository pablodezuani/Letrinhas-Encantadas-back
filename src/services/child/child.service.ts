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
  parentId: string;
}

export class ChildService {
  async create(data: CreateChildInput) {
    const child = await prismaClient.child.create({
      data,
    });

    return child;
  }

  async findAllWithParent() {
    return prismaClient.child.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findByParent(parentId: string) {
    return prismaClient.child.findMany({
      where: {
        parentId,
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}
