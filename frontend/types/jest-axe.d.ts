declare module 'jest-axe' {
  import { AxeResults } from 'axe-core';
  export function axe(container: HTMLElement | string, options?: any): Promise<AxeResults>;
  export const toHaveNoViolations: any;
}
