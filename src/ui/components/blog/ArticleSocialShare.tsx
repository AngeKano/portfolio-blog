"use client";

import React from "react";
import {
  LuFacebook,
  LuTwitter,
  LuLinkedin,
  LuLink,
  LuHeart,
} from "react-icons/lu";
import { useNotificationContext } from "../../context/NotificationContext";
import { useAnalytics } from "../../hooks/useAnalytics";

interface ArticleSocialShareProps {
  title: string;
  url: string;
  description: string;
}

const ArticleSocialShare: React.FC<ArticleSocialShareProps> = ({
  title,
  url,
  description,
}) => {
  const { success } = useNotificationContext();
  const { trackLike } = useAnalytics();
  const fullUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }${url}`;

  const handleLike = async () => {
    const articleId = url.split("/").pop();
    if (!articleId) return;

    const liked = await trackLike(articleId, "article");

    if (liked) {
      success("Merci pour votre like !");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
    success("Lien copié dans le presse-papier !");
  };

  return (
    <div className="flex flex-col justify-center py-6 border-t border-b border-gray-200">
      <h3 className="text-center font-medium text-gray-700 mb-4">
        Partager cet article
      </h3>
      <div className="flex justify-center space-x-4">
        {/* Bouton Like */}
        <button
          onClick={handleLike}
          className="flex items-center justify-center p-3 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
          aria-label="Like"
        >
          <LuHeart className="w-5 h-5" />
        </button>

        {/* Facebook */}
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            fullUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          aria-label="Partager sur Facebook"
        >
          <LuFacebook className="w-5 h-5" />
        </a>

        {/* Twitter */}
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(fullUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-full bg-cyan-50 text-cyan-600 hover:bg-cyan-100 transition-colors"
          aria-label="Partager sur Twitter"
        >
          <LuTwitter className="w-5 h-5" />
        </a>

        {/* LinkedIn */}
        <a
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            fullUrl
          )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
            description
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center p-3 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
          aria-label="Partager sur LinkedIn"
        >
          <LuLinkedin className="w-5 h-5" />
        </a>

        {/* Copier le lien */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center p-3 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
          aria-label="Copier le lien"
        >
          <LuLink className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ArticleSocialShare;
