import type { MDXComponents } from "mdx/types";
import {
  MdxH1, MdxH2, MdxH3, MdxP, MdxUl, MdxOl,
  MdxStrong, MdxCode, MdxPre, MdxLi, MdxBlockquote, MdxHr,
} from "@/chrome/MdxElements";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: MdxH1,
    h2: MdxH2,
    h3: MdxH3,
    p: MdxP,
    ul: MdxUl,
    ol: MdxOl,
    strong: MdxStrong,
    code: MdxCode,
    pre: MdxPre,
    li: MdxLi,
    blockquote: MdxBlockquote,
    hr: MdxHr,
    ...components,
  };
}
