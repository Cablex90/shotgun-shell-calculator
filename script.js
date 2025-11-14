const mmSlider = document.getElementById('mmSlider');
const mmOutput = document.getElementById('mmOutput');
const countryDropdown = document.getElementById('countryDropdown');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const sliderTableBody = document.querySelector("#sliderTable tbody");

// mm-Werte
const mm = [
  "1,0","1,25","1,5","1,7","1,75","2,0","2,25","2,4","2,5","2,75","2,8","2,85","3,0",
  "3,25","3,5","3,65","3,75","4,0","4,25","4,5","4,75","5,0","5,25","5,5","5,75","6,0",
  "6,25","6,5","6,85","7,0","7,5","8,0","8,5","8,8","9,0","9,65","10"
];

const germany = [
  "","12","11","","10","","8","","7","6","","5","4","3","","2","1","0","0","2/0","3/0","4/0","5/0","6/0","","","","","","","","","","","","","Posten2","Posten1"
];

const usa = [
  "Dust","12","11","","10","9","8","7,5","7","","6","","5","4","3","","2","1","B","BB","BB","0","00","000","","Buck9","","Buck8","","","Buck7","Buck5","Buck4","Buck3","","Buck2","Buck1",""
];

const england = [
  "","Dust","12","11","10","9","8","7","6,5","5,5MG","5","4,5","4","3","2","1","B","BB","BBB","A = BBBB","","AA","AAA","SSSSSG","SSSSG","","","SSSG","","SSG","","Spec.SG","","SG","MG","LG","",""
];

const france = [
  "","12","11","","10","9","8","7","7","","","5","4","3","","2","1","0 oder 1","00","000","0000","C9","","C7 oder C8","","C5","C4","C3","C2","","","","","","","",""
];

const holland = [
  "","12","12","11","10","9","8","7","12","11","K6","","G6","","4 oder 5","","3","0 oder 1","00","","","","","","","","","","","","","",""
];

const austria = [
  "","12","11","10","10","9","8","7","7","7","6","6","5","4","4","3","2","1","0","BBB","BBBB","AA","AAA","SSSSSG","SSSSG","SSSSG","5P 5G","","SG/LG","","","",""
];

const sweden = [
  "","","","","","","","","1","2","","3","4","5","","6","","7","","8","","","","","","","","","","","","","","","",""
];

const switzerland = [
  "","","","","10","9","0","","8","KL6","","GR6","6","5","5","","4","2","1","0","2/0","3/0","4/0","","","","","","","","","","","","","",""
];

const belgium = [
  "","12","","","10","10","9","8","","7","","","6","5","4","","3","2","1","0","2/0","3/0","4/0","","","","","","","","","","","","",""
];

const lists = { austria, belgium, england, france, germany, holland, sweden, switzerland, usa };

// Startwert
let currentList = austria;

// --- Update Output ---
function updateMmOutput() {
  const idx = mmSlider.value;
  const sizeValue = currentList[idx] || "NA";
  mmOutput.textContent = `Size = mm: ${mm[idx]} | No: ${sizeValue}`;
}

// --- Update Tabelle ---
function updateSliderTable() {
  const idx = mmSlider.value;
  sliderTableBody.innerHTML = "";

  for (const countryName of Object.keys(lists)) {
    if (countryName === getCurrentCountryKey()) continue; // Ausgewähltes Land ausblenden

    const sizeValue = lists[countryName][idx] || "NA";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${capitalize(countryName)}</td>
      <td>${sizeValue}</td>
      <td>${mm[idx]}</td>
    `;
    sliderTableBody.appendChild(row);
  }
}

// --- Hilfsfunktionen ---
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getCurrentCountryKey() {
  return Array.from(dropdownItems).find(item => item.textContent === countryDropdown.textContent)?.getAttribute('data-country');
}

// --- Events ---
mmSlider.addEventListener('input', () => {
  updateMmOutput();
  updateSliderTable();
});

dropdownItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    countryDropdown.textContent = item.textContent;
    currentList = lists[item.getAttribute('data-country')];
    updateMmOutput();
    updateSliderTable();
  });
});

// --- Initialisierung ---
countryDropdown.textContent = "Austria";
mmSlider.max = mm.length - 1;
mmSlider.value = 0;
updateMmOutput();
updateSliderTable();
