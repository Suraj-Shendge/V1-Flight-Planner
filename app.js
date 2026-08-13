// V1 Flight Planner
// Airport lookup and basic route engine

const AIRPORT_API = "https://airportsapi.com/api/airports";


// ------------------------------------
// Airport lookup
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

    const raw = await response.json();

    console.log("Airport:", raw);

    if (
      !raw.data ||
      !raw.data.attributes
    ) {
      return null;
    }

    const data = raw.data.attributes;

    return {
      code: data.icao_code || data.code || code,
      iata: data.iata_code || "",
      name: data.name || "Unknown airport",

      latitude: Number(data.latitude),
      longitude: Number(data.longitude),

      elevation: Number(data.elevation) || 0
    };

  } catch (error) {

    console.error(
      "Airport lookup failed:",
      error
    );

    return null;
  }
}


// ------------------------------------
// Great-circle distance
// ------------------------------------

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const earthRadius = 3440.065;

  const latitude1 =
    lat1 * Math.PI / 180;

  const latitude2 =
    lat2 * Math.PI / 180;

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
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}


// ------------------------------------
// Display airport
// ------------------------------------

function displayAirport(
  airport,
  prefix
) {

  document.getElementById(
    `${prefix}Code`
  ).textContent =
    airport.code;

  document.getElementById(
    `${prefix}Name`
  ).textContent =
    airport.name;

  document.getElementById(
    `${prefix}Location`
  ).textContent =
    `${airport.iata || "No IATA"} • Elevation ${airport.elevation} ft`;
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


  if (
    !departureCode ||
    !destinationCode
  ) {

    status.textContent =
      "Enter both departure and destination airports.";

    return;
  }


  status.textContent =
    "Looking up airports...";


  const [
    departure,
    destination
  ] = await Promise.all([

    findAirport(departureCode),

    findAirport(destinationCode)

  ]);


  if (!departure) {

    status.textContent =
      `Airport ${departureCode} was not found.`;

    return;
  }


  if (!destination) {

    status.textContent =
      `Airport ${destinationCode} was not found.`;

    return;
  }


  // Display airport information

  displayAirport(
    departure,
    "dep"
  );

  displayAirport(
    destination,
    "dest"
  );


  // Display route

  document.getElementById(
    "routeDeparture"
  ).textContent =
    departure.code;

  document.getElementById(
    "routeDestination"
  ).textContent =
    destination.code;


  // Calculate distance

  const distance =
    calculateDistance(

      departure.latitude,
      departure.longitude,

      destination.latitude,
      destination.longitude

    );


  document.getElementById(
    "distance"
  ).textContent =
    `${Math.round(distance).toLocaleString()} NM`;


  // Show results

  document.getElementById(
    "result"
  ).style.display =
    "block";


  status.textContent =
    "Flight plan created successfully.";
}


// ------------------------------------
// Application startup
// ------------------------------------

document.getElementById(
  "status"
).textContent =
  "Airport lookup ready.";

console.log(
  "V1 Flight Planner app.js loaded successfully."
);
