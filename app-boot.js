(function () {
  var RGPD = "rgpd-consent";
  var LANDING_VU = "landing-seen";
  var GENRE = "maths-cp-genre";
  var NIVEAU = "maths-cp-niveau";
  var NOM = "renard-nom";

  function ecranActifVisible() {
    var actifs = document.querySelectorAll(".ecran.actif");
    for (var i = 0; i < actifs.length; i++) {
      var el = actifs[i];
      if (el.hidden) continue;
      try {
        var st = getComputedStyle(el);
        if (st.display !== "none" && st.visibility !== "hidden") return true;
      } catch (e) {
        return true;
      }
    }
    return false;
  }

  function revelerEcranParId(id) {
    var el = document.getElementById(id);
    if (!el) return false;
    var nodes = document.querySelectorAll(".ecran");
    for (var i = 0; i < nodes.length; i++) {
      nodes[i].hidden = true;
      nodes[i].classList.remove("actif");
    }
    el.removeAttribute("hidden");
    el.hidden = false;
    el.classList.add("actif");
    return true;
  }

  function dernierRecoursAffichage() {
    try {
      if (!localStorage.getItem(LANDING_VU)) {
        if (revelerEcranParId("ecran-landing")) return;
      }
      if (!localStorage.getItem(GENRE)) {
        if (revelerEcranParId("ecran-genre")) return;
      }
      if (!localStorage.getItem(NIVEAU)) {
        if (revelerEcranParId("ecran-classe")) return;
      }
      if (!(localStorage.getItem(NOM) || "").trim()) {
        if (revelerEcranParId("ecran-nommage")) return;
      }
      if (revelerEcranParId("ecran-menu")) return;
    } catch (e) {}
    revelerEcranParId("ecran-landing");
  }

  function armRgpd() {
    var b = document.getElementById("banner-rgpd");
    if (!b) return;
    window.__AMS_RGPD_BOOT = "1";
    if (localStorage.getItem(RGPD)) {
      b.hidden = true;
      return;
    }
    b.hidden = false;
    function majGtag(accepte) {
      if (typeof window.gtag !== "function") return;
      try {
        window.gtag("consent", "update", {
          analytics_storage: accepte ? "granted" : "denied",
          ad_storage: "denied",
        });
      } catch (e) {}
    }
    var acc = document.getElementById("btn-rgpd-accepter");
    var ref = document.getElementById("btn-rgpd-refuser");
    if (acc && acc.dataset.amBoot !== "1") {
      acc.dataset.amBoot = "1";
      acc.addEventListener("click", function () {
        try {
          localStorage.setItem(RGPD, "accepte");
        } catch (e2) {}
        majGtag(true);
        if (typeof window.__AMS_apresAcceptRgpd === "function") {
          try {
            window.__AMS_apresAcceptRgpd();
          } catch (eA) {}
        }
        b.hidden = true;
      });
    }
    if (ref && ref.dataset.amBoot !== "1") {
      ref.dataset.amBoot = "1";
      ref.addEventListener("click", function () {
        try {
          localStorage.setItem(RGPD, "refuse");
        } catch (e3) {}
        majGtag(false);
        b.hidden = true;
      });
    }
  }

  function reparerVue() {
    armRgpd();
    if (ecranActifVisible()) return;
    if (typeof window.__appGarantirVue === "function") {
      try {
        window.__appGarantirVue();
      } catch (e4) {}
    }
    if (ecranActifVisible()) return;
    dernierRecoursAffichage();
  }

  armRgpd();
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reparerVue);
  else reparerVue();
  setTimeout(reparerVue, 120);
  setTimeout(reparerVue, 800);
  setTimeout(reparerVue, 2600);
})();
