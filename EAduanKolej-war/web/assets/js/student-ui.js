(function () {
  "use strict";
  var paths = {
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
    reports:
      '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M9 10h6M9 14h6M9 18h3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    tool: '<path d="m14 6 4 4 3-3a6 6 0 0 1-8 7l-7 7-3-3 7-7a6 6 0 0 1 7-8z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
    close: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6m0-6-6 6"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',
    logout: '<path d="M9 4H4v16h5M10 12h11m-4-4 4 4-4 4"/>',
    bolt: '<path d="m13 2-9 12h7l-1 8 10-12h-7z"/>',
    drop: '<path d="M12 2S4 11 4 15a8 8 0 0 0 16 0c0-4-8-13-8-13Z"/>',
    chair: '<path d="M6 12V4h12v8M4 12h16v5H4zM6 17v5m12-5v5"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    database:
      '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  };
  function icon(name) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (paths[name] || paths.reports) +
      "</svg>"
    );
  }
  function escape(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function date(value, time) {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
      ...(time ? { hour: "2-digit", minute: "2-digit" } : {}),
    }).format(new Date(value));
  }
  function slug(status) {
    return status.toLowerCase().replace(/ /g, "-");
  }
  function badge(status) {
    return (
      '<span class="status-badge status-' +
      slug(status) +
      '"><span class="status-dot"></span>' +
      escape(status) +
      "</span>"
    );
  }
  var toastTimer;
  function toast(message) {
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      el.hidden = true;
    }, 5000);
  }
  function hydrate() {
    document.querySelectorAll("[data-icon]").forEach(function (el) {
      el.innerHTML = icon(el.dataset.icon);
    });
  }
  window.StudentUI = {
    icon: icon,
    escape: escape,
    date: date,
    slug: slug,
    badge: badge,
    toast: toast,
    hydrate: hydrate,
    ticketCode: function (id) {
      return "ADK-" + id;
    },
  };
  var shell = document.getElementById("app-shell");
  if (shell)
    shell.innerHTML =
      '<aside class="sidebar"><a class="brand" href="my-tickets.html">' +
      '<span class="brand-mark">' +
      icon("home") +
      '</span><span>EAduan<span class="brand-accent">Kolej</span><small>HOSTEL MAINTENANCE</small></span></a><div class="sidebar-label">WORKSPACE</div><nav aria-label="Student navigation"><a class="nav-link active" aria-current="page" href="my-tickets.html">' +
      icon("reports") +
      '<span>My reports</span><span class="nav-count">' +
      ReportService.list().length +
      '</span></a></nav><div class="sidebar-bottom"><a class="logout-link" href="logout.html">' +
      icon("logout") +
      "<span>Logout</span></a></div></aside>";
  var dialogs = document.getElementById("shared-dialogs");
  if (dialogs)
    dialogs.innerHTML =
      '<dialog id="module-dialog" aria-labelledby="module-title"><form method="dialog" class="dialog-body"><span class="dialog-symbol">' +
      icon("reports") +
      '</span><h2 id="module-title">Not my part</h2><p>Orang lain sambung</p><div class="dialog-actions"><button class="button button-primary" value="close">Got it</button></div></form></dialog>';
  hydrate();
})();
