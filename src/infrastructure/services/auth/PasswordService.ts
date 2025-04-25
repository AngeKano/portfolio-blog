// infrastructure/services/auth/PasswordService.ts
import bcrypt from 'bcryptjs';

export class PasswordService {
  /**
   * Hache un mot de passe en clair avec bcrypt
   * @param plainPassword Le mot de passe en clair
   * @returns Le mot de passe haché
   */
  static async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(12); // Facteur de coût de 12
    return bcrypt.hash(plainPassword, salt);
  }

  /**
   * Vérifie si un mot de passe en clair correspond à un hash
   * @param plainPassword Le mot de passe en clair
   * @param hashedPassword Le mot de passe haché
   * @returns True si le mot de passe correspond, sinon false
   */
  static async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}