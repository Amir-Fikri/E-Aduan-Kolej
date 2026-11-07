(function () {
  "use strict";
  var seed = window.EAduanDemo,
    key = "eaduan-student-demo-v1",
    memory,
    storageAvailable = true;
  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }
  function fresh() {
    return {
      version: seed.version,
      tickets: clone(seed.tickets),
      ticketStatusLogs: clone(seed.ticketStatusLogs),
      feedback: clone(seed.feedback),
    };
  }
  function load() {
    try {
      var saved = JSON.parse(localStorage.getItem(key));
      if (
        saved &&
        saved.version === seed.version &&
        Array.isArray(saved.tickets) &&
        Array.isArray(saved.ticketStatusLogs) &&
        Array.isArray(saved.feedback)
      )
        return saved;
    } catch (error) {
      storageAvailable = false;
    }
    return fresh();
  }
  memory = load();
  function state() {
    if (storageAvailable) memory = load();
    return memory;
  }
  function save(data) {
    memory = data;
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      storageAvailable = false;
    }
  }
  function find(rows, id) {
    return (
      rows.filter(function (row) {
        return row.id === id;
      })[0] || null
    );
  }
  function owned(data, id) {
    var ticket = find(data.tickets, Number(id));
    return ticket && ticket.studentId === seed.currentStudentId ? ticket : null;
  }
  function join(ticket, data) {
    var result = clone(ticket),
      room = find(seed.rooms, ticket.roomId),
      tech = find(seed.technicians, ticket.technicianId);
    result.room = room;
    result.block = find(seed.blocks, room.blockId);
    result.category = find(seed.categories, ticket.categoryId);
    result.department = find(seed.departments, ticket.departmentId);
    result.technician = tech ? find(seed.users, tech.userId) : null;
    result.student = find(seed.users, ticket.studentId);
    result.logs = clone(
      data.ticketStatusLogs.filter(function (log) {
        return log.ticketId === ticket.id;
      }),
    ).sort(function (a, b) {
      return new Date(a.changedAt) - new Date(b.changedAt);
    });
    result.feedback = clone(
      data.feedback.filter(function (row) {
        return row.ticketId === ticket.id;
      })[0] || null,
    );
    return result;
  }
  window.ReportService = {
    list: function () {
      var data = state();
      return data.tickets
        .filter(function (ticket) {
          return ticket.studentId === seed.currentStudentId;
        })
        .map(function (ticket) {
          return join(ticket, data);
        });
    },
    get: function (id) {
      var data = state(),
        ticket = owned(data, id);
      return ticket ? join(ticket, data) : null;
    },
    cancel: function (id, reason) {
      var data = state(),
        ticket = owned(data, id);
      if (!ticket || ticket.status !== "Pending")
        throw new Error(
          "Only your Pending reports can be cancelled. Refresh to see the latest status.",
        );
      reason = String(reason || "").trim();
      if (reason.length > 300) throw new Error("Please keep the reason within 300 characters.");
      ticket.status = "Cancelled";
      ticket.cancelledAt = new Date().toISOString();
      data.ticketStatusLogs.push({
        id: Date.now(),
        ticketId: ticket.id,
        status: "Cancelled",
        changedBy: seed.currentStudentId,
        changedAt: ticket.cancelledAt,
        note: reason || "Report cancelled by the student.",
      });
      save(data);
      return join(ticket, data);
    },
    rate: function (id, rating, comment) {
      var data = state(),
        ticket = owned(data, id);
      if (!ticket || ticket.status !== "Resolved")
        throw new Error("Feedback is available only for your Resolved reports.");
      if (
        data.feedback.some(function (row) {
          return row.ticketId === ticket.id;
        })
      )
        throw new Error("You have already rated this repair.");
      rating = Number(rating);
      comment = String(comment || "").trim();
      if (!Number.isInteger(rating) || rating < 1 || rating > 5)
        throw new Error("Choose a rating from 1 to 5 stars.");
      if (comment.length > 500) throw new Error("Please keep your feedback within 500 characters.");
      data.feedback.push({
        id: Date.now(),
        ticketId: ticket.id,
        rating: rating,
        comment: comment,
        createdAt: new Date().toISOString(),
      });
      save(data);
      return join(ticket, data);
    },
    reset: function () {
      save(fresh());
    },
    snapshot: function () {
      return clone(state());
    },
    isPersistent: function () {
      return storageAvailable;
    },
  };

  window.EAduanStore = { seed: seed, state: state, save: save, join: join, find: find };
})();
