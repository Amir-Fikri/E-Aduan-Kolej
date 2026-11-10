
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="model.Report"%>
<%!
    public String escapeHtml(String text) {
        if (text == null) {
            return "";
        }

        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;")
                   .replace("'", "&#39;");
    }
%>
<%
    Report report = (Report) request.getAttribute("report");

    if (report == null) {
        response.sendRedirect("submitReport.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Report Result - E-Aduan Kolej</title>

    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet">

    <style>
        body {
            font-family: 'Poppins', sans-serif;
            background-color: #FFFFFF;
            margin: 0;
            padding: 40px;
            color: #1f2937;
        }

        h1, h2 {
            text-align: center;
            color: #1f2937;
        }

        body > p {
            max-width: 500px;
            margin: 0 auto;
            padding: 12px 20px;
            border-left: 1px solid #e5e7eb;
            border-right: 1px solid #e5e7eb;
        }

        body > p:nth-of-type(1) {
            margin-top: 30px;
            border-top: 1px solid #e5e7eb;
            border-radius: 16px 16px 0 0;
            padding-top: 24px;
        }

        body > p:nth-of-type(8) {
            border-bottom: 1px solid #e5e7eb;
            border-radius: 0 0 16px 16px;
            padding-bottom: 24px;
        }

        b {
            color: #92400e;
        }

        a {
            display: block;
            max-width: 500px;
            margin: 25px auto;
            padding: 12px 20px;
            background-color: #F59E0B;
            color: #111827;
            text-align: center;
            text-decoration: none;
            font-weight: 600;
            border-radius: 12px;
        }

        a:hover {
            background-color: #D97706;
        }
    </style>
</head>
<body>

    <h1>E-Aduan Kolej</h1>
    <h2>Report Details</h2>

    <p><b>Report Title:</b>
        <%= escapeHtml(report.getTitle()) %></p>

    <p><b>Hostel Block:</b>
        <%= escapeHtml(report.getBlock()) %></p>

    <p><b>Room Number:</b>
        <%= escapeHtml(report.getRoom()) %></p>

    <p><b>Damage Category:</b>
        <%= escapeHtml(report.getCategory()) %></p>

    <p><b>Description:</b>
      <%= escapeHtml(report.getDescription()) %></p>

    <p><b>Status:</b>
        <%= escapeHtml(report.getStatus()) %></p>

<p><b>Priority:</b>
    <%= escapeHtml(report.getPriority()) %></p>

<p><b>Assigned Department:</b>
   <%= escapeHtml(report.getDepartment()) %></p>

    <a href="submitReport.jsp">Back to Submit Report</a>

</body>
</html>
