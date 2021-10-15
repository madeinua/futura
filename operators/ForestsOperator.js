class ForestsOperator {

    /**
     * @param {Matrix} biomes
     * @param {Array} tickHandlers
     * @param {Layer} forestLayer
     * @return {Array}
     */
    constructor(biomes, tickHandlers, forestLayer) {

        let _this = this,
            forestMap = new ForestMap(biomes),
            forestGenerator = new ForestGenerator();

        _this.forestColor = hexToRgb(config.FOREST_COLOR);
        _this.forestImages = [];
        _this.forestImagesCache = [];

        for (let i = 0; i < config.FOREST_IMAGES.length; i++) {
            _this.forestImages.push(
                createImage(config.FOREST_IMAGES[i])
            );
        }

        forestMap.init();

        tickHandlers.push(function(step) {

            forestGenerator.generate(
                forestMap,
                step,
                step > config.FOREST_BOOST_STEPS ? config.FOREST_BOOST : 1
            );

            _this.addForestMapToLayer(forestLayer, forestMap);

            forestMap = Filters.apply('forestMap', forestMap);
        });

        if (config.LOGS) {
            logTimeEvent('Forests initialized.');
        }
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
    };

    /**
     * @param {number} x
     * @param {number} y
     * @return {DisplayCell}
     */
    getDisplayCell = function(x, y) {

        if (typeof this.forestImagesCache[x + ',' + y] === 'undefined') {
            this.forestImagesCache[x + ',' + y] = new DisplayCell(
                this.forestColor,
                this.forestImages.randomElement()
            );
        }

        return this.forestImagesCache[x + ',' + y];
    }
}