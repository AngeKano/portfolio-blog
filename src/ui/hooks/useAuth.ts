// ui/hooks/useAuth.ts
"use client";

import { useContext } from "react";
import AuthContext from "../context/AuthContext";

/**
 * Hook personnalisé pour utiliser le contexte d'authentification
 * Ce hook simplifie l'accès au contexte d'authentification dans les composants
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuth doit être utilisé à l'intérieur d'un AuthProvider"
    );
  }
  return context;
};
