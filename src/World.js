import Config from "../config.js";
import { logTimeEvent, Filters, fillCanvasPixel, scaleImageData } from "./helpers.js";
import { LAYER_BIOMES, LAYER_FOREST, LAYER_HABITAT, LAYER_ANIMALS } from "./render/Layer.js";
import SurfaceOperator from "./operators/SurfaceOperator.js";
import WeatherOperator from "./operators/WeatherOperator.js";
import WaterOperator from "./operators/WaterOperator.js";
import HumidityOperator from "./operators/HumidityOperator.js";
import BiomesOperator from "./operators/BiomesOperator.js";
import ForestsOperator from "./operators/ForestsOperator.js";
import AnimalsOperator from "./operators/AnimalsOperator.js";
import Timer from "./services/Timer.js";
import Layers from "./services/Layers.js";
export default class World {
    constructor(scrollingMapWrapper, scrollingMapCanvas, mainMapCanvas, cameraPos) {
        this.generateWorld = function () {
            let surfaceOperator = new SurfaceOperator(), weatherOperator = new WeatherOperator(), waterOperator = new WaterOperator(), humidityOperator = new HumidityOperator(), altitudeMap = surfaceOperator.generateAltitudeMap(), temperatureMap = weatherOperator.generateTemperatureMap(altitudeMap), oceanMap = waterOperator.generateOceanMap(altitudeMap), coastMap = waterOperator.getCoastMap(oceanMap, altitudeMap, temperatureMap), lakesMap = waterOperator.generateLakesMap(altitudeMap, oceanMap), riversMap = waterOperator.generateRiversMap(altitudeMap, lakesMap), freshWaterMap = waterOperator.getFreshWaterMap(lakesMap, riversMap), humidityMap = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);
            let biomesOperator = new BiomesOperator(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, this.layers.getLayer(LAYER_BIOMES));
            let forestsOperator = new ForestsOperator(biomesOperator, this.timer, this.layers.getLayer(LAYER_FOREST));
            new AnimalsOperator(this.timer, this.layers.getLayer(LAYER_HABITAT), this.layers.getLayer(LAYER_ANIMALS), {
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
                'biomes': biomesOperator.getBiomes()
            };
        };
        this.moveMapTo = function (point, silent = false) {
            let max = Config.WORLD_SIZE - Config.VISIBLE_COLS;
            point[0] = Math.max(0, Math.min(point[0], max));
            point[1] = Math.max(0, Math.min(point[1], max));
            this.cameraPosX = point[0];
            this.cameraPosY = point[1];
            this.update();
            if (!silent) {
                Filters.apply('mapMoved', point);
            }
        };
        this.drawMainMap = function () {
            let _this = this, ctx = _this.mainMapCanvas.getContext('2d'), layer, displayCell, image = ctx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE), mainMapSize = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE, cameraPosX = _this.cameraPosX, cameraPosY = _this.cameraPosY;
            for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
                layer = _this.layers.getLayer(ln);
                layer.foreach(function (x, y) {
                    displayCell = layer.getCell(x, y);
                    if (displayCell === null) {
                        return;
                    }
                    fillCanvasPixel(image, (x + y * Config.WORLD_SIZE) * 4, displayCell.getColor());
                });
            }
            createImageBitmap(image).then(function (render) {
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(render, 0, 0, mainMapSize, mainMapSize);
                ctx.strokeStyle = '#FFFFFF';
                ctx.lineWidth = 2;
                ctx.strokeRect(cameraPosX * Config.MAIN_MAP_SCALE, cameraPosY * Config.MAIN_MAP_SCALE, Config.VISIBLE_COLS * Config.MAIN_MAP_SCALE, Config.VISIBLE_COLS * Config.MAIN_MAP_SCALE);
                return ctx;
            });
        };
        this.drawRectangles = function () {
            let _this = this, ctx = _this.scrollingMapCanvas.getContext('2d'), x, y, lx, ly, worldOffsetLeft = _this.cameraPosX * _this.cellSize, worldOffsetTop = _this.cameraPosY * _this.cellSize;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (x = 0; x < Config.VISIBLE_COLS; x++) {
                for (y = 0; y < Config.VISIBLE_COLS; y++) {
                    lx = x * _this.cellSize + worldOffsetLeft;
                    ly = y * _this.cellSize + worldOffsetTop;
                    ctx.strokeRect(lx, ly, _this.cellSize, _this.cellSize);
                }
            }
        };
        this.drawCoordinates = function () {
            let _this = this, ctx = _this.scrollingMapCanvas.getContext('2d'), x, y, lx, ly, worldOffsetLeft = _this.cameraPosX * _this.cellSize, worldOffsetTop = _this.cameraPosY * _this.cellSize;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (x = 0; x < Config.VISIBLE_COLS; x++) {
                for (y = 0; y < Config.VISIBLE_COLS; y++) {
                    lx = x * _this.cellSize + worldOffsetLeft;
                    ly = y * _this.cellSize + worldOffsetTop;
                    ctx.font = '7px senf';
                    ctx.fillText((_this.cameraPosX + x).toString(), lx + 2, ly + 10);
                    ctx.fillText((_this.cameraPosY + y).toString(), lx + 2, ly + 20);
                }
            }
        };
        this.drawTemperatures = function () {
            let _this = this, ctx = _this.scrollingMapCanvas.getContext('2d'), x, y, lx, ly, worldOffsetLeft = _this.cameraPosX * _this.cellSize, worldOffsetTop = _this.cameraPosY * _this.cellSize, temperatureMap = this.world.temperatureMap;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (x = 0; x < Config.VISIBLE_COLS; x++) {
                for (y = 0; y < Config.VISIBLE_COLS; y++) {
                    lx = x * _this.cellSize + worldOffsetLeft;
                    ly = y * _this.cellSize + worldOffsetTop;
                    ctx.font = '7px senf';
                    ctx.fillText((Math.round(temperatureMap.getCell(_this.cameraPosX + x, _this.cameraPosY + y) * 450) / 10).toString(), lx + 2, ly + 10);
                }
            }
        };
        this.drawBiomesInfo = function () {
            let _this = this, ctx = _this.scrollingMapCanvas.getContext('2d'), x, y, lx, ly, worldOffsetLeft = _this.cameraPosX * _this.cellSize, worldOffsetTop = _this.cameraPosY * _this.cellSize, biomes = this.world.biomes;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            for (x = 0; x < Config.VISIBLE_COLS; x++) {
                for (y = 0; y < Config.VISIBLE_COLS; y++) {
                    lx = x * _this.cellSize + worldOffsetLeft;
                    ly = y * _this.cellSize + worldOffsetTop;
                    ctx.font = '7px senf';
                    ctx.fillText(biomes.getCell(_this.cameraPosX + x, _this.cameraPosY + y).getName().substring(0, 6), lx + 2, ly + 10);
                }
            }
        };
        this.isCellVisible = function (x, y) {
            return x >= this.cameraPosX
                && x <= this.cameraPosX + Config.VISIBLE_COLS
                && y >= this.cameraPosY
                && y <= this.cameraPosY + Config.VISIBLE_COLS;
        };
        this.drawLayers = function () {
            let _this = this, renderCanvas = document.createElement('canvas');
            renderCanvas.width = Config.WORLD_SIZE;
            renderCanvas.height = Config.WORLD_SIZE;
            let renderCtx = renderCanvas.getContext('2d'), ctx = _this.scrollingMapCanvas.getContext('2d'), image = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE), ctxImages = [], layer, cell, worldOffsetLeft = this.cameraPosX * _this.cellSize, worldOffsetTop = this.cameraPosY * _this.cellSize;
            this.scrollingMapWrapper.scrollLeft = worldOffsetLeft;
            this.scrollingMapWrapper.scrollTop = worldOffsetTop;
            for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
                layer = _this.layers.getLayer(ln);
                layer.foreach(function (x, y) {
                    if (!_this.isCellVisible(x, y)) {
                        return;
                    }
                    cell = layer.getCell(x, y);
                    if (cell === null) {
                        return;
                    }
                    if (cell.drawBackground()) {
                        fillCanvasPixel(image, (x + y * Config.WORLD_SIZE) * 4, cell.getColor());
                    }
                    if (cell.hasImage()) {
                        ctxImages.push([x, y, cell.getImage()]);
                    }
                });
            }
            renderCtx.putImageData(image, 0, 0);
            let imageData = renderCtx.getImageData(_this.cameraPosX, _this.cameraPosY, Config.VISIBLE_COLS, Config.VISIBLE_COLS);
            let scaledData = scaleImageData(ctx, imageData, _this.cellSize);
            ctx.putImageData(scaledData, worldOffsetLeft, worldOffsetTop);
            for (let i = 0; i < ctxImages.length; i++) {
                if (!_this.isCellVisible(ctxImages[i][0], ctxImages[i][1])) {
                    continue;
                }
                ctx.drawImage(ctxImages[i][2], ctxImages[i][0] * _this.cellSize, ctxImages[i][1] * _this.cellSize, _this.cellSize, _this.cellSize);
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
            _this.drawMainMap();
        };
        this.create = function () {
            let _this = this;
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
        this.cameraPosX = cameraPos[0];
        this.cameraPosY = cameraPos[1];
        if (!Config.RANDOM_WORLD) {
            Math.seedrandom(Config.SEED);
        }
        this.cellSize = Math.ceil(scrollingMapWrapper.offsetWidth / Config.VISIBLE_COLS);
        this.worldScalledSize = this.cellSize * Config.WORLD_SIZE;
        this.scrollingMapWrapper = scrollingMapWrapper;
        this.scrollingMapCanvas = scrollingMapCanvas;
        this.scrollingMapCanvas.width = this.worldScalledSize;
        this.scrollingMapCanvas.height = this.worldScalledSize;
        this.mainMapCanvas = mainMapCanvas;
        this.mainMapCanvas.width = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;
        this.mainMapCanvas.height = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;
        this.timer = new Timer();
        this.layers = new Layers(Config.WORLD_SIZE, Config.WORLD_SIZE);
        if (Config.STORE_DATA) {
            let worldSize = localStorage.getItem('worldSize'), actualSize = Config.WORLD_SIZE + 'x' + Config.WORLD_SIZE;
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
