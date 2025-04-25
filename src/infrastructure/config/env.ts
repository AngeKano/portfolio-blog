// infrastructure/config/env.ts
import { z } from 'zod';

/**
 * Spécifie les variables d'environnement requises et leurs types
 * Utilise Zod pour la validation
 */
const envSchema = z.object({
  // URL de base
  NEXTAUTH_URL: z.string().url().optional().default('http://localhost:3000'),
  
  // Secret pour NextAuth
  NEXTAUTH_SECRET: z.string().min(1),
  
  // URL de la base de données
  DATABASE_URL: z.string().min(1),
  
  // Identifiants OAuth pour Google
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  
  // Identifiants OAuth pour GitHub
  GITHUB_ID: z.string().optional(),
  GITHUB_SECRET: z.string().optional(),

  // Clé API pour Google Analytics
  GA_MEASUREMENT_ID: z.string().optional(),
  
  // API pour S3 ou autre service de stockage
  S3_UPLOAD_KEY: z.string().optional(),
  S3_UPLOAD_SECRET: z.string().optional(),
  S3_UPLOAD_REGION: z.string().optional(),
  S3_UPLOAD_BUCKET: z.string().optional(),
  
  // Environnement
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Valide les variables d'environnement au démarrage
 * Échoue rapidement si des configurations nécessaires manquent
 */
function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'));
      throw new Error(`❌ Variables d'environnement manquantes ou invalides: ${missingVars.join(', ')}`);
    }
    throw error;
  }
}

/**
 * Variables d'environnement validées, utilisées dans l'application
 */
export const env = validateEnv();

/**
 * Détermine si l'application est en production
 */
export const isProd = env.NODE_ENV === 'production';

/**
 * Détermine si l'application est en développement
 */
export const isDev = env.NODE_ENV === 'development';

/**
 * Détermine si l'application est en test
 */
export const isTest = env.NODE_ENV === 'test';