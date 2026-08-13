const AIRPORT_API = "https://airportsapi.com/api/airports";


// ================================
// AIRPORT LOOKUP
// ================================

async function findAirport(code) {

    code = code.trim().toUpperCase();

    try {

        const response = await fetch(
            `${AIRPORT_API}/${encodeURIComponent(code)}`
        );

        if (!response.ok) {
            console.error("API HTTP error:", response.status);
            return null;
        }

        const raw = await response.json();

        console.log("RAW API:", raw);

        // IMPORTANT:
        // AirportsAPI returns:
        //
        // data
        //   └── attributes
        //

        if (!raw.data || !raw.data.attributes) {

            console.error(
                "Unexpected API structure:",
                raw
            );

            return null;
        }

        const a = raw.data.attributes;

        const airport = {

            code:
                a.icao_code ||
                a.code ||
                code,

            iata:
                a.iata_code ||
                "",

            name:
                a.name ||
                "Unknown airport",

            latitude:
                Number(a.latitude),

            longitude:
                Number(a.longitude),

            elevation:
                Number(a.elevation) || 0
        };

        console.log(
            "NORMALIZED AIRPORT:",
            airport
        );

        return airport;

    } catch (error) {

        console.error(
            "Airport lookup failed:",
            error
        );

        return null;
    }
}


// ================================
// DISTANCE CALCULATION
// ================================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 3440.065;

    const φ1 =
        lat1 * Math.PI / 180;

    const φ2 =
        lat2 * Math.PI / 180;

    const Δφ =
        (lat2 - lat1) * Math.PI / 180;

    const Δλ =
        (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(Δλ / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


// ================================
// DISPLAY AIRPORT
// ================================

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
        `${airport.iata || "No IATA"} • ` +
        `Elevation ${airport.elevation} ft`;
}


// ================================
// PLAN FLIGHT
// ================================

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


// ================================
// STARTUP
// ================================

document.getElementById(
    "status"
).textContent =
    "Airport lookup ready.";

console.log(
    "V1 Flight Planner - NEW app.js loaded"
);
