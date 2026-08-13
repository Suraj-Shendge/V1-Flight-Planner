// V1 Flight Planner
// Airport lookup + basic flight distance engine

const AIRPORT_API = "https://airportsapi.com/api/airports";


// ------------------------------------
// Find airport
// ------------------------------------

async function findAirport(code) {

  code = code.trim().toUpperCase();

  try {

    const response = await fetch(
      `${AIRPORT_API}/${encodeURIComponent(code)}`
    );

    if (!response.ok) {
      return null;
    }

    const raw = await response.json();

    console.log("Airport API response:", raw);

    // Handle different possible API response structures
    let airport = raw;

    if (Array.isArray(raw)) {
      airport = raw[0];
    }

    if (raw.airport) {
      airport = raw.airport;
    }

    if (raw.data) {
      airport = Array.isArray(raw.data)
        ? raw.data[0]
        : raw.data;
    }

    if (!airport) {
      return null;
    }

    // Normalize the data
    return {
      code:
        airport.code ||
        airport.icao_code ||
        airport.icao ||
        airport.ident ||
        code,

      iata:
        airport.iata_code ||
        airport.iata ||
        "",

      name:
        airport.name ||
        airport.airport_name ||
        airport.nameAirport ||
        "Unknown airport",

      city:
        airport.city ||
        airport.municipality ||
        airport.city_name ||
        "",

      country:
        airport.country ||
        airport.country_name ||
        airport.nameCountry ||
        "",

      latitude: Number(
        airport.latitude ??
        airport.latitudeAirport ??
        airport.lat
      ),

      longitude: Number(
        airport.longitude ??
        airport.longitudeAirport ??
        airport.lon
      ),

      elevation:
        airport.elevation ??
        airport.elevation_ft ??
        airport.altitude ??
        null
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

  if (
    !Number.isFinite(lat1) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon2)
  ) {
    return null;
  }

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

  let location = "";

  if (airport.city) {
    location += airport.city;
  }

  if (airport.country) {

    if (location) {
      location += ", ";
    }

    location += airport.country;
  }

  document.getElementById(
    `${prefix}Location`
  ).textContent =
    location || "Location unavailable";
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
      `Could not find ${departureCode}.`;

    return;
  }


  if (!destination) {

    status.textContent =
      `Could not find ${destinationCode}.`;

    return;
  }


  // Display airports

  displayAirport(
    departure,
    "dep"
  );

  displayAirport(
    destination,
    "dest"
  );


  // Route codes

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


  if (distance !== null) {

    document.getElementById(
      "distance"
    ).textContent =
      `${Math.round(distance).toLocaleString()} NM`;

  } else {

    document.getElementById(
      "distance"
    ).textContent =
      "Unavailable";
  }


  // Show result

  document.getElementById(
    "result"
  ).style.display =
    "block";


  status.textContent =
    "Flight plan created successfully.";
}


// ------------------------------------
// Application ready
// ------------------------------------

document.getElementById(
  "status"
).textContent =
  "Airport lookup ready.";
