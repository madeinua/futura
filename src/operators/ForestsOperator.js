import ForestMap from "../maps/ForestMap.js";
import ForestGenerator from "../generators/ForestGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
import biomes from "../biomes/biomes.js";
import { hexToRgb, createImage, Filters, logTimeEvent } from "../helpers.js";
import Config from "../../config.js";
export default class ForestsOperator {
    constructor(biomesOperator, timer, forestLayer) {
        /**
         * Whether the cell is a palm or a normal forest
         */
        this.isDesertForest = function (x, y) {
            return [biomes.Biome_Desert.BIOME_NAME, biomes.Biome_Desert_Hills.BIOME_NAME, biomes.Biome_Tropic.BIOME_NAME].includes(this.biomesOperator.getBiome(x, y).getName());
        };
        /**
         * Whether the cell is a palm or a normal forest
         */
        this.isTundraForest = function (x, y) {
            return [biomes.Biome_Tundra.BIOME_NAME, biomes.Biome_Tundra_Hills.BIOME_NAME].includes(this.biomesOperator.getBiome(x, y).getName());
        };
        this.getForestImage = function (x, y) {
            if (this.isDesertForest(x, y)) {
                return this.forestPalmImage;
            }
            if (this.isTundraForest(x, y)) {
                return this.forestTundraImage;
            }
            return this.forestImages.randomElement();
        };
        this.addForestMapToLayer = function (forestLayer, forestMap) {
            const _this = this;
            forestMap.foreach(function (x, y) {
                forestLayer.setCell(x, y, forestMap.filled(x, y) ? _this.getDisplayCell(x, y) : null);
            });
        };
        this.getDisplayCell = function (x, y) {
            if (typeof this.forestImagesCache[x + ',' + y] === 'undefined') {
                this.forestImagesCache[x + ',' + y] = new DisplayCell(this.forestColor, this.getForestImage(x, y), false);
            }
            return this.forestImagesCache[x + ',' + y];
        };
        const _this = this, forestGenerator = new ForestGenerator(biomesOperator);
        _this.biomesOperator = biomesOperator;
        _this.forestColor = hexToRgb(Config.FOREST_COLOR);
        _this.forestImages = [];
        _this.forestImagesCache = [];
        for (let i = 0; i < Config.FOREST_IMAGES.length; i++) {
            _this.forestImages.push(createImage(Config.FOREST_IMAGES[i]));
        }
        _this.forestPalmImage = createImage(Config.FOREST_PALM_IMAGE);
        _this.forestTundraImage = createImage(Config.FOREST_TUNDRA_IMAGE);
        _this.forestMap = new ForestMap(biomesOperator.getBiomes());
        timer.addStepsHandler(function (step) {
            forestGenerator.generate(_this.forestMap, step);
            _this.addForestMapToLayer(forestLayer, _this.forestMap);
            _this.forestMap = Filters.apply('forestMap', _this.forestMap);
        });
        if (Config.LOGS) {
            logTimeEvent('Forests initialized.');
        }
    }
    getForestMap() {
        return this.forestMap;
    }
}
