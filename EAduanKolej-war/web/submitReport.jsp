
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <title>Submit Report - E-Aduan Kolej</title>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
      rel="stylesheet">
    <style>
        body {
            font-family: Poppins, sans-serif;
            background-color: #FFFFFF;
            margin: 0;
            padding: 40px;
        }

        h1, h2 {
            color: #1f2937;
            text-align: center;
        }

        form {
            background-color: white;
            max-width: 500px;
            margin: 30px auto;
            padding: 30px;
            border-radius: 16px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        label {
            font-weight: bold;
            color: #333;
        }

        input, select, textarea {
            width: 100%;
            padding: 10px;
            margin-top: 8px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
        }

        button {
    background-color: #F59E0B;
    color: #111827;
    border: none;
    padding: 12px;
    width: 100%;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
}

button:hover {
    background-color: #D97706;
}
    </style>
</head>

<body>

    <h1>E-Aduan Kolej</h1>
    <h2>Submit Maintenance Report</h2>

<form action="${pageContext.request.contextPath}/ReportServlet" method="post">

        <label>Report Title:</label><br>
        <input type="text" name="title" required>
        <br><br>

        <label>Hostel Block:</label><br>
        <select name="block" required>
            <option value="">-- Select Block --</option>
            <option value="A">Block A</option>
            <option value="B">Block B</option>
            <option value="C">Block C</option>
        </select>
        <br><br>

        <label>Room Number:</label><br>
        <input type="text" name="room" required>
        <br><br>

        <label>Damage Category:</label><br>
        <select name="category" required>
            <option value="">-- Select Category --</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Furniture">Furniture</option>
        </select>
        <br><br>

        <label>Description:</label><br>
        <textarea name="description" rows="5" cols="40"
                  required></textarea>
        <br><br>

        <button type="submit">Submit Report</button>

    </form>

</body>
</html>
