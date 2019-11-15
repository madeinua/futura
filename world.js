let WORLD_SCALE = 33, // times
    WORLD_MAP_OCEAN_LEVEL = 0.5; // [0-1]

let LEVEL_OCEAN = 0.2,
    LEVEL_COAST = 0.3,
    LEVEL_BEACH = 0.32,
    LEVEL_LAND = 0.4,
    LEVEL_HILLS = 0.6;

let ALTITUDE_TEMPERATURE_FACTOR = 0.7; // [0-1]

let BIOME_OCEAN = 0,
    BIOME_COAST = 1,
    BIOME_RIVER = 2,
    BIOME_LAKE = 3,

    BIOME_BEACH = 10,

    BOIME_DESERT = 20,
    BOIME_GRASSLAND = 21,
    BIOME_SAVANNA = 22,
    BIOME_TROPICS = 23,
    BIOME_FOREST = 24,
    BIOME_TAIGA = 25,
    BIOME_TUNDRA = 26,
    BIOME_SWAMP = 27;

let RIVERS_DENSITY = 0.5, // [0-1]
    RIVER_SOURCE_MIN_ALTITUDE = 0.5,
    RIVER_SOURCE_MAX_ALTITUDE = 0.9,
    RIVERS_CLOSENESS = 3,
    RIVER_MIN_LENGTH = 5,
    RIVER_DELTA_MAX_LENGTH = 0.25; // [0-1] 1 = 100% of length

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
 * @param {number} temperature
 * @param {number} humidity
 * @return {array}
 */
function getBiomeColor(biome, altitude, temperature, humidity) {

    let colors = [];

    colors[BIOME_OCEAN] = '#003eb2';
    colors[BIOME_COAST] = '#0952c6';

    colors[BIOME_BEACH] = LightenDarkenColor('#c2b281', temperature * 60 - 30);

    colors[BIOME_TUNDRA] = '#867645';
    colors[BIOME_SAVANNA] = '#82AF00';
    colors[BIOME_TROPICS] = '#50AA00';
    colors[BIOME_RIVER] = '#0952c6';
    colors[BIOME_LAKE] = '#007bbf';

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
            gradient = delta * delta - 0.2;

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
     * @return {Array}
     */
    let getOceanAndBeachesMap = function(altitudeMap) {

        let oceanMap = new BinaryMatrix(worldWidth, worldHeight),
            beachesMap = new BinaryMatrix(worldWidth, worldHeight);

        if (!isWater(altitudeMap.getTile(0, 0))) {
            return [oceanMap, beachesMap];
        }

        let activePoints = [],
            point;

        oceanMap.fill(0, 0);
        activePoints.push([0, 0]);

        while(activePoints.length) {

            point = activePoints.pop();

            altitudeMap.foreachNeighbors(point[0], point[1], 3, function(x, y) {

                let altitude = altitudeMap.getTile(x, y);

                if (isWater(altitude)) {
                    if (!oceanMap.filled(x, y)) {
                        oceanMap.fill(x, y);
                        activePoints.push([x, y]);
                    }
                } else if (LEVEL_BEACH > altitude) {
                    beachesMap.fill(x, y);
                }
            });
        }

        oceanMap = Filters.apply('oceanMap', oceanMap);
        beachesMap = Filters.apply('beachesMap', beachesMap);

        logTimeEvent('Ocean, coast, beaches maps calculated');

        return [oceanMap, beachesMap];
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

        logTimeEvent('Lakes map calculated');

        return lakesMap;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {Array} riverPoints
     * @return {boolean}
     */
    let isTooCloseToRivers = function(x, y, riverPoints) {
        return RIVERS_CLOSENESS >= riverPoints.getClosestDistanceTo(x, y);
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

            if (
                isGround(altitude)
                && altitude >= RIVER_SOURCE_MIN_ALTITUDE
                && RIVER_SOURCE_MAX_ALTITUDE >= altitude
            ) {
                spawns.push([x, y]);
            }
        });

        spawns = spawns.shuffle();

        for(let i = 0; i < spawns.length; i++) {
            if (!isTooCloseToRivers(spawns[i][0], spawns[i][1], riverSources)) {
                riverSources.push(spawns[i]);
            }
        }

        let map = new BinaryMatrix(worldWidth, worldHeight);

        for(let j = 0; j < riverSources.length; j++) {
            map.fill(riverSources[j][0], riverSources[j][1]);
        }

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
            prevPoint = river.length > 1 ? river[river.length - 2] : false,
            cx = currentPoint[0],
            cy = currentPoint[1],
            currentAltitude = altitudeMap.getTile(cx, cy),
            neighbors = altitudeMap.getNeighbors(cx, cy, 2).shuffle(),
            lowerPoint = [];

        for(let i = 0; i < neighbors.length; i++) {

            let nx = neighbors[i][0],
                ny = neighbors[i][1],
                altitude = altitudeMap.getTile(nx, ny);

            if (altitude > currentAltitude) {
                continue;
            }

            // prevent river being too close to the other river
            if (isTooCloseToRivers(nx, ny, otherRiverPoints)) {
                continue;
            }

            // prevent river being "too wide"
            if (prevPoint && distance(nx, ny, prevPoint[0], prevPoint[1]) === 1) {
                continue;
            }

            lowerPoint = [nx, ny];
            break;
        }

        return lowerPoint;
    };

    /**
     * Add river delta
     *
     * @param {BinaryMatrix} riversMap
     * @param {Array} river
     * @return {BinaryMatrix}
     */
    let addRiverDeltaToRiverMap = function(riversMap, river) {

        let deltaLength = river.length * randBetweenFloats(0, RIVER_DELTA_MAX_LENGTH),
            notDeltaLength = river.length - deltaLength;

        for(let p = 0; p < river.length; p++) {
            if (p > notDeltaLength) {
                riversMap.foreachNeighbors(river[p][0], river[p][1], 0, function(nx, ny) {
                    if ([0, 1].randomElement() === 0) {
                        riversMap.fill(nx, ny);
                    }
                });
            }
        }

        return riversMap;
    };

    /**
     * @param {Array} rivers
     * @return {BinaryMatrix}
     */
    let createRiverMapFromRiversPoints = function(rivers) {

        let riversMap = new BinaryMatrix(worldWidth, worldHeight);

        for(let i = 0; i < rivers.length; i++) {

            for(let p = 0; p < rivers[i].length; p++) {
                riversMap.fill(rivers[i][p][0], rivers[i][p][1]);
            }

            riversMap = addRiverDeltaToRiverMap(riversMap, rivers[i]);
        }

        return riversMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @return {BinaryMatrix}
     */
    let generateRiversMap = function(altitudeMap) {

        let riverSources = getRiverSources(altitudeMap),
            rivers = [],
            allRiversPoints = [],
            riversLimit = Math.floor(tval(RIVERS_DENSITY, 1, riverSources.length));

        for(let i = 0; i < riverSources.length; i++) {

            let river = [],
                finished = false;

            // source = starting point of each river
            river.push(riverSources[i]);

            // max river length = worldWidth
            for(let j = 0; j < worldWidth; j++) {

                let nextRiverPoint = getRiverDirection(river, altitudeMap, allRiversPoints);

                if (!nextRiverPoint.length) {
                    break;
                }

                // lake/ocean found. means river ending point found.
                if (isWater(altitudeMap.getTile(nextRiverPoint[0], nextRiverPoint[1]))) {
                    finished = true;
                    break;
                }

                river.push(nextRiverPoint);
            }

            if (finished && river.length >= RIVER_MIN_LENGTH) {
                rivers.push(river);
                allRiversPoints = allRiversPoints.concat(river);
                allRiversPoints.unique();
            }

            if (rivers.length === riversLimit) {
                break;
            }
        }

        let riversMap = createRiverMapFromRiversPoints(rivers);

        riversMap = Filters.apply('riversMap', riversMap);

        logTimeEvent('Rivers generated');

        return riversMap;
    };

    /**
     * @param {PointMatrix} altitudeMap
     * @param {BinaryMatrix} beachesMap
     * @param {BinaryMatrix} riversMap
     * @param {BinaryMatrix} lakesMap
     * @return {PointMatrix}
     */
    let generateHumidityMap = function(altitudeMap, beachesMap, riversMap, lakesMap) {

        let humidityMap = createNoiseMap(90);

        // higher altitude = lower humidity
        humidityMap.map(function(x, y) {
            return humidityMap.getTile(x, y) - 0.25 + altitudeMap.getTile(x, y) * 0.5;
        });

        let lakes = lakesMap.getFilledTiles().makeStep(5), // divider by 5 to increase performance
            rivers = riversMap.getFilledTiles(),
            water = rivers.concat(lakes),
            beaches = beachesMap.getFilledTiles(),
            maxDistance = worldWidth / 10;

        // rivers/lakes increase humidity
        humidityMap.map(function(x, y) {

            let distance = water.getClosestDistanceTo(x, y),
                md = Math.sqrt(maxDistance);

            return humidityMap.getTile(x, y) + 0.1 + tval(distance / Math.max(distance, md), -0.2, 0.1);
        });

        // ocean decrease humidity
        humidityMap.map(function(x, y) {

            let distance = beaches.getClosestDistanceTo(x, y);

            return humidityMap.getTile(x, y) - 0.2 + tval(distance / Math.max(distance, maxDistance), 0, 0.4);
        });

        humidityMap = Filters.apply('humidityMap', humidityMap);

        logTimeEvent('Humidity map created');

        return humidityMap;
    };

    /**
     * @return {PointMatrix}
     */
    let generateTemperatureMap = function(altitudeMap) {

        let temperatureMap = new PointMatrix(worldWidth, worldHeight);

        let gradient = [],
            revFactor = (1 - ALTITUDE_TEMPERATURE_FACTOR) * 10;

        for(let i = 0; i < worldHeight; i++) {
            gradient[i] = i / worldHeight;
        }

        temperatureMap.map(function(x, y) {
            return (altitudeMap.getTile(x, y) + gradient[y] * revFactor) / revFactor;
        });

        temperatureMap = Filters.apply('temperatureMap', temperatureMap);

        logTimeEvent('Temperature map created');

        return temperatureMap;
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
     * @param {BinaryMatrix} oceanMap
     * @param {BinaryMatrix} riversMap
     * @param {BinaryMatrix} lakesMap
     * @return {number}
     */
    let findBiomeType = function(x, y, altitude, temperature, humidity, oceanMap, riversMap, lakesMap) {

        if (oceanMap.filled(x, y)) {
            return altitude > LEVEL_OCEAN ? BIOME_COAST : BIOME_OCEAN;
        }

        if (riversMap.filled(x, y)) {
            return BIOME_RIVER;
        }

        if (lakesMap.filled(x, y)) {
            return BIOME_LAKE;
        }

        if (LEVEL_BEACH > altitude && 3 > oceanMap.getAll().getClosestDistanceTo(x, y)) {
            return BIOME_BEACH;
        }

        return BIOME_FOREST; // @TODO
    };

    let xyCoords;

    /**
     * @param {CanvasRenderingContext2D} context
     * @return {ImageData}
     */
    let renderWorld = function(context) {

        let biome,
            altitudeMap = generateAltitudeMap(),
            oceanAndBeachesMaps = getOceanAndBeachesMap(altitudeMap),
            oceanMap = oceanAndBeachesMaps[0],
            beachesMap = oceanAndBeachesMaps[1],
            lakesMap = getLakesMap(altitudeMap, oceanMap),
            riversMap = generateRiversMap(altitudeMap),
            humidityMap = generateHumidityMap(altitudeMap, beachesMap, riversMap, lakesMap),
            temperatureMap = generateTemperatureMap(altitudeMap),
            //objectsMap = generateObjectsMap(altitudeMap, temperatureMap, humidityMap),
            image = context.createImageData(worldWidth, worldHeight);

        altitudeMap.foreach(function(x, y) {

            biome = new Biome(
                findBiomeType(
                    x,
                    y,
                    altitudeMap.getTile(x, y),
                    temperatureMap.getTile(x, y),
                    humidityMap.getTile(x, y),
                    oceanMap,
                    riversMap,
                    lakesMap
                )
            );

            fillCanvasPixel(
                image.data,
                (x + y * worldWidth) * 4,
                getBiomeColor(
                    biome,
                    altitudeMap.getTile(x, y),
                    temperatureMap.getTile(x, y),
                    humidityMap.getTile(x, y)
                )
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
        logTimeEvent('Initialized');
        drawWorld();
        //drawRectangles();
    };
}