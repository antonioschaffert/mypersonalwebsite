# Tony Schaffert

A personal website for **tonyschaffert.com**. Developer, family man, father of two.

Dark editorial design with an original orange and violet orbital hero, project showcases, responsive layouts, and accessible native-dialog search (⌘K / Ctrl K). All core content is readable without JavaScript.

## Deploy on Netlify

1. Import this GitHub repository in Netlify.
2. Leave the build command empty. `netlify.toml` sets the publish directory to `dist`.
3. Add `tonyschaffert.com` as your production domain and follow Netlify’s DNS instructions. Set it as the primary domain.

No dependencies, build step, environment variables, or paid services are required. Fonts are loaded from Google Fonts with local system fallbacks.

## Search and SEO

The site includes HTML content, a canonical URL, title and description, Open Graph / X text metadata, Person / WebSite / ItemList JSON-LD, `robots.txt`, and `sitemap.xml`. Search engines can index the public site after deployment; indexing and rankings are not guaranteed. Once live, submit `https://tonyschaffert.com/sitemap.xml` through Google Search Console.

On-site search in `dist/script.js` searches the three projects and Tony’s biography. It supports multiple search terms, keyboard opening, Escape to close, and a no-results state.

## Edit content

- `dist/index.html`: biography, project descriptions, metadata, structured data.
- `dist/style.css`: responsive visual design.
- `dist/script.js`: local search index and interactions.
- `dist/assets/orbit-hero.webp`: original generated hero artwork.

Project URLs and contact details have not been supplied. Project cards currently offer expandable introductions; replace these with live links when the destinations are confirmed. The project copy intentionally does not claim unverified features or metrics.

## Local preview

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. JavaScript syntax can be checked with `node --check dist/script.js`.

## Artwork

Created using the built-in image generation tool. Prompt: “A single glossy translucent molten-orange and violet glass twisted torus with thin iridescent chrome edges, floating in near-black space. Premium experimental developer-brand 3D art. Landscape 1536×1024, sculpture in the right two thirds, dark negative space on the left. No text, logos, stars, or interface.”
