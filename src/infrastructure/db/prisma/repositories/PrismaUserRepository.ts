// infrastructure/db/prisma/repositories/PrismaUserRepository.ts
import { PrismaClient } from '@prisma/client';
import { User, VisitorUser, UserRole, SocialLinks } from '../../../../domain/entities/User';
import { UserRepository } from '../../../../domain/repositories/UserRepository';

export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });

    if (!user) return null;

    return this.mapPrismaUserToDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    return this.mapPrismaUserToDomain(user);
  }

  async findAdminByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: { 
        email,
        role: UserRole.ADMIN 
      }
    });

    if (!user) return null;

    return this.mapPrismaUserToDomain(user);
  }

  async create(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        emailVerified: userData.emailVerified,
        image: userData.image,
        role: userData.role,
        social: userData.social as any
      }
    });

    return this.mapPrismaUserToDomain(user);
  }

  async createAdmin(adminData: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const admin = await this.prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: adminData.password,
        emailVerified: adminData.emailVerified,
        image: adminData.image,
        role: UserRole.ADMIN,
        social: adminData.social as any
      }
    });

    return this.mapPrismaUserToDomain(admin);
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        emailVerified: userData.emailVerified,
        image: userData.image,
        role: userData.role,
        social: userData.social as any
      }
    });

    return this.mapPrismaUserToDomain(user);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findVisitorByEmail(email: string): Promise<VisitorUser | null> {
    const visitor = await this.prisma.visitor.findUnique({
      where: { email }
    });

    if (!visitor) return null;

    return {
      id: visitor.id,
      email: visitor.email,
      createdAt: visitor.createdAt,
      updatedAt: visitor.updatedAt
    };
  }

  async createVisitor(email: string): Promise<VisitorUser> {
    const visitor = await this.prisma.visitor.create({
      data: { email }
    });

    return {
      id: visitor.id,
      email: visitor.email,
      createdAt: visitor.createdAt,
      updatedAt: visitor.updatedAt
    };
  }

  async getAllVisitors(): Promise<VisitorUser[]> {
    const visitors = await this.prisma.visitor.findMany();
    
    return visitors.map(visitor => ({
      id: visitor.id,
      email: visitor.email,
      createdAt: visitor.createdAt,
      updatedAt: visitor.updatedAt
    }));
  }

  async getVisitorCount(): Promise<number> {
    return await this.prisma.visitor.count();
  }

  // Méthode utilitaire pour mapper l'utilisateur Prisma vers notre entité de domaine
  private mapPrismaUserToDomain(prismaUser: any): User {
    return {
      id: prismaUser.id,
      name: prismaUser.name || '',
      email: prismaUser.email,
      password: prismaUser.password,
      emailVerified: prismaUser.emailVerified,
      image: prismaUser.image,
      role: prismaUser.role as UserRole,
      social: prismaUser.social as SocialLinks,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt
    };
  }
}