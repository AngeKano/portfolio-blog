// ui/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Session } from "next-auth";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "../../domain/entities/User";

// Type pour le context d'authentification
interface AuthContextType {
  session: Session | null;
  status: "authenticated" | "loading" | "unauthenticated";
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  socialLogin: (provider: "google" | "github") => Promise<void>;
}

// Créer le Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};

// Provider du Context
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Déterminer si l'utilisateur est authentifié et s'il est admin
  const isAuthenticated = status === "authenticated" && !!session;
  const isAdmin = isAuthenticated && session?.user?.role === UserRole.ADMIN;

  // Fonction de connexion avec email/mot de passe
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response?.error) {
        return false;
      }

      // Rediriger en fonction du rôle de l'utilisateur
      if (response?.ok) {
        if (isAdmin) {
          router.push("/admin");
        } else {
          router.push("/");
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Erreur de connexion:", error);
      return false;
    }
  };

  // Fonction de déconnexion
  const logout = async (): Promise<void> => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  // Fonction de connexion avec Google ou GitHub
  const socialLogin = async (provider: "google" | "github"): Promise<void> => {
    await signIn(provider, { callbackUrl: "/" });
  };

  // Valeur du context
  const value: AuthContextType = {
    session,
    status,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    socialLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
