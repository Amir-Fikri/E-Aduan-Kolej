/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package controller;

import model.Report;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/**
 *
 * @author User
 */

@WebServlet(name = "ReportServlet", urlPatterns = {"/ReportServlet"})
public class ReportServlet extends HttpServlet {

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    
protected void processRequest(HttpServletRequest request,
        HttpServletResponse response)
        throws ServletException, IOException {

    request.setCharacterEncoding("UTF-8");

    // 1. Get data from JSP form
    String title = request.getParameter("title");
    String block = request.getParameter("block");
    String room = request.getParameter("room");
    String category = request.getParameter("category");
    String description = request.getParameter("description");
    
    // Server-side Validation
if (title == null || title.trim().isEmpty()
        || block == null || block.trim().isEmpty()
        || room == null || room.trim().isEmpty()
        || category == null || category.trim().isEmpty()
        || description == null || description.trim().isEmpty()) {

    response.sendError(
        HttpServletResponse.SC_BAD_REQUEST,
        "Please complete all required fields."
    );
    return;
}
// Validate Hostel Block
if (!"A".equals(block)
        && !"B".equals(block)
        && !"C".equals(block)) {

    response.sendError(
        HttpServletResponse.SC_BAD_REQUEST,
        "Invalid hostel block."
    );
    return;
}

// Validate Damage Category
if (!"Electrical".equals(category)
        && !"Plumbing".equals(category)
        && !"Furniture".equals(category)) {

    response.sendError(
        HttpServletResponse.SC_BAD_REQUEST,
        "Invalid damage category."
    );
    return;
}
    // 2. Create Report object
    Report report = new Report();

    // 3. Store data in JavaBean
    report.setTitle(title);
    report.setBlock(block);
    report.setRoom(room);
    report.setCategory(category);
    
report.setDescription(description);

// Automatic Prioritization and Routing
if ("Electrical".equals(category)) {
    report.setPriority("High");
    report.setDepartment("Electrical Department");

} else if ("Plumbing".equals(category)) {
    report.setPriority("Medium");
    report.setDepartment("Plumbing Department");

} else if ("Furniture".equals(category)) {
    report.setPriority("Low");
    report.setDepartment("Maintenance Department");

} else {
    report.setPriority("Pending Review");
    report.setDepartment("Admin Department");
}

report.setStatus("Pending");


    // 4. Pass report to JSP
    request.setAttribute("report", report);

    // 5. Forward to result page
    request.getRequestDispatcher("reportResult.jsp")
           .forward(request, response);
}


    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>

}
