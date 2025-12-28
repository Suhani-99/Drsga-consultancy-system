// script.js - Handles the Payment Popup and Booking Logic

// ---------------------------------------------------------
// CONFIGURATION: PASTE YOUR CALENDAR LINK BELOW
// ---------------------------------------------------------
var calendarLink = "https://calendar.app.google/nZeiZNyNzjjaHtUw5"; 
// Example: "https://calendar.app.google/nZeiZNyNzjjaHtUw5"

// ---------------------------------------------------------
// MODAL LOGIC (Black Laser + Blue Tint)
// ---------------------------------------------------------

function openModal(name, price) {
    // 1. Reset Everything
    document.getElementById('paymentView').style.display = 'block';
    document.getElementById('successView').style.display = 'none';
    document.getElementById('scanText').style.display = 'none';
    document.getElementById('verifyBtn').style.display = 'block';
    
    // RESET STYLES: Remove animation & Blue Tint
    document.getElementById('laserLine').classList.remove('laser-animate');
    document.getElementById('qrContainer').classList.remove('scanning-active');

    // 2. Set Info
    document.getElementById('pkgName').innerText = name;
    document.getElementById('pkgPrice').innerText = '₹' + price;
    document.getElementById('calendarBtn').href = calendarLink;
    
    // 3. Show Modal
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

function startScanning() {
    document.getElementById('verifyBtn').style.display = 'none';
    document.getElementById('scanText').style.display = 'block';

    // 1. TURN ON LASER
    document.getElementById('laserLine').classList.add('laser-animate');
    
    // 2. TURN ON BLUE TINT ("Selected" Feeling)
    document.getElementById('qrContainer').classList.add('scanning-active');

    // 3. Wait 3 seconds
    setTimeout(function() {
        showSuccessState();
    }, 3000); 
}

function showSuccessState() {
    document.getElementById('paymentView').style.display = 'none';
    document.getElementById('successView').style.display = 'block';
}

window.onclick = function(event) {
    var modal = document.getElementById('paymentModal');
    if (event.target == modal) {
        closeModal();
    }
}
// ---------------------------------------------------------
// ADMIN DASHBOARD LOGIC (Custom Templates)
// ---------------------------------------------------------

// ---------------------------------------------------------
// ADMIN SECURITY LOGIC
// ---------------------------------------------------------

function openAdminPanel() {
    // 1. Close the menu if open
    var offcanvas = document.querySelector('.offcanvas');
    if (offcanvas && offcanvas.classList.contains('show')) {
        document.querySelector('[data-bs-dismiss="offcanvas"]')?.click(); 
    }

    // 2. SHOW LOGIN POPUP INSTEAD OF DASHBOARD
    document.getElementById('loginModal').style.display = 'flex';
    
    // Clear previous password attempt
    document.getElementById('adminPassword').value = ''; 
}

function closeLogin() {
    document.getElementById('loginModal').style.display = 'none';
}

function checkLogin() {
    var password = document.getElementById('adminPassword').value;

    // --- SET YOUR PASSWORD HERE ---
    if (password === "admin123") { 
        // SUCCESS: Close login, Open Dashboard
        closeLogin();
        document.getElementById('adminModal').style.display = 'flex';
        // Set today's date
        document.getElementById('meetingDate').valueAsDate = new Date();
    } else {
        // FAILURE
        alert("Access Denied: Incorrect Password");
    }
}
function closeAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Get Values
    const name = document.getElementById('clientName').value || "Client";
    const org = document.getElementById('clientOrg').value || "N/A";
    const email = document.getElementById('clientEmail').value || "N/A";
    const date = document.getElementById('meetingDate').value;
    const time = document.getElementById('meetingTime').value || "N/A";
    const agenda = document.getElementById('agenda').value;
    const discussion = document.getElementById('discussion').value;
    const recs = document.getElementById('recommendations').value;

    // --- PDF DESIGN (Matches your Template) ---
    
    // 1. Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(1, 32, 97); // Brand Blue
    doc.text("Dr. Sengupta & Associates – Online Consultancy", 105, 20, null, null, "center");
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0); // Black
    doc.text("Minutes of the Meeting", 105, 30, null, null, "center");

    // 2. Client Details Table Area
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    
    let startY = 50;
    let gap = 8;

    doc.text("Client Name:", 20, startY);
    doc.setFont("helvetica", "normal");
    doc.text(name, 60, startY);

    doc.setFont("helvetica", "bold");
    doc.text("Organization:", 20, startY + gap);
    doc.setFont("helvetica", "normal");
    doc.text(org, 60, startY + gap);

    doc.setFont("helvetica", "bold");
    doc.text("Email:", 20, startY + (gap*2));
    doc.setFont("helvetica", "normal");
    doc.text(email, 60, startY + (gap*2));

    doc.setFont("helvetica", "bold");
    doc.text("Date:", 20, startY + (gap*3));
    doc.setFont("helvetica", "normal");
    doc.text(date, 60, startY + (gap*3));

    doc.setFont("helvetica", "bold");
    doc.text("Time:", 120, startY + (gap*3));
    doc.setFont("helvetica", "normal");
    doc.text(time, 140, startY + (gap*3));

    doc.setFont("helvetica", "bold");
    doc.text("Consultant:", 20, startY + (gap*4));
    doc.setFont("helvetica", "normal");
    doc.text("Dr. R. Sengupta", 60, startY + (gap*4));

    // Divider Line
    doc.setLineWidth(0.5);
    doc.line(20, startY + (gap*5), 190, startY + (gap*5));

    // 3. Sections (Agenda, Discussion, Recommendations)
    let contentY = 105;

    // Agenda
    doc.setFont("helvetica", "bold");
    doc.text("Agenda:", 20, contentY);
    doc.setFont("helvetica", "normal");
    doc.text(agenda, 20, contentY + 7, { maxWidth: 170 });
    
    contentY += 25; // Move down

    // Discussion Summary
    doc.setFont("helvetica", "bold");
    doc.text("Discussion Summary:", 20, contentY);
    doc.setFont("helvetica", "normal");
    doc.text(discussion, 20, contentY + 7, { maxWidth: 170 });

    contentY += 40; // Move down

    // Recommendations & Action Points
    doc.setFont("helvetica", "bold");
    doc.text("Key Recommendations & Agreed Action Points:", 20, contentY);
    doc.setFont("helvetica", "normal");
    doc.text(recs, 20, contentY + 7, { maxWidth: 170 });

    // 4. Footer (Prepared By)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Prepared & Shared by:", 20, 260);
    doc.setFont("helvetica", "normal");
    doc.text("Dr. R. Sengupta | CEO | www.drsga.com", 20, 266);

    // Save
    doc.save(`MoM_${name.replace(/ /g,"_")}.pdf`);
    alert("MoM PDF Generated Successfully!");
}

function draftEmail() {
    const email = document.getElementById('clientEmail').value;
    const name = document.getElementById('clientName').value;
    const date = document.getElementById('meetingDate').value;

    if(!email) {
        alert("Please enter client email.");
        return;
    }

    // YOUR EXACT CUSTOM TEMPLATE
    const subject = `Minutes of Your Online Consultancy – ${date}`;
    
    const body = `Dear ${name},%0D%0A%0D%0AThank you for attending the online consultancy session today. Please find attached the Minutes of Meeting summarizing key discussion points and action items.%0D%0A%0D%0AFeel free to reach out if you need any further clarification.%0D%0A%0D%0AWarm regards,%0D%0ADr. R. Sengupta%0D%0ACEO, Dr. Sengupta & Associates%0D%0A📧 drsenguptaconsult@gmail.com%0D%0A🌐 www.drsga.com`;

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
}