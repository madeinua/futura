import ForestMap from "../maps/ForestMap.js";
import ForestGenerator from "../generators/ForestGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
import Timer from "../services/Timer.js";
import biomes from "../biomes/Biomes.js";
import {hexToRgb, Filters, logTimeEvent, RGB} from "../helpers.js";
import Config from "../../config.js";
import BiomesOperator from "./BiomesOperator.js";
import {Layer} from "../render/Layer.js";

export default class ForestsOperator {
    private readonly forestColor: RGB;
    private readonly biomesOperator: BiomesOperator;
    private readonly forestPalmImage: string | null;
    private readonly forestTundraImage: string | null;
    private readonly forestImages: string[];
    private readonly forestImagesCache: { [key: string]: DisplayCell };
    private forestMap: ForestMap;

    constructor(biomesOperator: BiomesOperator, timer: Timer, forestLayer: Layer) {
        this.biomesOperator = biomesOperator;
        this.forestColor = hexToRgb(Config.FOREST_COLOR);
        this.forestPalmImage = Config.FOREST_PALM_IMAGE;
        this.forestTundraImage = Config.FOREST_TUNDRA_IMAGE;

        // Cache forest images from config
        const forestImageKeys = Object.keys(Config.FOREST_IMAGES);
        this.forestImages = forestImageKeys.map((key) => Config.FOREST_IMAGES[key]);

        this.forestImagesCache = {};
        this.forestMap = new ForestMap(biomesOperator.getBiomes());

        const forestGenerator = new ForestGenerator(
            biomesOperator.altitudeMap,
            biomesOperator.humidityMap
        );

        // Update forest map on each timer step.
        timer.addStepsHandler((step: number): void => {
            forestGenerator.generate(this.forestMap, step);
            this.addForestMapToLayer(forestLayer, this.forestMap);
            // Optionally process the forestMap with filters.
            this.forestMap = Filters.apply("forestMap", this.forestMap);
        });

        if (Config.LOGS) {
            logTimeEvent("Forests initialized.");
        }
    }

    /**
     * Determines whether the cell belongs to a desert or tropical biome.
     */
    isDesertForest(x: number, y: number): boolean {
        const biomeName = this.biomesOperator.getBiome(x, y)?.getName();

        return biomeName === biomes.Biome_Desert.name || biomeName === biomes.Biome_Tropic.name;
    }

    /**
     * Determines whether the cell belongs to a tundra biome.
     */
    isTundraForest(x: number, y: number): boolean {
        return this.biomesOperator.getBiome(x, y)?.getName() === biomes.Biome_Tundra.name;
    }

    /**
     * Returns the appropriate forest image based on the biome.
     */
    protected getForestImage(x: number, y: number): string | null {

        if (this.isDesertForest(x, y)) {
            return this.forestPalmImage;
        }

        if (this.isTundraForest(x, y)) {
            return this.forestTundraImage;
        }

        return this.forestImages.randomElement() || null;
    }

    getForestMap(): ForestMap {
        return this.forestMap;
    }

    /**
     * Adds the forest map cells to the given layer.
     */
    private addForestMapToLayer(forestLayer: Layer, forestMap: ForestMap): void {
        // Cache the forestMap methods locally
        forestMap.foreach((x: number, y: number): void => {
            // Determine the display cell only if the cell is filled.
            const displayCell = forestMap.filled(x, y) ? this.getDisplayCell(x, y) : null;
            forestLayer.setCell(x, y, displayCell);
        });
    }

    /**
     * Returns the DisplayCell for a given position, caching the result for performance.
     */
    private getDisplayCell(x: number, y: number): DisplayCell {
        const key = `${x},${y}`;

        if (!this.forestImagesCache[key]) {
            // Create and cache the display cell with the forest color and appropriate image.
            this.forestImagesCache[key] = new DisplayCell(
                this.forestColor,
                this.getForestImage(x, y)
            );
        }
        
        return this.forestImagesCache[key];
    }
}