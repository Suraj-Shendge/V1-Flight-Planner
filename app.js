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


        /*
         AirportsAPI structure:

         data
           └── attributes
                 ├── name
                 ├── code
                 ├── latitude
                 ├── longitude
                 ├── elevation
                 ├── icao_code
                 └── iata_code
        */


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

        /*
         Create a pure 3D globe without
         requiring a Cesium ion token.
        */

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


        /*
         Remove the default imagery.
        */

        globeViewer.imageryLayers.removeAll();


        /*
         Add OpenStreetMap imagery.

         This gives us a free initial
         geographic base layer.
        */

        const osm =
            new Cesium.OpenStreetMapImageryProvider({

                url:
                    "https://tile.openstreetmap.org/"

            });


        globeViewer.imageryLayers.addImageryProvider(
            osm
        );


        /*
         Enable realistic day/night lighting.
        */

        globeViewer.scene.globe.enableLighting =
            true;


        /*
         Enable depth testing against terrain.
        */

        globeViewer.scene.globe.depthTestAgainstTerrain =
            false;


        /*
         Start with a global Earth view.
        */

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


    /*
     Remove the previous flight route
     and airport markers.
    */

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
     Create a geodesic flight route.

     We use a small altitude above
     the Earth's surface so the route
     is clearly visible as a flight path.
    */

    const routeHeight =
        150000;


    const routePositions =
        Cesium.Cartesian3.fromDegreesArrayHeights([

            departure.longitude,
            departure.latitude,
            routeHeight,


            destination.longitude,
            destination.latitude,
            routeHeight

        ]);


    globeViewer.entities.add({

        name:
            `${departure.code} → ${destination.code}`,

        description:

            `
            <div style="font-family:Arial,sans-serif;">
                <strong>
                    ${departure.code} → ${destination.code}
                </strong>
                <br>
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
                Cesium.ArcType.GEODESIC,

            clampToGround:
                false

        }

    });


    /*
     Add a subtle midpoint marker.
    */

    const midLatitude =
        (
            departure.latitude +
            destination.latitude
        ) / 2;


    const midLongitude =
        (
            departure.longitude +
            destination.longitude
        ) / 2;


    globeViewer.entities.add({

        position:
            Cesium.Cartesian3.fromDegrees(
                midLongitude,
                midLatitude,
                routeHeight
            ),

        point: {

            pixelSize:
                5,

            color:
                Cesium.Color.CYAN

        }

    });


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
     Fly the camera to the complete route.
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


    /*
     Validate input.
    */

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


    /*
     Look up both airports simultaneously.
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


    /*
     Validate departure.
    */

    if (!departure) {

        status.textContent =
            `Could not find ${departureCode}.`;

        return;

    }


    /*
     Validate destination.
    */

    if (!destination) {

        status.textContent =
            `Could not find ${destinationCode}.`;

        return;

    }


    /*
     Display airport information.
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
     Calculate direct distance.
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
     Show flight results.
    */

    document.getElementById(
        "result"
    ).style.display =
        "block";


    /*
     Draw the route on the
     interactive 3D globe.
    */

    drawFlightRoute(
        departure,
        destination
    );


    /*
     Final status.
    */

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
    "V1 Flight Planner - application loaded"
);
