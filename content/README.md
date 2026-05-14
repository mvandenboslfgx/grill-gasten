# /content — MDX publishing

Author in **`.mdx`** with optional YAML frontmatter (`title`, `description`, `date`, …).

| Folder | URL path |
|--------|-----------|
| `content/events/` | `/published/events/{slug}` |
| `content/campaigns/` | `/published/campaigns/{slug}` |
| `content/seasonal-drops/` | `/published/seasonal-drops/{slug}` |
| `content/menu/` | `/published/menu/{slug}` |

Add a file → rebuild (or dev HMR) → page exists. No React code required for text updates.

For JSX inside MDX, adjust `next-mdx-remote` options with care (security). Prefer Markdown + links for now.
