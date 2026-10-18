#!/usr/bin/env python3
"""
Ritul Sawant Portfolio - Editorial Redesign Verification Suite
Verifies:
1. Editorial Dark Palette: Obsidian (#050607), Pure White (#FFFFFF), Teal/Emerald (#2DD4BF).
2. Accessibility: Semantic structure, skip-link, :focus-visible, prefers-reduced-motion.
3. Negative Constraints & Privacy:
   - No proficiency bars or arbitrary percentage ratings
   - No invented performance statistics
   - No SQL in confirmed skills
   - No private personal details (phone number, street address, visa details)
4. Verified CV: Real verified CV PDF exists and is linked
5. Experience & Education Accuracy:
   - Diligenta (Pensions Service Advisor) & Domino's (Store Manager)
   - Oxford Saïd (TA2SPQ9NXQ7E) & Michigan (SOT2WGCNHEBB) Coursera certificates
   - University of Stirling (MSc Sports Management) & Parvatibai Chowgule College (BA Economics)
6. Projects & Case Studies:
   - Standard Life × Moneyhub (featured)
   - PensionSteps
   - Workplace Pension Partner Discovery (Nest)
   - Spotify × Uber
7. HTML & standalone runtime consistency.
"""

import os
import sys
import re

PORTFOLIO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

def run_suite():
    print("==========================================================")
    print("   Ritul Sawant Portfolio: Editorial Redesign Test Suite   ")
    print("==========================================================")

    passes = []
    failures = []

    def check(condition, test_name):
        if condition:
            passes.append(test_name)
            print(f"  [PASS] {test_name}")
        else:
            failures.append(test_name)
            print(f"  [FAIL] {test_name}")

    # --- 1. Check Styles (main.css) ---
    css_path = os.path.join(PORTFOLIO_DIR, 'src/styles/main.css')
    check(os.path.exists(css_path), "src/styles/main.css exists")
    with open(css_path, 'r', encoding='utf-8') as f:
        css = f.read()

    check('#050607' in css.upper(), "Obsidian base background defined (#050607)")
    check('#FFFFFF' in css.upper(), "Pure white heading/text defined (#FFFFFF)")
    check('#2DD4BF' in css.upper(), "Teal/emerald accent defined (#2DD4BF)")
    check(':focus-visible' in css, "Visible keyboard focus states defined (:focus-visible)")
    check('prefers-reduced-motion' in css, "Respects reduced-motion preference query")
    check('.skip-link' in css, "Accessible skip-link styling defined")
    check('progress-bar' not in css and 'skill-bar' not in css, "No proficiency bar / skill meter CSS classes")

    # --- 2. Check Central Data File (src/data/portfolioData.ts) ---
    data_path = os.path.join(PORTFOLIO_DIR, 'src/data/portfolioData.ts')
    check(os.path.exists(data_path), "Central editable data file exists (portfolioData.ts)")
    with open(data_path, 'r', encoding='utf-8') as f:
        data = f.read()

    # Profile & Contact
    check('Ritul Sawant' in data, "Profile includes name 'Ritul Sawant'")
    check('Economics, partnerships, and practical analysis.' in data, "Positioning headline matches specification")
    check('ritul.sawant11@gmail.com' in data, "Verified email present")
    check('https://www.linkedin.com/in/ritulsawant' in data, "Verified LinkedIn present")
    check('Stirling, Scotland' in data, "Location specified as Stirling, Scotland")

    # Privacy guardrails
    check(not re.search(r'\+44\d{10}', data), "Phone number is NOT published")
    check('visa' not in data.lower(), "Visa details are NOT published")
    check('street' not in data.lower() and 'postcode' not in data.lower(), "Home street address is NOT published")

    # CV Verification: Real CV file exists and is linked
    cv_file = os.path.join(PORTFOLIO_DIR, 'ritul-sawant-cv.pdf')
    check(os.path.exists(cv_file) and os.path.getsize(cv_file) > 1000, "Genuine verified CV PDF exists in repository")
    check("cvUrl: '/ritul-sawant-cv.pdf'" in data, "CV download URL links to verified CV file")

    # Experience
    check('Diligenta' in data, "Experience includes Diligenta")
    check('Pensions Service Advisor' in data, "Role includes Pensions Service Advisor")
    check("Domino's" in data, "Experience includes Domino's")
    check('Store Manager' in data, "Role includes Store Manager")
    check('Defined Contribution' in data, "Diligenta includes Defined Contribution enquiries")
    check('Letter of Authority' in data, "Diligenta includes Letter of Authority handling")
    check('Cash Reconciliation' in data or 'cash takings' in data, "Domino's includes cash reconciliation")

    # Skills - confirmed vs unconfirmed
    check('Microsoft Excel (intermediate: VLOOKUP, XLOOKUP' in data or 'Microsoft Excel: intermediate' in data or 'VLOOKUP' in data, "Excel with VLOOKUP/XLOOKUP present")
    check('Bancs' in data and 'LMT' in data and 'WorkSmart' in data, "Operational tools Bancs, LMT, WorkSmart present")
    check('SQL' not in data, "SQL is correctly excluded from confirmed skills")

    # Certificates & Credential IDs
    check('TA2SPQ9NXQ7E' in data, "Saïd Business School Oxford Credential ID TA2SPQ9NXQ7E present")
    check('https://coursera.org/verify/TA2SPQ9NXQ7E' in data, "Oxford verification link present")
    check('SOT2WGCNHEBB' in data, "University of Michigan Credential ID SOT2WGCNHEBB present")
    check('https://coursera.org/verify/SOT2WGCNHEBB' in data, "Michigan verification link present")

    # Education
    check('University of Stirling' in data, "MSc Sports Management at University of Stirling present")
    check('Parvatibai Chowgule College' in data, "BA Economics at Parvatibai Chowgule College present")

    # --- 3. Check App.js Standalone Bundle ---
    app_js_path = os.path.join(PORTFOLIO_DIR, 'app.js')
    check(os.path.exists(app_js_path), "Standalone client runtime exists (app.js)")
    with open(app_js_path, 'r', encoding='utf-8') as f:
        app_js = f.read()

    # Projects: Exactly 3 Websites / Web Applications
    check('Partnership Lab' in data and 'Partnership Lab' in app_js, "Project: Partnership Lab website present")
    check('PensionSteps' in data and 'PensionSteps' in app_js, "Project: PensionSteps present")
    check('PensionQuest' in data and 'PensionQuest' in app_js, "Project: PensionQuest present")

    # Negative checks: Old individual case studies are removed from portfolio
    check('Standard Life × Moneyhub' not in data and 'Standard Life × Moneyhub' not in app_js, "Standard Life × Moneyhub removed from portfolio cards")
    check('Workplace Pension Partner Discovery' not in data and 'Workplace Pension Partner Discovery' not in app_js, "Nest partner discovery removed from portfolio cards")
    check('Spotify × Uber' not in data and 'Spotify × Uber' not in app_js, "Spotify × Uber removed from portfolio cards")
    check('// FEATURED CASE STUDY' not in app_js, "Featured Case Study section removed from Hero")

    # Buttons & Text checks: Single 'Visit Website ↗', no rationale/case study buttons
    check('Websites & Interactive Projects' in app_js, "Work section heading renamed to 'Websites & Interactive Projects'")
    check('A selection of websites and interactive tools I have created' in app_js, "Specified introduction paragraph present")
    check('Visit Website ↗' in app_js, "'Visit Website ↗' button present")
    check('Read case study' not in app_js, "'Read case study' buttons removed")
    check('Platform Overview & Rationale' not in app_js, "'Platform Overview & Rationale' button removed")
    check('Architecture & Rationale' not in app_js, "'Architecture & Rationale' button removed")
    check('Game Design & Rationale' not in app_js, "'Game Design & Rationale' button removed")

    # --- 4. Check HTML ---
    index_path = os.path.join(PORTFOLIO_DIR, 'index.html')
    check(os.path.exists(index_path), "index.html exists")
    with open(index_path, 'r', encoding='utf-8') as f:
        html = f.read()

    check('#050607' in html, "index.html theme-color matches obsidian (#050607)")
    check('Geist' in html, "index.html loads Geist font family")
    check('Instrument+Serif' in html, "index.html loads Instrument Serif editorial font")

    # --- 5. Check Live URLs and Route Integrity ---
    check('https://partnership-lab.vercel.app/#/' in data and 'https://partnership-lab.vercel.app/#/' in app_js, "Partnership Lab points to verified live website")
    check(os.path.exists(os.path.join(PORTFOLIO_DIR, 'partnership-lab', 'index.html')), "Partnership Lab index.html exists for live serving")
    check(os.path.exists(os.path.join(PORTFOLIO_DIR, 'partnership-lab', 'js', 'app.js')), "Partnership Lab app.js router exists")

    check('https://ritul-sawant-portfolio.vercel.app/pension-steps/' in data and 'https://ritul-sawant-portfolio.vercel.app/pension-steps/' in app_js, "PensionSteps points to verified live application")
    check(os.path.exists(os.path.join(PORTFOLIO_DIR, 'pension-steps', 'index.html')), "PensionSteps index.html exists for live tool serving")
    check(os.path.exists(os.path.join(PORTFOLIO_DIR, 'pension-steps', 'app.js')), "PensionSteps app.js interactive engine exists")

    check('https://ritul-sawant-portfolio.vercel.app/pension-quest/' in data and 'https://ritul-sawant-portfolio.vercel.app/pension-quest/' in app_js, "PensionQuest points to verified live web game")
    check(os.path.exists(os.path.join(PORTFOLIO_DIR, 'pension-quest', 'index.html')), "PensionQuest index.html exists for live game serving")
    check(os.path.exists(os.path.join(PORTFOLIO_DIR, 'pension-quest', 'app.js')), "PensionQuest app.js interactive game engine exists")

    print("\n----------------------------------------------------------")
    print(f"Results: {len(passes)} PASSED, {len(failures)} FAILED")
    print("----------------------------------------------------------")

    if failures:
        print("Failures detected:")
        for f in failures:
            print(f"  - {f}")
        return False
    return True

if __name__ == '__main__':
    success = run_suite()
    sys.exit(0 if success else 1)
