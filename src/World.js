import Config from "../config.js";
import { logTimeEvent, Filters, fillCanvasPixel, scaleImageData } from "./helpers.js";
import SurfaceOperator from "./operators/SurfaceOperator.js";
import WeatherOperator from "./operators/WeatherOperator.js";
import WaterOperator from "./operators/WaterOperator.js";
import HumidityOperator from "./operators/HumidityOperator.js";
import BiomesOperator from "./operators/BiomesOperator.js";
import ForestsOperator from "./operators/ForestsOperator.js";
import AnimalsOperator from "./operators/AnimalsOperator.js";
import FractionsOperator from "./operators/FractionsOperator.js";
import Timer from "./services/Timer.js";
import Layers, { LAYER_ANIMALS, LAYER_BIOMES, LAYER_FOREST, LAYER_FRACTIONS, LAYER_HABITAT } from "./services/Layers.js";
export default class World {
    constructor(displayMapWrapper, displayMapCanvas, miniMapCanvas, cameraPos) {
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
        this.update = function () {
            const _this = this, renderCanvas = document.createElement('canvas');
            renderCanvas.width = Config.WORLD_SIZE;
            renderCanvas.height = Config.WORLD_SIZE;
            const renderCtx = renderCanvas.getContext('2d'), ctxDisplayMap = _this.displayMapCanvas.getContext('2d'), ctxDisplayMapImages = [], worldOffsetLeft = this.cameraPosX * _this.cellWidth, worldOffsetTop = this.cameraPosY * _this.cellHeight, imageData = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);
            _this.displayMapWrapper.scrollLeft = worldOffsetLeft;
            _this.displayMapWrapper.scrollTop = worldOffsetTop;
            for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
                _this
                    .layers
                    .getLayer(ln)
                    .foreachValues(function (displayCell, x, y) {
                    if (displayCell === null || !_this.isCellVisible(x, y)) {
                        return;
                    }
                    if (displayCell.drawBackground()) {
                        fillCanvasPixel(imageData, (x + y * Config.WORLD_SIZE) * 4, displayCell.getColor());
                    }
                    if (displayCell.hasImage()) {
                        ctxDisplayMapImages.push([x, y, displayCell.getImage()]);
                    }
                });
            }
            renderCtx.putImageData(imageData, 0, 0);
            const imageData2 = renderCtx.getImageData(_this.cameraPosX, _this.cameraPosY, Config.VISIBLE_COLS, Config.VISIBLE_ROWS);
            const scaledData = scaleImageData(ctxDisplayMap, imageData2, _this.cellWidth, _this.cellHeight);
            ctxDisplayMap.putImageData(scaledData, worldOffsetLeft, worldOffsetTop);
            for (let i = 0; i < ctxDisplayMapImages.length; i++) {
                if (!_this.isCellVisible(ctxDisplayMapImages[i][0], ctxDisplayMapImages[i][1])) {
                    continue;
                }
                ctxDisplayMap.drawImage(ctxDisplayMapImages[i][2], ctxDisplayMapImages[i][0] * _this.cellWidth, ctxDisplayMapImages[i][1] * _this.cellHeight, _this.cellWidth, _this.cellHeight);
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
            _this.drawMiniMap(imageData);
        };
        this.isCellVisible = function (x, y) {
            return x >= this.cameraPosX
                && x < this.cameraPosX + Config.VISIBLE_COLS
                && y >= this.cameraPosY
                && y < this.cameraPosY + Config.VISIBLE_ROWS;
        };
        this.drawMiniMap = function (imageData) {
            const _this = this;
            for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
                _this
                    .layers
                    .getLayer(ln)
                    .foreachValues(function (displayCell, x, y) {
                    if (displayCell !== null) {
                        fillCanvasPixel(imageData, (x + y * Config.WORLD_SIZE) * 4, displayCell.getMapColor());
                    }
                });
            }
            createImageBitmap(imageData).then(function () {
                const miniMapCtx = _this.miniMapCanvas.getContext('2d');
                miniMapCtx.putImageData(imageData, 0, 0);
                _this.drawRectangleAroundMiniMap(miniMapCtx);
            });
        };
        this.drawRectangleAroundMiniMap = function (ctx) {
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.cameraPosX, this.cameraPosY, Config.VISIBLE_COLS, Config.VISIBLE_ROWS);
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
        this.moveMapTo = function (point, silent = false) {
            const _this = this, maxWidth = Config.WORLD_SIZE - Config.VISIBLE_COLS, maxHeight = Config.WORLD_SIZE - Config.VISIBLE_ROWS;
            point[0] = Math.max(0, Math.min(point[0], maxWidth));
            point[1] = Math.max(0, Math.min(point[1], maxHeight));
            _this.cameraPosX = point[0];
            _this.cameraPosY = point[1];
            _this.update();
            if (!silent) {
                Filters.apply('mapMoved', point);
            }
        };
        this.getCellByXY = function (x, y) {
            return [
                Math.floor(x / this.cellWidth),
                Math.floor(y / this.cellHeight)
            ];
        };
        this.generateFractions = function () {
            const _this = this;
            const fractionsOperator = new FractionsOperator(_this.timer, _this.layers.getLayer(LAYER_FRACTIONS), {
                freshWaterMap: _this.world.freshWaterMap,
                temperatureMap: _this.world.temperatureMap,
                forestMap: _this.world.forestOperator.getForestMap(),
                biomesMap: _this.world.biomesOperator.getBiomes(),
            });
            fractionsOperator.createFractions(Config.FRACTIONS.CREATE_COUNT);
            _this.update();
        };
        this.cameraPosX = cameraPos[0];
        this.cameraPosY = cameraPos[1];
        if (!Config.RANDOM_WORLD) {
            Math.seedrandom(Config.SEED);
        }
        this.cellWidth = Math.ceil(displayMapWrapper.offsetWidth / Config.VISIBLE_COLS);
        this.cellHeight = Math.ceil(displayMapWrapper.offsetHeight / Config.VISIBLE_ROWS);
        this.worldWidth = this.cellWidth * Config.WORLD_SIZE;
        this.worldHeight = this.cellHeight * Config.WORLD_SIZE;
        this.displayMapWrapper = displayMapWrapper;
        this.displayMapCanvas = displayMapCanvas;
        this.displayMapCanvas.width = this.worldWidth;
        this.displayMapCanvas.height = this.worldHeight;
        this.miniMapCanvas = miniMapCanvas;
        this.miniMapCanvas.width = Config.WORLD_SIZE;
        this.miniMapCanvas.height = Config.WORLD_SIZE;
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
