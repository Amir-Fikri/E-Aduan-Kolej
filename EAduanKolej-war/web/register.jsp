<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Register · EAduanKolej</title>
        <link rel="icon" href="assets/images/favicon.svg" type="image/svg+xml" />
        <link rel="stylesheet" href="assets/css/global.css" />
        <link rel="stylesheet" href="assets/css/auth.css" />
    </head>
    <body class="auth-page">
        <main class="auth-panel wide">
            <div class="brand">
                <span class="brand-mark"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/></svg></span>
                <span>EAduan<span class="brand-accent">Kolej</span><small>ROOM MAINTENANCE</small></span>
            </div>

            <span class="eyebrow">STUDENT REGISTRATION</span>
            <h1>Create your account.</h1>
            <p class="auth-intro">Register to report damage in your room or hostel block.</p>

            <c:if test="${not empty error}">
                <p class="notice notice-error" role="alert"><c:out value="${error}"/></p>
            </c:if>

            <form class="auth-form" action="RegisterServlet" method="post" onsubmit="return checkPasswords()">
                <label for="fullName">Full Name</label>
                <input type="text" id="fullName" name="fullName" required autocomplete="name">

                <div class="field-row">
                    <div>
                        <label for="studentId">Student ID</label>
                        <input type="text" id="studentId" name="studentId" required inputmode="numeric"
                               pattern="\d{10}" title="10-digit student ID, e.g. 2026123456">
                    </div>
                    <div>
                        <label for="phone">Phone No.</label>
                        <input type="tel" id="phone" name="phone" required autocomplete="tel"
                               pattern="01\d{8,9}" title="e.g. 0123456789">
                    </div>
                </div>

                <label for="email">Email</label>
                <input type="email" id="email" name="email" required autocomplete="email">

                <div class="field-row">
                    <div>
                        <label for="kolej">Kolej</label>
                        <input type="text" id="kolej" name="kolej" required>
                    </div>
                    <div>
                        <label for="room">Block &amp; Room No.</label>
                        <input type="text" id="room" name="room" required placeholder="e.g. A-2-15">
                    </div>
                </div>

                <div class="field-row">
                    <div>
                        <label for="password">Password</label>
                        <input type="password" id="password" name="password" required minlength="6" autocomplete="new-password">
                    </div>
                    <div>
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required autocomplete="new-password">
                    </div>
                </div>

                <button type="submit" class="button button-primary">Create account</button>
            </form>

            <p class="auth-switch">Already have an account? <a href="login.jsp">Log in</a></p>
        </main>

        <script>
            function checkPasswords() {
                var confirm = document.getElementById("confirmPassword");
                var same = document.getElementById("password").value === confirm.value;
                confirm.setCustomValidity(same ? "" : "Passwords do not match");
                return confirm.reportValidity();
            }
            document.getElementById("confirmPassword").oninput = function () { this.setCustomValidity(""); };
        </script>
    </body>
</html>
