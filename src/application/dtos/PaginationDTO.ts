// src/application/dtos/PaginationDTO.ts

/**
 * Options de pagination
 */
export interface PaginationOptions {
    page?: number;
    limit?: number;
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }
  
  /**
   * Résultat paginé
   */
  export interface PaginatedResult<T> {
    data: T[];
    pagination: PaginationMeta;
  }
  
  /**
   * Métadonnées de pagination
   */
  export interface PaginationMeta {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }
  
  /**
   * Créer des métadonnées de pagination
   */
  export function createPaginationMeta(
    currentPage: number,
    pageSize: number,
    totalItems: number
  ): PaginationMeta {
    const totalPages = Math.ceil(totalItems / pageSize);
    
    return {
      currentPage,
      pageSize,
      totalItems,
      totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }