import Config from "../config.js";
import {logTimeEvent, Filters, fillCanvasPixel, scaleImageData} from "./helpers.js";
import {LAYER_BIOMES, LAYER_FOREST, LAYER_HABITAT, LAYER_ANIMALS, Layer, LAYER_FRACTIONS} from "./render/Layer.js";
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
}

declare global {
    interface Math {
        seedrandom(seed: number): number;
    }
}

export default class World {

    cameraPosX: number;
    cameraPosY: number;
    world: WorldType;
    readonly cellWidth: number;
    readonly cellHeight: number;
    readonly scrollingMapWrapper: HTMLElement;
    readonly scrollingMapCanvas: HTMLCanvasElement;
    readonly mainMapCanvas: OffscreenCanvas;
    readonly miniMapCanvas: HTMLCanvasElement;
    timer: Timer;
    layers: Layers;

    constructor(
        scrollingMapWrapper: HTMLElement,
        scrollingMapCanvas: HTMLCanvasElement,
        miniMapCanvas: HTMLCanvasElement,
        cameraPos: Cell
    ) {

        this.cameraPosX = cameraPos[0];
        this.cameraPosY = cameraPos[1];

        if (!Config.RANDOM_WORLD) {
            Math.seedrandom(Config.SEED);
        }

        this.cellWidth = Math.ceil(scrollingMapWrapper.offsetWidth / Config.VISIBLE_COLS);
        this.cellHeight = Math.ceil(scrollingMapWrapper.offsetHeight / Config.VISIBLE_ROWS);

        this.mainMapCanvas = new OffscreenCanvas(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.mainMapCanvas.width = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;
        this.mainMapCanvas.height = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;

        this.miniMapCanvas = miniMapCanvas;

        this.scrollingMapWrapper = scrollingMapWrapper;
        this.scrollingMapCanvas = scrollingMapCanvas;
        this.scrollingMapCanvas.width = this.cellWidth * Config.WORLD_SIZE;
        this.scrollingMapCanvas.height = this.cellHeight * Config.WORLD_SIZE;

        this.timer = new Timer();
        this.layers = new Layers(Config.WORLD_SIZE, Config.WORLD_SIZE);

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

    private generateWorld = function (): void {

        const surfaceOperator = new SurfaceOperator(),
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

        const biomesOperator = new BiomesOperator(
            altitudeMap,
            oceanMap,
            coastMap,
            freshWaterMap,
            temperatureMap,
            humidityMap,
            this.layers.getLayer(LAYER_BIOMES)
        );

        const forestsOperator = new ForestsOperator(
            biomesOperator,
            this.timer,
            this.layers.getLayer(LAYER_FOREST)
        );

        new AnimalsOperator(
            this.layers.getLayer(LAYER_HABITAT),
            this.layers.getLayer(LAYER_ANIMALS),
            {
                freshWaterMap: freshWaterMap,
                coastMap: coastMap,
                forestsOperator: forestsOperator,
                biomesOperator: biomesOperator,
                timer: this.timer
            }
        );

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
        }
    }

    moveMapTo = function (point: Cell, silent: boolean = false): void {

        const maxWidth = Config.WORLD_SIZE - Config.VISIBLE_COLS,
            maxHeight = Config.WORLD_SIZE - Config.VISIBLE_ROWS;

        point[0] = Math.max(0, Math.min(point[0], maxWidth));
        point[1] = Math.max(0, Math.min(point[1], maxHeight));

        this.cameraPosX = point[0];
        this.cameraPosY = point[1];

        this.update();

        if (!silent) {
            Filters.apply('mapMoved', point);
        }
    }

    private drawMainMap = function (afterCallback: () => void): void {

        const _this: World = this,
            ctx = _this.mainMapCanvas.getContext('2d'),
            image = ctx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE);

        for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
            const layer = _this.layers.getLayer(ln);

            layer.foreachValues(function (displayCell: DisplayCell, x: number, y: number): void {
                if (displayCell !== null) {
                    fillCanvasPixel(
                        image,
                        (x + y * Config.WORLD_SIZE) * 4,
                        displayCell.getMapColor()
                    );
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
    }

    private drawRectangleAroundMiniMap = function (ctx: CanvasRenderingContext2D): void {

        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 3;
        ctx.strokeRect(
            this.cameraPosX * Config.MAIN_MAP_SCALE,
            this.cameraPosY * Config.MAIN_MAP_SCALE,
            Config.VISIBLE_COLS * Config.MAIN_MAP_SCALE,
            Config.VISIBLE_ROWS * Config.MAIN_MAP_SCALE
        );
    }

    private drawMiniMap = function (): void {

        const mainMapCtx = this.mainMapCanvas.getContext('2d'),
            miniMapCtx = this.miniMapCanvas.getContext('2d'),
            imageData = mainMapCtx.getImageData(0, 0, this.mainMapCanvas.width, this.mainMapCanvas.height);

        this.miniMapCanvas.width = imageData.width;
        this.miniMapCanvas.height = imageData.height;

        miniMapCtx.putImageData(imageData, 0, 0);

        this.drawRectangleAroundMiniMap(miniMapCtx);
    }

    private drawRectangles = function (): void {

        const _this: World = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellWidth,
            worldOffsetTop = _this.cameraPosY * _this.cellHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

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
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellWidth,
            worldOffsetTop = _this.cameraPosY * _this.cellHeight;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                const lx = x * _this.cellWidth + worldOffsetLeft,
                    ly = y * _this.cellHeight + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText((_this.cameraPosX + x).toString(), lx + 2, ly + 10);
                ctx.fillText((_this.cameraPosY + y).toString(), lx + 2, ly + 20);
            }
        }
    }

    private drawTemperatures = function (): void {

        const _this: World = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellWidth,
            worldOffsetTop = _this.cameraPosY * _this.cellHeight,
            temperatureMap = this.world.temperatureMap;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_ROWS; y++) {

                const lx = x * _this.cellWidth + worldOffsetLeft,
                    ly = y * _this.cellHeight + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText((Math.round(temperatureMap.getCell(_this.cameraPosX + x, _this.cameraPosY + y) * 450) / 10).toString(), lx + 2, ly + 10);
            }
        }
    }

    private drawBiomesInfo = function (): void {

        const _this: World = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellWidth,
            worldOffsetTop = _this.cameraPosY * _this.cellHeight,
            biomes = this.world.biomesOperator.getBiomes();

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_ROWS; y++) {
                const lx = x * _this.cellWidth + worldOffsetLeft,
                    ly = y * _this.cellHeight + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText(biomes.getCell(_this.cameraPosX + x, _this.cameraPosY + y).getName().substring(6, 12), lx + 2, ly + 10);
            }
        }
    }

    private isCellVisible = function (x: number, y: number): boolean {
        return x >= this.cameraPosX
            && x <= this.cameraPosX + Config.VISIBLE_COLS
            && y >= this.cameraPosY
            && y <= this.cameraPosY + Config.VISIBLE_ROWS;
    }

    protected drawLayers = function (): void {

        const _this: World = this,
            renderCanvas = document.createElement('canvas');

        renderCanvas.width = Config.WORLD_SIZE;
        renderCanvas.height = Config.WORLD_SIZE;

        const renderCtx = renderCanvas.getContext('2d'),
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            image = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE),
            ctxImages = [],
            worldOffsetLeft = this.cameraPosX * _this.cellWidth,
            worldOffsetTop = this.cameraPosY * _this.cellHeight;

        this.scrollingMapWrapper.scrollLeft = worldOffsetLeft;
        this.scrollingMapWrapper.scrollTop = worldOffsetTop;

        let layer: Layer;

        for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
            layer = _this.layers.getLayer(ln);

            layer.foreachValues(function (displayCell: null | DisplayCell, x: number, y: number) {

                if (displayCell === null || !_this.isCellVisible(x, y)) {
                    return;
                }

                if (displayCell.drawBackground()) {
                    fillCanvasPixel(
                        image,
                        (x + y * Config.WORLD_SIZE) * 4,
                        displayCell.getColor()
                    );
                }

                if (displayCell.hasImage()) {
                    ctxImages.push([x, y, displayCell.getImage()]);
                }
            });
        }

        renderCtx.putImageData(image, 0, 0);

        const imageData = renderCtx.getImageData(
            _this.cameraPosX,
            _this.cameraPosY,
            Config.VISIBLE_COLS,
            Config.VISIBLE_ROWS
        );

        const scaledData = scaleImageData(ctx, imageData, _this.cellWidth, _this.cellHeight);

        ctx.putImageData(scaledData, worldOffsetLeft, worldOffsetTop);

        for (let i = 0; i < ctxImages.length; i++) {

            if (!_this.isCellVisible(ctxImages[i][0], ctxImages[i][1])) {
                continue;
            }

            ctx.drawImage(
                ctxImages[i][2],
                ctxImages[i][0] * _this.cellWidth,
                ctxImages[i][1] * _this.cellHeight,
                _this.cellWidth,
                _this.cellHeight
            );
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

        _this.drawMainMap(function () {
            _this.drawMiniMap();
        });
    }

    create = function (): void {
        const _this: World = this;

        _this.generateWorld();

        setTimeout(function (): void {
            _this.update();
        }, 100);

        if (Config.STEPS_ENABLED) {
            _this.timer.stepsTimer(function (): void {
                _this.update();
            });
        }
    }

    update = function (): void {
        this.drawLayers();
    }

    generateFractions = function (): void {

        const fractionsOperator = new FractionsOperator(
            this.timer,
            this.layers.getLayer(LAYER_FRACTIONS),
            {
                freshWaterMap: this.world.freshWaterMap,
                temperatureMap: this.world.temperatureMap,
                forestMap: this.world.forestOperator.getForestMap(),
                biomesMap: this.world.biomesOperator.getBiomes(),
            }
        );

        fractionsOperator.createFractions(Config.FRACTIONS.CREATE_COUNT);

        this.update();
    }
}