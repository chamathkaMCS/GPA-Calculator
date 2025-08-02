// common html parts
fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
  });

fetch("whatsappBtn.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("whatsappBtn-placeholder").innerHTML = data;
  });

fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });

//---------------

//toggle calculate button
function toggleGPAView() {
  // Example: check if localStorage final Save 'status'
  const final_save = localStorage.getItem("final_save");

  const gpaView = document.getElementById("gpaView");
  const calcView = document.getElementById("calcView");

  if (final_save === "uptodate") {
    // Show GPA, hide calculate
    gpaView.style.display = "block";
    calcView.style.display = "none";
  } else {
    // Show Calculate, hide GPA
    gpaView.style.display = "none";
    calcView.style.display = "block";
  }
}

//save default percentages
function saveDefaultPercentage() {
  const defaultPercentages = {
    year_1per: "25",
    year_2per: "25",
    year_3per: "25",
    year_4per: "25",
  };
  localStorage.setItem("yearPercentages", JSON.stringify(defaultPercentages));
}

//colorpicker
document.addEventListener("DOMContentLoaded", function () {
  const saved = JSON.parse(localStorage.getItem("themePalette"));
  const colorInput = document.getElementById("colorPicker");

  const defaultColor = "#137e2a";
  const baseColor = saved?.base || defaultColor;
  generateColorPalette(baseColor);
  if (colorInput) colorInput.value = baseColor;

  // Set up listeners
  setupGeneralListeners();
});

function setupGeneralListeners() {
  const colorInput = document.getElementById("colorPicker");
  if (colorInput) {
    colorInput.addEventListener("input", function () {
      generateColorPalette(this.value);
      updatePalette(); // Optional visual update
    });
  }

  // Toggle year sections
  ["firstYear", "secondYear", "thirdYear", "finalYear"].forEach((id) => {
    const section = document.getElementById(id);
    const heading = section.querySelector("h1");

    if (section && heading) {
      // Set default height inline so toggle logic works
      section.style.height = "90px";

      heading.style.cursor = "pointer";
      heading.addEventListener("click", function () {
        section.style.height =
          section.style.height === "90px" ? "100%" : "90px";
      });
    }
  });
}
const fields = ["year_1per", "year_2per", "year_3per", "year_4per"];

function validateField(id) {
  const input = document.getElementById(id);
  const value = parseFloat(input.value);
  if (isNaN(value) || value < 0 || value > 100) {
    input.style.border = "2px solid red";
  } else {
    input.style.border = "2px solid green";
  }
  validateTotal();
}

function validateTotal() {
  const values = fields.map((id) => {
    const element = document.getElementById(id);
    if (!element) {
      // Element not found, treat as missing value
      return null;
    }
    const val = element.value;
    return val ? parseFloat(val) : null;
  });

  // If any value is missing or element not found, skip validation
  if (values.includes(null)) return;

  const total = values.reduce((a, b) => a + b, 0);
  const totalBox = document.getElementById("totalWarning");

  if (total !== 100) {
    totalBox.innerText = `Total is ${total}%. It should be 100%.`;
    totalBox.style.color = "red";
  } else {
    totalBox.innerText = ``;
  }
}



// Save all year percentages to localStorage
function saveYearPercentages() {
  const percentages = {};
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      percentages[id] = el.value || "0";
    }
  });
  localStorage.setItem("yearPercentages", JSON.stringify(percentages));
}

// Load percentages and setup listeners
window.onload = function () {
  fields.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) {
      console.warn(Element with ID '${id}' not found);
      return; // Skip to next
    }

    el.addEventListener("input", () => {
      validateField(id);
      saveToLocalStorage();
    });

    // Load saved values
    const saved = JSON.parse(localStorage.getItem("yearPercentages"));
    if (saved && saved[id]) {
      el.value = saved[id];
    }
  });

  validateTotal();
};


function saveToLocalStorage() {
  const data = {};
  fields.forEach((id) => {
    data[id] = document.getElementById(id).value;
  });
  localStorage.setItem("yearPercentages", JSON.stringify(data));
}
//save student detailes
const userNameInput = document.getElementById("userName");
const universityNameInput = document.getElementById("universityName");

function updateStudentInStorage() {
  const student = {
    name: userNameInput.value.trim(),
    university: universityNameInput.value.trim(),
  };
  localStorage.setItem("student", JSON.stringify(student));
}

// Load existing data from localStorage
function loadStudentFromStorage() {
  const stored = JSON.parse(localStorage.getItem("student") || "{}");
  if (stored.name) userNameInput.value = stored.name;
  if (stored.university) universityNameInput.value = stored.university;
}

// Update in real time
userNameInput.addEventListener("input", updateStudentInStorage);
universityNameInput.addEventListener("input", updateStudentInStorage);

// Load on page load
document.addEventListener("DOMContentLoaded", loadStudentFromStorage);
