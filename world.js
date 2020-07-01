class World {

    constructor(config) {

        if (typeof config.worldCanvas === 'undefined') {
            console.error('World Canvas not defined');
        }

        if (typeof config.storeData === 'undefined') {
            config.storeData = true;
        }

        if (typeof config.cameraPosX === 'undefined') {
            config.cameraPosX = Math.ceil(
                config.worldSize / 2 - config.visibleCols / 2
            );
        }

        if (typeof config.cameraPosY === 'undefined') {
            config.cameraPosY = Math.ceil(
                config.worldSize / 2 - config.visibleCols / 2
            );
        }

        this.config = config;
        this.logs = true;

        this.worldCanvas = config.worldCanvas;
        this.worldCanvas.width = this.worldCanvas.offsetWidth;
        this.worldCanvas.height = this.worldCanvas.offsetHeight;

        this.cellSize = Math.ceil(this.worldCanvas.width / config.visibleCols);

        this.cameraPosX = config.cameraPosX;
        this.cameraPosY = config.cameraPosY;

        this.renderCanvas = document.createElement('canvas');
        this.renderCanvas.width = config.worldSize;
        this.renderCanvas.height = config.worldSize;

        if (typeof config.miniMapCanvas !== 'undefined') {
            this.setMiniMap(config);
        }

        if (config.storeData) {

            let worldSize = localStorage.getItem('worldSize'),
                actualSize = this.config.worldSize + 'x' + this.config.worldSize;

            if (actualSize !== worldSize) {
                localStorage.clear();
            }

            localStorage.setItem('worldSize', actualSize);
        }

        if (this.logs) {
            logTimeEvent('Initialized');
        }
    }

    /**
     * @param {Object} config
     */
    setMiniMap = function(config) {
        this.miniMapCanvas = config.miniMapCanvas;
        this.miniMapCanvas.width = config.worldSize;
        this.miniMapCanvas.height = config.worldSize;
    };

    /**
     * @return {AltitudeMap}
     */
    generateAltitudeMap = function() {

        let altitudeMap = new AltitudeMap(this.config),
            storage = this.config.storeData ? localStorage.getItem('altitudeMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            altitudeMap.fromString(storage);
        } else {

            altitudeMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('altitudeMap', altitudeMap.toString());
            }
        }

        altitudeMap = Filters.apply('altitudeMap', altitudeMap);

        if (this.logs) {
            logTimeEvent('Altitude map generated. Min: ' + altitudeMap.getMin() + ' Max: ' + altitudeMap.getMax() + ' Avg: ' + altitudeMap.getAvgValue());
        }

        return altitudeMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {OceanMap}
     */
    generateOceanMap = function(altitudeMap) {

        let oceanMap = new OceanMap(altitudeMap, this.config),
            storage = this.config.storeData ? localStorage.getItem('oceanMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            oceanMap.fromString(storage);
        } else {

            oceanMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('oceanMap', oceanMap.toString());
            }
        }

        oceanMap = Filters.apply('oceanMap', oceanMap);

        if (this.logs) {
            logTimeEvent('Ocean map calculated. Size: ' + oceanMap.getSize() + '%');
        }

        return oceanMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @return {LakesMap}
     */
    generateLakesMap = function(altitudeMap, oceanMap) {

        let lakesMap = new LakesMap(altitudeMap, oceanMap, this.config),
            storage = this.config.storeData ? localStorage.getItem('lakesMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            lakesMap.fromString(storage);
        } else {

            lakesMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('lakesMap', lakesMap.toString());
            }
        }

        lakesMap = Filters.apply('lakesMap', lakesMap);

        if (this.logs) {
            logTimeEvent('Lakes map calculated. Size: ' + lakesMap.getSize() + '%');
        }

        return lakesMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {LakesMap} lakesMap
     * @return {RiversMap}
     */
    generateRiversMap = function(altitudeMap, lakesMap) {

        let riversMap = new RiversMap(altitudeMap, lakesMap, this.config),
            storage = this.config.storeData ? localStorage.getItem('riversMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            riversMap.fromString(storage);
        } else {

            riversMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('riversMap', riversMap.toString());
            }
        }

        riversMap = Filters.apply('riversMap', riversMap);

        if (this.logs) {
            logTimeEvent('Rivers generated. Length: ' + riversMap.getFilledTiles().length);
        }

        return riversMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @return {HumidityMap}
     */
    generateHumidityMap = function(altitudeMap, riversMap, lakesMap) {

        let humidityMap = new HumidityMap(altitudeMap, riversMap, lakesMap, this.config),
            storage = this.config.storeData ? localStorage.getItem('humidityMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            humidityMap.fromString(storage);
        } else {

            humidityMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('humidityMap', humidityMap.toString());
            }
        }

        humidityMap = Filters.apply('humidityMap', humidityMap);

        if (this.logs) {
            logTimeEvent('Humidity map created. Min: ' + humidityMap.getMin() + ' Max: ' + humidityMap.getMax() + ' Avg: ' + humidityMap.getAvgValue());
        }

        return humidityMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {TemperatureMap}
     */
    generateTemperatureMap = function(altitudeMap) {

        let temperatureMap = new TemperatureMap(altitudeMap, this.config),
            storage = this.config.storeData ? localStorage.getItem('temperatureMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            temperatureMap.fromString(storage);
        } else {

            temperatureMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('temperatureMap', temperatureMap.toString());
            }
        }

        temperatureMap = Filters.apply('temperatureMap', temperatureMap);

        if (this.logs) {
            logTimeEvent('Temperature map created. Min: ' + temperatureMap.getMin() + ' Max: ' + temperatureMap.getMax() + ' Avg.: ' + temperatureMap.getAvgValue());
        }

        return temperatureMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @return {Matrix}
     */
    generateBiomes = function(altitudeMap, oceanMap, riversMap, lakesMap, temperatureMap, humidityMap) {

        let biomes = new Matrix(altitudeMap.getWidth(), altitudeMap.getHeight()),
            biomesGenerator = new Biomes(
                altitudeMap,
                oceanMap,
                riversMap,
                lakesMap,
                temperatureMap,
                humidityMap,
                this.config
            );

        altitudeMap.foreach(function(x, y) {
            biomes.setTile(x, y, biomesGenerator.getBiome(x, y));
        });

        if (this.logs) {
            logTimeEvent('Biomes calculated');
        }

        biomes = Filters.apply('biomes', biomes);

        return biomes;
    };

    /**
     * @param {Matrix} biomes
     * @return {ForestMap}
     */
    generateForest = function(biomes) {

        let _this = this,
            forestMap = new ForestMap(biomes, this.config),
            storage = this.config.storeData ? localStorage.getItem('forestMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            forestMap.fromString(storage);
        } else {

            forestMap.init();

            this.tick(function() {

                forestMap.tickGeneration();
                forestMap = Filters.apply('forestMap', forestMap);

            }, 30, 100, function() {

                if (_this.config.storeData) {
                    localStorage.setItem('forestMap', forestMap.toString());
                }

            });
        }

        forestMap = Filters.apply('forestMap', forestMap);

        return forestMap;
    };

    /**
     * @param {Function} func
     * @param {number} sleep
     * @param {number} iterations
     * @param {Function} finishFunc
     */
    tick = function(func, sleep, iterations, finishFunc) {
        let step = 0,
            ite = setInterval(function() {

                func();

                if (++step === iterations) {
                    finishFunc();
                    clearInterval(ite);
                }

            }, sleep);
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @return {BinaryMatrix}
     */
    generateObjectsMap = function(altitudeMap, temperatureMap, humidityMap) {
        return new BinaryMatrix(this.config.width, this.config.height);
    };

    /**
     * @param {BinaryMatrix} objectMap
     * @param {number} x
     * @param {number} y
     */
    displayPixelObject = function(objectMap, x, y) {

        let _this = this,
            ctx = this.miniMapCanvas.getContext('2d');

        //ctx.fillText('F', _this.toWorldMapPoint(x), _this.toWorldMapPoint(y) + 20);
    };

    /**
     * @return {ImageData}
     */
    generateWorld = function() {

        let _this = this,
            altitudeMap = _this.generateAltitudeMap(),
            oceanMap = _this.generateOceanMap(altitudeMap),
            lakesMap = _this.generateLakesMap(altitudeMap, oceanMap),
            riversMap = _this.generateRiversMap(altitudeMap, lakesMap),
            humidityMap = _this.generateHumidityMap(altitudeMap, riversMap, lakesMap),
            temperatureMap = _this.generateTemperatureMap(altitudeMap),
            biomes = _this.generateBiomes(altitudeMap, oceanMap, riversMap, lakesMap, temperatureMap, humidityMap),
            ctx = _this.renderCanvas.getContext('2d'),
            image = ctx.createImageData(_this.config.worldSize, _this.config.worldSize);

        altitudeMap.foreach(function(x, y) {

            fillCanvasPixel(
                image.data,
                (x + y * _this.config.worldSize) * 4,
                biomes.getTile(x, y).getHexColor()
            );

            //displayPixelObject(objectsMap, x, y);
        });

        let forestMap = _this.generateForest(biomes);

        _this.xyCoords = altitudeMap;
        _this.worldImageData = image;

        if (this.logs) {
            logTimeEvent('World filled');
        }
    };

    /**
     * @param {number[]} point
     */
    moveMapTo = function(point) {

        let max = this.config.worldSize - this.config.visibleCols;

        point[0] = Math.max(0, Math.min(point[0], max));
        point[1] = Math.max(0, Math.min(point[1], max));

        this.cameraPosX = point[0];
        this.cameraPosY = point[1];

        this.update();

        Filters.apply('mapMoved', point);
    };

    drawMiniMap = function() {

        let _this = this;

        if (_this.miniMapCanvas && _this.worldImageData) {

            let ctx = _this.miniMapCanvas.getContext('2d');

            ctx.putImageData(_this.worldImageData, 0, 0);

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                _this.cameraPosX,
                _this.cameraPosY,
                _this.config.visibleCols,
                _this.config.visibleCols
            );
        }
    };

    drawWorld = function() {

        let _this = this;

        if (_this.worldImageData) {

            let ctx = _this.worldCanvas.getContext('2d');

            ctx.imageSmoothingEnabled = false;
            ctx.putImageData(_this.worldImageData, 0, 0);

            let imageData = ctx.getImageData(
                _this.cameraPosX,
                _this.cameraPosY,
                _this.config.visibleCols,
                _this.config.visibleCols
            );

            let scaledData = scaleImageData(ctx, imageData, _this.cellSize);

            ctx.putImageData(scaledData, 0, 0);

            if (this.logs) {
                logTimeEvent('World drawn');
            }
        }
    };

    drawRectangles = function() {

        let _this = this,
            ctx = _this.worldCanvas.getContext('2d'),
            x, y;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (x = 0; x < _this.config.visibleCols; x++) {
            for (y = 0; y < _this.config.visibleCols; y++) {

                ctx.strokeRect(
                    x * _this.cellSize,
                    y * _this.cellSize,
                    _this.cellSize,
                    _this.cellSize
                );

                if (_this.config.showCoordinates) {
                    ctx.font = '10px senf';
                    ctx.fillText((_this.cameraPosX + x).toString(), x * _this.cellSize + 2, y * _this.cellSize + 10);
                    ctx.fillText((_this.cameraPosY + y).toString(), x * _this.cellSize + 2, y * _this.cellSize + 21);
                }
            }
        }

        if (this.logs) {
            logTimeEvent('Rectangles added');
        }
    };

    create = function() {

        this.generateWorld();
        this.drawMiniMap();
        this.drawWorld();
        this.drawRectangles();

        this.logs = false;
    };

    update = function() {
        this.drawMiniMap();
        this.drawWorld();
        this.drawRectangles();
    };
}