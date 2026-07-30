/**
 * Renders the page from window.SITE and wires up every interaction.
 */
(function () {
  "use strict";

  var SITE = window.SITE;

  /* ------------------------------------------------------------------ utils */

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /* ------------------------------------------------------------------ icons */

  var ICON_PATHS = {
    mapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
    github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 5-1.8 5-5 0-1.2-.4-2.3-1-3.2.3-1 .3-2.1-.1-3.1 0 0-1.5.4-3 1.5a8.6 8.6 0 0 0-5 0C8.4 3.6 6.9 3.2 6.9 3.2c-.4 1-.4 2.1-.1 3.1A4.6 4.6 0 0 0 6 9.5c0 3.2 2 5 5 5a4.8 4.8 0 0 0-1 3.5v4"/><path d="M9 18c-4.5 2-5-2-7-2"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.8 12.8 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.8 12.8 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    menu: '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
    close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    externalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>'
  };

  function icon(name, className) {
    return (
      '<svg class="icon ' + (className || "") + '" viewBox="0 0 24 24" fill="none" ' +
      'stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round" aria-hidden="true">' + ICON_PATHS[name] + "</svg>"
    );
  }

  /* --------------------------------------------------------------- background */

  function initBackground() {
    var container = $("#grainient");

    if (!container || !window.Grainient) return;

    window.Grainient.mount(container, {
      color1: "#9ebed8",
      color2: "#16293f",
      color3: "#3d5c7a"
    });
  }

  /* ---------------------------------------------------------------------- nav */

  function initNav() {
    var desktopIsland = $(".nav-island--desktop");
    var mobilePanel = $("#nav-mobile-panel");
    var mobileToggle = $("#nav-toggle");
    var brandLabels = $$("[data-nav-brand]");
    var home = $("#home");

    function setScrolled() {
      if (desktopIsland) {
        desktopIsland.setAttribute("data-scrolled", window.scrollY > 12 ? "true" : "false");
      }
    }

    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });

    // The brand reads "Portfolio" over the hero, then becomes the name.
    function setBrand(isHeroActive) {
      brandLabels.forEach(function (label) {
        label.textContent = isHeroActive ? "Portfolio" : SITE.name;
      });
    }

    setBrand(true);

    if (home && "IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          var entry = entries[0];
          setBrand(entry.isIntersecting && entry.intersectionRatio > 0.35);
        },
        { threshold: [0, 0.2, 0.35, 0.5, 0.75], rootMargin: "-72px 0px 0px 0px" }
      ).observe(home);
    }

    function closeMobilePanel() {
      if (!mobilePanel) return;
      mobilePanel.hidden = true;
      if (mobileToggle) mobileToggle.setAttribute("aria-expanded", "false");
      if (mobileToggle) mobileToggle.innerHTML = icon("menu");
    }

    if (mobileToggle && mobilePanel) {
      mobileToggle.innerHTML = icon("menu");
      mobileToggle.addEventListener("click", function () {
        var willOpen = mobilePanel.hidden;
        mobilePanel.hidden = !willOpen;
        mobileToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
        mobileToggle.innerHTML = icon(willOpen ? "close" : "menu");
      });
    }

    // Smooth-scroll every in-page link and collapse the mobile panel after.
    document.addEventListener("click", function (event) {
      var link = event.target.closest ? event.target.closest('a[href^="#"]') : null;

      if (!link) return;

      var id = link.getAttribute("href");

      if (id === "#" || id.length < 2) return;

      var destination = document.querySelector(id);

      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth"
      });
      closeMobilePanel();
    });
  }

  /* -------------------------------------------------------------------- hero */

  function initHero() {
    var container = $("#hero-subtitle");

    if (!container) return;

    var phrases = SITE.heroTyped || [];

    if (phrases.length === 0) return;

    /* Typewriter timing, in ms. TYPE_MS is per character going forward,
       DELETE_MS per character coming back (deleting reads better fast).
       HOLD_MS is the pause on a completed phrase. */
    var TYPE_MS = 55;
    var DELETE_MS = 28;
    var HOLD_MS = 1600;
    var GAP_MS = 320;

    var line = document.createElement("div");
    line.className = "hero__subtitle-line";
    line.setAttribute("data-adaptive-tone", "");

    // The typed text changes constantly, which is noise for a screen reader —
    // expose one stable label instead.
    var srLabel = document.createElement("span");
    srLabel.className = "sr-only";
    srLabel.textContent = SITE.heroAriaLabel || phrases[0];

    var visible = document.createElement("span");
    visible.setAttribute("aria-hidden", "true");

    var prefix = document.createElement("span");
    prefix.textContent = SITE.heroPrefix || "";

    var typed = document.createElement("span");
    typed.className = "hero__typed";

    var caret = document.createElement("span");
    caret.className = "hero__caret";

    visible.appendChild(prefix);
    visible.appendChild(typed);
    visible.appendChild(caret);
    line.appendChild(srLabel);
    line.appendChild(visible);
    container.appendChild(line);
    window.AdaptiveText.register(line);

    if (prefersReducedMotion()) {
      typed.textContent = phrases[0];
      caret.remove();
      return;
    }

    var phraseIndex = 0;
    var charIndex = 0;
    var deleting = false;

    function tick() {
      var phrase = phrases[phraseIndex];

      if (!deleting) {
        charIndex += 1;
        typed.textContent = phrase.slice(0, charIndex);

        if (charIndex === phrase.length) {
          deleting = true;
          // Caret stops blinking mid-word; let it resume while we pause.
          caret.setAttribute("data-resting", "true");
          window.setTimeout(tick, HOLD_MS);
          return;
        }

        window.setTimeout(tick, TYPE_MS);
        return;
      }

      caret.removeAttribute("data-resting");
      charIndex -= 1;
      typed.textContent = phrase.slice(0, charIndex);

      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, GAP_MS);
        return;
      }

      window.setTimeout(tick, DELETE_MS);
    }

    tick();
  }

  /* ------------------------------------------------------------------- about */

  function initAbout() {
    var copy = $("#about-copy");
    var media = $("#about-media");

    if (copy) {
      copy.innerHTML = (SITE.about.paragraphs || [])
        .map(function (paragraph) {
          return "<p>" + esc(paragraph) + "</p>";
        })
        .join("");
    }

    var images = (SITE.about && SITE.about.images) || [];

    if (media && images.length === 0) {
      media.innerHTML =
        '<div class="about__media-empty">' +
          "<p>Add a photo</p>" +
          "<p>Set <code>about.images</code> in <code>js/data.js</code></p>" +
        "</div>";
    }

    if (media && images.length > 0) {
      media.innerHTML = images
        .map(function (src, index) {
          return (
            '<img src="' + esc(src) + '" alt="' + esc(SITE.name) + '"' +
            ' loading="' + (index === 0 ? "eager" : "lazy") + '" decoding="async"' +
            ' data-active="' + (index === 0 ? "true" : "false") + '"' +
            (index === 0 ? "" : ' aria-hidden="true"') + ">"
          );
        })
        .join("");

      if (images.length > 1) {
        var frames = $$("img", media);
        var active = 0;
        // How long each photo is held before cross-fading to the next.
        var PHOTO_HOLD_MS = 8000;

        window.setInterval(function () {
          frames[active].setAttribute("data-active", "false");
          frames[active].setAttribute("aria-hidden", "true");
          active = (active + 1) % frames.length;
          frames[active].setAttribute("data-active", "true");
          frames[active].removeAttribute("aria-hidden");
        }, PHOTO_HOLD_MS);
      }
    }
  }

  /* ---------------------------------------------------------------- timeline */

  function timelineItemMarkup(item) {
    var subtitle = item.subtitleLink
      ? '<a class="timeline-item__subtitle adaptive-link" href="' + esc(item.subtitleLink) +
        '" target="_blank" rel="noopener noreferrer">' + esc(item.subtitle) + "</a>"
      : '<p class="timeline-item__subtitle muted">' + esc(item.subtitle) + "</p>";

    var logo = item.logo
      ? '<div class="timeline-item__logo"><img src="' + esc(item.logo) +
        '" alt="' + esc(item.subtitle) + ' logo" loading="lazy" decoding="async"></div>'
      : "";

    var location = item.location
      ? '<div class="timeline-item__location">' +
        "<div>" + icon("mapPin") + "<span>" + esc(item.location) + "</span></div>" +
        '<div class="timeline-item__chevron">' + icon("chevronDown") +
        '<span class="timeline-item__hint" data-expand-hint></span></div>' +
        "</div>"
      : "";

    var bullets = (item.bullets || [])
      .map(function (bullet) {
        return "<li>" + esc(bullet) + "</li>";
      })
      .join("");

    return (
      '<article class="timeline-item" data-visible="false" data-expanded="false">' +
        '<div class="timeline-item__meta">' +
          '<div class="timeline-item__date font-mono" data-adaptive-tone>' + esc(item.date) + "</div>" +
          logo +
        "</div>" +
        '<div class="timeline-item__rail"><span></span></div>' +
        '<div class="timeline-item__body" data-adaptive-tone tabindex="0">' +
          "<h3>" + esc(item.title) + "</h3>" +
          subtitle +
          location +
          '<div class="timeline-item__detail">' +
            '<ul class="timeline-item__detail-inner">' + bullets + "</ul>" +
          "</div>" +
        "</div>" +
      "</article>"
    );
  }

  function initTimeline(containerId, items) {
    var container = $(containerId);

    if (!container) return;

    container.innerHTML = (items || []).map(timelineItemMarkup).join("");

    var isMobile = window.matchMedia("(max-width: 767px)").matches;

    $$(".timeline-item", container).forEach(function (element) {
      var body = $(".timeline-item__body", element);
      var hint = $("[data-expand-hint]", element);

      function setExpanded(expanded) {
        element.setAttribute("data-expanded", expanded ? "true" : "false");

        if (hint && isMobile) {
          hint.textContent = expanded ? "Click to collapse" : "Click to expand";
        }
      }

      setExpanded(false);

      if (isMobile) {
        body.addEventListener("click", function () {
          setExpanded(element.getAttribute("data-expanded") !== "true");
        });
      } else {
        body.addEventListener("mouseenter", function () {
          setExpanded(true);
        });
        body.addEventListener("mouseleave", function () {
          setExpanded(false);
        });
      }

      // Keyboard users get the same disclosure the pointer gets.
      body.addEventListener("focus", function () {
        setExpanded(true);
      });
      body.addEventListener("blur", function () {
        setExpanded(false);
      });
    });

    revealOnScroll($$(".timeline-item", container));
  }

  function revealOnScroll(elements) {
    if (!("IntersectionObserver" in window)) {
      elements.forEach(function (element) {
        element.setAttribute("data-visible", "true");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          entry.target.setAttribute("data-visible", "true");
          observer.unobserve(entry.target);
          window.AdaptiveText.scheduleSync();
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  /* ---------------------------------------------------------------- projects */

  function projectCardMarkup(project, index) {
    // No autoplay attribute and preload="metadata": the clips total ~25MB, so
    // they only fetch their first frame up front and start playing when
    // scrolled into view (see observeProjectVideos).
    var media =
      project.media.type === "video"
        ? '<video data-src="' + esc(project.media.src) + '#t=0.1" loop muted ' +
          'playsinline preload="metadata" aria-label="' + esc(project.title) + ' demo"></video>' +
          '<span class="project-card__badge">Video</span>'
        : '<img src="' + esc(project.media.src) + '" alt="' + esc(project.title) +
          ' preview" loading="lazy" decoding="async">';

    var tags = (project.tags || [])
      .slice(0, 3)
      .map(function (tag) {
        return '<span class="badge">' + esc(tag) + "</span>";
      })
      .join("");

    if ((project.tags || []).length > 3) {
      tags += '<span class="badge">+' + (project.tags.length - 3) + "</span>";
    }

    var actions = project.caseStudy
      ? '<a class="btn btn--outline btn--sm" href="' + esc(project.caseStudy) + '">' +
        icon("externalLink") + "Case study</a>"
      : "";

    return (
      '<article class="project-card" data-category="' + esc(project.category) + '"' +
      ' style="animation-delay:' + (index % 4) * 100 + 'ms">' +
        '<div class="project-card__media">' + media + "</div>" +
        '<div class="project-card__body">' +
          "<h3>" + esc(project.title) + "</h3>" +
          '<p class="project-card__description">' + esc(project.description) + "</p>" +
          '<div class="project-card__tags">' + tags + "</div>" +
          '<div class="project-card__actions">' + actions + "</div>" +
        "</div>" +
      "</article>"
    );
  }

  /**
   * Attaches each clip's source and plays it only while its card is on screen,
   * pausing again once it scrolls away. Without this all four videos download
   * and decode at page load, which is most of the site's weight.
   */
  function observeProjectVideos(grid) {
    var videos = $$("video[data-src]", grid);

    if (videos.length === 0) return;

    function load(video) {
      if (video.src) return;
      video.src = video.getAttribute("data-src");
    }

    if (!("IntersectionObserver" in window)) {
      videos.forEach(function (video) {
        load(video);
        video.play().catch(function () {});
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var video = entry.target;

          if (entry.isIntersecting) {
            load(video);
            // Autoplay can still be refused; a paused first frame is fine.
            video.play().catch(function () {});
          } else if (!video.paused) {
            video.pause();
          }
        });
      },
      { rootMargin: "200px 0px", threshold: 0.1 }
    );

    videos.forEach(function (video) {
      observer.observe(video);
    });
  }

  function initProjects() {
    var grid = $("#projects-grid");
    var filters = $("#projects-filters");
    var projects = SITE.projects || [];

    if (!grid) return;

    grid.innerHTML = projects.map(projectCardMarkup).join("");
    observeProjectVideos(grid);

    if (!filters) return;

    var categories = ["All"];

    projects.forEach(function (project) {
      if (categories.indexOf(project.category) === -1) categories.push(project.category);
    });

    filters.innerHTML = categories
      .map(function (category, index) {
        return (
          '<button type="button" class="filter-chip" data-filter="' + esc(category) + '"' +
          ' aria-pressed="' + (index === 0 ? "true" : "false") + '">' + esc(category) + "</button>"
        );
      })
      .join("");

    filters.addEventListener("click", function (event) {
      var chip = event.target.closest("[data-filter]");

      if (!chip) return;

      var filter = chip.getAttribute("data-filter");

      $$("[data-filter]", filters).forEach(function (other) {
        other.setAttribute("aria-pressed", other === chip ? "true" : "false");
      });

      $$(".project-card", grid).forEach(function (card) {
        var matches = filter === "All" || card.getAttribute("data-category") === filter;
        card.hidden = !matches;
      });

      window.AdaptiveText.scheduleSync();
    });
  }

  /* -------------------------------------------------------------- tech stack */

  function initTechStack() {
    var container = $("#tech-stack-groups");

    if (!container) return;

    container.innerHTML = (SITE.techStack || [])
      .map(function (group) {
        var pills = (group.skills || [])
          .map(function (skill) {
            return '<span class="tech-pill">' + esc(skill) + "</span>";
          })
          .join("");

        return (
          '<div class="tech-group" style="--dot:' + esc(group.color) + '">' +
            '<div class="tech-group__heading">' +
              "<h3>" + esc(group.category) + "</h3>" +
              '<span class="tech-group__dot"></span>' +
            "</div>" +
            '<div class="tech-group__card">' + pills + "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ----------------------------------------------------------------- contact */

  function initContact() {
    var list = $("#contact-list");
    var socials = $("#footer-socials");
    var contact = SITE.contact || {};

    if (list) {
      var rows = [];

      if (contact.email) {
        rows.push({
          icon: "mail",
          label: contact.email,
          href: "mailto:" + contact.email
        });
      }

      if (contact.linkedin) {
        rows.push({
          icon: "linkedin",
          label: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ""),
          href: contact.linkedin,
          external: true
        });
      }

      if (contact.github) {
        rows.push({
          icon: "github",
          label: contact.github.replace(/^https?:\/\/(www\.)?/, ""),
          href: contact.github,
          external: true
        });
      }

      if (contact.phone) {
        rows.push({
          icon: "phone",
          label: contact.phone,
          href: "tel:" + contact.phone.replace(/[^\d+]/g, "")
        });
      }

      if (contact.location) {
        rows.push({ icon: "mapPin", label: contact.location });
      }

      list.innerHTML = rows
        .map(function (row) {
          var content = row.href
            ? '<a class="adaptive-link" href="' + esc(row.href) + '"' +
              (row.external ? ' target="_blank" rel="noopener noreferrer"' : "") + ">" +
              esc(row.label) + "</a>"
            : "<span>" + esc(row.label) + "</span>";

          return "<li>" + icon(row.icon, "icon--md") + content + "</li>";
        })
        .join("");
    }

    if (socials) {
      var links = [];

      if (contact.email) {
        links.push({ icon: "mail", href: "mailto:" + contact.email, label: "Email" });
      }
      if (contact.linkedin) {
        links.push({ icon: "linkedin", href: contact.linkedin, label: "LinkedIn" });
      }
      if (contact.github) {
        links.push({ icon: "github", href: contact.github, label: "GitHub" });
      }

      socials.innerHTML = links
        .map(function (link) {
          return (
            '<a class="btn btn--ghost btn--icon" href="' + esc(link.href) + '"' +
            ' target="_blank" rel="noopener noreferrer">' +
            icon(link.icon, "icon--md") +
            '<span class="sr-only">' + esc(link.label) + "</span></a>"
          );
        })
        .join("");
    }

    initContactForm();
  }

  function initContactForm() {
    var form = $("#contact-form");

    if (!form) return;

    var status = $("#form-status", form);
    var submit = $("[type=submit]", form);
    var key = SITE.web3FormsKey;

    function setStatus(state, message) {
      status.setAttribute("data-state", state);
      status.textContent = message;
    }

    // Without a Web3Forms key there is no backend to post to, so fall back to
    // opening the user's mail client with the message prefilled.
    if (!key) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();

        var data = new FormData(form);
        var subject = "Portfolio enquiry from " + (data.get("name") || "");
        var body =
          (data.get("message") || "") + "\n\n— " + (data.get("name") || "") +
          " (" + (data.get("email") || "") + ")";

        window.location.href =
          "mailto:" + SITE.contact.email +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);

        setStatus("pending", "Opening your email client…");
      });

      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var data = new FormData(form);
      data.append("access_key", key);
      data.append("subject", "New message from your portfolio");

      submit.disabled = true;
      setStatus("pending", "Sending…");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          if (result.success) {
            form.reset();
            setStatus("success", "Thanks — your message is on its way.");
          } else {
            setStatus("error", result.message || "Something went wrong. Please email me directly.");
          }
        })
        .catch(function () {
          setStatus("error", "Network error. Please email me directly.");
        })
        .finally(function () {
          submit.disabled = false;
        });
    });
  }

  /* ------------------------------------------------------------ resume modal */

  function initResume() {
    var dialog = $("#resume-dialog");
    var body = $("#resume-body");
    var footer = $("#resume-footer");
    var updated = $("#resume-updated");
    var resumes = SITE.resumes || [];
    var lastFocused = null;

    if (!dialog || resumes.length === 0) return;

    if (updated) updated.textContent = "Last modified: " + (SITE.resumeUpdated || "—");

    var current = resumes[0];

    function renderViewer() {
      body.innerHTML =
        '<iframe src="' + esc(current.url) + '" title="' + esc(SITE.name) + ' resume"></iframe>';

      footer.innerHTML =
        '<a class="btn btn--outline btn--sm" href="' + esc(current.url) +
        '" target="_blank" rel="noopener noreferrer">' + icon("externalLink") +
        "Open in new tab</a>" +
        '<a class="btn btn--primary btn--sm" href="' + esc(current.url) + '" download>' +
        icon("download") + "Download PDF</a>";
    }

    function open() {
      lastFocused = document.activeElement;
      renderViewer();
      dialog.hidden = false;
      document.body.style.overflow = "hidden";
      $(".dialog__close", dialog).focus();
    }

    function close() {
      dialog.hidden = true;
      document.body.style.overflow = "";
      // Unload the PDF so it stops consuming memory while closed.
      body.innerHTML = "";
      if (lastFocused) lastFocused.focus();
    }

    $$("[data-resume-open]").forEach(function (trigger) {
      trigger.addEventListener("click", open);
    });

    $$("[data-resume-close]", dialog).forEach(function (trigger) {
      trigger.addEventListener("click", close);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && !dialog.hidden) close();
    });
  }

  /* -------------------------------------------------------------------- boot */

  function init() {
    $$("[data-site-name]").forEach(function (element) {
      element.textContent = SITE.name;
    });

    initBackground();
    initHero();
    initAbout();
    initTimeline("#experience-timeline", SITE.experience);
    initTimeline("#education-timeline", SITE.education);
    initTimeline("#publications-timeline", SITE.publications);
    initProjects();
    initTechStack();
    initContact();
    initResume();
    initNav();

    // Register after every section is in the DOM so nothing is missed.
    window.AdaptiveText.registerAll();
    window.AdaptiveText.scheduleSync();

    if (window.CustomCursor) window.CustomCursor.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
