(function () {
  "use strict";
  var ui = StudentUI,
    id = new URLSearchParams(location.search).get("id"),
    root = document.getElementById("detail-content");
  function field(label, value) {
    return "<div><dt>" + label + "</dt><dd>" + ui.escape(value) + "</dd></div>";
  }
  function render() {
    var ticket = ReportService.get(id);
    if (!ticket) {
      document.title = "Report not found · EAduanKolej";
      root.innerHTML =
        '<section class="empty-state not-found"><span class="empty-icon">' +
        ui.icon("reports") +
        '</span><h1>Report not found</h1><p>This report is unavailable or does not belong to the demo student.</p><a class="button button-primary" href="my-tickets.html">Back to my reports</a></section>';
      return;
    }
    document.title = ui.ticketCode(ticket.id) + " · EAduanKolej";
    var resolved = ticket.status === "Resolved",
      cancelled = ticket.status === "Cancelled";
    var info = resolved
      ? "Repair completed. We’d love to hear how it went."
      : cancelled
        ? "This report is closed. No further repair work is scheduled."
        : ticket.status === "Pending"
          ? "Your report is with the maintenance team. We’ll keep you posted."
          : "Your repair is underway. Follow the latest updates below.";
    var timeline = ticket.logs
      .map(function (log, index) {
        var actor = EAduanDemo.users.filter(function (u) {
          return u.id === log.changedBy;
        })[0];
        return (
          '<li class="timeline-item ' +
          (index === ticket.logs.length - 1 ? "latest" : "") +
          '"><span class="timeline-marker">' +
          ui.icon(
            log.status === "Resolved"
              ? "check"
              : log.status === "Cancelled"
                ? "close"
                : log.status === "In Progress"
                  ? "tool"
                  : "reports",
          ) +
          '</span><div><div class="timeline-heading"><h3>' +
          ui.escape(
            log.status === "Pending"
              ? "Report submitted"
              : log.status === "Cancelled"
                ? "Report cancelled"
                : log.status === "Resolved"
                  ? "Repair resolved"
                  : "Repair in progress",
          ) +
          '</h3><time datetime="' +
          ui.escape(log.changedAt) +
          '">' +
          ui.date(log.changedAt, true) +
          "</time></div><p>" +
          ui.escape(log.note) +
          '</p><span class="timeline-actor">' +
          ui.escape(actor ? actor.name : "Maintenance team") +
          "</span></div></li>"
        );
      })
      .join("");
    var feedback;
    if (ticket.feedback)
      feedback =
        '<div class="feedback-saved"><span class="saved-label">' +
        ui.icon("check") +
        ' Feedback received</span><div class="saved-stars" aria-label="' +
        ticket.feedback.rating +
        ' out of 5 stars">' +
        "★".repeat(ticket.feedback.rating) +
        "<span>" +
        "☆".repeat(5 - ticket.feedback.rating) +
        "</span></div><p>" +
        ui.escape(ticket.feedback.comment || "Thank you for rating this repair.") +
        '</p><span class="cell-secondary">Submitted ' +
        ui.date(ticket.feedback.createdAt) +
        "</span></div>";
    else if (resolved)
      feedback =
        '<form id="rating-form" novalidate><p>How was your repair experience?</p><fieldset class="rating-field"><legend class="sr-only">Repair rating (required)</legend>' +
        [1, 2, 3, 4, 5]
          .map(function (rating) {
            return (
              '<label class="star-option"><input type="radio" name="rating" value="' +
              rating +
              '" required aria-label="' +
              rating +
              (rating === 1 ? " star" : " stars") +
              '"><span aria-hidden="true">★</span></label>'
            );
          })
          .join("") +
        '</fieldset><p class="rating-caption" id="rating-caption">Select a rating</p><label for="feedback-comment">Anything else? <span class="optional">(optional)</span></label><textarea id="feedback-comment" rows="3" maxlength="500" placeholder="Tell us what went well, or what could be better."></textarea><span class="character-count" id="character-count">0 / 500</span><p id="rating-error" class="form-error" role="alert" hidden></p><button type="submit" class="button button-primary full-width">Submit feedback</button></form>';
    else
      feedback =
        '<div class="feedback-locked">' +
        ui.icon("info") +
        "<p>" +
        (cancelled
          ? "Feedback is not available for cancelled reports."
          : "You can rate the repair once this report is resolved.") +
        "</p></div>";
    root.innerHTML =
      '<section class="detail-heading"><div><div class="detail-kicker"><span class="eyebrow">' +
      ui.ticketCode(ticket.id) +
      "</span>" +
      ui.badge(ticket.status) +
      "</div><h1>" +
      ui.escape(ticket.title) +
      "</h1><p>" +
      info +
      "</p></div>" +
      (ticket.status === "Pending"
        ? '<button class="button button-secondary cancel-trigger" type="button" id="cancel-report">Cancel report</button>'
        : "") +
      '</section><div class="detail-grid"><div class="detail-primary"><section class="panel"><div class="panel-heading"><span>' +
      ui.icon("reports") +
      '</span><h2>Report information</h2></div><dl class="information-grid">' +
      field("Location", ticket.block.name + " · " + ticket.room.number) +
      field("Category", ticket.category.name) +
      field("Date submitted", ui.date(ticket.createdAt, true)) +
      '<div><dt>Priority</dt><dd><span class="priority priority-' +
      ticket.priority.toLowerCase() +
      '"><span></span>' +
      ticket.priority +
      "</span></dd></div>" +
      '</dl><div class="description"><h3>Description</h3><p>' +
      ui.escape(ticket.description) +
      '</p></div><div class="attachment"><h3>Attachment</h3>' +
      (ticket.photoPath === "assets/images/demo-sink.svg"
        ? '<a class="attachment-preview" href="assets/images/demo-sink.svg" target="_blank" rel="noopener"><img src="assets/images/demo-sink.svg" alt="Illustrative demo attachment of a leaking pipe beneath a sink"><span>Bathroom sink · Sample illustration ↗</span></a>'
        : '<p class="cell-secondary">No photo attached.</p>') +
      '</div></section><section class="panel"><div class="panel-heading"><span>' +
      ui.icon("clock") +
      '</span><h2>Status timeline</h2></div><ol class="timeline">' +
      timeline +
      "</ol>" +
      (!resolved && !cancelled
        ? '<div class="timeline-next">' +
          ui.icon("clock") +
          "<span>" +
          (ticket.status === "Pending"
            ? "Next: a technician starts the repair."
            : "Next: the technician completes the repair.") +
          "</span></div>"
        : "") +
      '</section></div><aside class="detail-secondary"><section class="panel assignment-panel"><span class="section-tag">IN GOOD HANDS</span><h2>Your maintenance team</h2><div class="department"><span class="category-icon">' +
      ui.icon("tool") +
      "</span><div><strong>" +
      ui.escape(ticket.department.name) +
      '</strong><span>Assigned department</span></div></div><div class="technician"><span class="avatar small">' +
      (ticket.technician
        ? ui.escape(
            ticket.technician.name
              .split(" ")
              .map(function (n) {
                return n.charAt(0);
              })
              .join(""),
          )
        : "—") +
      "</span><div><strong>" +
      ui.escape(ticket.technician ? ticket.technician.name : "Not assigned") +
      "</strong><span>" +
      (ticket.technician
        ? "Technician"
        : cancelled
          ? "Report cancelled before assignment"
          : "A technician will be assigned") +
      '</span></div></div><p class="routing-note">Priority and department follow the report category.</p></section><section class="panel feedback-panel"><div class="panel-heading"><span>' +
      ui.icon("check") +
      "</span><h2>Your feedback</h2></div>" +
      feedback +
      "</section></aside></div>";
    var trigger = document.getElementById("cancel-report");
    if (trigger)
      trigger.addEventListener("click", function () {
        document.getElementById("cancel-error").hidden = true;
        document.getElementById("cancel-reason").value = "";
        document.getElementById("cancel-dialog").showModal();
      });
    var form = document.getElementById("rating-form");
    if (form) {
      form.addEventListener("change", function () {
        var selected = form.querySelector("input:checked");
        if (!selected) return;
        var value = Number(selected.value);
        form.querySelectorAll(".star-option").forEach(function (label, i) {
          label.classList.toggle("filled", i < value);
        });
        document.getElementById("rating-caption").textContent = [
          "",
          "Poor",
          "Fair",
          "Good",
          "Very good",
          "Excellent",
        ][value];
      });
      document.getElementById("feedback-comment").addEventListener("input", function (event) {
        document.getElementById("character-count").textContent =
          event.target.value.length + " / 500";
      });
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var selected = form.querySelector("input:checked");
        try {
          ReportService.rate(
            id,
            selected ? selected.value : 0,
            document.getElementById("feedback-comment").value,
          );
          render();
          ui.toast("Thank you! Your demo feedback has been saved.");
          document.querySelector(".feedback-panel").setAttribute("tabindex", "-1");
          document.querySelector(".feedback-panel").focus();
        } catch (error) {
          var el = document.getElementById("rating-error");
          el.textContent = error.message;
          el.hidden = false;
          if (!selected) form.querySelector("input").focus();
        }
      });
    }
  }
  document.getElementById("confirm-cancel").addEventListener("click", function () {
    try {
      ReportService.cancel(id, document.getElementById("cancel-reason").value);
      document.getElementById("cancel-dialog").close();
      render();
      ui.toast("Report cancelled. Your demo timeline has been updated.");
      root.querySelector("h1").setAttribute("tabindex", "-1");
      root.querySelector("h1").focus();
    } catch (error) {
      var el = document.getElementById("cancel-error");
      el.textContent = error.message;
      el.hidden = false;
    }
  });
  window.addEventListener("storage", render);
  render();
})();
