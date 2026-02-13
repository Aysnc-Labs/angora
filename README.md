<img src="public/angora.svg" width="120" />

### 🚧 Work In Progress. Things may change!

# Angora

**Your design system is the website.**

Your Figma file isn't a source of truth — it's a picture of one. You draw a button, an engineer builds the real button, and you spend the rest of the project keeping them in sync. Tokens drift. Storybook rots. The "single source of truth" is actually four sources of partial truth.

Angora starts in code. Your design tokens are CSS. Your components are semantic HTML. Your specimens are interactive because HTML is interactive — hover states work because browsers have hover states, not because someone drew a blue rectangle and labeled it "Hover."

- **Conversational** — tell Claude what you want. It reads your tokens, your anti-patterns, your decisions, and builds something that belongs in *your* system
- **Token-first** — every value traces back to one `@theme` block. No magic numbers. No "I just eyeballed it"
- **Self-enforcing** — built-in audits check token compliance, visual hierarchy, accessibility, and responsive behavior
- **Ships real output** — static HTML and CSS. What you see in the design system IS the production code

<!-- TODO: GIF — record /angora-design-system-init conversation → tokens generated → style guide in browser → /angora-component hero → hero appears in design system with specimens -->

## One codebase, three depths

Angora scales with your ambition. No mode switch, no migration — just more layers on the same foundation.

**Design system** — Define your brand through conversation. Generate tokens. Build components. Get a living system with interactive specimens and documentation. This is what engineers consume instead of a Figma file.

**Prototype** — Add data. Model content in SQLite, import real testimonials and pricing tiers, wire components to queries. No more lorem ipsum.

**Website** — Compose pages, add layouts, build list/detail patterns. Same tokens, same components. What started as a design system just shipped.

## How it works

Angora is a set of skills for [Claude Code](https://claude.ai/code). You talk, it builds. Every skill reads your design system before touching anything.

```
/angora-design-system-init
```

Starts with intent, not configuration. *Who's the audience? What should this feel like? What accessibility standard?* Then generates tokens, builds a style guide, and waits for you to approve in the browser.

```
/angora add a hero component
```

Reads your tokens and existing components. Builds a hero that belongs in your system. Creates a design system page with interactive specimens. Runs an audit. Asks you to review.

```
/angora build the pricing page
```

Inventories your components, checks for wireframes, queries your database, composes the page, and audits it against your system.

## Get started

```bash
curl -fsSL https://getangora.org/install | bash
```

Then open your new project in Claude Code and start designing:

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
