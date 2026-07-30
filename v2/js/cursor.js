/**
 * Custom cursor — a small white dot in mix-blend-difference that eases toward
 * the pointer and shrinks on press. Skipped entirely on touch devices, where
 * hiding the native cursor would strand the user.
 */
(function () {
  "use strict";

  var CURSOR_EASE = 0.18;

  function isTouchDevice() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      "msMaxTouchPoints" in navigator
    );
  }

  function init() {
    if (isTouchDevice()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    var cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.appendChild(cursor);
    document.body.classList.add("has-custom-cursor");

    var target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var current = { x: target.x, y: target.y };
    var scale = 1;

    function animate() {
      current.x += (target.x - current.x) * CURSOR_EASE;
      current.y += (target.y - current.y) * CURSOR_EASE;

      cursor.style.transform =
        "translate3d(" + current.x + "px, " + current.y + "px, 0) " +
        "translate(-50%, -50%) scale(" + scale + ")";

      window.requestAnimationFrame(animate);
    }

    window.addEventListener(
      "mousemove",
      function (event) {
        target.x = event.clientX;
        target.y = event.clientY;
        cursor.style.opacity = "1";
      },
      { passive: true }
    );

    window.addEventListener("mousedown", function () {
      scale = 0.75;
    });

    window.addEventListener("mouseup", function () {
      scale = 1;
    });

    document.addEventListener("mouseleave", function () {
      cursor.style.opacity = "0";
    });

    document.addEventListener("mouseenter", function () {
      cursor.style.opacity = "1";
    });

    window.requestAnimationFrame(animate);
  }

  window.CustomCursor = { init: init };
})();
