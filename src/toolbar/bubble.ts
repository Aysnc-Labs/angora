export interface BubbleAPI {
  show: (el: Element, onSelect: (el: Element) => void) => void;
  hide: () => void;
  reposition: () => void;
  onDone: (cb: () => void) => void;
  updatePreview: () => void;
}

/** Build breadcrumb segments from element up to body. */
function buildBreadcrumb(
  el: Element,
  onSelect: (el: Element) => void,
): DocumentFragment {
  const frag = document.createDocumentFragment();
  const chain: Element[] = [];

  let current: Element | null = el;
  while (current && current !== document.documentElement) {
    chain.unshift(current);
    if (current === document.body) break;
    current = current.parentElement;
  }

  chain.forEach((node, i) => {
    if (i > 0) {
      const sep = document.createElement("span");
      sep.className = "angora-breadcrumb-sep";
      sep.textContent = ">";
      frag.appendChild(sep);
    }

    const btn = document.createElement("button");
    btn.textContent = node.tagName.toLowerCase();
    if (node.id) btn.textContent += `#${node.id}`;

    // Clicking a breadcrumb segment re-selects that ancestor
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      onSelect(node);
    });

    frag.appendChild(btn);
  });

  return frag;
}

export function createBubble(canvas: ShadowRoot): BubbleAPI {
  const container = document.createElement("div");
  container.className = "angora-bubble";

  // Breadcrumb bar
  const breadcrumb = document.createElement("nav");
  breadcrumb.className = "angora-breadcrumb";

  // Text preview
  const preview = document.createElement("div");
  preview.className = "angora-preview";

  // Chat input (disabled shell)
  const chatWrap = document.createElement("div");
  chatWrap.className = "angora-chat";
  const chatInput = document.createElement("input");
  chatInput.type = "text";
  chatInput.placeholder = "Type a command...";
  chatInput.disabled = true;
  chatWrap.appendChild(chatInput);

  // Done button
  const doneBtn = document.createElement("button");
  doneBtn.className = "angora-done";
  doneBtn.textContent = "Done";

  container.appendChild(breadcrumb);
  container.appendChild(preview);
  container.appendChild(chatWrap);
  container.appendChild(doneBtn);
  canvas.appendChild(container);

  let selectedEl: Element | null = null;
  let doneCallback: (() => void) | null = null;

  doneBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    doneCallback?.();
  });

  function positionBubble() {
    if (!selectedEl) return;

    const rect = selectedEl.getBoundingClientRect();
    const bubbleRect = container.getBoundingClientRect();
    const gap = 8;
    const margin = 12;

    // Default: below the element
    let top = rect.bottom + gap;
    let left = rect.left;

    // Flip above if not enough space below
    if (top + bubbleRect.height > window.innerHeight - margin) {
      top = rect.top - bubbleRect.height - gap;
    }

    // Clamp to stay within viewport horizontally
    if (left + bubbleRect.width > window.innerWidth - margin) {
      left = window.innerWidth - bubbleRect.width - margin;
    }
    if (left < margin) {
      left = margin;
    }

    // Clamp top
    if (top < margin) {
      top = margin;
    }

    container.style.top = `${top}px`;
    container.style.left = `${left}px`;
  }

  function show(el: Element, onSelect: (el: Element) => void) {
    selectedEl = el;

    // Update breadcrumb
    breadcrumb.innerHTML = "";
    breadcrumb.appendChild(buildBreadcrumb(el, onSelect));

    // Update preview
    const text = el.textContent?.trim() ?? "";
    preview.textContent = text.length > 120 ? text.slice(0, 120) + "..." : text;

    container.classList.add("angora-bubble--visible");

    // Position after rendering so we can measure
    requestAnimationFrame(() => positionBubble());
  }

  function hide() {
    selectedEl = null;
    container.classList.remove("angora-bubble--visible");
  }

  function reposition() {
    if (selectedEl) positionBubble();
  }

  function onDone(cb: () => void) {
    doneCallback = cb;
  }

  function updatePreview() {
    if (!selectedEl) return;
    const text = selectedEl.textContent?.trim() ?? "";
    preview.textContent = text.length > 120 ? text.slice(0, 120) + "..." : text;
  }

  return { show, hide, reposition, onDone, updatePreview };
}
