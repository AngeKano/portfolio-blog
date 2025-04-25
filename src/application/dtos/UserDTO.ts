// application/dtos/UserDTO.ts
import { SocialLinks, UserRole } from "@/domain/entities/User";

// DTO pour la création d'un admin
export interface CreateAdminDTO {
  name: string;
  email: string;
  password: string;
  image?: string;
  social?: SocialLinks;
}

// DTO pour la connexion
export interface LoginDTO {
  email: string;
  password: string;
}

// DTO pour les informations d'un utilisateur (sécurisé, sans mot de passe)
export interface UserInfoDTO {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  role: UserRole;
  social?: SocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

// DTO pour enregistrer un visiteur
export interface VisitorDTO {
  email: string;
}

// DTO pour la mise à jour d'un profil
export interface UpdateProfileDTO {
  name?: string;
  email?: string;
  password?: string;
  image?: string;
  social?: SocialLinks;
}
