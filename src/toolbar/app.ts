import type { ResolvedDevToolbarApp } from "astro";
import { STYLES } from "./styles";
import { createSelectMode, type SelectAPI } from "./select";

export default {
  id: "angora-edit",
  name: "Angora Edit",
  icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="2" x2="11" y2="13"/><line x1="8" y1="12" x2="12" y2="16"/></svg>`,

  init(canvas, app) {
    // Inject styles into the shadow DOM
    const style = document.createElement("style");
    style.textContent = STYLES;
    canvas.appendChild(style);

    // Ensure the canvas host doesn't interfere with page layout
    const hostStyle = document.createElement("style");
    hostStyle.textContent = `:host { position: absolute !important; top: 0; left: 0; width: 0 !important; height: 0 !important; overflow: visible !important; }`;
    canvas.appendChild(hostStyle);

    let selectMode: SelectAPI | null = null;

    app.addEventListener("app-toggled", (e: Event) => {
      const active = (e as CustomEvent<{ state: boolean }>).detail.state;

      if (active) {
        selectMode = createSelectMode(canvas);
        selectMode.activate();
      } else {
        if (selectMode) {
          selectMode.deactivate();
          selectMode = null;
        }
      }
    });

    document.addEventListener("astro:after-swap", () => {
      if (selectMode) {
        selectMode.deactivate();
        selectMode = null;
      }
    });
  },
} satisfies ResolvedDevToolbarApp;
