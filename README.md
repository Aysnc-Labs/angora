<img src="public/angora.svg" width="120" />

# Angora

> **Alpha** — Angora is in early development. APIs and workflows may change between releases.

**Your design system is the website.**

Design systems that live in design tools have a translation problem. You draw a button, an engineer builds the real button, and you spend the rest of the project keeping them in sync. Tokens drift. The component explorer becomes a side project nobody maintains. The "single source of truth" is actually four sources of partial truth.

Angora starts in code. Your design tokens are CSS. Your components are semantic HTML. Your specimens are production code — not a separate tool that rots alongside it. You describe what you want in conversation, and it builds things that belong in *your* system.

- **Conversational** — tell Claude what you want. It reads your tokens, your anti-patterns, your decisions
- **Token-first** — every value traces back to one `@theme` block. No magic numbers
- **Self-enforcing** — built-in audits check token compliance, hierarchy, accessibility, and responsive behavior
- **No component explorer** — the design system pages *are* the specimens, built from the same code that ships

## One codebase, three depths

No mode switch, no migration — just more layers on the same foundation.

**Design system** — Define your brand through conversation. Generate tokens. Build components. Get a living system with interactive specimens and documentation. This is what engineers consume instead of a Figma file.

**Prototype** — Add data. Model content in SQLite, import real testimonials and pricing tiers, wire components to queries. No more lorem ipsum.

**Website** — Compose pages, add layouts, build list/detail patterns. Same tokens, same components. What started as a design system just shipped.

## You talk, it builds.

Angora is a set of skills for [Claude Code](https://claude.ai/code). Every skill reads your design system before touching anything.

**1.** `/angora-design-system-init`
Define your brand through conversation. Intent, audience, feel — captured as design tokens.

**2.** `/angora` "sketch me a wireframe for the blog"
Page structure before pixels. A featured post, recent articles, category filters — mapped out as a working document.

**3.** `/angora` "let's build that hero from the wireframe"
Reads your tokens and wireframe. Builds a featured-post hero that belongs in your system — semantic HTML, accessibility baked in.

**4.** `/angora` "compose the blog page components as a layout"
Assemble real components into a full page. The wireframe becomes the layout.

**5.** `/angora` "i've got 50 posts in a CSV and a folder of images in the inbox — make it live"
Angora models the schema, imports every row, and wires your components to a real database. Images get automatic alt text. The design system just shipped a blog.

## Get started

```bash
curl -fsSL https://getangora.org/install | bash
```

Then open your project in Claude Code and start designing:

```
/angora-design-system-init
```

After init, `/angora` drives everything — it reads your project and recommends the right skill.

## Skills

| Skill | Purpose |
|-------|---------|
| `/angora` | Assess project, recommend next step |
| `/angora-design-system-init` | Brand → tokens → style guide |
| `/angora-component <name>` | Build or update a component |
| `/angora-design-system-audit` | Audit against your system |
| `/angora-wireframe <page>` | Sketch page structure |
| `/angora-compose-page <page>` | Compose a page from components + data |
| `/angora-schema <what>` | Design database tables |
| `/angora-media` | Process images for the media library |
| `/angora-import <file>` | Import CSV/JSON into the database |
| `/angora-data` | Inspect, query, seed the database |

## Built with Angora

This site — [getangora.org](https://getangora.org) — was designed and built with the same system you'll use. No separate component explorer. The design system is the production code. [Browse it yourself →](https://getangora.org/design-system)
