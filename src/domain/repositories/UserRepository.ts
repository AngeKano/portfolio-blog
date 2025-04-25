// domain/repositories/UserRepository.ts
import { User, VisitorUser, UserRole } from '../entities/User';

export interface UserRepository {
  // Méthodes générales
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<boolean>;

  // Méthodes spécifiques pour l'admin
  findAdminByEmail(email: string): Promise<User | null>;
  createAdmin(adminData: Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>): Promise<User>;
  
  // Méthodes pour les visiteurs
  findVisitorByEmail(email: string): Promise<VisitorUser | null>;
  createVisitor(email: string): Promise<VisitorUser>;
  getAllVisitors(): Promise<VisitorUser[]>;
  
  // Méthodes pour les statistiques admin
  getVisitorCount(): Promise<number>;
}