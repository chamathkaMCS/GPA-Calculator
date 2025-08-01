async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Retrieve student and university name (fallback to placeholders)
  const student = JSON.parse(localStorage.getItem("student")) || {};
  const studentName = student.name || "Student Name";
  const universityName = student.university || "University Name";

  const years = [
    { key: "year_1_modules", title: "Year 1 Modules" },
    { key: "year_2_modules", title: "Year 2 Modules" },
    { key: "year_3_modules", title: "Year 3 Modules" },
    { key: "year_4_modules", title: "Year 4 Modules" },
  ];

  let yPosition = 15;

  const pageWidth = doc.internal.pageSize.getWidth();

  // Main Heading
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  const text = "Degree Transcript - by GPA Calculator";
  const textWidth1 = doc.getTextWidth(text);
  const x = (pageWidth - textWidth1) / 2;
  doc.text("Degree Transcript - by GPA Calculator", x, yPosition);
  yPosition += 10;

  // Student Name & University Name
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Student: ${studentName}`, 14, yPosition);
  yPosition += 7;
  doc.text(`University: ${universityName}`, 14, yPosition);
  yPosition += 12;
  doc.setLineWidth(2);
  doc.line(14, yPosition - 6, 196, yPosition - 6);
  yPosition += 12;

  for (const year of years) {
    const modules = JSON.parse(localStorage.getItem(year.key)) || [];
    if (modules.length === 0) continue;

    // Year Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(year.title, 14, yPosition);
    yPosition += 8;

    // Prepare table data
    const tableColumn = ["Module Code", "Module Name", "Credits", "Grade"];
    const tableRows = modules.map((m) => [m.code, m.name, m.credits, m.grade]);

    doc.autoTable({
      startY: yPosition,
      head: [tableColumn],
      body: tableRows,
      theme: "striped",
      styles: {
        fontSize: 10,
        textColor: 0,
        fillColor: 255,
      },
      headStyles: {
        fillColor: 220,
        textColor: 0,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: 245,
      },
      margin: { left: 14, right: 14 },
      didDrawPage: (data) => {
        yPosition = data.cursor.y + 10;
      },
    });

    // Horizontal line separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.line(14, yPosition - 6, 196, yPosition - 6);
  }

  // Final GPA
  const finalGPA = localStorage.getItem("finalGPA") || "N/A";
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Final GPA: ${finalGPA}`, 14, yPosition + 10);
  yPosition += 20;

  // Disclaimer text - smaller, italic, grayish
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80); // dark gray
  const disclaimer =
    "This transcript is based on data provided by you and is not an official document.";
  doc.text(disclaimer, 14, yPosition, { maxWidth: 180 });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80); // dark gray

  const footerText = "© 2025 MCS Designers. All rights reserved.";
  const footerSubText =
    "Website developed by Chamathka Swaranga | Concept by Ushan Arosha";

  // Position at bottom of page (approx 10mm from bottom)
  const pageHeight = doc.internal.pageSize.height;
  const textWidth2 = doc.getTextWidth(footerText);
  const y = (pageWidth - textWidth2) / 2;
  const textWidth3 = doc.getTextWidth(footerSubText);
  const z = (pageWidth - textWidth3) / 2;
  doc.text(footerSubText, z, pageHeight - 5);
  doc.text(footerText, y, pageHeight - 10);
  // Save PDF
  doc.save("Transcript_by_GPA_CALCULATOR.pdf");
}
