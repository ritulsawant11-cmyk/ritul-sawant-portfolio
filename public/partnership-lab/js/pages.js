/*
 * PAGES
 * Each page function returns { title, html, mount? }.
 * `html` is built from components; `mount(root)` wires up interactivity (e.g. filters).
 */
window.PL = window.PL || {};

(function (PL) {
  "use strict";
  var ui = PL.ui;
  var esc = ui.esc;

  function pageHeader(eyebrow, title, lede) {
    return '<header class="page-header"><div class="container">' +
      (eyebrow ? '<p class="eyebrow">' + esc(eyebrow) + "</p>" : "") +
      '<h1 tabindex="-1">' + esc(title) + "</h1>" +
      (lede ? '<p class="lede">' + ui.inline(lede) + "</p>" : "") +
      "</div></header>";
  }

  function findBySlug(list, slug) {
    for (var i = 0; i < list.length; i++) if (list[i].slug === slug) return list[i];
    return null;
  }

  function featured(list) {
    for (var i = 0; i < list.length; i++) if (list[i].featured) return list[i];
    return list[0] || null;
  }

  function uniqueValues(list, key) {
    var seen = {};
    return list.map(function (p) { return p[key]; })
      .filter(function (v) { if (!v || seen[v]) return false; seen[v] = true; return true; })
      .sort();
  }

  // Pure filter function (also used by tests).
  function filterProjects(list, filters) {
    filters = filters || {};
    return list.filter(function (p) {
      return (!filters.sector || p.sector === filters.sector) &&
        (!filters.type || p.partnershipType === filters.type);
    });
  }

  function toc(items) {
    return '<nav class="toc" aria-label="On this page"><p class="toc-title">Chapters & Sections</p><ol>' +
      items.map(function (t) {
        var cls = t[2] ? ' class="toc-chapter"' : '';
        return '<li' + cls + '><a href="#' + t[0] + '" data-scroll-to="' + t[0] + '">' + esc(t[1]) + "</a></li>";
      }).join("") + "</ol></nav>";
  }

  function howToRead() {
    return '<details class="how-to-read"><summary>How to read evidence and proposal labels</summary>' + ui.labelKey() + "</details>";
  }

  /* ================= HOME ================= */

  function home() {
    var cs = featured(PL.caseStudies);
    var op = featured(PL.opportunities);

    // 4-step research approach
    var steps = [
      ["Define the problem", "Start from a specific customer or business problem, not from an attractive company pairing."],
      ["Compare partners", "Set out alternative candidates against explicit criteria, including why alternatives were rejected."],
      ["Map value", "Detail what each company and the end customer contributes and gains in the joint model."],
      ["Test & evaluate", "Design an empirical pilot with concrete success metrics, unit economics, and risk safeguards."]
    ];

    var html =
      '<section class="hero"><div class="container">' +
        '<p class="eyebrow">Independent Strategic Partnership Research</p>' +
        '<h1 tabindex="-1">Understanding partnerships.<br>Identifying new opportunities.</h1>' +
        '<p class="lede">I analyse how companies combine their capabilities, create customer value, and turn strategic partnership ' +
        "ideas into practical delivery plans.</p>" +
        '<div class="btn-row">' +
          '<a class="btn" href="#/case-studies">Explore my work</a>' +
          '<a class="btn btn--ghost" href="#/approach">My research approach</a>' +
        "</div>" +
      "</div></section>" +

      // Large Featured Case Study: Standard Life x Moneyhub
      '<section class="band"><div class="container">' +
        '<p class="eyebrow">Featured Case Study</p>' +
        (cs ? (
          '<div class="featured-hero-card">' +
            '<div class="featured-hero-top">' +
              ui.kindTag("case") +
              ui.statusBadge(cs.status) +
            '</div>' +
            '<h2 class="featured-hero-title"><a href="#/case-studies/' + esc(cs.slug) + '">' + esc(cs.title) + '</a></h2>' +
            '<p class="featured-hero-sub">Can everyday financial tools make workplace pensions more relevant?</p>' +
            '<p class="lede">' + ui.inline(cs.summary) + '</p>' +
            '<div class="featured-pills">' +
              '<span class="featured-pill">Partner fit</span>' +
              '<span class="featured-pill">Customer value</span>' +
              '<span class="featured-pill">Pilot design</span>' +
              '<span class="featured-pill">Unit economics</span>' +
              '<span class="featured-pill">Consumer Duty safeguards</span>' +
            '</div>' +
            '<div>' +
              '<a class="btn" href="#/case-studies/' + esc(cs.slug) + '">Read the case study &rarr;</a>' +
            '</div>' +
          '</div>'
        ) : ui.todo()) +
      "</div></section>" +

      // All Case Studies Grid on Home Page
      '<section class="band band--tight"><div class="container">' +
        '<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">' +
          '<div>' +
            '<p class="eyebrow" style="margin:0;">Recent Analyses</p>' +
            '<h2 class="section-title" style="margin:0;">All Case Studies</h2>' +
          '</div>' +
          '<a class="btn btn--ghost btn--small" href="#/case-studies">Filter &amp; search &rarr;</a>' +
        '</div>' +
        '<div class="card-grid">' +
          PL.caseStudies.map(function (c) { return ui.projectCard(c, "case"); }).join("") +
        '</div>' +
      "</div></section>" +

      // Two Ways I Explore Partnerships
      '<section class="band band--alt"><div class="container">' +
        '<h2 class="section-title">Two ways I explore partnerships</h2>' +
        '<div class="two-ways-grid">' +
          '<div class="explore-tile">' +
            '<div>' +
              '<p class="eyebrow">Retrospective Analysis</p>' +
              '<h3>Case Studies</h3>' +
              '<p>Understanding existing collaborations through independent research, publicly cited facts, and strategic decomposition.</p>' +
            '</div>' +
            '<div><a class="btn btn--ghost btn--small" href="#/case-studies">Explore Case Studies &rarr;</a></div>' +
          '</div>' +
          '<div class="explore-tile">' +
            '<div>' +
              '<p class="eyebrow">Prospective Exploration</p>' +
              '<h3>Opportunity Lab</h3>' +
              '<p>Developing and evaluating original partnership ideas, comparison matrices, pilot blueprints, and value propositions.</p>' +
            '</div>' +
            '<div><a class="btn btn--ghost btn--small" href="#/opportunity-lab">View Opportunity Lab &rarr;</a></div>' +
          '</div>' +
        '</div>' +
      "</div></section>" +

      // Four-step Process
      '<section class="band"><div class="container">' +
        '<h2 class="section-title">My approach</h2>' +
        '<ol class="process">' + steps.map(function (s, i) {
          return '<li class="process-step"><span class="process-num" aria-hidden="true">' + (i + 1) + "</span>" +
            "<h3>" + esc(s[0]) + "</h3><p>" + esc(s[1]) + "</p></li>";
        }).join("") + "</ol>" +
        '<p class="more-link"><a href="#/approach">See the full seven-step framework &rarr;</a></p>' +
      "</div></section>" +

      // Short About & Contact
      '<section class="band band--alt"><div class="container narrow">' +
        '<h2 class="section-title">About Ritul Sawant</h2>' +
        '<div class="prose">' + ui.md(PL.site.homeIntro) + "</div>" +
        '<p class="more-link"><a href="#/about">Read more about my background &rarr;</a></p>' +
        '<div style="margin-top: 2rem;">' +
          '<h3 class="sub-title">Contact & Profiles</h3>' +
          ui.contactList(PL.site.contact, true) +
        '</div>' +
        '<p class="section-note" style="margin-top: 1.5rem;">' + esc(PL.site.disclaimer) + '</p>' +
      "</div></section>";

    return { title: "Home", html: html };
  }

  /* ================= CASE STUDIES LIST ================= */

  function caseStudies(query) {
    query = query || {};
    var list = PL.caseStudies;
    var sectors = uniqueValues(list, "sector");
    var types = uniqueValues(list, "partnershipType");

    function options(values, selected, allLabel) {
      return '<option value="">' + allLabel + "</option>" + values.map(function (v) {
        return '<option value="' + esc(v) + '"' + (v === selected ? " selected" : "") + ">" + esc(v) + "</option>";
      }).join("");
    }

    var html =
      pageHeader("Case Studies", "Case studies",
        "Independent analyses of real partnerships, based on publicly available information. " +
        "I am not involved with, and do not represent, any of the companies discussed.") +
      '<section class="band band--tight"><div class="container">' +
        '<form class="filters" aria-label="Filter case studies" onsubmit="return false">' +
          '<div class="field"><label for="f-sector">Sector</label>' +
            '<select id="f-sector" name="sector">' + options(sectors, query.sector, "All sectors") + "</select></div>" +
          '<div class="field"><label for="f-type">Partnership type</label>' +
            '<select id="f-type" name="type">' + options(types, query.type, "All types") + "</select></div>" +
          '<button type="button" class="btn btn--ghost btn--small" id="f-clear">Clear filters</button>' +
        "</form>" +
        '<p class="results-count" id="results-count" aria-live="polite"></p>' +
        '<div class="card-grid" id="case-grid"></div>' +
      "</div></section>";

    function mount(root) {
      var sector = root.querySelector("#f-sector");
      var type = root.querySelector("#f-type");
      var grid = root.querySelector("#case-grid");
      var count = root.querySelector("#results-count");

      function update() {
        var f = { sector: sector.value, type: type.value };
        var results = filterProjects(list, f);
        grid.innerHTML = results.length
          ? results.map(function (p) { return ui.projectCard(p, "case"); }).join("")
          : '<div class="empty-state"><p>No case studies match these filters.</p></div>';
        count.textContent = "Showing " + results.length + " of " + list.length + " case " + (list.length === 1 ? "study" : "studies");
        var params = [];
        if (f.sector) params.push("sector=" + encodeURIComponent(f.sector));
        if (f.type) params.push("type=" + encodeURIComponent(f.type));
        var hash = "#/case-studies" + (params.length ? "?" + params.join("&") : "");
        if (location.hash !== hash && history.replaceState) history.replaceState(null, "", hash);
      }

      sector.addEventListener("change", update);
      type.addEventListener("change", update);
      root.querySelector("#f-clear").addEventListener("click", function () {
        sector.value = ""; type.value = ""; update();
      });
      update();
    }

    return { title: "Case Studies", html: html, mount: mount };
  }

  /* ================= CASE STUDY DETAIL (6 CHAPTERS) ================= */

  function caseStudy(slug) {
    var p = findBySlug(PL.caseStudies, slug);
    if (!p) return notFound();
    var s = p.sections || {};
    var companies = (p.parties || []).filter(function (x) { return x.role === "company"; });

    function sec(id, title, data) {
      data = data || {};
      return ui.section({ id: id, title: title, label: data.label, body: data.body, hint: data.hint });
    }

    var customSecMap = {};
    (p.customSections || []).forEach(function (cs) {
      customSecMap[cs.id] = cs;
    });

    // 6-Chapter structured navigation with anchor redirects preserved
    var items = [
      ["ch-01", "01 The Opportunity", true],
      ["problem", "— Problem being addressed"],
      ["ch-02", "02 Why These Partners", true],
      ["company-background", "— Company background"],
      ["partner-fit", "— Why these partners fit"],
      ["ch-03", "03 How Value is Created", true],
      ["contributions", "— What each company contributes"],
      ["value", "— Value for each company & customer"],
      ["ch-04", "04 What the Evidence Shows", true],
      ["outcomes", "— Publicly reported outcomes"],
      ["ch-05", "05 What I Would Test", true],
      ["experimental-pilot", "— Proposed pilot design"],
      ["commercial-economics", "— Cost & unit economics"],
      ["ch-06", "06 My Judgement", true],
      ["executive-summary", "— Executive summary"],
      ["interpretation", "— My interpretation"],
      ["risks", "— Risks and limitations"],
      ["lessons", "— Lessons learned"]
    ];
    if (customSecMap["presentation-deck"]) {
      items.push(["presentation-deck", "— The partnership in 10 slides"]);
    }
    items.push(["sources", "Sources & reviewed date", true]);

    // Partnership visual diagram data
    var diagramData = p.diagram || {
      company1: {
        name: "Standard Life",
        capabilities: [
          "Enterprise corporate scheme distribution",
          "Pension administration & investment mgmt",
          "Millions of auto-enrolled workplace members"
        ]
      },
      company2: {
        name: "Moneyhub",
        capabilities: [
          "Open Finance API aggregation rails",
          "White-label 'Money Mindset' interface",
          "Smart spending categorisation & nudges"
        ]
      },
      joint: {
        title: "Money Mindset",
        memberValue: "Single-dashboard visibility connecting workplace pensions into daily cash flow"
      }
    };

    var conclusionText = p.conclusion ||
      "Test enhanced onboarding before wider rollout. Evaluate activation uplift, sustained usage, " +
      "incremental cost per additional activation, and customer suitability safeguards—not digital engagement alone.";

    var leads = !ui.isEmpty(p.researchLeads)
      ? '<aside class="callout callout--unverified"><div class="doc-section-head"><h2 class="callout-title">Research leads</h2>' +
        ui.contentLabel("unverified") + "</div>" +
        "<p>Starting points for research. These have <strong>not</strong> been verified and are not presented as facts.</p>" +
        ui.list(p.researchLeads) + "</aside>"
      : "";

    var html =
      '<article class="detail">' +
        '<header class="detail-header"><div class="container">' +
          '<p class="breadcrumb"><a href="#/case-studies">&larr; All case studies</a> &middot; <span class="eyebrow" style="margin:0;">' + esc(p.sector) + '</span></p>' +
          ui.kindTag("case") +
          '<h1 tabindex="-1">' + esc(p.title) + "</h1>" +
          (p.subtitle ? '<p class="lede" style="font-size:1.35rem; font-weight:600; color:var(--ink-soft); margin-bottom:.5rem;">' + esc(p.subtitle) + '</p>' : '') +
          '<p class="lede">' + ui.inline(p.summary) + "</p>" +
          '<div class="btn-row" style="margin-top: 1.25rem; margin-bottom: 1.5rem;">' +
            '<a class="btn btn--small" href="#ch-01" data-scroll-to="ch-01">Read the analysis &darr;</a>' +
            '<a class="btn btn--ghost btn--small" href="#ch-05" data-scroll-to="ch-05">Jump to proposed pilot &darr;</a>' +
          '</div>' +
          '<dl class="detail-meta">' +
            "<div><dt>Companies</dt><dd>" + p.companies.map(esc).join(", ") + "</dd></div>" +
            "<div><dt>Sector</dt><dd>" + esc(p.sector) + "</dd></div>" +
            "<div><dt>Partnership type</dt><dd>" + esc(p.partnershipType) + "</dd></div>" +
            "<div><dt>Author</dt><dd>" + esc(PL.site.author) + "</dd></div>" +
            "<div><dt>Status</dt><dd>" + ui.statusBadge(p.status) + "</dd></div>" +
            "<div><dt>Research reviewed</dt><dd>" + (p.lastReviewed ? ui.formatDate(p.lastReviewed) : "Not yet reviewed") + "</dd></div>" +
          "</dl>" +
          ui.conclusionCard(conclusionText) +
        "</div></header>" +
        '<div class="container detail-layout">' +
          '<aside class="detail-aside">' + toc(items) + "</aside>" +
          '<div class="detail-body">' +
            howToRead() + leads +

            // CHAPTER 01: THE OPPORTUNITY
            '<div class="chapter-block" id="ch-01">' +
              '<div class="chapter-header">' +
                '<p class="chapter-num">Chapter 01</p>' +
                '<h2 class="chapter-title">The Opportunity</h2>' +
              '</div>' +
              sec("problem", "Problem being addressed", s.problem) +
            '</div>' +

            // CHAPTER 02: WHY THESE PARTNERS
            '<div class="chapter-block" id="ch-02">' +
              '<div class="chapter-header">' +
                '<p class="chapter-num">Chapter 02</p>' +
                '<h2 class="chapter-title">Why These Partners</h2>' +
              '</div>' +
              sec("company-background", "Company background", s.background) +
              sec("partner-fit", "Why these partners fit", s.fit) +
            '</div>' +

            // CHAPTER 03: HOW VALUE IS CREATED
            '<div class="chapter-block" id="ch-03">' +
              '<div class="chapter-header">' +
                '<p class="chapter-num">Chapter 03</p>' +
                '<h2 class="chapter-title">How Value is Created</h2>' +
              '</div>' +
              ui.partnershipDiagram(diagramData) +
              ui.section({ id: "contributions", title: "What each company contributes",
                html: ui.valueMap(companies, ["contributes"]) }) +
              ui.section({ id: "value", title: "Value for each company and the customer",
                html: ui.valueMap(p.parties, ["gains"]) }) +
            '</div>' +

            // CHAPTER 04: WHAT THE EVIDENCE SHOWS
            '<div class="chapter-block" id="ch-04">' +
              '<div class="chapter-header">' +
                '<p class="chapter-num">Chapter 04</p>' +
                '<h2 class="chapter-title">What the Evidence Shows</h2>' +
              '</div>' +
              sec("outcomes", "Publicly reported outcomes", s.outcomes) +
            '</div>' +

            // CHAPTER 05: WHAT I WOULD TEST
            '<div class="chapter-block" id="ch-05">' +
              '<div class="chapter-header">' +
                '<p class="chapter-num">Chapter 05</p>' +
                '<h2 class="chapter-title">What I Would Test</h2>' +
              '</div>' +
              (customSecMap["experimental-pilot"] ? sec("experimental-pilot", customSecMap["experimental-pilot"].title, customSecMap["experimental-pilot"]) : "") +
              (customSecMap["commercial-economics"] ? sec("commercial-economics", customSecMap["commercial-economics"].title, customSecMap["commercial-economics"]) : "") +
            '</div>' +

            // CHAPTER 06: MY JUDGEMENT
            '<div class="chapter-block" id="ch-06">' +
              '<div class="chapter-header">' +
                '<p class="chapter-num">Chapter 06</p>' +
                '<h2 class="chapter-title">My Judgement</h2>' +
              '</div>' +
              sec("executive-summary", "Executive summary", s.executiveSummary) +
              sec("interpretation", "My interpretation", s.interpretation) +
              sec("risks", "Risks and limitations", s.risks) +
              sec("lessons", "Lessons learned", s.lessons) +
              (customSecMap["presentation-deck"] ? ui.section({
                id: "presentation-deck",
                title: customSecMap["presentation-deck"].title,
                label: customSecMap["presentation-deck"].label,
                html: ui.slideDeck(customSecMap["presentation-deck"])
              }) : "") +
            '</div>' +

            ui.section({ id: "sources", title: "Sources and last reviewed date", html: ui.sourceList(p.sources, p.lastReviewed) }) +
          "</div>" +
        "</div>" +
      "</article>";

    function mount(root) {
      var deck = root.querySelector(".deck-container");
      var deckData = customSecMap["presentation-deck"];
      if (!deck || !deckData || !deckData.slides || !deckData.slides.length) return;

      var slides = deckData.slides;
      var currentIndex = 0;

      var navBtns = deck.querySelectorAll(".deck-nav-btn");
      var select = deck.querySelector("#deck-slide-select");
      var prevBtn = deck.querySelector(".deck-btn-prev");
      var nextBtn = deck.querySelector(".deck-btn-next");
      var counter = deck.querySelector(".deck-counter");
      var panel = deck.querySelector("#deck-preview-panel");

      function updateSlide(index, focusPanel) {
        if (index < 0) index = 0;
        if (index >= slides.length) index = slides.length - 1;
        currentIndex = index;
        var s = slides[currentIndex];

        // Update nav buttons
        for (var i = 0; i < navBtns.length; i++) {
          var btn = navBtns[i];
          var isActive = i === currentIndex;
          btn.classList.toggle("is-active", isActive);
          btn.setAttribute("aria-selected", String(isActive));
        }

        // Update mobile select
        if (select && select.value !== String(currentIndex)) {
          select.value = String(currentIndex);
        }

        // Update Prev / Next buttons
        if (prevBtn) {
          prevBtn.disabled = currentIndex === 0;
          prevBtn.setAttribute("aria-disabled", String(currentIndex === 0));
        }
        if (nextBtn) {
          nextBtn.disabled = currentIndex === slides.length - 1;
          nextBtn.setAttribute("aria-disabled", String(currentIndex === slides.length - 1));
        }

        // Update counter
        if (counter) {
          counter.textContent = "Slide " + (currentIndex + 1) + " of " + slides.length;
        }

        // Update preview panel content
        if (panel) {
          panel.setAttribute("aria-labelledby", "deck-tab-" + currentIndex);

          var numFormatted = (s.num < 10 ? "0" : "") + s.num;
          var visualHtml = "";
          if (s.diagram) {
            visualHtml += '<div class="deck-micro-diagram">' +
              '<span class="dmd-node">' + ui.esc(s.diagram.from) + '</span>' +
              '<span class="dmd-arrow" aria-hidden="true">&plus;</span>' +
              '<span class="dmd-node">' + ui.esc(s.diagram.partner) + '</span>' +
              '<span class="dmd-arrow" aria-hidden="true">&rarr;</span>' +
              '<span class="dmd-node dmd-node--accent">' + ui.esc(s.diagram.result) + '</span>' +
            '</div>';
          }
          if (s.bullets && s.bullets.length) {
            visualHtml += '<ul class="deck-bullets">' +
              s.bullets.map(function (b) { return '<li>' + ui.inline(b) + '</li>'; }).join("") +
            '</ul>';
          }

          var headerMeta = panel.querySelector(".deck-card-meta");
          if (headerMeta) {
            headerMeta.innerHTML = '<span class="deck-card-number">Slide ' + numFormatted + '</span>' +
              '<span class="deck-meta-sep" aria-hidden="true">&middot;</span>' +
              '<span class="deck-card-category">' + ui.esc(s.category) + '</span>';
          }

          var badge = panel.querySelector(".deck-card-badge");
          if (badge) {
            badge.innerHTML = ui.contentLabel(s.label);
          }

          var body = panel.querySelector(".deck-card-body");
          if (body) {
            body.innerHTML =
              '<h3 class="deck-card-title">' + ui.esc(s.title) + '</h3>' +
              '<p class="deck-card-summary">' + ui.inline(s.summary) + '</p>' +
              '<div class="deck-card-visual">' + visualHtml + '</div>' +
              '<div class="deck-card-link-wrap">' +
                '<a href="#' + ui.esc(s.anchor) + '" data-scroll-to="' + ui.esc(s.anchor) + '" class="deck-anchor-link">' +
                  ui.esc(s.anchorText) + ' &rarr;' +
                '</a>' +
              '</div>';
          }

          if (focusPanel) {
            panel.focus({ preventScroll: true });
          }
        }
      }

      // Event delegation for clicks on deck container
      deck.addEventListener("click", function (e) {
        var t = e.target;
        var btn = (t.closest && t.closest(".deck-nav-btn")) || (t.classList && t.classList.contains("deck-nav-btn") ? t : null);
        if (btn && btn.getAttribute("data-slide-index") != null) {
          updateSlide(parseInt(btn.getAttribute("data-slide-index"), 10));
          return;
        }

        var prev = (t.closest && t.closest(".deck-btn-prev")) || (t.classList && t.classList.contains("deck-btn-prev") ? t : null);
        if (prev) {
          updateSlide(currentIndex - 1);
          return;
        }

        var next = (t.closest && t.closest(".deck-btn-next")) || (t.classList && t.classList.contains("deck-btn-next") ? t : null);
        if (next) {
          updateSlide(currentIndex + 1);
          return;
        }
      });

      // Mobile select change
      if (select) {
        select.addEventListener("change", function () {
          updateSlide(parseInt(select.value, 10));
        });
      }

      // Keyboard navigation: Left/Right Arrow keys navigate slides
      deck.addEventListener("keydown", function (e) {
        if (e.target && (e.target.tagName === "SELECT" || e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          updateSlide(currentIndex - 1);
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          updateSlide(currentIndex + 1);
        }
      });
    }

    return { title: p.title, html: html, mount: mount };
  }

  /* ================= OPPORTUNITY LAB LIST ================= */

  function opportunityLab() {
    var html =
      pageHeader("Opportunity Lab", "Opportunity Lab",
        "My own partnership ideas. Each one starts with a research question, compares possible partners, and ends with a " +
        "proposed pilot. **None of these are announced, planned or endorsed partnerships.**") +
      '<section class="band band--tight"><div class="container">' +
        '<div class="notice">' + ui.contentLabel("hypothetical") +
          "<p>Proposals are hypothetical. Target companies, partner candidates and assumptions are clearly labelled, " +
          "and anything not yet researched is marked “" + ui.TODO_TEXT + "”.</p></div>" +
        '<div class="card-grid">' +
          (PL.opportunities.length
            ? PL.opportunities.map(function (p) { return ui.projectCard(p, "proposal"); }).join("")
            : '<div class="empty-state"><p>No proposals yet.</p></div>') +
        "</div>" +
      "</div></section>";
    return { title: "Opportunity Lab", html: html };
  }

  /* ================= OPPORTUNITY DETAIL ================= */

  function opportunity(slug) {
    var p = findBySlug(PL.opportunities, slug);
    if (!p) return notFound();
    var companies = p.targetCompany || {};
    var rec = p.recommended || {};

    var items = [
      ["research-question", "Research question"],
      ["target-company", "Target company"],
      ["customer-problem", "Customer problem"],
      ["shortlist", "Potential partner shortlist"],
      ["comparison", "Comparison matrix"],
      ["recommended", "Recommended partner"],
      ["rejected", "Reasons for rejecting alternatives"],
      ["value-proposition", "Mutual value proposition"],
      ["pilot", "Proposed pilot"],
      ["success-measures", "Proposed success measures"],
      ["risks-assumptions", "Risks and assumptions"],
      ["open-questions", "Questions requiring further research"]
    ];

    var target = ui.isEmpty(companies.name)
      ? ui.todo(companies.hint)
      : '<p class="target-name">' + ui.contentLabel("assumption") + " <strong>" + esc(companies.name) + "</strong></p>" +
        (ui.isEmpty(companies.rationale) ? ui.todo("Rationale for selecting this target.") : ui.md(companies.rationale));

    var shortlist = ui.isEmpty(p.shortlist) ? ui.todo() :
      '<p class="section-note">' + ui.contentLabel("hypothetical") + " Partner categories are my working hypothesis.</p>" +
      '<ul class="shortlist">' + p.shortlist.map(function (c) {
        return '<li class="shortlist-item"><span class="shortlist-name">' + esc(c.name) + "</span>" +
          '<span class="shortlist-cat">' + esc(c.category) + "</span>" +
          (c.note ? '<span class="shortlist-note">' + esc(c.note) + "</span>" : "") + "</li>";
      }).join("") + "</ul>";

    var recommended = ui.isEmpty(rec.name) ? ui.todo(rec.hint) :
      '<p class="target-name">' + ui.contentLabel("analysis") + " <strong>" + esc(rec.name) + "</strong></p>" + ui.md(rec.rationale);

    var rejected = ui.isEmpty(p.rejected) ? ui.todo("Written once the recommendation is made.") :
      '<ul class="bullets">' + p.rejected.map(function (r) {
        return "<li><strong>" + esc(r.name) + ":</strong> " + ui.inline(r.reason) + "</li>";
      }).join("") + "</ul>";

    var risks =
      '<h3 class="sub-title">Risks</h3>' + ui.list(p.risks, { hint: "Commercial, operational, regulatory and reputational risks." }) +
      '<h3 class="sub-title">Assumptions ' + ui.contentLabel("assumption") + "</h3>" + ui.list(p.assumptions);

    var html =
      '<article class="detail">' +
        '<header class="detail-header"><div class="container">' +
          '<p class="breadcrumb"><a href="#/opportunity-lab">&larr; All proposals</a></p>' +
          ui.kindTag("proposal") +
          '<h1 tabindex="-1">' + esc(p.title) + "</h1>" +
          '<p class="lede">' + ui.inline(p.summary) + "</p>" +
          '<dl class="detail-meta">' +
            "<div><dt>Sector</dt><dd>" + esc(p.sector) + "</dd></div>" +
            "<div><dt>Partnership type</dt><dd>" + esc(p.partnershipType) + "</dd></div>" +
            "<div><dt>Status</dt><dd>" + ui.statusBadge(p.status) + "</dd></div>" +
            "<div><dt>Last reviewed</dt><dd>" + (p.lastReviewed ? ui.formatDate(p.lastReviewed) : "Not yet reviewed") + "</dd></div>" +
          "</dl>" +
        "</div></header>" +
        '<div class="container detail-layout">' +
          '<aside class="detail-aside">' + toc(items) + "</aside>" +
          '<div class="detail-body">' +
            howToRead() +
            ui.section({ id: "research-question", title: "Research question", label: "hypothetical", body: p.researchQuestion }) +
            ui.section({ id: "target-company", title: "Target company", html: target }) +
            ui.section({ id: "customer-problem", title: "Customer problem", label: "analysis",
              body: (p.customerProblem || {}).body, hint: (p.customerProblem || {}).hint }) +
            ui.section({ id: "shortlist", title: "Potential partner shortlist", html: shortlist }) +
            ui.section({ id: "comparison", title: "Comparison matrix", html: ui.comparisonTable(p.matrix, "Partner comparison: " + p.title) }) +
            ui.section({ id: "recommended", title: "Recommended partner", html: recommended }) +
            ui.section({ id: "rejected", title: "Reasons for rejecting alternatives", html: rejected }) +
            ui.section({ id: "value-proposition", title: "Mutual value proposition", html: ui.valueMap(p.parties) }) +
            ui.section({ id: "pilot", title: "Proposed pilot", label: "hypothetical", body: (p.pilot || {}).body, hint: (p.pilot || {}).hint }) +
            ui.section({ id: "success-measures", title: "Proposed success measures",
              html: ui.list(p.successMeasures, { hint: "Measurable outcomes for each party and for the customer, agreed before the pilot." }) }) +
            ui.section({ id: "risks-assumptions", title: "Risks and assumptions", html: risks }) +
            ui.section({ id: "open-questions", title: "Questions requiring further research", html: ui.list(p.openQuestions, { ordered: true, cls: "numbered" }) }) +
          "</div>" +
        "</div>" +
      "</article>";

    return { title: p.title, html: html };
  }

  /* ================= MY APPROACH ================= */

  function approach() {
    var a = PL.approach;
    var html =
      pageHeader("My Approach", "My approach", a.intro) +
      '<section class="band band--tight"><div class="container narrow">' +
        '<ol class="framework">' + a.steps.map(function (s, i) {
          return '<li class="framework-step">' +
            '<div class="framework-num" aria-hidden="true">' + (i + 1) + "</div>" +
            '<div class="framework-body">' +
              "<h2>" + esc(s.title) + "</h2>" +
              '<p class="framework-purpose">' + ui.inline(s.purpose) + "</p>" +
              '<h3 class="sub-title">Questions I ask</h3>' + ui.list(s.questions) +
              '<p class="framework-output"><strong>Output:</strong> ' + ui.inline(s.output) + "</p>" +
            "</div></li>";
        }).join("") + "</ol>" +
      "</div></section>" +
      '<section class="band band--alt"><div class="container narrow">' +
        '<h2 class="section-title">How I label content</h2>' +
        "<p>Every page separates what is reported from what I think. These labels appear throughout the site:</p>" +
        ui.labelKey() +
        '<p class="section-note">Real case studies are marked “' + ui.KIND_TEXT.case + "” " +
        "Original proposals are marked “" + ui.KIND_TEXT.proposal + "”</p>" +
      "</div></section>";
    return { title: "My Approach", html: html };
  }

  /* ================= ABOUT ================= */

  function about() {
    var site = PL.site;
    var html =
      pageHeader("About", "About") +
      '<section class="band band--tight"><div class="container narrow">' +
        '<h2 class="section-title">About me</h2>' +
        '<div class="prose prose--large" style="margin-bottom: 2.25rem;">' +
          '<p>' + ui.inline(site.about) + '</p>' +
        '</div>' +
        '<h2 class="section-title">Contact and CV</h2>' +
        '<ul class="contact-list">' +
          '<li class="contact-item"><span class="contact-label">Email</span><a href="mailto:' + esc(site.contact.email) + '">' + esc(site.contact.email) + '</a></li>' +
          '<li class="contact-item"><span class="contact-label">Phone</span><a href="tel:' + esc(String(site.contact.phone).replace(/\s+/g, "")) + '">' + esc(site.contact.phone) + '</a></li>' +
          '<li class="contact-item"><span class="contact-label">Location</span><span>' + esc(site.contact.location) + '</span></li>' +
          '<li class="contact-item"><span class="contact-label">LinkedIn</span><a href="' + esc(site.contact.linkedin) + '" target="_blank" rel="noopener noreferrer">' + esc(site.contact.linkedin) + ' &nearr;</a></li>' +
          '<li class="contact-item contact-item--cv"><span class="contact-label">CV</span><div><a href="' + esc(site.contact.cv) + '" class="btn btn--small" target="_blank" rel="noopener">Download CV</a></div></li>' +
        '</ul>' +
        '<p class="section-note" style="margin-top: 2.5rem;">' + esc(site.disclaimer) + '</p>' +
      '</div></section>';
    return { title: "About", html: html };
  }

  /* ================= 404 ================= */

  function notFound() {
    return {
      title: "Page not found",
      html: pageHeader("", "Page not found", "That page does not exist. Try the [home page](#/) or [case studies](#/case-studies).")
    };
  }

  PL.pages = {
    home: home, caseStudies: caseStudies, caseStudy: caseStudy,
    opportunityLab: opportunityLab, opportunity: opportunity,
    approach: approach, about: about, notFound: notFound,
    filterProjects: filterProjects
  };
})(window.PL);
