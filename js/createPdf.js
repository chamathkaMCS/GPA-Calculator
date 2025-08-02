async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const student = JSON.parse(localStorage.getItem("student")) || {};
  const studentName = student.name || "Student Name";
  const universityName = student.university || "University Name";

  const years = [
    { key: "year_1_modules", title: "Year 1 Modules" },
    { key: "year_2_modules", title: "Year 2 Modules" },
    { key: "year_3_modules", title: "Year 3 Modules" },
    { key: "year_4_modules", title: "Year 4 Modules" },
  ];

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginLeft = 14;
  const marginRight = 14;
  const marginTop = 50;
  const marginBottom = 20;

  const drawHeader = () => {
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Degree Transcript - by GPA Calculator", pageWidth / 2, 20, {
      align: "center",
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Student: ${studentName}`, marginLeft, 30);
    doc.text(`University: ${universityName}`, marginLeft, 38);

    doc.setLineWidth(1);
    doc.line(marginLeft, 44, pageWidth - marginRight, 44);
  };

  const drawFooter = () => {
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80);
    const footerText = "© 2025 MCS Designers. All rights reserved.";
    const footerSubText =
      "Website developed by Chamathka Swaranga | Concept by Ushan Arosha";
    doc.text(footerText, pageWidth / 2, pageHeight - 12, { align: "center" });
    doc.text(footerSubText, pageWidth / 2, pageHeight - 6, { align: "center" });
  };

  // Register didDrawPage once for all tables to draw header/footer on every page
  const didDrawPage = (data) => {
    drawHeader();
    drawFooter();
  };

  let currentY = marginTop;

  for (const year of years) {
    const modules = JSON.parse(localStorage.getItem(year.key)) || [];
    if (modules.length === 0) continue;

    // If there isn't enough space for the year title + some table rows, add a new page
    if (currentY + 10 > pageHeight - marginBottom) {
      doc.addPage();
      currentY = marginTop;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(year.title, marginLeft, currentY);
    currentY += 6;

    const tableColumn = ["Module Code", "Module Name", "Credits", "Grade"];
    const tableRows = modules.map((m) => [m.code, m.name, m.credits, m.grade]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: currentY,
      margin: { left: marginLeft, right: marginRight },
      styles: {
        fontSize: 10,
        textColor: 0,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [240, 240, 240],
        textColor: 0,
        fontStyle: "bold",
        halign: "left",
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      theme: "striped",
      didDrawPage, // Use the header/footer callback
    });

    currentY = doc.lastAutoTable.finalY + 20;
  }

  // Final GPA and note - check page space and add new page if needed
  if (currentY + 20 > pageHeight - marginBottom) {
    doc.addPage();
    currentY = marginTop;
  }

  const finalGPA = localStorage.getItem("finalGPA") || "N/A";
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0);
  doc.text(`Final GPA: ${finalGPA}`, marginLeft, currentY);

  currentY += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(80);
  doc.text(
    "This transcript is based on data provided by you and is not an official document.",
    marginLeft,
    currentY,
    { maxWidth: pageWidth - marginLeft - marginRight }
  );

  // No need to call drawFooter() here; autoTable pages handle it

  doc.save("Transcript_by_GPA_CALCULATOR.pdf");
}
