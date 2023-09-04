import ForestMap from "../maps/ForestMap.js";
import ForestGenerator from "../generators/ForestGenerator.js";
import DisplayCell from "../render/DisplayCell.js"
import Timer from "../services/Timer.js";
import biomes from "../biomes/Biomes.js";
import {hexToRgb, createImage, Filters, logTimeEvent, RGB} from "../helpers.js";
import Config from "../../config.js";
import BiomesOperator from "./BiomesOperator.js";
import {Layer} from "../render/Layer.js";

export default class ForestsOperator {

    readonly forestColor: RGB;
    readonly biomesOperator: BiomesOperator;
    readonly forestPalmImage: HTMLImageElement;
    readonly forestTundraImage: HTMLImageElement;
    forestImages: HTMLImageElement[];
    forestImagesCache: HTMLImageElement[];
    forestMap: ForestMap;

    constructor(biomesOperator: BiomesOperator, timer: Timer, forestLayer: Layer) {

        this.biomesOperator = biomesOperator;
        this.forestColor = hexToRgb(Config.FOREST_COLOR);
        this.forestPalmImage = createImage(Config.FOREST_PALM_IMAGE);
        this.forestTundraImage = createImage(Config.FOREST_TUNDRA_IMAGE);

        const _this: ForestsOperator = this,
            forestGenerator = new ForestGenerator(biomesOperator);

        _this.forestImages = [];
        _this.forestImagesCache = [];

        for (let i = 0; i < Config.FOREST_IMAGES.length; i++) {
            _this.forestImages.push(
                createImage(Config.FOREST_IMAGES[i])
            );
        }

        _this.forestMap = new ForestMap(
            biomesOperator.getBiomes()
        );

        timer.addStepsHandler(function (step: number): void {
            forestGenerator.generate(_this.forestMap, step);
            _this.addForestMapToLayer(forestLayer, _this.forestMap);
            _this.forestMap = Filters.apply('forestMap', _this.forestMap);
        });

        if (Config.LOGS) {
            logTimeEvent('Forests initialized.');
        }
    }

    /**
     * Whether the cell is a palm or a normal forest
     */
    isDesertForest = function (x: number, y: number): boolean {
        return [biomes.Biome_Desert.BIOME_NAME, biomes.Biome_Desert_Hills.BIOME_NAME, biomes.Biome_Tropic.BIOME_NAME].includes(
            this.biomesOperator.getBiome(x, y).getName()
        );
    }

    /**
     * Whether the cell is a palm or a normal forest
     */
    isTundraForest = function (x: number, y: number): boolean {
        return [biomes.Biome_Tundra.BIOME_NAME, biomes.Biome_Tundra_Hills.BIOME_NAME].includes(
            this.biomesOperator.getBiome(x, y).getName()
        );
    }

    protected getForestImage = function (x: number, y: number): HTMLImageElement {

        if (this.isDesertForest(x, y)) {
            return this.forestPalmImage;
        }

        if (this.isTundraForest(x, y)) {
            return this.forestTundraImage;
        }

        return this.forestImages.randomElement();
    }

    getForestMap(): ForestMap {
        return this.forestMap;
    }

    private addForestMapToLayer = function (forestLayer: Layer, forestMap: ForestMap): void {
        const _this: ForestsOperator = this;

        forestMap.foreach(function (x: number, y: number): void {
            forestLayer.setCell(
                x, y,
                forestMap.filled(x, y) ? _this.getDisplayCell(x, y) : null
            );
        });
    }

    private getDisplayCell = function (x: number, y: number): DisplayCell {

        if (typeof this.forestImagesCache[x + ',' + y] === 'undefined') {
            this.forestImagesCache[x + ',' + y] = new DisplayCell(
                this.forestColor,
                this.getForestImage(x, y),
                false
            );
        }

        return this.forestImagesCache[x + ',' + y];
    }
}