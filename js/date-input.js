/**
 * DD-MM-YYYY text fields + native date picker (calendar button).
 * Markup: .field__date > .field__date-text + .field__date-btn + .field__date-native
 */
(function () {
  "use strict";

  function digitsOnly(str) {
    return String(str || "").replace(/\D/g, "").slice(0, 8);
  }

  function formatDdMmYyyyFromDigits(d) {
    if (d.length <= 2) return d;
    if (d.length <= 4) return d.slice(0, 2) + "-" + d.slice(2);
    return d.slice(0, 2) + "-" + d.slice(2, 4) + "-" + d.slice(4);
  }

  function parseDdMmYyyy(str) {
    const m = String(str || "").trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (!m) return null;
    const dd = +m[1];
    const mm = +m[2];
    const yyyy = +m[3];
    const dt = new Date(yyyy, mm - 1, dd);
    if (dt.getFullYear() !== yyyy || dt.getMonth() !== mm - 1 || dt.getDate() !== dd) return null;
    return dt;
  }

  function dateToIso(dt) {
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + d;
  }

  function isoToDdMmYyyy(iso) {
    if (!iso || typeof iso !== "string") return "";
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return "";
    return m[3] + "-" + m[2] + "-" + m[1];
  }

  /** Normalize legacy / ISO / partial displays toward DD-MM-YYYY when possible */
  function normalizeDateDisplay(input) {
    const t = String(input || "").trim();
    if (!t || t === "—") return t;
    const direct = parseDdMmYyyy(t);
    if (direct) return isoToDdMmYyyy(dateToIso(direct));
    const slash = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2}|\d{4})$/);
    if (slash) {
      let dd = +slash[1];
      let mm = +slash[2];
      let y = +slash[3];
      if (y < 100) y += y >= 50 ? 1900 : 2000;
      const dt = new Date(y, mm - 1, dd);
      if (dt.getFullYear() === y && dt.getMonth() === mm - 1 && dt.getDate() === dd) {
        return isoToDdMmYyyy(dateToIso(dt));
      }
    }
    const iso = t.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (iso) {
      const y = +iso[1];
      const mo = +iso[2];
      const d = +iso[3];
      const dt = new Date(y, mo - 1, d);
      if (dt.getFullYear() === y && dt.getMonth() === mo - 1 && dt.getDate() === d) {
        return isoToDdMmYyyy(t);
      }
    }
    return t;
  }

  function syncNativeFromText(text, native) {
    const dt = parseDdMmYyyy(text.value.trim());
    if (dt) native.value = dateToIso(dt);
    else if (!String(text.value).trim()) native.value = "";
  }

  function syncTextFromNative(text, native) {
    if (!native.value) return;
    text.value = isoToDdMmYyyy(native.value);
  }

  function bindWrap(wrap) {
    if (wrap.getAttribute("data-date-bound") === "1") return;
    wrap.setAttribute("data-date-bound", "1");
    const text = wrap.querySelector(".field__date-text");
    const native = wrap.querySelector(".field__date-native");
    const btn = wrap.querySelector(".field__date-btn");
    if (!text || !native || !btn) return;

    const norm = normalizeDateDisplay(text.value);
    if (norm !== text.value && /^\d{2}-\d{2}-\d{4}$/.test(norm)) {
      text.value = norm;
    }
    syncNativeFromText(text, native);

    text.addEventListener("input", function () {
      const pos = text.selectionStart;
      const before = text.value;
      const digits = digitsOnly(before);
      const next = formatDdMmYyyyFromDigits(digits);
      if (next !== before) {
        text.value = next;
        const delta = next.length - before.length;
        const np = Math.max(0, Math.min(next.length, (pos == null ? next.length : pos) + delta));
        try {
          text.setSelectionRange(np, np);
        } catch (_) {
          /* ignore */
        }
      }
      syncNativeFromText(text, native);
    });

    text.addEventListener("blur", function () {
      const n = normalizeDateDisplay(text.value);
      if (n !== text.value && /^\d{2}-\d{2}-\d{4}$/.test(n)) text.value = n;
      syncNativeFromText(text, native);
    });

    native.addEventListener("change", function () {
      syncTextFromNative(text, native);
    });

    btn.addEventListener("click", function () {
      if (text.disabled || text.readOnly) return;
      syncNativeFromText(text, native);
      if (typeof native.showPicker === "function") {
        try {
          native.showPicker();
        } catch (_) {
          native.click();
        }
      } else {
        native.click();
      }
    });

    function syncDisabled() {
      const d = text.disabled || text.readOnly;
      btn.disabled = !!d;
      btn.toggleAttribute("disabled", !!d);
    }
    syncDisabled();
    new MutationObserver(syncDisabled).observe(text, { attributes: true, attributeFilter: ["disabled", "readonly"] });
  }

  window.WD_normalizeDateDisplay = normalizeDateDisplay;

  window.WD_initDateInputs = function (root) {
    const el = root || document;
    el.querySelectorAll(".field__date").forEach(bindWrap);
  };

  /** Re-sync hidden date + button state after external value/disabled changes (e.g. Singpass lock) */
  window.WD_syncDatePickersFromFields = function (root) {
    const el = root || document;
    el.querySelectorAll(".field__date").forEach(function (wrap) {
      const text = wrap.querySelector(".field__date-text");
      const native = wrap.querySelector(".field__date-native");
      const btn = wrap.querySelector(".field__date-btn");
      if (!text || !native) return;
      const norm = normalizeDateDisplay(text.value);
      if (norm !== text.value && /^\d{2}-\d{2}-\d{4}$/.test(norm)) text.value = norm;
      syncNativeFromText(text, native);
      if (btn) {
        const d = text.disabled || text.readOnly;
        btn.disabled = !!d;
        btn.toggleAttribute("disabled", !!d);
      }
    });
  };
})();
