import { createBubble, type BubbleAPI } from "./bubble";
import { createObserver } from "./observer";
import { serializeDiff, type Diff } from "./diff";

/** Tags that should be skipped when hovering. */
const SKIP_TAGS = new Set([
  "HTML",
  "HEAD",
  "SCRIPT",
  "STYLE",
  "LINK",
  "META",
  "NOSCRIPT",
]);

/** Tags that get contentEditable on selection. */
const EDITABLE_TAGS = new Set([
  "H1", "H2", "H3", "H4", "H5", "H6",
  "P", "SPAN", "A", "LI", "BUTTON",
  "LABEL", "FIGCAPTION", "BLOCKQUOTE",
  "TD", "TH", "DT", "DD", "CAPTION",
  "SUMMARY", "LEGEND",
]);

export interface SelectAPI {
  activate: () => void;
  deactivate: () => void;
}

export function createSelectMode(canvas: ShadowRoot): SelectAPI {
  // ── State ──
  let active = false;
  let selectedEl: Element | null = null;
  const originalContent = new Map<Element, string>();

  // ── Shadow DOM elements ──
  const overlay = document.createElement("div");
  overlay.className = "angora-overlay";
  canvas.appendChild(overlay);

  const bubble: BubbleAPI = createBubble(canvas);
  const observer = createObserver(originalContent);

  // ── Helpers ──

  function isToolbarElement(el: Element): boolean {
    // Skip Astro dev toolbar and our own shadow DOM elements
    return !!(
      el.closest("astro-dev-toolbar") ||
      el.closest("astro-dev-toolbar-window") ||
      el.tagName.startsWith("ASTRO-DEV-TOOLBAR")
    );
  }

  function isFixed(el: Element): boolean {
    return getComputedStyle(el).position === "fixed";
  }

  function positionOverlay(el: Element) {
    const rect = el.getBoundingClientRect();
    const fixed = isFixed(el);

    if (fixed) {
      overlay.classList.add("angora-overlay--fixed");
      overlay.style.top = `${rect.top}px`;
      overlay.style.left = `${rect.left}px`;
    } else {
      overlay.classList.remove("angora-overlay--fixed");
      overlay.style.top = `${rect.top + window.scrollY}px`;
      overlay.style.left = `${rect.left + window.scrollX}px`;
    }

    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.display = "block";
  }

  function hideOverlay() {
    overlay.style.display = "none";
  }

  // ── Selection ──

  function selectElement(el: Element) {
    // Deselect previous
    if (selectedEl) {
      deselectElement();
    }

    selectedEl = el;
    overlay.classList.add("angora-overlay--selected");
    positionOverlay(el);

    // Make editable if it's a text element
    if (EDITABLE_TAGS.has(el.tagName)) {
      // Store original text before editing
      if (!originalContent.has(el)) {
        originalContent.set(el, el.textContent ?? "");
      }
      (el as HTMLElement).contentEditable = "true";
      (el as HTMLElement).focus();
    }

    // Start observing mutations
    observer.start();

    // Show bubble with breadcrumb navigation
    bubble.show(el, (ancestor) => {
      selectElement(ancestor);
    });

    bubble.onDone(() => {
      finalize();
    });
  }

  function deselectElement() {
    if (!selectedEl) return;

    // Remove contentEditable
    if (EDITABLE_TAGS.has(selectedEl.tagName)) {
      (selectedEl as HTMLElement).contentEditable = "inherit";
    }

    overlay.classList.remove("angora-overlay--selected");
    selectedEl = null;
    bubble.hide();
  }

  function finalize() {
    observer.stop();

    const diff: Diff = serializeDiff(originalContent);

    if (diff.changes.length > 0) {
      console.log(
        "%c[Angora Edit] Diff captured",
        "color: #89b4fa; font-weight: bold",
        diff,
      );
      (window as any).__angoraEditDiff__ = diff;
    } else {
      console.log(
        "%c[Angora Edit] No changes detected",
        "color: #6c7086",
      );
    }

    // Cleanup
    deselectElement();
    originalContent.clear();
    observer.clear();
    hideOverlay();
  }

  // ── Event handlers ──

  function onMouseMove(e: MouseEvent) {
    if (!active || selectedEl) return;

    const target = e.target as Element;
    if (!target || target === document.body || target === document.documentElement) {
      hideOverlay();
      return;
    }

    if (SKIP_TAGS.has(target.tagName) || isToolbarElement(target)) {
      hideOverlay();
      return;
    }

    positionOverlay(target);
  }

  function onClick(e: MouseEvent) {
    if (!active) return;

    const target = e.target as Element;

    // If clicking outside the selected element, deselect
    if (selectedEl) {
      if (!selectedEl.contains(target)) {
        deselectElement();
        hideOverlay();

        // If the click target is valid, immediately hover-highlight it
        if (
          target &&
          !SKIP_TAGS.has(target.tagName) &&
          !isToolbarElement(target) &&
          target !== document.body &&
          target !== document.documentElement
        ) {
          positionOverlay(target);
        }
      }
      return;
    }

    // Skip invalid targets
    if (
      !target ||
      SKIP_TAGS.has(target.tagName) ||
      isToolbarElement(target) ||
      target === document.body ||
      target === document.documentElement
    ) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    selectElement(target);
  }

  function onKeyDown(e: KeyboardEvent) {
    if (!active) return;

    if (e.key === "Escape") {
      if (selectedEl) {
        deselectElement();
        hideOverlay();
      }
    }
  }

  function onScrollResize() {
    if (!active) return;

    if (selectedEl) {
      positionOverlay(selectedEl);
      bubble.reposition();
    }
  }

  function onInput() {
    bubble.updatePreview();
  }

  function onPageSwap() {
    // View transitions: clean up on navigation
    if (active) {
      deactivate();
    }
  }

  // ── Public API ──

  function activate() {
    if (active) return;
    active = true;

    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("input", onInput, true);
    window.addEventListener("scroll", onScrollResize, { passive: true });
    window.addEventListener("resize", onScrollResize, { passive: true });
    document.addEventListener("astro:after-swap", onPageSwap);
  }

  function deactivate() {
    if (!active) return;

    // Finalize if there's a selection
    if (selectedEl) {
      finalize();
    }

    active = false;
    hideOverlay();
    observer.stop();

    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("input", onInput, true);
    window.removeEventListener("scroll", onScrollResize);
    window.removeEventListener("resize", onScrollResize);
    document.removeEventListener("astro:after-swap", onPageSwap);
  }

  return { activate, deactivate };
}
