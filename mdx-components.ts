import CustomComponents from '@/components/ui';
import type { MDXComponents } from 'mdx/types';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...CustomComponents,
  };
}
