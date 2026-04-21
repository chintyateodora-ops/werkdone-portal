/**
 * Time text fields + native time picker (clock button).
 * Markup: .field__time > .field__time-text + .field__time-btn + .field__time-native
 */
(function () {
  "use strict";

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function parseTimeToHm(str) {
    const t = String(str || "").trim().toLowerCase();
    if (!t || t === "—") return null;

    const hm24 = t.match(/^(\d{1,2}):(\d{2})$/);
    if (hm24) {
      const h = parseInt(hm24[1], 10);
      const m = parseInt(hm24[2], 10);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return { h, m };
    }

    const hmAmPm = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/);
    if (hmAmPm) {
      let h = parseInt(hmAmPm[1], 10);
      const m = hmAmPm[2] != null ? parseInt(hmAmPm[2], 10) : 0;
      const ap = hmAmPm[3];
      if (!(h >= 1 && h <= 12 && m >= 0 && m <= 59)) return null;
      if (ap === "am") h = h === 12 ? 0 : h;
      else h = h === 12 ? 12 : h + 12;
      return { h, m };
    }

    const digits = t.replace(/\D/g, "");
    if (digits.length === 4) {
      const h = parseInt(digits.slice(0, 2), 10);
      const m = parseInt(digits.slice(2), 10);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) return { h, m };
    }

    return null;
  }

  function hmToNativeValue(h, m) {
    return pad2(h) + ":" + pad2(m);
  }

  function nativeValueToDisplay(nativeVal) {
    const m = String(nativeVal || "").match(/^(\d{2}):(\d{2})$/);
    if (!m) return "";
    const hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    if (!Number.isFinite(hh) || !Number.isFinite(mm)) return "";
    const ap = hh >= 12 ? "PM" : "AM";
    let h12 = hh % 12;
    if (h12 === 0) h12 = 12;
    return `${h12}:${pad2(mm)} ${ap}`;
  }

  function syncNativeFromText(text, native) {
    const parsed = parseTimeToHm(text.value);
    if (parsed) native.value = hmToNativeValue(parsed.h, parsed.m);
    else if (!String(text.value).trim()) native.value = "";
  }

  function syncTextFromNative(text, native) {
    if (!native.value) return;
    const disp = nativeValueToDisplay(native.value);
    text.value = disp || native.value;
  }

  function bindWrap(wrap) {
    if (wrap.getAttribute("data-time-bound") === "1") return;
    wrap.setAttribute("data-time-bound", "1");

    const text = wrap.querySelector(".field__time-text");
    const native = wrap.querySelector(".field__time-native");
    const btn = wrap.querySelector(".field__time-btn");
    if (!text || !native || !btn) return;

    syncNativeFromText(text, native);

    text.addEventListener("input", function () {
      syncNativeFromText(text, native);
    });

    text.addEventListener("blur", function () {
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

  window.WD_initTimeInputs = function (root) {
    const el = root || document;
    el.querySelectorAll(".field__time").forEach(bindWrap);
  };
})();

