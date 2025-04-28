import React from "react";
import Link from "next/link";
import {
  LuGithub,
  LuLinkedin,
  LuTwitter,
  LuMail,
  LuExternalLink,
} from "react-icons/lu";

const PublicFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-bold">
              Portfolio<span className="text-primary-500">Blog</span>
            </Link>
            <p className="mt-3 text-gray-400">
              Un portfolio et blog personnel dédié au développement web, à la
              programmation et aux bonnes pratiques de développement.
            </p>
          </div>

          {/* Navigation rapide */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Projets
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux sociaux et contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:contact@exemple.com"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <LuMail className="mr-2" /> contact@exemple.com
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <LuGithub className="mr-2" /> GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <LuLinkedin className="mr-2" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/username"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <LuTwitter className="mr-2" /> Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-wrap items-center justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} PortfolioBlog. Tous droits réservés.
          </p>

          {/* Admin login */}
          <Link
            href="/login"
            className="text-gray-500 hover:text-gray-300 text-sm flex items-center mt-4 sm:mt-0"
          >
            <LuExternalLink className="mr-1 w-4 h-4" />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
