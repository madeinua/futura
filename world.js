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

        this.logs = config.logs;

        this.layers = [];

        this.cellSize = Math.ceil(config.worldWrapper.offsetWidth / config.visibleCols);
        this.worldScalledSize = this.cellSize * config.worldSize;

        this.worldWrapper = config.worldWrapper;
        this.worldCanvas = config.worldCanvas;
        this.worldCanvas.width = this.worldScalledSize;
        this.worldCanvas.height = this.worldScalledSize;

        this.cameraPosX = config.cameraPosX;
        this.cameraPosY = config.cameraPosY;

        if (typeof config.miniMapCanvas !== 'undefined') {
            this.setMiniMap(config);
        }

        this.tickHandlers = [];
        this.tickFinalHandlers = [];

        if (config.storeData) {

            let worldSize = localStorage.getItem('worldSize'),
                actualSize = config.worldSize + 'x' + config.worldSize;

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
     * @param {number} level
     * @return {Layer}
     */
    getLayer = function(level) {

        if (typeof this.layers[level] === 'undefined') {
            this.layers[level] = new Layer(config.worldSize, config.worldSize);
        }

        return this.layers[level];
    };

    /**
     * @return {number}
     */
    getLayersCount = function() {
        return this.layers.length;
    }

    /**
     * @return {AltitudeMap}
     */
    generateAltitudeMap = function() {

        let altitudeMap = new AltitudeMap(),
            storage = config.storeData ? localStorage.getItem('altitudeMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            altitudeMap.fromString(storage);
        } else {

            altitudeMap.generateMap();

            if (config.storeData) {
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

        let oceanMap = new OceanMap(altitudeMap),
            storage = config.storeData ? localStorage.getItem('oceanMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            oceanMap.fromString(storage);
        } else {

            oceanMap.generateMap();

            if (config.storeData) {
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
     * @param {OceanMap} oceanMap
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @return {BinaryMatrix}
     */
    getCoastMap = function(oceanMap, altitudeMap, temperatureMap) {

        let coastMap = new CoastMap(oceanMap, altitudeMap, temperatureMap),
            storage = config.storeData ? localStorage.getItem('coastMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            coastMap.fromString(storage);
        } else {

            coastMap.generateMap();

            if (config.storeData) {
                localStorage.setItem('coastMap', coastMap.toString());
            }
        }

        coastMap = Filters.apply('coastMap', coastMap);

        if (this.logs) {
            logTimeEvent('Coast map calculated.');
        }

        return coastMap;
    }

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @return {LakesMap}
     */
    generateLakesMap = function(altitudeMap, oceanMap) {

        let lakesMap = new LakesMap(altitudeMap, oceanMap),
            storage = config.storeData ? localStorage.getItem('lakesMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            lakesMap.fromString(storage);
        } else {

            lakesMap.generateMap();

            if (config.storeData) {
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

        let riversMap = new RiversMap(altitudeMap, lakesMap),
            storage = config.storeData ? localStorage.getItem('riversMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            riversMap.fromString(storage);
        } else {

            riversMap.generateMap();

            if (config.storeData) {
                localStorage.setItem('riversMap', riversMap.toString());
            }
        }

        riversMap = Filters.apply('riversMap', riversMap);

        if (this.logs) {
            logTimeEvent('Rivers generated. Rivers: ' + riversMap.getGeneratedRiversCount());
        }

        return riversMap;
    };

    /**
     * @param {LakesMap} lakesMap
     * @param {RiversMap} riversMap
     * @return {BinaryMatrix}
     */
    getFreshWaterMap = function(lakesMap, riversMap) {

        let freshWaterMap = new BinaryMatrix(config.worldSize, config.worldSize);

        freshWaterMap.combineWith(lakesMap);
        freshWaterMap.combineWith(riversMap);

        return freshWaterMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @return {HumidityMap}
     */
    generateHumidityMap = function(altitudeMap, riversMap, lakesMap) {

        let humidityMap = new HumidityMap(altitudeMap, riversMap, lakesMap),
            storage = config.storeData ? localStorage.getItem('humidityMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            humidityMap.fromString(storage);
        } else {

            humidityMap.generateMap();

            if (config.storeData) {
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

        let temperatureMap = new TemperatureMap(altitudeMap),
            storage = config.storeData ? localStorage.getItem('temperatureMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            temperatureMap.fromString(storage);
        } else {

            temperatureMap.generateMap();

            if (config.storeData) {
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
     * @param {CallableFunction} callback
     */
    tickTimer = function(callback) {

        let _this = this;

        if (_this.logs) {
            logTimeEvent('Start ticks.');
        }

        _this.timerStep = 0;

        let ite = setInterval(function() {

            if (_this.timerPaused) {
                return;
            }

            for (let i = 0; i < _this.tickHandlers.length; i++) {
                _this.tickHandlers[i](_this.timerStep);
            }

            if (config.ticksCount > 0 && _this.timerStep === config.ticksCount) {

                for (let i = 0; i < _this.tickFinalHandlers.length; i++) {
                    _this.tickFinalHandlers[i]();
                }

                if (_this.logs) {
                    logTimeEvent('Ticks ended. Avg. time per tick: ' + Math.round(getTimeForEvent() / config.ticksCount) + 'ms');
                }

                clearInterval(ite);
            }

            _this.timerStep++;

            callback();

        }, config.tickInterval);
    };

    /**
     * @return {boolean}
     */
    isTimerPaused = function() {
        return this.timerPaused;
    }

    /**
     * @return {boolean}
     */
    pauseTimer = function() {

        if (this.isTimerPaused()) {
            return false;
        }

        this.timerPaused = true;

        return true;
    };

    /**
     * @return {boolean}
     */
    unpauseTimer = function() {

        if (!this.isTimerPaused()) {
            return false;
        }

        this.timerPaused = false;

        return true;
    };

    /**
     * @return {ImageData}
     */
    generateWorld = function() {

        let _this = this,
            altitudeMap = _this.generateAltitudeMap(),
            temperatureMap = _this.generateTemperatureMap(altitudeMap),
            oceanMap = _this.generateOceanMap(altitudeMap),
            coastMap = _this.getCoastMap(oceanMap, altitudeMap, temperatureMap),
            lakesMap = _this.generateLakesMap(altitudeMap, oceanMap),
            riversMap = _this.generateRiversMap(altitudeMap, lakesMap),
            freshWaterMap = _this.getFreshWaterMap(lakesMap, riversMap),
            humidityMap = _this.generateHumidityMap(altitudeMap, riversMap, lakesMap),
            biomesOperator = new BiomesOperator(),
            forestsOperator = new ForestsOperator(),
            animalsOperator = new AnimalsOperator();

        biomesOperator.initBiomesGeneration(
            altitudeMap,
            oceanMap,
            coastMap,
            freshWaterMap,
            temperatureMap,
            humidityMap,
            this.getLayer(LAYER_BIOMES)
        );

        forestsOperator.initForestGeneration(
            biomesOperator.getBiomes(),
            this.tickHandlers,
            this.getLayer(LAYER_FOREST)
        );

        animalsOperator.initAnimalsGeneration(
            oceanMap,
            freshWaterMap,
            coastMap,
            this.tickHandlers,
            this.getLayer(LAYER_ANIMALS)
        );

        if (this.logs) {
            logTimeEvent('World generated');
        }
    };

    /**
     * @param {number[]} point
     * @param {boolean} silent
     */
    moveMapTo = function(point, silent = false) {

        let max = config.worldSize - config.visibleCols;

        point[0] = Math.max(0, Math.min(point[0], max));
        point[1] = Math.max(0, Math.min(point[1], max));

        this.cameraPosX = point[0];
        this.cameraPosY = point[1];

        this.update();

        if (!silent) {
            Filters.apply('mapMoved', point);
        }
    };

    drawMiniMap = function() {

        let _this = this,
            ctx = _this.miniMapCanvas.getContext('2d'),
            image = ctx.createImageData(config.worldSize, config.worldSize),
            layer,
            displayCell;

        for (let ln = 0; ln < _this.getLayersCount(); ln++) {

            layer = _this.getLayer(ln);

            layer.foreach(function(x, y) {

                displayCell = layer.getTile(x, y);

                if (displayCell === null) {
                    return;
                }

                fillCanvasPixel(
                    image,
                    (x + y * config.worldSize) * 4,
                    displayCell.getColor()
                );
            });
        }

        ctx.imageSmoothingEnabled = false;
        ctx.putImageData(image, 0, 0);

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.cameraPosX,
            this.cameraPosY,
            config.visibleCols,
            config.visibleCols
        );
    };

    drawRectangles = function() {

        let _this = this,
            ctx = _this.worldCanvas.getContext('2d'),
            x, y, lx, ly,
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (x = 0; x < config.visibleCols; x++) {
            for (y = 0; y < config.visibleCols; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.strokeRect(lx, ly, _this.cellSize, _this.cellSize);

                if (config.showCoordinates) {
                    ctx.font = '7px senf';
                    ctx.fillText((_this.cameraPosX + x).toString(), lx + 2, ly + 10);
                    ctx.fillText((_this.cameraPosY + y).toString(), lx + 2, ly + 20);
                }
            }
        }
    };

    /**
     * @param {number} x
     * @param {number} y
     * @return {boolean}
     */
    isTileVisible = function(x, y) {
        return x >= this.cameraPosX
            && x <= this.cameraPosX + config.visibleCols
            && y >= this.cameraPosY
            && y <= this.cameraPosY + config.visibleCols;
    };

    redrawWorld = function() {

        let _this = this,
            renderCanvas = document.createElement('canvas');

        renderCanvas.width = config.worldSize;
        renderCanvas.height = config.worldSize;

        let renderCtx = renderCanvas.getContext('2d'),
            ctx = _this.worldCanvas.getContext('2d'),
            image = renderCtx.createImageData(config.worldSize, config.worldSize),
            ctxImages = [],
            layer,
            tile,
            worldOffsetLeft = this.cameraPosX * _this.cellSize,
            worldOffsetTop = this.cameraPosY * _this.cellSize;

        this.worldWrapper.scrollLeft = worldOffsetLeft;
        this.worldWrapper.scrollTop = worldOffsetTop;

        for (let ln = 0; ln < _this.getLayersCount(); ln++) {

            layer = _this.getLayer(ln);

            layer.foreach(function(x, y) {

                if (!_this.isTileVisible(x, y)) {
                    return;
                }

                tile = layer.getTile(x, y);

                if (tile === null) {
                    return;
                }

                if (tile.hasImage()) {
                    ctxImages.push([x, y, tile.getImage()]);
                    return;
                }

                fillCanvasPixel(
                    image,
                    (x + y * config.worldSize) * 4,
                    tile.getColor()
                );
            });
        }

        renderCtx.putImageData(image, 0, 0);

        let imageData = renderCtx.getImageData(
            _this.cameraPosX,
            _this.cameraPosY,
            config.visibleCols,
            config.visibleCols
        );

        let scaledData = scaleImageData(ctx, imageData, _this.cellSize);

        ctx.putImageData(scaledData, worldOffsetLeft, worldOffsetTop);

        for (let i = 0; i < ctxImages.length; i++) {

            if (!_this.isTileVisible(ctxImages[i][0], ctxImages[i][1])) {
                continue;
            }

            ctx.drawImage(
                ctxImages[i][2],
                ctxImages[i][0] * _this.cellSize,
                ctxImages[i][1] * _this.cellSize,
                _this.cellSize,
                _this.cellSize
            );
        }

        _this.drawRectangles();

        if (_this.miniMapCanvas) {
            _this.drawMiniMap();
        }
    };

    create = function() {

        let _this = this;

        _this.generateWorld();

        _this.tickTimer(function() {
            _this.update();
        });
    };

    update = function() {
        this.redrawWorld();
    };
}