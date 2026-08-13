// V1 Flight Planner
// Lightweight airport lookup

const AIRPORT_API = "https://airportsapi.com/api/airports";

let departureAirport = null;
let destinationAirport = null;


// ------------------------------------
// Find airport
// ------------------------------------

async function findAirport(code) {

  code = code.trim().toUpperCase();

  if (!code) {
    return null;
  }

  try {

    const response = await fetch(
      `${AIRPORT_API}/${encodeURIComponent(code)}`
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();

  } catch (error) {

    console.error("Airport lookup failed:", error);

    return null;
  }
}


// ------------------------------------
// Calculate great-circle distance
// ------------------------------------

function calculateDistance(lat1, lon1, lat2, lon2) {

  const earthRadius = 3440.065;

  const latitude1 = lat1 * Math.PI / 180;
  const latitude2 = lat2 * Math.PI / 180;

  const deltaLatitude =
    (lat2 - lat1) * Math.PI / 180;

  const deltaLongitude =
    (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitude1) *
    Math.cos(latitude2) *
    Math.sin(deltaLongitude / 2) ** 2;

  const c =
    2 * Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


// ------------------------------------
// Display airport
// ------------------------------------

function displayAirport(airport, prefix) {

  document.getElementById(
    `${prefix}Code`
  ).textContent =
    airport.code || airport.icao_code || "----";

  document.getElementById(
    `${prefix}Name`
  ).textContent =
    airport.name || "Unknown airport";

  document.getElementById(
    `${prefix}Location`
  ).textContent =
    `${airport.city || ""}${airport.country ? ", " + airport.country : ""}`;
}


// ------------------------------------
// Plan flight
// ------------------------------------

async function planFlight() {

  const departureCode =
    document
      .getElementById("departure")
      .value
      .trim()
      .toUpperCase();

  const destinationCode =
    document
      .getElementById("destination")
      .value
      .trim()
      .toUpperCase();

  const status =
    document.getElementById("status");

  if (!departureCode || !destinationCode) {

    status.textContent =
      "Enter both departure and destination airports.";

    return;
  }


  status.textContent =
    "Finding airports...";


  const [departure, destination] =
    await Promise.all([
      findAirport(departureCode),
      findAirport(destinationCode)
    ]);


  if (!departure) {

    status.textContent =
      `Departure airport ${departureCode} not found.`;

    return;
  }


  if (!destination) {

    status.textContent =
      `Destination airport ${destinationCode} not found.`;

    return;
  }


  departureAirport = departure;
  destinationAirport = destination;


  displayAirport(
    departure,
    "dep"
  );

  displayAirport(
    destination,
    "dest"
  );


  const distance =
    calculateDistance(
      Number(departure.latitude),
      Number(departure.longitude),
      Number(destination.latitude),
      Number(destination.longitude)
    );


  document.getElementById(
    "routeDeparture"
  ).textContent =
    departure.code || departure.icao_code;


  document.getElementById(
    "routeDestination"
  ).textContent =
    destination.code || destination.icao_code;


  document.getElementById(
    "distance"
  ).textContent =
    `${Math.round(distance).toLocaleString()} NM`;


  document.getElementById(
    "result"
  ).style.display =
    "block";


  status.textContent =
    "Flight plan created successfully.";
}
