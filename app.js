const AIRPORT_API =
    "https://airportsapi.com/api/airports";


/* =========================================================
   GLOBAL GLOBE
   ========================================================= */

let globeViewer = null;


/* =========================================================
   AIRPORT LOOKUP
   ========================================================= */

async function findAirport(code) {

    code = code.trim().toUpperCase();

    try {

        const response = await fetch(
            `${AIRPORT_API}/${encodeURIComponent(code)}`
        );

        if (!response.ok) {
            console.error(
                "API HTTP error:",
                response.status
            );
            return null;
        }

        const raw = await response.json();

        console.log("RAW API:", raw);

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


/* =========================================================
   GREAT-CIRCLE DISTANCE
   ========================================================= */

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
        lat1 * Math.PI / 180;

    const φ2 =
        lat2 * Math.PI / 180;

    const Δλ =
        (lon2 - lon1) * Math.PI / 180;

    const y =
        Math.sin(Δλ) * Math.cos(φ2);

    const x =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) *
        Math.cos(φ2) *
        Math.cos(Δλ);

    const θ =
        Math.atan2(y, x) *
        180 / Math.PI;

    return normalizeBearing(θ);
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
        reverseBearing + 180
    );
}


/* =========================================================
   NORMALIZE BEARING
   ========================================================= */

function normalizeBearing(
    bearing
) {

    return (
        bearing + 360
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
        lat1 * Math.PI / 180;

    const λ1 =
        lon1 * Math.PI / 180;

    const φ2 =
        lat2 * Math.PI / 180;

    const λ2 =
        lon2 * Math.PI / 180;


    const sinHalfLat =
        Math.sin(
            (φ2 - φ1) / 2
        );

    const sinHalfLon =
        Math.sin(
            (λ2 - λ1) / 2
        );

    const a =
        sinHalfLat * sinHalfLat +
        Math.cos(φ1) *
        Math.cos(φ2) *
        sinHalfLon * sinHalfLon;

    const δ =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    if (δ < 1e-10) {

        return [
            {
                latitude: lat1,
                longitude: lon1
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
            i / numberOfPoints;

        const sinδ =
            Math.sin(δ);

        const A =
            Math.sin(
                (1 - fraction) * δ
            ) / sinδ;

        const B =
            Math.sin(
                fraction * δ
            ) / sinδ;


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
                φ * 180 / Math.PI,

            longitude:
                λ * 180 / Math.PI

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
   INITIALIZE 3D GLOBE
   ========================================================= */

function initializeGlobe() {

    try {

        globeViewer =
            new Cesium.Viewer(
                "cesiumContainer",
                {

                    animation:
                        false,

                    timeline:
                        false,

                    baseLayerPicker:
                        false,

                    geocoder:
                        false,

                    homeButton:
                        false,

                    sceneModePicker:
                        false,

                    navigationHelpButton:
                        false,

                    fullscreenButton:
                        false,

                    vrButton:
                        false,

                    infoBox:
                        true,

                    selectionIndicator:
                        true,

                    terrainProvider:
                        new Cesium.EllipsoidTerrainProvider()
                }
            );


        globeViewer.imageryLayers.removeAll();


        const osm =
            new Cesium.OpenStreetMapImageryProvider({

                url:
                    "https://tile.openstreetmap.org/"

            });


        globeViewer.imageryLayers.addImageryProvider(
            osm
        );


        globeViewer.scene.globe.enableLighting =
            true;


        globeViewer.scene.globe.depthTestAgainstTerrain =
            false;


        globeViewer.camera.setView({

            destination:
                Cesium.Cartesian3.fromDegrees(
                    78,
                    20,
                    15000000
                )

        });


        console.log(
            "V1 Flight Planner - 3D globe initialized"
        );


    } catch (error) {

        console.error(
            "Globe initialization failed:",
            error
        );


        const globeStatus =
            document.getElementById(
                "globeStatus"
            );


        if (globeStatus) {

            globeStatus.textContent =
                "3D globe failed to initialize.";

        }
    }
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
                Elevation: ${airport.elevation} ft
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
   DRAW FLIGHT ROUTE
   ========================================================= */

function drawFlightRoute(
    departure,
    destination
) {

    if (!globeViewer) {
        return;
    }


    globeViewer.entities.removeAll();


    /*
     Departure marker
     */

    addAirportMarker(
        departure,
        Cesium.Color.LIME,
        departure.code
    );


    /*
     Destination marker
     */

    addAirportMarker(
        destination,
        Cesium.Color.RED,
        destination.code
    );


    /*
     Generate 101 points along
     the great-circle route.
     */

    const routePoints =
        generateGreatCirclePoints(

            departure.latitude,
            departure.longitude,

            destination.latitude,
            destination.longitude,

            100
        );


    /*
     Visualization altitude.

     This is not aircraft cruise altitude yet.
     We will add real flight altitude later.
     */

    const routeHeight =
        150000;


    const routePositions = [];


    routePoints.forEach(
        point => {

            routePositions.push(

                Cesium.Cartesian3.fromDegrees(
                    point.longitude,
                    point.latitude,
                    routeHeight
                )

            );

        }
    );


    /*
     Draw route.
     */

    globeViewer.entities.add({

        name:
            `${departure.code} → ${destination.code}`,

        description:

            `
            <div style="font-family:Arial,sans-serif;">
                <strong>
                    ${departure.code} → ${destination.code}
                </strong><br>
                Direct great-circle route
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
     Add intermediate route markers.
     */

    const markerIndexes = [
        25,
        50,
        75
    ];


    markerIndexes.forEach(
        index => {

            const point =
                routePoints[index];


            globeViewer.entities.add({

                position:

                    Cesium.Cartesian3.fromDegrees(
                        point.longitude,
                        point.latitude,
                        routeHeight
                    ),

                point: {

                    pixelSize:
                        5,

                    color:
                        Cesium.Color.CYAN,

                    outlineColor:
                        Cesium.Color.WHITE,

                    outlineWidth:
                        1

                },

                description:

                    `
                    <div style="font-family:Arial,sans-serif;">
                        Great-circle route point<br>
                        Latitude:
                        ${point.latitude.toFixed(4)}°<br>
                        Longitude:
                        ${point.longitude.toFixed(4)}°
                    </div>
                    `
            });

        }
    );


    /*
     Update globe status.
     */

    const globeStatus =
        document.getElementById(
            "globeStatus"
        );


    if (globeStatus) {

        globeStatus.textContent =
            `${departure.code} → ${destination.code}`;

    }


    /*
     Fly camera to route.
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

}


/* =========================================================
   PLAN FLIGHT
   ========================================================= */

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


    /*
     Display airports.
     */

    displayAirport(
        departure,
        "dep"
    );


    displayAirport(
        destination,
        "dest"
    );


    /*
     Display route codes.
     */

    document.getElementById(
        "routeDeparture"
    ).textContent =
        departure.code;


    document.getElementById(
        "routeDestination"
    ).textContent =
        destination.code;


    /*
     Distance.
     */

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


    /*
     Initial true bearing.
     */

    const initialBearing =
        calculateInitialBearing(

            departure.latitude,
            departure.longitude,

            destination.latitude,
            destination.longitude

        );


    /*
     Final true bearing.
     */

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


    /*
     Generate route points.
     */

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


    /*
     Show results.
     */

    document.getElementById(
        "result"
    ).style.display =
        "block";


    /*
     Draw route on globe.
     */

    drawFlightRoute(
        departure,
        destination
    );


    status.textContent =
        "Flight plan created successfully.";

}


/* =========================================================
   APPLICATION STARTUP
   ========================================================= */

document.getElementById(
    "status"
).textContent =
    "Airport lookup ready.";


initializeGlobe();


console.log(
    "V1 Flight Planner - navigation route engine loaded"
);
