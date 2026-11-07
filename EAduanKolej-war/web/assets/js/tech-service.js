(function () {
  "use strict";
  var store = window.EAduanStore,
    seed = store.seed,
    state = store.state,
    save = store.save,
    join = store.join,
    find = store.find;
  var flow = { Pending: "In Progress", "In Progress": "Resolved" };
  function currentTech() {
    var tech = find(seed.technicians, seed.currentTechnicianId);
    return {
      id: tech.id,
      userId: tech.userId,
      name: find(seed.users, tech.userId).name,
      department: find(seed.departments, tech.departmentId),
    };
  }
  function inDepartment(data, id) {
    var ticket = find(data.tickets, Number(id));
    return ticket && ticket.departmentId === currentTech().department.id ? ticket : null;
  }
  window.TechnicianService = {
    me: currentTech,
    nextStatus: function (status) {
      return flow[status] || null;
    },
    canAdvance: function (ticket) {
      return !!flow[ticket.status] && ticket.technicianId === currentTech().id;
    },
    list: function () {
      var data = state(),
        departmentId = currentTech().department.id;
      return data.tickets
        .filter(function (ticket) {
          return ticket.departmentId === departmentId;
        })
        .map(function (ticket) {
          return join(ticket, data);
        });
    },
    get: function (id) {
      var data = state(),
        ticket = inDepartment(data, id);
      return ticket ? join(ticket, data) : null;
    },
    advance: function (id) {
      var data = state(),
        me = currentTech(),
        ticket = inDepartment(data, id);
      if (!ticket || !flow[ticket.status])
        throw new Error("This ticket can no longer be updated. Refresh to see the latest status.");
      if (ticket.technicianId !== me.id)
        throw new Error(
          ticket.technicianId
            ? "Only the assigned technician can update this ticket."
            : "Wait for the admin to assign this ticket before you start work.",
        );
      var next = flow[ticket.status],
        now = new Date().toISOString();
      if (next === "Resolved") ticket.resolvedAt = now;
      ticket.status = next;
      data.ticketStatusLogs.push({
        id: Date.now(),
        ticketId: ticket.id,
        status: next,
        changedBy: me.userId,
        changedAt: now,
        note: next === "Resolved" ? "Repair completed." : "Work started on this repair.",
      });
      save(data);
      return join(ticket, data);
    },
  };
})();
