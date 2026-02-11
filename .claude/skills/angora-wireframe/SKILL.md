---
name: angora-wireframe
description: Create or update a wireframe for a page layout. Use when sketching page structure before building components.
argument-hint: <page-name>
---

# Wireframe: $ARGUMENTS

Sketch page structure (hierarchy, layout, flow) before committing to visual design.

## Before you start

1. **Read `src/system.md`** — intent and scope.
2. **Read `src/styles/global.css`** — know the container max-width and spacing tokens.
3. **Check if the wireframe already exists** — look for `src/pages/wireframes/<page-name>.astro`. If it exists, read it first.

## Ask: format preference

Use `AskUserQuestion` to ask the user which wireframe format they prefer:

- **ASCII** — wireframe stored as ASCII art in a `<pre>` block. ~100-200 tokens per page. Best for fast iteration.
- **Visual** — wireframe rendered as gray Tailwind boxes (`bg-gray-100 border border-gray-300`, placeholder text). More visual but more tokens.

## Output files

1. **Gallery page** — `src/pages/wireframes/<page-name>.astro` (using `GalleryLayout`)

No full-screen view needed — wireframes are working docs, not deliverables.

## Steps

1. **Ask format** — ASCII or Visual (see above).
2. **Sketch** — create the wireframe page showing page structure: header, hero, sections, footer. Use placeholder text and rough proportions.
3. **Wire into nav** — add the wireframe to the `wireframes` array in `src/layouts/GalleryLayout.astro`.
4. **Visual review** — user opens page in browser (`pnpm dev`). Approves or iterates.
5. **Iterate** — ask user for feedback ("move CTA above fold", "make it 3 columns", etc.) and update the wireframe.

### ASCII format

Use a `<pre>` block with monospace box-drawing to show page structure:

```html
<pre class="font-mono text-sm leading-relaxed text-gray-700">
┌─────────────────────────────────────┐
│  Logo          Nav    Nav    [CTA]  │
├─────────────────────────────────────┤
│                                     │
│           Hero Headline             │
│           Subhead text              │
│        [ Primary ]  [ Secondary ]   │
│                                     │
├─────────────────────────────────────┤
│  Feature 1  │  Feature 2  │  Feat 3│
└─────────────────────────────────────┘
</pre>
```

### Visual format

Use gray Tailwind boxes with placeholder text:

```html
<div class="space-y-4">
  <div class="bg-gray-100 border border-gray-300 rounded p-4 flex justify-between items-center">
    <span class="text-sm text-gray-500">Logo</span>
    <div class="flex gap-4 text-sm text-gray-500">Nav · Nav · Nav</div>
  </div>
  <div class="bg-gray-100 border border-gray-300 rounded p-12 text-center">
    <p class="text-lg text-gray-500">Hero Section</p>
  </div>
</div>
```