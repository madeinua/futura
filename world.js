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
     * @param {number} level
     * @return {Layer}
     */
    getLayer = function(level) {

        if (typeof this.layers[level] === 'undefined') {
            this.layers[level] = new Layer(this.config.worldSize, this.config.worldSize);
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
            logTimeEvent('Rivers generated. Rivers: ' + riversMap.getGeneratedRiversCount());
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

        let biomes = new Matrix(this.config.worldSize, this.config.worldSize),
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
     * @param {ForestMap} forestMap
     */
    addForestMapToLayer = function(forestMap) {

        let forestLayer = this.getLayer(LAYER_FOREST),
            colors = ['#2a6410', '#3c6219', '#3c5626'];

        forestMap.foreach(function(x, y) {
            forestLayer.setTile(
                x, y,
                forestMap.filled(x, y)
                    ? hexToRgb(colors.randomElement())
                    : null
            );
        });
    };

    /**
     * @param {Matrix} biomes
     * @return {Array}
     */
    initForestGeneration = function(biomes) {

        let _this = this,
            forestMap = new ForestMap(biomes, _this.config),
            storage = _this.config.storeData ? localStorage.getItem('forestMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            forestMap.fromString(storage);
            _this.addForestMapToLayer(forestMap);
            forestMap = Filters.apply('forestMap', forestMap);
        } else {

            forestMap.init();

            _this.tickHandlers.push(function() {

                forestMap.generate();

                _this.addForestMapToLayer(forestMap);

                forestMap = Filters.apply('forestMap', forestMap);
            });

            if (_this.config.storeData) {
                this.tickFinalHandlers.push(function() {
                    localStorage.setItem('forestMap', forestMap.toString());
                });
            }
        }

        return forestMap;
    };

    /**
     * @param {CallableFunction} callback
     */
    tickTimer = function(callback) {

        if (this.logs) {
            logTimeEvent('Start ticks.');
        }

        let _this = this,
            step = 0,
            ite = setInterval(function() {

                for (let i = 0; i < _this.tickHandlers.length; i++) {
                    _this.tickHandlers[i]();
                }

                if (++step === _this.config.ticksCount) {

                    for (let i = 0; i < _this.tickFinalHandlers.length; i++) {
                        _this.tickFinalHandlers[i]();
                    }

                    if (_this.logs) {
                        logTimeEvent('Ticks ended.');
                    }

                    clearInterval(ite);
                }

                callback();

            }, _this.config.tickInterval);
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
            mainLayer = _this.getLayer(LAYER_BIOMES);

        biomes.foreach(function(x, y) {
            mainLayer.setTile(
                x, y,
                biomes.getTile(x, y).getHexColor()
            );
        });

        _this.initForestGeneration(biomes);

        if (this.logs) {
            logTimeEvent('World generated');
        }
    };

    /**
     * @param {number[]} point
     * @param {boolean} silent
     */
    moveMapTo = function(point, silent = false) {

        let max = this.config.worldSize - this.config.visibleCols;

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
            image = ctx.createImageData(_this.config.worldSize, _this.config.worldSize),
            layer,
            tile;

        for (let ln = 0; ln < _this.getLayersCount(); ln++) {

            layer = _this.getLayer(ln);

            layer.foreach(function(x, y) {

                tile = layer.getTile(x, y);

                if (!tile) {
                    return;
                }

                fillCanvasPixel(
                    image,
                    (x + y * _this.config.worldSize) * 4,
                    tile
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
            this.config.visibleCols,
            this.config.visibleCols
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

        for (x = 0; x < _this.config.visibleCols; x++) {
            for (y = 0; y < _this.config.visibleCols; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.strokeRect(lx, ly, _this.cellSize, _this.cellSize);

                if (_this.config.showCoordinates) {
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
            && x <= this.cameraPosX + this.config.visibleCols
            && y >= this.cameraPosY
            && y <= this.cameraPosY + this.config.visibleCols;
    };

    redrawWorld = function() {

        let _this = this,
            renderCanvas = document.createElement('canvas');

        renderCanvas.width = _this.config.worldSize;
        renderCanvas.height = _this.config.worldSize;

        let renderCtx = renderCanvas.getContext('2d'),
            ctx = _this.worldCanvas.getContext('2d'),
            image = renderCtx.createImageData(_this.config.worldSize, _this.config.worldSize),
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

                if (!tile) {
                    return;
                }

                fillCanvasPixel(
                    image,
                    (x + y * _this.config.worldSize) * 4,
                    tile
                );
            });
        }

        renderCtx.putImageData(image, 0, 0);

        let imageData = renderCtx.getImageData(
            _this.cameraPosX,
            _this.cameraPosY,
            _this.config.visibleCols,
            _this.config.visibleCols
        );

        let scaledData = scaleImageData(ctx, imageData, _this.cellSize);

        ctx.putImageData(scaledData, worldOffsetLeft, worldOffsetTop);

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