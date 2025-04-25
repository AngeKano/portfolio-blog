// ui/hooks/useNotification.ts
"use client";

import { useState, useCallback, useEffect } from "react";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

const DEFAULT_DURATION = 5000; // 5 secondes par défaut

export const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fonction pour ajouter une notification
  const addNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newNotification = {
        ...notification,
        id,
        duration: notification.duration || DEFAULT_DURATION,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Supprimer automatiquement après la durée spécifiée
      if (newNotification.duration !== Infinity) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    []
  );

  // Fonctions d'aide pour chaque type de notification
  const success = useCallback(
    (message: string, duration?: number) =>
      addNotification({ type: "success", message, duration }),
    [addNotification]
  );

  const error = useCallback(
    (message: string, duration?: number) =>
      addNotification({ type: "error", message, duration }),
    [addNotification]
  );

  const info = useCallback(
    (message: string, duration?: number) =>
      addNotification({ type: "info", message, duration }),
    [addNotification]
  );

  const warning = useCallback(
    (message: string, duration?: number) =>
      addNotification({ type: "warning", message, duration }),
    [addNotification]
  );

  // Fonction pour supprimer une notification
  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  // Nettoyer toutes les notifications lors du démontage
  useEffect(() => {
    return () => {
      setNotifications([]);
    };
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
    warning,
  };
};
