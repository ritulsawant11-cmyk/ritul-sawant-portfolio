/*
 * REUSABLE COMPONENTS
 * Each component is a small function that takes data and returns an HTML string.
 * Pages (js/pages.js) combine these; content lives in /content.
 */
window.PL = window.PL || {};

(function (PL) {
  "use strict";

  var TODO_TEXT = "Research to be added";

  /* ---------- Helpers ---------- */

  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function isEmpty(value) {
    if (value == null) return true;
    if (Array.isArray(value)) return value.length === 0;
    return String(value).trim() === "";
  }

  // Inline Markdown: **bold**, *italic*, [text](url). Input is escaped first.
  function inline(text) {
    var res = esc(text)
      .replace(/&lt;br\s*\/?&gt;/g, "<br>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, label, url) {
        if (!/^(https?:|mailto:|#\/|assets\/)/.test(url)) return label;
        var external = /^https?:/.test(url) ? ' target="_blank" rel="noopener noreferrer"' : "";
        return '<a href="' + url + '"' + external + ">" + label + "</a>";
      });

    function cleanMath(s) {
      return s.replace(/\\text\{([^}]+)\}/g, "$1")
              .replace(/_\{([^}]+)\}/g, "<sub>$1</sub>")
              .replace(/\\&/g, "&amp;")
              .replace(/\\/g, "")
              .trim();
    }

    // Display formulas: $$\text{A} = \frac{\text{B}}{\text{C}}$$ (supports nested braces)
    res = res.replace(/\$\$\\text\{([^}]+)\}\s*=\s*\\frac\{((?:[^{}]|\{[^{}]*\})*)\}\{((?:[^{}]|\{[^{}]*\}|\{(?:[^{}]|\{[^{}]*\})*\})*)\}\$\$/g, function (_, lhs, num, den) {
      return '<span class="formula-display"><span class="formula-lhs">' + cleanMath(lhs) + '</span> <span class="formula-eq">=</span> <span class="formula-frac"><span class="formula-num">' + cleanMath(num) + '</span><span class="formula-den">' + cleanMath(den) + '</span></span></span>';
    });

    // Inline fractions: $\frac{\text{A}}{\text{B}}$
    res = res.replace(/\$\\frac\{((?:[^{}]|\{[^{}]*\})*)\}\{((?:[^{}]|\{[^{}]*\}|\{(?:[^{}]|\{[^{}]*\})*\})*)\}\$/g, function (_, num, den) {
      return '<span class="formula-frac"><span class="formula-num">' + cleanMath(num) + '</span><span class="formula-den">' + cleanMath(den) + '</span></span>';
    });

    // Percentile subscript: $P_{95}$ or P_{95}
    res = res.replace(/\$?P_\{95\}\$?|\$P95\$/g, "P<sub>95</sub>");

    // Cohort size variables: $N = 5,000$
    res = res.replace(/\$N\s*=\s*([0-9,]+)\$/g, "<em>N</em> = $1");

    // LaTeX cleanup for ranges & thresholds like $< 15\%$, $> 25\%$, $< 3.0\text{ seconds}$, $< £100$
    res = res.replace(/\$(&[lg]t;[^$]+)\$/g, function (_, m) {
      return m.replace(/\\text\{([^}]+)\}/g, "$1").replace(/\\%/g, "%").replace(/\\/g, "").trim();
    });
    res = res.replace(/\$([0-9.]+(?:%|s|\\text\{[^}]+\})?\s*-\s*[0-9.]+(?:%|s|\\text\{[^}]+\})?)\$/g, function (_, m) {
      return m.replace(/\\text\{([^}]+)\}/g, "$1").replace(/\\%/g, "%").replace(/\\/g, "").trim();
    });
    res = res.replace(/\\text\{([^}]+)\}/g, "$1");
    res = res.replace(/\\%/g, "%");

    return res;
  }

  // Block Markdown: paragraphs, lists, headings (###, ####), and markdown tables (| a | b |).
  function md(text) {
    if (isEmpty(text)) return "";
    return String(text).trim().split(/\n\s*\n/).map(function (block) {
      var lines = block.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return "";
      
      // Markdown table detection: lines start and end with |
      if (lines.length >= 2 && lines[0].indexOf("|") !== -1 && lines[1].indexOf("|") !== -1 && /^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(lines[1])) {
        var parseRow = function(line) {
          return line.replace(/^\||\|$/g, "").split("|").map(function(c) { return c.trim(); });
        };
        var headers = parseRow(lines[0]);
        var bodyRows = lines.slice(2).map(parseRow);
        var tableHtml = '<div class="table-scroll"><table class="matrix"><thead><tr>' +
          headers.map(function(h) { return '<th scope="col">' + inline(h) + '</th>'; }).join('') +
          '</tr></thead><tbody>' +
          bodyRows.map(function(row) {
            return '<tr>' + row.map(function(cell, idx) {
              return (idx === 0 ? '<th scope="row">' : '<td>') + inline(cell) + (idx === 0 ? '</th>' : '</td>');
            }).join('') + '</tr>';
          }).join('') +
          '</tbody></table></div>';
        return tableHtml;
      }

      // Fenced code blocks or box diagrams
      if (/^```/.test(lines[0]) || lines[0].indexOf("┌") !== -1) {
        var codeLines = lines.filter(function (l) { return !/^```/.test(l); });
        return '<pre class="ascii-diagram"><code>' + esc(codeLines.join('\n')) + '</code></pre>';
      }

      // Blockquotes starting with >
      if (lines.every(function (l) { return /^>\s?/.test(l); })) {
        return '<blockquote class="callout--quote"><p>' + inline(lines.map(function (l) { return l.replace(/^>\s?/, ''); }).join(' ')) + '</p></blockquote>';
      }

      // Horizontal rule
      if (lines.length === 1 && /^---+$/.test(lines[0])) {
        return '<hr class="rule">';
      }

      if (lines.every(function (l) { return /^[-*] /.test(l); })) {
        return "<ul>" + lines.map(function (l) { return "<li>" + inline(l.slice(2)) + "</li>"; }).join("") + "</ul>";
      }

      if (/^# /.test(lines[0])) {
        return '<h3 class="sub-title">' + inline(lines[0].slice(2)) + '</h3>' +
          (lines.length > 1 ? '<p>' + inline(lines.slice(1).join(' ')) + '</p>' : '');
      }
      if (/^## /.test(lines[0])) {
        return '<h3 class="sub-title">' + inline(lines[0].slice(3)) + '</h3>' +
          (lines.length > 1 ? '<p>' + inline(lines.slice(1).join(' ')) + '</p>' : '');
      }
      if (/^### /.test(lines[0])) {
        return '<h3 class="sub-title">' + inline(lines[0].slice(4)) + '</h3>' +
          (lines.length > 1 ? '<p>' + inline(lines.slice(1).join(' ')) + '</p>' : '');
      }
      if (/^#### /.test(lines[0])) {
        return '<h4>' + inline(lines[0].slice(5)) + '</h4>' +
          (lines.length > 1 ? '<p>' + inline(lines.slice(1).join(' ')) + '</p>' : '');
      }

      return "<p>" + inline(lines.join(" ")) + "</p>";
    }).join("");
  }

  function slugify(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  function formatDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return esc(iso);
    var months = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    return d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
  }

  /* ---------- Labels & badges ---------- */

  // Content-type labels distinguish facts, analysis, hypotheticals and assumptions.
  var LABELS = {
    fact: { text: "Verified fact", desc: "Supported by a listed primary/secondary source." },
    provider: { text: "Provider-reported outcome", desc: "Outcome published by the provider; not independently audited." },
    analysis: { text: "My analysis", desc: "My own strategic interpretation or qualitative assessment." },
    hypothetical: { text: "Hypothetical pilot", desc: "An original proposal or experimental test design, not an announced rollout." },
    assumption: { text: "Modelling assumption", desc: "A scenario-based hypothesis or unit economics assumption." },
    unverified: { text: "Not yet verified", desc: "Reported elsewhere; still to be checked against a primary source." },
    todo: { text: TODO_TEXT, desc: "This section has not been researched yet." }
  };

  function contentLabel(kind) {
    var l = LABELS[kind];
    if (!l) return "";
    return '<span class="label label--' + kind + '" title="' + esc(l.desc) + '">' + esc(l.text) + "</span>";
  }

  var STATUSES = {
    draft: "Draft",
    "in-progress": "Research in progress",
    review: "Under review",
    complete: "Research complete"
  };

  function statusBadge(status) {
    var text = STATUSES[status] || "Status not set";
    return '<span class="status status--' + esc(status || "none") + '"><span class="status-dot" aria-hidden="true"></span>' +
      '<span class="visually-hidden">Research status: </span>' + esc(text) + "</span>";
  }

  // The mandatory "what kind of project is this" banner.
  var KIND_TEXT = {
    case: "Independent analysis of a real partnership.",
    proposal: "Hypothetical proposal\u2014not an announced partnership."
  };

  function kindTag(kind) {
    return '<p class="kind-tag kind-tag--' + kind + '">' + esc(KIND_TEXT[kind]) + "</p>";
  }

  function todo(hint) {
    return '<div class="todo">' + contentLabel("todo") +
      (hint ? '<p class="todo-hint"><span class="visually-hidden">To research: </span>' + inline(hint) + "</p>" : "") +
      "</div>";
  }

  /* ---------- Conclusion Callout ---------- */

  function conclusionCard(text) {
    return (
      '<div class="conclusion-card" role="region" aria-label="Analytical Conclusion">' +
        '<div class="conclusion-badge"><span aria-hidden="true">✦</span> My conclusion</div>' +
        '<p>' + inline(text) + '</p>' +
      '</div>'
    );
  }

  /* ---------- Visual Partnership Diagram ---------- */

  function partnershipDiagram(opts) {
    opts = opts || {};
    var c1 = opts.company1 || { name: "Company A", capabilities: [] };
    var c2 = opts.company2 || { name: "Company B", capabilities: [] };
    var joint = opts.joint || { title: "Joint Proposition", memberValue: "" };

    var caps1 = (c1.capabilities || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');
    var caps2 = (c2.capabilities || []).map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('');

    return (
      '<div class="partner-diagram" role="figure" aria-label="Partnership Architecture Diagram">' +
        '<div class="pd-heading">' + contentLabel("analysis") + ' Partnership Architecture</div>' +
        '<div class="pd-grid">' +
          '<div class="pd-company-box">' +
            '<div class="pd-company-name">' + esc(c1.name) + '</div>' +
            '<ul class="pd-cap-list">' + caps1 + '</ul>' +
          '</div>' +
          '<div class="pd-company-box">' +
            '<div class="pd-company-name">' + esc(c2.name) + '</div>' +
            '<ul class="pd-cap-list">' + caps2 + '</ul>' +
          '</div>' +
          '<div class="pd-center-bridge">' +
            '<div class="pd-connector-lines" aria-hidden="true"></div>' +
            '<div class="pd-joint-box">' +
              '<div class="pd-joint-label">Joint Proposition</div>' +
              '<div class="pd-joint-title">' + esc(joint.title) + '</div>' +
              (joint.memberValue ? '<div class="pd-member-value"><strong>Member value:</strong> ' + esc(joint.memberValue) + '</div>' : '') +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  /* ---------- Project card ---------- */

  // kind: "case" | "proposal"
  function projectCard(project, kind) {
    var base = kind === "case" ? "#/case-studies/" : "#/opportunity-lab/";
    var cta = kind === "case" ? "Read case study" : "View proposal";
    var companies = project.companies && project.companies.length
      ? '<p class="card-companies">' + project.companies.map(esc).join(" &middot; ") + "</p>"
      : "";
    return (
      '<article class="card card--' + kind + '">' +
        kindTag(kind) +
        '<h3 class="card-title"><a href="' + base + esc(project.slug) + '">' + esc(project.title) + "</a></h3>" +
        companies +
        '<dl class="card-meta">' +
          "<div><dt>Sector</dt><dd>" + esc(project.sector || "To be confirmed") + "</dd></div>" +
          "<div><dt>Partnership type</dt><dd>" + esc(project.partnershipType || "To be confirmed") + "</dd></div>" +
        "</dl>" +
        '<p class="card-summary">' + inline(project.summary) + "</p>" +
        '<div class="card-footer">' +
          statusBadge(project.status) +
          '<a class="btn btn--small" href="' + base + esc(project.slug) + '" aria-label="' + cta + ": " + esc(project.title) + '">' + cta + "</a>" +
        "</div>" +
      "</article>"
    );
  }

  /* ---------- Document section ---------- */

  // A titled section with a content label. `body` can be Markdown or pre-built HTML (opts.html).
  function section(opts) {
    var id = opts.id || slugify(opts.title);
    var empty = opts.html ? false : isEmpty(opts.body);
    var label = empty ? "" : contentLabel(opts.label);
    var content = opts.html ? opts.html : (empty ? todo(opts.hint) : md(opts.body));
    return (
      '<section class="doc-section" id="' + id + '" aria-labelledby="' + id + '-h">' +
        '<div class="doc-section-head"><h2 id="' + id + '-h">' + esc(opts.title) + "</h2>" + label + "</div>" +
        '<div class="prose">' + content + "</div>" +
      "</section>"
    );
  }

  function list(items, opts) {
    opts = opts || {};
    if (isEmpty(items)) return todo(opts.hint);
    var tag = opts.ordered ? "ol" : "ul";
    return "<" + tag + ' class="' + (opts.cls || "bullets") + '">' +
      items.map(function (i) { return "<li>" + inline(i) + "</li>"; }).join("") + "</" + tag + ">";
  }

  /* ---------- Source list ---------- */

  function sourceList(sources, lastReviewed) {
    var reviewed = '<p class="last-reviewed"><strong>Last reviewed:</strong> ' +
      (lastReviewed ? formatDate(lastReviewed) : "Not yet reviewed") + "</p>";
    if (isEmpty(sources)) {
      return todo("No sources recorded yet. Every verified fact on this page must link to a source listed here.") + reviewed;
    }
    var items = sources.map(function (s) {
      var title = s.url
        ? '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.title) + "</a>"
        : esc(s.title);
      var meta = [s.publisher, s.date ? formatDate(s.date) : "", s.accessed ? "accessed " + formatDate(s.accessed) : ""]
        .filter(Boolean).map(esc).join(" &middot; ");
      var kind = s.kind ? '<span class="source-kind source-kind--' + esc(s.kind) + '">' +
        (s.kind === "primary" ? "Primary source" : "Secondary source") + "</span>" : "";
      return '<li class="source"><span class="source-title">' + title + "</span>" + kind +
        (meta ? '<span class="source-meta">' + meta + "</span>" : "") + "</li>";
    }).join("");
    return '<ol class="sources">' + items + "</ol>" + reviewed;
  }

  /* ---------- Comparison table ---------- */

  function comparisonTable(matrix, caption) {
    if (!matrix || isEmpty(matrix.criteria) || isEmpty(matrix.candidates)) return todo("Comparison matrix to be built.");
    var cands = matrix.candidates;
    var totals = cands.map(function () { return 0; });
    var complete = true;

    var rows = matrix.criteria.map(function (c, r) {
      var cells = cands.map(function (_, i) {
        var v = matrix.scores && matrix.scores[r] ? matrix.scores[r][i] : null;
        if (typeof v !== "number") { complete = false; return '<td class="score score--empty"><span aria-hidden="true">—</span><span class="visually-hidden">Not scored</span></td>'; }
        totals[i] += v * (c.weight || 0) / 100;
        return '<td class="score score--' + Math.round(v) + '">' + v + "</td>";
      }).join("");
      return '<tr><th scope="row"><span class="crit-name">' + esc(c.name) + "</span>" +
        (c.description ? '<span class="crit-desc">' + esc(c.description) + "</span>" : "") + "</th>" +
        '<td class="weight">' + (c.weight != null ? esc(c.weight) + "%" : "—") + "</td>" + cells + "</tr>";
    }).join("");

    var totalRow = '<tr class="total"><th scope="row">Weighted score</th><td class="weight">100%</td>' +
      cands.map(function (_, i) { return '<td class="score">' + (complete ? totals[i].toFixed(1) : "—") + "</td>"; }).join("") +
      "</tr>";

    return (
      '<div class="table-scroll" role="region" aria-label="' + esc(caption || "Comparison matrix") + '" tabindex="0">' +
        '<table class="matrix">' +
          "<caption>" + esc(caption || "Partner comparison matrix") + "</caption>" +
          '<thead><tr><th scope="col">Criterion</th><th scope="col">Weight</th>' +
            cands.map(function (c) { return '<th scope="col">' + esc(c) + "</th>"; }).join("") +
          "</tr></thead>" +
          "<tbody>" + rows + totalRow + "</tbody>" +
        "</table>" +
      "</div>" +
      (matrix.scale ? '<p class="table-note">Scale: ' + esc(matrix.scale) + "</p>" : "") +
      (!complete ? '<p class="table-note">' + contentLabel("todo") + " Scores will be added once each candidate has been researched.</p>" : "")
    );
  }

  /* ---------- Value map ---------- */

  // show: ["contributes"], ["gains"] or both.
  function valueMap(parties, show) {
    show = show || ["contributes", "gains"];
    if (isEmpty(parties)) return todo();
    var headings = { contributes: "Contributes", gains: "Gains" };
    return '<div class="value-map value-map--' + parties.length + '">' +
      parties.map(function (p) {
        var blocks = show.map(function (key) {
          return '<div class="vm-block"><h4>' + headings[key] + "</h4>" +
            (isEmpty(p[key]) ? '<p class="vm-empty">' + TODO_TEXT + "</p>" : list(p[key], { cls: "vm-list" })) +
            "</div>";
        }).join("");
        return '<div class="vm-party vm-party--' + esc(p.role) + '">' +
          '<p class="vm-role">' + (p.role === "customer" ? "Customer" : "Company") + "</p>" +
          '<h3 class="vm-name">' + esc(p.name) + "</h3>" +
          (p.note ? '<p class="vm-note">' + esc(p.note) + "</p>" : "") +
          blocks + "</div>";
      }).join("") +
      "</div>";
  }

  /* ---------- Contact Details ---------- */

  function contactItem(kind, value) {
    var labels = { email: "Email", linkedin: "LinkedIn", cv: "CV", location: "Location", phone: "Phone" };
    var placeholders = { email: "[Add email address]", linkedin: "[Add LinkedIn URL]", cv: "[Add CV file]" };
    var inner;
    if (isEmpty(value)) {
      inner = '<span class="placeholder" title="Edit content/site.js to add this">' + (placeholders[kind] || "[Add detail]") + "</span>";
    } else if (kind === "email") {
      inner = '<a href="mailto:' + esc(value) + '">' + esc(value) + "</a>";
    } else if (kind === "linkedin") {
      inner = '<a href="' + esc(value) + '" target="_blank" rel="noopener noreferrer">' + esc(value) + ' &nearr;</a>';
    } else if (kind === "phone") {
      inner = '<a href="tel:' + esc(String(value).replace(/\s+/g, "")) + '">' + esc(value) + "</a>";
    } else if (kind === "location") {
      inner = '<span>' + esc(value) + '</span>';
    } else if (kind === "cv") {
      inner = '<a href="' + esc(value) + '" target="_blank" rel="noopener">Download CV (PDF)</a>';
    } else {
      inner = '<a href="' + esc(value) + '" target="_blank" rel="noopener noreferrer">View profile &nearr;</a>';
    }
    return '<li class="contact-item"><span class="contact-label">' + (labels[kind] || esc(kind)) + "</span>" + inner + "</li>";
  }

  function contactList(contact, hideMissing) {
    contact = contact || {};
    var kinds = ["email", "linkedin", "location", "phone", "cv"];
    var items = kinds.map(function (k) {
      if (hideMissing && isEmpty(contact[k])) return "";
      if (isEmpty(contact[k]) && (k === "location" || k === "phone")) return "";
      return contactItem(k, contact[k]);
    }).filter(Boolean);

    if (!items.length) {
      return '<p class="section-note">Contact details available on request.</p>';
    }
    return '<ul class="contact-list">' + items.join("") + '</ul>';
  }

  /* ---------- Executive Slide Deck Preview Component ---------- */

  function slideDeck(data) {
    if (!data || isEmpty(data.slides)) return "";
    var slides = data.slides;
    var current = slides[0];

    // Build desktop navigator buttons (tablist)
    var navItems = slides.map(function (s, idx) {
      var activeClass = idx === 0 ? " is-active" : "";
      var selectedAttr = idx === 0 ? ' aria-selected="true"' : ' aria-selected="false"';
      var numFormatted = (s.num < 10 ? "0" : "") + s.num;
      return (
        '<li role="presentation">' +
          '<button type="button" class="deck-nav-btn' + activeClass + '" role="tab" id="deck-tab-' + idx + '"' +
            selectedAttr + ' aria-controls="deck-preview-panel" data-slide-index="' + idx + '">' +
            '<span class="deck-nav-num">' + numFormatted + '</span>' +
            '<span class="deck-nav-meta">' +
              '<span class="deck-nav-category">' + esc(s.category) + '</span>' +
              '<span class="deck-nav-title">' + esc(s.title) + '</span>' +
            '</span>' +
          '</button>' +
        '</li>'
      );
    }).join("");

    // Build mobile select options
    var selectOptions = slides.map(function (s, idx) {
      var numFormatted = (s.num < 10 ? "0" : "") + s.num;
      return '<option value="' + idx + '"' + (idx === 0 ? ' selected' : '') + '>' +
        numFormatted + ': ' + esc(s.title) +
      '</option>';
    }).join("");

    // Helper for visual content (diagram or bullets)
    function renderSlideVisual(s) {
      var out = "";
      if (s.diagram) {
        out += (
          '<div class="deck-micro-diagram">' +
            '<span class="dmd-node">' + esc(s.diagram.from) + '</span>' +
            '<span class="dmd-arrow" aria-hidden="true">&plus;</span>' +
            '<span class="dmd-node">' + esc(s.diagram.partner) + '</span>' +
            '<span class="dmd-arrow" aria-hidden="true">&rarr;</span>' +
            '<span class="dmd-node dmd-node--accent">' + esc(s.diagram.result) + '</span>' +
          '</div>'
        );
      }
      if (s.bullets && s.bullets.length) {
        out += (
          '<ul class="deck-bullets">' +
            s.bullets.map(function (b) { return '<li>' + inline(b) + '</li>'; }).join("") +
          '</ul>'
        );
      }
      return out;
    }

    var previewCardHtml = (
      '<div class="deck-card" id="deck-preview-panel" role="tabpanel" aria-labelledby="deck-tab-0" tabindex="0">' +
        '<div class="deck-card-header">' +
          '<div class="deck-card-meta">' +
            '<span class="deck-card-number">Slide ' + ((current.num < 10 ? "0" : "") + current.num) + '</span>' +
            '<span class="deck-meta-sep" aria-hidden="true">&middot;</span>' +
            '<span class="deck-card-category">' + esc(current.category) + '</span>' +
          '</div>' +
          '<div class="deck-card-badge">' + contentLabel(current.label) + '</div>' +
        '</div>' +

        '<div class="deck-card-body">' +
          '<h3 class="deck-card-title">' + esc(current.title) + '</h3>' +
          '<p class="deck-card-summary">' + inline(current.summary) + '</p>' +
          '<div class="deck-card-visual">' + renderSlideVisual(current) + '</div>' +
          '<div class="deck-card-link-wrap">' +
            '<a href="#' + esc(current.anchor) + '" data-scroll-to="' + esc(current.anchor) + '" class="deck-anchor-link">' +
              esc(current.anchorText) + ' &rarr;' +
            '</a>' +
          '</div>' +
        '</div>' +

        '<div class="deck-card-footer">' +
          '<div class="deck-controls">' +
            '<button type="button" class="btn btn--ghost btn--small deck-btn deck-btn-prev" aria-label="Previous slide" disabled>&larr; Previous</button>' +
            '<span class="deck-counter" aria-live="polite">Slide 1 of ' + slides.length + '</span>' +
            '<button type="button" class="btn btn--ghost btn--small deck-btn deck-btn-next" aria-label="Next slide">Next &rarr;</button>' +
          '</div>' +
          '<p class="deck-disclaimer">' + esc(data.disclaimer || "Independent analysis by Ritul Sawant. Not an official company presentation.") + '</p>' +
        '</div>' +
      '</div>'
    );

    return (
      '<div class="deck-container" role="region" aria-label="The partnership in 10 slides">' +
        (data.description ? '<p class="deck-description">' + esc(data.description) + '</p>' : '') +
        
        '<div class="deck-mobile-selector">' +
          '<label for="deck-slide-select" class="visually-hidden">Select slide</label>' +
          '<select id="deck-slide-select" class="deck-select">' + selectOptions + '</select>' +
        '</div>' +

        '<div class="deck-layout">' +
          '<nav class="deck-nav" aria-label="Executive slides list">' +
            '<ol class="deck-nav-list" role="tablist" aria-orientation="vertical">' + navItems + '</ol>' +
          '</nav>' +
          '<div class="deck-preview-wrapper">' + previewCardHtml + '</div>' +
        '</div>' +
      '</div>'
    );
  }

  // Key explaining the content labels.
  function labelKey() {
    return '<ul class="label-key">' + ["fact", "provider", "analysis", "hypothetical", "assumption", "unverified", "todo"].map(function (k) {
      return "<li>" + contentLabel(k) + "<span>" + esc(LABELS[k].desc) + "</span></li>";
    }).join("") + "</ul>";
  }

  PL.ui = {
    esc: esc, isEmpty: isEmpty, inline: inline, md: md, slugify: slugify, formatDate: formatDate,
    contentLabel: contentLabel, statusBadge: statusBadge, kindTag: kindTag, todo: todo,
    conclusionCard: conclusionCard, partnershipDiagram: partnershipDiagram,
    projectCard: projectCard, section: section, list: list, sourceList: sourceList,
    comparisonTable: comparisonTable, valueMap: valueMap, contactList: contactList, labelKey: labelKey,
    slideDeck: slideDeck,
    TODO_TEXT: TODO_TEXT, KIND_TEXT: KIND_TEXT
  };
})(window.PL);
