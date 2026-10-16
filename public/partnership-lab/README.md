# Partnership Lab — Ritul Sawant

A static portfolio site. There's no build step, no backend, no accounts and no paid APIs.

## View it

- **Quickest:** open `index.html` in a browser.
- **Local server (recommended):** from this folder, run `python3 -m http.server 8000` and go to <http://localhost:8000>.
- **Publish:** upload the folder to any static host (GitHub Pages, Netlify, Cloudflare Pages). Because routes use `#/…`, you don't need any server configuration.

## Editing content

All content lives in `/content`. You only need to edit these files:

| File | What it controls |
|---|---|
| `content/site.js` | Name, About text, **email / LinkedIn / CV** (replace `null`), disclaimer |
| `content/case-studies.js` | Real-partnership case studies |
| `content/opportunities.js` | Hypothetical proposals (Opportunity Lab) |
| `content/approach.js` | The seven-step framework |

Rules built into the site:

- An empty `body: ""` or empty list `[]` appears as **"Research to be added"**.
- Text fields accept simple Markdown: `**bold**`, `*italic*`, `[link](https://…)`, `- bullet` lines, and blank lines between paragraphs.
- Section `label` values: `fact` (Verified fact — must have a source), `analysis` (My analysis), `unverified` (Not yet verified), `hypothetical`, `assumption`.
- Case studies always show the label *"Independent analysis of a real partnership."* Proposals always show *"Hypothetical proposal—not an announced partnership."*
- `status`: `draft`, `in-progress`, `review` or `complete`. Set `lastReviewed: "YYYY-MM-DD"` after you've checked the sources.
- Adding a new case study or proposal: copy an existing object, change the `slug` (used in the URL), and fill it in. Filters update automatically from `sector` and `partnershipType`.
- CV: put the PDF in `assets/` and set `cv: "assets/your-cv.pdf"`.

## Code structure

```
index.html            Page shell: header, nav, footer
css/styles.css        All styles (colours are custom properties at the top)
js/components.js      Reusable components: projectCard, statusBadge, sourceList,
                      comparisonTable, valueMap, contentLabel, section, contactList
js/pages.js           Page templates built from the components
js/app.js             Hash router, mobile menu, in-page scrolling
tests/run-tests.js    Content and rendering tests
```

## Tests

On macOS, from this folder, run:

```
/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/run-tests.js
```

The tests check that every page renders, that the required sections and labels are present, that the filters work and that HTML is escaped. They also check that no section labelled `fact` is missing sources.
