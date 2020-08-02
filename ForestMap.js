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
                return this.config.FOREST_TUNDRA_GROWTH;
            case 'tundra-hills':
                return this.config.FOREST_TUNDRA_HILLS_GROWTH;
            case 'grass':
                return this.config.FOREST_GRASS_GROWTH;
            case 'grass-hills':
                return this.config.FOREST_GRASS_HILLS_GROWTH;
            case 'swamp':
                return this.config.FOREST_SWAMP_GROWTH;
            case 'rocks':
                return this.config.FOREST_ROCKS_GROWTH;
            case 'savanna':
                return this.config.FOREST_SAVANNA_GROWTH;
            case 'savanna-hills':
                return this.config.FOREST_SAVANNA_HILLS_GROWTH;
            case 'tropic':
                return this.config.FOREST_TROPICS_GROWTH;
        }

        return 0;
    }

    /**
     * @param {Biome} biome
     * @return {number}
     */
    getCreateChance(biome) {

        let _this = this,
            GT = _this.getCreateChanceByGround(
                biome.getName()
            );

        if (GT === 0) {
            return 0;
        }

        let NBR = _this.sumNeighbors(biome.x, biome.y, 2),
            forestType = _this.getForestType(biome),
            IH, IT, IA,
            K = _this.config.FOREST_GROWTH_SPEED,
            BC = _this.config.FOREST_BORN_CHANCE,
            GC = _this.config.FOREST_GROWTH_CHANCE;

        if (forestType === _this.config.FOREST_TEMPERATE) {
            IH = _this.ihTemperateMap.getTile(biome.x, biome.y);
            IT = _this.itTemperateMap.getTile(biome.x, biome.y);
            IA = _this.iaTemperateMap.getTile(biome.x, biome.y);
        } else if (forestType === _this.config.FOREST_TROPICAL) {
            IH = _this.ihTropicalMap.getTile(biome.x, biome.y);
            IT = _this.itTropicalMap.getTile(biome.x, biome.y);
            IA = _this.iaTropicalMap.getTile(biome.x, biome.y);
        }

        /**
         * K = growth speed coefficient
         * GT = ground type coefficient
         * BC = born chance (if no other forest-based tiles around)
         * GC = growth chance (if there are forest-based tiles around)
         * NBR = number of neighbours forests (filled tiles)
         * IH = coefficient of humidity
         * IT = coefficient of temperature
         * IA = coefficient of altitude
         */
        return K * GT * (BC + GC * NBR) * (IH + IT + IA);
    }

    /**
     * @param {Biome} biome
     * @return {number}
     */
    getDeadChance(biome) {

        let NBR = this.sumNeighbors(biome.x, biome.y, 2),
            DC = this.config.FOREST_DEAD_CHANCE,
            GC = this.config.FOREST_GROWTH_CHANCE,
            GT = this.getCreateChanceByGround(
                biome.getName()
            );

        /**
         * GC = growth chance (if there are forest-based tiles around)
         * NBR = number of neighbour forests (forest-filled tiles)
         * GT = ground type coefficient
         * DC = dead chance
         */
        return (100 + GT - GC * NBR) * DC;
    }

    /**
     * @return {BinaryMatrix}
     */
    generate() {

        let _this = this,
            updatedTiles = new BinaryMatrix(_this.getWidth(), _this.getHeight());

        _this.foreachFilled(function(x, y) {

            let deadChance = _this.getDeadChance(
                _this.biomes.getTile(x, y)
            );

            if (iAmLucky(deadChance)) {
                _this.setTile(x, y, false);
                updatedTiles.setTile(x, y, true);
            }
        });

        _this.foreachUnfilled(function(x, y) {

            let createChance = _this.getCreateChance(
                _this.biomes.getTile(x, y)
            );

            if (iAmLucky(createChance)) {
                _this.setTile(x, y, true);
                updatedTiles.setTile(x, y, true);
            }
        });

        return updatedTiles;
    }
}