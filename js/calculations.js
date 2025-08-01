function gradePointToValue(grade) {
  const gradePoints = {
    "A+": 4.2,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
  };

  return gradePoints[grade];
}

function GPAtoClass(GPA) {
  if (GPA >= 3.7) return "First Class Degree.";
  else if (GPA >= 3.3) return "Second Class Upper";
  else if (GPA >= 2.7) return "Second Class Lower";
  else if (GPA >= 2.0) return "General Degree";
  else if (GPA >= 1.0) return "Pass";
  else return "Fail";
}

function calculateGPA() {
  saveDefaultPercentage();
  const year1Modules = JSON.parse(
    localStorage.getItem("year_1_modules") || "[]"
  );
  const year2Modules = JSON.parse(
    localStorage.getItem("year_2_modules") || "[]"
  );
  const year3Modules = JSON.parse(
    localStorage.getItem("year_3_modules") || "[]"
  );
  const year4Modules = JSON.parse(
    localStorage.getItem("year_4_modules") || "[]"
  );
  const yearPercentages = JSON.parse(
    localStorage.getItem("yearPercentages") || "[]"
  );

  //Year 1 GPA
  let year1Credits = 0;
  let year1Points = 0;

  year1Modules.forEach((module) => {
    const credits = parseFloat(module.credits);
    const grade = module.grade;
    const gpValue = gradePointToValue(grade);

    year1Credits += credits;
    year1Points += gpValue * credits;
  });

  const Year1Gpa =
    year1Credits === 0 ? 0 : (year1Points / year1Credits).toFixed(2);
  console.log("Year 1 GPA is :", Year1Gpa);

  //Year 2 GPA
  let year2Credits = 0;
  let year2Points = 0;

  year2Modules.forEach((module) => {
    const credits = parseFloat(module.credits);
    const grade = module.grade;
    const gpValue = gradePointToValue(grade);

    year2Credits += credits;
    year2Points += gpValue * credits;
  });

  const Year2Gpa =
    year2Credits === 0 ? 0 : (year2Points / year2Credits).toFixed(2);
  console.log("Year 2 GPA is :", Year2Gpa);

  //Year 3 GPA
  let year3Credits = 0;
  let year3Points = 0;

  year3Modules.forEach((module) => {
    const credits = parseFloat(module.credits);
    const grade = module.grade;
    const gpValue = gradePointToValue(grade);

    year3Credits += credits;
    year3Points += gpValue * credits;
  });

  const Year3Gpa =
    year3Credits === 0 ? 0 : (year3Points / year3Credits).toFixed(2);
  console.log("Year 3 GPA is :", Year3Gpa);

  //Year 4 GPA
  let year4Credits = 0;
  let year4Points = 0;

  year4Modules.forEach((module) => {
    const credits = parseFloat(module.credits);
    const grade = module.grade;
    const gpValue = gradePointToValue(grade);

    year4Credits += credits;
    year4Points += gpValue * credits;
  });

  const Year4Gpa =
    year4Credits === 0 ? 0 : (year4Points / year4Credits).toFixed(2);
  console.log("Year 4 GPA is :", Year4Gpa);

  //calculate cumilative GPA
  const year1percentage = parseFloat(yearPercentages.year_1per) / 100;
  const year2percentage = parseFloat(yearPercentages.year_2per) / 100;
  const year3percentage = parseFloat(yearPercentages.year_3per) / 100;
  const year4percentage = parseFloat(yearPercentages.year_4per) / 100;
  const GPA =
    Year1Gpa * year1percentage +
    Year2Gpa * year2percentage +
    Year3Gpa * year3percentage +
    Year4Gpa * year4percentage;

  const degreeClass = GPAtoClass(GPA.toFixed(2));

  document.getElementById("gpaDisplay").innerText = GPA.toFixed(2);
  document.getElementById("classDisplay").innerText = degreeClass;
  localStorage.setItem("finalGPA", GPA.toFixed(2));
  localStorage.setItem("final_save", "uptodate");

  toggleGPAView();
}
