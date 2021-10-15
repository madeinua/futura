class World {

    constructor(config, scrollingMapWrapper, scrollingMapCanvas, mainMapCanvas) {

        let cameraPos = getCenteredCameraPosition(config.VISIBLE_COLS);

        config.cameraPosX = cameraPos[0];
        config.cameraPosY = cameraPos[1];

        if (typeof config.cameraPosX === 'undefined') {
            config.cameraPosX = Math.ceil(
                config.WORLD_SIZE / 2 - config.VISIBLE_COLS / 2
            );
        }

        if (typeof config.cameraPosY === 'undefined') {
            config.cameraPosY = Math.ceil(
                config.WORLD_SIZE / 2 - config.VISIBLE_COLS / 2
            );
        }

        this.layers = [];

        this.cellSize = Math.ceil(scrollingMapWrapper.offsetWidth / config.VISIBLE_COLS);
        this.worldScalledSize = this.cellSize * config.WORLD_SIZE;

        this.scrollingMapWrapper = scrollingMapWrapper;
        this.scrollingMapCanvas = scrollingMapCanvas;
        this.scrollingMapCanvas.width = this.worldScalledSize;
        this.scrollingMapCanvas.height = this.worldScalledSize;

        this.cameraPosX = config.cameraPosX;
        this.cameraPosY = config.cameraPosY;

        this.mainMapCanvas = mainMapCanvas;
        this.mainMapCanvas.width = config.WORLD_SIZE * config.MAIN_MAP_SCALE;
        this.mainMapCanvas.height = config.WORLD_SIZE * config.MAIN_MAP_SCALE;

        this.tickHandlers = [];
        this.tickFinalHandlers = [];

        if (config.STORE_DATA) {

            let worldSize = localStorage.getItem('worldSize'),
                actualSize = config.WORLD_SIZE + 'x' + config.WORLD_SIZE;

            if (actualSize !== worldSize) {
                localStorage.clear();
            }

            localStorage.setItem('worldSize', actualSize);
        }

        if (config.LOGS) {
            logTimeEvent('Initialized');
        }
    }

    /**
     * @param {number} level
     * @return {Layer}
     */
    getLayer = function(level) {

        if (typeof this.layers[level] === 'undefined') {
            this.layers[level] = new Layer(config.WORLD_SIZE, config.WORLD_SIZE);
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
     * @param {CallableFunction} callback
     */
    tickTimer = function(callback) {

        if (!config.TICKS_ENABLED || config.TICKS_LIMIT === 0) {
            callback();
            return;
        }

        let _this = this,
            timerStart = Date.now(),
            minTickInterval = config.TICKS_MIN_INTERVAL / config.TICKS_BOOST,
            boosted = false,
            timerInterval;

        if (config.LOGS) {
            logTimeEvent('Start ticks.');
        }

        _this.timerStep = 0;

        let tickerFn = function() {

            if (_this.timerPaused) {
                return;
            }

            for (let i = 0; i < _this.tickHandlers.length; i++) {
                _this.tickHandlers[i](_this.timerStep);
            }

            if (_this.timerStep === config.TICKS_LIMIT) {

                for (let i = 0; i < _this.tickFinalHandlers.length; i++) {
                    _this.tickFinalHandlers[i]();
                }

                if (config.LOGS) {
                    logTimeEvent('Ticks ended. Avg. time per tick: ' + Math.round((Date.now() - timerStart) / config.TICKS_LIMIT) + 'ms');
                }

                clearInterval(timerInterval);
            }

            _this.timerStep++;

            callback();

            if (!boosted && _this.timerStep > config.TICKS_BOOST_STEPS) {
                clearInterval(timerInterval);
                minTickInterval *= config.TICKS_BOOST;
                timerInterval = setInterval(tickerFn, minTickInterval);
                boosted = true;
            }
        };

        timerInterval = setInterval(tickerFn, minTickInterval);
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

        let surfaceOperator = new SurfaceOperator(),
            weatherOperator = new WeatherOperator(),
            waterOperator = new WaterOperator(),
            humidityOperator = new HumidityOperator(),
            altitudeMap = surfaceOperator.generateAltitudeMap(),
            temperatureMap = weatherOperator.generateTemperatureMap(altitudeMap),
            oceanMap = waterOperator.generateOceanMap(altitudeMap),
            coastMap = waterOperator.getCoastMap(oceanMap, altitudeMap, temperatureMap),
            lakesMap = waterOperator.generateLakesMap(altitudeMap, oceanMap),
            riversMap = waterOperator.generateRiversMap(altitudeMap, lakesMap),
            freshWaterMap = waterOperator.getFreshWaterMap(lakesMap, riversMap),
            humidity = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);

        let biomesOperator = new BiomesOperator(
            altitudeMap,
            oceanMap,
            coastMap,
            freshWaterMap,
            temperatureMap,
            humidity,
            this.getLayer(LAYER_BIOMES)
        );

        new ForestsOperator(
            biomesOperator.getBiomes(),
            this.tickHandlers,
            this.getLayer(LAYER_FOREST)
        );

        new AnimalsOperator(
            oceanMap,
            freshWaterMap,
            coastMap,
            this.tickHandlers,
            this.getLayer(LAYER_ANIMALS)
        );

        if (config.LOGS) {
            logTimeEvent('World generated');
        }
    };

    /**
     * @param {number[]} point
     * @param {boolean} silent
     */
    moveMapTo = function(point, silent = false) {

        let max = config.WORLD_SIZE - config.VISIBLE_COLS;

        point[0] = Math.max(0, Math.min(point[0], max));
        point[1] = Math.max(0, Math.min(point[1], max));

        this.cameraPosX = point[0];
        this.cameraPosY = point[1];

        this.update();

        if (!silent) {
            Filters.apply('mapMoved', point);
        }
    };

    drawMainMap = function() {

        let _this = this,
            ctx = _this.mainMapCanvas.getContext('2d'),
            layer,
            displayCell,
            image = ctx.createImageData(config.WORLD_SIZE, config.WORLD_SIZE),
            mainMapSize = config.WORLD_SIZE * config.MAIN_MAP_SCALE,
            cameraPosX = this.cameraPosX,
            cameraPosY = this.cameraPosY;

        for (let ln = 0; ln < _this.getLayersCount(); ln++) {
            layer = _this.getLayer(ln);
            layer.foreach(function(x, y) {

                displayCell = layer.getTile(x, y);

                if (displayCell === null) {
                    return;
                }

                fillCanvasPixel(
                    image,
                    (x + y * config.WORLD_SIZE) * 4,
                    displayCell.getColor()
                );
            });
        }

        createImageBitmap(image).then(function(render) {

            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(render, 0, 0, mainMapSize, mainMapSize);

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                cameraPosX * config.MAIN_MAP_SCALE,
                cameraPosY * config.MAIN_MAP_SCALE,
                config.VISIBLE_COLS * config.MAIN_MAP_SCALE,
                config.VISIBLE_COLS * config.MAIN_MAP_SCALE
            );

            return ctx;
        });
    };

    drawRectangles = function() {

        let _this = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            x, y, lx, ly,
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (x = 0; x < config.VISIBLE_COLS; x++) {
            for (y = 0; y < config.VISIBLE_COLS; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.strokeRect(lx, ly, _this.cellSize, _this.cellSize);

                if (config.SHOW_COORDINATES) {
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
            && x <= this.cameraPosX + config.VISIBLE_COLS
            && y >= this.cameraPosY
            && y <= this.cameraPosY + config.VISIBLE_COLS;
    };

    redrawWorld = function() {

        let _this = this,
            renderCanvas = document.createElement('canvas');

        renderCanvas.width = config.WORLD_SIZE;
        renderCanvas.height = config.WORLD_SIZE;

        let renderCtx = renderCanvas.getContext('2d'),
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            image = renderCtx.createImageData(config.WORLD_SIZE, config.WORLD_SIZE),
            ctxImages = [],
            layer,
            tile,
            worldOffsetLeft = this.cameraPosX * _this.cellSize,
            worldOffsetTop = this.cameraPosY * _this.cellSize;

        this.scrollingMapWrapper.scrollLeft = worldOffsetLeft;
        this.scrollingMapWrapper.scrollTop = worldOffsetTop;

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
                    (x + y * config.WORLD_SIZE) * 4,
                    tile.getColor()
                );
            });
        }

        renderCtx.putImageData(image, 0, 0);

        let imageData = renderCtx.getImageData(
            _this.cameraPosX,
            _this.cameraPosY,
            config.VISIBLE_COLS,
            config.VISIBLE_COLS
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
        _this.drawMainMap();
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