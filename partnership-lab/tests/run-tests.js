/*
 * Content & rendering tests. Runs without a browser using macOS JavaScriptCore:
 *   /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc tests/run-tests.js
 * (run from the partnership-lab folder)
 */
var window = this;
["content/site.js", "content/case-studies.js", "content/opportunities.js", "content/approach.js",
 "js/components.js", "js/pages.js"].forEach(function (f) { load(f); });

var failures = 0, passes = 0;
function check(cond, msg) { if (cond) passes++; else { failures++; print("FAIL: " + msg); } }
function has(html, text, msg) { check(html.indexOf(text) !== -1, msg + " (expected: " + text + ")"); }

var P = PL.pages;
var pages = {
  home: P.home(), caseStudies: P.caseStudies({}), opportunityLab: P.opportunityLab(),
  approach: P.approach(), about: P.about(), notFound: P.notFound()
};
PL.caseStudies.forEach(function (c) { pages["cs:" + c.slug] = P.caseStudy(c.slug); });
PL.opportunities.forEach(function (o) { pages["op:" + o.slug] = P.opportunity(o.slug); });

// Every page renders, has a single h1, and contains no "undefined"/"null"/"[object" leaks.
Object.keys(pages).forEach(function (k) {
  var h = pages[k].html;
  check(typeof h === "string" && h.length > 100, k + " renders");
  check(!/undefined|>null<|\[object/.test(h), k + " has no undefined/null leaks");
  check((h.match(/<h1/g) || []).length === 1, k + " has exactly one h1");
  // Balanced tags (rough check)
  ["section", "article", "div", "ul", "ol", "table", "dl"].forEach(function (t) {
    var open = (h.match(new RegExp("<" + t + "[\\s>]", "g")) || []).length;
    var close = (h.match(new RegExp("</" + t + ">", "g")) || []).length;
    check(open === close, k + " balanced <" + t + "> (" + open + "/" + close + ")");
  });
});

// Home
var home = pages.home.html;
has(home, "Understanding partnerships.<br>Identifying new opportunities.", "home headline");
has(home, "I analyse how companies combine their capabilities, create customer value", "home supporting text");
has(home, "Explore my work", "home primary button");
has(home, "My research approach", "home secondary button");
has(home, "Featured Case Study", "home featured case header");
has(home, "Standard Life × Moneyhub", "featured case title");
has(home, "Two ways I explore partnerships", "two ways section");
["Define the problem", "Compare partners", "Map value", "Test &amp; evaluate"].forEach(function (s) {
  has(home, "<h3>" + s + "</h3>", "process step " + s);
});

// Labels
PL.caseStudies.forEach(function (c) {
  var h = pages["cs:" + c.slug].html;
  has(h, "Independent analysis of a real partnership.", c.slug + " case label");
  ["Executive summary", "Company background", "Problem being addressed", "Why these partners fit",
   "What each company contributes", "Value for each company and the customer", "Publicly reported outcomes",
   "My interpretation", "Risks and limitations", "Lessons learned", "Sources and last reviewed date"
  ].forEach(function (s) { has(h, ">" + s + "</h2>", c.slug + " section " + s); });
  if (!c.lastReviewed) {
    has(h, "Not yet reviewed", c.slug + " last reviewed placeholder");
  } else {
    has(h, "Last reviewed:", c.slug + " shows last reviewed date");
  }
  check(h.indexOf("Hypothetical proposal") === -1, c.slug + " not labelled hypothetical");
});
PL.opportunities.forEach(function (o) {
  var h = pages["op:" + o.slug].html;
  has(h, "Hypothetical proposal\u2014not an announced partnership.", o.slug + " proposal label");
  ["Research question", "Target company", "Customer problem", "Potential partner shortlist", "Comparison matrix",
   "Recommended partner", "Reasons for rejecting alternatives", "Mutual value proposition", "Proposed pilot",
   "Proposed success measures", "Risks and assumptions", "Questions requiring further research"
  ].forEach(function (s) { has(h, ">" + s + "</h2>", o.slug + " section " + s); });
  has(h, '<table class="matrix"', o.slug + " comparison table");
});
has(pages.caseStudies.html, 'id="f-sector"', "sector filter");
has(pages.caseStudies.html, 'id="f-type"', "type filter");

// Required draft entries
check(!!PL.caseStudies.filter(function (c) { return c.title === "Standard Life × Moneyhub"; }).length, "Standard Life × Moneyhub exists");
check(!!PL.caseStudies.filter(function (c) { return c.title === "Spotify × Uber"; }).length, "Spotify × Uber exists");
check(!!PL.opportunities.filter(function (c) { return c.title === "Workplace Pension Partner Discovery"; }).length, "Workplace Pension exists");

// Accuracy guard: any section labelled "fact" with content must have at least one source.
PL.caseStudies.forEach(function (c) {
  Object.keys(c.sections).forEach(function (k) {
    var s = c.sections[k];
    if (s.label === "fact" && s.body && s.body.trim()) check(c.sources.length > 0, c.slug + "." + k + " has facts but no sources");
  });
});

// Filters
var all = PL.caseStudies.length;
check(P.filterProjects(PL.caseStudies, {}).length === all, "no filter returns all");
check(P.filterProjects(PL.caseStudies, { sector: "Financial services" }).length === 1, "sector filter");
check(P.filterProjects(PL.caseStudies, { type: "Product integration" }).length === 1, "type filter");
check(P.filterProjects(PL.caseStudies, { sector: "Financial services", type: "Product integration" }).length === 0, "combined filter");

// Approach & about
check(PL.approach.steps.length === 7, "seven approach steps");
has(pages.about.html, ">About me</h2>", "about me heading");
has(pages.about.html, ">Contact and CV</h2>", "contact and cv heading");
has(pages.about.html, "I’m Ritul Sawant, a financial-services professional based in Stirling, Scotland", "about intro text");
["ritul.sawant11@gmail.com", "07768088697", "Stirling, Scotland, UK", "linkedin.com/in/ritulsawant", "Download CV"].forEach(function (t) { has(pages.about.html, t, "about contact link " + t); });
check(!/Diligenta|What I am exploring|Background<\/h2>/i.test(pages.about.html), "no separate experience sections on about page");
has(pages["cs:nope"] ? "" : P.caseStudy("nope").html, "Page not found", "unknown slug → 404");

// Presentation Deck component tests
var slHtml = pages["cs:standard-life-moneyhub"].html;
has(slHtml, ">The partnership in 10 slides</h2>", "deck section heading");
has(slHtml, "Explore an executive summary of the opportunity, partner fit, evidence and proposed pilot.", "deck description");
has(slHtml, "Independent analysis by Ritul Sawant. Not an official company presentation.", "deck disclaimer");
has(slHtml, 'id="deck-slide-select"', "mobile slide select");
has(slHtml, 'class="deck-nav-btn is-active"', "active slide button");
has(slHtml, "Slide 1 of 10", "slide counter");
has(slHtml, "deck-btn-prev", "previous slide control");
has(slHtml, "deck-btn-next", "next slide control");
has(slHtml, 'data-scroll-to="executive-summary"', "slide anchor link");
check(!/Download presentation|Download deck|<button[^>]*>Download/i.test(slHtml), "no download button");

// Check all 10 slide buttons are present
for (var sIdx = 0; sIdx < 10; sIdx++) {
  has(slHtml, 'id="deck-tab-' + sIdx + '"', "slide tab " + sIdx + " exists");
}

print("\n" + passes + " passed, " + failures + " failed");
if (failures) throw new Error(failures + " test(s) failed");
