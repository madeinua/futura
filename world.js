class World {

    constructor(config) {

        if (typeof config.worldCanvas === 'undefined') {
            console.error('World Canvas not defined');
        }

        if (typeof config.worldWrapper === 'undefined') {
            console.error('World Wrapper not defined');
        }

        if (typeof config.worldWidth === 'undefined') {
            config.worldWidth = 100;
        }

        if (typeof config.worldHeight === 'undefined') {
            config.worldHeight = 100;
        }

        if (typeof config.WORLD_SCALE === 'undefined') {
            config.WORLD_SCALE = 33;
        }

        config.worldCanvas.width = config.worldWidth;
        config.worldCanvas.height = config.worldHeight;

        this.worldWidth = config.worldWidth;
        this.worldHeight = config.worldHeight;
        this.worldCanvas = config.worldCanvas;
        this.worldWrapper = config.worldWrapper;

        this.config = config;

        if (typeof config.miniMapCanvas !== 'undefined') {
            this.setMiniMap(config);
        }

        logTimeEvent('Initialized');
    }

    /**
     * @return {AltitudeMap}
     */
    generateAltitudeMap = function() {

        let altitudeMap = new AltitudeMap(this.config);

        altitudeMap = Filters.apply('altitudeMap', altitudeMap);

        logTimeEvent('Altitude map generated');

        return altitudeMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {OceanMap}
     */
    generateOceanMap = function(altitudeMap) {

        let oceanMap = new OceanMap(altitudeMap, this.config);

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

        let beachesMap = new BeachesMap(altitudeMap, oceanMap, this.config);

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

        let lakesMap = new LakesMap(altitudeMap, oceanMap, this.config);

        lakesMap = Filters.apply('lakesMap', lakesMap);

        logTimeEvent('Lakes map calculated');

        return lakesMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {RiversMap}
     */
    generateRiversMap = function(altitudeMap) {

        let riversMap = new RiversMap(altitudeMap, this.config);

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

        let humidityMap = new HumidityMap(altitudeMap, beachesMap, riversMap, lakesMap, this.config);

        humidityMap = Filters.apply('humidityMap', humidityMap);

        logTimeEvent('Humidity map created');

        return humidityMap;
    };

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {TemperatureMap}
     */
    generateTemperatureMap = function(altitudeMap) {

        let temperatureMap = new TemperatureMap(altitudeMap, this.config);

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

        let forestMap = new ForestMap(altitudeMap, temperatureMap, humidityMap, this.config);

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

        ctx.fillText('F', _this.toWorldMapPoint(x), _this.toWorldMapPoint(y) + 20);
    };

    /**
     * @param {Uint8ClampedArray} data
     * @param {number} point
     * @param {Array} RGB
     */
    fillCanvasPixel = function(data, point, RGB) {
        data[point] = RGB[0];
        data[point + 1] = RGB[1];
        data[point + 2] = RGB[2];
        data[point + 3] = 255; // Alpha
    };

    /**
     * @param {CanvasRenderingContext2D} context
     * @return {ImageData}
     */
    renderWorld = function(context) {

        let _this = this,
            altitudeMap = _this.generateAltitudeMap(),
            oceanMap = _this.generateOceanMap(altitudeMap),
            beachesMap = _this.generateBeachesMap(altitudeMap, oceanMap),
            lakesMap = _this.generateLakesMap(altitudeMap, oceanMap),
            riversMap = _this.generateRiversMap(altitudeMap),
            humidityMap = _this.generateHumidityMap(altitudeMap, beachesMap, riversMap, lakesMap),
            temperatureMap = _this.generateTemperatureMap(altitudeMap),
            //objectsMap = generateObjectsMap(altitudeMap, temperatureMap, humidityMap),
            image = context.createImageData(_this.worldWidth, _this.worldHeight),
            biomes = new Biomes(altitudeMap, oceanMap, beachesMap, lakesMap, riversMap, humidityMap, temperatureMap);

        altitudeMap.foreach(function(x, y) {

            _this.fillCanvasPixel(
                image.data,
                (x + y * _this.worldWidth) * 4,
                biomes.getBiomeColor(
                    biomes.findBiome(x, y),
                    altitudeMap.getTile(x, y),
                    temperatureMap.getTile(x, y),
                    humidityMap.getTile(x, y)
                )
            );

            //displayPixelObject(objectsMap, x, y);
        });

        _this.xyCoords = altitudeMap;

        logTimeEvent('World filled');

        return image;
    };

    /**
     * @param {number} x
     * @param {number} y
     */
    moveMapTo = function(x, y) {

        let _this = this;
        
        this.worldWrapper.scrollLeft = _this.toWorldMapPoint(x) - _this.miniMapWrapperWidth;
        this.worldWrapper.scrollTop = _this.toWorldMapPoint(y) - _this.miniMapWrapperHeight;

        Filters.apply('mapMoved', [x, y]);
    };

    /**
     * @param {number} c
     * @return {number}
     */
    toMiniMapPoint = function(c) {
        return Math.floor(c / this.config.WORLD_SCALE);
    };

    /**
     * @param {number} c
     * @return {number}
     */
    toWorldMapPoint = function(c) {
        return c * this.config.WORLD_SCALE;
    };

    drawMiniMap = function() {

        let _this = this;

        if (_this.miniMapCanvas && _this.miniMapImage) {

            let ctx = _this.miniMapCanvas.getContext('2d');

            ctx.putImageData(_this.miniMapImage, 0, 0);

            if (_this.worldWrapper) {
                ctx.strokeStyle = '#000000';
                ctx.strokeRect(
                    _this.toMiniMapPoint(_this.worldWrapper.scrollLeft),
                    _this.toMiniMapPoint(_this.worldWrapper.scrollTop),
                    _this.toMiniMapPoint(_this.worldWrapper.offsetWidth),
                    _this.toMiniMapPoint(_this.worldWrapper.offsetHeight)
                );
            }
        }
    };

    /**
     * @return {ImageData}
     */
    drawWorld = function() {

        let _this = this,
            context = _this.worldCanvas.getContext('2d'),
            imageData = _this.renderWorld(context);

        context.webkitImageSmoothingEnabled = false;
        context.mozImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        _this.worldCanvas.width = _this.toWorldMapPoint(_this.worldCanvas.width);
        _this.worldCanvas.height = _this.toWorldMapPoint(_this.worldCanvas.height);

        context.putImageData(
            scaleImageData(context, imageData, this.config.WORLD_SCALE),
            0, 0
        );

        _this.miniMapImage = imageData;

        logTimeEvent('World drawn');

        return imageData;
    };

    drawRectangles = function() {

        let _this = this,
            context = _this.worldCanvas.getContext('2d');

        context.strokeStyle = 'rgba(0,0,0,0.2)';

        for(let x = 0; x < _this.worldWidth; x++) {
            for(let y = 0; y < _this.worldHeight; y++) {
                context.strokeRect(_this.toWorldMapPoint(x), _this.toWorldMapPoint(y), this.config.WORLD_SCALE, this.config.WORLD_SCALE);
                context.font = '8px senf';
                context.fillText(x + ',' + y, _this.toWorldMapPoint(x) + 2, _this.toWorldMapPoint(y) + 10);
                //context.font = '10px senf';
                //context.fillText(Math.round(_this.xyCoords.getTile(x, y) * 100) / 100, _this.toWorldMapPoint(x) + 5, _this.toWorldMapPoint(y) + 20);
            }
        }

        logTimeEvent('Rectangles added');
    };

    /**
     * @param {Object} config
     */
    setMiniMap = function(config) {

        let _this = this;

        _this.miniMapCanvas = config.miniMapCanvas;
        _this.miniMapCanvas.width = config.worldWidth;
        _this.miniMapCanvas.height = config.worldHeight;
        _this.miniMapWrapperWidth = (_this.miniMapCanvas.width * config.worldWrapper.offsetWidth / _this.miniMapCanvas.width) * 0.5;
        _this.miniMapWrapperHeight = (_this.miniMapCanvas.height * config.worldWrapper.offsetHeight / _this.miniMapCanvas.height) * 0.5;

        if (_this.worldWrapper) {

            _this.worldWrapper.addEventListener("scroll", function() {
                _this.drawMiniMap();
                Filters.apply('mapMoved', [
                    _this.toMiniMapPoint(_this.worldWrapper.scrollLeft + _this.miniMapWrapperWidth),
                    _this.toMiniMapPoint(_this.worldWrapper.scrollTop + _this.miniMapWrapperHeight)
                ]);
            });

            _this.miniMapCanvas.addEventListener("click", function(e) {
                let pos = getPosition(_this.miniMapCanvas);
                _this.moveMapTo(e.pageX - pos.x, e.pageY - pos.y);
            });
        }
    };

    create = function() {

        let _this = this;

        _this.drawWorld();
        //_this.drawRectangles();
        _this.drawMiniMap();
    };
}