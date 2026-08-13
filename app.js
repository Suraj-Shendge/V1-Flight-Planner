// V1 Flight Planner
// Airport database powered by OurAirports open data

const AIRPORTS_URL =
  "https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv";

let airports = [];
let airportsLoaded = false;

// -----------------------------
// CSV parser
// -----------------------------

function parseCSV(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(value);
      rows.push(row);

      row = [];
      value = "";
    } else {
      value += char;
    }
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value);
    rows.push(row);
  }

  const headers = rows.shift();

  return rows.map(columns => {
    const airport = {};

    headers.forEach((header, index) => {
      airport[header] = columns[index] || "";
    });

    return airport;
  });
}

// -----------------------------
// Load airport database
// -----------------------------

async function loadAirports() {

  try {

    console.log("Loading airport database...");

    const response = await fetch(AIRPORTS_URL);

    if (!response.ok) {
      throw new Error("Could not download airport database.");
    }

    const csv = await response.text();

    airports = parseCSV(csv);

    // Keep airports that have an ICAO-style identifier
    airports = airports.filter(
      airport =>
        airport.ident &&
        airport.ident.length === 4
    );

    airportsLoaded = true;

    console.log(
      `Loaded ${airports.length.toLocaleString()} airports.`
    );

  } catch (error) {

    console.error(error);

    alert(
      "Unable to load the airport database. Please refresh the page."
    );
  }
}

// -----------------------------
// Airport search
// -----------------------------

function searchAirport(query) {

  if (!airportsLoaded) {
    return [];
  }

  query = query.trim().toUpperCase();

  if (!query) {
    return [];
  }

  return airports
    .filter(airport => {

      const ident =
        (airport.ident || "").toUpperCase();

      const name =
        (airport.name || "").toUpperCase();

      const municipality =
        (airport.municipality || "").toUpperCase();

      return (
        ident.includes(query) ||
        name.includes(query) ||
        municipality.includes(query)
      );

    })
    .slice(0, 10);
}

// -----------------------------
// Display airport information
// -----------------------------

function displayAirport(airport, target) {

  const element =
    document.getElementById(target);

  if (!element) {
    return;
  }

  element.innerHTML = `
    <strong>${airport.ident}</strong><br>
    ${airport.name}<br>
    ${airport.municipality || "Unknown location"},
    ${airport.iso_country || ""}
  `;
}

// -----------------------------
// Flight planning
// -----------------------------

function planFlight() {

  const departure =
    document
      .getElementById("departure")
      .value
      .trim()
      .toUpperCase();

  const destination =
    document
      .getElementById("destination")
      .value
      .trim()
      .toUpperCase();

  if (!departure || !destination) {

    alert(
      "Please enter both departure and destination airports."
    );

    return;
  }

  const depAirport =
    airports.find(
      airport =>
        airport.ident.toUpperCase() === departure
    );

  const destAirport =
    airports.find(
      airport =>
        airport.ident.toUpperCase() === destination
    );

  if (!depAirport) {

    alert(
      `Departure airport ${departure} was not found.`
    );

    return;
  }

  if (!destAirport) {

    alert(
      `Destination airport ${destination} was not found.`
    );

    return;
  }

  displayAirport(
    depAirport,
    "depResult"
  );

  displayAirport(
    destAirport,
    "destResult"
  );

  document
    .getElementById("result")
    .style.display = "block";
}

// -----------------------------
// Start application
// -----------------------------

loadAirports();
