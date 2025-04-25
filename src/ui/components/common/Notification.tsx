// ui/components/common/Notification.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { LuInfo, LuX } from "react-icons/lu";
import { cn } from "../../../lib/utils";
import { Notification as NotificationType } from "../../hooks/useNotification";
import { FaAngleRight, FaCheckCircle, FaCircle } from "react-icons/fa";

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({
  notification,
  onClose,
}) => {
  const [isExiting, setIsExiting] = useState(false);

  // Style et icône en fonction du type
  const typeStyles = {
    success: {
      bg: "bg-green-50 border-green-500",
      icon: <FaCheckCircle className="h-5 w-5 text-green-500" />,
      text: "text-green-800",
    },
    error: {
      bg: "bg-red-50 border-red-500",
      icon: <FaCircle className="h-5 w-5 text-red-500" />,
      text: "text-red-800",
    },
    warning: {
      bg: "bg-yellow-50 border-yellow-500",
      icon: <FaAngleRight className="h-5 w-5 text-yellow-500" />,
      text: "text-yellow-800",
    },
    info: {
      bg: "bg-blue-50 border-blue-500",
      icon: <LuInfo className="h-5 w-5 text-blue-500" />,
      text: "text-blue-800",
    },
  };

  const style = typeStyles[notification.type];

  // Ajouter animation de sortie
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose(notification.id);
    }, 300); // Attendre la fin de l'animation
  };

  // Fermer automatiquement après la durée spécifiée
  useEffect(() => {
    if (notification.duration !== Infinity) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.id, notification.duration]);

  return (
    <div
      className={cn(
        "flex items-start p-4 mb-3 rounded-md border-l-4 shadow-md transition-all duration-300 transform",
        style.bg,
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      )}
    >
      <div className="flex-shrink-0 mr-3">{style.icon}</div>
      <div className="flex-1">
        <p className={cn("text-sm font-medium", style.text)}>
          {notification.message}
        </p>
      </div>
      <button
        title="close"
        onClick={handleClose}
        className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <LuX className="h-5 w-5" />
      </button>
    </div>
  );
};

interface NotificationsContainerProps {
  notifications: NotificationType[];
  onClose: (id: string) => void;
}

const NotificationsContainer: React.FC<NotificationsContainerProps> = ({
  notifications,
  onClose,
}) => {
  // Ne rien afficher s'il n'y a pas de notifications
  if (notifications.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={onClose}
        />
      ))}
    </div>,
    document.body
  );
};

export default NotificationsContainer;
