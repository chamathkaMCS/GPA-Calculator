fetch("header.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("header-placeholder").innerHTML = data;
    setupHeaderRelatedListeners();
  });
fetch("footer.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("footer-placeholder").innerHTML = data;
  });
fetch("whatsappBtn.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("whatsappBtn-placeholder").innerHTML = data;
  });

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

function setupHeaderRelatedListeners() {
  const toggleHeightBtn = document.getElementById("toggleHeightBtn");
  if (toggleHeightBtn) {
    toggleHeightBtn.onclick = () => toggleHeight(toggleHeightBtn);
  }
}

function toggleHeight(button) {
  const header = document.getElementById("header");
  if (!header) return;
  const isExpanded = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", !isExpanded);
  header.style.minHeight = isExpanded ? "150px" : "350px";
}

// Color conversion & palette generation
function hexToRgb(hex) {
  hex = hex.replace(/^#/, "");
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}

function hslToHex(h, s, l) {
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  const toHex = (x) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  return "#" + toHex(r) + toHex(g) + toHex(b);
}

function generateColorPalette(baseHex) {
  const { h, s, l } = rgbToHsl(...Object.values(hexToRgb(baseHex)));

  const palette = [
    hslToHex(h, s, Math.max(0, l - 0.15)), // primary
    hslToHex(h, s * 0.8, l), // secondary
    hslToHex(h, s * 1.2, Math.min(1, l + 0.1)), // accent
    hslToHex(h, s * 0.5, Math.max(0, l - 0.2)), // background
    hslToHex(h, s, l), // text
  ];

  const root = document.documentElement;
  root.style.setProperty("--color-primary", palette[0]);
  root.style.setProperty("--color-secondary", palette[1]);
  root.style.setProperty("--color-accent", palette[2]);
  root.style.setProperty("--color-background", palette[3]);
  root.style.setProperty("--color-text", palette[4]);

  localStorage.setItem(
    "themePalette",
    JSON.stringify({ base: baseHex, palette })
  );

  return palette;
}

// Optional: Live preview in a div
function updatePalette() {
  const paletteDiv = document.getElementById("palette");
  if (!paletteDiv) return;

  const baseColor = document.getElementById("colorPicker").value;
  const palette = generateColorPalette(baseColor);

  paletteDiv.innerHTML = "";

  const names = ["Primary", "Secondary", "Accent", "Background", "Text"];
  palette.forEach((color, i) => {
    const swatch = document.createElement("div");
    swatch.className = "swatch";
    swatch.style.backgroundColor = color;
    swatch.textContent = names[i];
    paletteDiv.appendChild(swatch);
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
// Define expected fields (optional for validation)
const expectedHeaders = ["StudentID", "FullName", "Email", "Major", "GPA"]; // Change as per your CSV

function buildTableFromData(data) {
  if (data.length === 0) return "<p>No data</p>";

  let html =
    "<table border='1' style='border-collapse: collapse; width: 100%; text-align: center;'>";
  html += "<thead><tr>";
  Object.keys(data[0]).forEach((key) => {
    html += `<th style="padding: 8px;">${key}</th>`;
  });
  html += "</tr></thead><tbody>";

  data.forEach((row) => {
    html += "<tr>";
    Object.values(row).forEach((val) => {
      html += `<td style="padding: 8px;">${val}</td>`;
    });
    html += "</tr>";
  });

  html += "</tbody></table>";
  return html;
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

