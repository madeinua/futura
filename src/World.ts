import Config from "../config.js";
import {logTimeEvent, Filters, fillCanvasPixel, scaleImageData, resetTimeEvent} from "./helpers.js";
import SurfaceOperator from "./operators/SurfaceOperator.js";
import WeatherOperator from "./operators/WeatherOperator.js";
import WaterOperator from "./operators/WaterOperator.js";
import HumidityOperator from "./operators/HumidityOperator.js";
import BiomesOperator from "./operators/BiomesOperator.js";
import ForestsOperator from "./operators/ForestsOperator.js";
import AnimalsOperator from "./operators/AnimalsOperator.js";
import FractionsOperator from "./operators/FractionsOperator.js";
import Timer from "./services/Timer.js";
import Layers, {LAYER_ANIMALS, LAYER_BIOMES, LAYER_BIOMES_IMAGES, LAYER_FOREST, LAYER_FRACTIONS, LAYER_FRACTIONS_BORDERS, LAYER_HABITAT} from "./services/Layers.js";
import AltitudeMap from "./maps/AltitudeMap.js";
import TemperatureMap from "./maps/TemperatureMap.js";
import OceanMap from "./maps/OceanMap.js";
import CoastMap from "./maps/CoastMap.js";
import LakesMap from "./maps/LakesMap.js";
import RiversMap from "./maps/RiversMap.js";
import BinaryMatrix from "./structures/BinaryMatrix.js";
import HumidityMap from "./maps/HumidityMap.js";
import {Cell} from "./structures/Cells.js";
import DisplayCell from "./render/DisplayCell.js";
import CellsRenderer from "./render/CellsRenderer.js";

type WorldType = {
    altitudeMap: AltitudeMap,
    temperatureMap: TemperatureMap,
    oceanMap: OceanMap,
    coastMap: CoastMap,
    lakesMap: LakesMap,
    riversMap: RiversMap,
    freshWaterMap: BinaryMatrix,
    humidityMap: HumidityMap,
    biomesOperator: BiomesOperator,
    forestOperator: ForestsOperator,
    fractionsOperator: FractionsOperator,
}

declare global {
    interface Math {
        seedrandom(seed: number): number;
    }
}

export default class World {

    cameraPosLeft: number;
    cameraPosTop: number;
    world: WorldType;
    readonly cellWidth: number;
    readonly cellHeight: number;
    readonly worldWidth: number;
    readonly worldHeight: number;
    readonly mapCanvas: HTMLCanvasElement;
    readonly miniMapCanvas: HTMLCanvasElement;
    timer: Timer;
    layers: Layers;
    terrainCanvasCtx: OffscreenCanvasRenderingContext2D;
    terrainCachedBgImageData: ImageData;
    cellsRenderer: CellsRenderer;

    constructor(
        mapCanvas: HTMLCanvasElement,
        mapWidth: number,
        mapHeight: number,
        miniMapCanvas: HTMLCanvasElement,
        cameraPos: Cell
    ) {
        this.cameraPosLeft = cameraPos[0];
        this.cameraPosTop = cameraPos[1];

        if (!Config.RANDOM_WORLD) {
            Math.seedrandom(Config.SEED);
        }

        this.cellWidth = Math.ceil(mapWidth / Config.VISIBLE_COLS);
        this.cellHeight = Math.ceil(mapHeight / Config.VISIBLE_ROWS);
        this.worldWidth = this.cellWidth * Config.WORLD_SIZE;
        this.worldHeight = this.cellHeight * Config.WORLD_SIZE;

        this.mapCanvas = mapCanvas;
        this.mapCanvas.width = this.worldWidth;
        this.mapCanvas.height = this.worldHeight;

        this.miniMapCanvas = miniMapCanvas;
        this.miniMapCanvas.width = Config.WORLD_SIZE;
        this.miniMapCanvas.height = Config.WORLD_SIZE;

        this.timer = new Timer();
        this.layers = new Layers(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.cellsRenderer = new CellsRenderer(this.cellWidth, this.cellHeight);

        if (Config.STORE_DATA) {

            const worldSize = localStorage.getItem('worldSize'),
                actualSize = Config.WORLD_SIZE + 'x' + Config.WORLD_SIZE;

            if (actualSize !== worldSize) {
                localStorage.clear();
            }

            localStorage.setItem('worldSize', actualSize);
        }

        if (Config.LOGS) {
            logTimeEvent('Initialized');
        }
    }

    create = function (): void {
        const _this: World = this;

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
    }

    private generateWorld = async function (): Promise<void> {

        const surfaceOperator = new SurfaceOperator(),
            weatherOperator = new WeatherOperator(),
            waterOperator = new WaterOperator(),
            humidityOperator = new HumidityOperator(),
            altitudeMap = surfaceOperator.generateAltitudeMap(),
            temperatureMap = weatherOperator.generateTemperatureMap(altitudeMap),
            oceanMap = waterOperator.generateOceanMap(altitudeMap),
            coastMap = waterOperator.getCoastMap(oceanMap, altitudeMap),
            lakesMap = waterOperator.generateLakesMap(altitudeMap, oceanMap),
            riversMap = waterOperator.generateRiversMap(altitudeMap, lakesMap),
            freshWaterMap = waterOperator.getFreshWaterMap(lakesMap, riversMap),
            islandsMap = waterOperator.getIslandsMap(oceanMap),
            humidityMap = humidityOperator.generateHumidityMap(altitudeMap, riversMap, lakesMap);

        const biomesOperator = new BiomesOperator(
            altitudeMap,
            oceanMap,
            coastMap,
            freshWaterMap,
            temperatureMap,
            humidityMap,
            this.layers.getLayer(LAYER_BIOMES),
            this.layers.getLayer(LAYER_BIOMES_IMAGES)
        );

        const forestsOperator = new ForestsOperator(
            biomesOperator,
            this.timer,
            this.layers.getLayer(LAYER_FOREST)
        );

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
        }
    }

    update = function (): void {
        resetTimeEvent();

        const _this: World = this,
            mapCtx = _this.mapCanvas.getContext('2d');

        // Cache terrain layer as it is static
        if (_this.terrainCanvasCtx === undefined) {

            // 1. Create canvas are where 1px = 1 cell
            const renderCtx = (new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE)).getContext('2d');
            _this.terrainCachedBgImageData = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);

            // Fill canvas with terrain colors
            _this.layers.foreachLayerValues(LAYER_BIOMES, function (displayCell: null | DisplayCell, x: number, y: number) {
                fillCanvasPixel(
                    _this.terrainCachedBgImageData,
                    (x + y * Config.WORLD_SIZE) * 4,
                    displayCell.getColor()
                );
            });

            renderCtx.putImageData(_this.terrainCachedBgImageData, 0, 0);

            // 2. Scale canvas to actual size of cells
            _this.terrainCanvasCtx = (new OffscreenCanvas(_this.worldWidth, _this.worldHeight)).getContext('2d');
            _this.terrainCanvasCtx.putImageData(
                scaleImageData(
                    mapCtx,
                    renderCtx.getImageData(0, 0, Config.WORLD_SIZE, Config.WORLD_SIZE),
                    _this.cellWidth,
                    _this.cellHeight
                ),
                0, 0
            );
        }

        // 3. Draw visible part of the canvas
        mapCtx.putImageData(
            _this.terrainCanvasCtx.getImageData(
                _this.cellWidth * _this.cameraPosLeft,
                _this.cellHeight * _this.cameraPosTop,
                _this.cellWidth * Config.VISIBLE_COLS,
                _this.cellHeight * Config.VISIBLE_ROWS
            ),
            _this.cellWidth * _this.cameraPosLeft,
            _this.cellHeight * _this.cameraPosTop
        );

        // Step 4: Render layers except biomes as there were added before
        _this.layers.foreachMainMapLayersValues(function (displayCell: null | DisplayCell, x: number, y: number) {
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
    }

    private isCellVisible = function (x: number, y: number): boolean {
        return x >= this.cameraPosLeft
            && x < this.cameraPosLeft + Config.VISIBLE_COLS
            && y >= this.cameraPosTop
            && y < this.cameraPosTop + Config.VISIBLE_ROWS;
    }

    private drawMiniMap = function (): void {
        const _this: World = this,
            renderCtx = (new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE)).getContext('2d'),
            imageData = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);

        _this.layers.foreachMiniMapLayersValues(function (displayCell: null | DisplayCell, x: number, y: number): void {
            fillCanvasPixel(
                imageData,
                (x + y * Config.WORLD_SIZE) * 4,
                displayCell.getColor(),
                0.7
            );
        });

        createImageBitmap(imageData).then(function () {
            const miniMapCtx = _this.miniMapCanvas.getContext('2d');
            miniMapCtx.putImageData(imageData, 0, 0);
            _this.drawRectangleAroundMiniMap(miniMapCtx);
        });
    }

    private drawRectangleAroundMiniMap = function (ctx: CanvasRenderingContext2D): void {
        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.cameraPosLeft,
            this.cameraPosTop,
            Config.VISIBLE_COLS,
            Config.VISIBLE_ROWS
        );
    }

    private drawRectangles = function (): void {
        const _this: World = this,
            ctx = _this.mapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosLeft * _this.cellWidth,
            worldOffsetTop = _this.cameraPosTop * _this.cellHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                const lx = x * _this.cellWidth + worldOffsetLeft,
                    ly = y * _this.cellHeight + worldOffsetTop;

                ctx.strokeRect(lx, ly, _this.cellWidth, _this.cellHeight);
            }
        }
    }

    private drawCoordinates = function (): void {
        const _this: World = this,
            ctx = _this.mapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosLeft * _this.cellWidth,
            worldOffsetTop = _this.cameraPosTop * _this.cellHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';
        ctx.fillStyle = '#000000';

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                const lx = x * _this.cellWidth + worldOffsetLeft,
                    ly = y * _this.cellHeight + worldOffsetTop;

                ctx.fillText((_this.cameraPosLeft + x).toString(), lx + 2, ly + 10);
                ctx.fillText((_this.cameraPosTop + y).toString(), lx + 2, ly + 20);
            }
        }
    }

    private drawTemperatures = function (): void {
        const _this: World = this,
            ctx = _this.mapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosLeft * _this.cellWidth,
            worldOffsetTop = _this.cameraPosTop * _this.cellHeight,
            temperatureMap = this.world.temperatureMap;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_ROWS; y++) {

                const lx = x * _this.cellWidth + worldOffsetLeft,
                    ly = y * _this.cellHeight + worldOffsetTop;

                ctx.fillText((Math.round(temperatureMap.getCell(_this.cameraPosLeft + x, _this.cameraPosTop + y) * 450) / 10).toString(), lx + 2, ly + 10);
            }
        }
    }

    private drawBiomesInfo = function (): void {
        const _this: World = this,
            ctx = _this.mapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosLeft * _this.cellWidth,
            worldOffsetTop = _this.cameraPosTop * _this.cellHeight,
            biomes = this.world.biomesOperator.getBiomes();

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.font = '7px senf';

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                const lx = x * _this.cellWidth + worldOffsetLeft,
                    ly = y * _this.cellHeight + worldOffsetTop;

                ctx.fillText(biomes.getCell(_this.cameraPosLeft + x, _this.cameraPosTop + y).getName().substring(6, 12), lx + 2, ly + 10);
            }
        }
    }

    moveMapTo = function (point: Cell, silent: boolean = false): void {
        const _this: World = this,
            maxWidth = Config.WORLD_SIZE - Config.VISIBLE_COLS,
            maxHeight = Config.WORLD_SIZE - Config.VISIBLE_ROWS;

        point[0] = Math.max(0, Math.min(point[0], maxWidth));
        point[1] = Math.max(0, Math.min(point[1], maxHeight));

        _this.cameraPosLeft = point[0];
        _this.cameraPosTop = point[1];

        _this.update();

        if (!silent) {
            Filters.apply('mapMoved', point);
        }
    }

    getCellByXY = function (x: number, y: number): Cell {
        return [
            Math.floor(x / this.cellWidth),
            Math.floor(y / this.cellHeight)
        ];
    }

    generateFractions = function (): void {
        this.world.fractionsOperator.createFractions(Config.FRACTIONS.COUNT);
        this.update();
    }
}