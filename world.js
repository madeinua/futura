class World {

    world;

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

        if (!config.RANDOM_WORLD) {
            Math.seedrandom(config.SEED);
        }

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

        this.timer = new Timer();
        this.layers = new Layers();

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
            humidityMap = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);

        let biomesOperator = new BiomesOperator(
            altitudeMap,
            oceanMap,
            coastMap,
            freshWaterMap,
            temperatureMap,
            humidityMap,
            this.layers.getLayer(LAYER_BIOMES)
        );

        let forestsOperator = new ForestsOperator(
            biomesOperator,
            this.timer,
            this.layers.getLayer(LAYER_FOREST)
        );

        new AnimalsOperator(
            this.timer,
            this.layers.getLayer(LAYER_HABITAT),
            this.layers.getLayer(LAYER_ANIMALS),
            {
                freshWaterMap: freshWaterMap,
                coastMap: coastMap,
                forestsOperator: forestsOperator,
                biomesOperator: biomesOperator
            }
        );

        if (config.LOGS) {
            logTimeEvent('World generated');
        }

        this.world = {
            'altitudeMap': altitudeMap,
            'temperatureMap': temperatureMap,
            'oceanMap': oceanMap,
            'coastMap': coastMap,
            'lakesMap': lakesMap,
            'riversMap': riversMap,
            'freshWaterMap': freshWaterMap,
            'humidityMap': humidityMap,
            'biomes': biomesOperator.getBiomes()
        };
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

        for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
            layer = _this.layers.getLayer(ln);
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
            }
        }
    };

    drawCoordinates = function() {

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

                ctx.font = '7px senf';
                ctx.fillText((_this.cameraPosX + x).toString(), lx + 2, ly + 10);
                ctx.fillText((_this.cameraPosY + y).toString(), lx + 2, ly + 20);
            }
        }
    }

    drawTemperatures = function() {

        let _this = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            x, y, lx, ly,
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize,
            temperatureMap = this.world.temperatureMap;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (x = 0; x < config.VISIBLE_COLS; x++) {
            for (y = 0; y < config.VISIBLE_COLS; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText((Math.round(temperatureMap.getTile(_this.cameraPosX + x, _this.cameraPosY + y) * 450) / 10).toString(), lx + 2, ly + 10);
            }
        }
    }

    drawBiomesInfo = function() {

        let _this = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            x, y, lx, ly,
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize,
            biomes = this.world.biomes;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (x = 0; x < config.VISIBLE_COLS; x++) {
            for (y = 0; y < config.VISIBLE_COLS; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText(biomes.getTile(_this.cameraPosX + x, _this.cameraPosY + y).getName().substring(0, 6), lx + 2, ly + 10);
            }
        }
    }

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

    drawLayers = function() {
        
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

        for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
            layer = _this.layers.getLayer(ln);

            layer.foreach(function(x, y) {

                if (!_this.isTileVisible(x, y)) {
                    return;
                }

                tile = layer.getTile(x, y);

                if (tile === null) {
                    return;
                }

                if (tile.drawBackground()) {
                    fillCanvasPixel(
                        image,
                        (x + y * config.WORLD_SIZE) * 4,
                        tile.getColor()
                    );
                }

                if (tile.hasImage()) {
                    ctxImages.push([x, y, tile.getImage()]);
                }
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

        if (config.SHOW_RECTANGLES) {
            _this.drawRectangles();
        }

        if (config.SHOW_COORDINATES) {
            _this.drawCoordinates();
        }

        if (config.SHOW_TEMPERATURES) {
            _this.drawTemperatures();
        }

        if (config.SHOW_BIOMES_INFO) {
            _this.drawBiomesInfo();
        }

        _this.drawMainMap();
    };

    create = function() {

        let _this = this;

        _this.generateWorld();

        setTimeout(function() {
            _this.update();
        }, 100);

        if (config.STEPS_ENABLED) {
            _this.timer.stepsTimer(function() {
                _this.update();
            });
        }
    };

    update = function() {
        this.drawLayers();
    };
}