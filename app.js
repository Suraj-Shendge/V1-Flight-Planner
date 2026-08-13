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

        manufacturer:
            "Airbus",

        family:
            "A320",

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

        manufacturer:
            "Airbus",

        family:
            "A320neo",

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

        manufacturer:
            "Airbus",

        family:
            "A320",

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


    a319: {

        name:
            "Airbus A319",

        manufacturer:
            "Airbus",

        family:
            "A320",

        oew:
            40300,

        mtow:
            75500,

        mlw:
            62500,

        mzfw:
            58500,

        maxFuel:
            24210,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            68000,

        referenceLandingWeight:
            56000,

        referenceV1:
            132,

        referenceVR:
            137,

        referenceV2:
            142,

        referenceVref:
            135,

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


    a318: {

        name:
            "Airbus A318",

        manufacturer:
            "Airbus",

        family:
            "A320",

        oew:
            39400,

        mtow:
            68000,

        mlw:
            57000,

        mzfw:
            54500,

        maxFuel:
            24210,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            61000,

        referenceLandingWeight:
            52000,

        referenceV1:
            125,

        referenceVR:
            130,

        referenceV2:
            136,

        referenceVref:
            130,

        takeoffFlaps:
            "CONF 1+F",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "CONF 1+F",
                "CONF 2",
                "CONF 3"
            ]

    },


    a321neo: {

        name:
            "Airbus A321neo",

        manufacturer:
            "Airbus",

        family:
            "A320neo",

        oew:
            50500,

        mtow:
            97000,

        mlw:
            79000,

        mzfw:
            73500,

        maxFuel:
            32000,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            85000,

        referenceLandingWeight:
            68000,

        referenceV1:
            142,

        referenceVR:
            147,

        referenceV2:
            153,

        referenceVref:
            145,

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


    a321xlr: {

        name:
            "Airbus A321XLR",

        manufacturer:
            "Airbus",

        family:
            "A320neo",

        oew:
            50700,

        mtow:
            101000,

        mlw:
            85000,

        mzfw:
            79000,

        maxFuel:
            37000,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            90000,

        referenceLandingWeight:
            72000,

        referenceV1:
            145,

        referenceVR:
            150,

        referenceV2:
            156,

        referenceVref:
            148,

        takeoffFlaps:
            "CONF 1+F",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "CONF 1+F",
                "CONF 2",
                "CONF 3"
            ]

    },


    a330200: {

        name:
            "Airbus A330-200",

        manufacturer:
            "Airbus",

        family:
            "A330",

        oew:
            120600,

        mtow:
            242000,

        mlw:
            182000,

        mzfw:
            168000,

        maxFuel:
            139090,

        cruiseSpeed:
            470,

        referenceTakeoffWeight:
            210000,

        referenceLandingWeight:
            170000,

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

    },


    a330300: {

        name:
            "Airbus A330-300",

        manufacturer:
            "Airbus",

        family:
            "A330",

        oew:
            129000,

        mtow:
            242000,

        mlw:
            182000,

        mzfw:
            173000,

        maxFuel:
            139090,

        cruiseSpeed:
            470,

        referenceTakeoffWeight:
            215000,

        referenceLandingWeight:
            175000,

        referenceV1:
            145,

        referenceVR:
            150,

        referenceV2:
            158,

        referenceVref:
            146,

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

    },


    a330900: {

        name:
            "Airbus A330-900neo",

        manufacturer:
            "Airbus",

        family:
            "A330neo",

        oew:
            135000,

        mtow:
            251000,

        mlw:
            191000,

        mzfw:
            180000,

        maxFuel:
            111000,

        cruiseSpeed:
            470,

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
            146,

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

    },


    a340300: {

        name:
            "Airbus A340-300",

        manufacturer:
            "Airbus",

        family:
            "A340",

        oew:
            129000,

        mtow:
            276500,

        mlw:
            192000,

        mzfw:
            178000,

        maxFuel:
            147850,

        cruiseSpeed:
            470,

        referenceTakeoffWeight:
            235000,

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
            "CONF 1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "CONF 1",
                "CONF 2",
                "CONF 3"
            ]

    },


    a350900: {

        name:
            "Airbus A350-900",

        manufacturer:
            "Airbus",

        family:
            "A350",

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

    },


    a3501000: {

        name:
            "Airbus A350-1000",

        manufacturer:
            "Airbus",

        family:
            "A350",

        oew:
            155000,

        mtow:
            322000,

        mlw:
            236000,

        mzfw:
            219000,

        maxFuel:
            156000,

        cruiseSpeed:
            488,

        referenceTakeoffWeight:
            280000,

        referenceLandingWeight:
            220000,

        referenceV1:
            148,

        referenceVR:
            153,

        referenceV2:
            161,

        referenceVref:
            147,

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

    },


    a380800: {

        name:
            "Airbus A380-800",

        manufacturer:
            "Airbus",

        family:
            "A380",

        oew:
            277000,

        mtow:
            575000,

        mlw:
            394000,

        mzfw:
            361000,

        maxFuel:
            323546,

        cruiseSpeed:
            490,

        referenceTakeoffWeight:
            500000,

        referenceLandingWeight:
            350000,

        referenceV1:
            145,

        referenceVR:
            150,

        referenceV2:
            158,

        referenceVref:
            145,

        takeoffFlaps:
            "1+F",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "1+F",
                "2",
                "3"
            ]

    },


    b737700: {

        name:
            "Boeing 737-700",

        manufacturer:
            "Boeing",

        family:
            "737 NG",

        oew:
            38200,

        mtow:
            70080,

        mlw:
            58060,

        mzfw:
            54660,

        maxFuel:
            26020,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            62000,

        referenceLandingWeight:
            52000,

        referenceV1:
            132,

        referenceVR:
            136,

        referenceV2:
            143,

        referenceVref:
            135,

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


    b738: {

        name:
            "Boeing 737-800",

        manufacturer:
            "Boeing",

        family:
            "737 NG",

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


    b739er: {

        name:
            "Boeing 737-900ER",

        manufacturer:
            "Boeing",

        family:
            "737 NG",

        oew:
            44600,

        mtow:
            85140,

        mlw:
            66360,

        mzfw:
            62820,

        maxFuel:
            26020,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            76000,

        referenceLandingWeight:
            60000,

        referenceV1:
            138,

        referenceVR:
            141,

        referenceV2:
            148,

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


    b737max7: {

        name:
            "Boeing 737 MAX 7",

        manufacturer:
            "Boeing",

        family:
            "737 MAX",

        oew:
            44900,

        mtow:
            80000,

        mlw:
            67900,

        mzfw:
            63700,

        maxFuel:
            25940,

        cruiseSpeed:
            453,

        referenceTakeoffWeight:
            72000,

        referenceLandingWeight:
            61000,

        referenceV1:
            136,

        referenceVR:
            140,

        referenceV2:
            147,

        referenceVref:
            138,

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

        manufacturer:
            "Boeing",

        family:
            "737 MAX",

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


    b39m: {

        name:
            "Boeing 737 MAX 9",

        manufacturer:
            "Boeing",

        family:
            "737 MAX",

        oew:
            47000,

        mtow:
            88400,

        mlw:
            74400,

        mzfw:
            66400,

        maxFuel:
            25940,

        cruiseSpeed:
            453,

        referenceTakeoffWeight:
            78000,

        referenceLandingWeight:
            66000,

        referenceV1:
            140,

        referenceVR:
            143,

        referenceV2:
            150,

        referenceVref:
            142,

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


    b3m10: {

        name:
            "Boeing 737 MAX 10",

        manufacturer:
            "Boeing",

        family:
            "737 MAX",

        oew:
            48500,

        mtow:
            89700,

        mlw:
            76200,

        mzfw:
            69000,

        maxFuel:
            25940,

        cruiseSpeed:
            453,

        referenceTakeoffWeight:
            79000,

        referenceLandingWeight:
            67000,

        referenceV1:
            141,

        referenceVR:
            144,

        referenceV2:
            151,

        referenceVref:
            143,

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


    b747400: {

        name:
            "Boeing 747-400",

        manufacturer:
            "Boeing",

        family:
            "747",

        oew:
            178800,

        mtow:
            396900,

        mlw:
            285760,

        mzfw:
            251290,

        maxFuel:
            216840,

        cruiseSpeed:
            490,

        referenceTakeoffWeight:
            350000,

        referenceLandingWeight:
            250000,

        referenceV1:
            145,

        referenceVR:
            150,

        referenceV2:
            158,

        referenceVref:
            145,

        takeoffFlaps:
            "10",

        landingFlaps:
            "30",

        flapOptions:
            [
                "10",
                "20",
                "25"
            ]

    },


    b7478: {

        name:
            "Boeing 747-8",

        manufacturer:
            "Boeing",

        family:
            "747",

        oew:
            220000,

        mtow:
            447700,

        mlw:
            306200,

        mzfw:
            295800,

        maxFuel:
            238610,

        cruiseSpeed:
            493,

        referenceTakeoffWeight:
            390000,

        referenceLandingWeight:
            270000,

        referenceV1:
            148,

        referenceVR:
            153,

        referenceV2:
            161,

        referenceVref:
            147,

        takeoffFlaps:
            "10",

        landingFlaps:
            "30",

        flapOptions:
            [
                "10",
                "20",
                "25"
            ]

    },


    b752: {

        name:
            "Boeing 757-200",

        manufacturer:
            "Boeing",

        family:
            "757",

        oew:
            61500,

        mtow:
            115680,

        mlw:
            89580,

        mzfw:
            83916,

        maxFuel:
            42680,

        cruiseSpeed:
            460,

        referenceTakeoffWeight:
            100000,

        referenceLandingWeight:
            80000,

        referenceV1:
            135,

        referenceVR:
            140,

        referenceV2:
            147,

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
                "15",
                "20"
            ]

    },


    b753: {

        name:
            "Boeing 757-300",

        manufacturer:
            "Boeing",

        family:
            "757",

        oew:
            68000,

        mtow:
            123830,

        mlw:
            97610,

        mzfw:
            88450,

        maxFuel:
            43400,

        cruiseSpeed:
            460,

        referenceTakeoffWeight:
            108000,

        referenceLandingWeight:
            87000,

        referenceV1:
            138,

        referenceVR:
            143,

        referenceV2:
            150,

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
                "15",
                "20"
            ]

    },


    b762: {

        name:
            "Boeing 767-200",

        manufacturer:
            "Boeing",

        family:
            "767",

        oew:
            87000,

        mtow:
            159200,

        mlw:
            136000,

        mzfw:
            126000,

        maxFuel:
            91380,

        cruiseSpeed:
            470,

        referenceTakeoffWeight:
            145000,

        referenceLandingWeight:
            120000,

        referenceV1:
            140,

        referenceVR:
            145,

        referenceV2:
            153,

        referenceVref:
            140,

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


    b763: {

        name:
            "Boeing 767-300ER",

        manufacturer:
            "Boeing",

        family:
            "767",

        oew:
            90000,

        mtow:
            186880,

        mlw:
            145150,

        mzfw:
            129730,

        maxFuel:
            91380,

        cruiseSpeed:
            470,

        referenceTakeoffWeight:
            165000,

        referenceLandingWeight:
            125000,

        referenceV1:
            142,

        referenceVR:
            147,

        referenceV2:
            155,

        referenceVref:
            142,

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


    b764: {

        name:
            "Boeing 767-400ER",

        manufacturer:
            "Boeing",

        family:
            "767",

        oew:
            103000,

        mtow:
            204120,

        mlw:
            158760,

        mzfw:
            140600,

        maxFuel:
            91700,

        cruiseSpeed:
            470,

        referenceTakeoffWeight:
            180000,

        referenceLandingWeight:
            140000,

        referenceV1:
            144,

        referenceVR:
            149,

        referenceV2:
            157,

        referenceVref:
            144,

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


    b772: {

        name:
            "Boeing 777-200",

        manufacturer:
            "Boeing",

        family:
            "777",

        oew:
            138000,

        mtow:
            247200,

        mlw:
            201800,

        mzfw:
            190500,

        maxFuel:
            117300,

        cruiseSpeed:
            490,

        referenceTakeoffWeight:
            220000,

        referenceLandingWeight:
            180000,

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


    b772er: {

        name:
            "Boeing 777-200ER",

        manufacturer:
            "Boeing",

        family:
            "777",

        oew:
            139000,

        mtow:
            297550,

        mlw:
            201800,

        mzfw:
            223170,

        maxFuel:
            171170,

        cruiseSpeed:
            490,

        referenceTakeoffWeight:
            260000,

        referenceLandingWeight:
            185000,

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


    b772lr: {

        name:
            "Boeing 777-200LR",

        manufacturer:
            "Boeing",

        family:
            "777",

        oew:
            145000,

        mtow:
            347450,

        mlw:
            223170,

        mzfw:
            224530,

        maxFuel:
            181280,

        cruiseSpeed:
            490,

        referenceTakeoffWeight:
            300000,

        referenceLandingWeight:
            200000,

        referenceV1:
            147,

        referenceVR:
            152,

        referenceV2:
            160,

        referenceVref:
            147,

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


    b773: {

        name:
            "Boeing 777-300",

        manufacturer:
            "Boeing",

        family:
            "777",

        oew:
            160000,

        mtow:
            299370,

        mlw:
            237680,

        mzfw:
            237680,

        maxFuel:
            171170,

        cruiseSpeed:
            490,

        referenceTakeoffWeight:
            270000,

        referenceLandingWeight:
            215000,

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


    b77w: {

        name:
            "Boeing 777-300ER",

        manufacturer:
            "Boeing",

        family:
            "777",

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


    b788: {

        name:
            "Boeing 787-8",

        manufacturer:
            "Boeing",

        family:
            "787",

        oew:
            119950,

        mtow:
            227930,

        mlw:
            172370,

        mzfw:
            161480,

        maxFuel:
            126372,

        cruiseSpeed:
            488,

        referenceTakeoffWeight:
            200000,

        referenceLandingWeight:
            155000,

        referenceV1:
            142,

        referenceVR:
            147,

        referenceV2:
            155,

        referenceVref:
            142,

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


    b789: {

        name:
            "Boeing 787-9",

        manufacturer:
            "Boeing",

        family:
            "787",

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
                "15",
                "20"
            ]

    },


    b78x: {

        name:
            "Boeing 787-10",

        manufacturer:
            "Boeing",

        family:
            "787",

        oew:
            137000,

        mtow:
            254000,

        mlw:
            201000,

        mzfw:
            192000,

        maxFuel:
            126000,

        cruiseSpeed:
            488,

        referenceTakeoffWeight:
            230000,

        referenceLandingWeight:
            185000,

        referenceV1:
            146,

        referenceVR:
            151,

        referenceV2:
            159,

        referenceVref:
            146,

        takeoffFlaps:
            "5",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "5",
                "15",
                "20"
            ]

    },


    e170: {

        name:
            "Embraer E170",

        manufacturer:
            "Embraer",

        family:
            "E-Jets",

        oew:
            21200,

        mtow:
            38790,

        mlw:
            34500,

        mzfw:
            30500,

        maxFuel:
            9710,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            35000,

        referenceLandingWeight:
            30000,

        referenceV1:
            120,

        referenceVR:
            125,

        referenceV2:
            132,

        referenceVref:
            125,

        takeoffFlaps:
            "1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "1",
                "2",
                "3",
                "4"
            ]

    },


    e175: {

        name:
            "Embraer E175",

        manufacturer:
            "Embraer",

        family:
            "E-Jets",

        oew:
            21900,

        mtow:
            40000,

        mlw:
            34000,

        mzfw:
            33000,

        maxFuel:
            11600,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            36000,

        referenceLandingWeight:
            30000,

        referenceV1:
            121,

        referenceVR:
            126,

        referenceV2:
            133,

        referenceVref:
            126,

        takeoffFlaps:
            "1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "1",
                "2",
                "3",
                "4"
            ]

    },


    e190: {

        name:
            "Embraer E190",

        manufacturer:
            "Embraer",

        family:
            "E-Jets",

        oew:
            28080,

        mtow:
            51900,

        mlw:
            44000,

        mzfw:
            40900,

        maxFuel:
            16200,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            47000,

        referenceLandingWeight:
            38000,

        referenceV1:
            125,

        referenceVR:
            130,

        referenceV2:
            137,

        referenceVref:
            130,

        takeoffFlaps:
            "1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "1",
                "2",
                "3",
                "4"
            ]

    },


    e195: {

        name:
            "Embraer E195",

        manufacturer:
            "Embraer",

        family:
            "E-Jets",

        oew:
            29400,

        mtow:
            52290,

        mlw:
            44700,

        mzfw:
            43300,

        maxFuel:
            16200,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            48000,

        referenceLandingWeight:
            39000,

        referenceV1:
            126,

        referenceVR:
            131,

        referenceV2:
            138,

        referenceVref:
            131,

        takeoffFlaps:
            "1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "1",
                "2",
                "3",
                "4"
            ]

    },


    e190e2: {

        name:
            "Embraer E190-E2",

        manufacturer:
            "Embraer",

        family:
            "E2",

        oew:
            35100,

        mtow:
            56400,

        mlw:
            47700,

        mzfw:
            46500,

        maxFuel:
            17400,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            52000,

        referenceLandingWeight:
            42000,

        referenceV1:
            128,

        referenceVR:
            133,

        referenceV2:
            140,

        referenceVref:
            133,

        takeoffFlaps:
            "1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "1",
                "2",
                "3",
                "4"
            ]

    },


    e195e2: {

        name:
            "Embraer E195-E2",

        manufacturer:
            "Embraer",

        family:
            "E2",

        oew:
            35100,

        mtow:
            62000,

        mlw:
            54000,

        mzfw:
            52000,

        maxFuel:
            21300,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            57000,

        referenceLandingWeight:
            47000,

        referenceV1:
            130,

        referenceVR:
            135,

        referenceV2:
            142,

        referenceVref:
            135,

        takeoffFlaps:
            "1",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "1",
                "2",
                "3",
                "4"
            ]

    },


    atr42: {

        name:
            "ATR 42-600",

        manufacturer:
            "ATR",

        family:
            "ATR 42",

        oew:
            13600,

        mtow:
            18600,

        mlw:
            17400,

        mzfw:
            16900,

        maxFuel:
            4500,

        cruiseSpeed:
            300,

        referenceTakeoffWeight:
            18000,

        referenceLandingWeight:
            16500,

        referenceV1:
            105,

        referenceVR:
            110,

        referenceV2:
            115,

        referenceVref:
            105,

        takeoffFlaps:
            "TO",

        landingFlaps:
            "LDG",

        flapOptions:
            [
                "TO",
                "LDG"
            ]

    },


    atr72: {

        name:
            "ATR 72-600",

        manufacturer:
            "ATR",

        family:
            "ATR 72",

        oew:
            13500,

        mtow:
            23000,

        mlw:
            21500,

        mzfw:
            20500,

        maxFuel:
            5000,

        cruiseSpeed:
            275,

        referenceTakeoffWeight:
            22000,

        referenceLandingWeight:
            19500,

        referenceV1:
            105,

        referenceVR:
            110,

        referenceV2:
            116,

        referenceVref:
            105,

        takeoffFlaps:
            "TO",

        landingFlaps:
            "LDG",

        flapOptions:
            [
                "TO",
                "LDG"
            ]

    },


    crj700: {

        name:
            "Bombardier CRJ-700",

        manufacturer:
            "Bombardier",

        family:
            "CRJ",

        oew:
            20900,

        mtow:
            34990,

        mlw:
            30100,

        mzfw:
            29200,

        maxFuel:
            8400,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            32000,

        referenceLandingWeight:
            28000,

        referenceV1:
            118,

        referenceVR:
            123,

        referenceV2:
            130,

        referenceVref:
            123,

        takeoffFlaps:
            "8",

        landingFlaps:
            "45",

        flapOptions:
            [
                "8",
                "20",
                "30"
            ]

    },


    crj900: {

        name:
            "Bombardier CRJ-900",

        manufacturer:
            "Bombardier",

        family:
            "CRJ",

        oew:
            22900,

        mtow:
            38330,

        mlw:
            34020,

        mzfw:
            32680,

        maxFuel:
            10400,

        cruiseSpeed:
            447,

        referenceTakeoffWeight:
            35000,

        referenceLandingWeight:
            30000,

        referenceV1:
            120,

        referenceVR:
            125,

        referenceV2:
            132,

        referenceVref:
            125,

        takeoffFlaps:
            "8",

        landingFlaps:
            "45",

        flapOptions:
            [
                "8",
                "20",
                "30"
            ]

    },


    c919: {

        name:
            "COMAC C919",

        manufacturer:
            "COMAC",

        family:
            "C919",

        oew:
            42000,

        mtow:
            78000,

        mlw:
            66600,

        mzfw:
            61000,

        maxFuel:
            21000,

        cruiseSpeed:
            450,

        referenceTakeoffWeight:
            70000,

        referenceLandingWeight:
            58000,

        referenceV1:
            135,

        referenceVR:
            140,

        referenceV2:
            147,

        referenceVref:
            138,

        takeoffFlaps:
            "TO",

        landingFlaps:
            "FULL",

        flapOptions:
            [
                "TO",
                "CONF 1",
                "CONF 2"
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
   AIRCRAFT DATABASE HELPERS
   ========================================================= */

function getAircraftList() {

    return Object.entries(
        AIRCRAFT_DATABASE
    ).map(
        ([id, aircraft]) => ({

            id:
                id,

            ...aircraft

        })
    );

}


/* =========================================================
   GROUP AIRCRAFT BY MANUFACTURER
   ========================================================= */

function getAircraftByManufacturer() {

    const grouped = {};


    Object.entries(
        AIRCRAFT_DATABASE
    ).forEach(
        ([id, aircraft]) => {

            const manufacturer =
                aircraft.manufacturer ||
                "Other";


            if (
                !grouped[manufacturer]
            ) {

                grouped[manufacturer] =
                    [];

            }


            grouped[manufacturer].push({

                id:
                    id,

                ...aircraft

            });

        }
    );


    return grouped;
}


/* =========================================================
   GET SELECTED AIRCRAFT
   ========================================================= */

function getSelectedAircraft() {

    const selector =
        document.getElementById(
            "aircraft"
        );


    if (
        !selector
    ) {

        return null;
    }


    const aircraftId =
        selector.value;


    if (
        !aircraftId
    ) {

        return null;
    }


    return (
        AIRCRAFT_DATABASE[
            aircraftId
        ] ||
        null
    );
}


/* =========================================================
   POPULATE AIRCRAFT SELECTOR
   ========================================================= */

function populateAircraftSelector() {

    const selector =
        document.getElementById(
            "aircraft"
        );


    if (
        !selector
    ) {

        return;
    }


    selector.innerHTML =
        "";


    const grouped =
        getAircraftByManufacturer();


    Object.keys(grouped)
        .sort()
        .forEach(
            manufacturer => {

                const optgroup =
                    document.createElement(
                        "optgroup"
                    );


                optgroup.label =
                    manufacturer;


                grouped[
                    manufacturer
                ]
                    .sort(
                        (
                            a,
                            b
                        ) =>
                            a.name.localeCompare(
                                b.name
                            )
                    )
                    .forEach(
                        aircraft => {

                            const option =
                                document.createElement(
                                    "option"
                                );


                            option.value =
                                aircraft.id;


                            option.textContent =
                                aircraft.name;


                            optgroup.appendChild(
                                option
                            );

                        }
                    );


                selector.appendChild(
                    optgroup
                );

            }
        );


    /*
     Default aircraft.
     */

    if (
        AIRCRAFT_DATABASE[
            "a320"
        ]
    ) {

        selector.value =
            "a320";

    }


    updateAircraftDisplay();

}


/* =========================================================
   AIRCRAFT WEIGHT CALCULATION
   ========================================================= */

function calculateAircraftWeights(
    aircraft,
    payload,
    fuel
) {

    if (
        !aircraft
    ) {

        return null;
    }


    payload =
        Number(payload) ||
        0;


    fuel =
        Number(fuel) ||
        0;


    const operatingWeight =
        aircraft.oew;


    const zeroFuelWeight =
        operatingWeight +
        payload;


    const takeoffWeight =
        zeroFuelWeight +
        fuel;


    const limitedZeroFuelWeight =
        Math.min(
            zeroFuelWeight,
            aircraft.mzfw
        );


    const limitedTakeoffWeight =
        Math.min(
            takeoffWeight,
            aircraft.mtow
        );


    const availableFuelAtTakeoff =
        Math.max(
            0,
            Math.min(
                fuel,
                aircraft.maxFuel
            )
        );


    return {

        operatingWeight:
            operatingWeight,

        payload:
            payload,

        fuel:
            availableFuelAtTakeoff,

        zeroFuelWeight:
            zeroFuelWeight,

        limitedZeroFuelWeight:
            limitedZeroFuelWeight,

        takeoffWeight:
            takeoffWeight,

        limitedTakeoffWeight:
            limitedTakeoffWeight,

        overweight:
            takeoffWeight >
            aircraft.mtow,

        zeroFuelOverweight:
            zeroFuelWeight >
            aircraft.mzfw,

        fuelOverCapacity:
            fuel >
            aircraft.maxFuel

    };

}


/* =========================================================
   PERFORMANCE SPEED ESTIMATION
   =========================================================

   IMPORTANT:

   These are simulator estimates.

   They are NOT certified operational speeds.
   ========================================================= */

function calculatePerformanceSpeeds(
    aircraft,
    takeoffWeight,
    landingWeight
) {

    if (
        !aircraft
    ) {

        return null;
    }


    const safeTakeoffWeight =
        Math.max(
            aircraft.oew,
            Math.min(
                takeoffWeight,
                aircraft.mtow
            )
        );


    const safeLandingWeight =
        Math.max(
            aircraft.oew,
            Math.min(
                landingWeight,
                aircraft.mlw
            )
        );


    const takeoffRatio =
        Math.sqrt(
            safeTakeoffWeight /
            aircraft.referenceTakeoffWeight
        );


    const landingRatio =
        Math.sqrt(
            safeLandingWeight /
            aircraft.referenceLandingWeight
        );


    const V1 =
        Math.round(
            aircraft.referenceV1 *
            takeoffRatio
        );


    const VR =
        Math.round(
            aircraft.referenceVR *
            takeoffRatio
        );


    const V2 =
        Math.round(
            aircraft.referenceV2 *
            takeoffRatio
        );


    const Vref =
        Math.round(
            aircraft.referenceVref *
            landingRatio
        );


    const Vapp =
        Vref +
        5;


    return {

        V1:
            V1,

        VR:
            VR,

        V2:
            V2,

        Vref:
            Vref,

        Vapp:
            Vapp,

        takeoffFlaps:
            aircraft.takeoffFlaps,

        landingFlaps:
            aircraft.landingFlaps

    };

}


/* =========================================================
   UPDATE AIRCRAFT DISPLAY
   ========================================================= */

function updateAircraftDisplay() {

    const aircraft =
        getSelectedAircraft();


    if (
        !aircraft
    ) {

        return;
    }


    const aircraftName =
        document.getElementById(
            "aircraftName"
        );


    if (
        aircraftName
    ) {

        aircraftName.textContent =
            aircraft.name;

    }


    const manufacturer =
        document.getElementById(
            "aircraftManufacturer"
        );


    if (
        manufacturer
    ) {

        manufacturer.textContent =
            aircraft.manufacturer;

    }


    const family =
        document.getElementById(
            "aircraftFamily"
        );


    if (
        family
    ) {

        family.textContent =
            aircraft.family;

    }


    const mtow =
        document.getElementById(
            "mtow"
        );


    if (
        mtow
    ) {

        mtow.textContent =
            `${formatNumber(
                aircraft.mtow
            )} kg`;

    }


    const mlw =
        document.getElementById(
            "mlw"
        );


    if (
        mlw
    ) {

        mlw.textContent =
            `${formatNumber(
                aircraft.mlw
            )} kg`;

    }


    const mzfw =
        document.getElementById(
            "mzfw"
        );


    if (
        mzfw
    ) {

        mzfw.textContent =
            `${formatNumber(
                aircraft.mzfw
            )} kg`;

    }


    const maxFuel =
        document.getElementById(
            "maxFuel"
        );


    if (
        maxFuel
    ) {

        maxFuel.textContent =
            `${formatNumber(
                aircraft.maxFuel
            )} kg`;

    }


    calculateAndDisplayPerformance();

}


/* =========================================================
   FORMAT NUMBERS
   ========================================================= */

function formatNumber(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-US"
    );

}


/* =========================================================
   GET NUMERIC INPUT
   ========================================================= */

function getNumericInput(
    id
) {

    const element =
        document.getElementById(
            id
        );


    if (
        !element
    ) {

        return 0;
    }


    const value =
        parseFloat(
            element.value
        );


    return Number.isFinite(
        value
    )
        ? value
        : 0;

}


/* =========================================================
   CALCULATE AND DISPLAY PERFORMANCE
   ========================================================= */

function calculateAndDisplayPerformance() {

    const aircraft =
        getSelectedAircraft();


    if (
        !aircraft
    ) {

        return;
    }


    const payload =
        getNumericInput(
            "payload"
        );


    const fuel =
        getNumericInput(
            "fuel"
        );


    const weights =
        calculateAircraftWeights(

            aircraft,

            payload,

            fuel

        );


    if (
        !weights
    ) {

        return;
    }


    /*
     Estimate landing weight.

     For the initial model we assume
     approximately 20% of loaded fuel
     remains at landing.
     */

    const estimatedLandingFuel =
        fuel *
        0.20;


    const landingWeight =
        weights.zeroFuelWeight +
        estimatedLandingFuel;


    const speeds =
        calculatePerformanceSpeeds(

            aircraft,

            weights.limitedTakeoffWeight,

            landingWeight

        );


    currentPerformance = {

        aircraft:
            aircraft,

        weights:
            weights,

        landingWeight:
            landingWeight,

        speeds:
            speeds

    };


    displayWeightValue(
        "oewValue",
        weights.operatingWeight,
        "kg"
    );


    displayWeightValue(
        "zfwValue",
        weights.zeroFuelWeight,
        "kg"
    );


    displayWeightValue(
        "towValue",
        weights.takeoffWeight,
        "kg"
    );


    displayWeightValue(
        "landingWeightValue",
        landingWeight,
        "kg"
    );


    displayWeightValue(
        "fuelValue",
        weights.fuel,
        "kg"
    );


    if (
        speeds
    ) {

        displayText(
            "v1Value",
            `${speeds.V1} kt`
        );


        displayText(
            "vrValue",
            `${speeds.VR} kt`
        );


        displayText(
            "v2Value",
            `${speeds.V2} kt`
        );


        displayText(
            "vrefValue",
            `${speeds.Vref} kt`
        );


        displayText(
            "vappValue",
            `${speeds.Vapp} kt`
        );


        displayText(
            "takeoffFlapsValue",
            speeds.takeoffFlaps
        );


        displayText(
            "landingFlapsValue",
            speeds.landingFlaps
        );

    }


    const warning =
        document.getElementById(
            "performanceWarning"
        );


    if (
        warning
    ) {

        const warnings = [];


        if (
            weights.overweight
        ) {

            warnings.push(
                "Takeoff weight exceeds MTOW."
            );

        }


        if (
            weights.zeroFuelOverweight
        ) {

            warnings.push(
                "Zero-fuel weight exceeds MZFW."
            );

        }


        if (
            weights.fuelOverCapacity
        ) {

            warnings.push(
                "Fuel exceeds aircraft capacity."
            );

        }


        if (
            warnings.length
        ) {

            warning.textContent =
                warnings.join(
                    " "
                );


            warning.style.display =
                "block";

        } else {

            warning.textContent =
                "Performance values are simulator estimates.";

            warning.style.display =
                "block";

        }

    }

}


/* =========================================================
   DISPLAY TEXT HELPER
   ========================================================= */

function displayText(
    id,
    text
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element
    ) {

        element.textContent =
            text;

    }

}


/* =========================================================
   DISPLAY WEIGHT HELPER
   ========================================================= */

function displayWeightValue(
    id,
    value,
    unit
) {

    const element =
        document.getElementById(
            id
        );


    if (
        element
    ) {

        element.textContent =
            `${formatNumber(
                value
            )} ${unit}`;

    }

}


/* =========================================================
   DISPLAY AIRPORT
   ========================================================= */

function displayAirport(
    airport,
    prefix
) {

    if (
        !airport
    ) {

        return;
    }


    const code =
        document.getElementById(
            `${prefix}Code`
        );


    if (
        code
    ) {

        code.textContent =
            airport.code;

    }


    const name =
        document.getElementById(
            `${prefix}Name`
        );


    if (
        name
    ) {

        name.textContent =
            airport.name;

    }


    const location =
        document.getElementById(
            `${prefix}Location`
        );


    if (
        location
    ) {

        location.textContent =
            `${airport.iata || "No IATA"} • ` +
            `Elevation ${airport.elevation} ft`;

    }

}


/* =========================================================
   CESIUM GLOBE INITIALIZATION
   ========================================================= */

function initializeGlobe() {

    try {

        if (
            typeof Cesium ===
            "undefined"
        ) {

            console.error(
                "CesiumJS is not loaded."
            );

            return;
        }


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
         Remove default imagery.
         */

        globeViewer.imageryLayers
            .removeAll();


        /*
         OpenStreetMap imagery.
         */

        const osm =
            new Cesium.OpenStreetMapImageryProvider({

                url:
                    "https://tile.openstreetmap.org/"

            });


        globeViewer.imageryLayers
            .addImageryProvider(
                osm
            );


        globeViewer.scene.globe
            .enableLighting =
            true;


        globeViewer.scene.globe
            .depthTestAgainstTerrain =
            false;


        /*
         Initial camera position.
         */

        globeViewer.camera.setView({

            destination:
                Cesium.Cartesian3.fromDegrees(

                    78,

                    20,

                    15000000

                )

        });


        const globeStatus =
            document.getElementById(
                "globeStatus"
            );


        if (
            globeStatus
        ) {

            globeStatus.textContent =
                "3D globe ready.";

        }


        console.log(
            "V1 Flight Planner - 3D globe initialized"
        );


    } catch (
        error
    ) {

        console.error(
            "Globe initialization failed:",
            error
        );


        const globeStatus =
            document.getElementById(
                "globeStatus"
            );


        if (
            globeStatus
        ) {

            globeStatus.textContent =
                "3D globe failed to initialize.";

        }

    }

}


/* =========================================================
   CLEAR GLOBE
   ========================================================= */

function clearGlobe() {

    if (
        !globeViewer
    ) {

        return;
    }


    globeViewer.entities
        .removeAll();

}


/* =========================================================
   FLY TO AIRPORT
   ========================================================= */

function flyToAirport(
    airport,
    altitude = 80000
) {

    if (
        !globeViewer ||
        !airport
    ) {

        return;
    }


    globeViewer.camera.flyTo({

        destination:
            Cesium.Cartesian3.fromDegrees(

                airport.longitude,

                airport.latitude,

                altitude

            ),

        duration:
            1.5

    });

}


/* =========================================================
   DRAW AIRPORT MARKER
   ========================================================= */

function drawAirportMarker(
    airport,
    color,
    label
) {

    if (
        !globeViewer ||
        !airport
    ) {

        return null;
    }


    const position =
        Cesium.Cartesian3.fromDegrees(

            airport.longitude,

            airport.latitude,

            3000

        );


    return globeViewer.entities.add({

        position:
            position,

        point: {

            pixelSize:
                12,

            color:
                color,

            outlineColor:
                Cesium.Color.WHITE,

            outlineWidth:
                2

        },

        label: {

            text:
                label ||
                airport.code,

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
                    -14
                )

        }

    });

}


/* =========================================================
   DRAW RUNWAY
   ========================================================= */

function drawRunway(
    runway,
    airport
) {

    if (
        !globeViewer ||
        !runway ||
        !airport
    ) {

        return null;
    }


    const heading =
        Number(
            runway.heading ||
            runway.bearing ||
            0
        );


    const lengthMeters =
        Number(
            runway.length_m ||
            runway.length ||
            2500
        );


    const halfLength =
        lengthMeters /
        2;


    const earthRadius =
        6371000;


    const headingRadians =
        heading *
        Math.PI /
        180;


    const lat =
        airport.latitude *
        Math.PI /
        180;


    const lon =
        airport.longitude *
        Math.PI /
        180;


    const angularDistance =
        halfLength /
        earthRadius;


    const startLat =
        Math.asin(

            Math.sin(lat) *
            Math.cos(angularDistance) -

            Math.cos(lat) *
            Math.sin(angularDistance) *
            Math.cos(headingRadians)

        );


    const startLon =
        lon +

        Math.atan2(

            Math.sin(
                headingRadians
            ) *
            Math.sin(
                angularDistance
            ) *
            Math.cos(lat),

            Math.cos(
                angularDistance
            ) -

            Math.sin(lat) *
            Math.sin(startLat)

        );


    const endHeading =
        headingRadians +
        Math.PI;


    const endLat =
        Math.asin(

            Math.sin(lat) *
            Math.cos(angularDistance) -

            Math.cos(lat) *
            Math.sin(angularDistance) *
            Math.cos(endHeading)

        );


    const endLon =
        lon +

        Math.atan2(

            Math.sin(
                endHeading
            ) *
            Math.sin(
                angularDistance
            ) *
            Math.cos(lat),

            Math.cos(
                angularDistance
            ) -

            Math.sin(lat) *
            Math.sin(endLat)

        );


    const start =
        Cesium.Cartesian3.fromDegrees(

            startLon *
            180 /
            Math.PI,

            startLat *
            180 /
            Math.PI,

            100

        );


    const end =
        Cesium.Cartesian3.fromDegrees(

            endLon *
            180 /
            Math.PI,

            endLat *
            180 /
            Math.PI,

            100

        );


    return globeViewer.entities.add({

        polyline: {

            positions:
                [
                    start,
                    end
                ],

            width:
                8,

            material:
                Cesium.Color.YELLOW,

            clampToGround:
                true

        }

    });

}


/* =========================================================
   DRAW ROUTE
   ========================================================= */

function drawRoute(
    points,
    options = {}
) {

    if (
        !globeViewer ||
        !Array.isArray(points) ||
        points.length < 2
    ) {

        return null;
    }


    const height =
        Number(
            options.height ||
            100000
        );


    const positions =
        points.map(
            point =>
                Cesium.Cartesian3.fromDegrees(

                    Number(
                        point.longitude
                    ),

                    Number(
                        point.latitude
                    ),

                    Number(
                        point.altitude ||
                        height
                    )

                )
        );


    return globeViewer.entities.add({

        polyline: {

            positions:
                positions,

            width:
                options.width ||
                4,

            material:
                options.material ||
                Cesium.Color.CYAN,

            clampToGround:
                false

        }

    });

}


/* =========================================================
   DRAW ROUTE WAYPOINT MARKERS
   ========================================================= */

function drawWaypointMarkers(
    points
) {

    if (
        !globeViewer ||
        !Array.isArray(points)
    ) {

        return;
    }


    points.forEach(
        (
            point,
            index
        ) => {

            if (
                point.latitude ===
                undefined ||
                point.longitude ===
                undefined
            ) {

                return;
            }


            const position =
                Cesium.Cartesian3.fromDegrees(

                    Number(
                        point.longitude
                    ),

                    Number(
                        point.latitude
                    ),

                    Number(
                        point.altitude ||
                        100000
                    )

                );


            globeViewer.entities.add({

                position:
                    position,

                point: {

                    pixelSize:
                        7,

                    color:
                        Cesium.Color.ORANGE,

                    outlineColor:
                        Cesium.Color.WHITE,

                    outlineWidth:
                        1

                },

                label: {

                    text:
                        point.ident ||
                        point.name ||
                        `WPT ${index + 1}`,

                    font:
                        "12px Arial",

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
                            -8
                        )

                }

            });

        }
    );

}


/* =========================================================
   FIT CAMERA TO ROUTE
   ========================================================= */

function fitCameraToPoints(
    points
) {

    if (
        !globeViewer ||
        !Array.isArray(points) ||
        points.length === 0
    ) {

        return;
    }


    const positions =
        points.map(
            point =>
                Cesium.Cartesian3.fromDegrees(

                    Number(
                        point.longitude
                    ),

                    Number(
                        point.latitude
                    ),

                    Number(
                        point.altitude ||
                        100000
                    )

                )
        );


    const boundingSphere =
        Cesium.BoundingSphere.fromPoints(
            positions
        );


    globeViewer.camera.flyToBoundingSphere(

        boundingSphere,

        {

            duration:
                1.5,

            offset:
                new Cesium.HeadingPitchRange(

                    0,

                    -Cesium.Math.PI_OVER_TWO,

                    boundingSphere.radius *
                    2.2

                )

        }

    );

}


/* =========================================================
   DRAW AIRPORTS + GREAT CIRCLE
   ========================================================= */

function displayBasicRoute(
    departure,
    destination
) {

    if (
        !departure ||
        !destination
    ) {

        return;
    }


    clearGlobe();


    drawAirportMarker(

        departure,

        Cesium.Color.LIME,

        `DEP ${departure.code}`

    );


    drawAirportMarker(

        destination,

        Cesium.Color.RED,

        `DEST ${destination.code}`

    );


    const points =
        generateGreatCirclePoints(

            departure.latitude,

            departure.longitude,

            destination.latitude,

            destination.longitude,

            100

        );


    drawRoute(
        points,
        {
            height:
                100000,

            width:
                4,

            material:
                Cesium.Color.CYAN
        }
    );


    /*
     Only show intermediate markers
     at a limited interval.
     */

    const markerPoints =
        points.filter(
            (
                point,
                index
            ) =>
                index % 10 === 0 &&
                index !== 0 &&
                index !== points.length - 1
        );


    drawWaypointMarkers(
        markerPoints
    );


    fitCameraToPoints(
        [
            {

                latitude:
                    departure.latitude,

                longitude:
                    departure.longitude,

                altitude:
                    100000

            },

            {

                latitude:
                    destination.latitude,

                longitude:
                    destination.longitude,

                altitude:
                    100000

            }

        ]
    );

}


/* =========================================================
   AIRPORT RUNWAY DATA
   ========================================================= */

async function getAirportRunways(
    airportCode
) {

    /*
     Primary source used by the procedure
     layer can be replaced later with our
     normalized navigation database.

     The function deliberately returns an
     empty array when the external service
     is unavailable.
     */

    try {

        const url =
            `https://airportdb.io/api/v1/airport/${encodeURIComponent(
                airportCode
            )}`;

        /*
         No API key is embedded here.
         This function is only a compatibility
         hook for the navigation-data layer.
         */

        console.log(
            "Runway data requested for:",
            airportCode
        );


        return [];


    } catch (
        error
    ) {

        console.error(
            "Runway lookup failed:",
            error
        );


        return [];

    }

}


/* =========================================================
   NORMALIZE NAVIGATION POINT
   ========================================================= */

function normalizeNavigationPoint(
    point
) {

    if (
        !point
    ) {

        return null;
    }


    const latitude =
        Number(
            point.latitude ??
            point.lat
        );


    const longitude =
        Number(
            point.longitude ??
            point.lon ??
            point.lng
        );


    if (
        !Number.isFinite(
            latitude
        ) ||
        !Number.isFinite(
            longitude
        )
    ) {

        return null;
    }


    return {

        ident:
            point.ident ||
            point.name ||
            point.fix ||
            "",

        name:
            point.name ||
            point.ident ||
            "",

        type:
            point.type ||
            point.fixType ||
            "FIX",

        latitude:
            latitude,

        longitude:
            longitude,

        altitude:
            Number(
                point.altitude ??
                point.alt ??
                0
            ),

        speed:
            Number(
                point.speed ??
                point.speedLimit ??
                0
            ),

        speedUnit:
            point.speedUnit ||
            "KT",

        altitudeConstraint:
            point.altitudeConstraint ||
            null,

        speedConstraint:
            point.speedConstraint ||
            null

    };

}


/* =========================================================
   NORMALIZE PROCEDURE
   ========================================================= */

function normalizeProcedure(
    procedure
) {

    if (
        !procedure
    ) {

        return null;
    }


    const points =
        Array.isArray(
            procedure.points
        )
            ? procedure.points
                .map(
                    normalizeNavigationPoint
                )
                .filter(
                    Boolean
                )
            : [];


    return {

        id:
            procedure.id ||
            procedure.ident ||
            procedure.name ||
            "",

        name:
            procedure.name ||
            procedure.ident ||
            "",

        type:
            procedure.type ||
            "PROCEDURE",

        runway:
            procedure.runway ||
            null,

        transition:
            procedure.transition ||
            null,

        points:
            points

    };

}


/* =========================================================
   NAVIGATION DATABASE STATE
   ========================================================= */

const navigationState = {

    loaded:
        false,

    source:
        "local",

    airac:
        null,

    airports:
        {},

    procedures:
        {},

    waypoints:
        {},

    airways:
        {}

};


/* =========================================================
   LOAD LOCAL NAVIGATION DATABASE
   ========================================================= */

async function loadNavigationDatabase() {

    try {

        const response =
            await fetch(
                "navdata.json",
                {
                    cache:
                        "no-store"
                }
            );


        if (
            !response.ok
        ) {

            console.warn(
                "navdata.json not available."
            );

            navigationState.loaded =
                false;

            return false;

        }


        const data =
            await response.json();


        navigationState.airac =
            data.airac ||
            null;


        navigationState.airports =
            data.airports ||
            {};


        navigationState.procedures =
            data.procedures ||
            {};


        navigationState.waypoints =
            data.waypoints ||
            {};


        navigationState.airways =
            data.airways ||
            {};


        navigationState.loaded =
            true;


        console.log(
            "Navigation database loaded:",
            navigationState
        );


        updateNavigationStatus();


        return true;


    } catch (
        error
    ) {

        console.warn(
            "Navigation database could not be loaded:",
            error
        );


        navigationState.loaded =
            false;


        updateNavigationStatus();


        return false;

    }

}


/* =========================================================
   NAVIGATION STATUS
   ========================================================= */

function updateNavigationStatus() {

    const element =
        document.getElementById(
            "navigationStatus"
        );


    if (
        !element
    ) {

        return;
    }


    if (
        navigationState.loaded
    ) {

        element.textContent =
            navigationState.airac
                ? `Navigation database: AIRAC ${navigationState.airac}`
                : "Navigation database loaded.";

    } else {

        element.textContent =
            "Navigation database not installed. Manual route mode available.";

    }

}


/* =========================================================
   GET AIRPORT NAVIGATION DATA
   ========================================================= */

function getNavigationAirport(
    icao
) {

    if (
        !icao
    ) {

        return null;
    }


    const code =
        icao
            .trim()
            .toUpperCase();


    return (
        navigationState.airports[
            code
        ] ||
        null
    );

}


/* =========================================================
   GET PROCEDURES FOR AIRPORT
   ========================================================= */

function getAirportProcedures(
    icao
) {

    const airport =
        getNavigationAirport(
            icao
        );


    if (
        !airport
    ) {

        return {

            departures:
                [],

            arrivals:
                [],

            approaches:
                []

        };

    }


    return {

        departures:
            (
                airport.departures ||
                []
            )
                .map(
                    normalizeProcedure
                )
                .filter(
                    Boolean
                ),

        arrivals:
            (
                airport.arrivals ||
                airport.stars ||
                []
            )
                .map(
                    normalizeProcedure
                )
                .filter(
                    Boolean
                ),

        approaches:
            (
                airport.approaches ||
                []
            )
                .map(
                    normalizeProcedure
                )
                .filter(
                    Boolean
                )

    };

}


/* =========================================================
   GET AIRPORT RUNWAYS FROM NAVDATA
   ========================================================= */

function getNavigationRunways(
    icao
) {

    const airport =
        getNavigationAirport(
            icao
        );


    if (
        !airport
    ) {

        return [];

    }


    return (
        airport.runways ||
        []
    );

}


/* =========================================================
   FIND PROCEDURE BY ID
   ========================================================= */

function findProcedure(
    airportCode,
    procedureId
) {

    const procedures =
        getAirportProcedures(
            airportCode
        );


    const all =
        [
            ...procedures.departures,

            ...procedures.arrivals,

            ...procedures.approaches

        ];


    return (
        all.find(
            procedure =>
                procedure.id ===
                procedureId ||
                procedure.name ===
                procedureId
        ) ||
        null
    );

}


/* =========================================================
   DRAW PROCEDURE PREVIEW
   ========================================================= */

function drawProcedurePreview(
    procedure,
    options = {}
) {

    if (
        !procedure ||
        !Array.isArray(
            procedure.points
        ) ||
        procedure.points.length < 2
    ) {

        return false;
    }


    clearGlobe();


    const points =
        procedure.points
            .map(
                normalizeNavigationPoint
            )
            .filter(
                Boolean
            );


    if (
        points.length < 2
    ) {

        return false;
    }


    const material =
        options.material ||
        Cesium.Color.YELLOW;


    const altitudePoints =
        points.map(
            point => ({

                ...point,

                altitude:
                    point.altitude > 0
                        ? point.altitude * 0.3048
                        : 3000

            })
        );


    drawRoute(

        altitudePoints,

        {

            height:
                3000,

            width:
                6,

            material:
                material

        }

    );


    drawWaypointMarkers(
        altitudePoints
    );


    fitCameraToPoints(
        altitudePoints
    );


    return true;

}


/* =========================================================
   BUILD INTERNAL FLIGHT PLAN
   ========================================================= */

function buildInternalFlightPlan() {

    const plan = {

        version:
            "1.0",

        created:
            new Date().toISOString(),

        aircraft:
            getSelectedAircraft(),

        departure:
            departureAirport,

        departureRunway:
            null,

        sid:
            null,

        route:
            [],

        airways:
            [],

        star:
            null,

        approach:
            null,

        arrivalRunway:
            null,

        performance:
            currentPerformance

    };


    /*
     Add manual/current waypoints.
     */

    plan.route =
        routeWaypoints.map(
            point => ({

                ...point

            })
        );


    return plan;

}


/* =========================================================
   EXPORT INTERNAL PLAN AS JSON
   ========================================================= */

function exportFlightPlanJSON() {

    const plan =
        buildInternalFlightPlan();


    const blob =
        new Blob(

            [
                JSON.stringify(
                    plan,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }

        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "v1-flight-plan.json";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   EXPORT X-PLANE FMS
   ========================================================= */

function exportXPlaneFMS() {

    const plan =
        buildInternalFlightPlan();


    const lines = [];


    lines.push(
        "I"
    );


    lines.push(
        "1100 Version"
    );


    lines.push(
        "CYCLE 0"
    );


    lines.push(
        "CYCLE 0"
    );


    lines.push(
        "0"
    );


    if (
        plan.departure
    ) {

        lines.push(

            `1 ${plan.departure.code} ADEP`

        );

    }


    plan.route.forEach(
        point => {

            const lat =
                Number(
                    point.latitude
                );


            const lon =
                Number(
                    point.longitude
                );


            const altitude =
                Math.round(
                    Number(
                        point.altitude ||
                        0
                    )
                );


            const ident =
                point.ident ||
                point.name ||
                "WPT";


            lines.push(

                `11 ${ident} ${lat.toFixed(6)} ${lon.toFixed(6)} ${altitude}`

            );

        }
    );


    if (
        plan.destination
    ) {

        lines.push(

            `1 ${plan.destination.code} ADES`

        );

    }


    const blob =
        new Blob(

            [
                lines.join(
                    "\n"
                )
            ],

            {
                type:
                    "text/plain"
            }

        );


    downloadBlob(
        blob,
        "v1-flight-plan.fms"
    );

}


/* =========================================================
   DOWNLOAD BLOB
   ========================================================= */

function downloadBlob(
    blob,
    filename
) {

    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    setTimeout(
        () =>
            URL.revokeObjectURL(
                url
            ),
        1000
    );

}
/* =========================================================
   ROUTE WAYPOINT MANAGEMENT
   ========================================================= */

function addWaypoint(
    waypoint
) {

    const normalized =
        normalizeNavigationPoint(
            waypoint
        );


    if (
        !normalized
    ) {

        return false;
    }


    routeWaypoints.push(
        normalized
    );


    updateWaypointList();

    redrawCurrentRoute();

    updateFlightInformation();


    return true;

}


/* =========================================================
   REMOVE WAYPOINT
   ========================================================= */

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


    updateWaypointList();

    redrawCurrentRoute();

    updateFlightInformation();

}


/* =========================================================
   MOVE WAYPOINT UP
   ========================================================= */

function moveWaypointUp(
    index
) {

    if (
        index <= 0 ||
        index >= routeWaypoints.length
    ) {

        return;
    }


    const temp =
        routeWaypoints[
            index - 1
        ];


    routeWaypoints[
        index - 1
    ] =
        routeWaypoints[
            index
        ];


    routeWaypoints[
        index
    ] =
        temp;


    updateWaypointList();

    redrawCurrentRoute();

    updateFlightInformation();

}


/* =========================================================
   MOVE WAYPOINT DOWN
   ========================================================= */

function moveWaypointDown(
    index
) {

    if (
        index < 0 ||
        index >=
            routeWaypoints.length - 1
    ) {

        return;
    }


    const temp =
        routeWaypoints[
            index + 1
        ];


    routeWaypoints[
        index + 1
    ] =
        routeWaypoints[
            index
        ];


    routeWaypoints[
        index
    ] =
        temp;


    updateWaypointList();

    redrawCurrentRoute();

    updateFlightInformation();

}


/* =========================================================
   UPDATE WAYPOINT LIST UI
   ========================================================= */

function updateWaypointList() {

    const container =
        document.getElementById(
            "waypointList"
        );


    if (
        !container
    ) {

        return;
    }


    container.innerHTML =
        "";


    if (
        routeWaypoints.length === 0
    ) {

        const empty =
            document.createElement(
                "div"
            );


        empty.className =
            "waypoint-empty";


        empty.textContent =
            "No en-route waypoints added.";


        container.appendChild(
            empty
        );


        return;
    }


    routeWaypoints.forEach(
        (
            waypoint,
            index
        ) => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "waypoint-row";


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "waypoint-number";


            number.textContent =
                index + 1;


            const details =
                document.createElement(
                    "div"
                );


            details.className =
                "waypoint-details";


            const ident =
                document.createElement(
                    "strong"
                );


            ident.textContent =
                waypoint.ident ||
                waypoint.name ||
                `WPT ${index + 1}`;


            const metadata =
                document.createElement(
                    "small"
                );


            const altitudeText =
                waypoint.altitude
                    ? `${formatNumber(
                        waypoint.altitude
                    )} ft`
                    : "No altitude";


            const speedText =
                waypoint.speed
                    ? `${waypoint.speed} kt`
                    : "No speed";


            metadata.textContent =
                `${waypoint.type || "FIX"} • ${altitudeText} • ${speedText}`;


            details.appendChild(
                ident
            );


            details.appendChild(
                metadata
            );


            const controls =
                document.createElement(
                    "div"
                );


            controls.className =
                "waypoint-controls";


            const upButton =
                createSmallButton(
                    "↑",
                    () =>
                        moveWaypointUp(
                            index
                        )
                );


            const downButton =
                createSmallButton(
                    "↓",
                    () =>
                        moveWaypointDown(
                            index
                        )
                );


            const deleteButton =
                createSmallButton(
                    "×",
                    () =>
                        removeWaypoint(
                            index
                        )
                );


            controls.appendChild(
                upButton
            );


            controls.appendChild(
                downButton
            );


            controls.appendChild(
                deleteButton
            );


            row.appendChild(
                number
            );


            row.appendChild(
                details
            );


            row.appendChild(
                controls
            );


            container.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   SMALL BUTTON CREATOR
   ========================================================= */

function createSmallButton(
    text,
    callback
) {

    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.textContent =
        text;


    button.className =
        "small-button";


    button.addEventListener(
        "click",
        callback
    );


    return button;

}


/* =========================================================
   ADD WAYPOINT FROM INPUTS
   ========================================================= */

function addWaypointFromInputs() {

    const identElement =
        document.getElementById(
            "waypointIdent"
        );


    const latitudeElement =
        document.getElementById(
            "waypointLatitude"
        );


    const longitudeElement =
        document.getElementById(
            "waypointLongitude"
        );


    const altitudeElement =
        document.getElementById(
            "waypointAltitude"
        );


    const speedElement =
        document.getElementById(
            "waypointSpeed"
        );


    if (
        !latitudeElement ||
        !longitudeElement
    ) {

        return;
    }


    const ident =
        identElement
            ? identElement.value
                .trim()
                .toUpperCase()
            : "";


    const latitude =
        parseFloat(
            latitudeElement.value
        );


    const longitude =
        parseFloat(
            longitudeElement.value
        );


    const altitude =
        altitudeElement
            ? parseFloat(
                altitudeElement.value
            )
            : 0;


    const speed =
        speedElement
            ? parseFloat(
                speedElement.value
            )
            : 0;


    if (
        !Number.isFinite(
            latitude
        ) ||
        !Number.isFinite(
            longitude
        )
    ) {

        setStatus(
            "Enter valid waypoint coordinates."
        );

        return;
    }


    if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
    ) {

        setStatus(
            "Waypoint coordinates are outside valid limits."
        );

        return;
    }


    addWaypoint({

        ident:
            ident ||
            `WPT${routeWaypoints.length + 1}`,

        type:
            "FIX",

        latitude:
            latitude,

        longitude:
            longitude,

        altitude:
            Number.isFinite(
                altitude
            )
                ? altitude
                : 0,

        speed:
            Number.isFinite(
                speed
            )
                ? speed
                : 0

    });


    if (
        identElement
    ) {

        identElement.value =
            "";

    }


    if (
        latitudeElement
    ) {

        latitudeElement.value =
            "";

    }


    if (
        longitudeElement
    ) {

        longitudeElement.value =
            "";

    }


    if (
        altitudeElement
    ) {

        altitudeElement.value =
            "";

    }


    if (
        speedElement
    ) {

        speedElement.value =
            "";

    }

}


/* =========================================================
   SET STATUS
   ========================================================= */

function setStatus(
    message
) {

    const status =
        document.getElementById(
            "status"
        );


    if (
        status
    ) {

        status.textContent =
            message;

    }

}


/* =========================================================
   UPDATE FLIGHT INFORMATION
   ========================================================= */

function updateFlightInformation() {

    if (
        !departureAirport ||
        !destinationAirport
    ) {

        return;
    }


    const routePoints = [

        {

            latitude:
                departureAirport.latitude,

            longitude:
                departureAirport.longitude,

            altitude:
                departureAirport.elevation

        },

        ...routeWaypoints,

        {

            latitude:
                destinationAirport.latitude,

            longitude:
                destinationAirport.longitude,

            altitude:
                destinationAirport.elevation

        }

    ];


    let totalDistance =
        0;


    for (
        let i = 1;
        i < routePoints.length;
        i++
    ) {

        totalDistance +=
            calculateDistance(

                routePoints[
                    i - 1
                ].latitude,

                routePoints[
                    i - 1
                ].longitude,

                routePoints[
                    i
                ].latitude,

                routePoints[
                    i
                ].longitude

            );

    }


    displayText(

        "distance",

        `${Math.round(
            totalDistance
        ).toLocaleString()} NM`

    );


    const initialBearing =
        calculateInitialBearing(

            departureAirport.latitude,

            departureAirport.longitude,

            routePoints.length > 1
                ? routePoints[1].latitude
                : destinationAirport.latitude,

            routePoints.length > 1
                ? routePoints[1].longitude
                : destinationAirport.longitude

        );


    const finalBearing =
        calculateFinalBearing(

            routePoints[
                routePoints.length - 2
            ].latitude,

            routePoints[
                routePoints.length - 2
            ].longitude,

            destinationAirport.latitude,

            destinationAirport.longitude

        );


    displayText(

        "initialBearing",

        `${Math.round(
            initialBearing
        ).toString().padStart(
            3,
            "0"
        )}°T`

    );


    displayText(

        "finalBearing",

        `${Math.round(
            finalBearing
        ).toString().padStart(
            3,
            "0"
        )}°T`

    );


    displayText(

        "routePoints",

        routePoints.length

    );


    /*
     Estimated time.

     Uses aircraft cruise speed as a
     simple simulator estimate.
     */

    const aircraft =
        getSelectedAircraft();


    if (
        aircraft &&
        aircraft.cruiseSpeed > 0
    ) {

        const hours =
            totalDistance /
            aircraft.cruiseSpeed;


        const minutes =
            Math.round(
                hours *
                60
            );


        const estimatedTime =
            formatFlightTime(
                minutes
            );


        displayText(

            "estimatedTime",

            estimatedTime

        );

    }


    /*
     Simple fuel estimate.

     This remains deliberately conservative
     and simulator-oriented.
     */

    if (
        aircraft
    ) {

        const fuelBurnPerHour =
            estimateFuelBurn(
                aircraft
            );


        const estimatedFuel =
            (
                totalDistance /
                aircraft.cruiseSpeed
            ) *
            fuelBurnPerHour;


        displayText(

            "estimatedFuel",

            `${formatNumber(
                Math.round(
                    estimatedFuel
                )
            )} kg`

        );

    }

}


/* =========================================================
   FORMAT FLIGHT TIME
   ========================================================= */

function formatFlightTime(
    totalMinutes
) {

    const hours =
        Math.floor(
            totalMinutes /
            60
        );


    const minutes =
        totalMinutes %
        60;


    return `${hours}h ${minutes}m`;

}


/* =========================================================
   ESTIMATE FUEL BURN
   ========================================================= */

function estimateFuelBurn(
    aircraft
) {

    if (
        !aircraft
    ) {

        return 0;
    }


    /*
     Very broad simulator estimate.

     Later this should be replaced with
     aircraft-specific performance data.
     */

    const jetFamilies = [

        "A320",
        "A320neo",
        "A330",
        "A330neo",
        "A340",
        "A350",
        "A380",
        "737 NG",
        "737 MAX",
        "747",
        "757",
        "767",
        "777",
        "787",
        "E-Jets",
        "E2",
        "C919",
        "CRJ"

    ];


    if (
        jetFamilies.includes(
            aircraft.family
        )
    ) {

        return Math.max(

            500,

            aircraft.mtow *
            0.025

        );

    }


    if (
        aircraft.family ===
        "ATR 42" ||
        aircraft.family ===
        "ATR 72"
    ) {

        return Math.max(

            250,

            aircraft.mtow *
            0.035

        );

    }


    return Math.max(

        300,

        aircraft.mtow *
        0.025

    );

}


/* =========================================================
   REDRAW CURRENT ROUTE
   ========================================================= */

function redrawCurrentRoute() {

    if (
        !globeViewer
    ) {

        return;
    }


    if (
        !departureAirport ||
        !destinationAirport
    ) {

        return;
    }


    clearGlobe();


    drawAirportMarker(

        departureAirport,

        Cesium.Color.LIME,

        `DEP ${departureAirport.code}`

    );


    drawAirportMarker(

        destinationAirport,

        Cesium.Color.RED,

        `DEST ${destinationAirport.code}`

    );


    const points = [

        {

            latitude:
                departureAirport.latitude,

            longitude:
                departureAirport.longitude,

            altitude:
                100000

        },

        ...routeWaypoints.map(
            point => ({

                ...point,

                altitude:
                    point.altitude ||
                    100000

            })
        ),

        {

            latitude:
                destinationAirport.latitude,

            longitude:
                destinationAirport.longitude,

            altitude:
                100000

        }

    ];


    drawRoute(

        points,

        {

            height:
                100000,

            width:
                5,

            material:
                Cesium.Color.CYAN

        }

    );


    drawWaypointMarkers(
        routeWaypoints
    );


    fitCameraToPoints(
        points
    );

}


/* =========================================================
   PLAN FLIGHT
   ========================================================= */

async function planFlight() {

    const departureInput =
        document.getElementById(
            "departure"
        );


    const destinationInput =
        document.getElementById(
            "destination"
        );


    if (
        !departureInput ||
        !destinationInput
    ) {

        console.error(
            "Departure/destination inputs not found."
        );

        return;
    }


    const departureCode =
        departureInput.value
            .trim()
            .toUpperCase();


    const destinationCode =
        destinationInput.value
            .trim()
            .toUpperCase();


    if (
        !departureCode ||
        !destinationCode
    ) {

        setStatus(
            "Enter both departure and destination airports."
        );

        return;
    }


    setStatus(
        "Looking up airports..."
    );


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


    if (
        !departure
    ) {

        setStatus(
            `Could not find ${departureCode}.`
        );

        return;
    }


    if (
        !destination
    ) {

        setStatus(
            `Could not find ${destinationCode}.`
        );

        return;
    }


    departureAirport =
        departure;


    destinationAirport =
        destination;


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


    displayText(

        "routeDeparture",

        departure.code

    );


    displayText(

        "routeDestination",

        destination.code

    );


    /*
     Show result card.
     */

    const result =
        document.getElementById(
            "result"
        );


    if (
        result
    ) {

        result.style.display =
            "block";

    }


    /*
     Clear old route.
     */

    routeWaypoints =
        [];


    updateWaypointList();


    /*
     Display basic route.
     */

    displayBasicRoute(

        departure,

        destination

    );


    updateFlightInformation();


    /*
     Try to load navigation information.
     */

    populateProcedureSelectors(
        departure.code,
        destination.code
    );


    setStatus(
        "Flight plan created successfully."
    );


    const globeStatus =
        document.getElementById(
            "globeStatus"
        );


    if (
        globeStatus
    ) {

        globeStatus.textContent =
            `${departure.code} → ${destination.code}`;

    }

}


/* =========================================================
   POPULATE PROCEDURE SELECTORS
   ========================================================= */

function populateProcedureSelectors(
    departureCode,
    destinationCode
) {

    const departureRunwaySelect =
        document.getElementById(
            "departureRunway"
        );


    const arrivalRunwaySelect =
        document.getElementById(
            "arrivalRunway"
        );


    const sidSelect =
        document.getElementById(
            "sidSelect"
        );


    const starSelect =
        document.getElementById(
            "starSelect"
        );


    const approachSelect =
        document.getElementById(
            "approachSelect"
        );


    /*
     Departure runways.
     */

    if (
        departureRunwaySelect
    ) {

        populateSelect(

            departureRunwaySelect,

            getNavigationRunways(
                departureCode
            ),

            "Select departure runway"

        );

    }


    /*
     Arrival runways.
     */

    if (
        arrivalRunwaySelect
    ) {

        populateSelect(

            arrivalRunwaySelect,

            getNavigationRunways(
                destinationCode
            ),

            "Select arrival runway"

        );

    }


    const departureProcedures =
        getAirportProcedures(
            departureCode
        );


    const arrivalProcedures =
        getAirportProcedures(
            destinationCode
        );


    if (
        sidSelect
    ) {

        populateSelect(

            sidSelect,

            departureProcedures.departures,

            "Select SID"

        );

    }


    if (
        starSelect
    ) {

        populateSelect(

            starSelect,

            arrivalProcedures.arrivals,

            "Select STAR"

        );

    }


    if (
        approachSelect
    ) {

        populateSelect(

            approachSelect,

            arrivalProcedures.approaches,

            "Select approach"

        );

    }

}


/* =========================================================
   GENERIC SELECT POPULATOR
   ========================================================= */

function populateSelect(
    select,
    items,
    placeholder
) {

    select.innerHTML =
        "";


    const firstOption =
        document.createElement(
            "option"
        );


    firstOption.value =
        "";


    firstOption.textContent =
        placeholder;


    select.appendChild(
        firstOption
    );


    if (
        !Array.isArray(
            items
        )
    ) {

        return;
    }


    items.forEach(
        item => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                item.id ||
                item.ident ||
                item.name;


            option.textContent =
                item.name ||
                item.ident ||
                item.id;


            select.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   HANDLE DEPARTURE RUNWAY
   ========================================================= */

function handleDepartureRunwayChange() {

    const select =
        document.getElementById(
            "departureRunway"
        );


    if (
        !select ||
        !departureAirport
    ) {

        return;
    }


    const runwayId =
        select.value;


    if (
        !runwayId
    ) {

        redrawCurrentRoute();

        return;
    }


    const runways =
        getNavigationRunways(
            departureAirport.code
        );


    const runway =
        runways.find(
            item =>
                String(
                    item.id ||
                    item.ident ||
                    item.name
                ) ===
                String(
                    runwayId
                )
        );


    if (
        !runway
    ) {

        return;
    }


    clearGlobe();


    drawAirportMarker(

        departureAirport,

        Cesium.Color.LIME,

        `DEP ${departureAirport.code}`

    );


    drawAirportMarker(

        destinationAirport,

        Cesium.Color.RED,

        `DEST ${destinationAirport.code}`

    );


    drawRunway(

        runway,

        departureAirport

    );


    /*
     Keep destination visible but focus
     primarily on the departure airport.
     */

    flyToAirport(

        departureAirport,

        60000

    );


    setStatus(
        `Departure runway selected: ${
            runway.name ||
            runway.ident ||
            runwayId
        }`
    );

}


/* =========================================================
   HANDLE ARRIVAL RUNWAY
   ========================================================= */

function handleArrivalRunwayChange() {

    const select =
        document.getElementById(
            "arrivalRunway"
        );


    if (
        !select ||
        !destinationAirport
    ) {

        return;
    }


    const runwayId =
        select.value;


    if (
        !runwayId
    ) {

        redrawCurrentRoute();

        return;

    }


    const runways =
        getNavigationRunways(
            destinationAirport.code
        );


    const runway =
        runways.find(
            item =>
                String(
                    item.id ||
                    item.ident ||
                    item.name
                ) ===
                String(
                    runwayId
                )
        );


    if (
        !runway
    ) {

        return;
    }


    clearGlobe();


    drawAirportMarker(

        departureAirport,

        Cesium.Color.LIME,

        `DEP ${departureAirport.code}`

    );


    drawAirportMarker(

        destinationAirport,

        Cesium.Color.RED,

        `DEST ${destinationAirport.code}`

    );


    drawRunway(

        runway,

        destinationAirport

    );


    flyToAirport(

        destinationAirport,

        60000

    );


    setStatus(
        `Arrival runway selected: ${
            runway.name ||
            runway.ident ||
            runwayId
        }`
    );

}


/* =========================================================
   HANDLE SID SELECTION
   ========================================================= */

function handleSIDChange() {

    const select =
        document.getElementById(
            "sidSelect"
        );


    if (
        !select ||
        !departureAirport
    ) {

        return;
    }


    const procedureId =
        select.value;


    if (
        !procedureId
    ) {

        redrawCurrentRoute();

        return;
    }


    const procedure =
        findProcedure(

            departureAirport.code,

            procedureId

        );


    if (
        !procedure
    ) {

        setStatus(
            "SID data is not available in the installed navigation database."
        );

        return;
    }


    const success =
        drawProcedurePreview(

            procedure,

            {

                material:
                    Cesium.Color.YELLOW

            }

        );


    if (
        success
    ) {

        setStatus(
            `SID preview: ${procedure.name}`
        );

    }

}


/* =========================================================
   HANDLE STAR SELECTION
   ========================================================= */

function handleSTARChange() {

    const select =
        document.getElementById(
            "starSelect"
        );


    if (
        !select ||
        !destinationAirport
    ) {

        return;
    }


    const procedureId =
        select.value;


    if (
        !procedureId
    ) {

        redrawCurrentRoute();

        return;
    }


    const procedure =
        findProcedure(

            destinationAirport.code,

            procedureId

        );


    if (
        !procedure
    ) {

        setStatus(
            "STAR data is not available in the installed navigation database."
        );

        return;
    }


    const success =
        drawProcedurePreview(

            procedure,

            {

                material:
                    Cesium.Color.ORANGE

            }

        );


    if (
        success
    ) {

        setStatus(
            `STAR preview: ${procedure.name}`
        );

    }

}


/* =========================================================
   HANDLE APPROACH SELECTION
   ========================================================= */

function handleApproachChange() {

    const select =
        document.getElementById(
            "approachSelect"
        );


    if (
        !select ||
        !destinationAirport
    ) {

        return;
    }


    const procedureId =
        select.value;


    if (
        !procedureId
    ) {

        redrawCurrentRoute();

        return;
    }


    const procedure =
        findProcedure(

            destinationAirport.code,

            procedureId

        );


    if (
        !procedure
    ) {

        setStatus(
            "Approach data is not available in the installed navigation database."
        );

        return;
    }


    const success =
        drawProcedurePreview(

            procedure,

            {

                material:
                    Cesium.Color.LIME

            }

        );


    if (
        success
    ) {

        setStatus(
            `Approach preview: ${procedure.name}`
        );

    }

}


/* =========================================================
   LOAD REAL SIMULATOR ROUTE
   ========================================================= */

async function loadRealSimulatorRoute() {

    if (
        !departureAirport ||
        !destinationAirport
    ) {

        setStatus(
            "Plan the flight first."
        );

        return;
    }


    setStatus(
        "Searching for a real simulator route..."
    );


    /*
     FlightPlanDatabase API endpoint.

     This is used as a route-source integration
     point. If the endpoint changes or requires
     authentication, the planner falls back
     gracefully.
     */

    const url =
        `https://api.flightplandatabase.com/search/plans?fromICAO=${encodeURIComponent(
            departureAirport.code
        )}&toICAO=${encodeURIComponent(
            destinationAirport.code
        )}&limit=10`;


    try {

        const response =
            await fetch(
                url
            );


        if (
            !response.ok
        ) {

            throw new Error(
                `HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        if (
            !Array.isArray(
                data
            ) ||
            data.length === 0
        ) {

            setStatus(
                "No published simulator route was found."
            );

            return;

        }


        const selected =
            data[0];


        const nodes =
            selected.nodes ||
            selected.route ||
            [];


        const normalized =
            nodes
                .map(
                    node => {

                        if (
                            node.latitude !==
                            undefined
                        ) {

                            return normalizeNavigationPoint(
                                node
                            );

                        }


                        return null;

                    }
                )
                .filter(
                    Boolean
                );


        if (
            normalized.length === 0
        ) {

            setStatus(
                "A route was found, but it did not contain usable coordinates."
            );

            return;

        }


        routeWaypoints =
            normalized;


        updateWaypointList();

        redrawCurrentRoute();

        updateFlightInformation();


        setStatus(
            `Loaded ${normalized.length} real navigation points from the simulator route.`
        );


    } catch (
        error
    ) {

        console.error(
            "Real route lookup failed:",
            error
        );


        setStatus(
            "Real route service unavailable. Manual route mode remains available."
        );

    }

}


/* =========================================================
   CLEAR FLIGHT PLAN
   ========================================================= */

function clearFlightPlan() {

    departureAirport =
        null;


    destinationAirport =
        null;


    routeWaypoints =
        [];


    currentPerformance =
        null;


    clearGlobe();


    updateWaypointList();


    [
        "routeDeparture",
        "routeDestination",
        "depCode",
        "depName",
        "depLocation",
        "destCode",
        "destName",
        "destLocation",
        "distance",
        "initialBearing",
        "finalBearing",
        "routePoints",
        "estimatedTime",
        "estimatedFuel"
    ].forEach(
        id => {

            displayText(
                id,
                "—"
            );

        }
    );


    const result =
        document.getElementById(
            "result"
        );


    if (
        result
    ) {

        result.style.display =
            "none";

    }


    setStatus(
        "Flight plan cleared."
    );

}


/* =========================================================
   ADD PROCEDURE TO INTERNAL ROUTE
   ========================================================= */

function addProcedureToRoute(
    procedure
) {

    if (
        !procedure ||
        !Array.isArray(
            procedure.points
        )
    ) {

        return;
    }


    procedure.points.forEach(
        point => {

            const normalized =
                normalizeNavigationPoint(
                    point
                );


            if (
                normalized
            ) {

                routeWaypoints.push(
                    normalized
                );

            }

        }
    );


    updateWaypointList();

    redrawCurrentRoute();

    updateFlightInformation();

}


/* =========================================================
   BUILD COMPLETE PROCEDURE ROUTE
   ========================================================= */

function buildProcedureRoute() {

    if (
        !departureAirport ||
        !destinationAirport
    ) {

        return [];
    }


    const points = [];


    points.push({

        ident:
            departureAirport.code,

        type:
            "AIRPORT",

        latitude:
            departureAirport.latitude,

        longitude:
            departureAirport.longitude,

        altitude:
            departureAirport.elevation

    });


    /*
     Add selected SID.
     */

    const sidSelect =
        document.getElementById(
            "sidSelect"
        );


    if (
        sidSelect &&
        sidSelect.value
    ) {

        const sid =
            findProcedure(

                departureAirport.code,

                sidSelect.value

            );


        if (
            sid
        ) {

            sid.points.forEach(
                point =>
                    points.push(
                        normalizeNavigationPoint(
                            point
                        )
                    )
            );

        }

    }


    /*
     Add en-route waypoints.
     */

    routeWaypoints.forEach(
        point =>
            points.push(
                normalizeNavigationPoint(
                    point
                )
            )
    );


    /*
     Add STAR.
     */

    const starSelect =
        document.getElementById(
            "starSelect"
        );


    if (
        starSelect &&
        starSelect.value
    ) {

        const star =
            findProcedure(

                destinationAirport.code,

                starSelect.value

            );


        if (
            star
        ) {

            star.points.forEach(
                point =>
                    points.push(
                        normalizeNavigationPoint(
                            point
                        )
                    )
            );

        }

    }


    /*
     Add approach.
     */

    const approachSelect =
        document.getElementById(
            "approachSelect"
        );


    if (
        approachSelect &&
        approachSelect.value
    ) {

        const approach =
            findProcedure(

                destinationAirport.code,

                approachSelect.value

            );


        if (
            approach
        ) {

            approach.points.forEach(
                point =>
                    points.push(
                        normalizeNavigationPoint(
                            point
                        )
                    )
            );

        }

    }


    points.push({

        ident:
            destinationAirport.code,

        type:
            "AIRPORT",

        latitude:
            destinationAirport.latitude,

        longitude:
            destinationAirport.longitude,

        altitude:
            destinationAirport.elevation

    });


    return points.filter(
        Boolean
    );

}


/* =========================================================
   DRAW COMPLETE PROCEDURE ROUTE
   ========================================================= */

function previewCompleteFlightPlan() {

    const points =
        buildProcedureRoute();


    if (
        points.length < 2
    ) {

        setStatus(
            "Not enough route information to preview the flight."
        );

        return;
    }


    clearGlobe();


    drawAirportMarker(

        departureAirport,

        Cesium.Color.LIME,

        `DEP ${departureAirport.code}`

    );


    drawAirportMarker(

        destinationAirport,

        Cesium.Color.RED,

        `DEST ${destinationAirport.code}`

    );


    const altitudePoints =
        points.map(
            point => ({

                ...point,

                altitude:
                    point.altitude > 0
                        ? point.altitude * 0.3048
                        : 100000

            })
        );


    drawRoute(

        altitudePoints,

        {

            width:
                5,

            material:
                Cesium.Color.CYAN

        }

    );


    drawWaypointMarkers(
        altitudePoints
    );


    fitCameraToPoints(
        altitudePoints
    );


    updateFlightInformation();


    setStatus(
        "Complete flight plan preview displayed."
    );

}


/* =========================================================
   INITIALIZE EVENT LISTENERS
   ========================================================= */

function initializeEventListeners() {

    const aircraft =
        document.getElementById(
            "aircraft"
        );


    if (
        aircraft
    ) {

        aircraft.addEventListener(

            "change",

            updateAircraftDisplay

        );

    }


    const payload =
        document.getElementById(
            "payload"
        );


    if (
        payload
    ) {

        payload.addEventListener(

            "input",

            calculateAndDisplayPerformance

        );

    }


    const fuel =
        document.getElementById(
            "fuel"
        );


    if (
        fuel
    ) {

        fuel.addEventListener(

            "input",

            calculateAndDisplayPerformance

        );

    }


    const departureRunway =
        document.getElementById(
            "departureRunway"
        );


    if (
        departureRunway
    ) {

        departureRunway.addEventListener(

            "change",

            handleDepartureRunwayChange

        );

    }


    const arrivalRunway =
        document.getElementById(
            "arrivalRunway"
        );


    if (
        arrivalRunway
    ) {

        arrivalRunway.addEventListener(

            "change",

            handleArrivalRunwayChange

        );

    }


    const sid =
        document.getElementById(
            "sidSelect"
        );


    if (
        sid
    ) {

        sid.addEventListener(

            "change",

            handleSIDChange

        );

    }


    const star =
        document.getElementById(
            "starSelect"
        );


    if (
        star
    ) {

        star.addEventListener(

            "change",

            handleSTARChange

        );

    }


    const approach =
        document.getElementById(
            "approachSelect"
        );


    if (
        approach
    ) {

        approach.addEventListener(

            "change",

            handleApproachChange

        );

    }


    const addWaypointButton =
        document.getElementById(
            "addWaypointButton"
        );


    if (
        addWaypointButton
    ) {

        addWaypointButton.addEventListener(

            "click",

            addWaypointFromInputs

        );

    }


    const realRouteButton =
        document.getElementById(
            "realRouteButton"
        );


    if (
        realRouteButton
    ) {

        realRouteButton.addEventListener(

            "click",

            loadRealSimulatorRoute

        );

    }


    const previewButton =
        document.getElementById(
            "previewCompleteButton"
        );


    if (
        previewButton
    ) {

        previewButton.addEventListener(

            "click",

            previewCompleteFlightPlan

        );

    }


    const clearButton =
        document.getElementById(
            "clearFlightButton"
        );


    if (
        clearButton
    ) {

        clearButton.addEventListener(

            "click",

            clearFlightPlan

        );

    }


    const jsonButton =
        document.getElementById(
            "exportJsonButton"
        );


    if (
        jsonButton
    ) {

        jsonButton.addEventListener(

            "click",

            exportFlightPlanJSON

        );

    }


    const fmsButton =
        document.getElementById(
            "exportFMSButton"
        );


    if (
        fmsButton
    ) {

        fmsButton.addEventListener(

            "click",

            exportXPlaneFMS

        );

    }

}


/* =========================================================
   GLOBAL BUTTON COMPATIBILITY
   ========================================================= */

window.planFlight =
    planFlight;


window.addWaypointFromInputs =
    addWaypointFromInputs;


window.removeWaypoint =
    removeWaypoint;


window.moveWaypointUp =
    moveWaypointUp;


window.moveWaypointDown =
    moveWaypointDown;


window.previewCompleteFlightPlan =
    previewCompleteFlightPlan;


window.loadRealSimulatorRoute =
    loadRealSimulatorRoute;


window.clearFlightPlan =
    clearFlightPlan;


window.exportFlightPlanJSON =
    exportFlightPlanJSON;


window.exportXPlaneFMS =
    exportXPlaneFMS;
/* =========================================================
   COMPLETE FLIGHT PLAN EXPORT
   ========================================================= */

function exportCompleteFlightPlanJSON() {

    const plan =
        buildInternalFlightPlan();


    const completeRoute =
        buildProcedureRoute();


    plan.route =
        completeRoute;


    /*
     Add selected procedure information.
     */

    const sidSelect =
        document.getElementById(
            "sidSelect"
        );


    const starSelect =
        document.getElementById(
            "starSelect"
        );


    const approachSelect =
        document.getElementById(
            "approachSelect"
        );


    const departureRunwaySelect =
        document.getElementById(
            "departureRunway"
        );


    const arrivalRunwaySelect =
        document.getElementById(
            "arrivalRunway"
        );


    if (
        sidSelect &&
        sidSelect.value &&
        departureAirport
    ) {

        plan.sid =
            findProcedure(

                departureAirport.code,

                sidSelect.value

            );

    }


    if (
        starSelect &&
        starSelect.value &&
        destinationAirport
    ) {

        plan.star =
            findProcedure(

                destinationAirport.code,

                starSelect.value

            );

    }


    if (
        approachSelect &&
        approachSelect.value &&
        destinationAirport
    ) {

        plan.approach =
            findProcedure(

                destinationAirport.code,

                approachSelect.value

            );

    }


    if (
        departureRunwaySelect &&
        departureRunwaySelect.value
    ) {

        plan.departureRunway =
            departureRunwaySelect.value;

    }


    if (
        arrivalRunwaySelect &&
        arrivalRunwaySelect.value
    ) {

        plan.arrivalRunway =
            arrivalRunwaySelect.value;

    }


    const blob =
        new Blob(

            [
                JSON.stringify(
                    plan,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }

        );


    downloadBlob(

        blob,

        `${departureAirport
            ? departureAirport.code
            : "DEP"}-${destinationAirport
            ? destinationAirport.code
            : "DEST"}-V1.json`

    );

}


/* =========================================================
   BUILD BASIC FLIGHT PLAN SUMMARY
   ========================================================= */

function getFlightPlanSummary() {

    const plan =
        buildProcedureRoute();


    if (
        plan.length < 2
    ) {

        return null;

    }


    let distance =
        0;


    for (
        let i = 1;
        i < plan.length;
        i++
    ) {

        distance +=
            calculateDistance(

                plan[
                    i - 1
                ].latitude,

                plan[
                    i - 1
                ].longitude,

                plan[
                    i
                ].latitude,

                plan[
                    i
                ].longitude

            );

    }


    const aircraft =
        getSelectedAircraft();


    const cruiseSpeed =
        aircraft
            ? aircraft.cruiseSpeed
            : 450;


    const estimatedHours =
        cruiseSpeed > 0
            ? distance /
              cruiseSpeed
            : 0;


    return {

        departure:
            departureAirport
                ? departureAirport.code
                : "",

        destination:
            destinationAirport
                ? destinationAirport.code
                : "",

        distance:
            distance,

        routePoints:
            plan.length,

        estimatedHours:
            estimatedHours,

        aircraft:
            aircraft
                ? aircraft.name
                : ""

    };

}


/* =========================================================
   UPDATE SUMMARY CARD
   ========================================================= */

function updateFlightSummary() {

    const summary =
        getFlightPlanSummary();


    if (
        !summary
    ) {

        return;
    }


    displayText(

        "distance",

        `${Math.round(
            summary.distance
        ).toLocaleString()} NM`

    );


    displayText(

        "routePoints",

        summary.routePoints

    );


    displayText(

        "estimatedTime",

        formatFlightTime(

            Math.round(
                summary.estimatedHours *
                60
            )

        )

    );

}


/* =========================================================
   NAVIGATION OBJECT SEARCH
   ========================================================= */

function searchNavigationObjects(
    query
) {

    if (
        !navigationState.loaded
    ) {

        return [];

    }


    query =
        String(
            query ||
            ""
        )
            .trim()
            .toUpperCase();


    if (
        !query
    ) {

        return [];

    }


    const results = [];


    Object.entries(
        navigationState.waypoints
    )
        .forEach(
            (
                [key, value]
            ) => {

                const point =
                    normalizeNavigationPoint({

                        ...value,

                        ident:
                            value.ident ||
                            key

                    });


                if (
                    !point
                ) {

                    return;

                }


                if (

                    point.ident
                        .toUpperCase()
                        .includes(
                            query
                        ) ||

                    point.name
                        .toUpperCase()
                        .includes(
                            query
                        )

                ) {

                    results.push(
                        point
                    );

                }

            }
        );


    return results.slice(
        0,
        50
    );

}


/* =========================================================
   ADD NAVIGATION FIX BY IDENT
   ========================================================= */

function addNavigationFix(
    ident
) {

    const results =
        searchNavigationObjects(
            ident
        );


    if (
        results.length === 0
    ) {

        setStatus(
            `Navigation fix ${ident} was not found in the installed database.`
        );

        return false;

    }


    return addWaypoint(
        results[0]
    );

}


/* =========================================================
   BUILD ROUTE FROM NAVDATA
   ========================================================= */

function buildRouteFromNavigationObjects(
    objects
) {

    if (
        !Array.isArray(
            objects
        )
    ) {

        return [];

    }


    return objects
        .map(
            normalizeNavigationPoint
        )
        .filter(
            Boolean
        );

}


/* =========================================================
   DRAW NAVIGATION OBJECT
   ========================================================= */

function drawNavigationObject(
    point
) {

    if (
        !globeViewer ||
        !point
    ) {

        return null;
    }


    const normalized =
        normalizeNavigationPoint(
            point
        );


    if (
        !normalized
    ) {

        return null;
    }


    const altitudeMeters =
        normalized.altitude > 0

            ? normalized.altitude *
              0.3048

            : 100000;


    const position =
        Cesium.Cartesian3.fromDegrees(

            normalized.longitude,

            normalized.latitude,

            altitudeMeters

        );


    return globeViewer.entities.add({

        position:
            position,

        point: {

            pixelSize:
                9,

            color:
                Cesium.Color.ORANGE,

            outlineColor:
                Cesium.Color.WHITE,

            outlineWidth:
                2

        },

        label: {

            text:
                normalized.ident ||
                normalized.name,

            font:
                "bold 12px Arial",

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
                    -10
                )

        }

    });

}


/* =========================================================
   PROCEDURE CONSTRAINT DISPLAY
   ========================================================= */

function getConstraintText(
    point
) {

    if (
        !point
    ) {

        return "";

    }


    const parts = [];


    if (
        point.altitudeConstraint
    ) {

        parts.push(
            `ALT ${point.altitudeConstraint}`
        );

    } else if (
        point.altitude
    ) {

        parts.push(
            `ALT ${formatNumber(
                point.altitude
            )} FT`
        );

    }


    if (
        point.speedConstraint
    ) {

        parts.push(
            `SPD ${point.speedConstraint}`
        );

    } else if (
        point.speed
    ) {

        parts.push(
            `SPD ${point.speed} KT`
        );

    }


    return parts.join(
        " • "
    );

}


/* =========================================================
   DRAW PROCEDURE WITH CONSTRAINT LABELS
   ========================================================= */

function drawProcedureWithConstraints(
    procedure,
    color
) {

    if (
        !procedure ||
        !Array.isArray(
            procedure.points
        )
    ) {

        return false;

    }


    const points =
        procedure.points
            .map(
                normalizeNavigationPoint
            )
            .filter(
                Boolean
            );


    if (
        points.length < 2
    ) {

        return false;

    }


    const globePoints =
        points.map(
            point => ({

                ...point,

                altitude:
                    point.altitude > 0
                        ? point.altitude
                        : 10000

            })
        );


    drawRoute(

        globePoints,

        {

            width:
                6,

            material:
                color ||
                Cesium.Color.YELLOW

        }

    );


    globePoints.forEach(
        point => {

            const entity =
                drawNavigationObject(
                    point
                );


            if (
                entity
            ) {

                const constraint =
                    getConstraintText(
                        point
                    );


                if (
                    constraint
                ) {

                    entity.label.text =
                        `${point.ident}\n${constraint}`;

                }

            }

        }
    );


    fitCameraToPoints(
        globePoints
    );


    return true;

}


/* =========================================================
   PREVIEW DEPARTURE PROCEDURE
   ========================================================= */

function previewDepartureProcedure() {

    if (
        !departureAirport
    ) {

        return;

    }


    const sidSelect =
        document.getElementById(
            "sidSelect"
        );


    if (
        !sidSelect ||
        !sidSelect.value
    ) {

        flyToAirport(

            departureAirport,

            60000

        );

        return;

    }


    const procedure =
        findProcedure(

            departureAirport.code,

            sidSelect.value

        );


    if (
        !procedure
    ) {

        return;

    }


    clearGlobe();


    drawAirportMarker(

        departureAirport,

        Cesium.Color.LIME,

        `DEP ${departureAirport.code}`

    );


    drawProcedureWithConstraints(

        procedure,

        Cesium.Color.YELLOW

    );


    setStatus(
        `Previewing SID ${procedure.name}`
    );

}


/* =========================================================
   PREVIEW ARRIVAL PROCEDURE
   ========================================================= */

function previewArrivalProcedure() {

    if (
        !destinationAirport
    ) {

        return;

    }


    const starSelect =
        document.getElementById(
            "starSelect"
        );


    const approachSelect =
        document.getElementById(
            "approachSelect"
        );


    clearGlobe();


    drawAirportMarker(

        destinationAirport,

        Cesium.Color.RED,

        `DEST ${destinationAirport.code}`

    );


    let displayed =
        false;


    if (
        starSelect &&
        starSelect.value
    ) {

        const star =
            findProcedure(

                destinationAirport.code,

                starSelect.value

            );


        if (
            star
        ) {

            drawProcedureWithConstraints(

                star,

                Cesium.Color.ORANGE

            );


            displayed =
                true;

        }

    }


    if (
        approachSelect &&
        approachSelect.value
    ) {

        const approach =
            findProcedure(

                destinationAirport.code,

                approachSelect.value

            );


        if (
            approach
        ) {

            drawProcedureWithConstraints(

                approach,

                Cesium.Color.LIME

            );


            displayed =
                true;

        }

    }


    if (
        !displayed
    ) {

        flyToAirport(

            destinationAirport,

            60000

        );

    }


    setStatus(
        "Arrival procedure preview displayed."
    );

}


/* =========================================================
   FULL ROUTE WITH PROCEDURES
   ========================================================= */

function showFullFlightRoute() {

    if (
        !departureAirport ||
        !destinationAirport
    ) {

        setStatus(
            "Enter departure and destination airports first."
        );

        return;

    }


    const points =
        buildProcedureRoute();


    if (
        points.length < 2
    ) {

        setStatus(
            "No usable route points available."
        );

        return;

    }


    clearGlobe();


    /*
     Departure airport.
     */

    drawAirportMarker(

        departureAirport,

        Cesium.Color.LIME,

        `DEP ${departureAirport.code}`

    );


    /*
     Destination airport.
     */

    drawAirportMarker(

        destinationAirport,

        Cesium.Color.RED,

        `DEST ${destinationAirport.code}`

    );


    /*
     Convert feet to meters for Cesium.
     */

    const displayPoints =
        points.map(
            point => ({

                ...point,

                altitude:
                    point.altitude > 0
                        ? point.altitude *
                          0.3048
                        : 100000

            })
        );


    drawRoute(

        displayPoints,

        {

            width:
                5,

            material:
                Cesium.Color.CYAN

        }

    );


    drawWaypointMarkers(
        displayPoints
    );


    fitCameraToPoints(
        displayPoints
    );


    updateFlightSummary();


    setStatus(
        `Full route displayed: ${departureAirport.code} → ${destinationAirport.code}`
    );

}


/* =========================================================
   EXPORT SIMPLE ROUTE
   ========================================================= */

function exportSimpleRoute() {

    if (
        !departureAirport ||
        !destinationAirport
    ) {

        setStatus(
            "Plan a flight before exporting."
        );

        return;

    }


    const points =
        buildProcedureRoute();


    const lines = [];


    lines.push(
        `V1 FLIGHT PLAN`
    );


    lines.push(
        `DEPARTURE ${departureAirport.code}`
    );


    lines.push(
        `DESTINATION ${destinationAirport.code}`
    );


    lines.push(
        ""
    );


    points.forEach(
        (
            point,
            index
        ) => {

            const altitude =
                point.altitude
                    ? Math.round(
                        point.altitude
                    )
                    : 0;


            const speed =
                point.speed
                    ? Math.round(
                        point.speed
                    )
                    : 0;


            lines.push(

                `${index + 1}. ${
                    point.ident ||
                    point.name ||
                    "WPT"
                } | ${
                    point.latitude.toFixed(
                        6
                    )
                } | ${
                    point.longitude.toFixed(
                        6
                    )
                } | ALT ${
                    altitude
                } FT | SPD ${
                    speed || "-"
                } KT`

            );

        }
    );


    const blob =
        new Blob(

            [
                lines.join(
                    "\n"
                )
            ],

            {
                type:
                    "text/plain"
            }

        );


    downloadBlob(

        blob,

        `${departureAirport.code}-${destinationAirport.code}-V1.txt`

    );

}


/* =========================================================
   COMPLETE EVENT INITIALIZATION
   ========================================================= */

function initializeApplication() {

    console.log(
        "Initializing V1 Flight Planner..."
    );


    /*
     Aircraft selector.
     */

    populateAircraftSelector();


    /*
     Globe.
     */

    initializeGlobe();


    /*
     Navigation database.
     */

    loadNavigationDatabase();


    /*
     UI events.
     */

    initializeEventListeners();


    /*
     Initial waypoint list.
     */

    updateWaypointList();


    /*
     Initial performance.
     */

    calculateAndDisplayPerformance();


    /*
     Initial status.
     */

    setStatus(
        "Airport lookup ready."
    );


    console.log(
        "V1 Flight Planner initialized."
    );

}


/* =========================================================
   DOM READY
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(

        "DOMContentLoaded",

        initializeApplication

    );

} else {

    initializeApplication();

}


/* =========================================================
   FINAL GLOBAL EXPORTS
   ========================================================= */

window.findAirport =
    findAirport;


window.calculateDistance =
    calculateDistance;


window.calculateInitialBearing =
    calculateInitialBearing;


window.calculateFinalBearing =
    calculateFinalBearing;


window.getSelectedAircraft =
    getSelectedAircraft;


window.calculateAndDisplayPerformance =
    calculateAndDisplayPerformance;


window.initializeGlobe =
    initializeGlobe;


window.initializeApplication =
    initializeApplication;


window.addNavigationFix =
    addNavigationFix;


window.searchNavigationObjects =
    searchNavigationObjects;


window.showFullFlightRoute =
    showFullFlightRoute;


window.previewDepartureProcedure =
    previewDepartureProcedure;


window.previewArrivalProcedure =
    previewArrivalProcedure;


window.exportSimpleRoute =
    exportSimpleRoute;


window.exportCompleteFlightPlanJSON =
    exportCompleteFlightPlanJSON;


console.log(
    "V1 Flight Planner - app.js loaded successfully"
);
