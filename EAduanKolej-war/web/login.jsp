<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Login · EAduanKolej</title>
        <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="assets/css/global.css" />
        <link rel="stylesheet" href="assets/css/auth.css" />
    </head>
    <body class="auth-page">
        <main class="auth-panel">
            <div class="brand">
                <span class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg></span>
                <span>EAduan<span class="brand-accent">Kolej</span><small>ROOM MAINTENANCE</small></span>
            </div>

            <span class="eyebrow">ADUAN PORTAL</span>
            <h1>Welcome back.</h1>
            <p class="auth-intro">Log in as a student, technician or admin.</p>

            <c:if test="${not empty error}">
                <p class="notice notice-error" role="alert"><c:out value="${error}"/></p>
            </c:if>
            <c:if test="${param.registered == '1'}">
                <p class="notice notice-success" role="status">Registration successful. Please log in.</p>
            </c:if>
            <c:if test="${param.logout == '1'}">
                <p class="notice notice-success" role="status">You have been logged out.</p>
            </c:if>

            <form class="auth-form" action="LoginServlet" method="post">
                <label for="username">Student ID / Staff ID</label>
                <input type="text" id="username" name="username" required autofocus autocomplete="username">

                <label for="password">Password</label>
                <input type="password" id="password" name="password" required autocomplete="current-password">

                <button type="submit" class="button button-primary">Log in</button>
            </form>

            <p class="auth-switch">New student? <a href="register.jsp">Register here</a></p>
        </main>
    </body>
</html>
