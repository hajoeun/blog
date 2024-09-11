import CustomComponents from '@/components/ui';
import { MDXComponents } from '@mdx-js/react/lib';

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    ...CustomComponents,
  };
}
