# Ritul Sawant - Editorial Research & Operations Portfolio

A distinctive, recruiter-friendly personal portfolio and case-study workspace for **Ritul Sawant**, inspired by high-craft editorial design systems.

Designed to position Ritul’s background at the intersection of:
**“Economics, partnerships, and practical analysis.”**

Targeting early-career roles in:
- **Strategic Partnerships Associate / Coordinator**
- **Partner Operations**
- **Pensions Administration & Operations**
- **Financial Services Operations & Controls**

---

## 1. Reference Review & Design Direction

The redesign draws inspiration from the layout, typography, and atmospheric dark treatment of [shashank-gogula-portfolio.vercel.app](https://shashank-gogula-portfolio.vercel.app/):
- **Deep Obsidian / Near-Black Palette**: Background `#050607`, card surfaces `#0e1118`, thin hairline borders (`rgba(255, 255, 255, 0.08)`).
- **Restrained Emerald / Teal Accents**: `#2DD4BF` with subtle glows.
- **Editorial Typography System**:
  - Contemporary sans-serif (`Geist` / `-apple-system`) for body copy and confident headings.
  - Monospace (`Geist Mono`) for technical eyebrows, tags, and evidence badges.
  - Editorial serif (`Instrument Serif`) for refined italic touches on key headline phrases.
- **Split Hero**: Positioning narrative and quick metadata strip on the left; featured case study spotlight card on the right.
- **Evidence & Safeguards**: Clear visual labels distinguishing verified corporate facts from independent analytical interpretation and hypothetical experimental designs.
- **Strict Guardrails**:
  - No proficiency bars or arbitrary percentage ratings.
  - No invented metrics, client claims, or fake testimonials.
  - Genuine verified CV file (`ritul-sawant-cv.pdf`) linked directly.
  - No private phone numbers, home street addresses, or visa details published.

---

## 2. Selected Work: Websites & Interactive Projects

The portfolio showcases three live web applications:
1. **Partnership Lab**:
   - *Link*: [https://partnership-lab.vercel.app/#/](https://partnership-lab.vercel.app/#/)
   - *Description*: An independent research website exploring strategic partnerships across financial services, technology, and pensions.
2. **PensionSteps**:
   - *Link*: [https://ritul-sawant-portfolio.vercel.app/pension-steps/](https://ritul-sawant-portfolio.vercel.app/pension-steps/)
   - *Description*: An interactive website helping workplace pension members prepare for common customer-service enquiries.
3. **PensionQuest**:
   - *Link*: [https://ritul-sawant-portfolio.vercel.app/pension-quest/](https://ritul-sawant-portfolio.vercel.app/pension-quest/)
   - *Description*: A story-based educational web game exploring everyday workplace pension decisions.

---

## 3. Quick Start & Local Preview

### Instant Zero-Dependency Launch (macOS / Python)
```bash
cd portfolio
./serve.sh
```
Or double-click `start.command` in macOS Finder. This runs the site on `http://localhost:8085` (or chosen port).

### Node.js / Vite
```bash
cd portfolio
npm install
npm run dev
```

---

## 4. Editing Content & Updating the CV

- **Portfolio Data**: All text, projects, roles, and skills are centralized in [`src/data/portfolioData.ts`](file:///Users/ritulsawant/Antigravity/portfolio/src/data/portfolioData.ts) (and mirrored in `app.js` for standalone serving).
- **CV File**: The verified CV is located at [`portfolio/ritul-sawant-cv.pdf`](file:///Users/ritulsawant/Antigravity/portfolio/ritul-sawant-cv.pdf) and is linked from both the hero section and contact section.

---

## 5. Automated Quality Checks

Run the automated test suite at any time:
```bash
python3 portfolio/tests/test_portfolio.py
```
Checks verified:
- Obsidian, white, and teal palette compliance.
- Semantic HTML tags, skip link, and keyboard `:focus-visible` outlines.
- Respect for `prefers-reduced-motion`.
- Exclusion of unconfirmed skills (SQL) and proficiency bars.
- Verified credentials for Oxford Saïd (`TA2SPQ9NXQ7E`) and Michigan (`SOT2WGCNHEBB`).
- Case study deep linking and routing integrity across all 6 projects.

---

## 6. Deployment (Vercel & GitHub)

### GitHub Setup
1. Initialize Git in the `portfolio` folder:
   ```bash
   git init -b main
   git add .
   git commit -m "Initial commit: Ritul Sawant professional portfolio"
   ```
2. Create repository `portfolio` (or `ritul-sawant-portfolio`) on GitHub and push:
   ```bash
   git remote add origin https://github.com/ritulsawant11-cmyk/<repo-name>.git
   git push -u origin main
   ```

### Vercel Deployment
1. Import the repository into Vercel.
2. Deployment settings:
   - **Framework Preset**: Other (Static)
   - **Root Directory**: `./` (or leave default)
   - **Build Command**: None (or override to empty)
   - **Output Directory**: `.` (or leave default)
3. Configured via `vercel.json`:
   - `cleanUrls: true` for clean path resolution
4. Automatic continuous deployment: Any commit pushed to `main` deploys to production automatically.
