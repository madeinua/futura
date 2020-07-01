class ForestMap extends BinaryMatrix {

    biomes;
    config;

    /**
     * @param {Matrix} biomes
     * @param {Object} config
     * @return {ForestMap}
     */
    constructor(biomes, config) {

        super(config.worldSize, config.worldSize);

        this.biomes = biomes;
        this.config = config;
    }

    init() {

        this.ihTemperateMap = this.createIdealHumidityMap(this.config.FOREST_BEST_TEMPERATE_HUMIDITY);
        this.itTemperateMap = this.createIdealTemperatureMap(this.config.FOREST_BEST_TEMPERATE_TEMPERATURE);
        this.iaTemperateMap = this.createIdealAltitudeMap(this.config.FOREST_BEST_TEMPERATE_ALTITUDE);

        this.ihTropicalMap = this.createIdealHumidityMap(this.config.FOREST_BEST_TROPICAL_HUMIDITY);
        this.itTropicalMap = this.createIdealTemperatureMap(this.config.FOREST_BEST_TROPICAL_TEMPERATURE);
        this.iaTropicalMap = this.createIdealAltitudeMap(this.config.FOREST_BEST_TROPICAL_ALTITUDE);
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
     * @param {Biome} biome
     * @return {number}
     */
    getForestType(biome) {
        return ['savanna', 'savanna-hills', 'tropic'].includes(
            biome.getName()
        ) ? this.config.FOREST_TEMPERATE : this.config.FOREST_TROPICAL;
    }

    /**
     * @param {string} groundName
     * @return {number}
     */
    getCreateChanceByGround(groundName) {
        switch(groundName) {
            case 'tundra':
                return 0.3;
            case 'tundra-hills':
                return 0.2;
            case 'grass':
                return 0.8;
            case 'grass-hills':
                return 1;
            case 'swamp':
                return 0.2;
            case 'rocks':
                return 0.2;
            case 'savanna':
                return 0.3;
            case 'savanna-hills':
                return 0.2;
            case 'tropic':
                return 1;
        }

        return 0;
    }

    /**
     * @param {Biome} biome
     * @return {number}
     */
    getCreateChance(biome) {

        let _this = this,
            K1 = _this.getCreateChanceByGround(biome.getName());

        if (K1 === 0) {
            return 0;
        }

        let FA = _this.sumNeighbors(biome.x, biome.y, 2),
            forestType = _this.getForestType(biome),
            IH, IT, IA;

        if (forestType === _this.config.FOREST_TEMPERATE) {
            IH = _this.ihTemperateMap.getTile(biome.x, biome.y);
            IT = _this.itTemperateMap.getTile(biome.x, biome.y);
            IA = _this.iaTemperateMap.getTile(biome.x, biome.y);
        } else if (forestType === _this.config.FOREST_TROPICAL) {
            IH = _this.ihTropicalMap.getTile(biome.x, biome.y);
            IT = _this.itTropicalMap.getTile(biome.x, biome.y);
            IA = _this.iaTropicalMap.getTile(biome.x, biome.y);
        }

        return 2 * (1 + 5 * FA) * IH * IT * IA * K1;
    }

    /**
     * @param {Biome} biome
     * @return {number}
     */
    getDeadChance(biome) {

        let FA = this.sumNeighbors(biome.x, biome.y, 2),
            K1 = this.getForestType(biome) === this.config.FOREST_TEMPERATE ? 1 : 3;

        return ((100 - 4 * FA) / K1) * this.config.FOREST_DEAD_CHANCE;
    }

    tickGeneration() {

        let _this = this;

        _this.foreachFilled(function(x, y) {

            let deadChance = _this.getDeadChance(
                _this.biomes.getTile(x, y)
            );

            _this.setTile(x, y, !flipCoin(deadChance));
        });

        _this.foreachUnfilled(function(x, y) {

            let createChance = _this.getCreateChance(
                _this.biomes.getTile(x, y)
            );

            _this.setTile(x, y, flipCoin(createChance));
        });
    }
}