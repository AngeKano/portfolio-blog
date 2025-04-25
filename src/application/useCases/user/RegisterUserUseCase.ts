// application/useCases/user/RegisterUserUseCase.ts
import { CreateAdminDTO, UserInfoDTO } from "@/application/dtos/UserDTO";
import { User, UserRole } from "@/domain/entities/User";
import { UserRepository } from "@/domain/repositories/UserRepository";
import { PasswordService } from "@/infrastructure/services/auth/PasswordService";

export class RegisterUserUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Enregistre un nouvel administrateur
   */
  async registerAdmin(userData: CreateAdminDTO): Promise<UserInfoDTO> {
    // Vérifier si un utilisateur avec cet email existe déjà
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("Un utilisateur avec cet email existe déjà");
    }

    // Hacher le mot de passe
    const hashedPassword = await PasswordService.hashPassword(
      userData.password
    );

    // Créer le nouvel utilisateur admin
    const newAdmin = await this.userRepository.createAdmin({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      image: userData.image,
      social: userData.social,
    });

    // Retourner les informations de l'utilisateur sans le mot de passe
    return this.mapToUserInfoDTO(newAdmin);
  }

  /**
   * Enregistre un visiteur (utilisateur simple)
   */
  async registerVisitor(email: string): Promise<void> {
    // Vérifier si ce visiteur existe déjà
    const existingVisitor = await this.userRepository.findVisitorByEmail(email);

    // Si le visiteur n'existe pas, l'enregistrer
    if (!existingVisitor) {
      await this.userRepository.createVisitor(email);
    }
    // Sinon, on ne fait rien (le visiteur est déjà enregistré)
  }

  /**
   * Transforme une entité User en DTO sécurisé sans le mot de passe
   */
  private mapToUserInfoDTO(user: User): UserInfoDTO {
    const { password, ...userInfo } = user;
    return userInfo as UserInfoDTO;
  }
}
