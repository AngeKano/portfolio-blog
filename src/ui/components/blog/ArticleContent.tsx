"use client";

import React from "react";

interface ArticleContentProps {
  content: string;
}

const ArticleContent: React.FC<ArticleContentProps> = ({ content }) => {
  // Fonction simple pour convertir les sauts de ligne en paragraphes
  const formatText = (text: string) => {
    return text
      .split("\n\n")
      .filter((paragraph) => paragraph.trim() !== "")
      .map((paragraph, index) => (
        <p key={index} className="my-4">
          {paragraph.replace(/\n/g, " ")}
        </p>
      ));
  };

  return <div className="prose prose-lg max-w-none">{formatText(content)}</div>;
};

export default ArticleContent;
