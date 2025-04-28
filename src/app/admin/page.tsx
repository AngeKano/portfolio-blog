// app/admin/page.tsx
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/auth.config';
import { AnalyticsService } from '../../infrastructure/services/analytics/AnalyticsService';

// Statistiques basiques pour le dashboard
async function getStats() {
  const analyticsService = new AnalyticsService();
  
  // Récupérer les statistiques générales
  const generalStats = await analyticsService.getSiteStats();
  
  // Articles récents
  const recentArticles = await analyticsService.getMostViewedArticles(5);
  
  // Projets récents
  const recentProjects = await analyticsService.getMostViewedProjects(5);
  
  return {
    ...generalStats,
    recentArticles,
    recentProjects,
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Bienvenue, {session?.user?.name || 'Admin'}</h2>
        <p className="text-gray-600">
          Gérez votre portfolio et votre blog depuis cet espace d'administration.
        </p>
      </div>
      
      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Articles" value={stats.articlesCount} icon="📝" />
        <StatCard title="Projets" value={stats.projectsCount} icon="🚀" />
        <StatCard title="Visiteurs" value={stats.visitorsCount} icon="👥" />
        <StatCard title="Commentaires" value={stats.commentsCount} icon="💬" />
      </div>
      
      {/* Métriques d'engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Engagement</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">👁️</div>
              <div>
                <div className="text-xl font-bold">{stats.totalViews}</div>
                <div className="text-gray-500 text-sm">Vues totales</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-2xl mr-3">❤️</div>
              <div>
                <div className="text-xl font-bold">{stats.totalLikes}</div>
                <div className="text-gray-500 text-sm">Likes totaux</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-2">Taux de conversion</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <div className="text-2xl mr-3">🔄</div>
              <div>
                <div className="text-xl font-bold">
                  {stats.totalLikes > 0 && stats.totalViews > 0
                    ? `${((stats.totalLikes / stats.totalViews) * 100).toFixed(1)}%`
                    : '0%'}
                </div>
                <div className="text-gray-500 text-sm">Vues → Likes</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="text-2xl mr-3">💌</div>
              <div>
                <div className="text-xl font-bold">
                  {stats.commentsCount > 0 && stats.visitorsCount > 0
                    ? `${((stats.commentsCount / stats.visitorsCount) * 100).toFixed(1)}%`
                    : '0%'}
                </div>
                <div className="text-gray-500 text-sm">Visiteurs → Commentaires</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Articles récents */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Articles récents</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {stats.recentArticles.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Likes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentArticles.map((article) => (
                  <tr key={article.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : 'Non publié'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.views}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.likes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun article à afficher
            </div>
          )}
        </div>
      </div>
      
      {/* Projets récents */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Projets récents</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {stats.recentProjects.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentProjects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{project.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {project.endDate
                          ? new Date(project.endDate).toLocaleDateString()
                          : 'En cours'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {project.views}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-4 text-center text-gray-500">
              Aucun projet à afficher
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Composant pour les cartes de statistiques
function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex items-center">
        <div className="text-2xl mr-3">{icon}</div>
        <div>
          <div className="text-xl font-bold">{value}</div>
          <div className="text-gray-500 text-sm">{title}</div>
        </div>
      </div>
    </div>
  );
}