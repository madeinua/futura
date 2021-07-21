class Biomes {

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
    config;

    /** @var {Object} */
    biomesConfig;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {CoastMap} coastMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @param {Object} config
     */
    constructor(altitudeMap, oceanMap, coastMap, freshWaterMap, temperatureMap, humidityMap, config) {

        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.coastMap = coastMap;
        this.freshWaterMap = freshWaterMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.config = config;
        this.biomesConfig = this.getBiomesConfiguration();
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
        return altitude > this.config.MAX_COAST_LEVEL
            && altitude <= this.config.MAX_BEACH_LEVEL
            - (temperature * this.config.BEACH_TEMPERATURE_RATIO * 2 - this.config.BEACH_TEMPERATURE_RATIO)
            - (humidity * this.config.BEACH_HUMIDITY_RATIO * 2 - this.config.BEACH_HUMIDITY_RATIO)
            && this.oceanMap.aroundFilled(x, y, this.config.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }

    /**
     * @internal
     * @return {[]}
     */
    getBiomesConfiguration() {

        let biomesConfig = [];

        biomesConfig.push({
            class: Biome_Tundra,
            h: [this.config.MIN_HUMIDITY, this.config.NORMAL_HUMIDITY],
            t: [this.config.MIN_TEMPERATURE, this.config.NORMAL_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Grass,
            h: [this.config.NORMAL_HUMIDITY, this.config.HIGH_HUMIDITY],
            t: [this.config.MIN_TEMPERATURE, this.config.HIGH_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Swamp,
            h: [this.config.HIGH_HUMIDITY, this.config.MAX_HUMIDITY],
            t: [this.config.MIN_TEMPERATURE, this.config.NORMAL_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna,
            h: [this.config.MIN_HUMIDITY, this.config.NORMAL_HUMIDITY],
            t: [this.config.NORMAL_TEMPERATURE, this.config.HIGH_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Desert,
            h: [this.config.MIN_HUMIDITY, this.config.NORMAL_HUMIDITY],
            t: [this.config.HIGH_TEMPERATURE, this.config.MAX_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna,
            h: [this.config.NORMAL_HUMIDITY, this.config.HIGH_HUMIDITY],
            t: [this.config.HIGH_TEMPERATURE, this.config.MAX_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Grass,
            h: [this.config.HIGH_HUMIDITY, this.config.MAX_HUMIDITY],
            t: [this.config.NORMAL_TEMPERATURE, this.config.HIGH_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Tropic,
            h: [this.config.HIGH_HUMIDITY, this.config.MAX_HUMIDITY],
            t: [this.config.HIGH_TEMPERATURE, this.config.MAX_TEMPERATURE],
            a: [0, this.config.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Tundra_Hills,
            h: [this.config.MIN_HUMIDITY, this.config.NORMAL_HUMIDITY],
            t: [this.config.MIN_TEMPERATURE, this.config.NORMAL_TEMPERATURE],
            a: [this.config.MAX_LOWLAND_LEVEL, this.config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Grass_Hills,
            h: [this.config.NORMAL_HUMIDITY, this.config.MAX_HUMIDITY],
            t: [this.config.MIN_TEMPERATURE, this.config.HIGH_TEMPERATURE],
            a: [this.config.MAX_LOWLAND_LEVEL, this.config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna_Hills,
            h: [this.config.MIN_HUMIDITY, this.config.NORMAL_HUMIDITY],
            t: [this.config.NORMAL_TEMPERATURE, this.config.HIGH_TEMPERATURE],
            a: [this.config.MAX_LOWLAND_LEVEL, this.config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Desert_Hills,
            h: [this.config.MIN_HUMIDITY, this.config.NORMAL_HUMIDITY],
            t: [this.config.HIGH_TEMPERATURE, this.config.MAX_TEMPERATURE],
            a: [this.config.MAX_LOWLAND_LEVEL, this.config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Savanna_Hills,
            h: [this.config.NORMAL_HUMIDITY, this.config.MAX_HUMIDITY],
            t: [this.config.HIGH_TEMPERATURE, this.config.MAX_TEMPERATURE],
            a: [this.config.MAX_LOWLAND_LEVEL, this.config.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Ice_Rocks,
            h: [this.config.MIN_HUMIDITY, this.config.MAX_HUMIDITY],
            t: [this.config.MIN_TEMPERATURE, this.config.NORMAL_TEMPERATURE],
            a: [this.config.MAX_HILLS_LEVEL, this.config.MAX_MOUNTAINS_LEVEL]
        });

        biomesConfig.push({
            class: Biome_Rocks,
            h: [this.config.MIN_HUMIDITY, this.config.MAX_HUMIDITY],
            t: [this.config.NORMAL_TEMPERATURE, this.config.MAX_TEMPERATURE],
            a: [this.config.MAX_HILLS_LEVEL, this.config.MAX_MOUNTAINS_LEVEL]
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
    getBiome(x, y) {

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
}