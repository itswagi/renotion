import type { ClassValue } from 'clsx';
import clsx from 'clsx';

export * from './hover-manager.js';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
