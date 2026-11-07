(function () {
  "use strict";
  var ui = StudentUI,
    status = "All",
    statuses = ["All", "Pending", "In Progress", "Resolved", "Cancelled"];
  var icons = ["reports", "clock", "tool", "check", "close"];
  var search = document.getElementById("search"),
    sort = document.getElementById("sort");
  function render() {
    var tickets = ReportService.list(),
      counts = { All: tickets.length };
    statuses.slice(1).forEach(function (value) {
      counts[value] = tickets.filter(function (t) {
        return t.status === value;
      }).length;
    });
    document.getElementById("total-badge").textContent = tickets.length;
    document.getElementById("report-stats").innerHTML = statuses
      .map(function (value, i) {
        return (
          '<button type="button" class="stat-card ' +
          (status === value ? "selected" : "") +
          '" data-status="' +
          value +
          '" aria-pressed="' +
          (status === value) +
          '"><span class="stat-icon ' +
          ui.slug(value) +
          '">' +
          ui.icon(icons[i]) +
          '</span><span><span class="stat-label">' +
          (value === "All" ? "Total reports" : value) +
          '</span><strong class="stat-number">' +
          String(counts[value]).padStart(2, "0") +
          "</strong></span></button>"
        );
      })
      .join("");
    document.getElementById("status-tabs").innerHTML = statuses
      .map(function (value) {
        return (
          '<button type="button" class="filter-tab ' +
          (status === value ? "active" : "") +
          '" data-status="' +
          value +
          '" aria-pressed="' +
          (status === value) +
          '">' +
          (value === "All" ? "All reports" : value) +
          "<span>" +
          counts[value] +
          "</span></button>"
        );
      })
      .join("");
    var query = search.value.trim().toLowerCase();
    var rows = tickets.filter(function (t) {
      return (
        (status === "All" || t.status === status) &&
        [ui.ticketCode(t.id), t.title, t.description, t.category.name, t.block.name, t.room.number]
          .join(" ")
          .toLowerCase()
          .indexOf(query) !== -1
      );
    });
    rows.sort(function (a, b) {
      if (sort.value === "priority") {
        var levels = { High: 0, Medium: 1, Low: 2 };
        return (
          levels[a.priority] - levels[b.priority] || new Date(b.createdAt) - new Date(a.createdAt)
        );
      }
      return sort.value === "oldest"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    });
    document.getElementById("report-rows").innerHTML = rows
      .map(function (t) {
        var categoryIcon = t.categoryId === 1 ? "bolt" : t.categoryId === 2 ? "drop" : "chair";
        return (
          '<tr><td><div class="report-cell"><span class="category-icon">' +
          ui.icon(categoryIcon) +
          '</span><div><a class="report-title" href="ticket-detail.html?id=' +
          t.id +
          '">' +
          ui.escape(t.title) +
          '</a><span class="report-meta">' +
          ui.ticketCode(t.id) +
          "<span>·</span>" +
          ui.escape(t.category.name) +
          '</span></div></div></td><td><strong class="room">' +
          ui.escape(t.room.number) +
          '</strong><span class="cell-secondary">' +
          ui.escape(t.block.name) +
          '</span></td><td class="date-cell">' +
          ui.date(t.createdAt) +
          '</td><td><span class="priority priority-' +
          t.priority.toLowerCase() +
          '"><span></span>' +
          t.priority +
          "</span></td><td>" +
          ui.badge(t.status) +
          (t.status === "Resolved" && !t.feedback
            ? '<span class="feedback-hint">Ready for your feedback</span>'
            : "") +
          '</td><td><a class="view-link" href="ticket-detail.html?id=' +
          t.id +
          '" aria-label="View report ' +
          ui.ticketCode(t.id) +
          '">' +
          ui.icon("arrow") +
          "</a></td></tr>"
        );
      })
      .join("");
    document.querySelector(".table-wrap").hidden = rows.length === 0;
    document.getElementById("empty-state").hidden = rows.length !== 0;
    document.getElementById("results-summary").textContent =
      rows.length +
      " " +
      (rows.length === 1 ? "report" : "reports") +
      (status !== "All" ? " · " + status : "") +
      (query ? " matching “" + search.value.trim() + "”" : "");
    document.getElementById("list-count").textContent =
      "Showing " + rows.length + " of " + tickets.length + " reports";
    document.querySelectorAll("[data-status]").forEach(function (button) {
      button.addEventListener("click", function () {
        status = button.dataset.status;
        render();
        var matching = document.querySelector('#status-tabs [data-status="' + status + '"]');
        matching.focus();
      });
    });
  }
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  document.getElementById("clear-filters").addEventListener("click", function () {
    status = "All";
    search.value = "";
    render();
    search.focus();
  });
  document.getElementById("new-report").addEventListener("click", function () {
    document.getElementById("module-dialog").showModal();
  });
  window.addEventListener("storage", render);
  render();
  if (!ReportService.isPersistent())
    ui.toast("Browser storage is unavailable. Demo changes will last only for this page session.");
})();
