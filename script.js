const mmSlider = document.getElementById('mmSlider');
const mmOutput = document.getElementById('mmOutput');
const countryDropdown = document.getElementById('countryDropdown');
const dropdownItems = document.querySelectorAll('.dropdown-item');
const sliderTableBody = document.querySelector("#sliderTable tbody");

// mm-Werte
const mm = [
  "1,0","1,25","1,5","1,7","1,75","2,0","2,25","2,4","2,5",
  "2,75","2,8","2,85","3,0","3,25","3,5","3,65","3,75","4,0",
  "4,25","4,5","4,75","5,0","5,25","5,5","5,75","6,0","6,25",
  "6,5","6,85","7,0","7,5","8,0","8,5","8,8","9,0","9,65","10"
];

// Länder-Listen
const austria = ["","","","","","15","14","13","12","11","","10","9","8","5","","7","6","5","","","","","","","","","","","","","","","","",""];
const belgium = ["","","","10","10","9","8","","7","","","","6","5","4","","3","2","1","0","2/0","3/0","4/0","","","","","","","","","","","","",""];
const england = ["","Dust","12","11","10","9","8","7","6,5","5,5MG","5","4,5","4","3","2","1","B","BB","BBB","A = BBBB","","AA","AAA","SSSSSG","SSSSG","","","SSSG","","SSG","","Spec.SG","","SG","MG","LG",""];
const france = ["","12","11","","10","9","8","7","7","","","","5","4","3","","2","1","0 oder 1","00","000","0000","C9"," ","C7 oder C8"," "," ","C5","C4","C3","C2","","",""];
const germany = ["","12","11","","10","","8","","7","6","","5","4","3","","2","1","0","2/0","3/0","4/0","5/0","6/0","","","Posten6","","Posten5","","","Posten4","","Posten3","","","Posten2","","Posten1"];
const holland = ["","12","12","11","10","9","8","7","12","11","K6","","G6","","4 oder 5","","3","0 oder 1","00","","","","","","","","","","","","","",""];
const sweden = ["","","","","","","","","1","2","","3","4","5","","6","","7","","8","","","","","","","","","","","","","","","",""];
const switzerland = ["","","","","10","9","0","","8","KL6","","GR6","6","5","5","","4","2","1","0","2/0","3/0","4/0","","","","","","","","","","","","","",""];
const usa = ["Dust","12","11","","10","9","8","7,5","7","","6","","5","4","3","","2","1","B","BB","BB","0","00","000","","Buck9","","Buck8","","","Buck7","Buck5","Buck4","Buck3","","Buck2","Buck1"];

const lists = { austria, belgium, england, france, germany, holland, sweden, switzerland, usa };

// Startwert
let currentList = austria;

// Update Output
function updateMmOutput() {
  const idx = mmSlider.value;
  const sizeValue = currentList[idx] || "NA";
  mmOutput.textContent = `mm: ${mm[idx]} | Size: ${sizeValue}`;
}

// Update Tabelle
function updateSliderTable() {
  const idx = mmSlider.value;
  sliderTableBody.innerHTML = "";

  const selectedCountry = countryDropdown.textContent.toLowerCase();

  for (const countryName of Object.keys(lists)) {
    if (countryName === selectedCountry) continue; // Ausgewähltes Land ausblenden
    const sizeValue = lists[countryName][idx] || "NA";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${countryName.charAt(0).toUpperCase() + countryName.slice(1)}</td>
      <td>${sizeValue}</td>
      <td>${mm[idx]}</td>
    `;
    sliderTableBody.appendChild(row);
  }
}

// Events
mmSlider.addEventListener('input', () => {
  updateMmOutput();
  updateSliderTable();
});

dropdownItems.forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    const country = item.getAttribute('data-country');
    countryDropdown.textContent = item.textContent; 
    currentList = lists[country];
    updateMmOutput();
    updateSliderTable();
  });
});

// Initialisierung
countryDropdown.textContent = "Austria";
mmSlider.max = mm.length - 1;
mmSlider.value = 0;
updateMmOutput();
updateSliderTable();
