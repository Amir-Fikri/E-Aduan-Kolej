(function () {
  "use strict";
  var ui = StudentUI,
    service = TechnicianService,
    me = service.me(),
    status = "All",
    selectedId = null,
    statuses = ["All", "Pending", "In Progress", "Resolved", "Cancelled"];
  var icons = ["reports", "clock", "tool", "check", "close"];
  var actionLabel = { Pending: "Start work", "In Progress": "Mark resolved" };
  var search = document.getElementById("search"),
    priority = document.getElementById("priority"),
    sort = document.getElementById("sort"),
    dialog = document.getElementById("ticket-dialog");

  function categoryIcon(ticket) {
    return ticket.departmentId === 1 ? "bolt" : ticket.departmentId === 2 ? "drop" : "chair";
  }
  function initials(name) {
    return String(name || "")
      .split(" ")
      .map(function (part) {
        return part.charAt(0);
      })
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  document.getElementById("tech-initials").textContent = initials(me.name);
  document.getElementById("tech-name").textContent = me.name;
  document.getElementById("tech-role").textContent = "Technician · " + me.department.name;
  document.getElementById("department-note").textContent =
    "Every report routed to the " + me.department.name + " department.";

  function priorityTag(value) {
    return (
      '<span class="priority priority-' +
      value.toLowerCase() +
      '"><span></span>' +
      ui.escape(value) +
      "</span>"
    );
  }

  function hint(t) {
    if (!t.technician)
      return t.status === "Pending" ? '<span class="assign-hint">Unassigned</span>' : "";
    if (t.technicianId === me.id) return '<span class="assign-hint mine">Assigned to you</span>';
    return '<span class="assign-hint">' + ui.escape(t.technician.name) + "</span>";
  }

  function isOpen(t) {
    return t.status === "Pending" || t.status === "In Progress";
  }

  function nextAction(t) {
    return service.canAdvance(t) ? actionLabel[t.status] : null;
  }

  function action(t) {
    if (nextAction(t))
      return (
        '<button type="button" class="button button-primary button-small" data-open="' +
        t.id +
        '">' +
        nextAction(t) +
        "</button>"
      );
    if (t.status === "Pending" && !t.technician)
      return '<span class="action-note" title="The admin assigns a technician">Part Orang Lain, Boleh Sambung</span>';
    if (isOpen(t) && t.technician)
      return (
        '<span class="action-note" title="Assigned to ' +
        ui.escape(t.technician ? t.technician.name : "another technician") +
        '">Assigned to ' +
        ui.escape(t.technician ? t.technician.name.split(" ")[0] : "another technician") +
        "</span>"
      );
    return (
      '<button type="button" class="button button-secondary button-small" data-open="' +
      t.id +
      '">View</button>'
    );
  }

  function greeting() {
    var hour = Number(
      new Intl.DateTimeFormat("en-GB", {
        hour: "numeric",
        hour12: false,
        timeZone: "Asia/Kuala_Lumpur",
      }).format(new Date()),
    );
    return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  }

  function nextInQueue(tickets) {
    var levels = { High: 0, Medium: 1, Low: 2 };
    return (
      tickets
        .filter(function (t) {
          return t.status === "Pending" && t.technicianId === me.id;
        })
        .sort(function (a, b) {
          return (
            levels[a.priority] - levels[b.priority] || new Date(a.createdAt) - new Date(b.createdAt)
          );
        })[0] || null
    );
  }

  function myJobs(tickets) {
    return tickets.filter(function (t) {
      return t.status === "In Progress" && t.technicianId === me.id;
    });
  }

  function renderHero(tickets) {
    var next = nextInQueue(tickets);
    var today = new Date(),
      dateEl = document.getElementById("hero-date");
    dateEl.textContent = new Intl.DateTimeFormat("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kuala_Lumpur",
    })
      .format(today)
      .replace(/,/g, "");
    dateEl.setAttribute("datetime", today.toISOString().slice(0, 10));
    document.getElementById("hero-eyebrow").textContent =
      me.department.name.toUpperCase() + " DEPARTMENT";
    document.getElementById("hero-title").textContent =
      greeting() + ", " + me.name.split(" ")[0] + ".";
    document.getElementById("next-card").innerHTML = next
      ? '<div class="next-label"><span>NEXT IN QUEUE</span>' +
        priorityTag(next.priority) +
        "</div><h2>" +
        ui.escape(next.title) +
        '</h2><ul class="next-meta"><li><span>' +
        ui.ticketCode(next.id) +
        "</span><span>" +
        ui.date(next.createdAt) +
        "</span></li><li><span>" +
        ui.escape(next.block.name) +
        "</span><span>" +
        ui.escape(next.room.number) +
        '</span></li></ul><button type="button" class="button button-brand full-width" data-open="' +
        next.id +
        '">' +
        ui.icon("tool") +
        nextAction(next) +
        "</button>"
      : '<div class="next-empty">' +
        ui.icon("check") +
        "<span>No assigned tickets waiting to start. Nice work!</span></div>";
  }

  function renderJobs(tickets) {
    var jobs = myJobs(tickets);
    document.getElementById("jobs-badge").textContent = jobs.length;
    document.getElementById("job-grid").innerHTML = jobs.length
      ? jobs
          .map(function (t) {
            var started = t.logs.filter(function (log) {
              return log.status === "In Progress";
            });
            started = started[started.length - 1];
            return (
              '<article class="job-card"><div class="job-top"><span class="job-code">' +
              ui.ticketCode(t.id) +
              "</span>" +
              ui.badge(t.status) +
              "</div><h3>" +
              ui.escape(t.title) +
              '</h3><span class="cell-secondary">' +
              ui.escape(t.block.name + " · " + t.room.number) +
              " · " +
              ui.escape(t.student ? t.student.name : "") +
              " · " +
              priorityTag(t.priority) +
              "</span>" +
              (started
                ? '<p class="job-note">' +
                  ui.escape(started.note) +
                  '<span class="cell-secondary">Started ' +
                  ui.date(started.changedAt, true) +
                  "</span></p>"
                : "") +
              '<div class="job-actions"><button type="button" class="button button-primary button-small" data-open="' +
              t.id +
              '">Mark resolved</button></div></article>'

            );
          })
          .join("")
      : '<p class="job-empty">No active jobs right now. Press Start work on an assigned ticket to begin.</p>';
  }

  function render() {
    var tickets = service.list(),
      counts = { All: tickets.length };
    statuses.slice(1).forEach(function (value) {
      counts[value] = tickets.filter(function (t) {
        return t.status === value;
      }).length;
    });
    document.getElementById("total-badge").textContent = tickets.length;
    var navCount = document.querySelector(".nav-count");
    if (navCount) navCount.textContent = counts.Pending + counts["In Progress"];

    document.getElementById("ticket-stats").innerHTML = statuses
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
          (value === "All" ? "Total tickets" : value) +
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
          (value === "All" ? "All tickets" : value) +
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
        (priority.value === "All" || t.priority === priority.value) &&
        [
          ui.ticketCode(t.id),
          t.title,
          t.description,
          t.category.name,
          t.block.name,
          t.room.number,
          t.student ? t.student.name : "",
        ]
          .join(" ")
          .toLowerCase()
          .indexOf(query) !== -1
      );
    });
    rows.sort(function (a, b) {
      var newest = new Date(b.createdAt) - new Date(a.createdAt);
      if (sort.value === "priority") {
        var levels = { High: 0, Medium: 1, Low: 2 };
        return levels[a.priority] - levels[b.priority] || newest;
      }
      return sort.value === "newest" ? newest : -newest;
    });

    document.getElementById("ticket-rows").innerHTML = rows
      .map(function (t) {
        return (
          '<tr><td><div class="report-cell"><span class="category-icon">' +
          ui.icon(categoryIcon(t)) +
          '</span><div><button type="button" class="report-title link-button" data-open="' +
          t.id +
          '">' +
          ui.escape(t.title) +
          '</button><span class="report-meta">' +
          ui.ticketCode(t.id) +
          "<span>·</span>" +
          ui.escape(t.category.name) +
          '</span></div></div></td><td><strong class="room">' +
          ui.escape(t.room.number) +
          '</strong><span class="cell-secondary">' +
          ui.escape(t.block.name) +
          '</span></td><td class="date-cell">' +
          ui.date(t.createdAt) +
          '<span class="cell-secondary">' +
          ui.escape(t.student ? t.student.name : "") +
          "</span></td><td>" +
          priorityTag(t.priority) +
          "</td><td>" +
          ui.badge(t.status) +
          hint(t) +
          '</td><td class="action-cell">' +
          action(t) +
          "</td></tr>"
        );
      })
      .join("");

    document.querySelector(".table-wrap").hidden = rows.length === 0;
    document.getElementById("empty-state").hidden = rows.length !== 0;
    document.getElementById("results-summary").textContent =
      rows.length +
      " " +
      (rows.length === 1 ? "ticket" : "tickets") +
      (status !== "All" ? " · " + status : "") +
      (priority.value !== "All" ? " · " + priority.value + " priority" : "") +
      (query ? " matching “" + search.value.trim() + "”" : "");
    document.getElementById("list-count").textContent =
      "Showing " + rows.length + " of " + tickets.length + " tickets";

    renderHero(tickets);
    renderJobs(tickets);
    renderActivity(tickets);

    document.querySelectorAll("[data-status]").forEach(function (button) {
      button.addEventListener("click", function () {
        status = button.dataset.status;
        render();
        document.querySelector('#status-tabs [data-status="' + status + '"]').focus();
      });
    });
    document.querySelectorAll("[data-open]").forEach(function (button) {
      button.addEventListener("click", function () {
        openDialog(Number(button.dataset.open));
      });
    });
  }

  function renderActivity(tickets) {
    var logs = [];
    tickets.forEach(function (t) {
      t.logs.forEach(function (log) {
        logs.push({ log: log, ticket: t });
      });
    });
    logs.sort(function (a, b) {
      return new Date(b.log.changedAt) - new Date(a.log.changedAt);
    });
    var headings = {
      Pending: "Report submitted",
      "In Progress": "Repair in progress",
      Resolved: "Repair resolved",
      Cancelled: "Report cancelled",
    };
    var markers = { Pending: "reports", "In Progress": "tool", Resolved: "check", Cancelled: "close" };
    document.getElementById("activity").innerHTML = logs
      .slice(0, 6)
      .map(function (row, index) {
        var actor = EAduanDemo.users.filter(function (u) {
          return u.id === row.log.changedBy;
        })[0];
        return (
          '<li class="timeline-item ' +
          (index === 0 ? "latest" : "") +
          '"><span class="timeline-marker">' +
          ui.icon(markers[row.log.status]) +
          '</span><div><div class="timeline-heading"><h3>' +
          ui.ticketCode(row.ticket.id) +
          " · " +
          headings[row.log.status] +
          '</h3><time datetime="' +
          ui.escape(row.log.changedAt) +
          '">' +
          ui.date(row.log.changedAt, true) +
          "</time></div><p>" +
          ui.escape(row.log.note) +
          '</p><span class="timeline-actor">' +
          ui.escape(actor ? actor.name : "Maintenance team") +
          (actor && actor.id === me.userId ? " (you)" : "") +
          "</span></div></li>"
        );
      })
      .join("");
  }

  function field(label, value) {
    return "<div><dt>" + label + "</dt><dd>" + value + "</dd></div>";
  }

  function openDialog(id) {
    var t = service.get(id);
    if (!t) return;
    selectedId = id;
    var editable = service.canAdvance(t),
      next = service.nextStatus(t.status);
    document.getElementById("dialog-kicker").innerHTML =
      '<span class="eyebrow">' + ui.ticketCode(t.id) + "</span>" + ui.badge(t.status);
    document.getElementById("dialog-title").textContent = t.title;
    document.getElementById("dialog-info").innerHTML =
      field("Location", ui.escape(t.block.name + " · " + t.room.number)) +
      field("Category", ui.escape(t.category.name)) +
      field("Reported by", ui.escape(t.student ? t.student.name : "—")) +
      field("Reported on", ui.date(t.createdAt, true)) +
      field("Priority", priorityTag(t.priority)) +
      field("Technician", ui.escape(t.technician ? t.technician.name : "Not assigned"));
    document.getElementById("dialog-description").textContent = t.description;

    var closed = document.getElementById("dialog-closed");
    closed.hidden = editable;
    if (!editable)
      closed.textContent =
        t.status === "Resolved"
          ? "Resolved on " + ui.date(t.resolvedAt, true) + "."
          : t.status === "Cancelled"
            ? "The student cancelled this report. No work is needed."
            : t.technician
              ? "This ticket is assigned to " + t.technician.name + "."
              : "Waiting for the admin to assign a technician.";

    document.getElementById("update-fields").hidden = !editable;
    var confirm = document.getElementById("confirm-update");
    confirm.hidden = !editable;
    if (editable) {
      document.getElementById("status-change").innerHTML =
        ui.badge(t.status) + '<span aria-hidden="true">→</span>' + ui.badge(next);
      confirm.textContent = actionLabel[t.status];
    }
    document.getElementById("update-error").hidden = true;
    dialog.showModal();
  }

  document.getElementById("confirm-update").addEventListener("click", function () {
    try {
      var ticket = service.advance(selectedId);
      dialog.close();
      render();
      ui.toast(
        ui.ticketCode(ticket.id) +
          (ticket.status === "Resolved"
            ? " marked as resolved. The student can now rate the repair."
            : " is now In Progress."),
      );
      document.getElementById("tickets-heading").focus();
    } catch (error) {
      var el = document.getElementById("update-error");
      el.textContent = error.message;
      el.hidden = false;
    }
  });
  search.addEventListener("input", render);
  priority.addEventListener("change", render);
  sort.addEventListener("change", render);
  document.getElementById("clear-filters").addEventListener("click", function () {
    status = "All";
    priority.value = "All";
    search.value = "";
    render();
    search.focus();
  });
  window.addEventListener("storage", render);
  render();
  if (!ReportService.isPersistent())
    ui.toast("Browser storage is unavailable. Demo changes will last only for this page session.");
})();
