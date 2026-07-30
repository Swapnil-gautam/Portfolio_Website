/**
 * Adaptive tone.
 *
 * The animated gradient behind the page moves between light and dark regions,
 * so fixed text colours would drop out of contrast. Every registered element
 * samples the luminance of the gradient beneath it and flips between a light
 * and a dark tone class.
 *
 * Sampling reads pixels straight off the WebGL drawing buffer, so it must run
 * in the same frame as the render — see grainient.js.
 */
(function () {
  "use strict";

  var SYNC_INTERVAL_MS = 220;
  var LIGHT_BACKGROUND_THRESHOLD = 0.5;

  var targets = new Set();

  var sampler = null;
  var refresh = null;
  var lastSyncTime = 0;
  var listenersAttached = false;
  var syncFrameId = 0;

  function getSamplePoints(rect) {
    var left = Math.max(rect.left, 0);
    var right = Math.min(rect.right, window.innerWidth);
    var top = Math.max(rect.top, 0);
    var bottom = Math.min(rect.bottom, window.innerHeight);
    var centerX = (left + right) / 2;
    var centerY = (top + bottom) / 2;

    // Sampling now reads from a CPU-side copy of the gradient, so extra points
    // are essentially free — five gives a steadier reading than three.
    return [
      { x: centerX, y: centerY },
      { x: left + (right - left) * 0.2, y: centerY },
      { x: left + (right - left) * 0.8, y: centerY },
      { x: centerX, y: top + (bottom - top) * 0.2 },
      { x: centerX, y: top + (bottom - top) * 0.8 }
    ];
  }

  function computeTextTone(rect) {
    if (!sampler) return "light";

    var points = getSamplePoints(rect);
    var total = 0;
    var valid = 0;

    for (var i = 0; i < points.length; i += 1) {
      var luminance = sampler(points[i].x, points[i].y);

      if (luminance === null || Number.isNaN(luminance)) continue;

      total += luminance;
      valid += 1;
    }

    if (valid === 0) return "light";

    return total / valid > LIGHT_BACKGROUND_THRESHOLD ? "dark" : "light";
  }

  function attachListenersIfNeeded() {
    if (listenersAttached) return;

    listenersAttached = true;
    window.addEventListener("scroll", scheduleSync, true);
    window.addEventListener("resize", scheduleSync);
    window.addEventListener("orientationchange", scheduleSync);
  }

  function detachListenersIfNeeded() {
    if (targets.size > 0 || !listenersAttached) return;

    listenersAttached = false;
    window.removeEventListener("scroll", scheduleSync, true);
    window.removeEventListener("resize", scheduleSync);
    window.removeEventListener("orientationchange", scheduleSync);
  }

  function sync(force) {
    if (!sampler) return;

    var now = performance.now();

    if (!force && now - lastSyncTime < SYNC_INTERVAL_MS) return;

    lastSyncTime = now;

    // Collect what is actually on screen first, so the (relatively expensive)
    // buffer refresh is skipped entirely when nothing needs measuring.
    var visible = [];

    targets.forEach(function (target) {
      if (!document.body.contains(target.element)) {
        targets.delete(target);
        return;
      }

      var rect = target.element.getBoundingClientRect();

      // Skip anything collapsed or offscreen — nothing to read there.
      if (
        rect.width < 1 ||
        rect.height < 1 ||
        rect.bottom < 0 ||
        rect.top > window.innerHeight ||
        rect.right < 0 ||
        rect.left > window.innerWidth
      ) {
        return;
      }

      visible.push({ target: target, rect: rect });
    });

    if (visible.length === 0) {
      detachListenersIfNeeded();
      return;
    }

    // One GPU readback for the whole batch, not one per sample point.
    if (refresh) refresh();

    visible.forEach(function (entry) {
      var nextTone = computeTextTone(entry.rect);

      if (entry.target.currentTone === nextTone) return;

      entry.target.currentTone = nextTone;
      entry.target.element.classList.toggle("adaptive-tone--dark", nextTone === "dark");
      entry.target.element.classList.toggle("adaptive-tone--light", nextTone === "light");
    });

    detachListenersIfNeeded();
  }

  function scheduleSync() {
    if (syncFrameId !== 0) return;

    syncFrameId = window.requestAnimationFrame(function () {
      syncFrameId = 0;
      sync(true);
    });
  }

  /**
   * @param nextSampler (x, y) -> luminance 0..1, or null if off-canvas.
   *                    Must be cheap: it is called several times per element.
   * @param nextRefresh optional; called once per sync to update whatever the
   *                    sampler reads from.
   */
  function setSampler(nextSampler, nextRefresh) {
    sampler = nextSampler;
    refresh = nextRefresh || null;
    scheduleSync();
  }

  /** Registers an element for tone flipping. Returns an unregister function. */
  function register(element) {
    var target = { currentTone: null, element: element };

    element.classList.add("adaptive-tone", "adaptive-tone--light");
    targets.add(target);
    attachListenersIfNeeded();
    scheduleSync();

    return function () {
      targets.delete(target);
      detachListenersIfNeeded();
    };
  }

  /** Registers every [data-adaptive-tone] element currently in the document. */
  function registerAll(root) {
    var scope = root || document;
    var elements = scope.querySelectorAll("[data-adaptive-tone]");

    for (var i = 0; i < elements.length; i += 1) {
      register(elements[i]);
    }
  }

  window.AdaptiveText = {
    register: register,
    registerAll: registerAll,
    sync: sync,
    scheduleSync: scheduleSync,
    setSampler: setSampler
  };
})();
