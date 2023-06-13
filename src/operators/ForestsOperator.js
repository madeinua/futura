import ForestMap from "../maps/ForestMap.js";
import ForestGenerator from "../generators/ForestGenerator.js";
import DisplayCell from "../render/DisplayCell.js"
import biomes from "../biomes/biomes.js";
import {hexToRgb, createImage, Filters, logTimeEvent} from "../helpers.js";

export default class ForestsOperator {

    /** @var {ForestMap} */
    forestMap;

    /** @var {BiomesOperator} */
    biomesOperator;

    /** @var {Object} */
    config;

    /**
     * @param {BiomesOperator} biomesOperator
     * @param {Timer} timer
     * @param {Layer} forestLayer
     * @param {Object} config
     * @return {ForestsOperator}
     */
    constructor(biomesOperator, timer, forestLayer, config) {

        let _this = this,
            forestGenerator = new ForestGenerator(biomesOperator, config);

        _this.biomesOperator = biomesOperator;
        _this.forestColor = hexToRgb(config.FOREST_COLOR);
        _this.forestImages = [];
        _this.forestImagesCache = [];
        _this.config = config;

        for (let i = 0; i < config.FOREST_IMAGES.length; i++) {
            _this.forestImages.push(
                createImage(config.FOREST_IMAGES[i])
            );
        }

        _this.forestPalmImage = createImage(config.FOREST_PALM_IMAGE);
        _this.forestTundraImage = createImage(config.FOREST_TUNDRA_IMAGE);
        _this.forestMap = new ForestMap(
            biomesOperator.getBiomes(),
            this.config
        );

        timer.addStepsHandler(function(step) {
            forestGenerator.generate(_this.forestMap, step);
            _this.addForestMapToLayer(forestLayer, _this.forestMap);
            _this.forestMap = Filters.apply('forestMap', _this.forestMap);
        });

        if (config.LOGS) {
            logTimeEvent('Forests initialized.');
        }
    }

    /**
     * Whether the cell is a palm or a normal forest
     *
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isDesertForest = function(x, y) {
        return [biomes.Biome_Desert.NAME, biomes.Biome_Desert_Hills.NAME, biomes.Biome_Tropic.NAME].includes(
            this.biomesOperator.getBiome(x, y).getName()
        );
    }

    /**
     * Whether the cell is a palm or a normal forest
     *
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isTundraForest = function(x, y) {
        return [biomes.Biome_Tundra.NAME, biomes.Biome_Tundra_Hills.NAME].includes(
            this.biomesOperator.getBiome(x, y).getName()
        );
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {HTMLImageElement}
     */
    getForestImage = function(x, y) {

        if (this.isDesertForest(x, y)) {
            return this.forestPalmImage;
        }

        if (this.isTundraForest(x, y)) {
            return this.forestTundraImage;
        }

        return this.forestImages.randomElement();
    };

    /**
     * @returns {ForestMap}
     */
    getForestMap() {
        return this.forestMap;
    }

    /**
     * @param {Layer} forestLayer
     * @param {ForestMap} forestMap
     */
    addForestMapToLayer = function(forestLayer, forestMap) {

        let _this = this;

        forestMap.foreach(function(x, y) {

            forestLayer.setCell(
                x, y,
                forestMap.filled(x, y) ? _this.getDisplayCell(x, y) : null
            );
        });
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {DisplayCell}
     */
    getDisplayCell = function(x, y) {

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