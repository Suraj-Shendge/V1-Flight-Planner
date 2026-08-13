const AIRPORT_API =
    "https://airportsapi.com/api/airports";


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let globeViewer = null;

let departureAirport = null;

let destinationAirport = null;

let routeWaypoints = [];

let routeAirports = [];

let currentPerformance = null;


/* =========================================================
   AIRCRAFT DATABASE
   =========================================================

   These are SIMULATION PROFILES.

   They are intentionally kept separate from the route engine
   so we can later replace them with detailed aircraft-specific
   performance datasets.
   ========================================================= */

const AIRCRAFT_DATABASE = {

    a320: {

        name:
            "Airbus A320-200",

        oew:
            42600,

        mtow:
            78000,

        mlw:
            66000,

        mzfw:
            62500,

        maxFuel:
            24210,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            70000,

        referenceLandingWeight:
            60000,

        referenceV1:
            135,

        referenceVR:
            140,

        referenceV2:
            145,

        referenceVref:
            137,

        takeoffFlaps:
            "CONF 1+F / CONF 2",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "CONF 1+F",
                "CONF 2",
                "CONF 3"
            ]

    },


    a320neo: {

        name:
            "Airbus A320neo",

        oew:
            44600,

        mtow:
            79000,

        mlw:
            67400,

        mzfw:
            62800,

        maxFuel:
            24210,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            71000,

        referenceLandingWeight:
            61000,

        referenceV1:
            137,

        referenceVR:
            142,

        referenceV2:
            147,

        referenceVref:
            139,

        takeoffFlaps:
            "CONF 1+F / CONF 2",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "CONF 1+F",
                "CONF 2",
                "CONF 3"
            ]

    },


    a321: {

        name:
            "Airbus A321",

        oew:
            51500,

        mtow:
            89000,

        mlw:
            75500,

        mzfw:
            73800,

        maxFuel:
            32000,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            80000,

        referenceLandingWeight:
            68000,

        referenceV1:
            140,

        referenceVR:
            145,

        referenceV2:
            150,

        referenceVref:
            143,

        takeoffFlaps:
            "CONF 1+F / CONF 2",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "CONF 1+F",
                "CONF 2",
                "CONF 3"
            ]

    },


    b738: {

        name:
            "Boeing 737-800",

        oew:
            41400,

        mtow:
            79010,

        mlw:
            66360,

        mzfw:
            62730,

        maxFuel:
            26020,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            70000,

        referenceLandingWeight:
            60000,

        referenceV1:
            135,

        referenceVR:
            138,

        referenceV2:
            145,

        referenceVref:
            137,

        takeoffFlaps:
            "5",

        landingFlaps:
            "30",

        flapOptions:
            [
                "1",
                "5",
                "10",
                "15"
            ]

    },


    b38m: {

        name:
            "Boeing 737 MAX 8",

        oew:
            44670,

        mtow:
            82190,

        mlw:
            69310,

        mzfw:
            65320,

        maxFuel:
            25940,

        cruiseSpeed:
            453,

        referenceTakeoffWeight:
            73000,

        referenceLandingWeight:
            62000,

        referenceV1:
            138,

        referenceVR:
            141,

        referenceV2:
            147,

        referenceVref:
            140,

        takeoffFlaps:
            "5",

        landingFlaps:
            "30",

        flapOptions:
            [
                "1",
                "5",
                "10",
                "15"
            ]

    },


    b789: {

        name:
            "Boeing 787-9",

        oew:
            128000,

        mtow:
            254000,

        mlw:
            192800,

        mzfw:
            181000,

        maxFuel:
            126000,

        cruiseSpeed:
            488,

        referenceTakeoffWeight:
            220000,

        referenceLandingWeight:
            175000,

        referenceV1:
            145,

        referenceVR:
            150,

        referenceV2:
            158,

        referenceVref:
            145,

        takeoffFlaps:
            "5",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "5",
                "10",
                "15"
            ]

    },


    b77w: {

        name:
            "Boeing 777-300ER",

        oew:
            167800,

        mtow:
            351500,

        mlw:
            251290,

        mzfw:
            237680,

        maxFuel:
            181280,

        cruiseSpeed:
            490,

        referenceTakeoffWeight:
            300000,

        referenceLandingWeight:
            220000,

        referenceV1:
            145,

        referenceVR:
            150,

        referenceV2:
            158,

        referenceVref:
            145,

        takeoffFlaps:
            "5",

        landingFlaps:
            "30",

        flapOptions:
            [
                "5",
                "15",
                "20"
            ]

    },


    a359: {

        name:
            "Airbus A350-900",

        oew:
            142400,

        mtow:
            283000,

        mlw:
            207000,

        mzfw:
            195000,

        maxFuel:
            141000,

        cruiseSpeed:
            488,

        referenceTakeoffWeight:
            250000,

        referenceLandingWeight:
            195000,

        referenceV1:
            145,

        referenceVR:
            150,

        referenceV2:
            158,

        referenceVref:
            145,

        takeoffFlaps:
            "CONF 1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "CONF 1",
                "CONF 2",
                "CONF 3"
            ]

    }

};


/* =========================================================
   AIRPORT LOOKUP
   ========================================================= */

async function findAirport(code) {

    code =
        code
            .trim()
            .toUpperCase();


    try {

        const response =
            await fetch(
                `${AIRPORT_API}/${encodeURIComponent(code)}`
            );


        if (!response.ok) {

            console.error(
                "API HTTP error:",
                response.status
            );

            return null;
        }


        const raw =
            await response.json();


        console.log(
            "RAW API:",
            raw
        );


        if (
            !raw.data ||
            !raw.data.attributes
        ) {

            console.error(
                "Unexpected API structure:",
                raw
            );

            return null;
        }


        const a =
            raw.data.attributes;


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


/* =========================================================
   GREAT-CIRCLE DISTANCE
   ========================================================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R =
        3440.065;


    const φ1 =
        lat1 *
        Math.PI /
        180;


    const φ2 =
        lat2 *
        Math.PI /
        180;


    const Δφ =
        (
            lat2 -
            lat1
        ) *
        Math.PI /
        180;


    const Δλ =
        (
            lon2 -
            lon1
        ) *
        Math.PI /
        180;


    const a =
        Math.sin(
            Δφ / 2
        ) ** 2 +

        Math.cos(φ1) *
        Math.cos(φ2) *
        Math.sin(
            Δλ / 2
        ) ** 2;


    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    return R * c;
}


/* =========================================================
   INITIAL TRUE BEARING
   ========================================================= */

function calculateInitialBearing(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const φ1 =
        lat1 *
        Math.PI /
        180;


    const φ2 =
        lat2 *
        Math.PI /
        180;


    const Δλ =
        (
            lon2 -
            lon1
        ) *
        Math.PI /
        180;


    const y =
        Math.sin(Δλ) *
        Math.cos(φ2);


    const x =
        Math.cos(φ1) *
        Math.sin(φ2) -

        Math.sin(φ1) *
        Math.cos(φ2) *
        Math.cos(Δλ);


    const θ =
        Math.atan2(
            y,
            x
        ) *
        180 /
        Math.PI;


    return normalizeBearing(
        θ
    );
}


/* =========================================================
   FINAL TRUE BEARING
   ========================================================= */

function calculateFinalBearing(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const reverseBearing =
        calculateInitialBearing(

            lat2,
            lon2,

            lat1,
            lon1

        );


    return normalizeBearing(
        reverseBearing +
        180
    );
}


/* =========================================================
   NORMALIZE BEARING
   ========================================================= */

function normalizeBearing(
    bearing
) {

    return (
        bearing +
        360
    ) % 360;
}


/* =========================================================
   GREAT-CIRCLE INTERMEDIATE POINTS
   ========================================================= */

function generateGreatCirclePoints(
    lat1,
    lon1,
    lat2,
    lon2,
    numberOfPoints = 100
) {

    const φ1 =
        lat1 *
        Math.PI /
        180;


    const λ1 =
        lon1 *
        Math.PI /
        180;


    const φ2 =
        lat2 *
        Math.PI /
        180;


    const λ2 =
        lon2 *
        Math.PI /
        180;


    const sinHalfLat =
        Math.sin(
            (φ2 - φ1) /
            2
        );


    const sinHalfLon =
        Math.sin(
            (λ2 - λ1) /
            2
        );


    const a =
        sinHalfLat *
        sinHalfLat +

        Math.cos(φ1) *
        Math.cos(φ2) *
        sinHalfLon *
        sinHalfLon;


    const δ =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    if (
        δ <
        1e-10
    ) {

        return [
            {
                latitude:
                    lat1,

                longitude:
                    lon1
            }
        ];
    }


    const points = [];


    for (
        let i = 0;
        i <= numberOfPoints;
        i++
    ) {

        const fraction =
            i /
            numberOfPoints;


        const sinδ =
            Math.sin(δ);


        const A =
            Math.sin(
                (1 - fraction) *
                δ
            ) /
            sinδ;


        const B =
            Math.sin(
                fraction *
                δ
            ) /
            sinδ;


        const x =
            A *
            Math.cos(φ1) *
            Math.cos(λ1) +

            B *
            Math.cos(φ2) *
            Math.cos(λ2);


        const y =
            A *
            Math.cos(φ1) *
            Math.sin(λ1) +

            B *
            Math.cos(φ2) *
            Math.sin(λ2);


        const z =
            A *
            Math.sin(φ1) +

            B *
            Math.sin(φ2);


        const φ =
            Math.atan2(
                z,
                Math.sqrt(
                    x * x +
                    y * y
                )
            );


        const λ =
            Math.atan2(
                y,
                x
            );


        points.push({

            latitude:
                φ *
                180 /
                Math.PI,

            longitude:
                λ *
                180 /
                Math.PI

        });

    }


    return points;
}


/* =========================================================
   DISPLAY AIRPORT
   ========================================================= */

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


/* =========================================================
   AIRCRAFT INFORMATION
   ========================================================= */

function getSelectedAircraft() {

    const aircraftId =
        document.getElementById(
            "aircraft"
        ).value;


    return AIRCRAFT_DATABASE[
        aircraftId
    ];
}


function updateAircraftInformation() {

    const aircraft =
        getSelectedAircraft();


    if (!aircraft) {
        return;
    }


    document.getElementById(
        "aircraftHint"
    ).textContent =
        `${aircraft.name} • ` +
        `OEW ${formatKg(aircraft.oew)} • ` +
        `MTOW ${formatKg(aircraft.mtow)} • ` +
        `Max fuel ${formatKg(aircraft.maxFuel)} • ` +
        `Cruise ${aircraft.cruiseSpeed} KT`;
}


/* =========================================================
   FORMAT HELPERS
   ========================================================= */

function formatKg(
    value
) {

    return `${Math.round(value).toLocaleString()} kg`;
}


function formatNm(
    value
) {

    return `${Math.round(value).toLocaleString()} NM`;
}


function formatKnots(
    value
) {

    return `${Math.round(value)} KT`;
}


function clamp(
    value,
    minimum,
    maximum
) {

    return Math.min(
        Math.max(
            value,
            minimum
        ),
        maximum
    );
}


/* =========================================================
   PERFORMANCE ESTIMATE
   ========================================================= */

function calculatePerformance() {

    const aircraft =
        getSelectedAircraft();


    if (!aircraft) {
        return;
    }


    let payload =
        Number(
            document.getElementById(
                "payload"
            ).value
        );


    let fuel =
        Number(
            document.getElementById(
                "fuelLoad"
            ).value
        );


    if (
        !Number.isFinite(payload) ||
        payload < 0
    ) {

        payload = 0;

        document.getElementById(
            "payload"
        ).value = 0;
    }


    if (
        !Number.isFinite(fuel) ||
        fuel < 0
    ) {

        fuel = 0;

        document.getElementById(
            "fuelLoad"
        ).value = 0;
    }


    /*
     Prevent the input from exceeding
     the aircraft's maximum fuel.
     */

    fuel =
        clamp(
            fuel,
            0,
            aircraft.maxFuel
        );


    document.getElementById(
        "fuelLoad"
    ).value =
        fuel;


    const zfw =
        aircraft.oew +
        payload;


    const tow =
        zfw +
        fuel;


    /*
     The planner does not yet have a real
     fuel-burn model. Therefore landing
     weight is estimated using a simple
     planning reserve/burn assumption.
     */

    const estimatedTripFuel =
        fuel *
        0.85;


    const landingWeight =
        tow -
        estimatedTripFuel;


    /*
     Update weight display.
     */

    document.getElementById(
        "oew"
    ).textContent =
        formatKg(
            aircraft.oew
        );


    document.getElementById(
        "payloadDisplay"
    ).textContent =
        formatKg(
            payload
        );


    document.getElementById(
        "zfw"
    ).textContent =
        formatKg(
            zfw
        );


    document.getElementById(
        "fuelDisplay"
    ).textContent =
        formatKg(
            fuel
        );


    document.getElementById(
        "tow"
    ).textContent =
        formatKg(
            tow
        );


    document.getElementById(
        "landingWeight"
    ).textContent =
        formatKg(
            landingWeight
        );


    /*
     Update limits.
     */

    document.getElementById(
        "mtow"
    ).textContent =
        formatKg(
            aircraft.mtow
        );


    document.getElementById(
        "mlw"
    ).textContent =
        formatKg(
            aircraft.mlw
        );


    document.getElementById(
        "mzfw"
    ).textContent =
        formatKg(
            aircraft.mzfw
        );


    document.getElementById(
        "maxFuel"
    ).textContent =
        formatKg(
            aircraft.maxFuel
        );


    /*
     Weight-limit validation.
     */

    const zfwElement =
        document.getElementById(
            "zfw"
        );


    const towElement =
        document.getElementById(
            "tow"
        );


    const landingElement =
        document.getElementById(
            "landingWeight"
        );


    zfwElement.className =
        "performance-value " +
        (
            zfw <= aircraft.mzfw
                ? "status-good"
                : "status-danger"
        );


    towElement.className =
        "performance-value " +
        (
            tow <= aircraft.mtow
                ? "status-good"
                : "status-danger"
        );


    landingElement.className =
        "performance-value " +
        (
            landingWeight <= aircraft.mlw
                ? "status-good"
                : "status-danger"
        );


    /*
     Calculate SIM ESTIMATE V-speeds.

     Speed varies approximately with the square
     root of weight ratio in this simplified model.

     This is deliberately NOT presented as
     certified aircraft performance.
     */

    const takeoffWeightRatio =
        Math.sqrt(
            tow /
            aircraft.referenceTakeoffWeight
        );


    const landingWeightRatio =
        Math.sqrt(
            landingWeight /
            aircraft.referenceLandingWeight
        );


    const v1 =
        aircraft.referenceV1 *
        takeoffWeightRatio;


    const vr =
        aircraft.referenceVR *
        takeoffWeightRatio;


    const v2 =
        aircraft.referenceV2 *
        takeoffWeightRatio;


    const vref =
        aircraft.referenceVref *
        landingWeightRatio;


    const vapp =
        vref +
        5;


    /*
     Store performance.
     */

    currentPerformance = {

        aircraft:
            aircraft,

        payload:
            payload,

        fuel:
            fuel,

        zfw:
            zfw,

        tow:
            tow,

        landingWeight:
            landingWeight,

        v1:
            v1,

        vr:
            vr,

        v2:
            v2,

        vref:
            vref,

        vapp:
            vapp

    };


    /*
     Display takeoff performance.
     */

    document.getElementById(
        "takeoffFlaps"
    ).textContent =
        aircraft.takeoffFlaps;


    document.getElementById(
        "v1"
    ).textContent =
        formatKnots(v1);


    document.getElementById(
        "vr"
    ).textContent =
        formatKnots(vr);


    document.getElementById(
        "v2"
    ).textContent =
        formatKnots(v2);


    /*
     Display landing performance.
     */

    document.getElementById(
        "landingFlaps"
    ).textContent =
        aircraft.landingFlaps;


    document.getElementById(
        "vref"
    ).textContent =
        formatKnots(vref);


    document.getElementById(
        "vapp"
    ).textContent =
        formatKnots(vapp);


    /*
     Show a warning if the selected
     weight exceeds an aircraft limit.
     */

    const warnings = [];


    if (
        zfw >
        aircraft.mzfw
    ) {

        warnings.push(
            "ZFW exceeds MZFW."
        );

    }


    if (
        tow >
        aircraft.mtow
    ) {

        warnings.push(
            "Takeoff weight exceeds MTOW."
        );

    }


    if (
        landingWeight >
        aircraft.mlw
    ) {

        warnings.push(
            "Estimated landing weight exceeds MLW."
        );

    }


    const status =
        document.getElementById(
            "status"
        );


    if (warnings.length > 0) {

        status.textContent =
            `Weight warning: ${warnings.join(" ")}`;

    } else {

        status.textContent =
            "Performance estimate calculated successfully.";

    }


    /*
     Refresh aircraft description.
     */

    updateAircraftInformation();

}


/* =========================================================
   WAYPOINT TABLE
   ========================================================= */

function addWaypoint() {

    routeWaypoints.push({

        code:
            "",

        altitude:
            10000,

        speed:
            250,

        speedUnit:
            "IAS",

        airport:
            null

    });


    renderWaypointTable();
}


function removeWaypoint(
    index
) {

    if (
        index < 0 ||
        index >= routeWaypoints.length
    ) {

        return;
    }


    routeWaypoints.splice(
        index,
        1
    );


    renderWaypointTable();
}


function renderWaypointTable() {

    const tbody =
        document.getElementById(
            "waypointTableBody"
        );


    const empty =
        document.getElementById(
            "emptyRoute"
        );


    tbody.innerHTML = "";


    if (
        routeWaypoints.length === 0
    ) {

        empty.style.display =
            "block";

        return;
    }


    empty.style.display =
        "none";


    routeWaypoints.forEach(
        (waypoint, index) => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td class="waypoint-number">
                    ${index + 1}
                </td>

                <td>
                    <input
                        type="text"
                        maxlength="5"
                        value="${waypoint.code}"
                        placeholder="DPN"
                        oninput="updateWaypointField(
                            ${index},
                            'code',
                            this.value
                        )"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        min="0"
                        step="500"
                        value="${waypoint.altitude}"
                        oninput="updateWaypointField(
                            ${index},
                            'altitude',
                            this.value
                        )"
                    >
                </td>

                <td>
                    <input
                        type="number"
                        min="0"
                        step="1"
                        value="${waypoint.speed}"
                        oninput="updateWaypointField(
                            ${index},
                            'speed',
                            this.value
                        )"
                    >
                </td>

                <td>
                    <select
                        onchange="updateWaypointField(
                            ${index},
                            'speedUnit',
                            this.value
                        )"
                    >

                        <option
                            value="IAS"
                            ${waypoint.speedUnit === "IAS"
                                ? "selected"
                                : ""}
                        >
                            IAS
                        </option>

                        <option
                            value="MACH"
                            ${waypoint.speedUnit === "MACH"
                                ? "selected"
                                : ""}
                        >
                            Mach
                        </option>

                    </select>
                </td>

                <td class="waypoint-distance"
                    id="legDistance-${index}">
                    —
                </td>

                <td>
                    <button
                        type="button"
                        class="danger"
                        onclick="removeWaypoint(${index})"
                    >
                        REMOVE
                    </button>
                </td>
            `;


            tbody.appendChild(
                row
            );

        }
    );
}


function updateWaypointField(
    index,
    field,
    value
) {

    if (
        !routeWaypoints[index]
    ) {

        return;
    }


    if (
        field === "altitude" ||
        field === "speed"
    ) {

        routeWaypoints[index][field] =
            Number(value);

    } else {

        routeWaypoints[index][field] =
            value
                .toString()
                .toUpperCase();

    }
}


/* =========================================================
   BUILD ROUTE
   ========================================================= */

async function updateRoute() {

    const departureCode =
        document.getElementById(
            "departure"
        ).value
        .trim()
        .toUpperCase();


    const destinationCode =
        document.getElementById(
            "destination"
        ).value
        .trim()
        .toUpperCase();


    if (
        !departureCode ||
        !destinationCode
    ) {

        document.getElementById(
            "status"
        ).textContent =
            "Enter departure and destination before updating the route.";

        return;
    }


    const status =
        document.getElementById(
            "status"
        );


    status.textContent =
        "Building route...";


    /*
     Look up departure and destination.
     */

    const [
        departure,
        destination
    ] =
        await Promise.all([

            findAirport(
                departureCode
            ),

            findAirport(
                destinationCode
            )

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


    departureAirport =
        departure;


    destinationAirport =
        destination;


    /*
     Resolve waypoint airport coordinates.
     */

    for (
        let i = 0;
        i < routeWaypoints.length;
        i++
    ) {

        const waypoint =
            routeWaypoints[i];


        if (
            !waypoint.code
        ) {

            waypoint.airport =
                null;

            continue;
        }


        status.textContent =
            `Looking up waypoint ${waypoint.code}...`;


        waypoint.airport =
            await findAirport(
                waypoint.code
            );


        if (
            !waypoint.airport
        ) {

            status.textContent =
                `Could not find waypoint ${waypoint.code}.`;

            return;
        }
    }


    /*
     Construct complete route.
     */

    routeAirports = [

        departure,

        ...routeWaypoints
            .filter(
                waypoint =>
                    waypoint.airport
            )
            .map(
                waypoint =>
                    waypoint.airport
            ),

        destination

    ];


    /*
     Calculate leg distances.
     */

    let totalDistance =
        0;


    for (
        let i = 0;
        i < routeAirports.length - 1;
        i++
    ) {

        const from =
            routeAirports[i];


        const to =
            routeAirports[i + 1];


        const distance =
            calculateDistance(

                from.latitude,
                from.longitude,

                to.latitude,
                to.longitude

            );


        totalDistance +=
            distance;


        /*
         The waypoint's leg distance represents
         the distance from the previous point.
         */

        const waypointIndex =
            i - 1;


        if (
            waypointIndex >= 0 &&
            routeWaypoints[waypointIndex]
        ) {

            const element =
                document.getElementById(
                    `legDistance-${waypointIndex}`
                );


            if (element) {

                element.textContent =
                    formatNm(
                        distance
                    );

            }
        }
    }


    /*
     Render route information.
     */

    document.getElementById(
        "routeDeparture"
    ).textContent =
        departure.code;


    document.getElementById(
        "routeDestination"
    ).textContent =
        destination.code;


    document.getElementById(
        "distance"
    ).textContent =
        formatNm(
            totalDistance
        );


    /*
     Initial bearing is from first point
     to first route point/destination.
     */

    const firstTarget =
        routeAirports.length > 1
            ? routeAirports[1]
            : destination;


    const lastOrigin =
        routeAirports.length > 1
            ? routeAirports[
                routeAirports.length - 2
              ]
            : departure;


    const initialBearing =
        calculateInitialBearing(

            departure.latitude,
            departure.longitude,

            firstTarget.latitude,
            firstTarget.longitude

        );


    const finalBearing =
        calculateFinalBearing(

            lastOrigin.latitude,
            lastOrigin.longitude,

            destination.latitude,
            destination.longitude

        );


    document.getElementById(
        "initialBearing"
    ).textContent =
        `${Math.round(initialBearing)
            .toString()
            .padStart(3, "0")}°`;


    document.getElementById(
        "finalBearing"
    ).textContent =
        `${Math.round(finalBearing)
            .toString()
            .padStart(3, "0")}°`;


    /*
     Show results.
     */

    displayAirport(
        departure,
        "dep"
    );


    displayAirport(
        destination,
        "dest"
    );


    document.getElementById(
        "result"
    ).style.display =
        "block";


    /*
     Draw the route through all waypoints.
     */

    drawMultiPointRoute(
        routeAirports
    );


    /*
     Calculate approximate flight time.
     */

    calculateEstimatedTime(
        routeAirports
    );


    status.textContent =
        "Route updated successfully.";
}


/* =========================================================
   ESTIMATED TIME
   ========================================================= */

function calculateEstimatedTime(
    airports
) {

    if (
        airports.length < 2
    ) {

        return;
    }


    const aircraft =
        getSelectedAircraft();


    if (!aircraft) {
        return;
    }


    let totalDistance =
        0;


    for (
        let i = 0;
        i < airports.length - 1;
        i++
    ) {

        totalDistance +=
            calculateDistance(

                airports[i].latitude,
                airports[i].longitude,

                airports[i + 1].latitude,
                airports[i + 1].longitude

            );

    }


    /*
     Cruise-speed estimate.

     We deliberately use a simple average
     speed for now. A future version will
     calculate climb, cruise and descent
     segments separately.
     */

    const hours =
        totalDistance /
        aircraft.cruiseSpeed;


    const wholeHours =
        Math.floor(
            hours
        );


    const minutes =
        Math.round(
            (
                hours -
                wholeHours
            ) *
            60
        );


    document.getElementById(
        "estimatedTime"
    ).textContent =
        `${wholeHours}h ${minutes}m`;
}


/* =========================================================
   DRAW AIRPORT MARKER
   ========================================================= */

function addAirportMarker(
    airport,
    color,
    labelText
) {

    if (!globeViewer) {
        return;
    }


    globeViewer.entities.add({

        name:
            airport.code,


        description:

            `
            <div style="font-family:Arial,sans-serif;">
                <strong>${airport.code}</strong><br>
                ${airport.name}<br>
                ${airport.iata || "No IATA"}<br>
                Elevation:
                ${airport.elevation} ft
            </div>
            `,


        position:

            Cesium.Cartesian3.fromDegrees(

                airport.longitude,

                airport.latitude,

                15000

            ),


        point: {

            pixelSize:
                12,

            color:
                color,

            outlineColor:
                Cesium.Color.WHITE,

            outlineWidth:
                2,

            heightReference:
                Cesium.HeightReference.NONE
        },


        label: {

            text:
                labelText,

            font:
                "bold 16px Arial",

            fillColor:
                Cesium.Color.WHITE,

            outlineColor:
                Cesium.Color.BLACK,

            outlineWidth:
                4,

            style:
                Cesium.LabelStyle.FILL_AND_OUTLINE,

            verticalOrigin:
                Cesium.VerticalOrigin.BOTTOM,

            pixelOffset:
                new Cesium.Cartesian2(
                    0,
                    -16
                )

        }

    });
}


/* =========================================================
   DRAW WAYPOINT MARKER
   ========================================================= */

function addWaypointMarker(
    airport,
    waypoint,
    index,
    routeHeight
) {

    if (!globeViewer) {
        return;
    }


    globeViewer.entities.add({

        name:
            waypoint.code,


        description:

            `
            <div style="font-family:Arial,sans-serif;">

                <strong>
                    ${waypoint.code}
                </strong>

                <br>

                Altitude:
                ${Number(waypoint.altitude || 0).toLocaleString()}
                ft

                <br>

                Speed:
                ${waypoint.speed || "—"}
                ${waypoint.speedUnit || "IAS"}

                <br>

                Latitude:
                ${airport.latitude.toFixed(4)}°

                <br>

                Longitude:
                ${airport.longitude.toFixed(4)}°

            </div>
            `,


        position:

            Cesium.Cartesian3.fromDegrees(

                airport.longitude,

                airport.latitude,

                routeHeight

            ),


        point: {

            pixelSize:
                8,

            color:
                Cesium.Color.ORANGE,

            outlineColor:
                Cesium.Color.WHITE,

            outlineWidth:
                2

        },


        label: {

            text:
                `${index + 1}. ${waypoint.code}`,

            font:
                "bold 14px Arial",

            fillColor:
                Cesium.Color.WHITE,

            outlineColor:
                Cesium.Color.BLACK,

            outlineWidth:
                3,

            style:
                Cesium.LabelStyle.FILL_AND_OUTLINE,

            verticalOrigin:
                Cesium.VerticalOrigin.BOTTOM,

            pixelOffset:
                new Cesium.Cartesian2(
                    0,
                    -12
                )

        }

    });
}


/* =========================================================
   DRAW MULTI-POINT ROUTE
   ========================================================= */

function drawMultiPointRoute(
    airports
) {

    if (!globeViewer) {
        return;
    }


    globeViewer.entities.removeAll();


    if (
        airports.length < 2
    ) {

        return;
    }


    /*
     Add departure marker.
     */

    addAirportMarker(

        airports[0],

        Cesium.Color.LIME,

        airports[0].code

    );


    /*
     Add destination marker.
     */

    addAirportMarker(

        airports[
            airports.length - 1
        ],

        Cesium.Color.RED,

        airports[
            airports.length - 1
        ].code

    );


    /*
     Visualization altitude.

     This is not yet the aircraft's real
     vertical profile.
     */

    const routeHeight =
        150000;


    const routePositions =
        [];


    /*
     Generate each leg separately.

     Each leg follows a great-circle path.
     */

    for (
        let i = 0;
        i < airports.length - 1;
        i++
    ) {

        const from =
            airports[i];


        const to =
            airports[i + 1];


        const legPoints =
            generateGreatCirclePoints(

                from.latitude,
                from.longitude,

                to.latitude,
                to.longitude,

                50

            );


        legPoints.forEach(
            (point, pointIndex) => {

                /*
                 Avoid duplicating the first point
                 of every leg after the first leg.
                 */

                if (
                    i > 0 &&
                    pointIndex === 0
                ) {

                    return;
                }


                routePositions.push(

                    Cesium.Cartesian3.fromDegrees(

                        point.longitude,

                        point.latitude,

                        routeHeight

                    )

                );

            }
        );
    }


    /*
     Draw complete route.
     */

    globeViewer.entities.add({

        name:
            "V1 Flight Route",


        description:

            `
            <div style="font-family:Arial,sans-serif;">
                <strong>
                    V1 Flight Route
                </strong><br>
                ${airports
                    .map(
                        airport =>
                            airport.code
                    )
                    .join(" → ")}
            </div>
            `,


        polyline: {

            positions:
                routePositions,

            width:
                4,

            material:

                new Cesium.PolylineGlowMaterialProperty({

                    glowPower:
                        0.15,

                    color:
                        Cesium.Color.CYAN

                }),

            arcType:
                Cesium.ArcType.NONE,

            clampToGround:
                false

        }

    });


    /*
     Add waypoint markers.

     The first and last airport are not
     duplicated as waypoint markers.
     */

    for (
        let i = 1;
        i < airports.length - 1;
        i++
    ) {

        const waypoint =
            routeWaypoints[i - 1];


        if (
            waypoint &&
            waypoint.airport
        ) {

            addWaypointMarker(

                airports[i],

                waypoint,

                i,

                routeHeight

            );

        }

    }


    /*
     Globe status.
     */

    const globeStatus =
        document.getElementById(
            "globeStatus"
        );


    if (globeStatus) {

        globeStatus.textContent =
            airports
                .map(
                    airport =>
                        airport.code
                )
                .join(" → ");

    }


    /*
     Camera.
     */

    globeViewer.flyTo(

        globeViewer.entities,

        {

            duration:
                2.5,

            offset:

                new Cesium.HeadingPitchRange(

                    0,

                    Cesium.Math.toRadians(-35),

                    0

                )

        }

    );


    /*
     Update route point count.

     The route consists of the sampled
     globe path rather than only user waypoints.
     */

    document.getElementById(
        "routePoints"
    ).textContent =
        routePositions.length;
}


/* =========================================================
   PLAN DIRECT FLIGHT
   ========================================================= */

async function planFlight() {

    const departureCode =
        document
            .getElementById(
                "departure"
            )
            .value
            .trim()
            .toUpperCase();


    const destinationCode =
        document
            .getElementById(
                "destination"
            )
            .value
            .trim()
            .toUpperCase();


    const status =
        document.getElementById(
            "status"
        );


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
    ] =
        await Promise.all([

            findAirport(
                departureCode
            ),

            findAirport(
                destinationCode
            )

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


    departureAirport =
        departure;


    destinationAirport =
        destination;


    routeAirports = [

        departure,

        ...routeWaypoints
            .filter(
                waypoint =>
                    waypoint.airport
            )
            .map(
                waypoint =>
                    waypoint.airport
            ),

        destination

    ];


    /*
     If waypoints have not yet been resolved,
     use a simple direct route.
     */

    if (
        routeWaypoints.length > 0 &&
        routeAirports.length !==
            routeWaypoints.length + 2
    ) {

        await updateRoute();

        return;
    }


    displayAirport(
        departure,
        "dep"
    );


    displayAirport(
        destination,
        "dest"
    );


    document.getElementById(
        "routeDeparture"
    ).textContent =
        departure.code;


    document.getElementById(
        "routeDestination"
    ).textContent =
        destination.code;


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
        formatNm(
            distance
        );


    const initialBearing =
        calculateInitialBearing(

            departure.latitude,
            departure.longitude,

            destination.latitude,
            destination.longitude

        );


    const finalBearing =
        calculateFinalBearing(

            departure.latitude,
            departure.longitude,

            destination.latitude,
            destination.longitude

        );


    document.getElementById(
        "initialBearing"
    ).textContent =
        `${Math.round(initialBearing)
            .toString()
            .padStart(3, "0")}°`;


    document.getElementById(
        "finalBearing"
    ).textContent =
        `${Math.round(finalBearing)
            .toString()
            .padStart(3, "0")}°`;


    const routePoints =
        generateGreatCirclePoints(

            departure.latitude,
            departure.longitude,

            destination.latitude,
            destination.longitude,

            100

        );


    document.getElementById(
        "routePoints"
    ).textContent =
        routePoints.length;


    document.getElementById(
        "result"
    ).style.display =
        "block";


    drawMultiPointRoute(
        routeAirports
    );


    calculateEstimatedTime(
        routeAirports
    );


    document.getElementById(
        "status"
    ).textContent =
        "Flight plan created successfully.";
}


/* =========================================================
   AIRCRAFT SELECTOR
   ========================================================= */

document.getElementById(
    "aircraft"
).addEventListener(
    "change",
    () => {

        updateAircraftInformation();

        calculatePerformance();

        /*
         Recalculate time if a route already exists.
         */

        if (
            routeAirports.length >= 2
        ) {

            calculateEstimatedTime(
                routeAirports
            );

        }

    }
);


/* =========================================================
   PERFORMANCE INPUT EVENTS
   ========================================================= */

document.getElementById(
    "payload"
).addEventListener(
    "input",
    () => {

        calculatePerformance();

    }
);


document.getElementById(
    "fuelLoad"
).addEventListener(
    "input",
    () => {

        calculatePerformance();

    }
);


/* =========================================================
   APPLICATION STARTUP
   ========================================================= */

document.getElementById(
    "status"
).textContent =
    "Airport lookup ready.";


updateAircraftInformation();


initializeGlobe();


renderWaypointTable();


calculatePerformance();


console.log(
    "V1 Flight Planner - aircraft and route engine loaded"
);
