class BiomesOperator {

    /** @var {Matrix} */
    biomes;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {CoastMap} coastMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @param {Layer} biomesLayer
     */
    initBiomesGeneration = function(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, biomesLayer) {

        this.biomes = new Matrix(config.WORLD_SIZE, config.WORLD_SIZE);

        let _this = this,
            biomesGenerator = new Biomes(
                altitudeMap,
                oceanMap,
                coastMap,
                freshWaterMap,
                temperatureMap,
                humidityMap
            );

        altitudeMap.foreach(function(x, y) {
            _this.biomes.setTile(x, y, biomesGenerator.getBiome(x, y));
        });

        if (config.LOGS) {
            logTimeEvent('Biomes calculated');
        }

        _this.addBiomesToLayer(biomesLayer);

        _this.biomes = Filters.apply('biomes', _this.biomes);
    }

    /**
     * @param {Layer} biomesLayer
     */
    addBiomesToLayer = function(biomesLayer) {

        let _this = this;

        _this.biomes.foreach(function(x, y) {
            biomesLayer.setTile(
                x, y,
                _this.biomes.getTile(x, y).getHexColor()
            );
        });
    }

    /**
     * @return {Matrix}
     */
    getBiomes() {
        return this.biomes;
    }
}