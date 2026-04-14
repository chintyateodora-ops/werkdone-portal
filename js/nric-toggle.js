/**
 * NRIC / FIN: default is plain text (revealed). Optional mask uses bullets (●) per character.
 * Markup: .field__nric.field__nric--masked|.field__nric--revealed >
 *   .field__nric-store (hidden value) + .field__nric-face > (.field__nric-asterisks | .field__nric-edit) + [data-nric-toggle]
 */
(function () {
  "use strict";

  var BULLET = "\u25CF";

  function maskText(len) {
    if (!len) return "";
    var s = "";
    for (var i = 0; i < len; i++) s += BULLET;
    return s;
  }

  function updateMaskDisplay(shell) {
    var store = shell.querySelector(".field__nric-store");
    var span = shell.querySelector(".field__nric-asterisks");
    if (!store || !span) return;
    span.textContent = maskText((store.value || "").length);
  }

  function bindShell(shell) {
    if (shell.getAttribute("data-nric-bound")) return;
    shell.setAttribute("data-nric-bound", "1");

    var store = shell.querySelector(".field__nric-store");
    var edit = shell.querySelector(".field__nric-edit");
    var span = shell.querySelector(".field__nric-asterisks");
    var btn = shell.querySelector("[data-nric-toggle]");
    if (!store || !edit || !span || !btn) return;

    function setRevealed(on, skipFocus) {
      // Disabled fields should always render masked for safety.
      if (edit.disabled || edit.readOnly) on = false;
      if (on) {
        shell.classList.add("field__nric--revealed");
        shell.classList.remove("field__nric--masked");
        span.setAttribute("hidden", "hidden");
        span.style.display = "none";
        edit.removeAttribute("hidden");
        edit.style.display = "block";
        edit.value = store.value || "";
        btn.setAttribute("aria-pressed", "true");
        btn.setAttribute("aria-label", "Hide NRIC");
        btn.setAttribute("title", "Hide NRIC");
        if (!skipFocus) {
          try {
            edit.focus();
          } catch (_) {}
        }
      } else {
        shell.classList.add("field__nric--masked");
        shell.classList.remove("field__nric--revealed");
        store.value = edit.value;
        updateMaskDisplay(shell);
        span.removeAttribute("hidden");
        span.style.display = "";
        edit.setAttribute("hidden", "hidden");
        edit.style.display = "none";
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Show NRIC");
        btn.setAttribute("title", "Show NRIC");
      }
    }

    updateMaskDisplay(shell);
    /* Default: value visible unless disabled; empty field shows no bullets. */
    setRevealed(!(edit.disabled || edit.readOnly), true);

    function syncDisabled() {
      var d = !!(edit.disabled || edit.readOnly);
      btn.disabled = d;
      btn.toggleAttribute("disabled", d);
      if (d) setRevealed(false, true);
    }
    syncDisabled();
    try {
      new MutationObserver(syncDisabled).observe(edit, { attributes: true, attributeFilter: ["disabled", "readonly"] });
    } catch (_) {}

    edit.addEventListener("input", function () {
      store.value = edit.value;
    });

    edit.addEventListener("change", function () {
      store.value = edit.value;
    });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (edit.disabled || edit.readOnly) return;
      var revealed = shell.classList.contains("field__nric--revealed");
      setRevealed(!revealed);
    });
  }

  window.WD_initNricFields = function (root) {
    var r = root || document;
    r.querySelectorAll(".field__nric").forEach(bindShell);
  };

  /** After Singpass / programmatic store value set — sync visible edit or bullet mask */
  window.WD_syncNricMasks = function (root) {
    var r = root || document;
    r.querySelectorAll(".field__nric").forEach(function (shell) {
      var store = shell.querySelector(".field__nric-store");
      var edit = shell.querySelector(".field__nric-edit");
      var btn = shell.querySelector("[data-nric-toggle]");
      if (!store || !edit) return;
      if (edit.disabled || edit.readOnly) {
        shell.classList.add("field__nric--masked");
        shell.classList.remove("field__nric--revealed");
        updateMaskDisplay(shell);
        if (btn) {
          btn.disabled = true;
          btn.toggleAttribute("disabled", true);
        }
        return;
      }
      if (btn) {
        btn.disabled = false;
        btn.toggleAttribute("disabled", false);
      }
      if (shell.classList.contains("field__nric--revealed")) {
        edit.value = store.value || "";
      } else {
        updateMaskDisplay(shell);
      }
    });
  };
})();
