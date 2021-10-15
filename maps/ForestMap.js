class ForestMap extends BinaryMatrix {

    /** @var {Matrix} */
    biomes;

    /**
     * @param {Matrix} biomes
     * @return {ForestMap}
     */
    constructor(biomes) {

        super(config.WORLD_SIZE, config.WORLD_SIZE);

        this.biomes = biomes;
    }

    init() {

        this.ihTemperateMap = this.createIdealHumidityMap(config.FOREST_BEST_TEMPERATE_HUMIDITY);
        this.itTemperateMap = this.createIdealTemperatureMap(config.FOREST_BEST_TEMPERATE_TEMPERATURE);
        this.iaTemperateMap = this.createIdealAltitudeMap(config.FOREST_BEST_TEMPERATE_ALTITUDE);

        this.ihTropicalMap = this.createIdealHumidityMap(config.FOREST_BEST_TROPICAL_HUMIDITY);
        this.itTropicalMap = this.createIdealTemperatureMap(config.FOREST_BEST_TROPICAL_TEMPERATURE);
        this.iaTropicalMap = this.createIdealAltitudeMap(config.FOREST_BEST_TROPICAL_ALTITUDE);
    }

    /**
     * @param {number} bestHumidity
     * @return {NumericMatrix}
     */
    createIdealHumidityMap(bestHumidity) {

        let _this = this,
            ihMap = new NumericMatrix(_this.getWidth(), _this.getHeight());

        ihMap.foreach(function(x, y) {
            ihMap.setTile(
                x, y,
                Math.max(0.01, fromMiddleFractionValue(
                    bestHumidity,
                    _this.biomes.getTile(x, y).getHumidity()
                ))
            );
        });

        return ihMap;
    }

    /**
     * @param {number} bestTemperature
     * @return {NumericMatrix}
     */
    createIdealTemperatureMap(bestTemperature) {

        let _this = this,
            itMap = new NumericMatrix(_this.getWidth(), _this.getHeight());

        itMap.foreach(function(x, y) {
            itMap.setTile(
                x, y,
                Math.max(0.01, fromMiddleFractionValue(
                    bestTemperature,
                    _this.biomes.getTile(x, y).getTemperature()
                ))
            );
        });

        return itMap;
    }

    /**
     * @param {number} bestAltitude
     * @return {NumericMatrix}
     */
    createIdealAltitudeMap(bestAltitude) {

        let _this = this,
            iaMap = new NumericMatrix(_this.getWidth(), _this.getHeight());

        iaMap.foreach(function(x, y) {
            iaMap.setTile(
                x, y,
                Math.max(0.01, fromMiddleFractionValue(
                    bestAltitude,
                    _this.biomes.getTile(x, y).getAltitude()
                ))
            );
        });

        return iaMap;
    }

    /**
     * @param {string} biomeName
     * @param {number} x
     * @param {number} y
     * @param {number} radius
     * @return {boolean}
     */
    isBiomeAround(biomeName, x, y, radius) {

        let found = false,
            _this = this;

        _this.biomes.foreachAroundRadius(x, y, radius, function(nx, ny) {
            if (_this.biomes.getTile(nx, ny).getName() === biomeName) {
                found = true;
                return true;
            }
        }, true);

        return found;
    }
}