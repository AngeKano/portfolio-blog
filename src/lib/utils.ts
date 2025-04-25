// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine et optimise les classes CSS avec Tailwind
 * Utilise clsx pour combiner conditionnellement les classes
 * et tailwind-merge pour éliminer les duplications et conflits
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}