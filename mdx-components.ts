import type { MDXComponents } from "mdx/types";

import { A as a } from "@/src/components/mdx/a";
import { Blockquote as blockquote } from "@/src/components/mdx/blockquote";
import { Callout } from "@/src/components/mdx/callout";
import { Caption } from "@/src/components/mdx/caption";
import { Code as code } from "@/src/components/mdx/code";
import { Figure } from "@/src/components/mdx/figure";
import { FootNote,FootNotes, Ref } from "@/src/components/mdx/footnotes";
import { H1 as h1 } from "@/src/components/mdx/h1";
import { H2 as h2 } from "@/src/components/mdx/h2";
import { H3 as h3 } from "@/src/components/mdx/h3";
import { HR as hr } from "@/src/components/mdx/hr";
import { Image } from "@/src/components/mdx/image";
import { LI as li } from "@/src/components/mdx/li";
import { OL as ol } from "@/src/components/mdx/ol";
import { P as p } from "@/src/components/mdx/p";
import { Snippet } from "@/src/components/mdx/snippet";
import { Tweet } from "@/src/components/mdx/tweet";
import { UL as ul } from "@/src/components/mdx/ul";
import { YouTube } from "@/src/components/mdx/youtube";

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
    Tweet,
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
