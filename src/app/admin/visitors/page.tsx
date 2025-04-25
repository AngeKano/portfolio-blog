// app/admin/visitors/page.tsx
import React from "react";
import { prisma } from "@/infrastructure/db/prisma/client";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";

async function getVisitors() {
  const visitors = await prisma.visitor.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return visitors;
}

export default async function VisitorsPage() {
  const visitors = await getVisitors();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Liste des Visiteurs</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date d'inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière mise à jour
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {visitors.length > 0 ? (
                visitors.map((visitor) => (
                  <tr key={visitor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(visitor.createdAt).toLocaleDateString(
                          "fr-FR"
                        )}{" "}
                        (
                        {formatDistance(
                          new Date(visitor.createdAt),
                          new Date(),
                          {
                            addSuffix: true,
                            locale: fr,
                          }
                        )}
                        )
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(visitor.updatedAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {visitor.email}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500"
                  >
                    Aucun visiteur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
