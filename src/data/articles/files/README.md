# Article drop folder

Drop plain-text (`*.txt`) files in here. Each file becomes one article on the
Articles tab. New files appear at the top and push older articles down.

Regenerate the articles with either:

- `pnpm articles:extract` (manual / CI), or
- saving a `.txt` here while `pnpm dev` is running (automatic).

Files whose name starts with `_` or `.` are ignored.

## Format

```txt
title: My New Post
summary: One line shown on the article card.
updated: 2026-09-29

# Section One
Body text for the first section. Line breaks are preserved.

- first bullet
- second bullet

^ Reference Title | https://example.com

# Section Two
More body text.
```

## Rules

- **Front matter**: `key: value` lines before the first `#` heading.
  Supported keys: `title`, `summary`, `updated` (and an optional `id`).
- **`# Heading`** starts a new section. The section id is slugified from the title.
- **`- `** or **`* `** lines become bullet points.
- **`^ Title | url`** lines become reference links.
- Everything else inside a section becomes its body text.
- The article id defaults to the file name (without `.txt`) unless `id:` is set.
