const secretKey = "Chamathka-Swaranga";

// Initial render on page load
document.addEventListener("DOMContentLoaded", () => {
  renderTable("firstYear", "year_1_modules");
  renderTable("secondYear", "year_2_modules");
  renderTable("thirdYear", "year_3_modules");
  renderTable("finalYear", "year_4_modules");
});

function getStoredModules(key) {
  return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveModules(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function renderTable(containerId, storageKey) {
  const tableBody = document.querySelector(`#${containerId} tbody`);
  if (!tableBody) return;

  const data = getStoredModules(storageKey);
  tableBody.innerHTML = "";
  data.forEach((row, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="text" value="${
        row.code
      }" oninput="updateModule('${storageKey}', ${index}, 'code', this.value)" /></td>
      <td><input type="text" value="${
        row.name
      }" oninput="updateModule('${storageKey}', ${index}, 'name', this.value)" /></td>
      <td><input min="1" max="6"  type="number" value="${
        row.credits
      }" oninput="updateModule('${storageKey}', ${index}, 'credits', this.value)"/></td>
      <td>
        <select onchange="updateModule('${storageKey}', ${index}, 'grade', this.value) >
          <option value="">Select</option>
          ${generateGradeOptions(row.grade)}
        </select>
      </td>
      <td><i class="fa fa-trash" onclick="deleteModule('${storageKey}', '${containerId}', ${index})"></i></td>
    `;
    tableBody.appendChild(tr);
  });

  // Add input row
  const inputRow = document.createElement("tr");
  inputRow.innerHTML = `
    <td><input type="text" id="${containerId}_newCode" placeholder="Your Module Code"/></td>
    <td><input type="text" id="${containerId}_newName" placeholder="Your Module Name"/></td>
    <td><input type="number" id="${containerId}_newCredits" placeholder="Your Credits" min="1" max="6"/></td>
    <td>
      <select id="${containerId}_newGrade">
        <option value="">Select</option>
        ${generateGradeOptions()}
      </select>
    </td>
    <td><i class="fa fa-plus-square" onclick="addModule('${storageKey}', '${containerId}')"></i></td>
  `;
  tableBody.appendChild(inputRow);
}

function generateGradeOptions(selectedGrade = "") {
  const grades = [
    "A+",
    "A",
    "A-",
    "B+",
    "B",
    "B-",
    "C+",
    "C",
    "C-",
    "D+",
    "D",
    "E",
  ];
  return grades
    .map(
      (g) =>
        `<option value="${g}" ${
          g === selectedGrade ? "selected" : ""
        }>${g}</option>`
    )
    .join("");
}

//update module

function updateModule(key, index, field, value) {
  const modules = getStoredModules(key);
  modules[index][field] = value;
  saveModules(key, modules);
}

//delete module

function deleteModule(key, containerId, index) {
  const modules = getStoredModules(key);
  modules.splice(index, 1);
  saveModules(key, modules);
  renderTable(containerId, key);
}

//add module

function addModule(key, containerId) {
  const newModule = {
    code: document.getElementById(`${containerId}_newCode`).value.trim(),
    name: document.getElementById(`${containerId}_newName`).value.trim(),
    credits: document.getElementById(`${containerId}_newCredits`).value.trim(),
    grade: document.getElementById(`${containerId}_newGrade`).value,
  };

  if (
    !newModule.code ||
    !newModule.name ||
    !newModule.credits ||
    !newModule.grade
  ) {
    alert("Please fill all fields.");
    return;
  }

  const modules = getStoredModules(key);
  modules.push(newModule);
  saveModules(key, modules);
  renderTable(containerId, key);
}

//goto settings
const settingsBtn = document.getElementById("settings");
if (settingsBtn) {
  settingsBtn.onclick = () => (window.location.href = "settings.html");
}
//goto homepage
const saveBtn = document.getElementById("saveBtn");
if (saveBtn) {
  saveBtn.onclick = () => (window.location.href = "index.html");
}
//downlad gpa
function downloadEncryptedFile() {
  // Get data from localStorage
  const student = JSON.parse(localStorage.getItem("student") || "{}");
  const year_1_modules = JSON.parse(
    localStorage.getItem("year_1_modules") || "[]"
  );
  const year_2_modules = JSON.parse(
    localStorage.getItem("year_2_modules") || "[]"
  );
  const year_3_modules = JSON.parse(
    localStorage.getItem("year_3_modules") || "[]"
  );
  const year_4_modules = JSON.parse(
    localStorage.getItem("year_4_modules") || "[]"
  );
  const yearPercentages = JSON.parse(
    localStorage.getItem("yearPercentages") || "[]"
  );

  const dataToEncrypt = {
    student,
    year_1_modules,
    year_2_modules,
    year_3_modules,
    year_4_modules,
    yearPercentages,
  };

  // Encrypt
  const encrypted = CryptoJS.AES.encrypt(
    JSON.stringify(dataToEncrypt),
    secretKey
  ).toString();

  // Trigger download
  const blob = new Blob([encrypted], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "Your_data.gpa"; // file extension is optional
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

//decription
document.addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    const encrypted = e.target.result;
    let decrypted = "";

    try {
      decrypted = CryptoJS.AES.decrypt(encrypted, secretKey).toString(
        CryptoJS.enc.Utf8
      );
      if (!decrypted) throw new Error("Decryption returned empty string");

      const parsedData = JSON.parse(decrypted);

      // basic validation
      if (
        !parsedData.year_1_modules ||
        !Array.isArray(parsedData.year_1_modules)
      ) {
        throw new Error("Invalid modules structure");
      }

      // update localStorage
      localStorage.setItem("student", JSON.stringify(parsedData.student || {}));
      localStorage.setItem(
        "year_1_modules",
        JSON.stringify(parsedData.year_1_modules || [])
      );
      localStorage.setItem(
        "year_2_modules",
        JSON.stringify(parsedData.year_2_modules || [])
      );
      localStorage.setItem(
        "year_3_modules",
        JSON.stringify(parsedData.year_3_modules || [])
      );
      localStorage.setItem(
        "year_4_modules",
        JSON.stringify(parsedData.year_4_modules || [])
      );
      localStorage.setItem(
        "yearPercentages",
        JSON.stringify(parsedData.yearPercentages || [])
      );

      alert("✅ File successfully uploaded and decrypted!");
    } catch (err) {
      console.error("Decryption or parsing error:", err);
      alert("❌ Failed to decrypt or parse the file.");
      return; // skip rendering
    }

    // render outside catch block
    try {
      document.addEventListener("DOMContentLoaded", function () {
        renderTable("firstYear", "year_1_modules");
        renderTable("secondYear", "year_2_modules");
        renderTable("thirdYear", "year_3_modules");
        renderTable("finalYear", "year_4_modules");
      });
    } catch (tableError) {
      console.error("Error while rendering table:", tableError);
      alert("❗ Decryption was successful, but table rendering failed.");
    }
  };

  reader.readAsText(file);
});
