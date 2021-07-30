class ForestsOperator {

    /**
     * @param {Matrix} biomes
     * @param {Array} tickHandlers
     * @param {Layer} forestLayer
     * @return {Array}
     */
    initForestGeneration = function(biomes, tickHandlers, forestLayer) {

        let _this = this,
            forestMap = new ForestMap(biomes, config);

        forestMap.init();

        if (_this.logs) {
            logTimeEvent('Forests initialized.');
        }

        tickHandlers.push(function(step) {

            let multiply = step > _this.FOREST_PRE_GENERATION_STEPS
                ? _this.FOREST_PRE_GENERATION_MULTIPLY
                : 1;

            forestMap.generate(step, multiply);

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