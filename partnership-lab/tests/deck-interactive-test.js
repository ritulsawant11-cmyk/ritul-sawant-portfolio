/*
 * Interactive Deck Unit Tests (runs in macOS JavaScriptCore)
 */
var window = this;

// Minimal DOM mock for JSC
function Element(tagName, id, className) {
  this.tagName = (tagName || "div").toUpperCase();
  this.id = id || "";
  this.className = className || "";
  this.classList = {
    classes: {},
    add: function(c) { this.classes[c] = true; },
    remove: function(c) { delete this.classes[c]; },
    toggle: function(c, val) { if (val) this.classes[c] = true; else delete this.classes[c]; },
    contains: function(c) { return !!this.classes[c]; }
  };
  if (this.className) {
    var self = this;
    this.className.split(/\s+/).filter(Boolean).forEach(function(c) { self.classList.add(c); });
  }
  this.attributes = {};
  this.children = [];
  this.innerHTML = "";
  this.textContent = "";
  this.value = "";
  this.disabled = false;
  this.listeners = {};
}

Element.prototype.setAttribute = function(name, val) { this.attributes[name] = String(val); };
Element.prototype.getAttribute = function(name) { return this.attributes[name] || null; };
Element.prototype.removeAttribute = function(name) { delete this.attributes[name]; };
Element.prototype.addEventListener = function(evt, fn) {
  if (!this.listeners[evt]) this.listeners[evt] = [];
  this.listeners[evt].push(fn);
};
Element.prototype.trigger = function(evt, data) {
  var eventObj = data || { type: evt, target: this, preventDefault: function() {} };
  var current = this;
  while (current) {
    var list = (current.listeners[evt] || []).slice();
    for (var i = 0; i < list.length; i++) {
      list[i].call(current, eventObj);
    }
    current = current.parent;
  }
};
Element.prototype.focus = function() {};

// Load scripts
["content/site.js", "content/case-studies.js", "content/opportunities.js", "content/approach.js",
 "js/components.js", "js/pages.js"].forEach(function(f) { load(f); });

var passes = 0, failures = 0;
function check(cond, msg) {
  if (cond) {
    passes++;
  } else {
    failures++;
    print("FAIL: " + msg);
  }
}

var res = PL.pages.caseStudy("standard-life-moneyhub");
check(typeof res.html === "string", "HTML rendered");
check(typeof res.mount === "function", "mount function returned");

// Build mock DOM elements matching slide deck
var root = new Element("div", "main");
var deck = new Element("div", "", "deck-container");
deck.parent = root;
root.children.push(deck);

var cs = PL.caseStudies.filter(function(c) { return c.slug === "standard-life-moneyhub"; })[0];
var deckData = cs.customSections.filter(function(s) { return s.id === "presentation-deck"; })[0];
check(deckData && deckData.slides.length === 10, "10 slides in dataset");

var navBtns = [];
for (var i = 0; i < 10; i++) {
  var btn = new Element("button", "deck-tab-" + i, "deck-nav-btn" + (i === 0 ? " is-active" : ""));
  btn.setAttribute("data-slide-index", String(i));
  btn.setAttribute("aria-selected", i === 0 ? "true" : "false");
  btn.parent = deck;
  navBtns.push(btn);
  deck.children.push(btn);
}

var select = new Element("select", "deck-slide-select", "deck-select");
select.value = "0";
select.parent = deck;
deck.children.push(select);

var panel = new Element("div", "deck-preview-panel", "deck-card");
panel.parent = deck;
var meta = new Element("div", "", "deck-card-meta");
var badge = new Element("div", "", "deck-card-badge");
var body = new Element("div", "", "deck-card-body");
meta.parent = panel; badge.parent = panel; body.parent = panel;

var prevBtn = new Element("button", "", "btn btn--ghost btn--small deck-btn deck-btn-prev");
prevBtn.disabled = true;
prevBtn.parent = deck;
var nextBtn = new Element("button", "", "btn btn--ghost btn--small deck-btn deck-btn-next");
nextBtn.parent = deck;
var counter = new Element("span", "", "deck-counter");
counter.textContent = "Slide 1 of 10";
counter.parent = deck;

deck.children.push(panel, prevBtn, counter, nextBtn);
panel.children.push(meta, badge, body);

// Mock querySelector / querySelectorAll
deck.querySelectorAll = function(sel) {
  if (sel === ".deck-nav-btn") return navBtns;
  return [];
};
deck.querySelector = function(sel) {
  if (sel === "#deck-slide-select") return select;
  if (sel === ".deck-btn-prev") return prevBtn;
  if (sel === ".deck-btn-next") return nextBtn;
  if (sel === ".deck-counter") return counter;
  if (sel === "#deck-preview-panel") return panel;
  return null;
};
panel.querySelector = function(sel) {
  if (sel === ".deck-card-meta") return meta;
  if (sel === ".deck-card-badge") return badge;
  if (sel === ".deck-card-body") return body;
  return null;
};
root.querySelector = function(sel) {
  if (sel === ".deck-container") return deck;
  return null;
};

// Mount component
res.mount(root);
check(navBtns[0].classList.contains("is-active"), "Slide 1 initially active");
check(prevBtn.disabled === true, "Prev initially disabled on slide 1");
check(nextBtn.disabled === false, "Next initially enabled on slide 1");

// Test selecting Slide 3 (Index 2)
navBtns[2].trigger("click");
check(navBtns[2].classList.contains("is-active"), "Slide 3 active after click");
check(!navBtns[0].classList.contains("is-active"), "Slide 1 no longer active");
check(select.value === "2", "Select value synced to 2");
check(counter.textContent === "Slide 3 of 10", "Counter updated to Slide 3 of 10");
check(prevBtn.disabled === false, "Prev enabled on slide 3");
check(nextBtn.disabled === false, "Next enabled on slide 3");
check(body.innerHTML.indexOf("Standard Life: Workplace scale") !== -1, "Panel content updated to slide 3");

// Test Next button click (should go to slide 4, index 3)
nextBtn.trigger("click");
check(navBtns[3].classList.contains("is-active"), "Slide 4 active after Next");
check(counter.textContent === "Slide 4 of 10", "Counter updated to Slide 4 of 10");
check(body.innerHTML.indexOf("Qualitative assessment favours turnkey Open Finance") !== -1, "Panel has slide 4 title");

// Test Prev button click (should go back to slide 3, index 2)
prevBtn.trigger("click");
check(navBtns[2].classList.contains("is-active"), "Slide 3 active after Prev");
check(counter.textContent === "Slide 3 of 10", "Counter updated back to Slide 3 of 10");

// Test boundary: jump to Slide 10 (Index 9)
navBtns[9].trigger("click");
check(counter.textContent === "Slide 10 of 10", "Counter at Slide 10 of 10");
check(nextBtn.disabled === true, "Next disabled on slide 10 boundary");
check(prevBtn.disabled === false, "Prev enabled on slide 10");
check(body.innerHTML.indexOf("Test enhanced onboarding before wider rollout") !== -1, "Panel has slide 10 conclusion");

// Clicking Next when on slide 10 should stay on slide 10
nextBtn.trigger("click");
check(counter.textContent === "Slide 10 of 10", "Still on Slide 10 of 10 at boundary");

// Test mobile selector change event: jump to Slide 2 (Index 1)
select.value = "1";
select.trigger("change");
check(navBtns[1].classList.contains("is-active"), "Slide 2 active after select change");
check(counter.textContent === "Slide 2 of 10", "Counter at Slide 2 of 10");
check(body.innerHTML.indexOf("£31.1B in lost pensions") !== -1, "Panel has slide 2 problem content");

// Test Keyboard navigation: Left Arrow (moves to index 0)
deck.trigger("keydown", { key: "ArrowLeft", target: deck, preventDefault: function() {} });
check(navBtns[0].classList.contains("is-active"), "Left arrow moved to slide 1");
check(prevBtn.disabled === true, "Prev disabled on slide 1 boundary");

// Test Keyboard navigation: Right Arrow (moves to index 1)
deck.trigger("keydown", { key: "ArrowRight", target: deck, preventDefault: function() {} });
check(navBtns[1].classList.contains("is-active"), "Right arrow moved to slide 2");

print("\nInteractive Tests: " + passes + " passed, " + failures + " failed");
if (failures) throw new Error(failures + " interactive test(s) failed");
