class ForestsOperator {

    /**
     * @param {Matrix} biomes
     * @param {Array} tickHandlers
     * @param {Layer} forestLayer
     * @return {Array}
     */
    initForestGeneration = function(biomes, tickHandlers, forestLayer) {

        let _this = this,
            forestMap = new ForestMap(biomes);

        forestMap.init();

        if (_this.LOGS) {
            logTimeEvent('Forests initialized.');
        }

        tickHandlers.push(function(step) {

            forestMap.generate(
                step,
                step > config.FOREST_BOOST_STEPS ? config.FOREST_BOOST : 1
            );

            _this.addForestMapToLayer(forestLayer, forestMap);

            forestMap = Filters.apply('forestMap', forestMap);
        });

        return forestMap;
    };

    /**
     * @param {Layer} forestLayer
     * @param {ForestMap} forestMap
     */
    addForestMapToLayer = function(forestLayer, forestMap) {
        forestMap.foreach(function(x, y) {
            forestLayer.setTile(
                x, y,
                forestMap.filled(x, y) ? forestMap.getForestDisplayCell(x, y) : null
            );
        });
    };
}