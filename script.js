document.addEventListener('DOMContentLoaded', () => {

  /* ------------------- MM-Slider + Länder-Tabelle ------------------- */
  const mmSlider = document.getElementById('mmSlider');
  const mmOutput = document.getElementById('mmOutput');
  const countryDropdown = document.getElementById('countryDropdown');
  const sliderTableBody = document.querySelector("#sliderTable tbody");

  const mm = [
    1.00,1.25,1.50,1.75,2.00,2.15,2.25,2.40,2.50,2.75,3.00,3.25,3.50,3.75,4.00,
    4.25,4.50,4.75,5.00,5.25,5.50,5.75,6.00,6.25,6.50,6.75,7.00,7.25,7.50,7.75,
    8.00,8.25,8.50,8.75,9.00,9.25,9.50,9.75,10.00
  ];

  const eu = ['Dust','12','11','10','9','8.5','8','7.5','7','6','5','4','3','2','1','0','2/0','3/0','4/0','5/0','6/0','6/0','Posten 6','Posten 6','Posten 5','Posten 5','Posten 4','Posten 4','Posten 4','Posten 4','Posten 3','Posten 3','Posten 3','Posten 3','Posten 2','Posten 2','Posten 2','Posten 2','Posten 1'];
  const uk = ['Dust','12','11','10','9','8.5','8','7','6','5','4','3','2','1','B','BB','BBB','A','AA','AAA','SSSSSG','SSSSG','SSSSG','SSSG','SSSG','SSG','SSG','SSG','Special SG','Special SG','Special SG','Special SG','SG','MG','LG','LG','LG','LG','LG'];
  const us = ['Dust','12','11','10','9','8.5','8','7.5','7','6','5','4','3','2','1','B','BB','BBB','T','TT','F','FF','Nr. 4','Nr. 4','Nr. 3','Nr. 3','Nr. 2','Nr. 2','Nr. 1','Nr. 1','0','0','00','00','00','000','000','000','000'];
  const italy = ['Dust','13','12','11','10','9','8','7','6','5','4','3','2','1','0','2/0','3/0','4/0','5/0','5/0','6/0','6/0','6/0','7/0','7/0','8/0','8/0','8/0','9/0','9/0','10/0','10/0','11/0','11/0','11/0','NA','NA','NA','NA'];

  const lists = { eu, uk, us, italy };
  let currentCountry = 'eu';
  let currentList = lists[currentCountry];

  function formatCountryName(key) { return key === 'italy' ? 'Italy' : key.toUpperCase(); }

  function updateMmOutput() {
    const idx = mmSlider.value;
    const sizeValue = currentList[idx] || "NA";
    mmOutput.textContent = `Size: ${mm[idx]} mm | No. ${sizeValue}`;
  }

  function updateSliderTable() {
    const idx = mmSlider.value;
    sliderTableBody.innerHTML = "";
    for (const countryName of Object.keys(lists)) {
      if (countryName === currentCountry) continue;
      const sizeValue = lists[countryName][idx] || "NA";
      const row = document.createElement("tr");
      row.innerHTML = `<td>${formatCountryName(countryName)}</td><td>${sizeValue}</td><td>${mm[idx]}</td>`;
      sliderTableBody.appendChild(row);
    }
  }

  mmSlider.addEventListener('input', () => {
    updateMmOutput();
    updateSliderTable();
    updateAll();
  });

  document.querySelectorAll('.dropdown-item[data-country]').forEach(item=>{
    item.addEventListener('click', e=>{
      e.preventDefault();
      const selected = item.dataset.country;
      currentCountry = selected;
      currentList = lists[selected];
      countryDropdown.textContent = item.textContent;
      updateMmOutput();
      updateSliderTable();
      updateAll();
    });
  });

  /* ------------------- Load & Material ------------------- */
  const loadSlider = document.getElementById("loadSlider");
  const speedSlider = document.getElementById("speedSlider");
  const loadOutput = document.getElementById("loadOutput");
  const speedOutput = document.getElementById("speedOutput");
  const loadTableBody = document.querySelector("#loadTable tbody");
  const totalEnergyDisplay = document.getElementById("totalEnergyDisplay");

  const loadValues = [24,28,30,32,36,40,52,63];
  const materials = ["Lead","Steel","Copper","Bismuth","Tungsten"];
  const densities = { Lead:11.34, Steel:7.85, Copper:8.96, Bismuth:9.78, Tungsten:19.25 };

  function calcPellets(mmSize, loadGrams, material){
    const r_cm = mmSize/2/10;
    const vol_cm3 = (4/3)*Math.PI*Math.pow(r_cm,3);
    const mass_per_pellet = vol_cm3*densities[material];
    return Math.floor(loadGrams/mass_per_pellet);
  }

  function calcTotalEnergy(load_g, velocity_m_s){
      const mass_kg = load_g / 1000;
      return 0.5 * mass_kg * velocity_m_s * velocity_m_s;
  }

  function updateLoadOutput() {
    const load_g = loadValues[loadSlider.value];
    const v = parseInt(speedSlider.value);
    const shot_mm = mm[mmSlider.value];

    loadOutput.textContent = `Load: ${load_g} g`;
    speedOutput.textContent = `Speed: ${v} m/s`;

    const totalE = calcTotalEnergy(load_g,v);
    totalEnergyDisplay.textContent = `Total Energy: ${totalE.toFixed(1)} J`;

    let html = "";
    materials.forEach(mat=>{
      const count = calcPellets(shot_mm, load_g, mat);
      const energyPerPellet = totalE / count;
      html += `<tr><td>${mat}</td><td>${count}</td><td>${energyPerPellet.toFixed(1)} J</td></tr>`;
    });
    loadTableBody.innerHTML = html;
  }

  loadSlider.addEventListener('input', updateAll);
  speedSlider.addEventListener('input', updateLoadOutput);

  /* ------------------- Pattern Simulator ------------------- */
  const materialDropdown = document.getElementById("materialDropdown");
  const animalDropdown = document.getElementById("animalDropdown");
  const chokeDropdown = document.getElementById("chokeDropdown");
  const animalImage = document.getElementById("animalImage");
  const pelletGroup = document.getElementById("pelletGroup");
  const chokeRing = document.getElementById("chokeRing");
  const distanceSlider = document.getElementById("distanceSlider");
  const distanceLabel = document.getElementById("distanceLabel");

  const materialColor = { Lead:"#ffee55",Steel:"#3737ffff",Copper:"#ff8800",Bismuth:"#55ffaa",Tungsten:"#521dffff" };
  const chokeFactor = { Cylinder:1, IC:0.85, Modified:0.65, Full:0.5 };
  const animalScale = { pheasant:0.3, pigeon:0.2, crow:0.25, goose:0.5, duck:0.35, fox:1, coyote:0.7, golden_jackal:0.65, hare:0.4, rabbit:0.3, squirrel:0.15 };

  let selectedMaterial = "Lead";
  let selectedAnimal = "img/pheasant.png";
  let selectedChoke = "Cylinder";

  document.querySelectorAll('.dropdown-item[data-material]').forEach(item=>{
    item.addEventListener('click', e=>{
      e.preventDefault();
      selectedMaterial = item.dataset.material;
      materialDropdown.textContent = item.textContent;
      updateAll();
    });
  });

  document.querySelectorAll('.dropdown-item[data-animal]').forEach(item=>{
    item.addEventListener('click', e=>{
      e.preventDefault();
      selectedAnimal = item.dataset.animal;
      animalDropdown.textContent = item.textContent;
      updateAll();
    });
  });

  document.querySelectorAll('.dropdown-item[data-choke]').forEach(item=>{
    item.addEventListener('click', e=>{
      e.preventDefault();
      selectedChoke = item.dataset.choke;
      chokeDropdown.textContent = item.textContent;
      updateAll();
    });
  });

  distanceSlider.addEventListener('input', updateAll);

  function updateAnimalImage(){
    const name = selectedAnimal.split("/").pop().replace(".png","").toLowerCase();
    const baseScale = animalScale[name]||0.3;
    const scale = baseScale * Math.min(1,10/parseFloat(distanceSlider.value));
    const size = 330 * scale;
    const offset = (330-size)/2;
    animalImage.setAttribute("width", size);
    animalImage.setAttribute("height", size);
    animalImage.setAttribute("x", offset);
    animalImage.setAttribute("y", offset);
    animalImage.setAttribute("href", selectedAnimal);
  }

  function getPelletCount(){ 
    const row = Array.from(loadTableBody.children).find(r=>r.cells[0].textContent===selectedMaterial);
    return row ? parseInt(row.cells[1].textContent) : 50;
  }

  function generatePellets(){
    pelletGroup.innerHTML = "";
    const count = getPelletCount();
    const distance = parseFloat(distanceSlider.value);
    const chokeSpreadFactor = { Cylinder:4, IC:3, Modified:2.5, Full:2 };
    const maxSpread = distance*2.5*chokeFactor[selectedChoke]*chokeSpreadFactor[selectedChoke];
    const zoneFractions = [0.18,0.15,0.15,0.25,0.3,0.38];
    const zoneOffsets = [0,0.18,0.33,0.48,0.63,0.81];
    const zoneProb = [0.25,0.25,0.25,0.15,0.08,0.02];

    function pickZone(){ let r=Math.random(),sum=0; for(let i=0;i<zoneProb.length;i++){ sum+=zoneProb[i]; if(r<sum) return i; } return zoneProb.length-1; }

    for(let i=0;i<count;i++){
      const angle=Math.random()*2*Math.PI;
      const zone=pickZone();
      let radius = zone<=2 ? maxSpread*zoneOffsets[zone]+Math.sqrt(Math.random())*maxSpread*zoneFractions[zone]
                            : maxSpread*zoneOffsets[zone]+Math.random()*maxSpread*zoneFractions[zone];
      const x=165+radius*Math.cos(angle);
      const y=165+radius*Math.sin(angle);
      const pellet=document.createElementNS("http://www.w3.org/2000/svg","circle");
      pellet.setAttribute("cx",x);
      pellet.setAttribute("cy",y);
      pellet.setAttribute("r",2);
      pellet.setAttribute("fill",materialColor[selectedMaterial]);
      pelletGroup.appendChild(pellet);
    }
  }

  function updateChokeRing(){
    const distance = parseFloat(distanceSlider.value);
    const maxSpread = distance*2.5*chokeFactor[selectedChoke];
    const radius = maxSpread*0.34;
    chokeRing.setAttribute("r",radius);
    chokeRing.setAttribute("stroke","#f00d0dff");
    chokeRing.setAttribute("stroke-width",2);
    chokeRing.setAttribute("fill","none");
    generatePellets();
  }

  function updateAll(){
    distanceLabel.textContent = distanceSlider.value+" m";
    updateAnimalImage();
    updateChokeRing();
    updateLoadOutput();
  }

  /* Initialwerte */
  mmSlider.value = mm.findIndex(v=>v===2.75);
  loadSlider.value = loadValues.indexOf(32);
  speedSlider.value = 400;
  distanceSlider.value = 30;

  updateMmOutput();
  updateSliderTable();
  updateAll();
  generatePellets();
});
