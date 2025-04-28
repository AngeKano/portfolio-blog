// ui/hooks/useAnalytics.ts
"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useNotificationContext } from "../context/NotificationContext";

type ContentType = "article" | "project";

export function useAnalytics() {
  const { data: session } = useSession();
  const { error: showError } = useNotificationContext();

  /**
   * Enregistre une vue sur un article ou un projet
   */
  const trackView = useCallback(async (id: string, type: ContentType) => {
    try {
      await fetch("/api/analytics/track-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, type }),
      });
    } catch (error) {
      console.error(`Erreur lors du suivi de vue pour ${type}:`, error);
    }
  }, []);

  /**
   * Enregistre un like sur un article ou un projet
   */
  const trackLike = useCallback(
    async (id: string, type: ContentType) => {
      try {
        // Vérifier si l'utilisateur est connecté
        if (!session) {
          showError("Vous devez être connecté pour effectuer cette action");
          return false;
        }

        const response = await fetch("/api/analytics/track-like", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, type }),
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Erreur lors du suivi de like");
        }

        return true;
      } catch (error) {
        console.error(`Erreur lors du suivi de like pour ${type}:`, error);
        showError("Une erreur est survenue");
        return false;
      }
    },
    [session, showError]
  );

  return {
    trackView,
    trackLike,
  };
}
