export const STYLES = /* css */ `
  :host {
    all: initial;
  }

  /* ── Highlight overlay ── */

  .angora-overlay {
    position: absolute;
    pointer-events: none;
    border: 2px dashed rgba(99, 144, 255, 0.7);
    background: rgba(99, 144, 255, 0.08);
    border-radius: 4px;
    z-index: 2147483646;
    transition: top 0.06s ease, left 0.06s ease, width 0.06s ease, height 0.06s ease;
  }

  .angora-overlay--fixed {
    position: fixed;
  }

  .angora-overlay--selected {
    border-style: solid;
    border-color: rgba(99, 144, 255, 0.9);
    background: rgba(99, 144, 255, 0.05);
  }

  /* ── Bubble panel ── */

  .angora-bubble {
    position: fixed;
    z-index: 2147483647;
    display: none;
    flex-direction: column;
    gap: 8px;
    min-width: 280px;
    max-width: 420px;
    padding: 12px;
    background: #1e1e2e;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    color: #cdd6f4;
  }

  .angora-bubble--visible {
    display: flex;
  }

  /* ── Breadcrumb ── */

  .angora-breadcrumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .angora-breadcrumb button {
    all: unset;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace;
    color: #89b4fa;
    transition: background 0.1s;
  }

  .angora-breadcrumb button:hover {
    background: rgba(137, 180, 250, 0.15);
  }

  .angora-breadcrumb button:last-child {
    color: #cdd6f4;
    font-weight: 600;
  }

  .angora-breadcrumb-sep {
    color: rgba(255, 255, 255, 0.3);
    font-size: 11px;
    user-select: none;
  }

  /* ── Text preview ── */

  .angora-preview {
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.5;
    color: #a6adc8;
    max-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Chat input (shell) ── */

  .angora-chat {
    display: flex;
    gap: 8px;
  }

  .angora-chat input {
    all: unset;
    flex: 1;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    font-size: 12px;
    color: #6c7086;
    cursor: not-allowed;
  }

  /* ── Done button ── */

  .angora-done {
    all: unset;
    cursor: pointer;
    padding: 6px 16px;
    background: #89b4fa;
    color: #1e1e2e;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
    text-align: center;
    transition: background 0.15s;
    align-self: flex-end;
  }

  .angora-done:hover {
    background: #b4d0fb;
  }
`;
