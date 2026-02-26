import type { AstroIntegration } from "astro";

export default function angoraEdit(): AstroIntegration {
  return {
    name: "angora-edit",
    hooks: {
      "astro:config:setup"({ addDevToolbarApp }) {
        addDevToolbarApp({
          id: "angora-edit",
          name: "Angora Edit",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="2" x2="11" y2="13"/><line x1="8" y1="12" x2="12" y2="16"/></svg>`,
          entrypoint: new URL("./app.ts", import.meta.url),
        });
      },
    },
  };
}
