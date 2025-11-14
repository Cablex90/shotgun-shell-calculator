/* ------------------- mm-Slider + Länder-Tabelle ------------------- */
const mmSlider = document.getElementById('mmSlider');
const mmOutput = document.getElementById('mmOutput');
const countryDropdown = document.getElementById('countryDropdown');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const sliderTableBody = document.querySelector("#sliderTable tbody");

// mm Daten
const mm = [
  1.00,1.25,1.50,1.75,2.00,2.15,2.25,2.40,2.50,2.75,3.00,3.25,3.50,3.75,4.00,
  4.25,4.50,4.75,5.00,5.25,5.50,5.75,6.00,6.25,6.50,6.75,7.00,7.25,7.50,7.75,
  8.00,8.25,8.50,8.75,9.00,9.25,9.50,9.75,10.00
];

const eu = ['Dust','12','11','10','9','8.5','8','7.5','7','6','5','4','3','2','1','0',
  '2/0','3/0','4/0','5/0','6/0','6/0','Posten 6','Posten 6','Posten 5','Posten 5',
  'Posten 4','Posten 4','Posten 4','Posten 4','Posten 3','Posten 3','Posten 3','Posten 3',
  'Posten 2','Posten 2','Posten 2','Posten 2','Posten 1'];
const uk = ['Dust','12','11','10','9','8.5','8','7','6','5','4','3','2','1','B','BB','BBB',
  'A','AA','AAA','SSSSSG','SSSSG','SSSSG','SSSG','SSSG','SSG','SSG','SSG',
  'Special SG','Special SG','Special SG','Special SG','SG','MG','LG','LG',
  'LG','LG','LG'];
const us = ['Dust','12','11','10','9','8.5','8','7.5','7','6','5','4','3','2','1','B','BB',
  'BBB','T','TT','F','FF','Nr. 4','Nr. 4','Nr. 3','Nr. 3','Nr. 2','Nr. 2',
  'Nr. 1','Nr. 1','0','0','00','00','00','000','000','000','000'];
const italy = ['Dust','13','12','11','10','9','8','7','6','5','4','3','2','1','0','2/0','3/0',
  '4/0','5/0','5/0','6/0','6/0','6/0','7/0','7/0','8/0','8/0','8/0','9/0','9/0',
  '10/0','10/0','11/0','11/0','11/0','NA','NA','NA','NA'];

const lists = { mm, eu, uk, us, italy };
let currentList = eu;
let currentCountry = "eu";

function formatCountryName(key) {
  if (key === "italy") return "Italy";
  return key.toUpperCase();
}

function updateMmOutput() {
  const idx = mmSlider.value;
  const sizeValue = currentList[idx] || "NA";
  mmOutput.textContent = `Size: ${mm[idx]} mm | No. ${sizeValue}`;
}

function updateSliderTable() {
  const idx = mmSlider.value;
  sliderTableBody.innerHTML = "";
  for (const countryName of Object.keys(lists)) {
    if (countryName === "mm" || countryName === currentCountry) continue;
    const sizeValue = lists[countryName][idx] || "NA";
    const row = document.createElement("tr");
    row.innerHTML = `<td>${formatCountryName(countryName)}</td><td>${sizeValue}</td><td>${mm[idx]}</td>`;
    sliderTableBody.appendChild(row);
  }
}

mmSlider.addEventListener('input', () => {
  updateMmOutput();
  updateSliderTable();
});

dropdownItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const selectedCountry = item.getAttribute('data-country');
    currentCountry = selectedCountry;
    currentList = lists[selectedCountry];
    countryDropdown.textContent = item.textContent;
    updateMmOutput();
    updateSliderTable();
  });
});

countryDropdown.textContent = "EU";
currentCountry = "eu";
mmSlider.max = mm.length - 1;
mmSlider.value = 0;
updateMmOutput();
updateSliderTable();

/* ------------------- Load Slider + Material-Tabelle ------------------- */
const loadSlider = document.getElementById("loadSlider");
const loadOutput = document.getElementById("loadOutput");
const speedSlider = document.getElementById("speedSlider");
const speedOutput = document.getElementById("speedOutput");
const loadTableBody = document.querySelector("#loadTable tbody");
const totalEnergyDisplay = document.getElementById("totalEnergyDisplay");

const materials = ["Lead","Steel","Copper","Bismuth","Tungsten"];
const densities = { Lead:11.34, Steel:7.85, Copper:8.96, Bismuth:9.78, Tungsten:19.25 };
const loadValues = ["24 g","28 g","30 g","32 g","36 g","40 g","52 g","63 g"];

// Pelletanzahl
function calcPellets(mmSize, loadGrams, material){
  const r_cm = mmSize/2/10;
  const vol_cm3 = (4/3)*Math.PI*Math.pow(r_cm,3);
  const mass_per_pellet = vol_cm3*densities[material];
  return Math.floor(loadGrams/mass_per_pellet);
}

// Total Energy
function calcTotalEnergy(load_g, velocity_m_s){
    const mass_kg = load_g / 1000;
    return 0.5 * mass_kg * velocity_m_s * velocity_m_s;
}

function updateLoadOutput() {
    const idx = loadSlider.value;
    const load_g = parseInt(loadValues[idx]);
    const shot_mm = mm[mmSlider.value];
    const v = parseInt(speedSlider.value);

    loadOutput.textContent = 'Load: ' + loadValues[idx];
    speedOutput.textContent = "Speed: "+ v + " m/s";

    const totalE = calcTotalEnergy(load_g, v);
    totalEnergyDisplay.textContent = `Total Energy: ${totalE.toFixed(1)} J`;

    let html = "";

    materials.forEach(mat => {
        const count = calcPellets(shot_mm, load_g, mat);
        const energyPerPellet = totalE / count;
        html += `<tr>
                    <td>${mat}</td>
                    <td>${count}</td>
                    <td>${energyPerPellet.toFixed(1)} J</td>
                 </tr>`;
    });

    loadTableBody.innerHTML = html;
}


loadSlider.addEventListener("input", updateLoadOutput);
mmSlider.addEventListener("input", updateLoadOutput);
speedSlider.addEventListener("input", updateLoadOutput);

// Initial
updateLoadOutput();
