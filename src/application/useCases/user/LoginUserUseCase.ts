// application/useCases/user/LoginUserUseCase.ts
import { UserRepository } from "@/domain/repositories/UserRepository";
import { PasswordService } from "@/infrastructure/services/auth/PasswordService";
import { User, UserRole } from "@/domain/entities/User";
import { LoginDTO, UserInfoDTO } from "@/application/dtos/UserDTO";

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  /**
   * Authentifie un utilisateur admin avec email et mot de passe
   */
  async loginAdmin(credentials: LoginDTO): Promise<UserInfoDTO> {
    // Trouver l'utilisateur admin par email
    const user = await this.userRepository.findAdminByEmail(credentials.email);

    // Vérifier si l'utilisateur existe et est bien un admin
    if (!user || user.role !== UserRole.ADMIN) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Vérifier le mot de passe
    if (!user.password) {
      throw new Error("Méthode d'authentification non valide");
    }

    const isPasswordValid = await PasswordService.verifyPassword(
      credentials.password,
      user.password
    );

    if (!isPasswordValid) {
      throw new Error("Email ou mot de passe incorrect");
    }

    // Retourner les informations de l'utilisateur sans le mot de passe
    return this.mapToUserInfoDTO(user);
  }

  /**
   * Transforme une entité User en DTO sécurisé sans le mot de passe
   */
  private mapToUserInfoDTO(user: User): UserInfoDTO {
    const { password, ...userInfo } = user;
    return userInfo as UserInfoDTO;
  }
}
