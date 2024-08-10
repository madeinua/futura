var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Config from "../config.js";
import { logTimeEvent, Filters, fillCanvasPixel, scaleImageData, resetTimeEvent } from "./helpers.js";
import SurfaceOperator from "./operators/SurfaceOperator.js";
import WeatherOperator from "./operators/WeatherOperator.js";
import WaterOperator from "./operators/WaterOperator.js";
import HumidityOperator from "./operators/HumidityOperator.js";
import BiomesOperator from "./operators/BiomesOperator.js";
import ForestsOperator from "./operators/ForestsOperator.js";
import AnimalsOperator from "./operators/AnimalsOperator.js";
import FractionsOperator from "./operators/FractionsOperator.js";
import Timer from "./services/Timer.js";
import Layers, { LAYER_ANIMALS, LAYER_BIOMES, LAYER_BIOMES_IMAGES, LAYER_FOREST, LAYER_FRACTIONS, LAYER_FRACTIONS_BORDERS, LAYER_HABITAT } from "./services/Layers.js";
import CellsRenderer from "./render/CellsRenderer.js";
export default class World {
    constructor(mapCanvas, mapWidth, mapHeight, miniMapCanvas, startPoint, onReady) {
        this.create = function () {
            const _this = this;
            Promise.all([
                _this.generateWorld(),
                _this.cellsRenderer.init()
            ]).then(() => {
                if (Config.LOGS) {
                    logTimeEvent('World generated');
                }
                _this.update();
                if (Config.STEPS_ENABLED) {
                    _this.timer.stepsTimer(() => _this.update());
                }
            });
        };
        this.generateWorld = function () {
            return __awaiter(this, void 0, void 0, function* () {
                const surfaceOperator = new SurfaceOperator(), weatherOperator = new WeatherOperator(), waterOperator = new WaterOperator(), humidityOperator = new HumidityOperator(), altitudeMap = surfaceOperator.generateAltitudeMap(), temperatureMap = weatherOperator.generateTemperatureMap(altitudeMap), oceanMap = waterOperator.generateOceanMap(altitudeMap), coastMap = waterOperator.getCoastMap(oceanMap, altitudeMap), lakesMap = waterOperator.generateLakesMap(altitudeMap, oceanMap), riversMap = waterOperator.generateRiversMap(altitudeMap, lakesMap), freshWaterMap = waterOperator.getFreshWaterMap(lakesMap, riversMap), islandsMap = waterOperator.getIslandsMap(oceanMap), humidityMap = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);
                const biomesOperator = new BiomesOperator(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, this.layers.getLayer(LAYER_BIOMES), this.layers.getLayer(LAYER_BIOMES_IMAGES));
                const forestsOperator = new ForestsOperator(biomesOperator, this.timer, this.layers.getLayer(LAYER_FOREST));
                new AnimalsOperator({
                    habitatLayer: this.layers.getLayer(LAYER_HABITAT),
                    animalsLayer: this.layers.getLayer(LAYER_ANIMALS),
                    freshWaterMap: freshWaterMap,
                    coastMap: coastMap,
                    forestsOperator: forestsOperator,
                    biomesOperator: biomesOperator,
                    timer: this.timer
                });
                const fractionsOperator = new FractionsOperator({
                    timer: this.timer,
                    fractionsLayer: this.layers.getLayer(LAYER_FRACTIONS),
                    fractionsBorderLayer: this.layers.getLayer(LAYER_FRACTIONS_BORDERS),
                    oceanMap: oceanMap,
                    freshWaterMap: freshWaterMap,
                    temperatureMap: temperatureMap,
                    forestMap: forestsOperator.getForestMap(),
                    biomesMap: biomesOperator.getBiomes(),
                    islandsMap: islandsMap,
                });
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
                    'fractionsOperator': fractionsOperator,
                };
            });
        };
        this.update = function () {
            resetTimeEvent();
            const _this = this, mapCtx = _this.mapCanvas.getContext('2d');
            // Cache terrain layer as it is static
            if (_this.terrainCanvasCtx === undefined) {
                // 1. Create canvas are where 1px = 1 cell
                const renderCtx = (new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE)).getContext('2d');
                _this.terrainCachedBgImageData = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);
                // Fill canvas with terrain colors
                _this.layers.foreachLayerValues(LAYER_BIOMES, function (displayCell, x, y) {
                    fillCanvasPixel(_this.terrainCachedBgImageData, (x + y * Config.WORLD_SIZE) * 4, displayCell.getColor());
                });
                renderCtx.putImageData(_this.terrainCachedBgImageData, 0, 0);
                // 2. Scale canvas to actual size of cells
                _this.terrainCanvasCtx = (new OffscreenCanvas(_this.worldWidth, _this.worldHeight)).getContext('2d');
                _this.terrainCanvasCtx.putImageData(scaleImageData(mapCtx, renderCtx.getImageData(0, 0, Config.WORLD_SIZE, Config.WORLD_SIZE), Config.CELL_SIZE, Config.CELL_SIZE), 0, 0);
            }
            // 3. Draw visible part of the canvas
            mapCtx.putImageData(_this.terrainCanvasCtx.getImageData(Config.CELL_SIZE * _this.cameraPos[0], Config.CELL_SIZE * _this.cameraPos[1], Config.CELL_SIZE * this.visibleCellCols, Config.CELL_SIZE * this.visibleCellRows), Config.CELL_SIZE * _this.cameraPos[0], Config.CELL_SIZE * _this.cameraPos[1]);
            // Step 4: Render layers except biomes as there were added before
            _this.layers.foreachMainMapLayersValues(function (displayCell, x, y) {
                if (_this.isCellVisible(x, y)) {
                    _this.cellsRenderer.render(mapCtx, displayCell, x, y);
                }
            });
            // Step 5: Add extras
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
            // Step 6: Add the minimap
            _this.drawMiniMap();
            logTimeEvent('World rendered');
        };
        this.isCellVisible = function (x, y) {
            return x >= this.cameraPos[0]
                && x < this.cameraPos[0] + this.visibleCellCols
                && y >= this.cameraPos[1]
                && y < this.cameraPos[1] + this.visibleCellRows;
        };
        this.drawMiniMap = function () {
            const _this = this, renderCtx = (new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE)).getContext('2d'), imageData = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);
            _this.layers.foreachMiniMapLayersValues(function (displayCell, x, y) {
                fillCanvasPixel(imageData, (x + y * Config.WORLD_SIZE) * 4, displayCell.getColor(), 0.7);
            });
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
            ctx.strokeRect(this.cameraPos[0], this.cameraPos[1], this.visibleCellCols, this.visibleCellRows);
        };
        this.drawRectangles = function () {
            const _this = this, ctx = _this.mapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPos[0] * Config.CELL_SIZE, worldOffsetTop = _this.cameraPos[1] * Config.CELL_SIZE;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(255,255,255,0.2)';
            for (let x = 0; x < this.visibleCellCols; x++) {
                for (let y = 0; y < this.visibleCellRows; y++) {
                    const lx = x * Config.CELL_SIZE + worldOffsetLeft, ly = y * Config.CELL_SIZE + worldOffsetTop;
                    ctx.strokeRect(lx, ly, Config.CELL_SIZE, Config.CELL_SIZE);
                }
            }
        };
        this.drawCoordinates = function () {
            const _this = this, ctx = _this.mapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPos[0] * Config.CELL_SIZE, worldOffsetTop = _this.cameraPos[1] * Config.CELL_SIZE;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.font = '7px senf';
            ctx.fillStyle = '#000000';
            for (let x = 0; x < this.visibleCellCols; x++) {
                for (let y = 0; y < this.visibleCellRows; y++) {
                    const lx = x * Config.CELL_SIZE + worldOffsetLeft, ly = y * Config.CELL_SIZE + worldOffsetTop;
                    ctx.fillText((_this.cameraPos[0] + x).toString(), lx + 2, ly + 10);
                    ctx.fillText((_this.cameraPos[1] + y).toString(), lx + 2, ly + 20);
                }
            }
        };
        this.drawTemperatures = function () {
            const _this = this, ctx = _this.mapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPos[0] * Config.CELL_SIZE, worldOffsetTop = _this.cameraPos[1] * Config.CELL_SIZE, temperatureMap = this.world.temperatureMap;
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.font = '7px senf';
            for (let x = 0; x < this.visibleCellCols; x++) {
                for (let y = 0; y < this.visibleCellRows; y++) {
                    const lx = x * Config.CELL_SIZE + worldOffsetLeft, ly = y * Config.CELL_SIZE + worldOffsetTop;
                    ctx.fillText((Math.round(temperatureMap.getCell(_this.cameraPos[0] + x, _this.cameraPos[1] + y) * 450) / 10).toString(), lx + 2, ly + 10);
                }
            }
        };
        this.drawBiomesInfo = function () {
            const _this = this, ctx = _this.mapCanvas.getContext('2d'), worldOffsetLeft = _this.cameraPos[0] * Config.CELL_SIZE, worldOffsetTop = _this.cameraPos[1] * Config.CELL_SIZE, biomes = this.world.biomesOperator.getBiomes();
            ctx.imageSmoothingEnabled = false;
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.font = '7px senf';
            for (let x = 0; x < this.visibleCellCols; x++) {
                for (let y = 0; y < this.visibleCellRows; y++) {
                    const lx = x * Config.CELL_SIZE + worldOffsetLeft, ly = y * Config.CELL_SIZE + worldOffsetTop;
                    ctx.fillText(biomes.getCell(_this.cameraPos[0] + x, _this.cameraPos[1] + y).getName().substring(6, 12), lx + 2, ly + 10);
                }
            }
        };
        this.moveMapTo = function (point, silent = false) {
            const cameraPos = this.getCameraPointByCenteredPoint(point);
            if (cameraPos[0] === this.cameraPos[0] && cameraPos[1] === this.cameraPos[1]) {
                return;
            }
            const _this = this, maxWidth = Config.WORLD_SIZE - this.visibleCellCols, maxHeight = Config.WORLD_SIZE - this.visibleCellRows;
            cameraPos[0] = Math.max(0, Math.min(cameraPos[0], maxWidth));
            cameraPos[1] = Math.max(0, Math.min(cameraPos[1], maxHeight));
            _this.cameraPos[0] = cameraPos[0];
            _this.cameraPos[1] = cameraPos[1];
            _this.update();
            if (!silent) {
                Filters.apply('mapMoved', cameraPos);
            }
        };
        this.getCameraPointByCenteredPoint = function (point) {
            const cw = Math.floor(this.visibleCellCols / 2), ch = Math.floor(this.visibleCellRows / 2);
            return [
                Math.max(0, point[0] - cw),
                Math.max(0, point[1] - ch)
            ];
        };
        this.generateFractions = function () {
            this.world.fractionsOperator.createFractions(Config.FRACTIONS.COUNT);
            this.update();
        };
        this.visibleCellCols = Math.ceil(mapWidth / Config.CELL_SIZE) + 1;
        this.visibleCellRows = Math.ceil(mapHeight / Config.CELL_SIZE) + 1;
        this.cameraPos = this.getCameraPointByCenteredPoint(startPoint);
        if (!Config.RANDOM_WORLD) {
            Math.seedrandom(Config.SEED);
        }
        this.worldWidth = Config.CELL_SIZE * Config.WORLD_SIZE;
        this.worldHeight = Config.CELL_SIZE * Config.WORLD_SIZE;
        if (this.worldWidth * this.worldHeight > 536756224) {
            console.error('World is too big. Maximum size is 23184x23184');
            return;
        }
        this.mapCanvas = mapCanvas;
        this.mapCanvas.width = this.worldWidth;
        this.mapCanvas.height = this.worldHeight;
        this.miniMapCanvas = miniMapCanvas;
        this.miniMapCanvas.width = Config.WORLD_SIZE;
        this.miniMapCanvas.height = Config.WORLD_SIZE;
        this.timer = new Timer();
        this.layers = new Layers(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.cellsRenderer = new CellsRenderer(Config.CELL_SIZE, Config.CELL_SIZE);
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
        onReady(this);
    }
}
