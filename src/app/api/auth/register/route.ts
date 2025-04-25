// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/infrastructure/db/prisma/client";
import { RegisterUserUseCase } from "@/application/useCases/user/RegisterUserUseCase";
import { PrismaUserRepository } from "@/infrastructure/db/prisma/repositories/PrismaUserRepository";

// Schéma de validation
const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export async function POST(request: NextRequest) {
  try {
    // Parser et valider le corps de la requête
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { name, email, password } = validationResult.data;

    // Initialiser le repository et le cas d'utilisation
    const userRepository = new PrismaUserRepository(prisma);
    const registerUserUseCase = new RegisterUserUseCase(userRepository);

    // Enregistrer un nouvel admin
    const user = await registerUserUseCase.registerAdmin({
      name,
      email,
      password,
    });

    // Retourner l'utilisateur créé sans mot de passe
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    console.error("Erreur lors de l'enregistrement:", error);

    // Gérer les erreurs spécifiques
    if (error.message === "Un utilisateur avec cet email existe déjà") {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'enregistrement" },
      { status: 500 }
    );
  }
}
