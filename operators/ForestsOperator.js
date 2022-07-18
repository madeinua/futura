class ForestsOperator {

    /** @var {ForestMap} */
    forestMap;

    /** @var {BiomesOperator} */
    biomesOperator;

    /**
     * @param {BiomesOperator} biomesOperator
     * @param {Timer} timer
     * @param {Layer} forestLayer
     * @return {ForestsOperator}
     */
    constructor(biomesOperator, timer, forestLayer) {

        let _this = this,
            forestGenerator = new ForestGenerator(biomesOperator);

        _this.biomesOperator = biomesOperator;

        _this.forestColor = hexToRgb(config.FOREST_COLOR);
        _this.forestImages = [];
        _this.forestImagesCache = [];

        for (let i = 0; i < config.FOREST_IMAGES.length; i++) {
            _this.forestImages.push(
                createImage(config.FOREST_IMAGES[i])
            );
        }

        _this.forestPalmImage = createImage(config.FOREST_PALM_IMAGE);

        _this.forestMap = new ForestMap(
            biomesOperator.getBiomes()
        );

        timer.addTickHandler(function(step) {

            forestGenerator.generate(_this.forestMap, step);

            _this.addForestMapToLayer(forestLayer, _this.forestMap);

            _this.forestMap = Filters.apply('forestMap', _this.forestMap);
        });

        if (config.LOGS) {
            logTimeEvent('Forests initialized.');
        }
    }

    /**
     * Whether the tile is a palm or a normal forest
     *
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isPalm = function(x, y) {
        return [Biome_Desert.NAME, Biome_Desert_Hills.NAME, Biome_Tropic.NAME].includes(
            this.biomesOperator.getBiome(x, y).getName()
        );
    }

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
            forestLayer.setTile(
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
                this.isPalm(x, y)
                    ? this.forestPalmImage
                    : this.forestImages.randomElement()
            );
        }

        return this.forestImagesCache[x + ',' + y];
    }
}