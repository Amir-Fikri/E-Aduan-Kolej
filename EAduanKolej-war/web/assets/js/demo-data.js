/* DEMO */
(function () {
  "use strict";
  var data = {
    version: 1,
    currentStudentId: 1,
    roles: [
      { id: 1, name: "Student" },
      { id: 2, name: "Technician" },
      { id: 3, name: "Admin" },
    ],
    users: [
      {
        id: 1,
        roleId: 1,
        name: "Aina Nadhirah",
        email: "aina@example.test",
        studentNumber: "2026123456",
      },
      { id: 2, roleId: 2, name: "Amir Hakim", email: "amir@example.test", studentNumber: null },
      { id: 3, roleId: 2, name: "Siti Farah", email: "farah@example.test", studentNumber: null },
      { id: 4, roleId: 3, name: "College Admin", email: "admin@example.test", studentNumber: null },
      {
        id: 5,
        roleId: 1,
        name: "Daniel Lim",
        email: "daniel@example.test",
        studentNumber: "2026654321",
      },
    ],
    blocks: [
      { id: 1, name: "Block A" },
      { id: 2, name: "Block B" },
    ],
    rooms: [
      { id: 1, blockId: 1, number: "A-203" },
      { id: 2, blockId: 2, number: "B-105" },
    ],
    departments: [
      { id: 1, name: "Electrical" },
      { id: 2, name: "Plumbing" },
      { id: 3, name: "General Maintenance" },
    ],
    technicians: [
      { id: 1, userId: 2, departmentId: 1 },
      { id: 2, userId: 3, departmentId: 2 },
    ],
    categories: [
      { id: 1, name: "Electrical", defaultPriority: "High", departmentId: 1 },
      { id: 2, name: "Plumbing", defaultPriority: "Medium", departmentId: 2 },
      { id: 3, name: "Furniture", defaultPriority: "Low", departmentId: 3 },
    ],
    tickets: [
      {
        id: 1048,
        studentId: 1,
        roomId: 1,
        categoryId: 1,
        departmentId: 1,
        technicianId: null,
        title: "Ceiling light keeps flickering",
        description:
          "The ceiling light above my study desk flickers every few minutes. It started yesterday evening and makes it difficult to study. Please check the fitting and wiring.",
        priority: "High",
        status: "Pending",
        createdAt: "2026-11-07T09:15:00+08:00",
        resolvedAt: null,
        cancelledAt: null,
        photoPath: null,
      },
      {
        id: 1042,
        studentId: 1,
        roomId: 1,
        categoryId: 2,
        departmentId: 2,
        technicianId: 2,
        title: "Leaking pipe under bathroom sink",
        description:
          "Water is slowly dripping from the pipe joint under the bathroom sink. The floor becomes wet even when the tap is turned off. A small container is placed underneath for now.",
        priority: "Medium",
        status: "In Progress",
        createdAt: "2026-11-05T08:30:00+08:00",
        resolvedAt: null,
        cancelledAt: null,
        photoPath: "assets/images/demo-sink.svg",
      },
      {
        id: 1035,
        studentId: 1,
        roomId: 1,
        categoryId: 3,
        departmentId: 3,
        technicianId: null,
        title: "Loose hinge on wardrobe door",
        description:
          "The upper hinge on the left wardrobe door is loose. The door does not close properly and needs to be tightened.",
        priority: "Low",
        status: "Pending",
        createdAt: "2026-11-03T14:10:00+08:00",
        resolvedAt: null,
        cancelledAt: null,
        photoPath: null,
      },
      {
        id: 1026,
        studentId: 1,
        roomId: 1,
        categoryId: 1,
        departmentId: 1,
        technicianId: 1,
        title: "Power socket beside bed not working",
        description:
          "The wall socket beside the bed has no power. Other sockets in the room are working normally.",
        priority: "High",
        status: "Resolved",
        createdAt: "2026-10-29T10:00:00+08:00",
        resolvedAt: "2026-10-30T15:30:00+08:00",
        cancelledAt: null,
        photoPath: null,
      },
      {
        id: 1018,
        studentId: 1,
        roomId: 1,
        categoryId: 2,
        departmentId: 2,
        technicianId: 2,
        title: "Bathroom tap will not turn off fully",
        description: "The bathroom tap continues to drip after closing it. The handle feels loose.",
        priority: "Medium",
        status: "Resolved",
        createdAt: "2026-10-24T11:45:00+08:00",
        resolvedAt: "2026-10-26T12:00:00+08:00",
        cancelledAt: null,
        photoPath: null,
      },
      {
        id: 1009,
        studentId: 1,
        roomId: 1,
        categoryId: 3,
        departmentId: 3,
        technicianId: null,
        title: "Study chair feels unstable",
        description:
          "One leg of the study chair seems loose. The college office has since provided a replacement chair.",
        priority: "Low",
        status: "Cancelled",
        createdAt: "2026-10-20T16:20:00+08:00",
        resolvedAt: null,
        cancelledAt: "2026-10-21T09:00:00+08:00",
        photoPath: null,
      },
      {
        id: 1050,
        studentId: 5,
        roomId: 2,
        categoryId: 1,
        departmentId: 1,
        technicianId: null,
        title: "Corridor lamp outside room is faulty",
        description: "The corridor lamp is not lighting up.",
        priority: "High",
        status: "Pending",
        createdAt: "2026-11-07T10:00:00+08:00",
        resolvedAt: null,
        cancelledAt: null,
        photoPath: null,
      },
    ],
    ticketStatusLogs: [],
    feedback: [
      {
        id: 1,
        ticketId: 1018,
        rating: 5,
        comment: "Quick repair and a very helpful technician. Thank you!",
        createdAt: "2026-10-26T18:00:00+08:00",
      },
    ],
  };
  var id = 1;
  data.tickets.forEach(function (ticket) {
    var department = data.departments.filter(function (row) {
      return row.id === ticket.departmentId;
    })[0];
    data.ticketStatusLogs.push({
      id: id++,
      ticketId: ticket.id,
      status: "Pending",
      changedBy: ticket.studentId,
      changedAt: ticket.createdAt,
      note: "Report submitted and routed to " + department.name + ".",
    });
  });
  [
    [
      1042,
      "In Progress",
      3,
      "2026-11-06T10:15:00+08:00",
      "Inspecting the pipe joint. A replacement seal has been requested.",
    ],
    [1026, "In Progress", 2, "2026-10-30T09:00:00+08:00", "Socket inspection started."],
    [
      1026,
      "Resolved",
      2,
      "2026-10-30T15:30:00+08:00",
      "Replaced the faulty socket and tested the power supply.",
    ],
    [1018, "In Progress", 3, "2026-10-25T10:00:00+08:00", "Checking the tap cartridge."],
    [
      1018,
      "Resolved",
      3,
      "2026-10-26T12:00:00+08:00",
      "Replaced the cartridge. Tap is working normally.",
    ],
    [
      1009,
      "Cancelled",
      1,
      "2026-10-21T09:00:00+08:00",
      "A replacement chair was provided by the college office.",
    ],
  ].forEach(function (log) {
    data.ticketStatusLogs.push({
      id: id++,
      ticketId: log[0],
      status: log[1],
      changedBy: log[2],
      changedAt: log[3],
      note: log[4],
    });
  });
  window.EAduanDemo = data;
})();
