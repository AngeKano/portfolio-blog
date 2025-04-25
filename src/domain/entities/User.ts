// domain/entities/User.ts
export interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    other?: string;
  }
  
  export enum UserRole {
    ADMIN = 'ADMIN',
    VISITOR = 'VISITOR',
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    password?: string; // Optional car peut être null avec auth sociale
    emailVerified?: Date;
    image?: string;
    role: UserRole;
    social?: SocialLinks;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface VisitorUser {
    id: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  // Factory functions
  export function createUser(
    id: string,
    name: string,
    email: string,
    role: UserRole,
    options?: {
      password?: string;
      emailVerified?: Date;
      image?: string;
      social?: SocialLinks;
    }
  ): User {
    return {
      id,
      name,
      email,
      password: options?.password,
      emailVerified: options?.emailVerified,
      image: options?.image,
      role,
      social: options?.social,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  export function createVisitorUser(id: string, email: string): VisitorUser {
    return {
      id,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }