class ForestMap extends BinaryMatrix {

    /** @var {Matrix} */
    biomes;

    /**
     * @param {Matrix} biomes
     * @return {ForestMap}
     */
    constructor(biomes) {

        super(config.worldSize, config.worldSize);

        this.biomes = biomes;

        this.forestColor = hexToRgb(config.FOREST_COLOR);
        this.forestImages = [];
        this.forestImagesCache = [];

        for (let i = 0; i < config.FOREST_IMAGES.length; i++) {
            this.forestImages.push(
                createImage(config.FOREST_IMAGES[i])
            );
        }
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
     * @param {Biome} biome
     * @return {number}
     */
    getForestType(biome) {
        return ['savanna', 'savanna-hills', 'tropic'].includes(
            biome.getName()
        ) ? config.FOREST_TEMPERATE : config.FOREST_TROPICAL;
    }

    /**
     * @param {string} groundName
     * @return {number}
     */
    getCreateChanceByGround(groundName) {
        switch(groundName) {
            case 'tundra':
                return config.FOREST_TUNDRA_GROWTH;
            case 'tundra-hills':
                return config.FOREST_TUNDRA_HILLS_GROWTH;
            case 'grass':
                return config.FOREST_GRASS_GROWTH;
            case 'grass-hills':
                return config.FOREST_GRASS_HILLS_GROWTH;
            case 'desert-hills':
                return config.FOREST_DESERT_HILLS_GROWTH;
            case 'swamp':
                return config.FOREST_SWAMP_GROWTH;
            case 'rocks':
                return config.FOREST_ROCKS_GROWTH;
            case 'savanna':
                return config.FOREST_SAVANNA_GROWTH;
            case 'savanna-hills':
                return config.FOREST_SAVANNA_HILLS_GROWTH;
            case 'tropic':
                return config.FOREST_TROPICS_GROWTH;
            case 'beach':
                return config.FOREST_BEACH_GROWTH;
        }

        return 0;
    }

    /**
     * @param {Biome} biome
     * @return {number} From 0 to 100
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
            BC = config.FOREST_BORN_CHANCE,
            GC = config.FOREST_GROWTH_CHANCE;

        if (forestType === config.FOREST_TEMPERATE) {
            IH = _this.ihTemperateMap.getTile(biome.x, biome.y);
            IT = _this.itTemperateMap.getTile(biome.x, biome.y);
            IA = _this.iaTemperateMap.getTile(biome.x, biome.y);
        } else if (forestType === config.FOREST_TROPICAL) {
            IH = _this.ihTropicalMap.getTile(biome.x, biome.y);
            IT = _this.itTropicalMap.getTile(biome.x, biome.y);
            IA = _this.iaTropicalMap.getTile(biome.x, biome.y);
        }

        if (biome.getDistanceToWater() > 0) {
            let inc = Math.pow(biome.getDistanceToWater(), 2);
            BC += config.FOREST_BORN_NEAR_WATER / inc;
            GC += config.FOREST_GROWTH_NEAR_WATER / inc;
        }

        /**
         * GT = ground type coefficient
         * BC = born chance (if no other forest-based tiles around)
         * GC = growth chance (if there are forest-based tiles around)
         * NBR = number of neighbors forests (filled tiles)
         * IH = coefficient of humidity
         * IT = coefficient of temperature
         * IA = coefficient of altitude
         */
        return Math.min(100, GT * (BC + GC * NBR) * (IH + IT + IA));
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

        _this.biomes.foreachNeighbors(x, y, radius, function(nx, ny) {
            if (_this.biomes.getTile(nx, ny).getName() === biomeName) {
                found = true;
                return true;
            }
        }, true);

        return found;
    }

    /**
     * @param {Biome} biome
     * @return {number} From 0 to 100
     */
    getDeadChance(biome) {

        let NBR = this.sumNeighbors(biome.x, biome.y, 2);

        // if no neighbor forest
        if (NBR === 0 || NBR > 5) {
            return 0;
        }

        let DC = config.FOREST_DEAD_CHANCE, // dead chance
            GC = config.FOREST_GROWTH_CHANCE; // growth chance (if there are forest-based tiles around)

        return (100 - GC) * DC;
    }

    /**
     * @param {number} step
     * @param {number} multiply
     */
    generate(step, multiply = 1) {

        let _this = this;

        _this.foreachFilled(function(x, y) {

            let deadChance = _this.getDeadChance(
                _this.biomes.getTile(x, y)
            );

            if (deadChance === 0) {
                return;
            }

            deadChance *= multiply;

            if (iAmLucky(deadChance)) {
                _this.unfill(x, y);
            }
        });

        _this.foreachUnfilled(function(x, y) {

            let createChance = _this.getCreateChance(
                _this.biomes.getTile(x, y)
            );

            if (createChance === 0) {
                return;
            }

            createChance *= multiply;

            if (iAmLucky(createChance)) {
                _this.fill(x, y);
            }
        });
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {DisplayCell}
     */
    getForestDisplayCell = function(x, y) {

        if (typeof this.forestImagesCache[x + ',' + y] === 'undefined') {
            this.forestImagesCache[x + ',' + y] = new DisplayCell(
                this.forestColor,
                this.forestImages.randomElement()
            );
        }

        return this.forestImagesCache[x + ',' + y];
    }
}