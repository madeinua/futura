/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./config.js":
/*!*******************!*\
  !*** ./config.js ***!
  \*******************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Config = {

    // Global
    LOGS: true,
    STORE_DATA: false,
    RANDOM_WORLD: false,
    SEED: 103,

    // Maps
    WORLD_SIZE: 250,
    CELL_SIZE: 25, // WORLD_SIZE * CELL_SIZE * 2 < 23.000!
    SHOW_RECTANGLES: false,
    SHOW_COORDINATES: false,
    DRAW_TECHNICAL_MAPS: true,

    // Steps
    STEPS_ENABLED: true,
    STEPS_MIN_INTERVAL: 500,
    STEPS_LIMIT: 500,
    STEPS_BOOST: 5,
    STEPS_BOOST_STEPS: 400,

    // Altitude
    WORLD_MAP_OCEAN_INTENSITY: 0.2, // [0-1]
    EROSION_ITERATIONS: 5, // [0-100]

    // Temperature
    SHOW_TEMPERATURES: false,
    MIN_TEMPERATURE: 0,
    LOW_TEMPERATURE: 14,
    NORMAL_TEMPERATURE: 21,
    HIGH_TEMPERATURE: 28,
    MAX_TEMPERATURE: 45,

    // Rivers
    RIVERS_DENSITY: 0.5, // [0-1]
    RIVER_SOURCE_MIN_ALTITUDE: 0.5,
    RIVER_SOURCE_MAX_ALTITUDE: 0.9,
    RIVER_START_CLOSENESS: 6,
    RIVER_MIN_LENGTH: 5,
    RIVER_DELTA_MAX_LENGTH: 0.25, // [0-1] 1 = 100% of length
    LAKE_TO_RIVER_RATIO: 1.3,

    // Humidity
    MIN_HUMIDITY: 0,
    LOW_HUMIDITY: 25,
    NORMAL_HUMIDITY: 50,
    HIGH_HUMIDITY: 75,
    MAX_HUMIDITY: 100,

    // Biomes
    SHOW_BIOMES_INFO: false,
    MIN_LEVEL: 0,
    MIN_COAST_LEVEL: 0.2,
    MIN_GROUND_LEVEL: 0.3,
    MAX_BEACH_LEVEL: 0.32,
    MAX_LOWLAND_LEVEL: 0.42,
    MAX_HILLS_LEVEL: 0.7,
    MAX_LEVEL: 1,

    BEACH_TEMPERATURE_RATIO: -0.02,
    BEACH_HUMIDITY_RATIO: 0.01,
    MAX_BEACH_DISTANCE_FROM_OCEAN: 3,

    /**
     * @internal
     * @return {[]}
     */
    biomesConfig: function() {
        const biomesConfig = [];

        biomesConfig.push({
            class: 'Biome_Grass',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.LOW_TEMPERATURE, this.HIGH_TEMPERATURE],
        });

        biomesConfig.push({
            class: 'Biome_Tundra',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.MIN_TEMPERATURE, this.LOW_TEMPERATURE],
        });

        biomesConfig.push({
            class: 'Biome_Tropic',
            h: [this.NORMAL_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.HIGH_TEMPERATURE, this.MAX_TEMPERATURE],
        });

        biomesConfig.push({
            class: 'Biome_Desert',
            h: [this.MIN_HUMIDITY, this.NORMAL_HUMIDITY],
            t: [this.HIGH_TEMPERATURE, this.MAX_TEMPERATURE],
        });

        return biomesConfig;
    },

    BIOME_COLORS: {
        Biome_Ocean: ['#0652a2', '#1f67b4', '#4087d2'],
        Biome_Coast: ['#549ae3', '#78baff'],
        Biome_Water: ['#3592c5'],
        Biome_Beach: ['#fff1ac'],
        Biome_Desert: ['#e8c57e', '#ecc26f', '#eebe62'],
        Biome_Grass: ['#78d741', '#6fbb43', '#649d43', '#57803f'],
        Biome_Tropic: ['#3da678', '#3f9871', '#418869', '#396c56'],
        Biome_Tundra: ['#d5d9a6', '#c3c5a5', '#afb09e', '#9d9d95'],
    },

    BIOME_IMAGES: {
        Ocean: 'public/images/ocean-1.png',
        Water: 'public/images/water-1.png',
        Rocks: ['public/images/mountains-1.png', 'public/images/mountains-2.png'],
        Desert: 'public/images/desert-1.png',
        Beach: 'public/images/beach-1.png',
        Grass: 'public/images/grass-1.png',
        Tundra: 'public/images/tundra-1.png',
        Tropic: 'public/images/tropic-1.png',
    },

    // Forests
    FOREST_LIMIT: 25, // %, compared to the possible tiles
    FOREST_BORN_CHANCE: 0.03, // %
    FOREST_BORN_BOOST: 7,
    FOREST_GROWTH_CHANCE: 0.02, // %
    FOREST_DIE_CHANCE: 0.001, // %
    FOREST_GROUNDS_MULTS: {
        Biome_Tundra: 1.2,
        Biome_Grass: 2,
        Biome_Desert: 0.5,
        Biome_Tropic: 6
    },
    FOREST_CREATE_MULTS: { // Must be 100 in the total
        WATER: 35,
        HUMIDITY: 35,
        GROUND: 30
    },
    FOREST_COLOR: '#3c5626',
    FOREST_IMAGES: {
        'forest_1': 'public/images/forest-1.png',
    },
    FOREST_PALM_IMAGE: 'public/images/palm-1.png',
    FOREST_TUNDRA_IMAGE: 'public/images/forest-3.png',

    // Animals
    DISTANCE_BETWEEN_ANIMALS: 10,
    ANIMALS: {
        'Animal': { // defaults
            rarity: 0.01, // % of all tiles
            moveChance: 100,
            color: '#000000',
            image: null
        },
        'Fish': {
            rarity: 0.005,
            moveChance: 7,
            color: '#4fd0ff',
            image: 'public/images/fish-1.png'
        },
        'Deer': {
            rarity: 0.01,
            moveChance: 5,
            color: '#ffc800',
            image: 'public/images/deer-1.png'
        },
        'Cow': {
            rarity: 0.01,
            moveChance: 3,
            color: '#ffffff',
            image: 'public/images/cow-1.png'
        }
    },

    // Factions
    FACTIONS: {
        COUNT: 10,
        AUTO_CREATE_ON_STEP: -1,
        // Note: < 1 --> negative, >= 1 --> positive
        CREATE_PROBABILITIES: {
            BIOMES: {
                Biome_Beach: 0.1,
                Biome_Tundra: 0.05,
                Biome_Grass: 0.3,
                Biome_Desert: 0.01,
                Biome_Tropic: 0.25,
            },
            MIN_ISLAND_SIZE: 50,
            CLOSE_TO_OCEAN: 2,
            CLOSE_TO_WATER: 5,
            IS_FOREST: 0.3,
            CLOSE_TO_FOREST: 2,
        },
        INFLUENCE: {
            // Boosts
            HILLS_BOOST: 0.5,
            MOUNTAINS_BOOST: 0.1,
            FOREST_BOOST: 0.5,
            // Biomes
            Biome_Ocean: 0.1,
            Biome_Coast: 0.25,
            Biome_Water: 0.25,
            Biome_Beach: 0.8,
            Biome_Tundra: 0.5,
            Biome_Grass: 1.0,
            Biome_Desert: 0.2,
            Biome_Tropic: 0.33,
        },
        COLORS: [
            '#ff0000',
            '#00ff00',
            '#ffff00',
            '#c62ce0',
            '#00f7ff',
            '#31057a',
            '#ff4b89',
            '#ff9100',
            '#00ff80',
            '#641841',
            '#000000',
        ]
    }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Config);

/***/ }),

/***/ "./futura.js":
/*!*******************!*\
  !*** ./futura.js ***!
  \*******************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config.js */ "./config.js");
/* harmony import */ var _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/helpers.js */ "./src/helpers.js");
/* harmony import */ var _src_World_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./src/World.js */ "./src/World.js");



const coordinatesField = document.getElementById('coordinates'), displayMapVisibleRange = document.getElementById('displayMapVisibleRange'), displayMapWrapper = document.getElementById('displayMapWrapper'), displayMap = document.getElementById('displayMap'), miniMapCanvas = document.getElementById('miniMap'), technicalMaps = document.getElementById('technicalMaps');
function drawColorMap(id, map) {
    const canvas = document.getElementById(id);
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();
    const ctx = canvas.getContext('2d'), image = ctx.createImageData(canvas.width, canvas.height);
    for (let x = 0; x < map.getWidth(); x++) {
        for (let y = 0; y < map.getHeight(); y++) {
            (0,_src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.fillCanvasPixel)(image, (x + y * canvas.width) * 4, map.getCell(x, y).getHexColor());
        }
    }
    ctx.putImageData(image, 0, 0);
}
/**
 * Linearly interpolates between two colors.
 *
 * @param color1 - The start color as [R, G, B]
 * @param color2 - The end color as [R, G, B]
 * @param factor - A number between 0 and 1 representing the interpolation factor.
 * @returns The interpolated color as [R, G, B].
 */
function interpolateColor(color1, color2, factor) {
    return [
        Math.round(color1[0] + factor * (color2[0] - color1[0])),
        Math.round(color1[1] + factor * (color2[1] - color1[1])),
        Math.round(color1[2] + factor * (color2[2] - color1[2])),
    ];
}
/**
 * Draws a colored map onto a canvas by mapping each cell’s value (assumed to be between 0 and 255)
 * to a color determined by linear interpolation between the provided start and end colors.
 *
 * @param id - The id of the canvas element.
 * @param map - The NumericMatrix to draw.
 * @param startColor - The color representing the lowest values (e.g. blue for cold areas).
 * @param endColor - The color representing the highest values (e.g. orange for hot areas).
 */
function drawColoredMap(id, map, startColor, endColor) {
    const canvas = document.getElementById(id);
    canvas.width = map.getWidth();
    canvas.height = map.getHeight();
    const ctx = canvas.getContext("2d");
    if (!ctx)
        return;
    const image = ctx.createImageData(canvas.width, canvas.height);
    // For each cell, compute its color based on the normalized value.
    map.foreach((x, y) => {
        const gray = map.getGrayscale(x, y);
        const factor = gray / 255; // Normalize to [0, 1]
        // Interpolate between the two provided colors.
        const color = interpolateColor(startColor, endColor, factor);
        // Compute the pixel's starting index in the ImageData array.
        const point = (x + y * canvas.width) * 4;
        // Set the pixel color.
        image.data[point] = color[0]; // Red
        image.data[point + 1] = color[1]; // Green
        image.data[point + 2] = color[2]; // Blue
        image.data[point + 3] = 255; // Alpha
    });
    ctx.putImageData(image, 0, 0);
}
function getCameraPosition() {
    const point = coordinatesField.value.split(',');
    let x = 0;
    let y = 0;
    if (point.length === 2) {
        x = parseInt(point[0], 10);
        y = parseInt(point[1], 10);
    }
    return [x, y];
}
new _src_World_js__WEBPACK_IMPORTED_MODULE_2__["default"](displayMap, displayMapWrapper.offsetWidth, displayMapWrapper.offsetHeight, miniMapCanvas, getCameraPosition(), (world) => {
    function getCameraPointByStartPoint(point) {
        const cw = Math.floor(world.visibleCellCols / 2), ch = Math.floor(world.visibleCellRows / 2);
        return [
            Math.max(0, point[0] + cw),
            Math.max(0, point[1] + ch)
        ];
    }
    function scrollIntoToView() {
        displayMapWrapper.scrollLeft = world.cameraPos[0] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE;
        displayMapWrapper.scrollTop = world.cameraPos[1] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE;
    }
    function pauseTimer() {
        return world.timer.isTimerPaused()
            ? world.timer.unpauseTimer()
            : world.timer.pauseTimer();
    }
    _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('mapMoved', (point) => {
        point = getCameraPointByStartPoint(point);
        coordinatesField.value = point[0] + ',' + point[1];
        displayMapVisibleRange.innerHTML = '[' + world.cameraPos[0] + '-' + (world.cameraPos[1] + world.visibleCellCols) + ' | ' + world.cameraPos[1] + '-' + (world.cameraPos[1] + world.visibleCellRows) + ']';
    });
    if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].DRAW_TECHNICAL_MAPS) {
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('altitudeMap', (map) => {
            drawColoredMap('altitudeMapCanvas', map, [34, 139, 34], [255, 255, 255]);
            document.getElementById('altitudeCellsCount').innerHTML = map.getLandCellsCount().toString();
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('temperatureMap', (map) => {
            drawColoredMap('temperatureMapCanvas', map, [50, 50, 255], [255, 69, 0]);
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('oceanMap', (map) => {
            drawColoredMap('oceanMapCanvas', map, [255, 255, 255], [0, 105, 148]);
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('coastMap', (map) => {
            drawColoredMap('coastMapCanvas', map, [255, 255, 255], [205, 133, 63]);
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('lakesMap', (map) => {
            drawColoredMap('lakesMapCanvas', map, [255, 255, 255], [0, 105, 148]);
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('riversMap', (map) => {
            drawColoredMap('riversMapCanvas', map, [255, 255, 255], [0, 105, 148]);
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('humidityMap', (map) => {
            drawColoredMap('humidityMapCanvas', map, [210, 180, 140], [34, 139, 34]);
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('biomes', (biomes) => {
            drawColorMap('biomesCanvas', biomes);
            let biomesTypesCounter = {};
            biomes.foreachValues((biome) => {
                if (typeof biomesTypesCounter[biome.getName()] === 'undefined') {
                    biomesTypesCounter[biome.getName()] = 0;
                }
                biomesTypesCounter[biome.getName()]++;
            });
            // Sort by value
            biomesTypesCounter = Object.keys(biomesTypesCounter).sort((a, b) => {
                return biomesTypesCounter[b] - biomesTypesCounter[a];
            }).reduce((result, key) => {
                result[key] = biomesTypesCounter[key];
                return result;
            }, {});
            // Add counters as list to <ul> element
            const list = document.getElementById('biomesTypesCounter');
            for (const i in biomesTypesCounter) {
                const item = document.createElement('li');
                item.innerHTML = i.substring(6) + ': ' + biomesTypesCounter[i];
                list.appendChild(item);
            }
            return biomes;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('forestMap', (map) => {
            drawColoredMap('forestMapCanvas', map, [255, 255, 255], [34, 139, 34]);
            document.getElementById('forestCounter').innerHTML = map.countFilled().toString();
            return map;
        });
        _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('animalsSteps', (animals) => {
            let text = '';
            const groups = {};
            for (let i = 0; i < animals.length; i++) {
                if (typeof groups[animals[i].getName()] === 'undefined') {
                    groups[animals[i].getName()] = 0;
                }
                groups[animals[i].getName()]++;
            }
            for (const i in groups) {
                text += i + ': ' + groups[i] + '<br />';
            }
            document.getElementById('animalsList').innerHTML = text;
            document.getElementById('animalsCounter').innerHTML = animals.length.toString();
        });
        technicalMaps.style.display = 'block';
    }
    _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('factionsUpdated', (factions) => {
        document.getElementById('factionsList').innerHTML = factions.map((faction) => {
            return '<li>' + faction.getName() + ': <span style="background-color:' + (0,_src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.rgbToHex)(faction.getFactionColor()) + '"></span> (' + faction.getSize() + ' cells)</li>';
        }).join('');
    });
    coordinatesField.addEventListener("change", () => {
        world.moveMapTo(getCameraPosition());
        scrollIntoToView();
    });
    miniMapCanvas.addEventListener("click", function (e) {
        const rect = this.getBoundingClientRect(), scale = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE / miniMapCanvas.offsetWidth;
        world.moveMapTo([
            Math.floor(e.clientX - rect.left * scale),
            Math.floor(e.clientY - rect.top * scale)
        ]);
        scrollIntoToView();
    });
    document.getElementById('pauseSteps').addEventListener("click", () => {
        pauseTimer();
    });
    world.timer.addStepsHandler((step) => {
        document.getElementById('stepsCounter').innerHTML = String(step);
    });
    _src_helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.add('timer', (timer) => {
        document.getElementById('timerFps').innerHTML = timer.getFps().toString();
    });
    document.getElementById('generateFactions').addEventListener("click", () => {
        world.generateFactions();
    });
    // Timeout is needed to wait for the map to be generated (the process resizes the canvas and triggers scroll event)
    setTimeout(() => {
        displayMapWrapper.addEventListener("scroll", () => {
            world.moveMapTo(getCameraPointByStartPoint([
                Math.floor(displayMapWrapper.scrollLeft / _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE),
                Math.floor(displayMapWrapper.scrollTop / _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE)
            ]));
        });
    }, 1000);
    world.create();
});


/***/ }),

/***/ "./src/World.js":
/*!**********************!*\
  !*** ./src/World.js ***!
  \**********************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ World)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers.js */ "./src/helpers.js");
/* harmony import */ var _operators_SurfaceOperator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./operators/SurfaceOperator.js */ "./src/operators/SurfaceOperator.js");
/* harmony import */ var _operators_WeatherOperator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./operators/WeatherOperator.js */ "./src/operators/WeatherOperator.js");
/* harmony import */ var _operators_WaterOperator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./operators/WaterOperator.js */ "./src/operators/WaterOperator.js");
/* harmony import */ var _operators_HumidityOperator_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./operators/HumidityOperator.js */ "./src/operators/HumidityOperator.js");
/* harmony import */ var _operators_BiomesOperator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./operators/BiomesOperator.js */ "./src/operators/BiomesOperator.js");
/* harmony import */ var _operators_ForestsOperator_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./operators/ForestsOperator.js */ "./src/operators/ForestsOperator.js");
/* harmony import */ var _operators_AnimalsOperator_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./operators/AnimalsOperator.js */ "./src/operators/AnimalsOperator.js");
/* harmony import */ var _operators_FactionsOperator_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./operators/FactionsOperator.js */ "./src/operators/FactionsOperator.js");
/* harmony import */ var _services_Timer_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./services/Timer.js */ "./src/services/Timer.js");
/* harmony import */ var _services_Layers_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./services/Layers.js */ "./src/services/Layers.js");
/* harmony import */ var _render_CellsRenderer_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./render/CellsRenderer.js */ "./src/render/CellsRenderer.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};













class World {
    constructor(mapCanvas, mapWidth, mapHeight, miniMapCanvas, startPoint, onReady) {
        this.miniMapBitmap = null;
        this.visibleCellCols = Math.ceil(mapWidth / _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE) + 1;
        this.visibleCellRows = Math.ceil(mapHeight / _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE) + 1;
        this.cameraPos = this.getCameraPointByCenteredPoint(startPoint);
        if (!_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RANDOM_WORLD) {
            Math.seedrandom(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].SEED);
        }
        this.worldWidth = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE;
        this.worldHeight = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE;
        if (this.worldWidth * this.worldHeight > 536756224) {
            console.error('World is too big. Maximum size is 23184x23184');
            return;
        }
        this.mapCanvas = mapCanvas;
        this.mapCanvas.width = this.worldWidth;
        this.mapCanvas.height = this.worldHeight;
        this.miniMapCanvas = miniMapCanvas;
        this.miniMapCanvas.width = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE;
        this.miniMapCanvas.height = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE;
        this.timer = new _services_Timer_js__WEBPACK_IMPORTED_MODULE_10__["default"]();
        this.layers = new _services_Layers_js__WEBPACK_IMPORTED_MODULE_11__["default"](_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE);
        this.cellsRenderer = new _render_CellsRenderer_js__WEBPACK_IMPORTED_MODULE_12__["default"](_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE);
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].STORE_DATA) {
            const worldSize = localStorage.getItem('worldSize'), actualSize = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE + 'x' + _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE;
            if (actualSize !== worldSize) {
                localStorage.clear();
            }
            localStorage.setItem('worldSize', actualSize);
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.logTimeEvent)('Initialized');
        }
        onReady(this);
    }
    create() {
        Promise.all([this.generateWorld(), this.cellsRenderer.init()]).then(() => {
            if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOGS) {
                (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.logTimeEvent)('World generated');
            }
            this.update();
            if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].STEPS_ENABLED) {
                this.timer.stepsTimer(() => this.update());
            }
        });
    }
    generateWorld() {
        return __awaiter(this, void 0, void 0, function* () {
            const surfaceOperator = new _operators_SurfaceOperator_js__WEBPACK_IMPORTED_MODULE_2__["default"](), weatherOperator = new _operators_WeatherOperator_js__WEBPACK_IMPORTED_MODULE_3__["default"](), waterOperator = new _operators_WaterOperator_js__WEBPACK_IMPORTED_MODULE_4__["default"](), humidityOperator = new _operators_HumidityOperator_js__WEBPACK_IMPORTED_MODULE_5__["default"](), altitudeMap = surfaceOperator.generateAltitudeMap(), temperatureMap = weatherOperator.generateTemperatureMap(altitudeMap), oceanMap = waterOperator.generateOceanMap(altitudeMap), islandsMap = waterOperator.getIslandsMap(oceanMap), coastMap = waterOperator.getCoastMap(oceanMap, altitudeMap), lakesMap = waterOperator.generateLakesMap(altitudeMap, oceanMap), riversMap = waterOperator.generateRiversMap(altitudeMap, lakesMap), freshWaterMap = waterOperator.getFreshWaterMap(lakesMap, riversMap), humidityMap = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);
            const biomesOperator = new _operators_BiomesOperator_js__WEBPACK_IMPORTED_MODULE_6__["default"](altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, this.layers.getLayer(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_BIOMES), this.layers.getLayer(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_BIOMES_IMAGES));
            const forestsOperator = new _operators_ForestsOperator_js__WEBPACK_IMPORTED_MODULE_7__["default"](biomesOperator, this.timer, this.layers.getLayer(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_FOREST));
            new _operators_AnimalsOperator_js__WEBPACK_IMPORTED_MODULE_8__["default"]({
                habitatLayer: this.layers.getLayer(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_HABITAT),
                animalsLayer: this.layers.getLayer(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_ANIMALS),
                altitudeMap: altitudeMap,
                freshWaterMap: freshWaterMap,
                coastMap: coastMap,
                forestsOperator: forestsOperator,
                biomesOperator: biomesOperator,
                timer: this.timer,
            });
            const factionsOperator = new _operators_FactionsOperator_js__WEBPACK_IMPORTED_MODULE_9__["default"]({
                timer: this.timer,
                factionsLayer: this.layers.getLayer(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_FACTIONS),
                factionsBorderLayer: this.layers.getLayer(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_FACTIONS_BORDERS),
                oceanMap: oceanMap,
                freshWaterMap: freshWaterMap,
                temperatureMap: temperatureMap,
                forestMap: forestsOperator.getForestMap(),
                biomesMap: biomesOperator.getBiomes(),
                islandsMap: islandsMap,
            });
            this.world = {
                altitudeMap,
                temperatureMap,
                oceanMap,
                coastMap,
                lakesMap,
                riversMap,
                freshWaterMap,
                humidityMap,
                biomesOperator,
                forestOperator: forestsOperator,
                factionsOperator,
            };
        });
    }
    update() {
        const mapCtx = this.mapCanvas.getContext('2d');
        // Cache terrain layer as it is static
        if (!this.terrainCanvasCtx) {
            this.cacheTerrainLayer(mapCtx);
        }
        // Draw visible part of the canvas
        this.drawTerrain(mapCtx);
        // Render layers except biomes as they were added before
        this.renderLayers(mapCtx);
        // Add extras
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].SHOW_RECTANGLES) {
            this.drawRectangles();
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].SHOW_COORDINATES) {
            this.drawCoordinates();
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].SHOW_TEMPERATURES) {
            this.drawTemperatures();
        }
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].SHOW_BIOMES_INFO) {
            this.drawBiomesInfo();
        }
        // Add the minimap
        this.drawMiniMap();
    }
    cacheTerrainLayer(mapCtx) {
        const renderCtx = new OffscreenCanvas(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE).getContext('2d');
        this.terrainCachedBgImageData = renderCtx.createImageData(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE);
        // Fill canvas with terrain colors
        this.layers.foreachLayerValues(_services_Layers_js__WEBPACK_IMPORTED_MODULE_11__.LAYER_BIOMES, (displayCell, x, y) => {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.fillCanvasPixel)(this.terrainCachedBgImageData, (x + y * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE) * 4, displayCell.getColor());
        });
        renderCtx.putImageData(this.terrainCachedBgImageData, 0, 0);
        // Scale canvas to actual size of cells
        this.terrainCanvasCtx = new OffscreenCanvas(this.worldWidth, this.worldHeight).getContext('2d');
        this.terrainCanvasCtx.putImageData((0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.scaleImageData)(mapCtx, renderCtx.getImageData(0, 0, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE), _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE), 0, 0);
    }
    drawTerrain(mapCtx) {
        mapCtx.putImageData(this.terrainCanvasCtx.getImageData(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * this.cameraPos[0], _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * this.cameraPos[1], _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * this.visibleCellCols, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * this.visibleCellRows), _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * this.cameraPos[0], _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE * this.cameraPos[1]);
    }
    renderLayers(mapCtx) {
        this.layers.foreachMainMapLayersValues((displayCell, x, y) => {
            if (this.isCellVisible(x, y)) {
                this.cellsRenderer.render(mapCtx, displayCell, x, y);
            }
        });
    }
    isCellVisible(x, y) {
        return (x >= this.cameraPos[0] &&
            x < this.cameraPos[0] + this.visibleCellCols &&
            y >= this.cameraPos[1] &&
            y < this.cameraPos[1] + this.visibleCellRows);
    }
    drawMiniMap() {
        const miniMapCtx = this.miniMapCanvas.getContext('2d');
        if (!this.miniMapBitmap) {
            const offscreen = new OffscreenCanvas(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE);
            const renderCtx = offscreen.getContext('2d');
            const imageData = renderCtx.createImageData(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE);
            this.layers.foreachMiniMapLayersValues((displayCell, x, y) => {
                (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.fillCanvasPixel)(imageData, (x + y * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE) * 4, displayCell.getColor(), 0.7);
            });
            // Create bitmap and cache it.
            createImageBitmap(imageData).then((bitmap) => {
                this.miniMapBitmap = bitmap;
                miniMapCtx.drawImage(bitmap, 0, 0);
                this.drawRectangleAroundMiniMap(miniMapCtx);
            });
        }
        else {
            // If cached, just redraw it.
            miniMapCtx.drawImage(this.miniMapBitmap, 0, 0);
            this.drawRectangleAroundMiniMap(miniMapCtx);
        }
    }
    drawRectangleAroundMiniMap(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.cameraPos[0], this.cameraPos[1], this.visibleCellCols, this.visibleCellRows);
    }
    drawRectangles() {
        const ctx = this.mapCanvas.getContext('2d');
        const cellSize = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE;
        const offsetX = this.cameraPos[0] * cellSize;
        const offsetY = this.cameraPos[1] * cellSize;
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                ctx.strokeRect(x * cellSize + offsetX, y * cellSize + offsetY, cellSize, cellSize);
            }
        }
    }
    drawCoordinates() {
        const ctx = this.mapCanvas.getContext('2d'), worldOffsetLeft = this.cameraPos[0] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE, worldOffsetTop = this.cameraPos[1] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE;
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';
        ctx.fillStyle = '#000000';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                const lx = x * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE + worldOffsetLeft, ly = y * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE + worldOffsetTop;
                ctx.fillText((this.cameraPos[0] + x).toString(), lx + 2, ly + 10);
                ctx.fillText((this.cameraPos[1] + y).toString(), lx + 2, ly + 20);
            }
        }
    }
    drawTemperatures() {
        const ctx = this.mapCanvas.getContext('2d'), worldOffsetLeft = this.cameraPos[0] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE, worldOffsetTop = this.cameraPos[1] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE, temperatureMap = this.world.temperatureMap;
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                const lx = x * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE + worldOffsetLeft, ly = y * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE + worldOffsetTop;
                ctx.fillText((Math.round(temperatureMap.getCell(this.cameraPos[0] + x, this.cameraPos[1] + y) * 450) / 10).toString(), lx + 2, ly + 10);
            }
        }
    }
    drawBiomesInfo() {
        const ctx = this.mapCanvas.getContext('2d'), worldOffsetLeft = this.cameraPos[0] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE, worldOffsetTop = this.cameraPos[1] * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE, biomes = this.world.biomesOperator.getBiomes();
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                const lx = x * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE + worldOffsetLeft, ly = y * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].CELL_SIZE + worldOffsetTop;
                ctx.fillText(biomes.getCell(this.cameraPos[0] + x, this.cameraPos[1] + y)
                    .getName()
                    .substring(6, 12), lx + 2, ly + 10);
            }
        }
    }
    moveMapTo(point, silent = false) {
        (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.resetTimeEvent)();
        const cameraPos = this.getCameraPointByCenteredPoint(point);
        if (cameraPos[0] === this.cameraPos[0] && cameraPos[1] === this.cameraPos[1]) {
            return;
        }
        const maxWidth = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE - this.visibleCellCols, maxHeight = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE - this.visibleCellRows;
        cameraPos[0] = Math.max(0, Math.min(cameraPos[0], maxWidth));
        cameraPos[1] = Math.max(0, Math.min(cameraPos[1], maxHeight));
        this.cameraPos = cameraPos;
        this.update();
        if (!silent) {
            _helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.apply('mapMoved', cameraPos);
        }
    }
    getCameraPointByCenteredPoint(point) {
        const cw = Math.floor(this.visibleCellCols / 2), ch = Math.floor(this.visibleCellRows / 2);
        return [
            Math.max(0, point[0] - cw),
            Math.max(0, point[1] - ch),
        ];
    }
    generateFactions() {
        this.world.factionsOperator.createFactions(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.COUNT);
        this.update();
    }
}


/***/ }),

/***/ "./src/animals/Animal.js":
/*!*******************************!*\
  !*** ./src/animals/Animal.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");

class Animal {
    constructor(x, y, settings) {
        this.id = `${this.getName()}-${(0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.getStep)()}`;
        this.x = x;
        this.y = y;
        this.settings = settings;
        this.history = [];
    }
    getName() {
        return this.constructor.ANIMAL_NAME;
    }
    getSettings() {
        return this.settings;
    }
    getMoveChance() {
        return this.settings.moveChance;
    }
    getImage() {
        return this.settings.image;
    }
    getColor() {
        return this.settings.color;
    }
    getPosition() {
        return [this.x, this.y];
    }
    getHistoryAt(pos) {
        return pos > 0 && pos <= this.history.length
            ? this.history[this.history.length - pos]
            : false;
    }
    getPrevPosition() {
        return this.getHistoryAt(1);
    }
    moveTo(x, y) {
        if (x === this.x && y === this.y) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.throwError)("Cannot move to the same position", 1, true);
            return;
        }
        this.history.push([this.x, this.y]);
        this.x = x;
        this.y = y;
    }
}
Animal.ANIMAL_NAME = "Animal";
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Animal);


/***/ }),

/***/ "./src/animals/Cow.js":
/*!****************************!*\
  !*** ./src/animals/Cow.js ***!
  \****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Animal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animal.js */ "./src/animals/Animal.js");

class Cow extends _Animal_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
}
Cow.ANIMAL_NAME = 'Cow';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Cow);


/***/ }),

/***/ "./src/animals/Deer.js":
/*!*****************************!*\
  !*** ./src/animals/Deer.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Animal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animal.js */ "./src/animals/Animal.js");

class Deer extends _Animal_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
}
Deer.ANIMAL_NAME = 'Deer';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Deer);


/***/ }),

/***/ "./src/animals/Fish.js":
/*!*****************************!*\
  !*** ./src/animals/Fish.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Animal_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Animal.js */ "./src/animals/Animal.js");

class Fish extends _Animal_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
}
Fish.ANIMAL_NAME = 'Fish';
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Fish);


/***/ }),

/***/ "./src/biomes/Biome.js":
/*!*****************************!*\
  !*** ./src/biomes/Biome.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../render/DisplayCell.js */ "./src/render/DisplayCell.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");



class Biome {
    constructor(x, y, args) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
        this.isHills = args.isHills;
        this.isMountains = args.isMountains;
    }
    getName() {
        return this.constructor.name;
    }
    getColorsMinMax() {
        return {
            min: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MIN_LEVEL,
            max: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_LEVEL,
        };
    }
    getHillsBoostColor() {
        return -30;
    }
    getMountainsBoostColor() {
        return -60;
    }
    getColor() {
        const { min, max } = this.getColorsMinMax();
        const colors = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_COLORS[this.getName()];
        let sliceIndex = 0;
        if (this.altitude >= max) {
            sliceIndex = colors.length - 1;
        }
        else if (this.altitude > min) {
            sliceIndex = Math.floor(((this.altitude - min) / (max - min)) * colors.length);
        }
        let color = colors[sliceIndex];
        if (this.isHills) {
            color = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.LightenDarkenColor)(color, this.getHillsBoostColor());
        }
        else if (this.isMountains) {
            color = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.LightenDarkenColor)(color, this.getMountainsBoostColor());
        }
        return color;
    }
    getHexColor() {
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.hexToRgb)(this.getColor());
    }
    getImage() {
        if (this.isMountains) {
            return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Rocks[0];
        }
        return null;
    }
    getBackground() {
        return null;
    }
    getDisplayCell() {
        return new _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.getHexColor(), [this.getBackground(), this.getImage()]);
    }
    getDistanceToWater() {
        return this.distanceToWater;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Beach.js":
/*!***********************************!*\
  !*** ./src/biomes/Biome_Beach.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Beach)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");


class Biome_Beach extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Beach;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Coast.js":
/*!***********************************!*\
  !*** ./src/biomes/Biome_Coast.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Coast)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");


class Biome_Coast extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getColorsMinMax() {
        return {
            min: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MIN_COAST_LEVEL,
            max: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MIN_GROUND_LEVEL,
        };
    }
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Ocean;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Desert.js":
/*!************************************!*\
  !*** ./src/biomes/Biome_Desert.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Desert)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");


class Biome_Desert extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getColorsMinMax() {
        return {
            min: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_BEACH_LEVEL,
            max: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_LEVEL,
        };
    }
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Desert;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Grass.js":
/*!***********************************!*\
  !*** ./src/biomes/Biome_Grass.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Grass)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");


class Biome_Grass extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getColorsMinMax() {
        return {
            min: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_BEACH_LEVEL,
            max: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_LEVEL,
        };
    }
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Grass;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Ocean.js":
/*!***********************************!*\
  !*** ./src/biomes/Biome_Ocean.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Ocean)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");


class Biome_Ocean extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getColorsMinMax() {
        return {
            min: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MIN_LEVEL,
            max: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MIN_COAST_LEVEL,
        };
    }
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Ocean;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Tropic.js":
/*!************************************!*\
  !*** ./src/biomes/Biome_Tropic.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Tropic)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");


class Biome_Tropic extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getColorsMinMax() {
        return {
            min: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_BEACH_LEVEL,
            max: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_LEVEL,
        };
    }
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Tropic;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Tundra.js":
/*!************************************!*\
  !*** ./src/biomes/Biome_Tundra.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Tundra)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");


class Biome_Tundra extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getColorsMinMax() {
        return {
            min: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_BEACH_LEVEL,
            max: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_LEVEL,
        };
    }
    getImage() {
        if (this.isMountains) {
            return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Rocks[1];
        }
        return super.getImage();
    }
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Tundra;
    }
}


/***/ }),

/***/ "./src/biomes/Biome_Water.js":
/*!***********************************!*\
  !*** ./src/biomes/Biome_Water.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Biome_Water)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _Biome_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome.js */ "./src/biomes/Biome.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");



class Biome_Water extends _Biome_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    getColor() {
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.LightenDarkenColor)(super.getColor(), this.altitude * 150);
    }
    getImage() {
        return null;
    }
    getBackground() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].BIOME_IMAGES.Water;
    }
}


/***/ }),

/***/ "./src/biomes/Biomes.js":
/*!******************************!*\
  !*** ./src/biomes/Biomes.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Biome_Ocean_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Biome_Ocean.js */ "./src/biomes/Biome_Ocean.js");
/* harmony import */ var _Biome_Coast_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Biome_Coast.js */ "./src/biomes/Biome_Coast.js");
/* harmony import */ var _Biome_Water_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Biome_Water.js */ "./src/biomes/Biome_Water.js");
/* harmony import */ var _Biome_Beach_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Biome_Beach.js */ "./src/biomes/Biome_Beach.js");
/* harmony import */ var _Biome_Desert_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Biome_Desert.js */ "./src/biomes/Biome_Desert.js");
/* harmony import */ var _Biome_Grass_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Biome_Grass.js */ "./src/biomes/Biome_Grass.js");
/* harmony import */ var _Biome_Tropic_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Biome_Tropic.js */ "./src/biomes/Biome_Tropic.js");
/* harmony import */ var _Biome_Tundra_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./Biome_Tundra.js */ "./src/biomes/Biome_Tundra.js");








/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
    Biome_Ocean: _Biome_Ocean_js__WEBPACK_IMPORTED_MODULE_0__["default"],
    Biome_Coast: _Biome_Coast_js__WEBPACK_IMPORTED_MODULE_1__["default"],
    Biome_Water: _Biome_Water_js__WEBPACK_IMPORTED_MODULE_2__["default"],
    Biome_Beach: _Biome_Beach_js__WEBPACK_IMPORTED_MODULE_3__["default"],
    Biome_Desert: _Biome_Desert_js__WEBPACK_IMPORTED_MODULE_4__["default"],
    Biome_Grass: _Biome_Grass_js__WEBPACK_IMPORTED_MODULE_5__["default"],
    Biome_Tropic: _Biome_Tropic_js__WEBPACK_IMPORTED_MODULE_6__["default"],
    Biome_Tundra: _Biome_Tundra_js__WEBPACK_IMPORTED_MODULE_7__["default"],
});


/***/ }),

/***/ "./src/generators/AnimalGenerator.js":
/*!*******************************************!*\
  !*** ./src/generators/AnimalGenerator.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimalGenerator)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _animals_Animal_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../animals/Animal.js */ "./src/animals/Animal.js");




class AnimalGenerator {
    constructor(objects) {
        this.respawnPoints = [];
        this.maxAnimals = -1;
        this.objects = objects;
    }
    getName() {
        return _animals_Animal_js__WEBPACK_IMPORTED_MODULE_3__["default"].ANIMAL_NAME;
    }
    getAnimalClass() {
        return _animals_Animal_js__WEBPACK_IMPORTED_MODULE_3__["default"];
    }
    getSettings() {
        return _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].ANIMALS[this.getName()];
    }
    getRarity() {
        return this.getSettings().rarity;
    }
    needUpdateHabitat() {
        return false;
    }
    updateHabitat() {
        if (!this.habitat) {
            this.setHabitat(new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_2__["default"](_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, 1));
        }
        return this;
    }
    setHabitat(habitat) {
        this.habitat = habitat;
        this.maxAnimals = -1; // Force recalculation
    }
    getHabitat() {
        return this.habitat;
    }
    isCellInHabitat(x, y) {
        return this.getHabitat().filled(x, y);
    }
    createRespawnPoint() {
        const habitatClone = this.getHabitat().clone();
        habitatClone.diffCells(this.getRespawnPoints());
        if (!habitatClone.hasFilled()) {
            return false;
        }
        const point = habitatClone.getFilledCells().randomElement();
        if (!point) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.throwError)("Cannot create animal", 1, true);
            return false;
        }
        this.respawnPoints.push(point);
        return true;
    }
    getRespawnPoints() {
        return this.respawnPoints;
    }
    checkRespawns(animalsCount) {
        const respawnChecks = Math.ceil(animalsCount / 3) + 1;
        for (let i = 0; i < respawnChecks; i++) {
            this.createRespawnPoint();
        }
    }
    getMaxAnimals() {
        if (this.maxAnimals === -1) {
            this.maxAnimals = this.getHabitat().countFilled() * this.getRarity();
        }
        return this.maxAnimals;
    }
    createAnimal(anotherAnimalsPositions) {
        // Filter respawn points that are sufficiently far from existing animals and inside the habitat.
        const availableRespawns = this.getRespawnPoints().filter((cell) => {
            return (anotherAnimalsPositions.getClosestDistanceTo(cell[0], cell[1]) >= _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].DISTANCE_BETWEEN_ANIMALS &&
                this.isCellInHabitat(cell[0], cell[1]));
        });
        if (!availableRespawns.length) {
            return null;
        }
        const cell = availableRespawns.randomElement();
        if (!cell) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.throwError)("Cannot create animal", 1, true);
            return null;
        }
        // @ts-expect-error Polymorphism
        return new (this.getAnimalClass())(cell[0], cell[1], this.getSettings());
    }
}


/***/ }),

/***/ "./src/generators/CowGenerator.js":
/*!****************************************!*\
  !*** ./src/generators/CowGenerator.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CowGenerator)
/* harmony export */ });
/* harmony import */ var _AnimalGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimalGenerator.js */ "./src/generators/AnimalGenerator.js");
/* harmony import */ var _animals_Cow_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animals/Cow.js */ "./src/animals/Cow.js");
/* harmony import */ var _biomes_Biome_Grass_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../biomes/Biome_Grass.js */ "./src/biomes/Biome_Grass.js");



class CowGenerator extends _AnimalGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    getName() {
        return _animals_Cow_js__WEBPACK_IMPORTED_MODULE_1__["default"].ANIMAL_NAME;
    }
    getAnimalClass() {
        return _animals_Cow_js__WEBPACK_IMPORTED_MODULE_1__["default"];
    }
    updateHabitat() {
        if (!this.suitableLandMap) {
            const grassMap = this.objects.biomesOperator.getSurfaceByBiomeName(_biomes_Biome_Grass_js__WEBPACK_IMPORTED_MODULE_2__["default"].name);
            const lowlandsMap = this.objects.altitudeMap.getLowland();
            this.suitableLandMap = grassMap.intersect(lowlandsMap);
        }
        const habitat = this.suitableLandMap.clone();
        habitat.diff(this.objects.forestsOperator.getForestMap());
        this.setHabitat(habitat);
        return this;
    }
}


/***/ }),

/***/ "./src/generators/DeerGenerator.js":
/*!*****************************************!*\
  !*** ./src/generators/DeerGenerator.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DeerGenerator)
/* harmony export */ });
/* harmony import */ var _AnimalGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimalGenerator.js */ "./src/generators/AnimalGenerator.js");
/* harmony import */ var _animals_Deer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animals/Deer.js */ "./src/animals/Deer.js");


class DeerGenerator extends _AnimalGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    getName() {
        return _animals_Deer_js__WEBPACK_IMPORTED_MODULE_1__["default"].ANIMAL_NAME;
    }
    getAnimalClass() {
        return _animals_Deer_js__WEBPACK_IMPORTED_MODULE_1__["default"];
    }
    updateHabitat() {
        const forestsOperator = this.objects.forestsOperator;
        const habitat = forestsOperator.getForestMap().clone();
        // Remove desert areas (e.g., palm groves) from the habitat.
        habitat.foreachFilled((x, y) => {
            if (forestsOperator.isDesertForest(x, y)) {
                habitat.unfill(x, y);
            }
        });
        this.setHabitat(habitat);
        return this;
    }
    needUpdateHabitat() {
        return true;
    }
}


/***/ }),

/***/ "./src/generators/FactionGenerator.js":
/*!********************************************!*\
  !*** ./src/generators/FactionGenerator.js ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FactionGenerator)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _structures_NumericMatrix_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../structures/NumericMatrix.js */ "./src/structures/NumericMatrix.js");
/* harmony import */ var _human_Faction_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../human/Faction.js */ "./src/human/Faction.js");




class FactionGenerator {
    constructor(objects) {
        this.objects = objects;
        this.probabilitiesMap = this.createOccurrenceProbabilityMap();
    }
    getBiomeProbability(biomeName) {
        var _a;
        return (_a = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.CREATE_PROBABILITIES.BIOMES[biomeName]) !== null && _a !== void 0 ? _a : 0;
    }
    isTooSmallIsland(x, y) {
        return this.objects.islandsMap.getCell(x, y) < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.CREATE_PROBABILITIES.MIN_ISLAND_SIZE;
    }
    createOccurrenceProbabilityMap() {
        const map = new _structures_NumericMatrix_js__WEBPACK_IMPORTED_MODULE_2__["default"](_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, 0);
        this.objects.biomesMap.foreachValues((biome) => {
            const biomeProbability = this.getBiomeProbability(biome.getName());
            if (biomeProbability === 0 || this.isTooSmallIsland(biome.x, biome.y)) {
                map.setCell(biome.x, biome.y, 0);
                return;
            }
            const oceanFactor = this.objects.oceanMap.hasFilledNeighbors(biome.x, biome.y)
                ? _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.CREATE_PROBABILITIES.CLOSE_TO_OCEAN
                : 1, waterFactor = this.objects.freshWaterMap.hasFilledNeighbors(biome.x, biome.y)
                ? _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.CREATE_PROBABILITIES.CLOSE_TO_WATER
                : 1, altitudeFactor = Math.max(1 - biome.altitude, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].MAX_HILLS_LEVEL), temperatureFactor = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.fromMiddleFractionValue)(this.objects.temperatureMap.getCell(biome.x, biome.y)), isForest = this.objects.forestMap.filled(biome.x, biome.y), forestFactor = isForest
                ? _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.CREATE_PROBABILITIES.IS_FOREST
                : this.objects.forestMap.hasFilledNeighbors(biome.x, biome.y)
                    ? _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.CREATE_PROBABILITIES.CLOSE_TO_FOREST
                    : 1;
            map.setCell(biome.x, biome.y, biomeProbability * oceanFactor * waterFactor * altitudeFactor * temperatureFactor * forestFactor);
        });
        return map;
    }
    generateFactions(count) {
        const factions = [];
        for (let i = 0; i < count; i++) {
            const point = this.probabilitiesMap.getRandomWeightedPoint();
            if (!point) {
                continue;
            }
            const [x, y] = point;
            factions.push(new _human_Faction_js__WEBPACK_IMPORTED_MODULE_3__["default"](x, y, {
                name: `Faction #${i + 1}`,
                color: _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].FACTIONS.COLORS[i]
            }));
            this.probabilitiesMap.setCell(x, y, 0);
            this.probabilitiesMap.foreachAroundRadius(x, y, 3, (nx, ny) => {
                this.probabilitiesMap.setCell(nx, ny, 0);
            });
        }
        return factions;
    }
}


/***/ }),

/***/ "./src/generators/FishGenerator.js":
/*!*****************************************!*\
  !*** ./src/generators/FishGenerator.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FishGenerator)
/* harmony export */ });
/* harmony import */ var _AnimalGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AnimalGenerator.js */ "./src/generators/AnimalGenerator.js");
/* harmony import */ var _animals_Fish_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../animals/Fish.js */ "./src/animals/Fish.js");


class FishGenerator extends _AnimalGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    getName() {
        return _animals_Fish_js__WEBPACK_IMPORTED_MODULE_1__["default"].ANIMAL_NAME;
    }
    getAnimalClass() {
        return _animals_Fish_js__WEBPACK_IMPORTED_MODULE_1__["default"];
    }
    updateHabitat() {
        if (!this.habitat) {
            // Combine fresh water with coastal water to form the fish habitat.
            const combinedHabitat = this.objects.freshWaterMap.clone().combineWith(this.objects.coastMap);
            this.setHabitat(combinedHabitat);
        }
        return this;
    }
}


/***/ }),

/***/ "./src/generators/ForestGenerator.js":
/*!*******************************************!*\
  !*** ./src/generators/ForestGenerator.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForestGenerator)
/* harmony export */ });
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.js */ "./config.js");


class ForestGenerator {
    constructor(altitudeMap, humidityMap) {
        this.groundCreateMults = {};
        this.notAllowedCells = [];
        this.notAllowedSet = new Set();
        this.altitudeMap = altitudeMap;
        this.humidityMap = humidityMap;
        this.maxForestCells = Math.ceil(altitudeMap.getLandCellsCount() * _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_LIMIT / 100);
        this.minCreateIntensity = Math.ceil(this.maxForestCells / 10);
        this.initializeGroundCreateMults();
        this.setNotAllowedCells();
    }
    initializeGroundCreateMults() {
        const maxGroundMult = Math.max(...Object.values(_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_GROUNDS_MULTS).map(v => v !== null && v !== void 0 ? v : 0));
        for (const [key, value] of Object.entries(_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_GROUNDS_MULTS)) {
            this.groundCreateMults[key] = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.changeRange)(value !== null && value !== void 0 ? value : 0, 0, maxGroundMult, 0, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_CREATE_MULTS.GROUND);
        }
    }
    setNotAllowedCells() {
        this.altitudeMap.foreachValues((altitude, x, y) => {
            if (altitude > _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MAX_HILLS_LEVEL) {
                this.notAllowedCells.push([x, y]);
                this.notAllowedSet.add(`${x},${y}`);
            }
        });
    }
    /**
     * Randomly picks a subset of up to `count` elements from the given array.
     * This method does not shuffle the entire array, but instead picks random
     * elements and removes them from a copy.
     */
    pickRandomSubset(array, count) {
        const result = [];
        const arr = array.slice(); // copy of the array
        const n = Math.min(count, arr.length);
        for (let i = 0; i < n; i++) {
            const idx = Math.floor(Math.random() * arr.length);
            result.push(arr[idx]);
            arr.splice(idx, 1);
        }
        return result;
    }
    generate(forestMap, step) {
        // For tree expansion, work on a shuffled copy of the current filled cells.
        const filledCells = forestMap.getFilledCells().shuffle();
        this.createTrees(forestMap, filledCells, step);
        this.growTrees(forestMap, filledCells, step);
    }
    growTrees(forestMap, filledCells, step) {
        this.cutTrees(forestMap, filledCells);
        this.expandTrees(forestMap, filledCells, step);
    }
    cutTrees(forestMap, filledCells) {
        if (filledCells.length === 0) {
            return;
        }
        filledCells
            .slice(0, Math.floor(filledCells.length * _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_DIE_CHANCE))
            .forEach(cell => forestMap.unfill(cell[0], cell[1]));
    }
    expandTrees(forestMap, filledCells, step) {
        const usedSpaceRatio = filledCells.length / this.maxForestCells;
        const growthChance = step <= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].STEPS_BOOST_STEPS
            ? _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_GROWTH_CHANCE * 3
            : _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_GROWTH_CHANCE;
        const growthSpeed = growthChance * (1 - usedSpaceRatio);
        if (growthSpeed === 0) {
            return;
        }
        // Build a Set for quick lookup of filled cells.
        const filledSet = new Set(filledCells.map(([x, y]) => `${x},${y}`));
        filledCells.forEach(cell => {
            forestMap.foreachNeighbors(cell[0], cell[1], (x, y) => {
                if (!filledSet.has(`${x},${y}`)) {
                    const humidity = this.humidityMap.getCell(x, y);
                    const growsChance = this.getCreateChance(forestMap, humidity, x, y, growthSpeed);
                    if ((0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.iAmLucky)(growsChance)) {
                        forestMap.fill(x, y);
                        filledSet.add(`${x},${y}`); // Update the set so subsequent checks include this cell.
                        return true; // Stop iterating neighbors for this cell.
                    }
                }
                return false;
            }, true);
        });
    }
    createTrees(forestMap, filledCells, step) {
        // Determine the number of new trees to attempt to create.
        const createIntensity = Math.ceil(Math.max(this.minCreateIntensity, this.maxForestCells / Math.max(1, filledCells.length)));
        // Instead of shuffling all unfilled cells, pick a random subset.
        const unfilledCells = forestMap.getUnfilledCells();
        const potentialCells = this.pickRandomSubset(unfilledCells, createIntensity);
        potentialCells.forEach(([x, y]) => {
            const bornChance = step <= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].STEPS_BOOST_STEPS
                ? _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_BORN_CHANCE * _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_BORN_BOOST
                : _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_BORN_CHANCE;
            const createChance = this.getCreateChance(forestMap, this.humidityMap.getCell(x, y), x, y, bornChance);
            if ((0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.iAmLucky)(createChance)) {
                forestMap.fill(x, y);
            }
        });
    }
    getCreateChance(forestMap, humidity, x, y, speed) {
        if (humidity === 0 || this.notAllowedSet.has(`${x},${y}`)) {
            return 0;
        }
        const biome = forestMap.biomes.getCell(x, y);
        if (!biome) {
            return 0;
        }
        const biomeName = biome.getName();
        if (!Object.prototype.hasOwnProperty.call(this.groundCreateMults, biomeName)) {
            return 0;
        }
        const waterMult = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_CREATE_MULTS.WATER;
        const humidityMult = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].FOREST_CREATE_MULTS.HUMIDITY;
        const waterDistance = biome.getDistanceToWater();
        const waterRatio = Math.max(1, waterMult / waterDistance);
        const humidityRatio = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.changeRange)(humidity, 0, 1, 0, humidityMult);
        const groundRatio = this.groundCreateMults[biomeName];
        return speed * (groundRatio + humidityRatio + waterRatio) * biome.altitude;
    }
}


/***/ }),

/***/ "./src/generators/NoiseMapGenerator.js":
/*!*********************************************!*\
  !*** ./src/generators/NoiseMapGenerator.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NoiseMapGenerator)
/* harmony export */ });
/* harmony import */ var _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/PointMatrix.js */ "./src/structures/PointMatrix.js");

class NoiseMapGenerator {
    constructor(size, power) {
        this.size = size;
        this.power = power;
    }
    generate() {
        noise.seed(Math.random());
        const map = new _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"](this.size, this.size);
        map.map((x, y) => {
            return (noise.simplex2(x / this.power, y / this.power) + 1) * 0.5; // [0, 1] blurred height map
        });
        return map;
    }
}


/***/ }),

/***/ "./src/helpers.js":
/*!************************!*\
  !*** ./src/helpers.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Filters: () => (/* binding */ Filters),
/* harmony export */   LightenDarkenColor: () => (/* binding */ LightenDarkenColor),
/* harmony export */   RGBToFraction: () => (/* binding */ RGBToFraction),
/* harmony export */   changeRange: () => (/* binding */ changeRange),
/* harmony export */   createImage: () => (/* binding */ createImage),
/* harmony export */   distance: () => (/* binding */ distance),
/* harmony export */   fillCanvasPixel: () => (/* binding */ fillCanvasPixel),
/* harmony export */   fractionToRGB: () => (/* binding */ fractionToRGB),
/* harmony export */   fromFraction: () => (/* binding */ fromFraction),
/* harmony export */   fromMiddleFractionValue: () => (/* binding */ fromMiddleFractionValue),
/* harmony export */   getPolygonAreaSize: () => (/* binding */ getPolygonAreaSize),
/* harmony export */   getStep: () => (/* binding */ getStep),
/* harmony export */   getTimeForEvent: () => (/* binding */ getTimeForEvent),
/* harmony export */   hexToRgb: () => (/* binding */ hexToRgb),
/* harmony export */   iAmLucky: () => (/* binding */ iAmLucky),
/* harmony export */   logTimeEvent: () => (/* binding */ logTimeEvent),
/* harmony export */   normalRandBetweenNumbers: () => (/* binding */ normalRandBetweenNumbers),
/* harmony export */   normalRandom: () => (/* binding */ normalRandom),
/* harmony export */   preloadImages: () => (/* binding */ preloadImages),
/* harmony export */   randBetweenNumbers: () => (/* binding */ randBetweenNumbers),
/* harmony export */   resetTimeEvent: () => (/* binding */ resetTimeEvent),
/* harmony export */   rgbToHex: () => (/* binding */ rgbToHex),
/* harmony export */   rgbToRgba: () => (/* binding */ rgbToRgba),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   roundToNextSlice: () => (/* binding */ roundToNextSlice),
/* harmony export */   scaleImageData: () => (/* binding */ scaleImageData),
/* harmony export */   throwError: () => (/* binding */ throwError),
/* harmony export */   toFraction: () => (/* binding */ toFraction)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const errors = [];
function throwError(msg, limit = 5, unique = true) {
    if (errors.length < limit) {
        if (!unique || !errors.includes(msg)) {
            console.error(msg);
            errors.push(msg);
        }
    }
}
const Filters = {
    filters: {},
    add(tag, filter) {
        (this.filters[tag] || (this.filters[tag] = [])).push(filter);
    },
    apply(tag, val) {
        const list = this.filters[tag];
        if (list) {
            for (let i = 0, len = list.length; i < len; i++) {
                val = list[i](val);
            }
        }
        return val;
    },
};
let step = 0;
/** Returns a unique auto‐incremented step value. */
function getStep() {
    return ++step;
}
/** Rounds the number to a fixed precision. */
function round(value, precision) {
    return parseFloat(value.toFixed(precision));
}
/**
 * Generates a normally distributed random number in [0,1].
 * Uses the Box–Muller transform with a do/while loop to avoid recursion.
 */
function normalRandom() {
    let num;
    do {
        const u = Math.random();
        const v = Math.random();
        num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5;
    } while (num > 1 || num < 0);
    return num;
}
/** Returns a normally distributed random value between two floats. */
function normalRandBetweenNumbers(float1, float2) {
    return normalRandom() * (float2 - float1) + float1;
}
/** Returns a random value between two float values. */
function randBetweenNumbers(float1, float2) {
    return Math.random() * (float2 - float1) + float1;
}
/**
 * Simulates a coin flip given a chance (0-100).
 */
function iAmLucky(chance) {
    if (chance >= 100) {
        return true;
    }
    if (chance <= 0) {
        return false;
    }
    return chance >= randBetweenNumbers(0, 100);
}
/** Converts a fraction [0,1] to a value in the specified range [min,max]. */
function fromFraction(value, min, max) {
    return value * (max - min) + min;
}
/** Converts a value in the range [min,max] to a fraction [0,1]. */
function toFraction(value, min, max) {
    return (value - min) / (max - min);
}
/**
 * Converts a value to a “middle‐best” score.
 * For example, if 0.5 is optimal in [0,1], then values closer to 0.5 yield higher scores.
 */
function fromMiddleFractionValue(value, targetValue = 0.5) {
    return Math.max(0, 1 - Math.abs(value - targetValue));
}
/**
 * Maps a value from one range to another.
 */
function changeRange(value, minOld, maxOld, minNew, maxNew) {
    return ((value - minOld) * (maxNew - minNew)) / (maxOld - minOld) + minNew;
}
/**
 * Rounds the number to the next “slice” in the range.
 * Example: roundToNextSlice(0.45, 0, 1, 10) => 0.4
 */
function roundToNextSlice(number, rangeStart, rangeEnd, N) {
    if (number > rangeEnd || number < rangeStart) {
        throwError(`Number ${number} is out of range [${rangeStart}, ${rangeEnd}]`, 1, true);
    }
    const sliceSize = (rangeEnd - rangeStart) / N;
    const adjustedNumber = (number - rangeStart) / sliceSize;
    let roundedNumber = Math.ceil(adjustedNumber);
    if (adjustedNumber === Math.floor(adjustedNumber)) {
        roundedNumber = Math.floor(adjustedNumber);
    }
    return roundedNumber * sliceSize + rangeStart;
}
/** Converts a fraction [0,1] to an RGB value [0,255]. */
function fractionToRGB(value) {
    return Math.round(value * 255);
}
/** Converts an RGB value [0,255] to a fraction [0,1]. */
function RGBToFraction(value) {
    return value / 255;
}
/** Retrieves the Euclidean distance between two points. */
function distance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}
/**
 * Darkens or lightens a hex color by a given amount.
 * Caches results to avoid re‑computations.
 */
const colorCache = {};
function LightenDarkenColor(col, amt) {
    const cacheKey = col + "_" + amt;
    if (colorCache[cacheKey]) {
        return colorCache[cacheKey];
    }
    let usePound = false;
    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }
    const num = parseInt(col, 16);
    let r = (num >> 16) + amt;
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    let g = (num & 0x0000ff) + amt;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    let b = ((num >> 8) & 0x00ff) + amt;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    const newColor = (usePound ? "#" : "") +
        ("000000" + ((r << 16) | (b << 8) | g).toString(16)).slice(-6);
    colorCache[cacheKey] = newColor;
    return newColor;
}
/**
 * Converts an RGB color and alpha value to an RGBA array.
 */
function rgbToRgba(rgb, alpha) {
    return [rgb[0], rgb[1], rgb[2], alpha];
}
/**
 * Converts an RGBA color to a hex string.
 */
function rgbToHex(rgba) {
    const hex = rgba
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("");
    return `#${hex}`;
}
/**
 * Computes the area of a polygon defined by a list of points.
 */
function getPolygonAreaSize(coords) {
    let area = 0;
    for (let i = 0, len = coords.length; i < len; i++) {
        const j = (i + 1) % len;
        area += coords[i][0] * coords[j][1] - coords[j][0] * coords[i][1];
    }
    return area / 2;
}
/**
 * Fills a canvas pixel with the given RGBA color.
 * Blends with existing color if present.
 */
function fillCanvasPixel(image, point, RGBa, blendFactor = 0.5) {
    var _a;
    if (image.data[point] === 0 &&
        image.data[point + 1] === 0 &&
        image.data[point + 2] === 0) {
        image.data[point] = RGBa[0];
        image.data[point + 1] = RGBa[1];
        image.data[point + 2] = RGBa[2];
        image.data[point + 3] = (_a = RGBa[3]) !== null && _a !== void 0 ? _a : 255;
    }
    else {
        image.data[point] = image.data[point] * blendFactor + RGBa[0] * (1 - blendFactor);
        image.data[point + 1] = image.data[point + 1] * blendFactor + RGBa[1] * (1 - blendFactor);
        image.data[point + 2] = image.data[point + 2] * blendFactor + RGBa[2] * (1 - blendFactor);
        image.data[point + 3] = 255;
    }
}
/**
 * Scales canvas image data by the given width and height factors.
 */
function scaleImageData(context, imageData, widthScale, heightScale) {
    const srcWidth = imageData.width;
    const srcHeight = imageData.height;
    const destWidth = srcWidth * widthScale;
    const destHeight = srcHeight * heightScale;
    const scaled = context.createImageData(destWidth, destHeight);
    const subLine = context.createImageData(widthScale, 1).data;
    for (let row = 0; row < srcHeight; row++) {
        for (let col = 0; col < srcWidth; col++) {
            const srcIndex = (row * srcWidth + col) * 4;
            const sourcePixel = imageData.data.subarray(srcIndex, srcIndex + 4);
            for (let x = 0; x < widthScale; x++) {
                subLine.set(sourcePixel, x * 4);
            }
            for (let y = 0; y < heightScale; y++) {
                const destRow = row * heightScale + y;
                const destCol = col * widthScale;
                scaled.data.set(subLine, (destRow * destWidth + destCol) * 4);
            }
        }
    }
    return scaled;
}
let timer = Date.now();
function getTimeForEvent() {
    return Math.max(0, Date.now() - timer);
}
function logTimeEvent(event) {
    const t = Date.now();
    console.log(`${event} [${Math.max(0, t - timer)}ms]`);
    timer = t;
}
function resetTimeEvent() {
    timer = Date.now();
}
const hexStorage = {};
function hexToRgb(hex) {
    if (!hex) {
        return [0, 0, 0];
    }
    if (!hexStorage[hex]) {
        // Expand shorthand (e.g. "03F") to full form ("0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        hexStorage[hex] = result
            ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
            : [0, 0, 0];
    }
    return hexStorage[hex];
}
function preloadImages(obj, container) {
    return __awaiter(this, void 0, void 0, function* () {
        for (const key in obj) {
            if (typeof obj[key] === "object") {
                yield preloadImages(obj[key], container);
            }
            else if (typeof obj[key] === "string" && obj[key].endsWith(".png")) {
                try {
                    container[obj[key]] = yield createImage(obj[key]);
                }
                catch (error) {
                    console.error(`Failed to preload image: ${obj[key]}`, error);
                }
            }
        }
    });
}
function createImage(src) {
    return __awaiter(this, void 0, void 0, function* () {
        if (src === null)
            return null;
        const img = new Image();
        img.src = src;
        yield img.decode();
        return img;
    });
}


/***/ }),

/***/ "./src/human/Faction.js":
/*!******************************!*\
  !*** ./src/human/Faction.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _structures_NumericMatrix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../structures/NumericMatrix.js */ "./src/structures/NumericMatrix.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");




class Faction {
    constructor(startPointX, startPointY, factionSettings) {
        this.id = this.generateId();
        this.factionName = factionSettings.name;
        this.factionColor = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.hexToRgb)(factionSettings.color);
        this.startPosition = [startPointX, startPointY];
        this.territory = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"](_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.borders = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"](_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, 0).fill(startPointX, startPointY);
        this.influenceTerritory = new _structures_NumericMatrix_js__WEBPACK_IMPORTED_MODULE_1__["default"](_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, 0);
    }
    generateId() {
        return `${this.constructor.name}-${Faction.incrementId()}`;
    }
    static incrementId() {
        return ++this.latestId;
    }
    getFactionColor() {
        return this.factionColor;
    }
    getFactionTerritoryColor() {
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.rgbToRgba)(this.getFactionColor(), (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.fractionToRGB)(0.5));
    }
    getFactionBorderColor() {
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.rgbToRgba)(this.getFactionColor(), (0,_helpers_js__WEBPACK_IMPORTED_MODULE_3__.fractionToRGB)(0.5));
    }
    getName() {
        return this.factionName;
    }
    getSize() {
        return this.territory.getFilledCells().length;
    }
}
Faction.latestId = 0;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Faction);


/***/ }),

/***/ "./src/maps/AltitudeMap.js":
/*!*********************************!*\
  !*** ./src/maps/AltitudeMap.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AltitudeMap)
/* harmony export */ });
/* harmony import */ var _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/PointMatrix.js */ "./src/structures/PointMatrix.js");
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _generators_NoiseMapGenerator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../generators/NoiseMapGenerator.js */ "./src/generators/NoiseMapGenerator.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config.js */ "./config.js");




class AltitudeMap extends _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor() {
        super(...arguments);
        this.waterSize = 0;
        this.landSize = 0;
    }
    generateMap() {
        // Generate several noise maps and blend them.
        const octaves = [3, 5, 20];
        const maps = octaves.map(octave => new _generators_NoiseMapGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"](_config_js__WEBPACK_IMPORTED_MODULE_3__["default"].WORLD_SIZE, octave * (_config_js__WEBPACK_IMPORTED_MODULE_3__["default"].WORLD_SIZE / 75)).generate());
        this.map((x, y) => {
            let val = 0;
            let size = 0;
            // Blend maps using a weighted sum.
            maps.forEach((map, i) => {
                const s = Math.pow(2, i);
                size += s;
                val += map.getCell(x, y) * s;
            });
            val /= size;
            // Stretch the noise to adjust ocean vs. land ratio.
            val = Math.min(1, Math.pow(val, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].WORLD_MAP_OCEAN_INTENSITY + 0.95)); // Note 1.0 adds too much ocean, so I reduced it
            // Apply island shaping with a non‑symmetric mask.
            val = this.makeIsland(x, y, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].WORLD_SIZE, val);
            val = Math.min(1, val);
            // Return the value rounded to 2 decimals.
            return Math.round(val * 100) / 100;
        });
        // Optionally, apply erosion to simulate thermal erosion.
        this.applyErosion(_config_js__WEBPACK_IMPORTED_MODULE_3__["default"].EROSION_ITERATIONS || 3);
        this.initVariables();
    }
    loadMap(str) {
        this.fromString(str);
        this.initVariables();
    }
    initVariables() {
        this.waterSize = 0;
        this.landSize = 0;
        this.foreachValues((altitude) => {
            if (this.isWater(altitude)) {
                this.waterSize++;
            }
            else {
                this.landSize++;
            }
        });
    }
    /**
     * Applies a non-symmetric island mask.
     * Instead of a simple radial falloff, we add a noise offset to vary the edge.
     *
     * @param x - the x coordinate.
     * @param y - the y coordinate.
     * @param islandSize - the overall size of the island (assumed square).
     * @param altitude - the computed altitude from noise.
     * @returns The modified altitude after applying the island mask.
     */
    makeIsland(x, y, islandSize, altitude) {
        const cx = islandSize * 0.5;
        const cy = islandSize * 0.5;
        // Compute normalized distances from center.
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const baseDistance = Math.sqrt(dx * dx + dy * dy);
        // Introduce non-symmetric variation with additional noise.
        const noiseScale = islandSize * 0.1;
        const noiseVal = (noise.simplex2(x / noiseScale, y / noiseScale) + 1) / 2; // in [0,1]
        // Increase the threshold to enlarge the island.
        // For instance, changing the base from 0.42 to 0.7.
        const threshold = 0.7 + (noiseVal - 0.5) * 0.1;
        // Compute a modified distance factor.
        const delta = baseDistance / threshold;
        const gradient = delta * delta - 0.2;
        // Reduce altitude near edges. (Clamp to [0, altitude])
        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    }
    /**
     * Applies a simple thermal erosion simulation.
     * For each cell, if its altitude is significantly higher than its neighbors,
     * a fraction of the difference is transferred, smoothing out sharp features.
     *
     * @param iterations - number of erosion passes.
     */
    applyErosion(iterations) {
        for (let iter = 0; iter < iterations; iter++) {
            // Create a deep copy of the current map data.
            const newMap = this.toArray().map(row => [...row]);
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    const currentAltitude = this.getCell(x, y);
                    const neighbors = this.getNeighbors(x, y);
                    // Transfer a fraction of the altitude difference to each lower neighbor.
                    neighbors.forEach(([nx, ny]) => {
                        const neighborAltitude = this.getCell(nx, ny);
                        const diff = currentAltitude - neighborAltitude;
                        if (diff > 0.01) { // Only transfer if the difference is significant.
                            const transfer = 0.05 * diff;
                            newMap[x][y] -= transfer;
                            newMap[nx][ny] += transfer;
                        }
                    });
                }
            }
            this.setAll(newMap);
        }
    }
    isWater(level) {
        return _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MIN_GROUND_LEVEL >= level;
    }
    isGround(level) {
        return level > _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MIN_GROUND_LEVEL;
    }
    isLowLand(level) {
        return level > _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MIN_GROUND_LEVEL && level <= _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_LOWLAND_LEVEL;
    }
    isHills(level) {
        return level > _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_LOWLAND_LEVEL && level <= _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_HILLS_LEVEL;
    }
    isMountains(level) {
        return level > _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_HILLS_LEVEL;
    }
    getLandCellsCount() {
        return this.landSize;
    }
    getWaterCellsCount() {
        return this.waterSize;
    }
    getLowland() {
        const lowland = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_1__["default"](this.width, this.height);
        this.foreachValues((altitude, x, y) => {
            if (this.isLowLand(altitude)) {
                lowland.setCell(x, y, 1);
            }
        });
        return lowland;
    }
}


/***/ }),

/***/ "./src/maps/BiomesMap.js":
/*!*******************************!*\
  !*** ./src/maps/BiomesMap.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BiomesMap)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _structures_Matrix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../structures/Matrix.js */ "./src/structures/Matrix.js");


class BiomesMap extends _structures_Matrix_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor() {
        super(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE);
    }
}


/***/ }),

/***/ "./src/maps/CoastMap.js":
/*!******************************!*\
  !*** ./src/maps/CoastMap.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CoastMap)
/* harmony export */ });
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.js */ "./config.js");


class CoastMap extends _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(oceanMap, altitudeMap) {
        super(_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, 0);
        this.oceanMap = oceanMap;
        this.altitudeMap = altitudeMap;
    }
    isCoast(altitude) {
        return altitude >= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MIN_COAST_LEVEL && altitude <= _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MIN_GROUND_LEVEL;
    }
    generateMap() {
        this.oceanMap.foreachFilled((x, y) => {
            if (this.isCoast(this.altitudeMap.getCell(x, y))) {
                this.fill(x, y);
            }
        });
        return this;
    }
}


/***/ }),

/***/ "./src/maps/ForestMap.js":
/*!*******************************!*\
  !*** ./src/maps/ForestMap.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForestMap)
/* harmony export */ });
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.js */ "./config.js");


class ForestMap extends _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(biomes) {
        super(_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, 0);
        this.biomes = biomes;
    }
}


/***/ }),

/***/ "./src/maps/HumidityMap.js":
/*!*********************************!*\
  !*** ./src/maps/HumidityMap.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HumidityMap)
/* harmony export */ });
/* harmony import */ var _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/PointMatrix.js */ "./src/structures/PointMatrix.js");
/* harmony import */ var _generators_NoiseMapGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../generators/NoiseMapGenerator.js */ "./src/generators/NoiseMapGenerator.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config.js */ "./config.js");



class HumidityMap extends _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(altitudeMap, riversMap, lakesMap) {
        super(_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE);
        /**
         * 0 = wet
         * 1 = dry
         */
        this.generateMap = () => {
            this.generateNoiseMap();
            this.considerAltitude();
            this.considerRivers();
            this.considerLakes();
            this.normalize();
            return this;
        };
        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
    }
    generateNoiseMap() {
        this.setAll(new _generators_NoiseMapGenerator_js__WEBPACK_IMPORTED_MODULE_1__["default"](_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, 150)
            .generate()
            .getValues());
    }
    considerAltitude() {
        // Higher altitude = lower humidity
        this.foreachValues((altitude, x, y) => {
            this.addToCell(x, y, -altitude * 0.5);
        });
    }
    considerRivers() {
        // Rivers increase humidity.
        // Instead of calling a separate "distance" function, we inline the calculation.
        this.riversMap.foreachFilled((x, y) => {
            this.foreachAroundRadius(x, y, 4, (nx, ny) => {
                const dx = nx - x;
                const dy = ny - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist !== 0) {
                    this.addToCell(nx, ny, 0.015 / dist);
                }
            });
        });
    }
    considerLakes() {
        // Lakes increase humidity.
        this.lakesMap.foreachFilled((x, y) => {
            this.foreachAroundRadius(x, y, 5, (nx, ny) => {
                const dx = nx - x;
                const dy = ny - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist !== 0) {
                    this.addToCell(nx, ny, 0.01 / dist);
                }
            });
        });
    }
}


/***/ }),

/***/ "./src/maps/IslandsMap.js":
/*!********************************!*\
  !*** ./src/maps/IslandsMap.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IslandsMap)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _structures_NumericMatrix_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../structures/NumericMatrix.js */ "./src/structures/NumericMatrix.js");


class IslandsMap extends _structures_NumericMatrix_js__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor(oceanMap) {
        // Initialize all cells to -1 to mark them as not processed.
        super(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, -1);
        this.oceanMap = oceanMap;
    }
    /**
     * Returns all the connected non‑ocean cells (an island) starting from (startX, startY)
     * using a flood‑fill that tracks visited cells in a Set for fast lookup.
     *
     * @param startX - The starting x coordinate.
     * @param startY - The starting y coordinate.
     * @returns An array of [x, y] coordinates belonging to the same island.
     */
    getIsland(startX, startY) {
        const islandCells = [];
        const stack = [[startX, startY]];
        const visited = new Set();
        visited.add(`${startX},${startY}`); // Store all processed cells in a Set for fast lookup.
        const notOceanMap = this.oceanMap.getNotOceanMap();
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            islandCells.push([x, y]);
            // For each filled (i.e. non‑ocean) neighbor of (x, y), add it to the stack if not visited.
            notOceanMap.foreachFilledAround(x, y, (nx, ny) => {
                const key = `${nx},${ny}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    stack.push([nx, ny]);
                }
            });
        }
        return islandCells;
    }
    /**
     * Loops over all cells and for each unprocessed non‑ocean cell,
     * flood‑fills the connected region (island) and sets its value to the island size.
     */
    generateMap() {
        for (let x = 0; x < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE; x++) {
            for (let y = 0; y < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE; y++) {
                // If the cell already has been assigned a value (>= 0), skip it.
                if (this.getCell(x, y) >= 0) {
                    continue;
                }
                // If the cell is ocean, mark it as 0 and skip.
                if (this.oceanMap.filled(x, y)) {
                    this.setCell(x, y, 0);
                    continue;
                }
                // Flood-fill from this cell to get all connected non‑ocean cells.
                const island = this.getIsland(x, y);
                const islandSize = island.length;
                // Set every cell in the island to the island's size.
                island.forEach(([cellX, cellY]) => {
                    this.setCell(cellX, cellY, islandSize);
                });
            }
        }
        return this;
    }
}


/***/ }),

/***/ "./src/maps/LakesMap.js":
/*!******************************!*\
  !*** ./src/maps/LakesMap.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LakesMap)
/* harmony export */ });
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.js */ "./config.js");


class LakesMap extends _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(altitudeMap, oceanMap) {
        super(_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
    }
    generateMap() {
        this.altitudeMap.foreachValues((altitude, x, y) => {
            if (this.altitudeMap.isWater(altitude) && !this.oceanMap.filled(x, y)) {
                this.fill(x, y);
            }
        });
        return this;
    }
}


/***/ }),

/***/ "./src/maps/OceanMap.js":
/*!******************************!*\
  !*** ./src/maps/OceanMap.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ OceanMap)
/* harmony export */ });
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.js */ "./config.js");


class OceanMap extends _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(altitudeMap) {
        super(_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
    }
    includeAllWaterCellsAround(startX, startY) {
        this.fill(startX, startY);
        const activeCells = [[startX, startY]];
        // Cache altitudeMap locally for faster access.
        const altMap = this.altitudeMap;
        while (activeCells.length) {
            const [x, y] = activeCells.pop();
            altMap.foreachAroundRadius(x, y, 1, (nx, ny) => {
                const altitude = altMap.getCell(nx, ny);
                if (altMap.isWater(altitude) && !this.filled(nx, ny)) {
                    this.fill(nx, ny);
                    activeCells.push([nx, ny]);
                }
            });
        }
    }
    bigLakesToSeas() {
        const worldSize = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE;
        const altMap = this.altitudeMap;
        // Create a temporary BinaryMatrix to mark water that is not yet ocean.
        const tempMap = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"](worldSize, worldSize, 0);
        altMap.foreachValues((altitude, x, y) => {
            if (altMap.isWater(altitude) && !this.filled(x, y)) {
                tempMap.fill(x, y);
            }
        });
        tempMap.foreachFilled((x, y) => {
            // If this water body in tempMap is large enough (exceeds worldSize), include it.
            if (!this.filled(x, y) && tempMap.getSizeFromPoint(x, y) > worldSize) {
                this.includeAllWaterCellsAround(x, y);
            }
        });
    }
    generateMap() {
        const startX = 0, startY = 0;
        const altMap = this.altitudeMap;
        // If the top-left cell is not water, return immediately.
        if (!altMap.isWater(altMap.getCell(startX, startY))) {
            return this;
        }
        this.includeAllWaterCellsAround(startX, startY);
        this.bigLakesToSeas();
        return this;
    }
    getNotOceanMap() {
        const notOceanMap = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"](_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, 0);
        this.foreachUnfilled((x, y) => {
            notOceanMap.fill(x, y);
        });
        return notOceanMap;
    }
}


/***/ }),

/***/ "./src/maps/RiversMap.js":
/*!*******************************!*\
  !*** ./src/maps/RiversMap.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RiversMap)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _structures_Array2D_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../structures/Array2D.js */ "./src/structures/Array2D.js");




class RiversMap extends _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_2__["default"] {
    constructor(altitudeMap, lakesMap) {
        super(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
        this.lakesMap = lakesMap;
        this.riversCount = 0;
    }
    generateMap() {
        const riverSources = this.getRiverSources(this.altitudeMap);
        const rivers = this.generateRiversCells(riverSources);
        // Optionally add river delta
        // rivers = this.addRiverDeltaToRiversMaps(rivers);
        this.createRiverMapFromRiversPoints(rivers);
        this.riversCount = rivers.length;
        return this;
    }
    getRiverSources(altitudeMap) {
        const spawns = [];
        altitudeMap.foreachValues((altitude, x, y) => {
            if (altitudeMap.isGround(altitude) &&
                altitude >= _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RIVER_SOURCE_MIN_ALTITUDE &&
                altitude <= _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RIVER_SOURCE_MAX_ALTITUDE) {
                spawns.push([x, y]);
            }
        });
        return spawns.shuffle();
    }
    generateRiversCells(riverSources) {
        const rivers = [];
        const riversLimit = Math.floor((0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.fromFraction)(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RIVERS_DENSITY, 1, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE));
        const startCloseness = Math.max(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RIVER_MIN_LENGTH, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RIVER_START_CLOSENESS);
        // Use an array for distance calculations and a Set for fast membership tests.
        const allRiversPoints = [];
        const allRiversPointsSet = new Set();
        for (let i = 0; i < riverSources.length; i++) {
            if (i > 0 &&
                startCloseness >= allRiversPoints.getClosestDistanceTo(riverSources[i][0], riverSources[i][1])) {
                continue;
            }
            const river = [];
            let finished = false;
            river.push(riverSources[i]);
            for (let j = 0; j < _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE; j++) {
                const nextRiverPoint = this.getRiverDirection(river, this.altitudeMap);
                if (!nextRiverPoint)
                    break;
                const [x, y] = nextRiverPoint;
                const altitude = this.altitudeMap.getCell(x, y);
                // Instead of calling arrayHasPoint (a linear search), we use our Set.
                if (this.altitudeMap.isWater(altitude) || allRiversPointsSet.has(`${x},${y}`)) {
                    if (this.lakesMap.filled(x, y)) {
                        const lakeSize = this.lakesMap.getSizeFromPoint(x, y);
                        if (lakeSize > river.length * _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].LAKE_TO_RIVER_RATIO) {
                            finished = true;
                            break;
                        }
                    }
                    else {
                        finished = true;
                        break;
                    }
                }
                if (!finished) {
                    river.push(nextRiverPoint);
                }
            }
            if (finished && river.length >= _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RIVER_MIN_LENGTH) {
                rivers.push(river);
                // Update both the array and the Set.
                for (const point of river) {
                    const key = `${point[0]},${point[1]}`;
                    if (!allRiversPointsSet.has(key)) {
                        allRiversPoints.push(point);
                        allRiversPointsSet.add(key);
                    }
                }
                if (rivers.length === riversLimit)
                    break;
            }
        }
        return rivers;
    }
    getRiverDirection(river, altitudeMap) {
        const currentPoint = river[river.length - 1];
        const prevPoint = river.length > 1 ? river[river.length - 2] : null;
        const [cx, cy] = currentPoint;
        const currentAltitude = altitudeMap.getCell(cx, cy);
        const neighbors = altitudeMap.getNeighbors(cx, cy).shuffle();
        for (const [nx, ny] of neighbors) {
            const altitude = altitudeMap.getCell(nx, ny);
            if (altitude > currentAltitude)
                continue;
            if (prevPoint && (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.distance)(nx, ny, prevPoint[0], prevPoint[1]) === 1)
                continue;
            return [nx, ny];
        }
        return null;
    }
    addRiverDeltaToRiverMap(river) {
        const delta = [];
        const ratio = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.randBetweenNumbers)(0.01, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].RIVER_DELTA_MAX_LENGTH);
        const deltaLength = Math.floor(river.length * ratio);
        const notDeltaLength = river.length - deltaLength;
        for (let p = 0; p < river.length; p++) {
            if (p > notDeltaLength) {
                this.foreachAroundRadius(river[p][0], river[p][1], 1, (nx, ny) => {
                    if ([0, 1].randomElement() === 0 && !(0,_structures_Array2D_js__WEBPACK_IMPORTED_MODULE_3__.arrayHasPoint)(river, nx, ny)) {
                        delta.push([nx, ny]);
                    }
                });
            }
        }
        return river.concat(delta);
    }
    createRiverMapFromRiversPoints(rivers) {
        for (const river of rivers) {
            for (const [x, y] of river) {
                this.fill(x, y);
            }
        }
    }
    getGeneratedRiversCount() {
        return this.riversCount;
    }
    addRiverDeltaToRiversMaps(rivers) {
        return rivers.map(river => this.addRiverDeltaToRiverMap(river));
    }
}


/***/ }),

/***/ "./src/maps/TemperatureMap.js":
/*!************************************!*\
  !*** ./src/maps/TemperatureMap.js ***!
  \************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TemperatureMap)
/* harmony export */ });
/* harmony import */ var _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/PointMatrix.js */ "./src/structures/PointMatrix.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.js */ "./config.js");


class TemperatureMap extends _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(altitudeMap) {
        super(_config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE);
        this.altitudeMap = altitudeMap;
    }
    generateMap() {
        this.addGradient();
        this.considerAltitude();
        this.normalize();
        return this;
    }
    addGradient() {
        const gradient = [];
        const worldSize = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].WORLD_SIZE;
        for (let i = 0; i < worldSize; i++) {
            // Compute a linear value for the central area.
            const linearValue = i / worldSize;
            // Clamp the value to [0, 1]
            const clamped = Math.min(1, Math.max(0, linearValue));
            // Apply an ease-in-out sine curve.
            // This creates a curved gradient rather than a linear one.
            gradient[i] = 0.5 - 0.5 * Math.cos(clamped * Math.PI);
        }
        // Apply the gradient value (which now uses our curved mapping)
        // based on the y coordinate for every cell.
        this.foreach((x, y) => {
            this.addToCell(x, y, gradient[y]);
        });
    }
    considerAltitude() {
        const minLevel = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"].MIN_GROUND_LEVEL;
        this.foreach((x, y) => {
            let altitude = this.altitudeMap.getCell(x, y);
            altitude = altitude >= minLevel ? (altitude - minLevel) * (altitude - minLevel) : 0;
            this.subtractFromCell(x, y, altitude);
        });
    }
}


/***/ }),

/***/ "./src/operators/AnimalsOperator.js":
/*!******************************************!*\
  !*** ./src/operators/AnimalsOperator.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AnimalsOperator)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _generators_CowGenerator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../generators/CowGenerator.js */ "./src/generators/CowGenerator.js");
/* harmony import */ var _generators_DeerGenerator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../generators/DeerGenerator.js */ "./src/generators/DeerGenerator.js");
/* harmony import */ var _generators_FishGenerator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../generators/FishGenerator.js */ "./src/generators/FishGenerator.js");
/* harmony import */ var _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../render/DisplayCell.js */ "./src/render/DisplayCell.js");
/* harmony import */ var _structures_Cells_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../structures/Cells.js */ "./src/structures/Cells.js");







class AnimalsOperator {
    constructor(args) {
        this.animals = [];
        this.animalsPositions = [];
        this.animalsTypesCounter = {};
        this.animalsGenerators = [];
        this.animalImagesCache = {};
        this.habitatInitialized = false;
        this.initializeAnimalGenerators(args);
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.logTimeEvent)("Animals initialized.");
        }
        args.timer.addStepsHandler(() => {
            this.step(args.habitatLayer, args.animalsLayer);
        });
    }
    initializeAnimalGenerators(args) {
        const availableGenerators = this.getAvailableGenerators();
        availableGenerators.forEach((Generator) => {
            const generatorInstance = new Generator(args);
            this.registerAnimalsGenerator(generatorInstance);
        });
    }
    step(habitatLayer, animalsLayer) {
        habitatLayer.reset();
        this.updateHabitats();
        animalsLayer.reset();
        this.maybeCreateAnimals();
        this.moveAnimals(animalsLayer);
        _helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.apply("animalsSteps", this.animals);
    }
    updateHabitats() {
        this.animalsGenerators.forEach(generator => {
            // Only update habitat if it is not static.
            if (!this.habitatInitialized || generator.needUpdateHabitat()) {
                generator.updateHabitat();
            }
        });
        this.habitatInitialized = true;
    }
    addAnimalToLayer(animalsLayer, animal) {
        animalsLayer.setCell(animal.x, animal.y, this.getDisplayCell(animal));
    }
    getAvailableGenerators() {
        return [_generators_FishGenerator_js__WEBPACK_IMPORTED_MODULE_4__["default"], _generators_DeerGenerator_js__WEBPACK_IMPORTED_MODULE_3__["default"], _generators_CowGenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"]];
    }
    getCellsAvailableToMove(animal) {
        const generator = this.getAnimalGeneratorByAnimal(animal);
        if (!generator) {
            return [];
        }
        const habitat = generator.getHabitat();
        const cellsAround = (0,_structures_Cells_js__WEBPACK_IMPORTED_MODULE_6__.getRectangleAround)(animal.x, animal.y, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE);
        return cellsAround.filter(([x, y]) => habitat.filled(x, y));
    }
    isAnimalsAroundPoint(cell, animalToExcept) {
        const availableCells = (0,_structures_Cells_js__WEBPACK_IMPORTED_MODULE_6__.getAroundRadius)(cell[0], cell[1], _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].WORLD_SIZE, 2);
        return availableCells.some(([x, y]) => this.animals.some((animal) => animal.id !== animalToExcept.id && animal.x === x && animal.y === y));
    }
    isAnimalsGeneratorRegistered(generator) {
        return this.animalsGenerators.some((registered) => registered.getName() === generator.getName());
    }
    registerAnimalsGenerator(generator) {
        if (!this.isAnimalsGeneratorRegistered(generator)) {
            this.animalsGenerators.push(generator);
            if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOGS) {
                console.log(`Generator "${generator.getName()}" registered`);
            }
        }
    }
    incAnimalsCount(name) {
        this.animalsTypesCounter[name] = (this.animalsTypesCounter[name] || 0) + 1;
    }
    decAnimalsCount(name) {
        this.animalsTypesCounter[name] = (this.animalsTypesCounter[name] || 1) - 1;
    }
    getAnimalsCountByName(name) {
        return this.animalsTypesCounter[name] || 0;
    }
    maybeCreateAnimals() {
        this.animalsGenerators.forEach((generator) => {
            const name = generator.getName();
            const animalsCount = this.getAnimalsCountByName(name);
            if (animalsCount > generator.getMaxAnimals()) {
                return;
            }
            generator.checkRespawns(animalsCount);
            const animal = generator.createAnimal(this.animalsPositions);
            if (animal) {
                this.animals.push(animal);
                this.incAnimalsCount(animal.getName());
            }
        });
    }
    getAnimalGeneratorByAnimal(animal) {
        return this.animalsGenerators.find((generator) => generator.getName() === animal.getName()) || null;
    }
    killAnimal(animal) {
        this.animals = this.animals.filter((a) => a !== animal);
        this.decAnimalsCount(animal.getName());
    }
    getNextMove(animal) {
        if (!(0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.iAmLucky)(animal.getMoveChance())) {
            return null;
        }
        let availableCells = this.getCellsAvailableToMove(animal);
        // If previous position is available, move there with a 90% chance.
        const prevPosition = animal.getPrevPosition();
        if (prevPosition && (0,_structures_Cells_js__WEBPACK_IMPORTED_MODULE_6__.isCellInCellList)(availableCells, prevPosition) && (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.iAmLucky)(90)) {
            return prevPosition;
        }
        const maxTries = 10;
        let tries = 0, nextPoint = null;
        while (!nextPoint && availableCells.length) {
            nextPoint = availableCells.randomElement() || null;
            if (nextPoint && this.isAnimalsAroundPoint(nextPoint, animal)) {
                availableCells = availableCells.filter((cell) => cell !== nextPoint);
                nextPoint = null;
            }
            if (++tries > maxTries) {
                (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.throwError)("Too many tries to find a free cell", 5, false);
                break;
            }
        }
        return nextPoint;
    }
    moveAnimals(animalsLayer) {
        this.animalsPositions = [];
        this.animals.forEach((animal) => {
            const nextPoint = this.getNextMove(animal);
            if (nextPoint) {
                animal.moveTo(nextPoint[0], nextPoint[1]);
                this.addAnimalToLayer(animalsLayer, animal);
            }
            else {
                const generator = this.getAnimalGeneratorByAnimal(animal);
                if (generator === null || generator === void 0 ? void 0 : generator.isCellInHabitat(animal.x, animal.y)) {
                    this.addAnimalToLayer(animalsLayer, animal);
                }
                else {
                    this.killAnimal(animal);
                }
            }
            this.animalsPositions.push(animal.getPosition());
        });
    }
    getDisplayCell(animal) {
        const key = animal.getName();
        if (!this.animalImagesCache[key]) {
            this.animalImagesCache[key] = new _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_5__["default"]((0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.hexToRgb)(animal.getColor()), animal.getImage());
        }
        return this.animalImagesCache[key];
    }
    showHabitatsOnLayer(habitatLayer, animal) {
        const generator = this.getAnimalGeneratorByAnimal(animal);
        generator === null || generator === void 0 ? void 0 : generator.getHabitat().foreachFilled((x, y) => {
            habitatLayer.setCell(x, y, new _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_5__["default"]([100, 100, 200, 255], null));
        });
    }
}


/***/ }),

/***/ "./src/operators/BiomesOperator.js":
/*!*****************************************!*\
  !*** ./src/operators/BiomesOperator.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BiomesOperator)
/* harmony export */ });
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../biomes/Biomes.js */ "./src/biomes/Biomes.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _maps_BiomesMap_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../maps/BiomesMap.js */ "./src/maps/BiomesMap.js");





class BiomesOperator {
    constructor(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, biomesLayer, biomesImagesLayer) {
        this.biomes = new _maps_BiomesMap_js__WEBPACK_IMPORTED_MODULE_4__["default"]();
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.coastMap = coastMap;
        this.freshWaterMap = freshWaterMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.biomesConfig = _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].biomesConfig();
        this.createBiomes();
        this.addBiomesToLayer(biomesLayer, biomesImagesLayer);
        this.biomes = _helpers_js__WEBPACK_IMPORTED_MODULE_2__.Filters.apply('biomes', this.biomes);
        if (_config_js__WEBPACK_IMPORTED_MODULE_3__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.logTimeEvent)('Biomes added');
        }
    }
    createBiomes() {
        this.altitudeMap.foreach((x, y) => {
            this.biomes.setCell(x, y, this._getBiome(x, y));
        });
    }
    isBeach(x, y, altitude, temperature, humidity) {
        return altitude > _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MIN_GROUND_LEVEL &&
            altitude <= _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_BEACH_LEVEL -
                (temperature * _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].BEACH_TEMPERATURE_RATIO * 2 - _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].BEACH_TEMPERATURE_RATIO) -
                (humidity * _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].BEACH_HUMIDITY_RATIO * 2 - _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].BEACH_HUMIDITY_RATIO) &&
            this.oceanMap.aroundFilled(x, y, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_BEACH_DISTANCE_FROM_OCEAN);
    }
    _checkBiomeIndex(fig, index) {
        return (fig[0] === 0 && index === 0) || (index > fig[0] && index <= fig[1]);
    }
    _getBiome(x, y) {
        let distanceToWater = this.freshWaterMap.distanceTo(x, y, 5);
        distanceToWater = Math.min(distanceToWater, 100);
        const altitude = this.altitudeMap.getCell(x, y);
        const args = {
            altitude,
            temperature: this.temperatureMap.getCell(x, y),
            humidity: this.humidityMap.getCell(x, y),
            distanceToWater,
            isHills: this.altitudeMap.isHills(altitude),
            isMountains: this.altitudeMap.isMountains(altitude),
        };
        if (this.freshWaterMap.filled(x, y)) {
            return new _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_1__["default"].Biome_Water(x, y, args);
        }
        if (this.oceanMap.filled(x, y)) {
            return this.coastMap.isCoast(args.altitude)
                ? new _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_1__["default"].Biome_Coast(x, y, args)
                : new _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_1__["default"].Biome_Ocean(x, y, args);
        }
        if (this.isBeach(x, y, args.altitude, args.temperature, args.humidity)) {
            return new _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_1__["default"].Biome_Beach(x, y, args);
        }
        const matchedBiomes = this.biomesConfig
            .filter(cfg => this._checkBiomeIndex(cfg.h, (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.fromFraction)(args.humidity, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MIN_HUMIDITY, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_HUMIDITY)) &&
            this._checkBiomeIndex(cfg.t, (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.fromFraction)(args.temperature, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MIN_TEMPERATURE, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].MAX_TEMPERATURE)))
            .map(cfg => cfg.class);
        if (!matchedBiomes.length) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.throwError)(`No biome matched for ${x}, ${y}`, 2, true);
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.throwError)(args, 2, true);
            return new _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_1__["default"].Biome_Grass(x, y, args);
        }
        return new _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_1__["default"][matchedBiomes[Math.floor(Math.random() * matchedBiomes.length)]](x, y, args);
    }
    addBiomesToLayer(biomesLayer, biomesImagesLayer) {
        this.biomes.foreachValues((biome, x, y) => {
            const displayCell = biome.getDisplayCell();
            biomesLayer.setCell(x, y, displayCell);
            biomesImagesLayer.setCell(x, y, displayCell);
        });
    }
    getBiomes() {
        return this.biomes;
    }
    getBiome(x, y) {
        return this.biomes.getCell(x, y);
    }
    getSurfaceByBiomeName(biomeName) {
        const surface = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"](_config_js__WEBPACK_IMPORTED_MODULE_3__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_3__["default"].WORLD_SIZE, 0);
        this.altitudeMap.foreach((x, y) => {
            var _a;
            if (((_a = this.biomes.getCell(x, y)) === null || _a === void 0 ? void 0 : _a.getName()) === biomeName) {
                surface.fill(x, y);
            }
        });
        return surface;
    }
}


/***/ }),

/***/ "./src/operators/FactionsOperator.js":
/*!*******************************************!*\
  !*** ./src/operators/FactionsOperator.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ FactionsOperator)
/* harmony export */ });
/* harmony import */ var _generators_FactionGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../generators/FactionGenerator.js */ "./src/generators/FactionGenerator.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../render/DisplayCell.js */ "./src/render/DisplayCell.js");
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");





class FactionsOperator {
    constructor(args) {
        this.factions = [];
        this.factionsGenerator = new _generators_FactionGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"](args);
        this.forestMap = args.forestMap;
        this.biomesMap = args.biomesMap;
        this.factionsLayer = args.factionsLayer;
        this.factionsBorderLayer = args.factionsBorderLayer;
        this.occupiedTerritories = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_4__["default"](_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, 0);
        args.timer.addStepsHandler((step) => {
            if (this.factions.length) {
                this.expandFactions();
                _helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.apply('factionsUpdated', this.factions);
            }
            else if (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].FACTIONS.AUTO_CREATE_ON_STEP === step) {
                this.createFactions(_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].FACTIONS.COUNT);
            }
        });
    }
    createFactions(count) {
        (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.resetTimeEvent)();
        this.factions = this.factionsGenerator.generateFactions(count);
        this.factions.forEach(faction => {
            this.occupyCell(faction.startPosition[0], faction.startPosition[1], faction);
            this.fillFactionsStartPosition(faction.startPosition, faction);
        });
        if (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.logTimeEvent)('Factions created.');
        }
    }
    canIncreaseCellInfluence(positionX, positionY) {
        return !this.occupiedTerritories.filled(positionX, positionY);
    }
    increaseCellInfluence(positionX, positionY, faction) {
        let influence = 1;
        const influenceOriginal = faction.influenceTerritory.getCell(positionX, positionY);
        const biome = this.biomesMap.getCell(positionX, positionY);
        // Influence depends on the biome
        if (this.forestMap.filled(positionX, positionY)) {
            influence *= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].FACTIONS.INFLUENCE.FOREST_BOOST;
        }
        else {
            const infName = biome.getName();
            if (typeof _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].FACTIONS.INFLUENCE[infName] === 'undefined') {
                (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.throwError)(`Unknown influence name: ${infName}`, 10, true);
            }
            else {
                influence *= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].FACTIONS.INFLUENCE[infName];
            }
        }
        // Influence depends on the altitude
        if (biome.isHills) {
            influence *= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].FACTIONS.INFLUENCE.HILLS_BOOST;
        }
        else if (biome.isMountains) {
            influence *= _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].FACTIONS.INFLUENCE.MOUNTAINS_BOOST;
        }
        // 1 is the maximum influence
        influence = Math.min(1, influenceOriginal + influence);
        faction.influenceTerritory.setCell(positionX, positionY, influence);
    }
    occupyCell(positionX, positionY, faction) {
        faction.territory.fill(positionX, positionY);
        faction.influenceTerritory.setCell(positionX, positionY, 1);
        this.occupiedTerritories.fill(positionX, positionY);
    }
    canOccupyCell(positionX, positionY, faction) {
        return !this.occupiedTerritories.filled(positionX, positionY)
            && faction.influenceTerritory.getCell(positionX, positionY) === 1;
    }
    expandFaction(faction) {
        faction.borders.foreachFilledAroundRadiusToAllCells((nx, ny) => {
            if (this.canIncreaseCellInfluence(nx, ny)) {
                this.increaseCellInfluence(nx, ny, faction);
            }
            if (this.canOccupyCell(nx, ny, faction)) {
                this.occupyCell(nx, ny, faction);
                this.fillFactionsLayer([nx, ny], faction);
            }
        }, 1);
    }
    expandFactions() {
        this.factions.forEach(faction => {
            this.expandFaction(faction);
            this.updateFactionBorders(faction);
        });
        this.fillFactionsBorderLayer();
    }
    updateFactionBorders(faction) {
        faction.borders.unfillAll();
        faction.territory.foreachFilled((x, y) => {
            if (faction.territory.hasUnfilledNeighbors(x, y)) {
                faction.borders.fill(x, y);
            }
        });
    }
    fillFactionsStartPosition(position, faction) {
        this.factionsLayer.setCell(position[0], position[1], new _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_3__["default"](faction.getFactionColor(), null));
    }
    fillFactionsLayer(position, faction) {
        this.factionsLayer.setCell(position[0], position[1], new _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_3__["default"](faction.getFactionTerritoryColor(), null));
    }
    fillFactionsBorderLayer() {
        this.factionsBorderLayer.unsetAll();
        this.factions.forEach(faction => {
            faction.borders.foreachFilled((x, y) => {
                this.factionsBorderLayer.setCell(x, y, new _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_3__["default"](faction.getFactionBorderColor(), null));
            });
        });
    }
}


/***/ }),

/***/ "./src/operators/ForestsOperator.js":
/*!******************************************!*\
  !*** ./src/operators/ForestsOperator.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ForestsOperator)
/* harmony export */ });
/* harmony import */ var _maps_ForestMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../maps/ForestMap.js */ "./src/maps/ForestMap.js");
/* harmony import */ var _generators_ForestGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../generators/ForestGenerator.js */ "./src/generators/ForestGenerator.js");
/* harmony import */ var _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../render/DisplayCell.js */ "./src/render/DisplayCell.js");
/* harmony import */ var _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../biomes/Biomes.js */ "./src/biomes/Biomes.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../config.js */ "./config.js");






class ForestsOperator {
    constructor(biomesOperator, timer, forestLayer) {
        this.biomesOperator = biomesOperator;
        this.forestColor = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_4__.hexToRgb)(_config_js__WEBPACK_IMPORTED_MODULE_5__["default"].FOREST_COLOR);
        this.forestPalmImage = _config_js__WEBPACK_IMPORTED_MODULE_5__["default"].FOREST_PALM_IMAGE;
        this.forestTundraImage = _config_js__WEBPACK_IMPORTED_MODULE_5__["default"].FOREST_TUNDRA_IMAGE;
        // Cache forest images from config
        const forestImageKeys = Object.keys(_config_js__WEBPACK_IMPORTED_MODULE_5__["default"].FOREST_IMAGES);
        this.forestImages = forestImageKeys.map((key) => _config_js__WEBPACK_IMPORTED_MODULE_5__["default"].FOREST_IMAGES[key]);
        this.forestImagesCache = {};
        this.forestMap = new _maps_ForestMap_js__WEBPACK_IMPORTED_MODULE_0__["default"](biomesOperator.getBiomes());
        const forestGenerator = new _generators_ForestGenerator_js__WEBPACK_IMPORTED_MODULE_1__["default"](biomesOperator.altitudeMap, biomesOperator.humidityMap);
        // Update forest map on each timer step.
        timer.addStepsHandler((step) => {
            forestGenerator.generate(this.forestMap, step);
            this.addForestMapToLayer(forestLayer, this.forestMap);
            // Optionally process the forestMap with filters.
            this.forestMap = _helpers_js__WEBPACK_IMPORTED_MODULE_4__.Filters.apply("forestMap", this.forestMap);
        });
        if (_config_js__WEBPACK_IMPORTED_MODULE_5__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_4__.logTimeEvent)("Forests initialized.");
        }
    }
    /**
     * Determines whether the cell belongs to a desert or tropical biome.
     */
    isDesertForest(x, y) {
        var _a;
        const biomeName = (_a = this.biomesOperator.getBiome(x, y)) === null || _a === void 0 ? void 0 : _a.getName();
        return biomeName === _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_3__["default"].Biome_Desert.name || biomeName === _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_3__["default"].Biome_Tropic.name;
    }
    /**
     * Determines whether the cell belongs to a tundra biome.
     */
    isTundraForest(x, y) {
        var _a;
        return ((_a = this.biomesOperator.getBiome(x, y)) === null || _a === void 0 ? void 0 : _a.getName()) === _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_3__["default"].Biome_Tundra.name;
    }
    /**
     * Returns the appropriate forest image based on the biome.
     */
    getForestImage(x, y) {
        if (this.isDesertForest(x, y)) {
            return this.forestPalmImage;
        }
        if (this.isTundraForest(x, y)) {
            return this.forestTundraImage;
        }
        return this.forestImages.randomElement() || null;
    }
    getForestMap() {
        return this.forestMap;
    }
    /**
     * Adds the forest map cells to the given layer.
     */
    addForestMapToLayer(forestLayer, forestMap) {
        // Cache the forestMap methods locally
        forestMap.foreach((x, y) => {
            // Determine the display cell only if the cell is filled.
            const displayCell = forestMap.filled(x, y) ? this.getDisplayCell(x, y) : null;
            forestLayer.setCell(x, y, displayCell);
        });
    }
    /**
     * Returns the DisplayCell for a given position, caching the result for performance.
     */
    getDisplayCell(x, y) {
        const key = `${x},${y}`;
        if (!this.forestImagesCache[key]) {
            // Create and cache the display cell with the forest color and appropriate image.
            this.forestImagesCache[key] = new _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_2__["default"](this.forestColor, this.getForestImage(x, y));
        }
        return this.forestImagesCache[key];
    }
}


/***/ }),

/***/ "./src/operators/HumidityOperator.js":
/*!*******************************************!*\
  !*** ./src/operators/HumidityOperator.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HumidityOperator)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _maps_HumidityMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../maps/HumidityMap.js */ "./src/maps/HumidityMap.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");



class HumidityOperator {
    generateHumidityMap(altitudeMap, riversMap, lakesMap) {
        let humidityMap = new _maps_HumidityMap_js__WEBPACK_IMPORTED_MODULE_1__["default"](altitudeMap, riversMap, lakesMap);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_0__["default"].STORE_DATA ? localStorage.getItem('humidityMap') : null;
        if (storage) {
            humidityMap.fromString(storage);
        }
        else {
            humidityMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].STORE_DATA) {
                localStorage.setItem('humidityMap', humidityMap.toString());
            }
        }
        humidityMap = _helpers_js__WEBPACK_IMPORTED_MODULE_2__.Filters.apply('humidityMap', humidityMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_0__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_2__.logTimeEvent)(`Humidity map created. Min: ${humidityMap.getMin()} Max: ${humidityMap.getMax()} Avg: ${humidityMap.getAvgValue()}`);
        }
        return humidityMap;
    }
}


/***/ }),

/***/ "./src/operators/SurfaceOperator.js":
/*!******************************************!*\
  !*** ./src/operators/SurfaceOperator.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SurfaceOperator)
/* harmony export */ });
/* harmony import */ var _maps_AltitudeMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../maps/AltitudeMap.js */ "./src/maps/AltitudeMap.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config.js */ "./config.js");



class SurfaceOperator {
    generateAltitudeMap() {
        let altitudeMap = new _maps_AltitudeMap_js__WEBPACK_IMPORTED_MODULE_0__["default"](_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].WORLD_SIZE);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].STORE_DATA ? localStorage.getItem('altitudeMap') : null;
        if (storage) {
            altitudeMap.loadMap(storage);
        }
        else {
            altitudeMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].STORE_DATA) {
                localStorage.setItem('altitudeMap', altitudeMap.toString());
            }
        }
        altitudeMap = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.apply('altitudeMap', altitudeMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.logTimeEvent)(`Altitude map generated. Min: ${altitudeMap.getMin()} Max: ${altitudeMap.getMax()} Avg: ${altitudeMap.getAvgValue()}`);
        }
        return altitudeMap;
    }
}


/***/ }),

/***/ "./src/operators/WaterOperator.js":
/*!****************************************!*\
  !*** ./src/operators/WaterOperator.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WaterOperator)
/* harmony export */ });
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _maps_LakesMap_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../maps/LakesMap.js */ "./src/maps/LakesMap.js");
/* harmony import */ var _maps_RiversMap_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../maps/RiversMap.js */ "./src/maps/RiversMap.js");
/* harmony import */ var _maps_CoastMap_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../maps/CoastMap.js */ "./src/maps/CoastMap.js");
/* harmony import */ var _maps_OceanMap_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../maps/OceanMap.js */ "./src/maps/OceanMap.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _maps_IslandsMap_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../maps/IslandsMap.js */ "./src/maps/IslandsMap.js");








class WaterOperator {
    generateOceanMap(altitudeMap) {
        let oceanMap = new _maps_OceanMap_js__WEBPACK_IMPORTED_MODULE_4__["default"](altitudeMap);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA ? localStorage.getItem('oceanMap') : null;
        if (storage) {
            oceanMap.fromString(storage);
        }
        else {
            oceanMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA) {
                localStorage.setItem('oceanMap', oceanMap.toString());
            }
        }
        oceanMap = _helpers_js__WEBPACK_IMPORTED_MODULE_5__.Filters.apply('oceanMap', oceanMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.logTimeEvent)(`Ocean map calculated. Size: ${oceanMap.getSize()}%`);
        }
        return oceanMap;
    }
    getCoastMap(oceanMap, altitudeMap) {
        let coastMap = new _maps_CoastMap_js__WEBPACK_IMPORTED_MODULE_3__["default"](oceanMap, altitudeMap);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA ? localStorage.getItem('coastMap') : null;
        if (storage) {
            coastMap.fromString(storage);
        }
        else {
            coastMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA) {
                localStorage.setItem('coastMap', coastMap.toString());
            }
        }
        coastMap = _helpers_js__WEBPACK_IMPORTED_MODULE_5__.Filters.apply('coastMap', coastMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.logTimeEvent)('Coast map calculated.');
        }
        return coastMap;
    }
    generateLakesMap(altitudeMap, oceanMap) {
        let lakesMap = new _maps_LakesMap_js__WEBPACK_IMPORTED_MODULE_1__["default"](altitudeMap, oceanMap);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA ? localStorage.getItem('lakesMap') : null;
        if (storage) {
            lakesMap.fromString(storage);
        }
        else {
            lakesMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA) {
                localStorage.setItem('lakesMap', lakesMap.toString());
            }
        }
        lakesMap = _helpers_js__WEBPACK_IMPORTED_MODULE_5__.Filters.apply('lakesMap', lakesMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.logTimeEvent)(`Lakes map calculated. Size: ${lakesMap.getSize()}%`);
        }
        return lakesMap;
    }
    generateRiversMap(altitudeMap, lakesMap) {
        let riversMap = new _maps_RiversMap_js__WEBPACK_IMPORTED_MODULE_2__["default"](altitudeMap, lakesMap);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA ? localStorage.getItem('riversMap') : null;
        if (storage) {
            riversMap.fromString(storage);
        }
        else {
            riversMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA) {
                localStorage.setItem('riversMap', riversMap.toString());
            }
        }
        riversMap = _helpers_js__WEBPACK_IMPORTED_MODULE_5__.Filters.apply('riversMap', riversMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.logTimeEvent)(`Rivers generated. Rivers: ${riversMap.getGeneratedRiversCount()}`);
        }
        return riversMap;
    }
    getFreshWaterMap(lakesMap, riversMap) {
        const freshWaterMap = new _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"](_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].WORLD_SIZE, _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].WORLD_SIZE, 0);
        freshWaterMap.combineWith(lakesMap);
        freshWaterMap.combineWith(riversMap);
        return freshWaterMap;
    }
    getIslandsMap(oceanMap) {
        let islandsMap = new _maps_IslandsMap_js__WEBPACK_IMPORTED_MODULE_7__["default"](oceanMap);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA ? localStorage.getItem('islandsMap') : null;
        if (storage) {
            islandsMap.fromString(storage);
        }
        else {
            islandsMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].STORE_DATA) {
                localStorage.setItem('islandsMap', islandsMap.toString());
            }
        }
        islandsMap = _helpers_js__WEBPACK_IMPORTED_MODULE_5__.Filters.apply('islandsMap', islandsMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_6__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_5__.logTimeEvent)('Islands map generated.');
        }
        return islandsMap;
    }
}


/***/ }),

/***/ "./src/operators/WeatherOperator.js":
/*!******************************************!*\
  !*** ./src/operators/WeatherOperator.js ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WeatherOperator)
/* harmony export */ });
/* harmony import */ var _maps_TemperatureMap_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../maps/TemperatureMap.js */ "./src/maps/TemperatureMap.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../config.js */ "./config.js");



class WeatherOperator {
    generateTemperatureMap(altitudeMap) {
        let temperatureMap = new _maps_TemperatureMap_js__WEBPACK_IMPORTED_MODULE_0__["default"](altitudeMap);
        const storage = _config_js__WEBPACK_IMPORTED_MODULE_2__["default"].STORE_DATA ? localStorage.getItem('temperatureMap') : null;
        if (storage) {
            temperatureMap.fromString(storage);
        }
        else {
            temperatureMap.generateMap();
            if (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].STORE_DATA) {
                localStorage.setItem('temperatureMap', temperatureMap.toString());
            }
        }
        temperatureMap = _helpers_js__WEBPACK_IMPORTED_MODULE_1__.Filters.apply('temperatureMap', temperatureMap);
        if (_config_js__WEBPACK_IMPORTED_MODULE_2__["default"].LOGS) {
            (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.logTimeEvent)(`Temperature map created. Min: ${temperatureMap.getMin()} Max: ${temperatureMap.getMax()} Avg.: ${temperatureMap.getAvgValue()}`);
        }
        return temperatureMap;
    }
}


/***/ }),

/***/ "./src/prototypes.js":
/*!***************************!*\
  !*** ./src/prototypes.js ***!
  \***************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
Array.prototype.randomElement = function () {
    return this.length ? this[Math.floor(Math.random() * this.length)] : undefined;
};
Array.prototype.removeElementByIndex = function (index) {
    return this.filter((_, i) => i !== index);
};
Array.prototype.removeElementByValue = function (value) {
    return this.filter(e => e !== value);
};
Array.prototype.shuffle = function () {
    const arrayCopy = [...this];
    let j, temp;
    for (let i = arrayCopy.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arrayCopy[i];
        arrayCopy[i] = arrayCopy[j];
        arrayCopy[j] = temp;
    }
    return arrayCopy;
};
Array.prototype.intersect = function (array) {
    return this.filter((value) => array.includes(value));
};
Array.prototype.diff = function (array) {
    return this.filter((value) => !array.includes(value));
};
Array.prototype.includesCell = function (cell) {
    return this.some(([x, y]) => x === cell[0] && y === cell[1]);
};
Array.prototype.intersectCells = function (array) {
    return this.filter((cell) => array.includesCell(cell));
};
Array.prototype.diffCells = function (array) {
    return this.filter((cell) => !array.includesCell(cell));
};
Array.prototype.unique = function () {
    return this.filter((value, index, self) => index === self.findIndex((t) => Array.isArray(value) && Array.isArray(t)
        ? value.length === t.length && value.every((val, i) => val === t[i])
        : t === value));
};
Array.prototype.getClosestDistanceTo = function (x, y) {
    let minSq = Number.MAX_SAFE_INTEGER;
    // Using squared distance to avoid unnecessary sqrt calls in the loop.
    this.forEach(([cx, cy]) => {
        const dx = x - cx, dy = y - cy;
        const dSq = dx * dx + dy * dy;
        if (dSq < minSq) {
            minSq = dSq;
        }
    });
    return Math.sqrt(minSq);
};
Array.prototype.getClosestDistanceToCell = function (cell) {
    // Delegates to getClosestDistanceTo using the cell's coordinates.
    return this.getClosestDistanceTo(cell[0], cell[1]);
};



/***/ }),

/***/ "./src/render/CellsRenderer.js":
/*!*************************************!*\
  !*** ./src/render/CellsRenderer.js ***!
  \*************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CellsRenderer)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};


class CellsRenderer {
    constructor(cellWidth, cellHeight) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.imagesCache = [];
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            // Preload images using the config object.
            yield (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.preloadImages)(_config_js__WEBPACK_IMPORTED_MODULE_0__["default"], this.imagesCache);
        });
    }
    render(ctx, displayCell, x, y) {
        // Retrieve the images for this display cell once.
        const images = displayCell.getImages();
        // Compute pixel coordinates only once.
        const pixelX = x * this.cellWidth;
        const pixelY = y * this.cellHeight;
        if (images.length > 0) {
            // Cache imagesCache locally for slightly faster access.
            const cache = this.imagesCache;
            // Use a simple for loop rather than forEach for potential micro-optimizations.
            for (let i = 0, len = images.length; i < len; i++) {
                const imageKey = images[i];
                const image = cache[imageKey];
                if (image) {
                    ctx.drawImage(image, pixelX, pixelY, this.cellWidth, this.cellHeight);
                }
                else {
                    console.warn(`Image with key ${imageKey} not found in cache.`);
                }
            }
        }
        else {
            // If no images, fill the cell with the color converted to hex.
            ctx.fillStyle = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.rgbToHex)(displayCell.getColor());
            ctx.fillRect(pixelX, pixelY, this.cellWidth, this.cellHeight);
        }
    }
}


/***/ }),

/***/ "./src/render/DisplayCell.js":
/*!***********************************!*\
  !*** ./src/render/DisplayCell.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DisplayCell)
/* harmony export */ });
class DisplayCell {
    constructor(color, image) {
        this.color = color;
        this.images = Array.isArray(image)
            ? image.filter((img) => img !== null)
            : (image ? [image] : []);
    }
    getColor() {
        return this.color;
    }
    getImages() {
        return this.images;
    }
}


/***/ }),

/***/ "./src/render/Layer.js":
/*!*****************************!*\
  !*** ./src/render/Layer.js ***!
  \*****************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Layer: () => (/* binding */ Layer)
/* harmony export */ });
/* harmony import */ var _structures_Matrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../structures/Matrix.js */ "./src/structures/Matrix.js");

class Layer extends _structures_Matrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    /**
     * Resets all cells in the layer to null.
     */
    reset() {
        this.map(() => null);
    }
}


/***/ }),

/***/ "./src/services/Layers.js":
/*!********************************!*\
  !*** ./src/services/Layers.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LAYER_ANIMALS: () => (/* binding */ LAYER_ANIMALS),
/* harmony export */   LAYER_BIOMES: () => (/* binding */ LAYER_BIOMES),
/* harmony export */   LAYER_BIOMES_IMAGES: () => (/* binding */ LAYER_BIOMES_IMAGES),
/* harmony export */   LAYER_FACTIONS: () => (/* binding */ LAYER_FACTIONS),
/* harmony export */   LAYER_FACTIONS_BORDERS: () => (/* binding */ LAYER_FACTIONS_BORDERS),
/* harmony export */   LAYER_FOREST: () => (/* binding */ LAYER_FOREST),
/* harmony export */   LAYER_HABITAT: () => (/* binding */ LAYER_HABITAT),
/* harmony export */   "default": () => (/* binding */ Layers)
/* harmony export */ });
/* harmony import */ var _render_Layer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../render/Layer.js */ "./src/render/Layer.js");

const LAYER_BIOMES = 0;
const LAYER_BIOMES_IMAGES = 1;
const LAYER_FOREST = 2;
const LAYER_HABITAT = 3;
const LAYER_ANIMALS = 4;
const LAYER_FACTIONS = 5;
const LAYER_FACTIONS_BORDERS = 6;
class Layers {
    constructor(width, height) {
        this.layers = [];
        this.width = width;
        this.height = height;
        // Initialize layers array with Layer instances
        this.layers = Array.from({ length: this.getMaxLevel() + 1 }, () => new _render_Layer_js__WEBPACK_IMPORTED_MODULE_0__.Layer(this.width, this.height));
    }
    getLayersLevels() {
        return [
            LAYER_BIOMES,
            LAYER_BIOMES_IMAGES,
            LAYER_FOREST,
            LAYER_HABITAT,
            LAYER_ANIMALS,
            LAYER_FACTIONS,
            LAYER_FACTIONS_BORDERS,
        ];
    }
    getMaxLevel() {
        return Math.max(...this.getLayersLevels());
    }
    getLayer(level) {
        return this.layers[level];
    }
    foreachLayerValues(level, callback) {
        this.layers[level].foreachFilledValues(callback);
    }
    foreachLayers(callback) {
        this.layers.forEach((_, level) => callback(level));
    }
    getMainMapLayersLevels() {
        return [
            LAYER_BIOMES_IMAGES,
            LAYER_FOREST,
            LAYER_HABITAT,
            LAYER_ANIMALS,
            LAYER_FACTIONS_BORDERS,
        ];
    }
    foreachMainMapLayersValues(callback) {
        this.getMainMapLayersLevels().forEach(level => this.foreachLayerValues(level, callback));
    }
    getMiniMapLayersLevels() {
        return [
            LAYER_BIOMES,
            LAYER_FOREST,
            LAYER_FACTIONS,
            LAYER_FACTIONS_BORDERS,
        ];
    }
    foreachMiniMapLayersValues(callback) {
        this.getMiniMapLayersLevels().forEach(level => this.foreachLayerValues(level, callback));
    }
}


/***/ }),

/***/ "./src/services/Timer.js":
/*!*******************************!*\
  !*** ./src/services/Timer.js ***!
  \*******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Timer)
/* harmony export */ });
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../config.js */ "./config.js");


class Timer {
    constructor() {
        this.timerStep = 0;
        this.stepsHandlers = [];
        this.timerPaused = false;
        this.timerInterval = null;
        this.timerFps = 0;
    }
    addStepsHandler(handler) {
        this.stepsHandlers.push(handler);
    }
    stepsTimer(callback) {
        const { STEPS_MIN_INTERVAL, STEPS_BOOST, STEPS_LIMIT, STEPS_BOOST_STEPS, LOGS } = _config_js__WEBPACK_IMPORTED_MODULE_1__["default"];
        const timerStart = Date.now();
        let minStepInterval = STEPS_MIN_INTERVAL / STEPS_BOOST;
        let boosted = false;
        this.timerStep = 0;
        let startTime = Date.now();
        const makeStep = () => {
            if (this.timerPaused) {
                return;
            }
            // Call all step handlers
            for (const handler of this.stepsHandlers) {
                handler(this.timerStep);
            }
            this.timerStep++;
            // Execute the provided callback each step
            callback();
            // Check if we reached the steps limit
            if (this.timerStep > STEPS_LIMIT) {
                if (LOGS) {
                    const avgTime = Math.round((Date.now() - timerStart) / STEPS_LIMIT);
                    (0,_helpers_js__WEBPACK_IMPORTED_MODULE_0__.logTimeEvent)(`Steps running has ended. Avg. time per step: ${avgTime}ms`);
                }
                this.clearTimerInterval();
                return;
            }
            // Boost the timer interval after a given number of steps
            if (!boosted && this.timerStep > STEPS_BOOST_STEPS) {
                this.clearTimerInterval();
                minStepInterval *= STEPS_BOOST;
                this.timerInterval = setInterval(makeStep, minStepInterval);
                boosted = true;
            }
            this.timerFps = Math.round(Date.now() - startTime);
            startTime = Date.now();
            _helpers_js__WEBPACK_IMPORTED_MODULE_0__.Filters.apply('timer', this);
        };
        this.timerInterval = setInterval(makeStep, minStepInterval);
        // Start immediately.
        makeStep();
    }
    clearTimerInterval() {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    isTimerPaused() {
        return this.timerPaused;
    }
    pauseTimer() {
        if (this.timerPaused) {
            return false;
        }
        this.timerPaused = true;
        return true;
    }
    unpauseTimer() {
        if (!this.timerPaused) {
            return false;
        }
        this.timerPaused = false;
        return true;
    }
    getFps() {
        return this.timerFps;
    }
}


/***/ }),

/***/ "./src/structures/Array2D.js":
/*!***********************************!*\
  !*** ./src/structures/Array2D.js ***!
  \***********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayHasPoint: () => (/* binding */ arrayHasPoint),
/* harmony export */   create2DArray: () => (/* binding */ create2DArray)
/* harmony export */ });
/**
 * Creates a 2D array of the specified dimensions, filled with the given value.
 */
function create2DArray(width, height, value) {
    const arr = new Array(height);
    for (let i = 0; i < height; i++) {
        arr[i] = new Array(width).fill(value);
    }
    return arr;
}
/**
 * Checks if the given 2D array (list of [x,y] points) contains the specified point.
 */
function arrayHasPoint(arr, x, y) {
    return arr.some(([px, py]) => px === x && py === y);
}


/***/ }),

/***/ "./src/structures/BinaryMatrix.js":
/*!****************************************!*\
  !*** ./src/structures/BinaryMatrix.js ***!
  \****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BinaryMatrix)
/* harmony export */ });
/* harmony import */ var _NumericMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NumericMatrix.js */ "./src/structures/NumericMatrix.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");


class BinaryMatrix extends _NumericMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(width, height, fill = 0) {
        super(width, height);
        // Initialize every cell to the provided fill value.
        this.map(fill);
    }
    clone() {
        const matrix = new BinaryMatrix(this.width, this.height, 0);
        matrix.__values = this.__values.map((row) => row.slice());
        return matrix;
    }
    getFilledCells() {
        const cells = [];
        this.foreachFilled((x, y) => cells.push([x, y]));
        return cells;
    }
    getUnfilledCells() {
        const cells = [];
        this.foreachUnfilled((x, y) => cells.push([x, y]));
        return cells;
    }
    fill(x, y) {
        this.setCell(x, y, 1);
        return this;
    }
    fillAll() {
        this.foreachUnfilled((x, y) => this.fill(x, y));
        return this;
    }
    unfill(x, y) {
        this.setCell(x, y, 0);
        return this;
    }
    unfillAll() {
        this.foreachFilled((x, y) => this.unfill(x, y));
        return this;
    }
    countFilled() {
        let count = 0;
        this.foreachFilled(() => count++);
        return count;
    }
    hasFilled() {
        const { width, height } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.filled(x, y)) {
                    return true;
                }
            }
        }
        return false;
    }
    filled(x, y) {
        return this.getCell(x, y) === 1;
    }
    foreachFilled(callback) {
        const { width, height } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }
    foreachUnfilled(callback) {
        const { width, height } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (!this.filled(x, y)) {
                    callback(x, y);
                }
            }
        }
    }
    distanceTo(x, y, max) {
        let result = Number.MAX_SAFE_INTEGER;
        const { width, height } = this;
        const minX = Math.max(0, x - max);
        const maxX = Math.min(width - 1, x + max);
        const minY = Math.max(0, y - max);
        const maxY = Math.min(height - 1, y + max);
        for (let nx = minX; nx <= maxX; nx++) {
            for (let ny = minY; ny <= maxY; ny++) {
                if (this.filled(nx, ny)) {
                    const d = (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.distance)(nx, ny, x, y);
                    if (d < result) {
                        result = d;
                        if (result === 0) {
                            return 0; // Early exit if exact match found
                        }
                    }
                }
            }
        }
        return result;
    }
    aroundFilled(x, y, max) {
        return max >= this.distanceTo(x, y, max);
    }
    combineWith(matrix) {
        const { width, height } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                // Use logical OR for binary values.
                this.__values[x][y] = this.__values[x][y] || matrix.__values[x][y];
            }
        }
        return this;
    }
    diff(matrix) {
        matrix.foreachFilled((x, y) => this.unfill(x, y));
        return this;
    }
    diffCells(cells) {
        for (const [cx, cy] of cells) {
            if (this.filled(cx, cy)) {
                this.unfill(cx, cy);
            }
        }
        return this;
    }
    intersect(matrix) {
        const { width, height } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (this.filled(x, y) && !matrix.filled(x, y)) {
                    this.unfill(x, y);
                }
            }
        }
        return this;
    }
    getFilledNeighbors(x, y) {
        const result = [];
        this.foreachNeighbors(x, y, (nx, ny) => {
            if (this.filled(nx, ny)) {
                result.push([nx, ny]);
            }
        });
        return result;
    }
    hasFilledNeighbors(x, y) {
        let found = false;
        this.foreachNeighbors(x, y, (nx, ny) => {
            if (this.filled(nx, ny)) {
                found = true;
                return true; // stops iteration
            }
            return false;
        });
        return found;
    }
    hasUnfilledNeighbors(x, y) {
        // Assuming 8 neighbors in a full grid. If fewer than 8 are filled, at least one is unfilled.
        return this.getFilledNeighbors(x, y).length < 8;
    }
    foreachFilledAround(x, y, callback) {
        const neighbors = this.getNeighbors(x, y);
        for (const [nx, ny] of neighbors) {
            if (this.filled(nx, ny)) {
                callback(nx, ny);
            }
        }
    }
    foreachFilledAroundRadiusToAllCells(callback, radius) {
        const filledCells = this.getFilledCells();
        filledCells.forEach(([cx, cy]) => {
            this.foreachAroundRadius(cx, cy, radius, (nx, ny) => {
                callback(nx, ny, cx, cy);
            });
        });
    }
    getSize() {
        const totalCells = this.width * this.height;
        const filledCount = this.getFilledCells().length;
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.round)(filledCount / totalCells, 2) * 100;
    }
    getSizeFromPoint(startX, startY) {
        if (!this.filled(startX, startY)) {
            return 0;
        }
        const coords = [];
        // For each of the four cardinal directions, extend until an unfilled cell or boundary is reached.
        for (let d = 0; d < 4; d++) {
            let sx = startX;
            let sy = startY;
            while (true) {
                if (d === 0)
                    sx++; // Right
                else if (d === 1)
                    sy++; // Down
                else if (d === 2)
                    sx--; // Left
                else if (d === 3)
                    sy--; // Up
                // Break if out of bounds.
                if (sx < 0 || sy < 0 || sx >= this.width || sy >= this.height) {
                    break;
                }
                if (!this.filled(sx, sy)) {
                    coords.push([sx, sy]);
                    break;
                }
            }
        }
        return Math.abs((0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.getPolygonAreaSize)(coords));
    }
}


/***/ }),

/***/ "./src/structures/Cells.js":
/*!*********************************!*\
  !*** ./src/structures/Cells.js ***!
  \*********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAroundRadius: () => (/* binding */ getAroundRadius),
/* harmony export */   getRectangleAround: () => (/* binding */ getRectangleAround),
/* harmony export */   inCellList: () => (/* binding */ inCellList),
/* harmony export */   isCellInCellList: () => (/* binding */ isCellInCellList),
/* harmony export */   removeCellFromList: () => (/* binding */ removeCellFromList),
/* harmony export */   removeFromCellList: () => (/* binding */ removeFromCellList)
/* harmony export */ });
/**
 * @param {CellsList} cells
 * @param {number} x
 * @param {number} y
 */
function inCellList(cells, x, y) {
    return cells.some(([cellX, cellY]) => cellX === x && cellY === y);
}
/**
 * @param {CellsList} cells
 * @param {Cell} cell
 */
function isCellInCellList(cells, cell) {
    return inCellList(cells, cell[0], cell[1]);
}
/**
 * @param {CellsList} cells
 * @param {number} x
 * @param {number} y
 * @return CellsList
 */
function removeFromCellList(cells, x, y) {
    const index = cells.findIndex(([cellX, cellY]) => cellX === x && cellY === y);
    if (index !== -1) {
        cells.splice(index, 1);
    }
    return cells;
}
/**
 * @param {CellsList} cells
 * @param {Cell} cell
 * @return CellsList
 */
function removeCellFromList(cells, cell) {
    return removeFromCellList(cells, cell[0], cell[1]);
}
/**
 * Returns a list of cells (as [x,y] pairs) within Manhattan distance < (radius+1).
 */
function getAroundRadius(x, y, maxWidth, maxHeight, radius) {
    const result = [];
    const minX = Math.max(0, x - radius);
    const minY = Math.max(0, y - radius);
    const maxX = Math.min(maxWidth - 1, x + radius);
    const maxY = Math.min(maxHeight - 1, y + radius);
    const maxRadius = radius + 1;
    for (let nx = minX; nx <= maxX; nx++) {
        for (let ny = minY; ny <= maxY; ny++) {
            if ((nx !== x || ny !== y) && (Math.abs(x - nx) + Math.abs(y - ny) < maxRadius)) {
                result.push([nx, ny]);
            }
        }
    }
    return result;
}
/**
 * Returns a list of cells (as [x,y] pairs) in the 3×3 rectangle surrounding (x,y).
 */
function getRectangleAround(x, y, maxWidth, maxHeight) {
    const result = [];
    const minX = Math.max(0, x - 1);
    const minY = Math.max(0, y - 1);
    const maxX = Math.min(maxWidth - 1, x + 1);
    const maxY = Math.min(maxHeight - 1, y + 1);
    for (let nx = minX; nx <= maxX; nx++) {
        for (let ny = minY; ny <= maxY; ny++) {
            if (nx !== x || ny !== y) {
                result.push([nx, ny]);
            }
        }
    }
    return result;
}


/***/ }),

/***/ "./src/structures/List.js":
/*!********************************!*\
  !*** ./src/structures/List.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ List)
/* harmony export */ });
class List {
    constructor(items = []) {
        this.items = items;
    }
    push(item) {
        this.items.push(item);
    }
    getAll() {
        return this.items;
    }
    first() {
        return this.items[0];
    }
    last() {
        return this.items[this.items.length - 1];
    }
    previous() {
        return this.items.length > 1 ? this.items[this.items.length - 2] : undefined;
    }
    get(i) {
        return i < this.items.length ? this.items[i] : undefined;
    }
    get length() {
        return this.items.length;
    }
    includes(item) {
        // Note: This uses strict equality.
        return this.items.includes(item);
    }
    foreach(callback) {
        for (let i = 0, len = this.items.length; i < len; i++) {
            callback(this.items[i]);
        }
    }
    foreachCell(callback) {
        for (let i = 0, len = this.items.length; i < len; i++) {
            const item = this.items[i];
            // Check that item has at least two elements
            if (item.length >= 2) {
                callback(item[0], item[1]);
            }
        }
    }
}


/***/ }),

/***/ "./src/structures/Matrix.js":
/*!**********************************!*\
  !*** ./src/structures/Matrix.js ***!
  \**********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Matrix)
/* harmony export */ });
/* harmony import */ var _Cells_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Cells.js */ "./src/structures/Cells.js");
/* harmony import */ var _Array2D_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Array2D.js */ "./src/structures/Array2D.js");


/**
 * Matrix<T>
 * A generic 2D matrix wrapper.
 */
class Matrix {
    constructor(width, height, defaultValue) {
        this.width = width;
        this.height = height;
        this.__values = (0,_Array2D_js__WEBPACK_IMPORTED_MODULE_1__.create2DArray)(width, height, defaultValue !== null && defaultValue !== void 0 ? defaultValue : null);
    }
    /**
     * Returns the underlying 2D array.
     */
    getValues() {
        return this.__values;
    }
    /**
     * Returns all cell values as a flat array.
     */
    getValuesList() {
        const total = this.width * this.height;
        const values = new Array(total);
        let index = 0;
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                values[index++] = __values[x][y];
            }
        }
        return values;
    }
    /**
     * Sets all cells to the specified value.
     */
    set(value) {
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                __values[x][y] = value;
            }
        }
        return this;
    }
    /**
     * Sets a single cell value.
     */
    setCell(x, y, value) {
        this.__values[x][y] = value;
        return this;
    }
    /**
     * Retrieves a cell value.
     */
    getCell(x, y) {
        return this.__values[x][y];
    }
    /**
     * Returns the matrix width.
     */
    getWidth() {
        return this.width;
    }
    /**
     * Returns the matrix height.
     */
    getHeight() {
        return this.height;
    }
    /**
     * Applies the callback to each cell and stores the result.
     * If a non‑function value is provided, that value is used to set every cell.
     */
    map(callbackOrValue) {
        const isFunc = typeof callbackOrValue === "function";
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                __values[x][y] = isFunc
                    ? callbackOrValue(x, y)
                    : callbackOrValue;
            }
        }
        return this;
    }
    /**
     * Executes the callback for each cell.
     */
    foreach(callback) {
        const { width, height } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                callback(x, y);
            }
        }
    }
    /**
     * Executes the callback for each cell, passing in the cell’s value.
     */
    foreachValues(callback) {
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                callback(__values[x][y], x, y);
            }
        }
    }
    /**
     * Executes the callback for each non-null cell.
     */
    foreachFilledValues(callback) {
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const v = __values[x][y];
                if (v !== null) {
                    callback(v, x, y);
                }
            }
        }
    }
    /**
     * Replaces the entire underlying 2D array.
     */
    setAll(values) {
        this.__values = values;
        return this;
    }
    /**
     * Resets the matrix to a new array with all cells set to null.
     */
    unsetAll() {
        this.__values = (0,_Array2D_js__WEBPACK_IMPORTED_MODULE_1__.create2DArray)(this.width, this.height, null);
        return this;
    }
    /**
     * Returns the neighbors around a cell using a rectangular pattern.
     */
    getNeighbors(x, y) {
        return (0,_Cells_js__WEBPACK_IMPORTED_MODULE_0__.getRectangleAround)(x, y, this.width, this.height);
    }
    /**
     * Executes the callback for each neighbor.
     */
    foreachNeighbors(x, y, callback, stopOnTrue = false) {
        const neighbors = this.getNeighbors(x, y);
        for (const [nx, ny] of neighbors) {
            if (callback(nx, ny) && stopOnTrue) {
                break;
            }
        }
        return this;
    }
    /**
     * Returns the cells around a given cell within the specified radius.
     */
    getAroundRadius(x, y, radius) {
        return (0,_Cells_js__WEBPACK_IMPORTED_MODULE_0__.getAroundRadius)(x, y, this.width, this.height, radius);
    }
    /**
     * Executes the callback for each cell within a given radius.
     */
    foreachAroundRadius(x, y, radius, callback, stopOnTrue = false) {
        const neighbors = this.getAroundRadius(x, y, radius);
        for (const [nx, ny] of neighbors) {
            if (callback(nx, ny) && stopOnTrue) {
                break;
            }
        }
        return this;
    }
    /**
     * Returns a deep copy of the underlying 2D array.
     */
    toArray() {
        return this.__values.map((row) => row.slice());
    }
    /**
     * Returns a random element from the matrix in the format [x, y, value].
     */
    getRandomElement() {
        const x = Math.floor(Math.random() * this.width);
        const y = Math.floor(Math.random() * this.height);
        return [x, y, this.__values[x][y]];
    }
}


/***/ }),

/***/ "./src/structures/NumericMatrix.js":
/*!*****************************************!*\
  !*** ./src/structures/NumericMatrix.js ***!
  \*****************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NumericMatrix)
/* harmony export */ });
/* harmony import */ var _Matrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Matrix.js */ "./src/structures/Matrix.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers.js */ "./src/helpers.js");


class NumericMatrix extends _Matrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    toString() {
        return JSON.stringify(this.__values);
    }
    fromString(str) {
        this.setAll(JSON.parse(str));
    }
    addToCell(x, y, value) {
        const current = this.getCell(x, y);
        return this.setCell(x, y, (current + value));
    }
    subtractFromCell(x, y, value) {
        const current = this.getCell(x, y);
        return this.setCell(x, y, (current - value));
    }
    equals(matrix) {
        const a = this.__values;
        const b = matrix.__values;
        if (a.length !== b.length) {
            return false;
        }
        for (let i = 0; i < a.length; i++) {
            if (a[i].length !== b[i].length) {
                return false;
            }
            for (let j = 0; j < a[i].length; j++) {
                if (a[i][j] !== b[i][j])
                    return false;
            }
        }
        return true;
    }
    getGrayscale(x, y) {
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.fromFraction)(this.getCell(x, y), 0, 255);
    }
    sumNeighbors(x, y) {
        let sum = 0;
        this.foreachNeighbors(x, y, (nx, ny) => {
            sum += this.getCell(nx, ny);
        });
        return sum;
    }
    addToNeighborCells(x, y, value) {
        this.foreachNeighbors(x, y, (nx, ny) => {
            this.addToCell(nx, ny, value);
        });
        return this;
    }
    has(targetValue) {
        const { width, height, __values } = this;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                if (__values[x][y] === targetValue) {
                    return true;
                }
            }
        }
        return false;
    }
    setRange(min, max) {
        const values = this.getValuesList();
        const currMin = Math.min(...values);
        const currMax = Math.max(...values);
        this.map((x, y) => {
            return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.changeRange)(this.getCell(x, y), currMin, currMax, min, max);
        });
        return this;
    }
    getMin() {
        const { width, height, __values } = this;
        let minVal = Infinity;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const v = __values[x][y];
                if (v < minVal) {
                    minVal = v;
                }
            }
        }
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.round)(minVal, 2);
    }
    getMax() {
        const { width, height, __values } = this;
        let maxVal = -Infinity;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const v = __values[x][y];
                if (v > maxVal) {
                    maxVal = v;
                }
            }
        }
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.round)(maxVal, 2);
    }
    getAvgValue() {
        return (0,_helpers_js__WEBPACK_IMPORTED_MODULE_1__.round)(this.sum() / (this.width * this.height), 2);
    }
    getRandomWeightedPoint() {
        const matrix = this.getValues();
        const rows = matrix.length;
        if (rows === 0) {
            return null;
        }
        const rowSums = new Array(rows);
        let totalSum = 0;
        for (let i = 0; i < rows; i++) {
            let rowSum = 0;
            const row = matrix[i];
            for (let j = 0; j < row.length; j++) {
                rowSum += row[j];
            }
            rowSums[i] = rowSum;
            totalSum += rowSum;
        }
        let randomValue = Math.random() * totalSum;
        let rowIndex = 0;
        for (let i = 0; i < rows; i++) {
            randomValue -= rowSums[i];
            if (randomValue <= 0) {
                rowIndex = i;
                break;
            }
        }
        const selectedRow = matrix[rowIndex];
        const selectedRowSum = rowSums[rowIndex];
        let randomColValue = Math.random() * selectedRowSum;
        let colIndex = 0;
        for (let j = 0; j < selectedRow.length; j++) {
            randomColValue -= selectedRow[j];
            if (randomColValue <= 0) {
                colIndex = j;
                break;
            }
        }
        return [rowIndex, colIndex];
    }
    sum() {
        const { width, height, __values } = this;
        let total = 0;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                total += __values[x][y];
            }
        }
        return total;
    }
}


/***/ }),

/***/ "./src/structures/PointMatrix.js":
/*!***************************************!*\
  !*** ./src/structures/PointMatrix.js ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PointMatrix)
/* harmony export */ });
/* harmony import */ var _NumericMatrix_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NumericMatrix.js */ "./src/structures/NumericMatrix.js");

// PointMatrix is a NumericMatrix with values in the range [0, 1]
class PointMatrix extends _NumericMatrix_js__WEBPACK_IMPORTED_MODULE_0__["default"] {
    // Normalize the matrix values to the range [0, 1]
    normalize() {
        this.setRange(0, 1);
        return this;
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!*************************************!*\
  !*** ./src/libs/jquery.slim.min.js ***!
  \*************************************/
__webpack_require__.r(__webpack_exports__);
/*! jQuery v3.3.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/Tween,-effects/animatedSelector | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:undefined,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,u=n.push,s=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,d=f.toString,p=d.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},v=function e(t){return null!=t&&t===t.window},y={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in y)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function b(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var x="3.3.1 -ajax,-ajax/jsonp,-ajax/load,-ajax/parseXML,-ajax/script,-ajax/var/location,-ajax/var/nonce,-ajax/var/rquery,-ajax/xhr,-manipulation/_evalUrl,-event/ajax,-effects,-effects/Tween,-effects/animatedSelector",w=function(e,t){return new w.fn.init(e,t)},C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:x,constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:u,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},u=1,s=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[u]||{},u++),"object"==typeof a||g(a)||(a={}),u===s&&(a=this,u--);u<s;u++)if(null!=(e=arguments[u]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+(x+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&d.call(n)===p)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(T(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(T(Object(e))?w.merge(n,"string"==typeof e?[e]:e):u.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:s.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,u=!n;o<a;o++)(r=!t(e[o],o))!==u&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,u=[];if(T(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&u.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&u.push(i);return a.apply([],u)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function T(e){var t=!!e&&"length"in e&&e.length,n=b(e);return!g(e)&&!v(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,u,s,l,c,f,d,p,h,g,v,y,m,b,x="sizzle"+1*new Date,w=e.document,C=0,T=0,E=ae(),N=ae(),k=ae(),A=function(e,t){return e===t&&(f=!0),0},D={}.hasOwnProperty,S=[],L=S.pop,j=S.push,q=S.push,O=S.slice,P=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},H="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",I="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",B="\\["+I+"*("+R+")(?:"+I+"*([*^$|!~]?=)"+I+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+I+"*\\]",M=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+B+")*)|.*)\\)|)",W=new RegExp(I+"+","g"),$=new RegExp("^"+I+"+|((?:^|[^\\\\])(?:\\\\.)*)"+I+"+$","g"),F=new RegExp("^"+I+"*,"+I+"*"),z=new RegExp("^"+I+"*([>+~]|"+I+")"+I+"*"),_=new RegExp("="+I+"*([^\\]'\"]*?)"+I+"*\\]","g"),U=new RegExp(M),V=new RegExp("^"+R+"$"),X={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+B),PSEUDO:new RegExp("^"+M),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+I+"*(even|odd|(([+-]|)(\\d*)n|)"+I+"*(?:([+-]|)"+I+"*(\\d+)|))"+I+"*\\)|)","i"),bool:new RegExp("^(?:"+H+")$","i"),needsContext:new RegExp("^"+I+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+I+"*((?:-\\d)?\\d*)"+I+"*\\)|)(?=[^-]|$)","i")},Q=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,G=/^[^{]+\{\s*\[native \w/,K=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,J=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+I+"?|("+I+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){d()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{q.apply(S=O.call(w.childNodes),w.childNodes),S[w.childNodes.length].nodeType}catch(e){q={apply:S.length?function(e,t){j.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,u,l,c,f,h,y,m=t&&t.ownerDocument,C=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==C&&9!==C&&11!==C)return r;if(!i&&((t?t.ownerDocument||t:w)!==p&&d(t),t=t||p,g)){if(11!==C&&(f=K.exec(e)))if(o=f[1]){if(9===C){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&b(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return q.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return q.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!k[e+" "]&&(!v||!v.test(e))){if(1!==C)m=t,y=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=x),u=(h=a(e)).length;while(u--)h[u]="#"+c+" "+ye(h[u]);y=h.join(","),m=J.test(e)&&ge(t.parentNode)||t}if(y)try{return q.apply(r,m.querySelectorAll(y)),r}catch(e){}finally{c===x&&t.removeAttribute("id")}}}return s(e.replace($,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function ue(e){return e[x]=!0,e}function se(e){var t=p.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function de(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function pe(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return ue(function(t){return t=+t,ue(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},d=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==p&&9===a.nodeType&&a.documentElement?(p=a,h=p.documentElement,g=!o(p),w!==p&&(i=p.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=se(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=se(function(e){return e.appendChild(p.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=G.test(p.getElementsByClassName),n.getById=se(function(e){return h.appendChild(e).id=x,!p.getElementsByName||!p.getElementsByName(x).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},y=[],v=[],(n.qsa=G.test(p.querySelectorAll))&&(se(function(e){h.appendChild(e).innerHTML="<a id='"+x+"'></a><select id='"+x+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&v.push("[*^$]="+I+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||v.push("\\["+I+"*(?:value|"+H+")"),e.querySelectorAll("[id~="+x+"-]").length||v.push("~="),e.querySelectorAll(":checked").length||v.push(":checked"),e.querySelectorAll("a#"+x+"+*").length||v.push(".#.+[+~]")}),se(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=p.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&v.push("name"+I+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&v.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&v.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),v.push(",.*:")})),(n.matchesSelector=G.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&se(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),y.push("!=",M)}),v=v.length&&new RegExp(v.join("|")),y=y.length&&new RegExp(y.join("|")),t=G.test(h.compareDocumentPosition),b=t||G.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===p||e.ownerDocument===w&&b(w,e)?-1:t===p||t.ownerDocument===w&&b(w,t)?1:c?P(c,e)-P(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],u=[t];if(!i||!o)return e===p?-1:t===p?1:i?-1:o?1:c?P(c,e)-P(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)u.unshift(n);while(a[r]===u[r])r++;return r?ce(a[r],u[r]):a[r]===w?-1:u[r]===w?1:0},p):p},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==p&&d(e),t=t.replace(_,"='$1']"),n.matchesSelector&&g&&!k[t+" "]&&(!y||!y.test(t))&&(!v||!v.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,p,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==p&&d(e),b(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==p&&d(e);var i=r.attrHandle[t.toLowerCase()],o=i&&D.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(A),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:ue,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return X.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&U.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+I+")"+e+"("+I+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace(W," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),u="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,s){var l,c,f,d,p,h,g=o!==a?"nextSibling":"previousSibling",v=t.parentNode,y=u&&t.nodeName.toLowerCase(),m=!s&&!u,b=!1;if(v){if(o){while(g){d=t;while(d=d[g])if(u?d.nodeName.toLowerCase()===y:1===d.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?v.firstChild:v.lastChild],a&&m){b=(p=(l=(c=(f=(d=v)[x]||(d[x]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]||[])[0]===C&&l[1])&&l[2],d=p&&v.childNodes[p];while(d=++p&&d&&d[g]||(b=p=0)||h.pop())if(1===d.nodeType&&++b&&d===t){c[e]=[C,p,b];break}}else if(m&&(b=p=(l=(c=(f=(d=t)[x]||(d[x]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]||[])[0]===C&&l[1]),!1===b)while(d=++p&&d&&d[g]||(b=p=0)||h.pop())if((u?d.nodeName.toLowerCase()===y:1===d.nodeType)&&++b&&(m&&((c=(f=d[x]||(d[x]={}))[d.uniqueID]||(f[d.uniqueID]={}))[e]=[C,b]),d===t))break;return(b-=i)===r||b%r==0&&b/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[x]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?ue(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=P(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:ue(function(e){var t=[],n=[],r=u(e.replace($,"$1"));return r[x]?ue(function(e,t,n,i){var o,a=r(e,null,i,[]),u=e.length;while(u--)(o=a[u])&&(e[u]=!(t[u]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:ue(function(e){return function(t){return oe(e,t).length>0}}),contains:ue(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:ue(function(e){return V.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===p.activeElement&&(!p.hasFocus||p.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:pe(!1),disabled:pe(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return Q.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=de(t);function ve(){}ve.prototype=r.filters=r.pseudos,r.setFilters=new ve,a=oe.tokenize=function(e,t){var n,i,o,a,u,s,l,c=N[e+" "];if(c)return t?0:c.slice(0);u=e,s=[],l=r.preFilter;while(u){n&&!(i=F.exec(u))||(i&&(u=u.slice(i[0].length)||u),s.push(o=[])),n=!1,(i=z.exec(u))&&(n=i.shift(),o.push({value:n,type:i[0].replace($," ")}),u=u.slice(n.length));for(a in r.filter)!(i=X[a].exec(u))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),u=u.slice(n.length));if(!n)break}return t?u.length:u?oe.error(e):N(e,s).slice(0)};function ye(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,u=T++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,s){var l,c,f,d=[C,u];if(s){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[x]||(t[x]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===C&&l[1]===u)return d[2]=l[2];if(c[o]=d,d[2]=e(t,n,s))return!0}return!1}}function be(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xe(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],u=0,s=e.length,l=null!=t;u<s;u++)(o=e[u])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(u)));return a}function Ce(e,t,n,r,i,o){return r&&!r[x]&&(r=Ce(r)),i&&!i[x]&&(i=Ce(i,o)),ue(function(o,a,u,s){var l,c,f,d=[],p=[],h=a.length,g=o||xe(t||"*",u.nodeType?[u]:u,[]),v=!e||!o&&t?g:we(g,d,e,u,s),y=n?i||(o?e:h||r)?[]:a:v;if(n&&n(v,y,u,s),r){l=we(y,p),r(l,[],u,s),c=l.length;while(c--)(f=l[c])&&(y[p[c]]=!(v[p[c]]=f))}if(o){if(i||e){if(i){l=[],c=y.length;while(c--)(f=y[c])&&l.push(v[c]=f);i(null,y=[],l,s)}c=y.length;while(c--)(f=y[c])&&(l=i?P(o,f):d[c])>-1&&(o[l]=!(a[l]=f))}}else y=we(y===a?y.splice(h,y.length):y),i?i(null,a,y,s):q.apply(a,y)})}function Te(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],u=a||r.relative[" "],s=a?1:0,c=me(function(e){return e===t},u,!0),f=me(function(e){return P(t,e)>-1},u,!0),d=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];s<o;s++)if(n=r.relative[e[s].type])d=[me(be(d),n)];else{if((n=r.filter[e[s].type].apply(null,e[s].matches))[x]){for(i=++s;i<o;i++)if(r.relative[e[i].type])break;return Ce(s>1&&be(d),s>1&&ye(e.slice(0,s-1).concat({value:" "===e[s-2].type?"*":""})).replace($,"$1"),n,s<i&&Te(e.slice(s,i)),i<o&&Te(e=e.slice(i)),i<o&&ye(e))}d.push(n)}return be(d)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,u,s,c){var f,h,v,y=0,m="0",b=o&&[],x=[],w=l,T=o||i&&r.find.TAG("*",c),E=C+=null==w?1:Math.random()||.1,N=T.length;for(c&&(l=a===p||a||c);m!==N&&null!=(f=T[m]);m++){if(i&&f){h=0,a||f.ownerDocument===p||(d(f),u=!g);while(v=e[h++])if(v(f,a||p,u)){s.push(f);break}c&&(C=E)}n&&((f=!v&&f)&&y--,o&&b.push(f))}if(y+=m,n&&m!==y){h=0;while(v=t[h++])v(b,x,a,u);if(o){if(y>0)while(m--)b[m]||x[m]||(x[m]=L.call(s));x=we(x)}q.apply(s,x),c&&!o&&x.length>0&&y+t.length>1&&oe.uniqueSort(s)}return c&&(C=E,l=w),b};return n?ue(o):o}return u=oe.compile=function(e,t){var n,r=[],i=[],o=k[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Te(t[n]))[x]?r.push(o):i.push(o);(o=k(e,Ee(i,r))).selector=e}return o},s=oe.select=function(e,t,n,i){var o,s,l,c,f,d="function"==typeof e&&e,p=!i&&a(e=d.selector||e);if(n=n||[],1===p.length){if((s=p[0]=p[0].slice(0)).length>2&&"ID"===(l=s[0]).type&&9===t.nodeType&&g&&r.relative[s[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;d&&(t=t.parentNode),e=e.slice(s.shift().value.length)}o=X.needsContext.test(e)?0:s.length;while(o--){if(l=s[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),J.test(s[0].type)&&ge(t.parentNode)||t))){if(s.splice(o,1),!(e=i.length&&ye(s)))return q.apply(n,i),n;break}}}return(d||u(e,p))(i,t,!g,n,!t||J.test(e)&&ge(t.parentNode)||t),n},n.sortStable=x.split("").sort(A).join("")===x,n.detectDuplicates=!!f,d(),n.sortDetached=se(function(e){return 1&e.compareDocumentPosition(p.createElement("fieldset"))}),se(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&se(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),se(function(e){return null==e.getAttribute("disabled")})||le(H,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var N=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},k=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},A=w.expr.match.needsContext;function D(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var S=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function L(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return s.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(L(this,e||[],!1))},not:function(e){return this.pushStack(L(this,e||[],!0))},is:function(e){return!!L(this,"string"==typeof e&&A.test(e)?w(e):e||[],!1).length}});var j,q=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||j,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:q.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),S.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,j=w(r);var O=/^(?:parents|prev(?:Until|All))/,P={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!A.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?s.call(w(e),this[0]):s.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function H(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return N(e,"parentNode")},parentsUntil:function(e,t,n){return N(e,"parentNode",n)},next:function(e){return H(e,"nextSibling")},prev:function(e){return H(e,"previousSibling")},nextAll:function(e){return N(e,"nextSibling")},prevAll:function(e){return N(e,"previousSibling")},nextUntil:function(e,t,n){return N(e,"nextSibling",n)},prevUntil:function(e,t,n){return N(e,"previousSibling",n)},siblings:function(e){return k((e.parentNode||{}).firstChild,e)},children:function(e){return k(e.firstChild)},contents:function(e){return D(e,"iframe")?e.contentDocument:(D(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(P[e]||w.uniqueSort(i),O.test(e)&&i.reverse()),this.pushStack(i)}});var I=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(I)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],u=-1,s=function(){for(i=i||e.once,r=t=!0;a.length;u=-1){n=a.shift();while(++u<o.length)!1===o[u].apply(n[0],n[1])&&e.stopOnFalse&&(u=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(u=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==b(r)&&t(r)})}(arguments),n&&!t&&s()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=u&&u--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||s()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function B(e){return e}function M(e){throw e}function W(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var u=this,s=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(u,s))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,B,i),a(o,n,M,i)):(o++,l.call(e,a(o,n,B,i),a(o,n,M,i),a(o,n,B,n.notifyWith))):(r!==B&&(u=void 0,s=[e]),(i||n.resolveWith)(u,s))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==M&&(u=void 0,s=[e]),n.rejectWith(u,s))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:B,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:B)),n[2][3].add(a(0,e,g(r)?r:M))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],u=t[5];i[t[1]]=a.add,u&&a.add(function(){r=u},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),u=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&(W(e,a.done(u(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)W(i[n],u(n),a.reject);return a.promise()}});var $=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&$.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function z(){r.removeEventListener("DOMContentLoaded",z),e.removeEventListener("load",z),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",z),e.addEventListener("load",z));var _=function(e,t,n,r,i,o,a){var u=0,s=e.length,l=null==n;if("object"===b(n)){i=!0;for(u in n)_(e,t,u,n[u],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;u<s;u++)t(e[u],n,a?r:r.call(e[u],u,t(e[u],n)));return i?e:l?t.call(e):s?t(e[0],n):o},U=/^-ms-/,V=/-([a-z])/g;function X(e,t){return t.toUpperCase()}function Q(e){return e.replace(U,"ms-").replace(V,X)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function G(){this.expando=w.expando+G.uid++}G.uid=1,G.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[Q(t)]=n;else for(r in t)i[Q(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][Q(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(Q):(t=Q(t))in r?[t]:t.match(I)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var K=new G,J=new G,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}J.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return J.hasData(e)||K.hasData(e)},data:function(e,t,n){return J.access(e,t,n)},removeData:function(e,t){J.remove(e,t)},_data:function(e,t,n){return K.access(e,t,n)},_removeData:function(e,t){K.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=J.get(o),1===o.nodeType&&!K.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=Q(r.slice(5)),ne(o,r,i[r]));K.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){J.set(this,e)}):_(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=J.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){J.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){J.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=K.get(e,t),n&&(!r||Array.isArray(n)?r=K.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return K.get(e,n)||K.access(e,n,{empty:w.Callbacks("once memory").add(function(){K.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,u=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=K.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(u));return u(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},ue=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function se(e,t,n,r){var i,o,a=20,u=r?function(){return r.cur()}:function(){return w.css(e,t,"")},s=u(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+s)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){s/=2,l=l||c[3],c=+s||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=u()/s||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+s||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=K.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",K.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var de=/^(?:checkbox|radio)$/i,pe=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ve(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&D(e,t)?w.merge([e],n):n}function ye(e,t){for(var n=0,r=e.length;n<r;n++)K.set(e[n],"globalEval",!t||K.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function be(e,t,n,r,i){for(var o,a,u,s,l,c,f=t.createDocumentFragment(),d=[],p=0,h=e.length;p<h;p++)if((o=e[p])||0===o)if("object"===b(o))w.merge(d,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),u=(pe.exec(o)||["",""])[1].toLowerCase(),s=ge[u]||ge._default,a.innerHTML=s[1]+w.htmlPrefilter(o)+s[2],c=s[0];while(c--)a=a.lastChild;w.merge(d,a.childNodes),(a=f.firstChild).textContent=""}else d.push(t.createTextNode(o));f.textContent="",p=0;while(o=d[p++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ve(f.appendChild(o),"script"),l&&ye(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var xe=r.documentElement,we=/^key/,Ce=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Te=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function Ne(){return!1}function ke(){try{return r.activeElement}catch(e){}}function Ae(e,t,n,r,i,o){var a,u;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(u in t)Ae(e,u,n,r,t[u],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=Ne;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,u,s,l,c,f,d,p,h,g,v=K.get(e);if(v){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(xe,i),n.guid||(n.guid=w.guid++),(s=v.events)||(s=v.events={}),(a=v.handle)||(a=v.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(I)||[""]).length;while(l--)p=g=(u=Te.exec(t[l])||[])[1],h=(u[2]||"").split(".").sort(),p&&(f=w.event.special[p]||{},p=(i?f.delegateType:f.bindType)||p,f=w.event.special[p]||{},c=w.extend({type:p,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(d=s[p])||((d=s[p]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(p,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?d.splice(d.delegateCount++,0,c):d.push(c),w.event.global[p]=!0)}},remove:function(e,t,n,r,i){var o,a,u,s,l,c,f,d,p,h,g,v=K.hasData(e)&&K.get(e);if(v&&(s=v.events)){l=(t=(t||"").match(I)||[""]).length;while(l--)if(u=Te.exec(t[l])||[],p=g=u[1],h=(u[2]||"").split(".").sort(),p){f=w.event.special[p]||{},d=s[p=(r?f.delegateType:f.bindType)||p]||[],u=u[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=d.length;while(o--)c=d[o],!i&&g!==c.origType||n&&n.guid!==c.guid||u&&!u.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(d.splice(o,1),c.selector&&d.delegateCount--,f.remove&&f.remove.call(e,c));a&&!d.length&&(f.teardown&&!1!==f.teardown.call(e,h,v.handle)||w.removeEvent(e,p,v.handle),delete s[p])}else for(p in s)w.event.remove(e,p+t[l],n,r,!0);w.isEmptyObject(s)&&K.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,u,s=new Array(arguments.length),l=(K.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(s[0]=t,n=1;n<arguments.length;n++)s[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){u=w.event.handlers.call(this,t,l),n=0;while((o=u[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,s))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,u=[],s=t.delegateCount,l=e.target;if(s&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<s;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&u.push({elem:l,handlers:o})}return l=this,s<t.length&&u.push({elem:l,handlers:t.slice(s)}),u},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ke()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===ke()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&D(this,"input"))return this.click(),!1},_default:function(e){return D(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:Ne,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:Ne,isPropagationStopped:Ne,isImmediatePropagationStopped:Ne,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Ce.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return Ae(this,e,t,n,r)},one:function(e,t,n,r){return Ae(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=Ne),this.each(function(){w.event.remove(this,e,n,t)})}});var De=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Se=/<script|<style|<link/i,Le=/checked\s*(?:[^=]|=\s*.checked.)/i,je=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function qe(e,t){return D(e,"table")&&D(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function Oe(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Pe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function He(e,t){var n,r,i,o,a,u,s,l;if(1===t.nodeType){if(K.hasData(e)&&(o=K.access(e),a=K.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}J.hasData(e)&&(u=J.access(e),s=w.extend({},u),J.set(t,s))}}function Ie(e,t){var n=t.nodeName.toLowerCase();"input"===n&&de.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,u,s,l,c,f=0,d=e.length,p=d-1,v=t[0],y=g(v);if(y||d>1&&"string"==typeof v&&!h.checkClone&&Le.test(v))return e.each(function(i){var o=e.eq(i);y&&(t[0]=v.call(this,i,o.html())),Re(o,t,n,r)});if(d&&(i=be(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(s=(u=w.map(ve(i,"script"),Oe)).length;f<d;f++)l=i,f!==p&&(l=w.clone(l,!0,!0),s&&w.merge(u,ve(l,"script"))),n.call(e[f],l,f);if(s)for(c=u[u.length-1].ownerDocument,w.map(u,Pe),f=0;f<s;f++)l=u[f],he.test(l.type||"")&&!K.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(je,""),c,l))}return e}function Be(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ve(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ye(ve(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(De,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,u=e.cloneNode(!0),s=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ve(u),r=0,i=(o=ve(e)).length;r<i;r++)Ie(o[r],a[r]);if(t)if(n)for(o=o||ve(e),a=a||ve(u),r=0,i=o.length;r<i;r++)He(o[r],a[r]);else He(e,u);return(a=ve(u,"script")).length>0&&ye(a,!s&&ve(e,"script")),u},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[K.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[K.expando]=void 0}n[J.expando]&&(n[J.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Be(this,e,!0)},remove:function(e){return Be(this,e)},text:function(e){return _(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||qe(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=qe(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ve(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return _(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Se.test(e)&&!ge[(pe.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ve(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ve(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),u.apply(r,n.get());return this.pushStack(r)}});var Me=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),We=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},$e=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",xe.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,s=12===n(t.marginLeft),c.style.right="60%",u=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",xe.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,u,s,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),u},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),s},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,u=e.style;return(n=n||We(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&Me.test(a)&&$e.test(t)&&(r=u.width,i=u.minWidth,o=u.maxWidth,u.minWidth=u.maxWidth=u.width=a,a=n.width,u.width=r,u.minWidth=i,u.maxWidth=o)),void 0!==a?a+"":a}function ze(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var _e=/^(none|table(?!-c[ea]).+)/,Ue=/^--/,Ve={position:"absolute",visibility:"hidden",display:"block"},Xe={letterSpacing:"0",fontWeight:"400"},Qe=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Ge(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Qe.length;while(n--)if((e=Qe[n]+t)in Ye)return e}function Ke(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Ge(e)||e),t}function Je(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,u=0,s=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(s+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(s-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(s-=w.css(e,"border"+oe[a]+"Width",!0,i))):(s+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?s+=w.css(e,"border"+oe[a]+"Width",!0,i):u+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(s+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-s-u-.5))),s}function et(e,t,n){var r=We(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(Me.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,u=Q(t),s=Ue.test(t),l=e.style;if(s||(t=Ke(u)),a=w.cssHooks[t]||w.cssHooks[u],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=se(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[u]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(s?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,u=Q(t);return Ue.test(t)||(t=Ke(u)),(a=w.cssHooks[t]||w.cssHooks[u])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Xe&&(i=Xe[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!_e.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):ue(e,Ve,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=We(e),a="border-box"===w.css(e,"boxSizing",!1,o),u=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(u-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),u&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Je(e,n,u)}}}),w.cssHooks.marginLeft=ze(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-ue(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Je)}),w.fn.extend({css:function(e,t){return _(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=We(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}}),w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var tt,nt=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return _(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?tt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&D(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(I);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),tt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=nt[t]||w.find.attr;nt[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=nt[a],nt[a]=i,i=null!=n(e,t,r)?a:null,nt[a]=o),i}});var rt=/^(?:input|select|textarea|button)$/i,it=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return _(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):rt.test(e.nodeName)||it.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function ot(e){return(e.match(I)||[]).join(" ")}function at(e){return e.getAttribute&&e.getAttribute("class")||""}function ut(e){return Array.isArray(e)?e:"string"==typeof e?e.match(I)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,u,s=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,at(this)))});if((t=ut(e)).length)while(n=this[s++])if(i=at(n),r=1===n.nodeType&&" "+ot(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(u=ot(r))&&n.setAttribute("class",u)}return this},removeClass:function(e){var t,n,r,i,o,a,u,s=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,at(this)))});if(!arguments.length)return this.attr("class","");if((t=ut(e)).length)while(n=this[s++])if(i=at(n),r=1===n.nodeType&&" "+ot(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(u=ot(r))&&n.setAttribute("class",u)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,at(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=ut(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=at(this))&&K.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":K.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+ot(at(n))+" ").indexOf(t)>-1)return!0;return!1}});var st=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(st,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:ot(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,u=a?null:[],s=a?o+1:i.length;for(r=o<0?s:a?o:0;r<s;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!D(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;u.push(t)}return u},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var lt=/^(?:focusinfocus|focusoutblur)$/,ct=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,u,s,l,c,d,p,h,y=[i||r],m=f.call(t,"type")?t.type:t,b=f.call(t,"namespace")?t.namespace.split("."):[];if(u=h=s=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!lt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(b=m.split(".")).shift(),b.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=b.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+b.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),p=w.event.special[m]||{},o||!p.trigger||!1!==p.trigger.apply(i,n))){if(!o&&!p.noBubble&&!v(i)){for(l=p.delegateType||m,lt.test(l+m)||(u=u.parentNode);u;u=u.parentNode)y.push(u),s=u;s===(i.ownerDocument||r)&&y.push(s.defaultView||s.parentWindow||e)}a=0;while((u=y[a++])&&!t.isPropagationStopped())h=u,t.type=a>1?l:p.bindType||m,(d=(K.get(u,"events")||{})[t.type]&&K.get(u,"handle"))&&d.apply(u,n),(d=c&&u[c])&&d.apply&&Y(u)&&(t.result=d.apply(u,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||p._default&&!1!==p._default.apply(y.pop(),n)||!Y(i)||c&&g(i[m])&&!v(i)&&((s=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,ct),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,ct),w.event.triggered=void 0,s&&(i[c]=s)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=K.access(r,t);i||r.addEventListener(e,n,!0),K.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=K.access(r,t)-1;i?K.access(r,t,i):(r.removeEventListener(e,n,!0),K.remove(r,t))}}});var ft=/\[\]$/,dt=/\r?\n/g,pt=/^(?:submit|button|image|reset|file)$/i,ht=/^(?:input|select|textarea|keygen)/i;function gt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||ft.test(e)?r(e,i):gt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==b(t))r(e,t);else for(i in t)gt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)gt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&ht.test(this.nodeName)&&!pt.test(e)&&(this.checked||!de.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(dt,"\r\n")}}):{name:t.name,value:n.replace(dt,"\r\n")}}).get()}}),w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=S.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=be([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.offset={setOffset:function(e,t,n){var r,i,o,a,u,s,l,c=w.css(e,"position"),f=w(e),d={};"static"===c&&(e.style.position="relative"),u=f.offset(),o=w.css(e,"top"),s=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+s).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(s)||0),g(t)&&(t=t.call(e,n,w.extend({},u))),null!=t.top&&(d.top=t.top-u.top+a),null!=t.left&&(d.left=t.left-u.left+i),"using"in t?t.using.call(e,d):f.css(d)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||xe})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return _(this,function(e,r,i){var o;if(v(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=ze(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),Me.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),u=n||(!0===i||!0===o?"margin":"border");return _(this,function(t,n,i){var o;return v(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,u):w.style(t,n,i,u)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=D,w.isFunction=g,w.isWindow=v,w.camelCase=Q,w.type=b,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var vt=e.jQuery,yt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=yt),t&&e.jQuery===w&&(e.jQuery=vt),w},t||(e.jQuery=e.$=w),w});

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!****************************!*\
  !*** ./src/libs/perlin.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function (root) {
  var module = (root.noise = root.noise || {});

  function Grad(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }

  Grad.prototype.dot2 = function(x, y) {
    return this.x*x + this.y*y;
  };

  Grad.prototype.dot3 = function(x, y, z) {
    return this.x*x + this.y*y + this.z*z;
  };

  var grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
               new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
               new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

  var p = [151,160,137,91,90,15,
  131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
  190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
  88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
  77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
  102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
  135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
  5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
  223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
  129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
  251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
  49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
  138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
  // To remove the need for index wrapping, double the permutation table length
  var perm = new Array(512);
  var gradP = new Array(512);

  // This isn't a very good seeding function, but it works ok. It supports 2^16
  // different seed values. Write something better if you need more seeds.
  module.seed = function(seed) {
    if(seed > 0 && seed < 1) {
      // Scale the seed out
      seed *= 65536;
    }

    seed = Math.floor(seed);
    if(seed < 256) {
      seed |= seed << 8;
    }

    for(var i = 0; i < 256; i++) {
      var v;
      if (i & 1) {
        v = p[i] ^ (seed & 255);
      } else {
        v = p[i] ^ ((seed>>8) & 255);
      }

      perm[i] = perm[i + 256] = v;
      gradP[i] = gradP[i + 256] = grad3[v % 12];
    }
  };

  module.seed(0);

  /*
  for(var i=0; i<256; i++) {
    perm[i] = perm[i + 256] = p[i];
    gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
  }*/

  // Skewing and unskewing factors for 2, 3, and 4 dimensions
  var F2 = 0.5*(Math.sqrt(3)-1);
  var G2 = (3-Math.sqrt(3))/6;

  var F3 = 1/3;
  var G3 = 1/6;

  // 2D simplex noise
  module.simplex2 = function(xin, yin) {
    var n0, n1, n2; // Noise contributions from the three corners
    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin)*F2; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var t = (i+j)*G2;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    // For the 2D case, the simplex shape is an equilateral triangle.
    // Determine which simplex we are in.
    var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
    if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
      i1=1; j1=0;
    } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
      i1=0; j1=1;
    }
    // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
    // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
    // c = (3-sqrt(3))/6
    var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
    var y1 = y0 - j1 + G2;
    var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
    var y2 = y0 - 1 + 2 * G2;
    // Work out the hashed gradient indices of the three simplex corners
    i &= 255;
    j &= 255;
    var gi0 = gradP[i+perm[j]];
    var gi1 = gradP[i+i1+perm[j+j1]];
    var gi2 = gradP[i+1+perm[j+1]];
    // Calculate the contribution from the three corners
    var t0 = 0.5 - x0*x0-y0*y0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.5 - x1*x1-y1*y1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot2(x1, y1);
    }
    var t2 = 0.5 - x2*x2-y2*y2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot2(x2, y2);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 70 * (n0 + n1 + n2);
  };

  // 3D simplex noise
  module.simplex3 = function(xin, yin, zin) {
    var n0, n1, n2, n3; // Noise contributions from the four corners

    // Skew the input space to determine which simplex cell we're in
    var s = (xin+yin+zin)*F3; // Hairy factor for 2D
    var i = Math.floor(xin+s);
    var j = Math.floor(yin+s);
    var k = Math.floor(zin+s);

    var t = (i+j+k)*G3;
    var x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
    var y0 = yin-j+t;
    var z0 = zin-k+t;

    // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
    // Determine which simplex we are in.
    var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
    var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
    if(x0 >= y0) {
      if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
      else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
      else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
    } else {
      if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
      else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
      else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
    }
    // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
    // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
    // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
    // c = 1/6.
    var x1 = x0 - i1 + G3; // Offsets for second corner
    var y1 = y0 - j1 + G3;
    var z1 = z0 - k1 + G3;

    var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
    var y2 = y0 - j2 + 2 * G3;
    var z2 = z0 - k2 + 2 * G3;

    var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
    var y3 = y0 - 1 + 3 * G3;
    var z3 = z0 - 1 + 3 * G3;

    // Work out the hashed gradient indices of the four simplex corners
    i &= 255;
    j &= 255;
    k &= 255;
    var gi0 = gradP[i+   perm[j+   perm[k   ]]];
    var gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
    var gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
    var gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

    // Calculate the contribution from the four corners
    var t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
    if(t0<0) {
      n0 = 0;
    } else {
      t0 *= t0;
      n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
    }
    var t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
    if(t1<0) {
      n1 = 0;
    } else {
      t1 *= t1;
      n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
    }
    var t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
    if(t2<0) {
      n2 = 0;
    } else {
      t2 *= t2;
      n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
    }
    var t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
    if(t3<0) {
      n3 = 0;
    } else {
      t3 *= t3;
      n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
    }
    // Add contributions from each corner to get the final noise value.
    // The result is scaled to return values in the interval [-1,1].
    return 32 * (n0 + n1 + n2 + n3);

  };

  // ##### Perlin noise stuff

  function fade(t) {
    return t*t*t*(t*(t*6-15)+10);
  }

  function lerp(a, b, t) {
    return (1-t)*a + t*b;
  }

  // 2D Perlin Noise
  module.perlin2 = function(x, y) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y);
    // Get relative xy coordinates of point within that cell
    x = x - X; y = y - Y;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255;

    // Calculate noise contributions from each of the four corners
    var n00 = gradP[X+perm[Y]].dot2(x, y);
    var n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
    var n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
    var n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

    // Compute the fade curve value for x
    var u = fade(x);

    // Interpolate the four results
    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
       fade(y));
  };

  // 3D Perlin Noise
  module.perlin3 = function(x, y, z) {
    // Find unit grid cell containing point
    var X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    // Get relative xyz coordinates of point within that cell
    x = x - X; y = y - Y; z = z - Z;
    // Wrap the integer cells at 255 (smaller integer period can be introduced here)
    X = X & 255; Y = Y & 255; Z = Z & 255;

    // Calculate noise contributions from each of the eight corners
    var n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
    var n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
    var n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
    var n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
    var n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
    var n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
    var n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
    var n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

    // Compute the fade curve value for x, y, z
    var u = fade(x);
    var v = fade(y);
    var w = fade(z);

    // Interpolate
    return lerp(
        lerp(
          lerp(n000, n100, u),
          lerp(n001, n101, u), w),
        lerp(
          lerp(n010, n110, u),
          lerp(n011, n111, u), w),
       v);
  };

})(typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : {});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
var __webpack_exports__ = {};
/*!************************************!*\
  !*** ./src/libs/seedrandom.min.js ***!
  \************************************/
__webpack_require__.r(__webpack_exports__);
!function(a,b,c,d,e,f,g,h,i){function j(a){var b,c=a.length,e=this,f=0,g=e.i=e.j=0,h=e.S=[];for(c||(a=[c++]);d>f;)h[f]=f++;for(f=0;d>f;f++)h[f]=h[g=s&g+a[f%c]+(b=h[f])],h[g]=b;(e.g=function(a){for(var b,c=0,f=e.i,g=e.j,h=e.S;a--;)b=h[f=s&f+1],c=c*d+h[s&(h[f]=h[g=s&g+b])+(h[g]=b)];return e.i=f,e.j=g,c})(d)}function k(a,b){var c,d=[],e=typeof a;if(b&&"object"==e)for(c in a)try{d.push(k(a[c],b-1))}catch(f){}return d.length?d:"string"==e?a:a+"\0"}function l(a,b){for(var c,d=a+"",e=0;e<d.length;)b[s&e]=s&(c^=19*b[s&e])+d.charCodeAt(e++);return n(b)}function m(c){try{return o?n(o.randomBytes(d)):(a.crypto.getRandomValues(c=new Uint8Array(d)),n(c))}catch(e){return[+new Date,a,(c=a.navigator)&&c.plugins,a.screen,n(b)]}}function n(a){return String.fromCharCode.apply(0,a)}var o,p=c.pow(d,e),q=c.pow(2,f),r=2*q,s=d-1,t=c["seed"+i]=function(a,f,g){var h=[];f=1==f?{entropy:!0}:f||{};var o=l(k(f.entropy?[a,n(b)]:null==a?m():a,3),h),s=new j(h);return l(n(s.S),b),(f.pass||g||function(a,b,d){return d?(c[i]=a,b):a})(function(){for(var a=s.g(e),b=p,c=0;q>a;)a=(a+c)*d,b*=d,c=s.g(1);for(;a>=r;)a/=2,b/=2,c>>>=1;return(a+c)/b},o,"global"in f?f.global:this==c)};if(l(c[i](),b),g&&g.exports){g.exports=t;try{o=require("crypto")}catch(u){}}else h&&h.amd&&h(function(){return t})}(undefined,[],Math,256,6,52,"object"==typeof module&&module,"function"==typeof define&&define,"random");
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************!*\
  !*** ./src/entry.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _prototypes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./prototypes.js */ "./src/prototypes.js");
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../config.js */ "./config.js");
/* harmony import */ var _helpers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers.js */ "./src/helpers.js");
/* harmony import */ var _structures_List_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./structures/List.js */ "./src/structures/List.js");
/* harmony import */ var _structures_Matrix_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./structures/Matrix.js */ "./src/structures/Matrix.js");
/* harmony import */ var _structures_NumericMatrix_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./structures/NumericMatrix.js */ "./src/structures/NumericMatrix.js");
/* harmony import */ var _structures_BinaryMatrix_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./structures/BinaryMatrix.js */ "./src/structures/BinaryMatrix.js");
/* harmony import */ var _structures_PointMatrix_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./structures/PointMatrix.js */ "./src/structures/PointMatrix.js");
/* harmony import */ var _services_Timer_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./services/Timer.js */ "./src/services/Timer.js");
/* harmony import */ var _services_Layers_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./services/Layers.js */ "./src/services/Layers.js");
/* harmony import */ var _maps_AltitudeMap_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./maps/AltitudeMap.js */ "./src/maps/AltitudeMap.js");
/* harmony import */ var _maps_OceanMap_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./maps/OceanMap.js */ "./src/maps/OceanMap.js");
/* harmony import */ var _maps_CoastMap_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./maps/CoastMap.js */ "./src/maps/CoastMap.js");
/* harmony import */ var _maps_LakesMap_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./maps/LakesMap.js */ "./src/maps/LakesMap.js");
/* harmony import */ var _maps_RiversMap_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./maps/RiversMap.js */ "./src/maps/RiversMap.js");
/* harmony import */ var _maps_HumidityMap_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./maps/HumidityMap.js */ "./src/maps/HumidityMap.js");
/* harmony import */ var _maps_TemperatureMap_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./maps/TemperatureMap.js */ "./src/maps/TemperatureMap.js");
/* harmony import */ var _maps_ForestMap_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./maps/ForestMap.js */ "./src/maps/ForestMap.js");
/* harmony import */ var _biomes_Biome_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./biomes/Biome.js */ "./src/biomes/Biome.js");
/* harmony import */ var _biomes_Biome_Beach_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./biomes/Biome_Beach.js */ "./src/biomes/Biome_Beach.js");
/* harmony import */ var _biomes_Biome_Coast_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! ./biomes/Biome_Coast.js */ "./src/biomes/Biome_Coast.js");
/* harmony import */ var _biomes_Biome_Desert_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! ./biomes/Biome_Desert.js */ "./src/biomes/Biome_Desert.js");
/* harmony import */ var _biomes_Biome_Grass_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! ./biomes/Biome_Grass.js */ "./src/biomes/Biome_Grass.js");
/* harmony import */ var _biomes_Biome_Ocean_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! ./biomes/Biome_Ocean.js */ "./src/biomes/Biome_Ocean.js");
/* harmony import */ var _biomes_Biome_Tropic_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! ./biomes/Biome_Tropic.js */ "./src/biomes/Biome_Tropic.js");
/* harmony import */ var _biomes_Biome_Tundra_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! ./biomes/Biome_Tundra.js */ "./src/biomes/Biome_Tundra.js");
/* harmony import */ var _biomes_Biome_Water_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ./biomes/Biome_Water.js */ "./src/biomes/Biome_Water.js");
/* harmony import */ var _biomes_Biomes_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! ./biomes/Biomes.js */ "./src/biomes/Biomes.js");
/* harmony import */ var _animals_Animal_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ./animals/Animal.js */ "./src/animals/Animal.js");
/* harmony import */ var _animals_Fish_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! ./animals/Fish.js */ "./src/animals/Fish.js");
/* harmony import */ var _animals_Deer_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(/*! ./animals/Deer.js */ "./src/animals/Deer.js");
/* harmony import */ var _animals_Cow_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(/*! ./animals/Cow.js */ "./src/animals/Cow.js");
/* harmony import */ var _human_Faction_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(/*! ./human/Faction.js */ "./src/human/Faction.js");
/* harmony import */ var _generators_NoiseMapGenerator_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(/*! ./generators/NoiseMapGenerator.js */ "./src/generators/NoiseMapGenerator.js");
/* harmony import */ var _generators_ForestGenerator_js__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(/*! ./generators/ForestGenerator.js */ "./src/generators/ForestGenerator.js");
/* harmony import */ var _generators_AnimalGenerator_js__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(/*! ./generators/AnimalGenerator.js */ "./src/generators/AnimalGenerator.js");
/* harmony import */ var _generators_FishGenerator_js__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(/*! ./generators/FishGenerator.js */ "./src/generators/FishGenerator.js");
/* harmony import */ var _generators_DeerGenerator_js__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(/*! ./generators/DeerGenerator.js */ "./src/generators/DeerGenerator.js");
/* harmony import */ var _generators_CowGenerator_js__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(/*! ./generators/CowGenerator.js */ "./src/generators/CowGenerator.js");
/* harmony import */ var _generators_FactionGenerator_js__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(/*! ./generators/FactionGenerator.js */ "./src/generators/FactionGenerator.js");
/* harmony import */ var _operators_SurfaceOperator_js__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(/*! ./operators/SurfaceOperator.js */ "./src/operators/SurfaceOperator.js");
/* harmony import */ var _operators_WeatherOperator_js__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(/*! ./operators/WeatherOperator.js */ "./src/operators/WeatherOperator.js");
/* harmony import */ var _operators_WaterOperator_js__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(/*! ./operators/WaterOperator.js */ "./src/operators/WaterOperator.js");
/* harmony import */ var _operators_HumidityOperator_js__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(/*! ./operators/HumidityOperator.js */ "./src/operators/HumidityOperator.js");
/* harmony import */ var _operators_BiomesOperator_js__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(/*! ./operators/BiomesOperator.js */ "./src/operators/BiomesOperator.js");
/* harmony import */ var _operators_ForestsOperator_js__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(/*! ./operators/ForestsOperator.js */ "./src/operators/ForestsOperator.js");
/* harmony import */ var _operators_AnimalsOperator_js__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(/*! ./operators/AnimalsOperator.js */ "./src/operators/AnimalsOperator.js");
/* harmony import */ var _operators_FactionsOperator_js__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(/*! ./operators/FactionsOperator.js */ "./src/operators/FactionsOperator.js");
/* harmony import */ var _render_DisplayCell_js__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(/*! ./render/DisplayCell.js */ "./src/render/DisplayCell.js");
/* harmony import */ var _render_CellsRenderer_js__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(/*! ./render/CellsRenderer.js */ "./src/render/CellsRenderer.js");
/* harmony import */ var _render_Layer_js__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(/*! ./render/Layer.js */ "./src/render/Layer.js");
/* harmony import */ var _World_js__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(/*! ./World.js */ "./src/World.js");
/* harmony import */ var _futura_js__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(/*! ../futura.js */ "./futura.js");





















































})();

/******/ })()
;
//# sourceMappingURL=bundle.js.map