import type { ClassValue } from 'clsx';
import clsx from 'clsx';

export * from './hover-manager';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
