# Tony Schaffert

A personal website for **tonyschaffert.com**. Developer, Purdue Boilermaker grad, Florida resident, and father of two.

Dark editorial design with an original orange and violet solar-wind hero, project showcases, responsive layouts, and accessible native-dialog search (⌘K / Ctrl K). All core content is readable without JavaScript.

## Deploy on Netlify

1. Import this GitHub repository in Netlify.
2. Leave the build command empty. `netlify.toml` sets the publish directory to `dist`.
3. Add `tonyschaffert.com` as your production domain and follow Netlify’s DNS instructions. Set it as the primary domain.

No dependencies, build step, environment variables, or paid services are required. Fonts are loaded from Google Fonts with local system fallbacks.

## Search and SEO

The site includes HTML content, a canonical URL, title and description, Open Graph / X text metadata, Person / WebSite / ItemList JSON-LD, `robots.txt`, and `sitemap.xml`. Search engines can index the public site after deployment; indexing and rankings are not guaranteed. Once live, submit `https://tonyschaffert.com/sitemap.xml` through Google Search Console.

On-site search in `dist/script.js` searches the apps, Lúcifer game, and Tony’s biography. It supports multiple search terms, keyboard opening, Escape to close, and a no-results state.

## Edit content

- `dist/index.html`: biography, project descriptions, metadata, structured data.
- `dist/style.css`: responsive visual design.
- `dist/script.js`: local search index and interactions.
- `dist/assets/solar-wind-hero.webp`: original generated hero artwork.

Total Chaos and Devprompt use verified App Store links and actual listing screenshots, stored locally as optimized WebP images. Each screenshot opens at a larger size. Dad Jokes Vault remains a project introduction because no matching App Store listing was found under Antonio Schaffert. Contact details have not been supplied.

The biography, search index, and structured metadata include Purdue University and Florida. The closing motto is `while(alive) { keepLearning() }`.

## Local preview

```sh
python3 -m http.server 4173 --directory dist
```

Open `http://localhost:4173`. JavaScript syntax can be checked with `node --check dist/script.js`.

## Artwork

Created using the built-in image generation tool. Prompt: “Cinematic abstract solar wind: thousands of fine luminous orange/coral filaments and restrained violet/indigo particles sweep diagonally through near-black space. Crisp strands, restrained bloom, sculptural depth. Landscape 1536×1024; energy in the right two thirds, dark left third for the headline. No torus, rings, glass, solid sculpture, text, logos, or interface.”

## App Store screenshot sources

Retrieved September 21, 2026 from Apple’s App Store listings and verified against the listed developer, **Antonio Schaffert**:

- [Total Chaos](https://apps.apple.com/us/app/total-chaos/id6760237060): home and live trivia question screens.
- [Devprompt](https://apps.apple.com/us/app/devprompt/id6809673786): Today and question detail screens.

The screenshots were resized to 642 × 1389 and converted to WebP for loading performance; their content was not altered. These are app screenshots, not generated mockups.


## Lúcifer browser game

Play at `/lucifer/`. The home page features the game and on-site search links directly to it. Tony created a version of Lúcifer in Brazil; this is a new browser recreation, not a claim to have originated all versions of the historical program.

- English and Brazilian Portuguese, with browser-language detection and a manual selector.
- Use the single message box: type `;your hidden answer;Your question?`. The hidden answer is masked as an invocation, then the question follows in the same field. Enter closes hidden entry; Enter again submits the completed message.
- Backspace edits the hidden answer; pasted sequences and accented characters work. Finishing the hidden answer completes the invocation and lets you continue typing the question. The question can be edited without changing the hidden answer. Clearing the entire box also clears the secret.
- An operator guide includes a practice round. Without a hidden answer, the game uses a theatrical stock response.
- A short reveal delay, reset controls, reduced-motion support, accessible labels, and a live answer announcement.
- Answers are kept only in the current page’s memory. No API, browser storage, cookies, or analytics receives questions or answers. Reset, language changes, and leaving the page clear the round.

Source: `dist/lucifer/index.html`, `game.css`, `game.mjs`, and `engine.mjs`. The game is standalone static content and uses the existing Netlify configuration.

Run the core behavior checks with:

```sh
node --test tests/lucifer*.test.mjs
```

Arrow controls use inline SVG paths rather than font glyphs, avoiding platform-specific emoji and font rendering.
