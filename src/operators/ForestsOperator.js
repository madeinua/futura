import ForestMap from "../maps/ForestMap.js";
import ForestGenerator from "../generators/ForestGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
import biomes from "../biomes/Biomes.js";
import { hexToRgb, Filters, logTimeEvent } from "../helpers.js";
import Config from "../../config.js";
export default class ForestsOperator {
    constructor(biomesOperator, timer, forestLayer) {
        this.biomesOperator = biomesOperator;
        this.forestColor = hexToRgb(Config.FOREST_COLOR);
        this.forestPalmImage = Config.FOREST_PALM_IMAGE;
        this.forestTundraImage = Config.FOREST_TUNDRA_IMAGE;
        // Cache forest images from config
        const forestImageKeys = Object.keys(Config.FOREST_IMAGES);
        this.forestImages = forestImageKeys.map((key) => Config.FOREST_IMAGES[key]);
        this.forestImagesCache = {};
        this.forestMap = new ForestMap(biomesOperator.getBiomes());
        const forestGenerator = new ForestGenerator(biomesOperator.altitudeMap, biomesOperator.humidityMap);
        // Update forest map on each timer step.
        timer.addStepsHandler((step) => {
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
    isDesertForest(x, y) {
        var _a;
        const biomeName = (_a = this.biomesOperator.getBiome(x, y)) === null || _a === void 0 ? void 0 : _a.getName();
        return biomeName === biomes.Biome_Desert.name || biomeName === biomes.Biome_Tropic.name;
    }
    /**
     * Determines whether the cell belongs to a tundra biome.
     */
    isTundraForest(x, y) {
        var _a;
        return ((_a = this.biomesOperator.getBiome(x, y)) === null || _a === void 0 ? void 0 : _a.getName()) === biomes.Biome_Tundra.name;
    }
    /**
     * Returns the appropriate forest image based on the biome.
     */
    getForestImage(x, y) {
        if (this.isDesertForest(x, y)) {
            return this.forestPalmImage;
        }
        if (this.isTundraForest(x, y)) {
            return this.forestTundraImage;
        }
        return this.forestImages.randomElement() || null;
    }
    getForestMap() {
        return this.forestMap;
    }
    /**
     * Adds the forest map cells to the given layer.
     */
    addForestMapToLayer(forestLayer, forestMap) {
        // Cache the forestMap methods locally
        forestMap.foreach((x, y) => {
            // Determine the display cell only if the cell is filled.
            const displayCell = forestMap.filled(x, y) ? this.getDisplayCell(x, y) : null;
            forestLayer.setCell(x, y, displayCell);
        });
    }
    /**
     * Returns the DisplayCell for a given position, caching the result for performance.
     */
    getDisplayCell(x, y) {
        const key = `${x},${y}`;
        if (!this.forestImagesCache[key]) {
            // Create and cache the display cell with the forest color and appropriate image.
            this.forestImagesCache[key] = new DisplayCell(this.forestColor, this.getForestImage(x, y));
        }
        return this.forestImagesCache[key];
    }
}
