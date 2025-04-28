'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { LuCalendar, LuClock, LuEye, LuHeart } from 'react-icons/lu';

interface ArticleMetaProps {
  publishedAt: string | Date | null;
  readingTime: string;
  views: number;
  likes: number;
}

const ArticleMeta: React.FC<ArticleMetaProps> = ({ publishedAt, readingTime, views, likes }) => {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
      {/* Date de publication */}
      {publishedAt && (
        <div className="flex items-center">
          <LuCalendar className="w-4 h-4 mr-1" />
          <span>
            {formatDistanceToNow(new Date(publishedAt), {
              addSuffix: true,
              locale: fr,
            })}
          </span>
        </div>
      )}

      {/* Temps de lecture */}
      <div className="flex items-center">
        <LuClock className="w-4 h-4 mr-1" />
        <span>{readingTime}</span>
      </div>

      {/* Vues */}
      <div className="flex items-center">
        <LuEye className="w-4 h-4 mr-1" />
        <span>{views} vues</span>
      </div>

      {/* Likes */}
      <div className="flex items-center">
        <LuHeart className="w-4 h-4 mr-1" />
        <span>{likes} likes</span>
      </div>
    </div>
  );
};

export default ArticleMeta;