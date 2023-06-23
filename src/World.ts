import Config from "../config.js";
import {logTimeEvent, Filters, fillCanvasPixel, scaleImageData} from "./helpers.js";
import {LAYER_BIOMES, LAYER_FOREST, LAYER_HABITAT, LAYER_ANIMALS, Layer} from "./render/Layer.js";
import SurfaceOperator from "./operators/SurfaceOperator.js";
import WeatherOperator from "./operators/WeatherOperator.js";
import WaterOperator from "./operators/WaterOperator.js";
import HumidityOperator from "./operators/HumidityOperator.js";
import BiomesOperator from "./operators/BiomesOperator.js";
import ForestsOperator from "./operators/ForestsOperator.js";
import AnimalsOperator from "./operators/AnimalsOperator.js";
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
import BiomesMap from "./maps/BiomesMap.js";
import DisplayCell from "./render/DisplayCell";

type WorldType = {
    altitudeMap: AltitudeMap,
    temperatureMap: TemperatureMap,
    oceanMap: OceanMap,
    coastMap: CoastMap,
    lakesMap: LakesMap,
    riversMap: RiversMap,
    freshWaterMap: BinaryMatrix,
    humidityMap: HumidityMap,
    biomes: BiomesMap
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
    readonly cellSize: number;
    readonly worldScaledSize: number;
    readonly scrollingMapWrapper: HTMLElement;
    readonly scrollingMapCanvas: HTMLCanvasElement;
    readonly mainMapCanvas: HTMLCanvasElement;
    timer: Timer;
    layers: Layers;

    constructor(
        scrollingMapWrapper: HTMLElement,
        scrollingMapCanvas: HTMLCanvasElement,
        mainMapCanvas: HTMLCanvasElement,
        cameraPos: Cell
    ) {

        this.cameraPosX = cameraPos[0];
        this.cameraPosY = cameraPos[1];

        if (!Config.RANDOM_WORLD) {
            Math.seedrandom(Config.SEED);
        }

        this.cellSize = Math.ceil(scrollingMapWrapper.offsetWidth / Config.VISIBLE_COLS);
        this.worldScaledSize = this.cellSize * Config.WORLD_SIZE;

        this.scrollingMapWrapper = scrollingMapWrapper;
        this.scrollingMapCanvas = scrollingMapCanvas;
        this.scrollingMapCanvas.width = this.worldScaledSize;
        this.scrollingMapCanvas.height = this.worldScaledSize;

        this.mainMapCanvas = mainMapCanvas;
        this.mainMapCanvas.width = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;
        this.mainMapCanvas.height = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE;

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

    generateWorld = function (): void {

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
            this.timer,
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
            'biomes': biomesOperator.getBiomes()
        }
    }

    moveMapTo = function (point: Cell, silent: boolean = false): void {

        const max = Config.WORLD_SIZE - Config.VISIBLE_COLS;

        point[0] = Math.max(0, Math.min(point[0], max));
        point[1] = Math.max(0, Math.min(point[1], max));

        this.cameraPosX = point[0];
        this.cameraPosY = point[1];

        this.update();

        if (!silent) {
            Filters.apply('mapMoved', point);
        }
    }

    drawMainMap = function (): void {

        const _this: World = this,
            ctx = _this.mainMapCanvas.getContext('2d'),
            image = ctx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE),
            mainMapSize = Config.WORLD_SIZE * Config.MAIN_MAP_SCALE,
            cameraPosX = _this.cameraPosX,
            cameraPosY = _this.cameraPosY;

        let layer,
            displayCell;

        for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
            layer = _this.layers.getLayer(ln);
            layer.foreach(function (x: number, y: number): void {

                displayCell = layer.getCell(x, y);

                if (displayCell === null) {
                    return;
                }

                fillCanvasPixel(
                    image,
                    (x + y * Config.WORLD_SIZE) * 4,
                    displayCell.getColor()
                );
            });
        }

        createImageBitmap(image).then(function (render): CanvasRenderingContext2D {

            ctx.imageSmoothingEnabled = false;

            ctx.drawImage(render, 0, 0, mainMapSize, mainMapSize);

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 2;
            ctx.strokeRect(
                cameraPosX * Config.MAIN_MAP_SCALE,
                cameraPosY * Config.MAIN_MAP_SCALE,
                Config.VISIBLE_COLS * Config.MAIN_MAP_SCALE,
                Config.VISIBLE_COLS * Config.MAIN_MAP_SCALE
            );

            return ctx;
        });
    }

    drawRectangles = function (): void {

        const _this: World = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        let lx, ly;

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_COLS; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.strokeRect(lx, ly, _this.cellSize, _this.cellSize);
            }
        }
    }

    drawCoordinates = function (): void {

        const _this: World = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        let lx, ly;

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_COLS; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText((_this.cameraPosX + x).toString(), lx + 2, ly + 10);
                ctx.fillText((_this.cameraPosY + y).toString(), lx + 2, ly + 20);
            }
        }
    }

    drawTemperatures = function (): void {

        const _this: World = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize,
            temperatureMap = this.world.temperatureMap;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        let lx, ly;

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_COLS; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText((Math.round(temperatureMap.getCell(_this.cameraPosX + x, _this.cameraPosY + y) * 450) / 10).toString(), lx + 2, ly + 10);
            }
        }
    }

    drawBiomesInfo = function (): void {

        const _this: World = this,
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            worldOffsetLeft = _this.cameraPosX * _this.cellSize,
            worldOffsetTop = _this.cameraPosY * _this.cellSize,
            biomes = this.world.biomes;

        ctx.imageSmoothingEnabled = false;
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';

        let lx, ly;

        for (let x = 0; x < Config.VISIBLE_COLS; x++) {
            for (let y = 0; y < Config.VISIBLE_COLS; y++) {

                lx = x * _this.cellSize + worldOffsetLeft;
                ly = y * _this.cellSize + worldOffsetTop;

                ctx.font = '7px senf';
                ctx.fillText(biomes.getCell(_this.cameraPosX + x, _this.cameraPosY + y).getName().substring(0, 6), lx + 2, ly + 10);
            }
        }
    }

    isCellVisible = function (x: number, y: number): boolean {
        return x >= this.cameraPosX
            && x <= this.cameraPosX + Config.VISIBLE_COLS
            && y >= this.cameraPosY
            && y <= this.cameraPosY + Config.VISIBLE_COLS;
    }

    drawLayers = function (): void {

        const _this: World = this,
            renderCanvas = document.createElement('canvas');

        renderCanvas.width = Config.WORLD_SIZE;
        renderCanvas.height = Config.WORLD_SIZE;

        const renderCtx = renderCanvas.getContext('2d'),
            ctx = _this.scrollingMapCanvas.getContext('2d'),
            image = renderCtx.createImageData(Config.WORLD_SIZE, Config.WORLD_SIZE),
            ctxImages = [],
            worldOffsetLeft = this.cameraPosX * _this.cellSize,
            worldOffsetTop = this.cameraPosY * _this.cellSize;

        this.scrollingMapWrapper.scrollLeft = worldOffsetLeft;
        this.scrollingMapWrapper.scrollTop = worldOffsetTop;

        let layer: Layer,
            cell: DisplayCell;

        for (let ln = 0; ln < _this.layers.getLayersCount(); ln++) {
            layer = _this.layers.getLayer(ln);

            layer.foreach(function (x: number, y: number) {

                if (!_this.isCellVisible(x, y)) {
                    return;
                }

                cell = layer.getCell(x, y);

                if (cell === null) {
                    return;
                }

                if (cell.drawBackground()) {
                    fillCanvasPixel(
                        image,
                        (x + y * Config.WORLD_SIZE) * 4,
                        cell.getColor()
                    );
                }

                if (cell.hasImage()) {
                    ctxImages.push([x, y, cell.getImage()]);
                }
            });
        }

        renderCtx.putImageData(image, 0, 0);

        const imageData = renderCtx.getImageData(
            _this.cameraPosX,
            _this.cameraPosY,
            Config.VISIBLE_COLS,
            Config.VISIBLE_COLS
        );

        const scaledData = scaleImageData(ctx, imageData, _this.cellSize);

        ctx.putImageData(scaledData, worldOffsetLeft, worldOffsetTop);

        for (let i = 0; i < ctxImages.length; i++) {

            if (!_this.isCellVisible(ctxImages[i][0], ctxImages[i][1])) {
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
}