import type { MDXComponents } from 'mdx/types';

import { A as a } from '@/components/ui/a';
import { Blockquote as blockquote } from '@/components/ui/blockquote';
import { Callout } from '@/components/ui/callout';
import { Caption } from '@/components/ui/caption';
import { Code as code } from '@/components/ui/code';
import { Figure } from '@/components/ui/figure';
import { FootNote, FootNotes, Ref } from '@/components/ui/footnotes';
import { H1 as h1 } from '@/components/ui/h1';
import { H2 as h2 } from '@/components/ui/h2';
import { H3 as h3 } from '@/components/ui/h3';
import { HR as hr } from '@/components/ui/hr';
import { Image } from '@/components/ui/image';
import { LI as li } from '@/components/ui/li';
import { OL as ol } from '@/components/ui/ol';
import { P as p } from '@/components/ui/p';
import { Snippet } from '@/components/ui/snippet';
import { UL as ul } from '@/components/ui/ul';
import { YouTube } from '@/components/ui/youtube';

export function useMDXComponents(components: MDXComponents) {
  return {
    ...components,
    a,
    h1,
    h2,
    h3,
    p,
    ol,
    ul,
    li,
    hr,
    code,
    pre: Snippet,
    img: Image,
    blockquote,
    Image,
    Figure,
    Snippet,
    Caption,
    Callout,
    YouTube,
    Ref,
    FootNotes,
    FootNote,
  };
}
