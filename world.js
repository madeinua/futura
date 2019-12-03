class World {

    constructor(config) {

        if (typeof config.worldCanvas === 'undefined') {
            console.error('World Canvas not defined');
        }

        if (typeof config.worldWidth === 'undefined') {
            config.worldWidth = 100;
        }

        if (typeof config.worldHeight === 'undefined') {
            config.worldHeight = 100;
        }

        if (typeof config.visibleCols === 'undefined') {
            config.visibleCols = 10;
        }

        if (typeof config.visibleRows === 'undefined') {
            config.visibleRows = 10;
        }

        if (typeof config.storeData === 'undefined') {
            config.storeData = true;
        }

        if (typeof config.defaultCameraPosX === 'undefined') {
            config.defaultCameraPosX = Math.ceil(config.worldWidth / 2 - config.visibleCols / 2);
        }

        if (typeof config.defaultCameraPosY === 'undefined') {
            config.defaultCameraPosY = Math.ceil(config.worldHeight / 2 - config.visibleRows / 2);
        }

        this.config = config;

        this.worldCanvas = config.worldCanvas;

        this.worldCanvas.width = this.worldCanvas.offsetWidth;
        this.worldCanvas.height = this.worldCanvas.offsetHeight;

        this.cameraPosX = config.defaultCameraPosX;
        this.cameraPosY = config.defaultCameraPosY;

        this.renderCanvas = document.createElement('canvas');
        this.renderCanvas.width = config.worldWidth;
        this.renderCanvas.height = config.worldHeight;

        if (typeof config.miniMapCanvas !== 'undefined') {
            this.setMiniMap(config);
        }

        if (config.storeData) {

            let worldSize = localStorage.getItem('worldSize'),
                actualSize = this.config.worldWidth + 'x' + this.config.worldHeight;

            if (actualSize !== worldSize) {
                localStorage.clear();
            }

            localStorage.setItem('worldSize', actualSize);
        }

        logTimeEvent('Initialized');
    }

    /**
     * @param {Object} config
     */
    setMiniMap = function(config) {

        let _this = this;

        _this.miniMapCanvas = config.miniMapCanvas;
        _this.miniMapCanvas.width = config.worldWidth;
        _this.miniMapCanvas.height = config.worldHeight;
        _this.miniMapScaleFX = config.worldWidth / _this.miniMapCanvas.offsetWidth;
        _this.miniMapScaleFY = config.worldHeight / _this.miniMapCanvas.offsetHeight;

        _this.miniMapCanvas.addEventListener("click", function(e) {

            let pos = getPosition(_this.miniMapCanvas);

            _this.moveMapTo(e.pageX - pos.x, e.pageY - pos.y);
        });
    };

    /**
     * @return {AltitudeMap}
     */
    generateAltitudeMap = function() {

        let altitudeMap = new AltitudeMap(this.config),
            storage = localStorage.getItem('altitudeMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            altitudeMap.fromString(storage);
        } else {

            altitudeMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('altitudeMap', altitudeMap.toString());
            }
        }

        altitudeMap = Filters.apply('altitudeMap', altitudeMap);

        logTimeEvent('Altitude map generated');

        return altitudeMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {OceanMap}
     */
    generateOceanMap = function(altitudeMap) {

        let oceanMap = new OceanMap(altitudeMap, this.config),
            storage = localStorage.getItem('oceanMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            oceanMap.fromString(storage);
        } else {

            oceanMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('oceanMap', oceanMap.toString());
            }
        }

        oceanMap = Filters.apply('oceanMap', oceanMap);

        logTimeEvent('Ocean map calculated');

        return oceanMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @return {BeachesMap}
     */
    generateBeachesMap = function(altitudeMap, oceanMap) {

        let beachesMap = new BeachesMap(altitudeMap, oceanMap, this.config),
            storage = localStorage.getItem('beachesMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            beachesMap.fromString(storage);
        } else {

            beachesMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('beachesMap', beachesMap.toString());
            }
        }

        beachesMap = Filters.apply('beachesMap', beachesMap);

        logTimeEvent('Beaches map calculated');

        return beachesMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @return {LakesMap}
     */
    generateLakesMap = function(altitudeMap, oceanMap) {

        let lakesMap = new LakesMap(altitudeMap, oceanMap, this.config),
            storage = localStorage.getItem('lakesMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            lakesMap.fromString(storage);
        } else {

            lakesMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('lakesMap', lakesMap.toString());
            }
        }

        lakesMap = Filters.apply('lakesMap', lakesMap);

        logTimeEvent('Lakes map calculated');

        return lakesMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {RiversMap}
     */
    generateRiversMap = function(altitudeMap) {

        let riversMap = new RiversMap(altitudeMap, this.config),
            storage = localStorage.getItem('riversMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            riversMap.fromString(storage);
        } else {

            riversMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('riversMap', riversMap.toString());
            }
        }

        riversMap = Filters.apply('riversMap', riversMap);

        logTimeEvent('Rivers generated');

        return riversMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {BeachesMap} beachesMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @return {HumidityMap}
     */
    generateHumidityMap = function(altitudeMap, beachesMap, riversMap, lakesMap) {

        let humidityMap = new HumidityMap(altitudeMap, beachesMap, riversMap, lakesMap, this.config),
            storage = localStorage.getItem('humidityMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            humidityMap.fromString(storage);
        } else {

            humidityMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('humidityMap', humidityMap.toString());
            }
        }

        humidityMap = Filters.apply('humidityMap', humidityMap);

        logTimeEvent('Humidity map created');

        return humidityMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {TemperatureMap}
     */
    generateTemperatureMap = function(altitudeMap) {

        let temperatureMap = new TemperatureMap(altitudeMap, this.config),
            storage = localStorage.getItem('temperatureMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            temperatureMap.fromString(storage);
        } else {

            temperatureMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('temperatureMap', temperatureMap.toString());
            }
        }

        temperatureMap = Filters.apply('temperatureMap', temperatureMap);

        logTimeEvent('Temperature map created');

        return temperatureMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @return {ForestMap}
     */
    generateForest = function(altitudeMap, temperatureMap, humidityMap) {

        let forestMap = new ForestMap(altitudeMap, temperatureMap, humidityMap, this.config),
            storage = localStorage.getItem('forestMap');

        if (typeof storage !== 'undefined' && storage !== null) {
            forestMap.fromString(storage);
        } else {

            forestMap.generateMap();

            if (this.config.storeData) {
                localStorage.setItem('forestMap', forestMap.toString());
            }
        }

        forestMap = Filters.apply('forestMap', forestMap);

        return forestMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @return {BinaryMatrix}
     */
    generateObjectsMap = function(altitudeMap, temperatureMap, humidityMap) {

        let map = this.generateForest(altitudeMap, temperatureMap, humidityMap);

        return map;
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
            beachesMap = _this.generateBeachesMap(altitudeMap, oceanMap),
            lakesMap = _this.generateLakesMap(altitudeMap, oceanMap),
            riversMap = _this.generateRiversMap(altitudeMap),
            humidityMap = _this.generateHumidityMap(altitudeMap, beachesMap, riversMap, lakesMap),
            temperatureMap = _this.generateTemperatureMap(altitudeMap);

        let ctx = _this.renderCanvas.getContext('2d');

        let
            //objectsMap = generateObjectsMap(altitudeMap, temperatureMap, humidityMap),
            image = ctx.createImageData(_this.config.worldWidth, _this.config.worldHeight),
            biomes = new Biomes(altitudeMap, oceanMap, beachesMap, lakesMap, riversMap, humidityMap, temperatureMap),
            color;

        altitudeMap.foreach(function(x, y) {

            color = biomes.getBiomeColor(
                biomes.findBiome(x, y),
                altitudeMap.getTile(x, y),
                temperatureMap.getTile(x, y),
                humidityMap.getTile(x, y)
            );

            fillCanvasPixel(
                image.data,
                (x + y * _this.config.worldWidth) * 4,
                color
            );

            //displayPixelObject(objectsMap, x, y);
        });

        _this.xyCoords = altitudeMap;
        _this.worldImageData = image;

        logTimeEvent('World filled');
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    moveMapTo = function(x, y) {

        let point = this.centeredPointToCameraPoint(
            this.miniMapPointToRenderPoint([x, y])
        );

        this.cameraPosX = point[0];
        this.cameraPosY = point[1];

        this.update();

        Filters.apply('mapMoved', [x, y]);
    };

    /**
     * @param {[number, number]} point
     * @return {[number, number]}
     */
    miniMapPointToRenderPoint = function(point) {
        return [
            Math.floor(point[0] * this.miniMapScaleFX),
            Math.floor(point[1] * this.miniMapScaleFY)
        ];
    };

    /**
     * @param {[number, number]} point
     * @return {[number, number]}
     */
    centeredPointToCameraPoint = function(point) {
        return [
            Math.max(0, point[0] - Math.floor(this.config.visibleCols / 2)),
            Math.max(0, point[1] - Math.floor(this.config.visibleRows / 2))
        ];
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
                _this.config.visibleRows
            );
        }
    };

    drawWorld = function() {

        let _this = this;

        if (_this.worldImageData) {

            let ctx = _this.worldCanvas.getContext('2d');

            ctx.imageSmoothingEnabled = false;
            ctx.putImageData(_this.worldImageData, 0, 0);

            let scaledData = scaleImageData(
                ctx,
                ctx.getImageData(_this.cameraPosX, _this.cameraPosY, _this.config.visibleCols, _this.config.visibleRows),
                _this.config.visibleCols,
                _this.config.visibleRows
            );

            ctx.putImageData(scaledData, 0, 0);

            logTimeEvent('World drawn');
        }
    };

    drawRectangles = function() {

        let _this = this,
            ctx = _this.worldCanvas.getContext('2d'),
            x, y;

        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.imageSmoothingEnabled = false;

        for(x = 0; x < _this.renderCanvas.width; x++) {
            for(y = 0; y < _this.renderCanvas.height; y++) {
                ctx.strokeRect(
                    x * _this.config.visibleCols,
                    y * _this.config.visibleRows,
                    _this.config.visibleCols,
                    _this.config.visibleRows
                );
            }
        }

        logTimeEvent('Rectangles added');
    };

    create = function() {
        this.generateWorld();
        this.drawMiniMap();
        this.drawWorld();
        this.drawRectangles();
    };

    update = function() {
        this.drawMiniMap();
        this.drawWorld();
    };
}