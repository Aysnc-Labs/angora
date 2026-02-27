import type { AstroIntegration } from "astro";
import { createConnection, type Socket } from "node:net";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

export default function angoraEdit(): AstroIntegration {
  return {
    name: "angora-edit",
    hooks: {
      "astro:config:setup"({ addDevToolbarApp }) {
        addDevToolbarApp({
          id: "angora-edit",
          name: "Inspect with Angora",
          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`,
          entrypoint: new URL("./app.ts", import.meta.url),
        });
      },
      "astro:server:setup"({ server }) {
        const socketPath = process.env.ANGORA_IPC_SOCKET;
        let socket: Socket | null = null;

        if (socketPath) {
          function connect() {
            socket = createConnection(socketPath!, () => {
              console.log(
                "\x1b[36m[Angora Edit]\x1b[0m Connected to launcher IPC",
              );
            });
            socket.on("error", (err) => {
              console.log(
                `\x1b[36m[Angora Edit]\x1b[0m IPC error: ${err.message}`,
              );
              socket = null;
              setTimeout(connect, 2000);
            });
            socket.on("close", () => {
              socket = null;
            });
          }
          connect();
        }

        server.hot.on("angora:edit-diff", (diff) => {
          const json = JSON.stringify(diff);

          if (socket && !socket.destroyed) {
            socket.write(json + "\n");
            console.log(
              "\x1b[36m[Angora Edit]\x1b[0m Diff sent to Claude Code",
            );
          } else {
            const outPath = resolve("inbox/angora-edit.json");
            writeFileSync(outPath, JSON.stringify(diff, null, 2));
            console.log(
              "\x1b[36m[Angora Edit]\x1b[0m Diff written to inbox/angora-edit.json",
            );
          }
        });
      },
    },
  };
}
