/*
 * APP — hash-based router and site chrome (navigation, mobile menu).
 * Hash routing (#/case-studies) means the site works on any static host,
 * and even when index.html is opened directly from disk.
 */
(function (PL) {
  "use strict";

  var routes = [
    { re: /^\/$/, nav: "home", page: function () { return PL.pages.home(); } },
    { re: /^\/case-studies\/?$/, nav: "case-studies", page: function (m, q) { return PL.pages.caseStudies(q); } },
    { re: /^\/case-studies\/([\w-]+)\/?$/, nav: "case-studies", page: function (m) { return PL.pages.caseStudy(m[1]); } },
    { re: /^\/opportunity-lab\/?$/, nav: "opportunity-lab", page: function () { return PL.pages.opportunityLab(); } },
    { re: /^\/opportunity-lab\/([\w-]+)\/?$/, nav: "opportunity-lab", page: function (m) { return PL.pages.opportunity(m[1]); } },
    { re: /^\/approach\/?$/, nav: "approach", page: function () { return PL.pages.approach(); } },
    { re: /^\/about\/?$/, nav: "about", page: function () { return PL.pages.about(); } }
  ];

  function parseHash() {
    var raw = location.hash.replace(/^#/, "") || "/";
    var parts = raw.split("?");
    var query = {};
    (parts[1] || "").split("&").forEach(function (pair) {
      if (!pair) return;
      var kv = pair.split("=");
      query[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
    });
    return { path: parts[0] || "/", query: query };
  }

  var main, nav, toggle, firstRender = true;

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  }

  function render() {
    var h = parseHash();
    var page = null, navKey = null;
    for (var i = 0; i < routes.length; i++) {
      var m = h.path.match(routes[i].re);
      if (m) { page = routes[i].page(m, h.query); navKey = routes[i].nav; break; }
    }
    if (!page) page = PL.pages.notFound();

    main.innerHTML = '<div class="page">' + page.html + "</div>";
    document.title = (page.title === "Home" ? "" : page.title + " — ") + PL.site.name + " | " + PL.site.author;

    var links = document.querySelectorAll("[data-nav]");
    for (var j = 0; j < links.length; j++) {
      var active = links[j].getAttribute("data-nav") === navKey;
      links[j].classList.toggle("is-active", active);
      if (active) links[j].setAttribute("aria-current", "page"); else links[j].removeAttribute("aria-current");
    }

    setMenu(false);
    if (page.mount) page.mount(main);

    if (!firstRender) {
      window.scrollTo(0, 0);
      var h1 = main.querySelector("h1");
      if (h1) h1.focus({ preventScroll: true });
    }
    firstRender = false;
  }

  function init() {
    main = document.getElementById("main");
    nav = document.getElementById("site-nav");
    toggle = document.querySelector(".nav-toggle");

    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });

    // In-page links (table of contents, skip link) scroll without changing the route.
    document.addEventListener("click", function (e) {
      var link = e.target.closest && e.target.closest("[data-scroll-to]");
      if (!link) return;
      var target = document.getElementById(link.getAttribute("data-scroll-to"));
      if (!target) return;
      e.preventDefault();
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      target.focus({ preventScroll: true });
    });

    var year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    window.addEventListener("hashchange", render);
    render();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(window.PL);
