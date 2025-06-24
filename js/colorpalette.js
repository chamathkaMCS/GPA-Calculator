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
