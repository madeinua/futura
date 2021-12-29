class BiomesOperator {

    /** @var {Matrix} */
    biomes;

    /** @var {AltitudeMap} */
    altitudeMap;

    /** @var {CoastMap} */
    coastMap;

    /** @var {BinaryMatrix} */
    freshWaterMap;

    /** @var {TemperatureMap} */
    temperatureMap;

    /** @var {HumidityMap} */
    humidityMap;

    /** @var {Object} */
    biomesConfig;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {CoastMap} coastMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @param {Layer} biomesLayer
     */
    constructor(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, biomesLayer) {

        this.biomes = new Matrix();
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.coastMap = coastMap;
        this.freshWaterMap = freshWaterMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.biomesConfig = this.getBiomesConfiguration();

        let _this = this;

        altitudeMap.foreach(function(x, y) {
            _this.biomes.setTile(x, y, _this._getBiome(x, y));
        });

        if (config.LOGS) {
            logTimeEvent('Biomes calculated');
        }

        this.addBiomesToLayer(biomesLayer);

        this.biomes = Filters.apply('biomes', this.biomes);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} altitude
     * @param {number} temperature
     * @param {number} humidity
     * @return {boolean}
     */
    isBeach(x, y, altitude, temperature, humidity) {
        return altitude > config.MAX_COAST_LEVEL
            && altitude <= config.MAX_BEACH_LEVEL
            - (temperature * config.BEACH_TEMPERATURE_RATIO * 2 - config.BEACH_TEMPERATURE_RATIO)
            - (humidity * config.BEACH_HUMIDITY_RATIO * 2 - config.BEACH_HUMIDITY_RATIO)
            && this.oceanMap.aroundFilled(x, y, config.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }

    /**
     * @internal
     * @return {[]}
     */
    getBiomesConfiguration() {

        let biomesConfig = [];

        biomesConfig.push({
            class: Biome_Tundra,
            h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
            t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Grass,
            h: [config.NORMAL_HUMIDITY, config.HIGH_HUMIDITY],
            t: [config.MIN_TEMPERATURE, config.HIGH_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Swamp,
            h: [config.HIGH_HUMIDITY, config.MAX_HUMIDITY],
            t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna,
            h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
            t: [config.NORMAL_TEMPERATURE, config.HIGH_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Desert,
            h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
            t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna,
            h: [config.NORMAL_HUMIDITY, config.HIGH_HUMIDITY],
            t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Grass,
            h: [config.HIGH_HUMIDITY, config.MAX_HUMIDITY],
            t: [config.NORMAL_TEMPERATURE, config.HIGH_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Tropic,
            h: [config.HIGH_HUMIDITY, config.MAX_HUMIDITY],
            t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
            a: [0, config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Tundra_Hills,
            h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
            t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
            a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Grass_Hills,
            h: [config.NORMAL_HUMIDITY, config.MAX_HUMIDITY],
            t: [config.MIN_TEMPERATURE, config.HIGH_TEMPERATURE],
            a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna_Hills,
            h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
            t: [config.NORMAL_TEMPERATURE, config.HIGH_TEMPERATURE],
            a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Desert_Hills,
            h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
            t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
            a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna_Hills,
            h: [config.NORMAL_HUMIDITY, config.MAX_HUMIDITY],
            t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
            a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Ice_Rocks,
            h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
            t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
            a: [config.MAX_HILLS_LEVEL, config.MAX_MOUNTAINS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Rocks,
            h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
            t: [config.NORMAL_TEMPERATURE, config.MAX_TEMPERATURE],
            a: [config.MAX_HILLS_LEVEL, config.MAX_MOUNTAINS_LEVEL]
        });

        return biomesConfig;
    }

    /**
     * @internal
     * @param {Array} fig
     * @param {number} index
     * @return {boolean}
     */
    checkBiomeIndex = function(fig, index) {

        if (fig[0] === 0 && index === 0) {
            return true;
        } else if (index > fig[0] && index <= fig[1]) {
            return true;
        }

        return false;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @return {Biome}
     */
    _getBiome(x, y) {

        let distanceToWater = this.freshWaterMap.distanceTo(x, y, 5);
        distanceToWater = distanceToWater > 100 ? 0 : distanceToWater;

        let args = {
            altitude: this.altitudeMap.getTile(x, y),
            temperature: this.temperatureMap.getTile(x, y),
            humidity: this.humidityMap.getTile(x, y),
            distanceToWater: distanceToWater
        };

        if (this.freshWaterMap.filled(x, y)) {
            return new Biome_Water(x, y, args);
        }

        if (this.oceanMap.filled(x, y)) {
            return this.coastMap.isCoast(args.altitude, args.temperature)
                ? new Biome_Coast(x, y, args)
                : new Biome_Ocean(x, y, args);
        }

        if (this.isBeach(x, y, args.altitude, args.temperature, args.humidity)) {
            return new Biome_Beach(x, y, args);
        }

        for (let i = 0; i < this.biomesConfig.length; i++) {

            let cfg = this.biomesConfig[i];

            if (
                this.checkBiomeIndex(cfg.h, args.humidity)
                && this.checkBiomeIndex(cfg.t, args.temperature)
                && this.checkBiomeIndex(cfg.a, args.altitude)
            ) {
                return new cfg.class(x, y, args);
            }
        }

        return null;
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

    /**
     * @param {number} x
     * @param {number} y
     * @returns {false|Biome}
     */
    getBiome(x, y) {
        return this.biomes.getTile(x, y);
    }

    /**
     * @param {string} biomeName
     * @returns {BinaryMatrix}
     */
    getSurfaceByBiomeName(biomeName) {

        let biomes = this.biomes,
            surface = new BinaryMatrix(1);

        this.altitudeMap.foreach(function(x, y) {
            if (biomes.getTile(x, y).getName() === biomeName) {
                surface.fill(x, y);
            }
        });

        return surface;
    }
}