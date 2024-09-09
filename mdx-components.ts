import type { MDXComponents } from 'mdx/types';
import CustomComponents from '@/components/ui';

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...CustomComponents,
  };
}
