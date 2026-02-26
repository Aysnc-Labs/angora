export interface Change {
  type: "text";
  selector: string;
  xpath: string;
  tagName: string;
  before: string;
  after: string;
}

export interface Diff {
  timestamp: string;
  url: string;
  changes: Change[];
}

/** Walk up the DOM to build a CSS selector using nth-of-type, stopping at an id or body. */
export function buildCssSelector(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current !== document.documentElement) {
    if (current === document.body) {
      parts.unshift("body");
      break;
    }

    const tag = current.tagName.toLowerCase();

    // Stop at an element with an id
    if (current.id) {
      parts.unshift(`#${CSS.escape(current.id)}`);
      break;
    }

    const node: Element = current;
    const parent: Element | null = node.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c: Element) => c.tagName === node.tagName,
      );
      if (siblings.length > 1) {
        const index = siblings.indexOf(node) + 1;
        parts.unshift(`${tag}:nth-of-type(${index})`);
      } else {
        parts.unshift(tag);
      }
    } else {
      parts.unshift(tag);
    }

    current = parent;
  }

  return parts.join(" > ");
}

/** Build an XPath for the element, stopping at body. */
export function buildXPath(el: Element): string {
  const parts: string[] = [];
  let current: Element | null = el;

  while (current && current !== document.documentElement) {
    if (current === document.body) {
      parts.unshift("/html/body");
      break;
    }

    const tag = current.tagName.toLowerCase();
    const node: Element = current;
    const parent: Element | null = node.parentElement;

    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c: Element) => c.tagName === node.tagName,
      );
      const index = siblings.indexOf(node) + 1;
      parts.unshift(`${tag}[${index}]`);
    } else {
      parts.unshift(tag);
    }

    current = parent;
  }

  // If we didn't reach body (shouldn't happen), prefix with //
  if (parts.length > 0 && !parts[0].startsWith("/")) {
    parts.unshift("");
  }

  return parts.join("/") || "//" + el.tagName.toLowerCase();
}

/** Serialize all tracked changes into a structured diff. */
export function serializeDiff(
  originalContent: Map<Element, string>,
): Diff {
  const changes: Change[] = [];

  for (const [el, before] of originalContent) {
    const after = el.textContent ?? "";
    if (before !== after) {
      changes.push({
        type: "text",
        selector: buildCssSelector(el),
        xpath: buildXPath(el),
        tagName: el.tagName.toLowerCase(),
        before,
        after,
      });
    }
  }

  return {
    timestamp: new Date().toISOString(),
    url: window.location.pathname,
    changes,
  };
}
