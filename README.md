<img src="public/angora.svg" width="120" />

# Angora

A design system and site builder powered by Claude Code. Design tokens, components, and rendered specimens are the source of truth for the visual language. Add the SQLite content layer to turn the same components into a working prototype or a full static site.

## Setup

```bash
pnpm install
pnpm dev
```

## Getting Started

Start by running:

```
/angora-design-system-init
```

This is always the first step. It walks you through a conversation to define your brand — personality, colors, typography, accessibility standard — and generates your tokens and style guide.

After init is complete, use `/angora` to drive everything else. Tell it what you want and it figures out the right skill to run.

```
/angora add a hero component
/angora I have testimonials to import
/angora build the pricing page
```

You can also invoke skills directly if you know what you need:

| Skill                          | What it does                                                  |
| ------------------------------ | ------------------------------------------------------------- |
| `/angora`                      | Assess project state, recommend next step                     |
| `/angora-design-system-init`   | Brand identity, tokens, style guide                           |
| `/angora-component <name>`     | Build or update a component                                   |
| `/angora-design-system-audit`  | Review work against the design system                         |
| `/angora-wireframe <page>`     | Sketch page structure before building                         |
| `/angora-compose-page <page>`  | Build or evolve an Astro page                                 |
| `/angora-schema <what>`        | Design or evolve database tables                              |
| `/angora-media`                | Process inbox images (alt text, dimensions, media table)      |
| `/angora-import <file>`        | Import data (CSV, JSON) from the inbox                        |
| `/angora-data`                 | Quick DB operations — inspect, query, seed                    |

### Inbox

Drop files into `inbox/` and tell `/angora` about them:

- **Images** — processed via `/angora-media` (alt text, dimensions, media table registration)
- **CSV / JSON** — imported via `/angora-import` (validates against schema)

Files in `inbox/` are never deleted without explicit permission.
