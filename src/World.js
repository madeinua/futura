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
import { fillCanvasPixel, Filters, logTimeEvent, resetTimeEvent, scaleImageData, } from "./helpers.js";
import SurfaceOperator from "./operators/SurfaceOperator.js";
import WeatherOperator from "./operators/WeatherOperator.js";
import WaterOperator from "./operators/WaterOperator.js";
import HumidityOperator from "./operators/HumidityOperator.js";
import BiomesOperator from "./operators/BiomesOperator.js";
import ForestsOperator from "./operators/ForestsOperator.js";
import AnimalsOperator from "./operators/AnimalsOperator.js";
import FactionsOperator from "./operators/FactionsOperator.js";
import Timer from "./services/Timer.js";
import Layers, { LAYER_ANIMALS, LAYER_BIOMES, LAYER_BIOMES_IMAGES, LAYER_FOREST, LAYER_FACTIONS, LAYER_FACTIONS_BORDERS, LAYER_HABITAT, } from "./services/Layers.js";
import CellsRenderer from "./render/CellsRenderer.js";
export default class World {
    constructor(mapCanvas, mapWidth, mapHeight, miniMapCanvas, startPoint, onReady) {
        this.miniMapBitmap = null;
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
    create() {
        Promise.all([this.generateWorld(), this.cellsRenderer.init()]).then(() => {
            if (Config.LOGS) {
                logTimeEvent('World generated');
            }
            this.update();
            if (Config.STEPS_ENABLED) {
                this.timer.stepsTimer(() => this.update());
            }
        });
    }
    generateWorld() {
        return __awaiter(this, void 0, void 0, function* () {
            const surfaceOperator = new SurfaceOperator(), weatherOperator = new WeatherOperator(), waterOperator = new WaterOperator(), humidityOperator = new HumidityOperator(), altitudeMap = surfaceOperator.generateAltitudeMap(), temperatureMap = weatherOperator.generateTemperatureMap(altitudeMap), oceanMap = waterOperator.generateOceanMap(altitudeMap), islandsMap = waterOperator.getIslandsMap(oceanMap), coastMap = waterOperator.getCoastMap(oceanMap, altitudeMap), lakesMap = waterOperator.generateLakesMap(altitudeMap, oceanMap), riversMap = waterOperator.generateRiversMap(altitudeMap, lakesMap), freshWaterMap = waterOperator.getFreshWaterMap(lakesMap, riversMap), humidityMap = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);
            const biomesOperator = new BiomesOperator(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, this.layers.getLayer(LAYER_BIOMES), this.layers.getLayer(LAYER_BIOMES_IMAGES));
            const forestsOperator = new ForestsOperator(biomesOperator, this.timer, this.layers.getLayer(LAYER_FOREST));
            new AnimalsOperator({
                habitatLayer: this.layers.getLayer(LAYER_HABITAT),
                animalsLayer: this.layers.getLayer(LAYER_ANIMALS),
                altitudeMap: altitudeMap,
                freshWaterMap: freshWaterMap,
                coastMap: coastMap,
                forestsOperator: forestsOperator,
                biomesOperator: biomesOperator,
                timer: this.timer,
            });
            const factionsOperator = new FactionsOperator({
                timer: this.timer,
                factionsLayer: this.layers.getLayer(LAYER_FACTIONS),
                factionsBorderLayer: this.layers.getLayer(LAYER_FACTIONS_BORDERS),
                oceanMap: oceanMap,
                freshWaterMap: freshWaterMap,
                temperatureMap: temperatureMap,
                forestMap: forestsOperator.getForestMap(),
                biomesMap: biomesOperator.getBiomes(),
                islandsMap: islandsMap,
            });
            this.world = {
                altitudeMap,
                temperatureMap,
                oceanMap,
                coastMap,
                lakesMap,
                riversMap,
                freshWaterMap,
                humidityMap,
                biomesOperator,
                forestOperator: forestsOperator,
                factionsOperator,
            };
        });
    }
    update() {
        const mapCtx = this.mapCanvas.getContext('2d');
        // Cache terrain layer as it is static
        if (!this.terrainCanvasCtx) {
            this.cacheTerrainLayer(mapCtx);
        }
        // Draw visible part of the canvas
        this.drawTerrain(mapCtx);
        // Render layers except biomes as they were added before
        this.renderLayers(mapCtx);
        // Add extras
        if (Config.SHOW_RECTANGLES) {
            this.drawRectangles();
        }
        if (Config.SHOW_COORDINATES) {
            this.drawCoordinates();
        }
        if (Config.SHOW_TEMPERATURES) {
            this.drawTemperatures();
        }
        if (Config.SHOW_BIOMES_INFO) {
            this.drawBiomesInfo();
        }
        // Add the minimap
        this.drawMiniMap();
    }
    cacheTerrainLayer(mapCtx) {
        const renderCtx = new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE).getContext('2d');
        this.terrainCachedBgImageData = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);
        // Fill canvas with terrain colors
        this.layers.foreachLayerValues(LAYER_BIOMES, (displayCell, x, y) => {
            fillCanvasPixel(this.terrainCachedBgImageData, (x + y * Config.WORLD_SIZE) * 4, displayCell.getColor());
        });
        renderCtx.putImageData(this.terrainCachedBgImageData, 0, 0);
        // Scale canvas to actual size of cells
        this.terrainCanvasCtx = new OffscreenCanvas(this.worldWidth, this.worldHeight).getContext('2d');
        this.terrainCanvasCtx.putImageData(scaleImageData(mapCtx, renderCtx.getImageData(0, 0, Config.WORLD_SIZE, Config.WORLD_SIZE), Config.CELL_SIZE, Config.CELL_SIZE), 0, 0);
    }
    drawTerrain(mapCtx) {
        mapCtx.putImageData(this.terrainCanvasCtx.getImageData(Config.CELL_SIZE * this.cameraPos[0], Config.CELL_SIZE * this.cameraPos[1], Config.CELL_SIZE * this.visibleCellCols, Config.CELL_SIZE * this.visibleCellRows), Config.CELL_SIZE * this.cameraPos[0], Config.CELL_SIZE * this.cameraPos[1]);
    }
    renderLayers(mapCtx) {
        this.layers.foreachMainMapLayersValues((displayCell, x, y) => {
            if (this.isCellVisible(x, y)) {
                this.cellsRenderer.render(mapCtx, displayCell, x, y);
            }
        });
    }
    isCellVisible(x, y) {
        return (x >= this.cameraPos[0] &&
            x < this.cameraPos[0] + this.visibleCellCols &&
            y >= this.cameraPos[1] &&
            y < this.cameraPos[1] + this.visibleCellRows);
    }
    drawMiniMap() {
        const miniMapCtx = this.miniMapCanvas.getContext('2d');
        if (!this.miniMapBitmap) {
            const offscreen = new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE);
            const renderCtx = offscreen.getContext('2d');
            const imageData = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);
            this.layers.foreachMiniMapLayersValues((displayCell, x, y) => {
                fillCanvasPixel(imageData, (x + y * Config.WORLD_SIZE) * 4, displayCell.getColor(), 0.7);
            });
            // Create bitmap and cache it.
            createImageBitmap(imageData).then((bitmap) => {
                this.miniMapBitmap = bitmap;
                miniMapCtx.drawImage(bitmap, 0, 0);
                this.drawRectangleAroundMiniMap(miniMapCtx);
            });
        }
        else {
            // If cached, just redraw it.
            miniMapCtx.drawImage(this.miniMapBitmap, 0, 0);
            this.drawRectangleAroundMiniMap(miniMapCtx);
        }
    }
    drawRectangleAroundMiniMap(ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.cameraPos[0], this.cameraPos[1], this.visibleCellCols, this.visibleCellRows);
    }
    drawRectangles() {
        const ctx = this.mapCanvas.getContext('2d');
        const cellSize = Config.CELL_SIZE;
        const offsetX = this.cameraPos[0] * cellSize;
        const offsetY = this.cameraPos[1] * cellSize;
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                ctx.strokeRect(x * cellSize + offsetX, y * cellSize + offsetY, cellSize, cellSize);
            }
        }
    }
    drawCoordinates() {
        const ctx = this.mapCanvas.getContext('2d'), worldOffsetLeft = this.cameraPos[0] * Config.CELL_SIZE, worldOffsetTop = this.cameraPos[1] * Config.CELL_SIZE;
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';
        ctx.fillStyle = '#000000';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                const lx = x * Config.CELL_SIZE + worldOffsetLeft, ly = y * Config.CELL_SIZE + worldOffsetTop;
                ctx.fillText((this.cameraPos[0] + x).toString(), lx + 2, ly + 10);
                ctx.fillText((this.cameraPos[1] + y).toString(), lx + 2, ly + 20);
            }
        }
    }
    drawTemperatures() {
        const ctx = this.mapCanvas.getContext('2d'), worldOffsetLeft = this.cameraPos[0] * Config.CELL_SIZE, worldOffsetTop = this.cameraPos[1] * Config.CELL_SIZE, temperatureMap = this.world.temperatureMap;
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                const lx = x * Config.CELL_SIZE + worldOffsetLeft, ly = y * Config.CELL_SIZE + worldOffsetTop;
                ctx.fillText((Math.round(temperatureMap.getCell(this.cameraPos[0] + x, this.cameraPos[1] + y) * 450) / 10).toString(), lx + 2, ly + 10);
            }
        }
    }
    drawBiomesInfo() {
        const ctx = this.mapCanvas.getContext('2d'), worldOffsetLeft = this.cameraPos[0] * Config.CELL_SIZE, worldOffsetTop = this.cameraPos[1] * Config.CELL_SIZE, biomes = this.world.biomesOperator.getBiomes();
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';
        for (let x = 0; x < this.visibleCellCols; x++) {
            for (let y = 0; y < this.visibleCellRows; y++) {
                const lx = x * Config.CELL_SIZE + worldOffsetLeft, ly = y * Config.CELL_SIZE + worldOffsetTop;
                ctx.fillText(biomes.getCell(this.cameraPos[0] + x, this.cameraPos[1] + y)
                    .getName()
                    .substring(6, 12), lx + 2, ly + 10);
            }
        }
    }
    moveMapTo(point, silent = false) {
        resetTimeEvent();
        const cameraPos = this.getCameraPointByCenteredPoint(point);
        if (cameraPos[0] === this.cameraPos[0] && cameraPos[1] === this.cameraPos[1]) {
            return;
        }
        const maxWidth = Config.WORLD_SIZE - this.visibleCellCols, maxHeight = Config.WORLD_SIZE - this.visibleCellRows;
        cameraPos[0] = Math.max(0, Math.min(cameraPos[0], maxWidth));
        cameraPos[1] = Math.max(0, Math.min(cameraPos[1], maxHeight));
        this.cameraPos = cameraPos;
        this.update();
        if (!silent) {
            Filters.apply('mapMoved', cameraPos);
        }
    }
    getCameraPointByCenteredPoint(point) {
        const cw = Math.floor(this.visibleCellCols / 2), ch = Math.floor(this.visibleCellRows / 2);
        return [
            Math.max(0, point[0] - cw),
            Math.max(0, point[1] - ch),
        ];
    }
    generateFactions() {
        this.world.factionsOperator.createFactions(Config.FACTIONS.COUNT);
        this.update();
    }
}
