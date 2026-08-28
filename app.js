const DATA_FILES = {
  suitability: "plant_suitability_2026_2030.csv",
  temperature: "forecast_temperature_2m_mean.csv",
  precipitation: "forecast_precipitation_sum.csv",
  plants: "cleaned_sinhala_plants.csv"
};

const CLINICAL_TAGS = {
  "Aegle marmelos": ["digestive"],
  "Terminalia chebula": ["digestive", "anti-inflammatory"],
  "Terminalia bellirica": ["digestive"],
  "Phyllanthus emblica": ["metabolic", "anti-inflammatory"],
  "Tinospora cordifolia": ["metabolic", "anti-inflammatory"],
  "Justicia adhatoda": ["respiratory"],
  "Andrographis paniculata": ["anti-inflammatory", "respiratory"],
  "Centella asiatica": ["wound-healing", "anti-inflammatory"],
  "Hemidesmus indicus": ["metabolic", "digestive"],
  "Asparagus racemosus": ["metabolic"],
  "Gymnema sylvestre": ["metabolic"],
  "Azadirachta indica": ["anti-inflammatory", "wound-healing"],
  "Piper longum": ["respiratory", "digestive"],
  "Tribulus terrestris": ["metabolic"],
  "Boerhavia diffusa": ["anti-inflammatory"],
  "Hygrophila auriculata": ["metabolic"],
  "Cassia fistula": ["digestive"],
  "Clitoria ternatea": ["anti-inflammatory"],
  "Murraya koenigii": ["digestive"],
  "Eclipta prostrata": ["wound-healing"]
};

const ZONE_POINTS = [
  { zone: "Wet", name: "Western Wet Belt", lat: 6.9271, lon: 79.8612 },
  { zone: "Dry", name: "North Central Dry Zone", lat: 8.3114, lon: 80.4037 },
  { zone: "Intermediate", name: "Kandy Intermediate", lat: 7.2906, lon: 80.6337 },
  { zone: "Coastal", name: "Southern Coastal", lat: 6.0328, lon: 80.2168 },
  { zone: "Upcountry", name: "Central Highlands", lat: 6.9497, lon: 80.7891 }
];

const state = {
  suitabilityRows: [],
  temperatureRows: [],
  precipitationRows: [],
  plantRows: [],
  year: "all",
  status: "all",
  zone: "all",
  clinical: "all",
  search: ""
};

const charts = {
  temperature: null,
  precipitation: null,
  suitability: null
};

const mapState = {
  map: null,
  layers: []
};

function parseCsv(text) {
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (value) => value.trim()
  });
  return result.data;
}

async function loadCsv(path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  const text = await response.text();
  return parseCsv(text);
}

function normalizeSuitability(rows) {
  return rows
    .map((row) => ({
      year: Number.parseInt(String(row.Year || "").trim(), 10),
      habitat: String(row.Habitat_Region || "").trim(),
      avgPrecip: Number.parseFloat(String(row.Avg_Daily_Precip || "0").trim()),
      status: String(row.Status || "").trim(),
      speciesCount: Number.parseInt(String(row.Plant_Species_Count || "0").trim(), 10)
    }))
    .filter((row) => Number.isFinite(row.year) && row.habitat && row.status);
}

function normalizeForecast(rows) {
  return rows
    .map((row) => ({
      date: String(row.ds || "").trim(),
      value: Number.parseFloat(String(row.yhat || "0").trim())
    }))
    .filter((row) => row.date && Number.isFinite(row.value));
}

function normalizePlants(rows) {
  return rows
    .map((row) => ({
      scientific: String(row["Scientific Name"] || "").trim(),
      sinhala: String(row["Sinhala Name"] || "").trim(),
      habitat1: String(row["Habitat/Region_1"] || "").trim(),
      habitat2: String(row["Habitat/Region_2"] || "").trim(),
      habitat3: String(row["Habitat/Region_3"] || "").trim(),
      endemic: String(row["Status (Endemic/Native)"] || "").trim().toLowerCase() === "endemic"
    }))
    .filter((row) => row.scientific);
}

function getYears() {
  return [...new Set(state.suitabilityRows.map((row) => row.year))].sort((a, b) => a - b);
}

function zoneFromHabitat(habitat) {
  const label = habitat.toLowerCase();
  if (label.includes("wet")) return "Wet";
  if (label.includes("dry")) return "Dry";
  if (label.includes("intermediate")) return "Intermediate";
  if (label.includes("coastal") || label.includes("lagoon") || label.includes("estuar")) return "Coastal";
  if (label.includes("upcountry") || label.includes("montane")) return "Upcountry";
  return "Other";
}

function withFilters(rows) {
  return rows.filter((row) => {
    const zone = zoneFromHabitat(row.habitat);
    const yearOk = state.year === "all" || row.year === Number.parseInt(state.year, 10);
    const statusOk = state.status === "all" || row.status === state.status;
    const zoneOk = state.zone === "all" || zone === state.zone;
    return yearOk && statusOk && zoneOk;
  });
}

function selectedYearRows() {
  const targetYear = state.year === "all" ? Math.max(...getYears()) : Number.parseInt(state.year, 10);
  return state.suitabilityRows.filter((row) => row.year === targetYear);
}

function aggregateSuitabilityByYear(rows) {
  const statuses = ["Suitable", "Likely Suitable", "Stable", "Unsuitable"];
  const years = [...new Set(rows.map((row) => row.year))].sort((a, b) => a - b);
  const series = statuses.map((status) => ({
    status,
    values: years.map(
      (year) => rows.filter((row) => row.year === year && row.status === status).length
    )
  }));
  return { years, series };
}

function monthlyAverage(rows) {
  const groups = new Map();
  for (const row of rows) {
    const month = row.date.slice(0, 7);
    if (!groups.has(month)) {
      groups.set(month, []);
    }
    groups.get(month).push(row.value);
  }
  return [...groups.entries()]
    .map(([month, values]) => ({
      month,
      avg: values.reduce((sum, value) => sum + value, 0) / values.length
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

function zoneSummaryForMap(rows) {
  const summary = new Map();
  for (const row of rows) {
    const zone = zoneFromHabitat(row.habitat);
    if (!summary.has(zone)) {
      summary.set(zone, {
        suitableCount: 0,
        totalCount: 0,
        species: 0
      });
    }
    const item = summary.get(zone);
    if (row.status === "Suitable" || row.status === "Likely Suitable") {
      item.suitableCount += 1;
    }
    item.totalCount += 1;
    item.species += row.speciesCount;
  }
  return summary;
}

function statusFromRatio(ratio) {
  if (ratio >= 0.55) return "healthy";
  if (ratio >= 0.35) return "mixed";
  return "risk";
}

function colorForZoneState(zoneState) {
  if (zoneState === "healthy") return "#0f9d58";
  if (zoneState === "mixed") return "#e67e22";
  return "#c0392b";
}

function updateKpis(filteredRows) {
  const speciesCount = new Set(state.plantRows.map((row) => row.scientific)).size;
  const years = getYears();
  const yearMin = Math.min(...years);
  const yearMax = Math.max(...years);

  const zoneStats = zoneSummaryForMap(selectedYearRows());
  let worstZone = "Not available";
  let worstRatio = 2;
  for (const [zone, stats] of zoneStats.entries()) {
    const ratio = stats.totalCount > 0 ? stats.suitableCount / stats.totalCount : 0;
    if (ratio < worstRatio) {
      worstRatio = ratio;
      worstZone = zone;
    }
  }

  const suitableShare =
    filteredRows.length > 0
      ? (filteredRows.filter((row) => row.status === "Suitable" || row.status === "Likely Suitable").length /
          filteredRows.length) *
        100
      : 0;

  document.getElementById("kpiSpecies").textContent = `${speciesCount}`;
  document.getElementById("kpiHorizon").textContent = `${yearMin} - ${yearMax}`;
  document.getElementById("kpiRiskZone").textContent = worstZone;
  document.getElementById("kpiSuitability").textContent = `${suitableShare.toFixed(1)}%`;
}

function initMap() {
  const isMobile = window.innerWidth < 768;
  const initialZoom = isMobile ? 6.5 : 7.2;

  mapState.map = L.map("sriLankaMap", {
    zoomControl: true,
    attributionControl: true,
    scrollWheelZoom: false
  }).setView([7.8731, 80.7718], initialZoom);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mapState.map);

  const legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    const div = L.DomUtil.create("div", "map-legend");
    div.innerHTML = `
      <h5>Suitability Pressure</h5>
      <div class="legend-item"><span class="legend-dot" style="background:#0f9d58;"></span> High Suitable (&ge;55%)</div>
      <div class="legend-item"><span class="legend-dot" style="background:#e67e22;"></span> Stable / Mixed (35-55%)</div>
      <div class="legend-item"><span class="legend-dot" style="background:#c0392b;"></span> High Risk (&lt;35%)</div>
    `;
    return div;
  };
  legend.addTo(mapState.map);

  // Invalidate size post initialization to ensure proper container bounds
  setTimeout(() => {
    if (mapState.map) {
      mapState.map.invalidateSize();
    }
  }, 250);
}

function redrawMap(filteredRows) {
  mapState.layers.forEach((layer) => layer.remove());
  mapState.layers = [];

  const summary = zoneSummaryForMap(filteredRows);

  for (const point of ZONE_POINTS) {
    const stats = summary.get(point.zone) || { suitableCount: 0, totalCount: 0, species: 0 };
    const ratio = stats.totalCount > 0 ? stats.suitableCount / stats.totalCount : 0;
    const zoneState = statusFromRatio(ratio);

    const radius = Math.max(8000, Math.sqrt(Math.max(stats.species, 1)) * 1600);
    const circle = L.circle([point.lat, point.lon], {
      radius,
      color: colorForZoneState(zoneState),
      fillColor: colorForZoneState(zoneState),
      fillOpacity: 0.24,
      weight: 2
    }).addTo(mapState.map);

    circle.bindPopup(
      `<strong>${point.name}</strong><br/>Zone: ${point.zone}<br/>Suitable share: ${(ratio * 100).toFixed(
        1
      )}%<br/>Species represented: ${stats.species}`
    );

    mapState.layers.push(circle);
  }
}

function drawForecastChart(canvasId, rows, label, color) {
  const monthly = monthlyAverage(rows).filter((entry) => entry.month >= "2026-01");
  const labels = monthly.map((entry) => entry.month);
  const values = monthly.map((entry) => Number(entry.avg.toFixed(2)));

  if (charts[canvasId]) {
    charts[canvasId].destroy();
  }

  const maxTicks = window.innerWidth < 768 ? 5 : 8;

  charts[canvasId] = new Chart(document.getElementById(canvasId), {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label,
          data: values,
          borderColor: color,
          backgroundColor: `${color}22`,
          borderWidth: 2,
          tension: 0.32,
          fill: true,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { maxTicksLimit: maxTicks }
        },
        y: {
          ticks: { maxTicksLimit: 4 }
        }
      }
    }
  });
}

function drawSuitabilityChart(rows) {
  const aggregated = aggregateSuitabilityByYear(rows);

  if (charts.suitability) {
    charts.suitability.destroy();
  }

  const colors = {
    Suitable: "#0f9d58",
    "Likely Suitable": "#55b987",
    Stable: "#e67e22",
    Unsuitable: "#c0392b"
  };

  charts.suitability = new Chart(document.getElementById("suitabilityChart"), {
    type: "bar",
    data: {
      labels: aggregated.years,
      datasets: aggregated.series.map((series) => ({
        label: series.status,
        data: series.values,
        backgroundColor: colors[series.status],
        borderWidth: 0,
        borderRadius: 6
      }))
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      },
      scales: {
        x: { stacked: true },
        y: { stacked: true, beginAtZero: true }
      }
    }
  });
}

function chosenClinicalTag(scientificName) {
  const tags = CLINICAL_TAGS[scientificName] || [];
  const tag =
    state.clinical === "all"
      ? tags[0] || "general"
      : tags.includes(state.clinical)
      ? state.clinical
      : "general";
  const tagClass = `tag-${tag.toLowerCase().replace(/\s+/g, "-")}`;
  return `<span class="clinical-pill ${tagClass}">${tag}</span>`;
}

function statusBadgeClass(status) {
  const normalized = status.toLowerCase();
  if (normalized.includes("unsuitable")) return "status-pill status-risk";
  if (normalized.includes("suitable")) return "status-pill status-suitable";
  return "status-pill status-stable";
}

function rowStatusForYear(primaryHabitat) {
  const targetYear = state.year === "all" ? Math.max(...getYears()) : Number.parseInt(state.year, 10);
  const hit = state.suitabilityRows.find(
    (row) => row.year === targetYear && row.habitat.toLowerCase().includes(primaryHabitat.toLowerCase())
  );
  return hit ? hit.status : "No match";
}

function filteredPlants() {
  return state.plantRows.filter((row) => {
    const zone = zoneFromHabitat(row.habitat1);
    const searchTerm = state.search.trim().toLowerCase();
    const nameMatch =
      !searchTerm ||
      row.scientific.toLowerCase().includes(searchTerm) ||
      row.sinhala.toLowerCase().includes(searchTerm);

    const zoneMatch = state.zone === "all" || zone === state.zone;

    const clinicalList = CLINICAL_TAGS[row.scientific] || [];
    const clinicalMatch = state.clinical === "all" || clinicalList.includes(state.clinical);

    return nameMatch && zoneMatch && clinicalMatch;
  });
}

const BOTANICAL_DETAILS = {
  "Aegle marmelos": { family: "Rutaceae", endemic: false, parts: "Fruit, Leaves, Bark", formulations: "Beli Mal Peyawa, Sharbat", note: "High tolerance to dry spell spikes; vital for gastrointestinal Ayurvedic preparations." },
  "Terminalia chebula": { family: "Combretaceae", endemic: false, parts: "Dried Fruit", formulations: "Triphala Churna, Arishta", note: "Key component of Triphala formulation; requires monitored rainwater harvesting in dry belt." },
  "Terminalia bellirica": { family: "Combretaceae", endemic: false, parts: "Fruit pericarp", formulations: "Triphala, Kaphaja Kashaya", note: "Susceptible to severe dry zone precipitation drop; priority for botanical ex-situ collection." },
  "Phyllanthus emblica": { family: "Phyllanthaceae", endemic: false, parts: "Fresh & Dried Fruit", formulations: "Chyawanprash, Nelli Rasayana", note: "Rich in natural Vitamin C; thrives in intermediate montane slopes." },
  "Tinospora cordifolia": { family: "Menispermaceae", endemic: false, parts: "Stem juice, Leaves", formulations: "Rasakinda Kashaya, Amritarishta", note: "Immunomodulatory climbing shrub; resilient across wet and intermediate zones." },
  "Justicia adhatoda": { family: "Acanthaceae", endemic: false, parts: "Leaves, Roots", formulations: "Adhatoda Syrup, Pawatta Kasaya", note: "Crucial for Ayurvedic bronchodilator decoctions; highly stable across Sri Lankan wet belt." },
  "Andrographis paniculata": { family: "Acanthaceae", endemic: false, parts: "Whole plant", formulations: "Heen Nabinna Churna, Nilavembu", note: "Potent anti-pyretic and anti-viral plant; requires warm intermediate zone microclimates." },
  "Centella asiatica": { family: "Apiaceae", endemic: false, parts: "Leaves & Stems", formulations: "Gotukola Kanda, Medhya Rasayana", note: "Wound healing & cognitive tonic; vulnerable to wetland drying trends." },
  "Hemidesmus indicus": { family: "Apocynaceae", endemic: false, parts: "Roots", formulations: "Iramusu Tea, Sariba Syrup", note: "Popular cooling herbal infusion; moderately resilient to soil moisture drops." },
  "Asparagus racemosus": { family: "Asparagaceae", endemic: false, parts: "Tuberous Roots", formulations: "Shatavari Ghrita, Rasayana", note: "Vigorous climber; essential for reproductive health and metabolic vitality." }
};

function showToast(message) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast-msg";
  toast.innerHTML = `<span>🌱</span> <span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2600);
}

function openPlantModal(scientificName) {
  try {
    const cleanName = (scientificName || "").trim();
    const plant = state.plantRows.find(
      (p) => p.scientific.toLowerCase() === cleanName.toLowerCase()
    ) || {
      scientific: cleanName,
      sinhala: "",
      habitat1: "Dry Zone"
    };

    // Trigger visual toast popup message on row click
    const displayName = plant.sinhala ? `${plant.scientific} (${plant.sinhala})` : plant.scientific;
    showToast(`Opening profile for ${displayName}...`);

    const details = BOTANICAL_DETAILS[cleanName] ||
      BOTANICAL_DETAILS[plant.scientific] || {
        family: "Fabaceae / Native",
        endemic: false,
        parts: "Leaves, Roots & Bark",
        formulations: "Ayurvedic Kashaya, Herbal Tea",
        note: "Valuable traditional medicinal plant requiring active habitat preservation and climate monitoring."
      };

    const modal = document.getElementById("plantModal");
    if (!modal) return;

    const nameEl = document.getElementById("modalScientificName");
    const sinhalaEl = document.getElementById("modalSinhalaName");
    const endemicBadge = document.getElementById("modalEndemicBadge");
    const familyEl = document.getElementById("modalFamily");
    const zoneEl = document.getElementById("modalZone");
    const partsEl = document.getElementById("modalParts");
    const formulationsEl = document.getElementById("modalFormulations");
    const noteEl = document.getElementById("modalConservationNote");

    if (nameEl) nameEl.textContent = plant.scientific;
    if (sinhalaEl) sinhalaEl.textContent = plant.sinhala ? `(${plant.sinhala})` : "";

    if (endemicBadge) {
      endemicBadge.textContent = plant.endemic ? "Endemic Species" : "Native Sri Lanka";
      endemicBadge.className = plant.endemic ? "badge badge-endemic" : "badge badge-native";
    }

    if (familyEl) familyEl.textContent = details.family;
    if (zoneEl) zoneEl.textContent = plant.habitat1 || "Sri Lanka Eco-Zone";
    if (partsEl) partsEl.textContent = details.parts;
    if (formulationsEl) formulationsEl.textContent = details.formulations;
    if (noteEl) noteEl.textContent = details.note;

    const years = getYears();
    const yearContainer = document.getElementById("modalYearList");
    const targetHabitat = (plant.habitat1 || plant.habitat2 || "").trim();
    const zoneKeyword = targetHabitat ? targetHabitat.split(/[\s,]+/)[0].toLowerCase() : "";

    if (yearContainer) {
      yearContainer.innerHTML = years
        .map((yr) => {
          const hit = state.suitabilityRows.find(
            (r) =>
              r.year === yr &&
              zoneKeyword &&
              r.habitat.toLowerCase().includes(zoneKeyword)
          );
          const status = hit ? hit.status : "Stable";
          return `
            <div class="year-horizon-row">
              <span>Year ${yr}</span>
              <span class="${statusBadgeClass(status)}">${status}</span>
            </div>
          `;
        })
        .join("");
    }

    modal.classList.add("active");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  } catch (err) {
    console.error("Error opening plant modal:", err);
  }
}

function closePlantModal() {
  const modal = document.getElementById("plantModal");
  if (!modal) return;
  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function updatePlantTable() {
  const tableBody = document.getElementById("plantTableBody");
  const plants = filteredPlants().slice(0, 80);

  if (plants.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="5">No plants match the current filter combination.</td></tr>';
    return;
  }

  tableBody.innerHTML = plants
    .map((plant) => {
      const clinical = chosenClinicalTag(plant.scientific);
      const status = rowStatusForYear(plant.habitat1 || plant.habitat2 || plant.habitat3 || "");
      const safeName = plant.scientific.replace(/"/g, "&quot;");
      return `
        <tr data-plant="${safeName}">
          <td><strong>${plant.scientific}</strong></td>
          <td>${plant.sinhala || "-"}</td>
          <td>${plant.habitat1 || "-"}</td>
          <td>${clinical}</td>
          <td><span class="${statusBadgeClass(status)}">${status}</span></td>
        </tr>
      `;
    })
    .join("");
}

function districtToZone(district) {
  const d = district.toLowerCase();
  if (d.includes("anuradhapura") || d.includes("hambantota") || d.includes("jaffna")) return "Dry";
  if (d.includes("kandy") || d.includes("kurunegala") || d.includes("badulla")) return "Intermediate";
  if (d.includes("colombo") || d.includes("galle") || d.includes("ratnapura")) return "Wet";
  if (d.includes("nuwara eliya")) return "Upcountry";
  return "Intermediate";
}

function generateCropTip(plant, district, soil, water) {
  const name = plant.scientific;
  if (name.includes("Aegle")) return `High tolerance for ${district}'s dry season. Thrives in ${soil} with minimal supplemental irrigation.`;
  if (name.includes("Terminalia")) return `Excellent commercial market value for Triphala processing. Benefits from ${water === "rainfed" ? "monsoon rainwater storage" : "drip irrigation"}.`;
  if (name.includes("Phyllanthus")) return `Rich Vitamin C source. Performs best in ${soil} with moderate moisture preservation.`;
  if (name.includes("Tinospora")) return `High resilience climbing shrub. Highly adaptable in ${district} home gardens.`;
  if (name.includes("Centella")) return `Requires steady soil moisture. Ideal for ${water === "rainfed" ? "shaded wetland plots" : "drip-irrigated beds"}.`;
  if (name.includes("Justicia")) return `Vigorous Ayurvedic bronchodilator herb. Stable yield across ${district} agro-climatic zones.`;
  if (plant.endemic) return `Endemic to Sri Lanka — priority conservation species. Well-suited for protected cultivation in ${district}.`;
  return `Strong 2026–2030 climate stability match for ${district}. Suitable for ${soil} conditions.`;
}

function runCultivationSimulator() {
  const district = document.getElementById("simDistrict").value;
  const soil = document.getElementById("simSoil").value;
  const water = document.getElementById("simWater").value;
  const goal = document.getElementById("simGoal").value;

  const targetZone = districtToZone(district);
  const plants = state.plantRows;

  if (!plants || plants.length === 0) {
    showToast("Plant data not yet loaded. Please refresh the page.");
    return;
  }

  const years = getYears();
  const latestYear = years.length > 0 ? Math.max(...years) : null;
  const zoneSuitRow = latestYear
    ? state.suitabilityRows.find((r) => r.year === latestYear && zoneFromHabitat(r.habitat) === targetZone)
    : null;
  const zoneSuitStatus = zoneSuitRow ? zoneSuitRow.status : "Stable";

  const soilBonus = { Alluvial: 7, Latosols: 5, Podzolic: 3, Regosols: 1 };

  const scored = plants.map((plant) => {
    let score = 40;
    const zone1 = zoneFromHabitat(plant.habitat1 || "");
    const zone2 = zoneFromHabitat(plant.habitat2 || "");
    const zone3 = zoneFromHabitat(plant.habitat3 || "");

    // Zone match (0-25 points) — check all habitat columns
    if (zone1 === targetZone) score += 25;
    else if (zone2 === targetZone || zone3 === targetZone) score += 18;
    else if ([zone1, zone2, zone3].includes("Intermediate") || targetZone === "Intermediate") score += 10;

    // Forecast suitability bonus for matching zone (0-15 points)
    if (zone1 === targetZone) {
      if (zoneSuitStatus === "Suitable") score += 15;
      else if (zoneSuitStatus === "Likely Suitable") score += 10;
      else if (zoneSuitStatus === "Stable") score += 5;
    }

    // Water access (3-8 points)
    if (water === "reservoir") score += 8;
    else if (water === "irrigation") score += 6;
    else score += 3;

    // Soil type (1-7 points)
    score += soilBonus[soil] || 3;

    // Goal-specific scoring (0-12 points)
    const details = BOTANICAL_DETAILS[plant.scientific];
    if (goal === "conservation") {
      if (plant.endemic) score += 12;
      else score += 4;
    } else if (goal === "commercial") {
      if (details && details.formulations) score += 12;
      else score += 3;
    } else if (goal === "ayurvedic") {
      if (details) score += 10;
      else score += 2;
    }

    // Random jitter (±5) applied after all bonuses
    score += Math.floor(Math.random() * 11) - 5;
    score = Math.max(35, Math.min(99, score));

    return {
      plant,
      score,
      tip: generateCropTip(plant, district, soil, water)
    };
  });

  // Sort descending by score and pick top 4
  scored.sort((a, b) => b.score - a.score);
  const top4 = scored.slice(0, 4);

  const container = document.getElementById("quizResultsContainer");
  const grid = document.getElementById("quizResultsGrid");
  const districtTitle = document.getElementById("resDistrictName");

  if (districtTitle) districtTitle.textContent = district;

  if (grid) {
    grid.innerHTML = top4
      .map(({ plant, score, tip }) => {
        const safeName = plant.scientific.replace(/"/g, "&quot;");
        return `
          <div class="crop-card" data-plant="${safeName}">
            <div class="crop-card-head">
              <div>
                <h5>${plant.scientific}</h5>
                <small>${plant.sinhala || "Native Herb"}</small>
              </div>
              <span class="match-badge">${score}% Match</span>
            </div>

            <div class="score-progress-wrap">
              <div class="score-progress-label">
                <span>Climate Stability Score</span>
                <span>${score}/100</span>
              </div>
              <div class="score-progress-bar">
                <div class="score-progress-fill" style="width: ${score}%;"></div>
              </div>
            </div>

            <div class="crop-card-tip">
              💡 ${tip}
            </div>
          </div>
        `;
      })
      .join("");

    // Bind click to open Botanical Profile Modal
    grid.querySelectorAll(".crop-card").forEach((card) => {
      card.addEventListener("click", () => {
        const name = card.getAttribute("data-plant");
        if (name) openPlantModal(name);
      });
    });
  }

  if (container) {
    container.style.display = "block";
    container.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  showToast(`Simulator generated recommendations for ${district}!`);
}

function updateDashboard() {
  const filteredRows = withFilters(state.suitabilityRows);
  updateKpis(filteredRows);
  redrawMap(filteredRows.length ? filteredRows : selectedYearRows());
  drawSuitabilityChart(filteredRows.length ? filteredRows : state.suitabilityRows);
  updatePlantTable();
}

function initYearFilter() {
  const yearFilter = document.getElementById("yearFilter");
  const years = getYears();
  yearFilter.innerHTML = `<option value="all">All (${Math.min(...years)}-${Math.max(...years)})</option>`;
  years.forEach((year) => {
    yearFilter.innerHTML += `<option value="${year}">${year}</option>`;
  });
}

function registerEvents() {
  const mobileTabs = document.querySelectorAll(".mobile-tab");
  mobileTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      mobileTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      if (mapState.map && tab.getAttribute("href") === "#sriLankaMap") {
        setTimeout(() => mapState.map.invalidateSize(), 150);
      }
    });
  });

  const runSimBtn = document.getElementById("runSimulatorBtn");
  if (runSimBtn) {
    runSimBtn.addEventListener("click", runCultivationSimulator);
  }

  const toggleBtn = document.getElementById("toggleFiltersBtn");
  const filterBody = document.getElementById("filterBody");
  if (toggleBtn && filterBody) {
    toggleBtn.addEventListener("click", () => {
      const isExpanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", !isExpanded);
      filterBody.classList.toggle("collapsed");
      const toggleText = toggleBtn.querySelector(".toggle-text");
      if (toggleText) {
        toggleText.textContent = isExpanded ? "Show Filters" : "Hide Filters";
      }
    });
  }

  // Permanent Event Delegation on plantTableBody
  const tableBody = document.getElementById("plantTableBody");
  if (tableBody) {
    tableBody.addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-plant]");
      if (tr) {
        const plantName = tr.getAttribute("data-plant");
        if (plantName) {
          openPlantModal(plantName);
        }
      }
    });
  }

  const closeModalBtn = document.getElementById("closeModalBtn");
  const plantModal = document.getElementById("plantModal");

  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", closePlantModal);
  }

  if (plantModal) {
    plantModal.addEventListener("click", (e) => {
      if (e.target === plantModal) {
        closePlantModal();
      }
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePlantModal();
    }
  });

  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (mapState.map) {
        mapState.map.invalidateSize();
      }
    }, 200);
  });

  document.getElementById("yearFilter").addEventListener("change", (event) => {
    state.year = event.target.value;
    updateDashboard();
  });

  document.getElementById("statusFilter").addEventListener("change", (event) => {
    state.status = event.target.value;
    updateDashboard();
  });

  document.getElementById("zoneFilter").addEventListener("change", (event) => {
    state.zone = event.target.value;
    updateDashboard();
  });

  document.getElementById("clinicalFilter").addEventListener("change", (event) => {
    state.clinical = event.target.value;
    updateDashboard();
  });

  document.getElementById("plantSearch").addEventListener("input", (event) => {
    state.search = event.target.value;
    updateDashboard();
  });

  document.getElementById("resetFiltersBtn").addEventListener("click", () => {
    state.year = "all";
    state.status = "all";
    state.zone = "all";
    state.clinical = "all";
    state.search = "";

    document.getElementById("yearFilter").value = "all";
    document.getElementById("statusFilter").value = "all";
    document.getElementById("zoneFilter").value = "all";
    document.getElementById("clinicalFilter").value = "all";
    document.getElementById("plantSearch").value = "";

    updateDashboard();
  });

  document.getElementById("downloadSuitabilityBtn").addEventListener("click", () => {
    const rows = withFilters(state.suitabilityRows);
    const csv = Papa.unparse(rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "filtered_suitability.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
}

function showError(message) {
  const kpiGrid = document.getElementById("kpiGrid");
  kpiGrid.innerHTML = `<article class="kpi-card"><h2>Frontend Error</h2><p>${message}</p></article>`;
}

async function bootstrap() {
  try {
    const [suitability, temperature, precipitation, plants] = await Promise.all([
      loadCsv(DATA_FILES.suitability),
      loadCsv(DATA_FILES.temperature),
      loadCsv(DATA_FILES.precipitation),
      loadCsv(DATA_FILES.plants)
    ]);

    state.suitabilityRows = normalizeSuitability(suitability);
    state.temperatureRows = normalizeForecast(temperature);
    state.precipitationRows = normalizeForecast(precipitation);
    state.plantRows = normalizePlants(plants);

    initYearFilter();
    initMap();

    drawForecastChart(
      "temperatureChart",
      state.temperatureRows,
      "Monthly Mean Temperature Forecast (C)",
      "#0f9d58"
    );
    drawForecastChart(
      "precipitationChart",
      state.precipitationRows,
      "Monthly Mean Precipitation Forecast",
      "#e67e22"
    );

    registerEvents();
    updateDashboard();

    // Allow layout to settle before Leaflet measures the map container
    setTimeout(() => {
      if (mapState.map) mapState.map.invalidateSize();
    }, 300);
  } catch (error) {
    showError(error.message || "Failed to initialize dashboard.");
  }
}

window.addEventListener("DOMContentLoaded", bootstrap);
