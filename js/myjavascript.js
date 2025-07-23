

// common html parts

fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
  });
// fetch("footer.html")
//   .then((response) => response.text())
//   .then((data) => {
//     document.getElementById("footer-placeholder").innerHTML = data;
//   });
fetch("whatsappBtn.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("whatsappBtn-placeholder").innerHTML = data;
  });
//---------------

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
  const values = fields.map(
    (id) => parseFloat(document.getElementById(id).value) || 0
  );
  const total = values.reduce((a, b) => a + b, 0);
  const totalBox = document.getElementById("totalWarning");

  if (total !== 100) {
    totalBox.innerText = `Total is ${total}%. It should be 100%.`;
    totalBox.style.color = "red";
  } else {
    totalBox.innerText = ``;
  }
}

if (localStorage.getItem("yearPercentages") === null) {
  const defaultPercentages = {
    year_1per: "25",
    year_2per: "25",
    year_3per: "25",
    year_4per: "25",
  };
  localStorage.setItem("yearPercentages", JSON.stringify(defaultPercentages));
}


// Add input event listeners to each field
window.onload = function () {
  fields.forEach((id) => {
    document.getElementById(id).addEventListener("input", () => {
      validateField(id);
      saveToLocalStorage();
    });

    // Load saved values
    const saved = JSON.parse(localStorage.getItem("yearPercentages"));
    if (saved && saved[id]) {
      document.getElementById(id).value = saved[id];
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

