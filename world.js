let WORLD_SCALE = 33,
    WORLD_MAP_OCEAN_LEVEL = 0.5; // [0 - 1]

let LEVEL_OCEAN = 0.2,
    LEVEL_COAST = 0.3;

let WATER_HUMIDITY_FACTOR = 0.4, // [0 - 1]
    OCEAN_HUMIDITY_FACTOR = 0.2; // [0 - 1]

let ALTITUDE_TEMPERATURE_FACTOR = 0.3; // [0 - 1]

let BIOME_OCEAN = 0,
    BIOME_COAST = 1,

    BIOME_SNOW = 2,
    BIOME_TUNDRA = 3,
    BIOME_GRASS = 4,
    BIOME_SANDS = 5,
    BIOME_LOWLAND = 6,
    BIOME_SWAMP = 7,
    BIOME_SAVANNA = 8,
    BIOME_TROPICS = 9,

    BIOME_RIVER = 10,
    BIOME_LAKE = 11;

let RIVERS_DENSITY = 0.5, // [0-1]
    RIVER_SOURCE_MIN_ALTITUDE = 0.6,
    RIVER_SOURCE_MAX_ALTITUDE = 0.85,
    RIVERS_CLOSENESS = 3,
    RIVER_MIN_LENGTH = 5;

/**
 * @constructor
 * @param {number} biomeType
 * @return {Biome}
 */
function Biome(biomeType) {

    let type = biomeType;

    this.getType = function() {
        return type;
    };
}

/**
 * @param {Biome} biome
 * @param {number} altitude
 * @return {array}
 */
function getBiomeColor(biome, altitude) {

    let colors = [];

    colors[BIOME_SNOW] = '#c4c4c4'; //@TODO use array of 3 colors for diff altitudes
    colors[BIOME_TUNDRA] = '#cdbc73';
    colors[BIOME_GRASS] = '#73AA00';
    colors[BIOME_SANDS] = '#F0D75A';
    colors[BIOME_LOWLAND] = '#5a9600';
    colors[BIOME_SWAMP] = '#0FA055';
    colors[BIOME_SAVANNA] = '#82AF00';
    colors[BIOME_TROPICS] = '#50AA00';
    colors[BIOME_COAST] = '#0ca0c8';
    colors[BIOME_RIVER] = '#0ca0c8';
    colors[BIOME_LAKE] = '#0082ca';
    colors[BIOME_OCEAN] = '#0064be';

    let color = colors[biome.getType()];

    if (typeof color === 'undefined') {
        color = colors[BIOME_OCEAN];
    }

    return hexToRgb(color);
}

/**
 * @constructor
 */
function World() {

    let worldWrapper,
        worldWidth,
        worldHeight,
        worldCanvas,
        miniMapCanvas,
        miniMapImage,
        wrapperWidth = 0,
        wrapperHeight = 0;

    /**
     * @param {HTMLElement} cnv
     * @param {number} w
     * @param {number} h
     */
    this.init = function(cnv, w, h) {

        worldCanvas = cnv;
        worldCanvas.width = w;
        worldWidth = w;
        worldCanvas.height = h;
        worldHeight = h;

        logTimeEvent('World canvas initialized');
    };

    /**
     * @param {number} level
     * @return {boolean}
     */
    let isGround = function(level) {
        return level > LEVEL_COAST;
    };

    /**
     * @param level
     * @return {boolean}
     */
    let isWater = function(level) {
        return level <= LEVEL_COAST;
    };

    /**
     * @param {number} power
     * @return {PointMatrix}
     */
    let createNoiseMap = function(power) {

        noise.seed(Math.random());

        let map = new PointMatrix(worldWidth, worldHeight);

        map.map(function(x, y) {
            return (noise.simplex2(x / power, y / power) + 1) * 0.5; // [0, 1] blurred height map
        });

        return map;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} maxX
     * @param {number} maxY
     * @param {number} altitude
     * @return {number}
     */
    let makeIsland = function(x, y, maxX, maxY, altitude) {

        // Circular Distance
        let dx = Math.abs(x - maxX * 0.5),
            dy = Math.abs(y - maxY * 0.5),
            distance = Math.sqrt(dx * dx + dy * dy),
            delta = distance / (maxX * 0.5),
            gradient = delta * delta - 0.25;

        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    };

    /**
     * @param {number} worldWidth
     * @return {number}
     */
    let calculateAltitudeOctaves = function(worldWidth) {

        let octaves = 1;

        while(worldWidth > 1) {
            worldWidth = worldWidth / 3;
            octaves++;
        }

        return octaves;
    };

    /**
     * @return {PointMatrix}
     */
    let generateAltitudeMap = function() {

        let altitudeMap = new PointMatrix(worldWidth, worldHeight),
            octaves = calculateAltitudeOctaves(worldWidth),
            distances = getEqualDistances(octaves, 10, 100),
            maps = [];

        for(let i = 0; i < octaves; i++) {
            maps[i] = createNoiseMap(distances[i]);
        }

        altitudeMap.map(function(x, y) {

            let val = 0;

            // blend maps
            for(let i = 0; i < maps.length; i++) {
                val += maps[i].getTile(x, y);
            }

            val /= maps.length;

            // stretch map
            val = Math.min(1, Math.pow(val, WORLD_MAP_OCEAN_LEVEL + 1));

            // make island
            val = makeIsland(x, y, worldWidth, worldHeight, val);

            return val;
        });

        altitudeMap = Filters.apply('altitudeMap', altitudeMap);

        logTimeEvent('Altitude map blended using ' + octaves + ' noise maps');

        return altitudeMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @return {BinaryMatrix}
     */
    let getOceanMap = function(altitudeMap) {

        let oceanMap = new BinaryMatrix(worldWidth, worldHeight),
            waterPoints = [];

        altitudeMap.foreach(function(x, y) {
            if (isWater(altitudeMap.getTile(x, y))) {
                waterPoints.push([x, y]);
            }
        });

        oceanMap.map(function(x, y) {
            return x === 0 || y === 0 || x === worldWidth - 1 || y === worldHeight - 1 ? 1 : 0;
        });

        for(let t = 0; t < 100000; t++) {

            let newWaterPoints = [];

            for(let i = 0; i < waterPoints.length; i++) {

                let x = waterPoints[i][0],
                    y = waterPoints[i][1],
                    isOcean = false;

                if (!oceanMap.filled(x, y)) {

                    let neighbors = oceanMap.getNeighbors(x, y, 1);

                    for(let j = 0; j < neighbors.length; j++) {

                        let nx = neighbors[j][0],
                            ny = neighbors[j][1];

                        if (oceanMap.filled(nx, ny)) {
                            oceanMap.fill(x, y);
                            isOcean = true;
                        }
                    }

                } else {
                    isOcean = true;
                }

                if (!isOcean) {
                    newWaterPoints.push([x, y]);
                }
            }

            if (waterPoints.length === newWaterPoints.length) {
                break;
            }

            waterPoints = newWaterPoints;
        }

        oceanMap = Filters.apply('oceanMap', oceanMap);

        logTimeEvent('Ocean map initialized');

        return oceanMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @param {BinaryMatrix} oceanMap
     * @return {BinaryMatrix}
     */
    let getLakesMap = function(altitudeMap, oceanMap) {

        let lakesMap = new BinaryMatrix(worldWidth, worldHeight);

        altitudeMap.foreach(function(x, y) {
            if (isWater(altitudeMap.getTile(x, y)) && !oceanMap.filled(x, y)) {
                lakesMap.fill(x, y);
            }
        });

        lakesMap = Filters.apply('lakesMap', lakesMap);

        logTimeEvent('Lakes map initialized');

        return lakesMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @param {Array} riverSources
     * @return {number}
     */
    let getPossibleRiversCount = function(altitudeMap, riverSources) {

        if (RIVERS_DENSITY === 0) {
            return 0;
        }

        let minRiverLength = RIVER_MIN_LENGTH,
            maxRivers = riverSources.length / (minRiverLength * RIVERS_CLOSENESS);

        return Math.round(tval(RIVERS_DENSITY, 1, maxRivers));
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {Array} riverPoints
     * @param {number} closeness
     * @return {boolean}
     */
    let tooCloseToArray = function(x, y, riverPoints, closeness) {

        let fail = false;

        for(let i = 0; i < riverPoints.length; i++) {
            if (closeness >= distance(x, y, riverPoints[i][0], riverPoints[i][1])) {
                fail = true;
                break;
            }
        }

        return fail;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {Array} riverPoints
     * @return {boolean}
     */
    let tooCloseToRivers = function(x, y, riverPoints) {
        return tooCloseToArray(x, y, riverPoints, RIVERS_CLOSENESS);
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @return {Array}
     */
    let getRiverSources = function(altitudeMap) {

        let spawns = [],
            riverSources = [];

        altitudeMap.foreach(function(x, y) {
            let altitude = altitudeMap.getTile(x, y);
            if (isGround(altitude) && altitude >= RIVER_SOURCE_MIN_ALTITUDE && RIVER_SOURCE_MAX_ALTITUDE >= altitude) {
                spawns.push([x, y]);
            }
        });

        spawns = spawns.shuffle();

        for(let i = 0; i < spawns.length; i++) {
            if (!tooCloseToRivers(spawns[i][0], spawns[i][1], riverSources)) {
                riverSources.push(spawns[i]);
            }
        }

        let map = new BinaryMatrix(worldWidth, worldHeight);
        for(let j = 0; j < riverSources.length; j++) {
            map.fill(riverSources[j][0], riverSources[j][1]);
        }

        Filters.apply('riverSourcesMap', map);

        logTimeEvent('River sources found');

        return riverSources;
    };

    /**
     * @param {Array} river
     * @param {PointMatrix} altitudeMap
     * @param {Array} otherRiverPoints
     * @return {Array}
     */
    let getRiverDirection = function(river, altitudeMap, otherRiverPoints) {

        let currentPoint = river[river.length - 1],
            prevPoint = river.length > 2 ? river[river.length - 2] : false,
            x = currentPoint[0],
            y = currentPoint[1],
            currentAltitude = altitudeMap.getTile(currentPoint[0], currentPoint[1]),
            lowerPoint = [],
            neighbors = altitudeMap.getNeighbors(x, y, 2).shuffle();

        for(let i = 0; i < neighbors.length; i++) {

            let nx = neighbors[i][0],
                ny = neighbors[i][1],
                altitude = altitudeMap.getTile(nx, ny);

            if (altitude > currentAltitude) {
                continue;
            }

            if (tooCloseToRivers(nx, ny, otherRiverPoints)) {
                continue;
            }

            if (prevPoint && distance(nx, ny, prevPoint[0], prevPoint[1]) === 1) {
                continue;
            }

            lowerPoint = [nx, ny];
            break;
        }

        return lowerPoint;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @param {Array} point
     * @return {boolean}
     */
    let isRiverDelta = function(altitudeMap, point) {
        return isWater(altitudeMap.getTile(point[0], point[1]));
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @return {BinaryMatrix}
     */
    let generateRiversMap = function(altitudeMap) {

        let riverSources = getRiverSources(altitudeMap),
            rivers = [],
            riverPoints = [],
            otherRiverPoints = [],
            riversCount = getPossibleRiversCount(altitudeMap, riverSources);

        for(let i = 0; i < riverSources.length; i++) {

            let river = [],
                finished = false;

            river.push(riverSources[i]);

            for(let j = 0; j < 1000; j++) {

                let nextPoint = getRiverDirection(river, altitudeMap, otherRiverPoints);
                if (!nextPoint.length) {
                    break;
                }

                riverPoints.push(nextPoint);

                // watter found - trie again and if not possible - terminate
                if (isRiverDelta(altitudeMap, nextPoint)) {
                    finished = true;
                    break;
                }

                river.push(nextPoint);
            }

            // @TODO Dig rivers (increase width depends on length)

            if (finished && river.length >= RIVER_MIN_LENGTH) {
                rivers.push(river);
                otherRiverPoints = otherRiverPoints.concat(river);
                otherRiverPoints.unique();
            }

            if (rivers.length === riversCount) {
                break;
            }
        }

        let riversMap = new BinaryMatrix(worldWidth, worldHeight);

        for(let i = 0; i < rivers.length; i++) {
            for(let p = 0; p < rivers[i].length; p++) {
                riversMap.fill(rivers[i][p][0], rivers[i][p][1]);
            }
        }

        riversMap = Filters.apply('riversMap', riversMap);

        logTimeEvent('Rivers generated');

        return riversMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @return {PointMatrix}
     */
    let generateTemperatureMap = function(altitudeMap) {

        let temperatureMap = createNoiseMap(75),
            half = worldHeight / 2;

        // higher temperature to the middle
        temperatureMap.map(function(x, y) {
            return (temperatureMap.getTile(x, y) + (Math.abs(y - half) / half)) * 0.5;
        });

        // change temperature depends on altitude
        temperatureMap.map(function(x, y) {
            return temperatureMap.getTile(x, y) - altitudeMap.getTile(x, y) * ALTITUDE_TEMPERATURE_FACTOR;
        });

        temperatureMap = Filters.apply('temperatureMap', temperatureMap);

        logTimeEvent('Temperature map created');

        return temperatureMap;
    };

    /**
     * @param {BinaryMatrix} oceanMap
     * @param {BinaryMatrix} riversMap
     * @param {BinaryMatrix} lakesMap
     * @return {PointMatrix}
     */
    let generateHumidityMap = function(oceanMap, riversMap, lakesMap) {

        let bigMap = createNoiseMap(90),
            smallMap = createNoiseMap(5),
            humidityMap = new PointMatrix(worldWidth, worldHeight);

        // blend maps
        humidityMap.map(function(x, y) {
            return bigMap.getTile(x, y) / 2 + smallMap.getTile(x, y) / 8;
        });

        let lakes = lakesMap.getFilledTiles(),
            rivers = riversMap.getFilledTiles(),
            water = rivers.concat(lakes),
            maxDistance = worldWidth / 10;

        // rivers/lakes increase humidity and ocean decrease it
        humidityMap.map(function(x, y) {

            let humidity = humidityMap.getTile(x, y),
                distance = water.getClosestDistanceTo(x, y);

            if (distance <= maxDistance) {
                humidity += (1 - (distance / maxDistance)) * WATER_HUMIDITY_FACTOR;
            }

            if (oceanMap.filled(x, y)) {
                humidity -= OCEAN_HUMIDITY_FACTOR;
            }

            return humidity;
        });

        humidityMap = Filters.apply('humidityMap', humidityMap);

        logTimeEvent('Humidity map created');

        return humidityMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @param {PointMatrix} temperatureMap
     * @param {PointMatrix} humidityMap
     * @return {BinaryMatrix}
     */
    let generateForest = function(altitudeMap, temperatureMap, humidityMap) {

        let bigMap = createNoiseMap(25),
            smallMap = createNoiseMap(5),
            forestMap = new BinaryMatrix(worldWidth, worldHeight);

        // blend maps
        forestMap.map(function(x, y) {
            return (bigMap.getTile(x, y) * 2 + smallMap.getTile(x, y) * 0.5) * 0.5;
        });

        return forestMap;

        //forestMap = Filters.apply('forestMap', forestMap);

        return forestMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @param {PointMatrix} temperatureMap
     * @param {PointMatrix} humidityMap
     * @return {BinaryMatrix}
     */
    let generateObjectsMap = function(altitudeMap, temperatureMap, humidityMap) {

        let map = generateForest(altitudeMap, temperatureMap, humidityMap);

        return map;
    };

    /**
     * @param {BinaryMatrix} objectMap
     * @param {number} x
     * @param {number} y
     */
    let displayPixelObject = function(objectMap, x, y) {

        let ctx = miniMapCanvas.getContext('2d');

        ctx.fillText('F', toWorldMapPoint(x), toWorldMapPoint(y) + 20);
    };

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} point
     * @param {Array} RGB
     */
    let fillCanvasPixel = function(data, point, RGB) {
        data[point] = RGB[0];
        data[point + 1] = RGB[1];
        data[point + 2] = RGB[2];
        data[point + 3] = 255; // Alpha
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} altitude
     * @param {number} temperature
     * @param {number} humidity
     * @param {BinaryMatrix} riversMap
     * @param {BinaryMatrix} lakesMap
     * @return {number}
     */
    let findBiomeType = function(x, y, altitude, /*temperature, humidity, riversMap, */lakesMap) {

        /*
        if(riversMap.filled(x, y)) {
            return BIOME_RIVER;
        }
*/
        if(lakesMap.filled(x, y)) {
            return BIOME_LAKE;
        }

        if(altitude < LEVEL_OCEAN) {
            return BIOME_OCEAN;
        }

        if (altitude < LEVEL_COAST) {
            return BIOME_COAST;
        }
//@TODO
        return BIOME_GRASS;
        /**
         * @param {number} value
         * @param {number} levels
         * @return {number}
         */
        let evaluateLevel = function(value, levels) {

            let grad = 1 / levels,
                level = 0;

            for(let i = 1; i <= 4; i++) {
                if (value > i * grad) {
                    ++level;
                }
            }

            return level;
        };

        // @TODO Not working
        let biomeMatrix = [
            [BIOME_TUNDRA, BIOME_SWAMP, BIOME_SAVANNA, BIOME_TROPICS],
            [BIOME_TUNDRA, BIOME_LOWLAND, BIOME_GRASS, BIOME_GRASS],
            [BIOME_TUNDRA, BIOME_LOWLAND, BIOME_GRASS, BIOME_GRASS],
            [BIOME_SNOW, BIOME_LOWLAND, BIOME_GRASS, BIOME_SANDS]
        ];

        let rand = randBetweenFloats(-0.02, 0.02),
            humidityLevel = evaluateLevel(humidity - rand, 4),
            tempLevel = evaluateLevel(temperature + rand, 4);

        return biomeMatrix[humidityLevel][tempLevel];
    };

    let xyCoords;

    /**
     * @param {CanvasRenderingContext2D} context
     * @return {ImageData}
     */
    let renderWorld = function(context) {

        let biome,
            altitudeMap = generateAltitudeMap(),
            oceanMap = getOceanMap(altitudeMap),
            lakesMap = getLakesMap(altitudeMap, oceanMap),
            //riversMap = generateRiversMap(altitudeMap),
            //temperatureMap = generateTemperatureMap(altitudeMap),
            //humidityMap = generateHumidityMap(oceanMap, riversMap, lakesMap),
            //objectsMap = generateObjectsMap(altitudeMap, temperatureMap, humidityMap),
            image = context.createImageData(worldWidth, worldHeight);

        altitudeMap.foreach(function(x, y) {

            biome = new Biome(
                findBiomeType(
                    x,
                    y,
                    altitudeMap.getTile(x, y),
                    //temperatureMap.getTile(x, y),
                    //humidityMap.getTile(x, y),
                    //riversMap,
                    lakesMap
                )
            );

            fillCanvasPixel(
                image.data,
                (x + y * worldWidth) * 4,
                getBiomeColor(biome, altitudeMap.getTile(x, y))
            );

            //displayPixelObject(objectsMap, x, y);
        });

        xyCoords = altitudeMap;

        logTimeEvent('World filled');

        return image;
    };

    /**
     * @param {HTMLElement} wrapper
     */
    this.setMapWrapper = function(wrapper) {
        worldWrapper = wrapper;
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    this.moveMapTo = function(x, y) {

        worldWrapper.scrollLeft = toWorldMapPoint(x) - wrapperWidth;
        worldWrapper.scrollTop = toWorldMapPoint(y) - wrapperHeight;

        Filters.apply('mapMoved', [x, y]);
    };

    /**
     * @param {HTMLElement} cnv
     */
    this.setMiniMap = function(cnv) {

        miniMapCanvas = cnv;
        miniMapCanvas.width = worldWidth;
        miniMapCanvas.height = worldHeight;
        wrapperWidth = (miniMapCanvas.width * worldWrapper.offsetWidth / miniMapCanvas.width) * 0.5;
        wrapperHeight = (miniMapCanvas.height * worldWrapper.offsetHeight / miniMapCanvas.height) * 0.5;

        if (worldWrapper) {

            let _this = this;

            worldWrapper.addEventListener("scroll", function() {
                drawMiniMap();
                Filters.apply('mapMoved', [
                    toMiniMapPoint(worldWrapper.scrollLeft + wrapperWidth),
                    toMiniMapPoint(worldWrapper.scrollTop + wrapperHeight)
                ]);
            });

            miniMapCanvas.addEventListener("click", function(e) {
                let pos = getPosition(miniMapCanvas);
                _this.moveMapTo(e.pageX - pos.x, e.pageY - pos.y);
            });
        }

        logTimeEvent('Mini map initialized');
    };

    /**
     * @param {number} c
     * @return {number}
     */
    let toMiniMapPoint = function(c) {
        return Math.floor(c / WORLD_SCALE);
    };

    /**
     * @param {number} c
     * @return {number}
     */
    let toWorldMapPoint = function(c) {
        return c * WORLD_SCALE;
    };

    let drawMiniMap = function() {
        if (miniMapCanvas && miniMapImage) {

            let ctx = miniMapCanvas.getContext('2d');

            ctx.putImageData(miniMapImage, 0, 0);

            if (worldWrapper) {
                ctx.strokeStyle = '#000000';
                ctx.strokeRect(
                    toMiniMapPoint(worldWrapper.scrollLeft),
                    toMiniMapPoint(worldWrapper.scrollTop),
                    toMiniMapPoint(worldWrapper.offsetWidth),
                    toMiniMapPoint(worldWrapper.offsetHeight)
                );
            }
        }
    };

    /**
     * @return {CanvasRenderingContext2D}
     */
    let drawWorld = function() {

        let context = worldCanvas.getContext('2d'),
            imageData = renderWorld(context);

        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        worldCanvas.width = toWorldMapPoint(worldCanvas.width);
        worldCanvas.height = toWorldMapPoint(worldCanvas.height);

        context.putImageData(
            scaleImageData(context, imageData, WORLD_SCALE),
            0, 0
        );

        logTimeEvent('World drawn');

        miniMapImage = imageData;
        drawMiniMap();

        logTimeEvent('Mini map drawn');

        return context;
    };

    let drawRectangles = function() {

        let context = worldCanvas.getContext('2d');
        context.strokeStyle = 'rgba(0,0,0,0.2)';
        for(let x = 0; x < worldWidth; x++) {
            for(let y = 0; y < worldHeight; y++) {
                context.strokeRect(toWorldMapPoint(x), toWorldMapPoint(y), WORLD_SCALE, WORLD_SCALE);
                context.font = '8px senf';
                context.fillText(x + ',' + y, toWorldMapPoint(x) + 2, toWorldMapPoint(y) + 10);
                //context.font = '10px senf';
                //context.fillText(Math.round(xyCoords.getTile(x, y) * 100) / 100, toWorldMapPoint(x) + 5, toWorldMapPoint(y) + 20);
            }
        }

        logTimeEvent('Rectangles added');
    };

    this.create = function() {
        drawWorld();
        //drawRectangles();
    };
}