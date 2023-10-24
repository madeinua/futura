import Config from "../config.js";
import { logTimeEvent, Filters, fillCanvasPixel, scaleImageData } from "./helpers.js";
import { LAYER_BIOMES, LAYER_FOREST, LAYER_HABITAT, LAYER_ANIMALS, LAYER_FRACTIONS } from "./render/Layer.js";
import SurfaceOperator from "./operators/SurfaceOperator.js";
import WeatherOperator from "./operators/WeatherOperator.js";
import WaterOperator from "./operators/WaterOperator.js";
import HumidityOperator from "./operators/HumidityOperator.js";
import BiomesOperator from "./operators/BiomesOperator.js";
import ForestsOperator from "./operators/ForestsOperator.js";
import AnimalsOperator from "./operators/AnimalsOperator.js";
import FractionsOperator from "./operators/FractionsOperator.js";
import Timer from "./services/Timer.js";
import Layers from "./services/Layers.js";
export default class World {
    constructor(displayMapWrapper, displayMapCanvas, miniMapCanvas, cameraPos) {
        this.generateWorld = function () {
            const surfaceOperator = new SurfaceOperator(), weatherOperator = new WeatherOperator(), waterOperator = new WaterOperator(), humidityOperator = new HumidityOperator(), altitudeMap = surfaceOperator.generateAltitudeMap(), temperatureMap = weatherOperator.generateTemperatureMap(altitudeMap), oceanMap = waterOperator.generateOceanMap(altitudeMap), coastMap = waterOperator.getCoastMap(oceanMap, altitudeMap, temperatureMap), lakesMap = waterOperator.generateLakesMap(altitudeMap, oceanMap), riversMap = waterOperator.generateRiversMap(altitudeMap, lakesMap), freshWaterMap = waterOperator.getFreshWaterMap(lakesMap, riversMap), humidityMap = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);
            const biomesOperator = new BiomesOperator(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, this.layers.getLayer(LAYER_BIOMES));
            const forestsOperator = new ForestsOperator(biomesOperator, this.timer, this.layers.getLayer(LAYER_FOREST));
            new AnimalsOperator(this.layers.getLayer(LAYER_HABITAT), this.layers.getLayer(LAYER_ANIMALS), {
                freshWaterMap: freshWaterMap,
                coastMap: coastMap,
                forestsOperator: forestsOperator,
                biomesOperator: biomesOperator,
                timer: this.timer
            });
            if (Config.LOGS) {
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
                'biomesOperator': biomesOperator,
                'forestOperator': forestsOperator,
            };
        };
        this.moveMapTo = function (point, silent = false) {
            const maxWidth = Config.WORLD_SIZE - Config.VISIBLE_COLS, maxHeight = Config.WORLD_SIZE - Config.VISIBLE_ROWS;
            point[0] = Math.max(0, Math.min(point[0], maxWidth));
            point[1] = Math.max(0, Math.min(point[1], maxHeight));
            this.cameraPosX = point[0];
            this.cameraPosY = point[1];
            this.update();
            if (!silent) {
                Filters.apply('mapMoved', point);
            }
        };
        this.drawDisplayMap = function (afterCallback) {
            const _this = this, ctx = _this.mainMapCanvas.getContext('2d'), image = ctx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);
            for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
                const layer = _this.layers.getLayer(ln);
                layer.foreachValues(function (displayCell, x, y) {
                    if (displayCell !== null) {
                        fillCanvasPixel(image, (x + y * Config.WORLD_SIZE) * 4, displayCell.getMapColor());
                    }
                });
            }
            createImageBitmap(image).then(function (render) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(render, 0, 0, _this.mainMapCanvas.width, _this.mainMapCanvas.height);
                if (typeof afterCallback !== 'undefined') {
                    afterCallback();
                }
            });
        };
        this.drawRectangleAroundMiniMap = function (ctx) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 3;
            ctx.strokeRect(this.cameraPosX * Config.MAIN_MAP_SCALE, this.cameraPosY * Config.MAIN_MAP_SCALE, Config.VISIBLE_COLS * Config.MAIN_MAP_SCALE, Config.VISIBLE_ROWS * Config.MAIN_MAP_SCALE);
        };
        this.drawMiniMap = function () {
            const mainMapCtx = this.mainMapCanvas.getContext('2d'), miniMapCtx = this.miniMapCanvas.getContext('2d'), imageData = mainMapCtx.getImageData(0, 0, this.mainMapCanvas.width, this.mainMapCanvas.height);
            this.miniMapCanvas.width = imageData.width;
            this.miniMapCanvas.height = imageData.height;
            miniMapCtx.putImageData(imageData, 0, 0);
            this.drawRectangleAroundMiniMap(miniMapCtx);
        };
        this.drawRectangles = function () {
            const _this = this, ctx = _this.displayMapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPosX * _this.cellWidth, worldOffsetTop = _this.cameraPosY * _this.cellHeight;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (let x = 0; x < Config.VISIBLE_COLS; x++) {
                for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                    const lx = x * _this.cellWidth + worldOffsetLeft, ly = y * _this.cellHeight + worldOffsetTop;
                    ctx.strokeRect(lx, ly, _this.cellWidth, _this.cellHeight);
                }
            }
        };
        this.drawCoordinates = function () {
            const _this = this, ctx = _this.displayMapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPosX * _this.cellWidth, worldOffsetTop = _this.cameraPosY * _this.cellHeight;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (let x = 0; x < Config.VISIBLE_COLS; x++) {
                for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                    const lx = x * _this.cellWidth + worldOffsetLeft, ly = y * _this.cellHeight + worldOffsetTop;
                    ctx.font = '7px senf';
                    ctx.fillText((_this.cameraPosX + x).toString(), lx + 2, ly + 10);
                    ctx.fillText((_this.cameraPosY + y).toString(), lx + 2, ly + 20);
                }
            }
        };
        this.drawTemperatures = function () {
            const _this = this, ctx = _this.displayMapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPosX * _this.cellWidth, worldOffsetTop = _this.cameraPosY * _this.cellHeight, temperatureMap = this.world.temperatureMap;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (let x = 0; x < Config.VISIBLE_COLS; x++) {
                for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                    const lx = x * _this.cellWidth + worldOffsetLeft, ly = y * _this.cellHeight + worldOffsetTop;
                    ctx.font = '7px senf';
                    ctx.fillText((Math.round(temperatureMap.getCell(_this.cameraPosX + x, _this.cameraPosY + y) * 450) / 10).toString(), lx + 2, ly + 10);
                }
            }
        };
        this.drawBiomesInfo = function () {
            const _this = this, ctx = _this.displayMapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPosX * _this.cellWidth, worldOffsetTop = _this.cameraPosY * _this.cellHeight, biomes = this.world.biomesOperator.getBiomes();
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (let x = 0; x < Config.VISIBLE_COLS; x++) {
                for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                    const lx = x * _this.cellWidth + worldOffsetLeft, ly = y * _this.cellHeight + worldOffsetTop;
                    ctx.font = '7px senf';
                    ctx.fillText(biomes.getCell(_this.cameraPosX + x, _this.cameraPosY + y).getName().substring(6, 12), lx + 2, ly + 10);
                }
            }
        };
        this.isCellVisible = function (x, y) {
            return x >= this.cameraPosX
                && x < this.cameraPosX + Config.VISIBLE_COLS
                && y >= this.cameraPosY
                && y < this.cameraPosY + Config.VISIBLE_ROWS;
        };
        this.drawLayers = function () {
            const _this = this, renderCanvas = document.createElement('canvas');
            renderCanvas.width = Config.WORLD_SIZE;
            renderCanvas.height = Config.WORLD_SIZE;
            const renderCtx = renderCanvas.getContext('2d'), ctx = _this.displayMapCanvas.getContext('2d'), image = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE), ctxImages = [], worldOffsetLeft = this.cameraPosX * _this.cellWidth, worldOffsetTop = this.cameraPosY * _this.cellHeight;
            this.displayMapWrapper.scrollLeft = worldOffsetLeft;
            this.displayMapWrapper.scrollTop = worldOffsetTop;
            let layer;
            for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
                layer = _this.layers.getLayer(ln);
                layer.foreachValues(function (displayCell, x, y) {
                    if (displayCell === null || !_this.isCellVisible(x, y)) {
                        return;
                    }
                    if (displayCell.drawBackground()) {
                        fillCanvasPixel(image, (x + y * Config.WORLD_SIZE) * 4, displayCell.getColor());
                    }
                    if (displayCell.hasImage()) {
                        ctxImages.push([x, y, displayCell.getImage()]);
                    }
                });
            }
            renderCtx.putImageData(image, 0, 0);
            const imageData = renderCtx.getImageData(_this.cameraPosX, _this.cameraPosY, Config.VISIBLE_COLS, Config.VISIBLE_ROWS);
            const scaledData = scaleImageData(ctx, imageData, _this.cellWidth, _this.cellHeight);
            ctx.putImageData(scaledData, worldOffsetLeft, worldOffsetTop);
            for (let i = 0; i < ctxImages.length; i++) {
                if (!_this.isCellVisible(ctxImages[i][0], ctxImages[i][1])) {
                    continue;
                }
                ctx.drawImage(ctxImages[i][2], ctxImages[i][0] * _this.cellWidth, ctxImages[i][1] * _this.cellHeight, _this.cellWidth, _this.cellHeight);
            }
            if (Config.SHOW_RECTANGLES) {
                _this.drawRectangles();
            }
            if (Config.SHOW_COORDINATES) {
                _this.drawCoordinates();
            }
            if (Config.SHOW_TEMPERATURES) {
                _this.drawTemperatures();
            }
            if (Config.SHOW_BIOMES_INFO) {
                _this.drawBiomesInfo();
            }
            _this.drawDisplayMap(function () {
                _this.drawMiniMap();
            });
        };
        this.create = function () {
            const _this = this;
            _this.generateWorld();
            setTimeout(function () {
                _this.update();
            }, 100);
            if (Config.STEPS_ENABLED) {
                _this.timer.stepsTimer(function () {
                    _this.update();
                });
            }
        };
        this.update = function () {
            this.drawLayers();
        };
        this.generateFractions = function () {
            const fractionsOperator = new FractionsOperator(this.timer, this.layers.getLayer(LAYER_FRACTIONS), {
                freshWaterMap: this.world.freshWaterMap,
                temperatureMap: this.world.temperatureMap,
                forestMap: this.world.forestOperator.getForestMap(),
                biomesMap: this.world.biomesOperator.getBiomes(),
            });
            fractionsOperator.createFractions(Config.FRACTIONS.CREATE_COUNT);
            this.update();
        };
        this.cameraPosX = cameraPos[0];
        this.cameraPosY = cameraPos[1];
        if (!Config.RANDOM_WORLD) {
            Math.seedrandom(Config.SEED);
        }
        this.cellWidth = Math.ceil(displayMapWrapper.offsetWidth / Config.VISIBLE_COLS);
        this.cellHeight = Math.ceil(displayMapWrapper.offsetHeight / Config.VISIBLE_ROWS);
        this.mainMapCanvas = new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.mainMapCanvas.width = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;
        this.mainMapCanvas.height = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;
        this.miniMapCanvas = miniMapCanvas;
        this.displayMapWrapper = displayMapWrapper;
        this.displayMapCanvas = displayMapCanvas;
        this.displayMapCanvas.width = this.cellWidth * Config.WORLD_SIZE;
        this.displayMapCanvas.height = this.cellHeight * Config.WORLD_SIZE;
        this.timer = new Timer();
        this.layers = new Layers(Config.WORLD_SIZE, Config.WORLD_SIZE);
        if (Config.STORE_DATA) {
            const worldSize = localStorage.getItem('worldSize'), actualSize = Config.WORLD_SIZE + 'x' + Config.WORLD_SIZE;
            if (actualSize !== worldSize) {
                localStorage.clear();
            }
            localStorage.setItem('worldSize', actualSize);
        }
        if (Config.LOGS) {
            logTimeEvent('Initialized');
        }
    }
}
