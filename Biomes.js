class Biomes {

    SMOOTHING = false;

    BIOME_UNKNOWN = -1;
    BIOME_OCEAN = 0;
    BIOME_RIVER = 1;
    BIOME_LAKE = 2;
    BIOME_COAST = 3;
    BIOME_BEACH = 4;
    BIOME_TUNDRA = 5;
    BIOME_GRASS = 6;
    BIOME_DESERT = 7;
    BIOME_SAVANNA = 8;
    BIOME_TROPIC = 9;
    BIOME_SWAMP = 10;
    BIOME_TUNDRA_HILLS = 11;
    BIOME_GRASS_HILLS = 12;
    BIOME_DESERT_HILLS = 13;
    BIOME_SAVANNA_HILLS = 14;
    BIOME_ROCKS = 15;
    BIOME_ICE_ROCKS = 16;

    MAX_OCEAN_LEVEL = 0.25;
    MAX_COAST_LEVEL = 0.3;
    MAX_BEACH_LEVEL = 0.32;
    MAX_LOWLAND_LEVEL = 0.43;
    MAX_HILLS_LEVEL = 0.55;
    MAX_MOUNTAINS_LEVEL = 1;

    COAST_TEMPERATURE_RATIO = 0.05;
    BEACH_TEMPERATURE_RATIO = -0.02;
    BEACH_HUMIDITY_RATIO = 0.01;

    MAX_BEACH_DISTANCE_FROM_OCEAN = 5;

    // @TODO
    FOREST_TROPICAL = 1;
    FOREST_TEMPARATE = 2;
    FOREST_BOREAL = 3;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     */
    constructor(altitudeMap, oceanMap, riversMap, lakesMap, temperatureMap, humidityMap) {
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.biomesConfig = this.getBiomesConfiguration();
    }

    /**
     * @param {Biome} biome
     * @param {number} altitude
     * @param {number} temperature
     * @param {number} humidity
     * @return {array}
     */
    getBiomeColor(biome, altitude, temperature, humidity) {

        let _this = this,
            colors = [],
            powAltitude = (altitude - 0.5) * 200,
            powTemperature = (temperature - 0.5) * 60;

        if (_this.SMOOTHING) {

            colors[_this.BIOME_OCEAN] = '#0687cb';
            colors[_this.BIOME_RIVER] = LightenDarkenColor('#74aece', powAltitude);
            colors[_this.BIOME_LAKE] = LightenDarkenColor('#74aece', powAltitude);
            colors[_this.BIOME_COAST] = LightenDarkenColor('#81e6ff', (altitude - 0.5) * 150);
            colors[_this.BIOME_BEACH] = LightenDarkenColor('#c2b281', powTemperature);
            colors[_this.BIOME_TUNDRA] = LightenDarkenColor('#9c9f73', powAltitude);
            colors[_this.BIOME_TUNDRA_HILLS] = LightenDarkenColor('#747658', -powAltitude);
            colors[_this.BIOME_GRASS] = LightenDarkenColor('#618a19', powAltitude);
            colors[_this.BIOME_GRASS_HILLS] = LightenDarkenColor('#486612', -powAltitude);
            colors[_this.BIOME_DESERT] = LightenDarkenColor('#e3ca78', powAltitude);
            colors[_this.BIOME_DESERT_HILLS] = LightenDarkenColor('#c4ae68', -powAltitude);
            colors[_this.BIOME_SAVANNA] = LightenDarkenColor('#bcca5d', powAltitude);
            colors[_this.BIOME_SAVANNA_HILLS] = LightenDarkenColor('#9ba74d', -powAltitude);
            colors[_this.BIOME_TROPIC] = LightenDarkenColor('#19b460', powAltitude);
            colors[_this.BIOME_SWAMP] = LightenDarkenColor('#258779', powAltitude);
            colors[_this.BIOME_ROCKS] = LightenDarkenColor('#575757', powAltitude * 3);
            colors[_this.BIOME_ICE_ROCKS] = LightenDarkenColor('#eeeeee', powAltitude * 5);

        } else {

            colors[_this.BIOME_OCEAN] = '#003eb2';
            colors[_this.BIOME_RIVER] = LightenDarkenColor('#74aece', powAltitude);
            colors[_this.BIOME_LAKE] = LightenDarkenColor('#74aece', powAltitude);
            colors[_this.BIOME_COAST] = LightenDarkenColor('#003eb2', - powAltitude);
            colors[_this.BIOME_BEACH] = '#c2b281';
            colors[_this.BIOME_TUNDRA] = LightenDarkenColor('#9c9f73', powAltitude);
            colors[_this.BIOME_TUNDRA_HILLS] = LightenDarkenColor('#747658', -powAltitude);
            colors[_this.BIOME_GRASS] = LightenDarkenColor('#3c6114', powAltitude);
            colors[_this.BIOME_GRASS_HILLS] = LightenDarkenColor('#1e3900', -powAltitude);
            colors[_this.BIOME_DESERT] = LightenDarkenColor('#ceb25d', powAltitude);
            colors[_this.BIOME_DESERT_HILLS] = LightenDarkenColor('#ad9d6c', -powAltitude);
            colors[_this.BIOME_SAVANNA] = LightenDarkenColor('#8f9e3f', powAltitude);
            colors[_this.BIOME_SAVANNA_HILLS] = LightenDarkenColor('#7d7c3e', - powAltitude);
            colors[_this.BIOME_TROPIC] = '#19b460';
            colors[_this.BIOME_SWAMP] = '#258779';
            colors[_this.BIOME_ROCKS] = LightenDarkenColor('#575757', powAltitude * 3);
            colors[_this.BIOME_ICE_ROCKS] = LightenDarkenColor('#eeeeee', powAltitude * 5);
        }

        colors[_this.BIOME_UNKNOWN] = '#000000';

        let color = colors[biome.getType()];

        if (typeof color === 'undefined') {
            color = colors[_this.BIOME_UNKNOWN];
        }

        return hexToRgb(color);
    }

    /**
     * @param {number} altitude
     * @param {number} temperature
     * @return {boolean}
     */
    isCoast(altitude, temperature) {
        return altitude > this.MAX_OCEAN_LEVEL
            - (temperature * this.COAST_TEMPERATURE_RATIO * 2 - this.COAST_TEMPERATURE_RATIO)
            && altitude <= this.MAX_COAST_LEVEL;
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
        return altitude > this.MAX_COAST_LEVEL
            && altitude <= this.MAX_BEACH_LEVEL
            - (temperature * this.BEACH_TEMPERATURE_RATIO * 2 - this.BEACH_TEMPERATURE_RATIO)
            - (humidity * this.BEACH_HUMIDITY_RATIO * 2 - this.BEACH_HUMIDITY_RATIO)
            && this.oceanMap.aroundFilled(x, y, this.MAX_BEACH_DISTANCE_FROM_OCEAN);
    }

    /**
     * @internal
     * @return {[]}
     */
    getBiomesConfiguration() {

        let biomesConfig = [];

        biomesConfig.push({
            key: this.BIOME_TUNDRA,
            h: [0, 0.33],
            t: [0, 0.33],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_GRASS,
            h: [0.33, 0.66],
            t: [0, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_SWAMP,
            h: [0.66, 1],
            t: [0, 0.33],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_SAVANNA,
            h: [0, 0.33],
            t: [0.33, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_DESERT,
            h: [0, 0.33],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_SAVANNA,
            h: [0.33, 0.66],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_GRASS,
            h: [0.66, 1],
            t: [0.33, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_TROPIC,
            h: [0.66, 1],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_TUNDRA_HILLS,
            h: [0, 0.33],
            t: [0, 0.33],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_GRASS_HILLS,
            h: [0.33, 1],
            t: [0, 0.66],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_SAVANNA_HILLS,
            h: [0, 0.33],
            t: [0.33, 0.66],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_DESERT_HILLS,
            h: [0, 0.33],
            t: [0.66, 1],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_SAVANNA_HILLS,
            h: [0.33, 1],
            t: [0.66, 1],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_ICE_ROCKS,
            h: [0, 1],
            t: [0, 0.5],
            a: [this.MAX_HILLS_LEVEL, this.MAX_MOUNTAINS_LEVEL]
        });

        biomesConfig.push({
            key: this.BIOME_ROCKS,
            h: [0, 1],
            t: [0.5, 1],
            a: [this.MAX_HILLS_LEVEL, this.MAX_MOUNTAINS_LEVEL]
        });

        return biomesConfig;
    }

    /**
     * @internal
     * @param {Array} fig
     * @param {number} index
     * @return {boolean}
     */
    checkBiomeIndex = function (fig, index) {

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
     * @return {number}
     */
    findBiomeType(x, y) {

        let _this = this;

        if (_this.riversMap.filled(x, y)) {
            return _this.BIOME_RIVER;
        }

        if (_this.lakesMap.filled(x, y)) {
            return _this.BIOME_LAKE;
        }

        let altitude = _this.altitudeMap.getTile(x, y),
            temperature = _this.temperatureMap.getTile(x, y),
            humidity = _this.humidityMap.getTile(x, y);

        if (_this.oceanMap.filled(x, y)) {
            return _this.isCoast(altitude, temperature)
                ? _this.BIOME_COAST
                : _this.BIOME_OCEAN;
        }

        if (_this.isBeach(x, y, altitude, temperature, humidity)) {
            return _this.BIOME_BEACH;
        }

        let biomeName = null;

        for (let i = 0; i < _this.biomesConfig.length; i++) {

            let cfg = _this.biomesConfig[i];

            if (
                _this.checkBiomeIndex(cfg.h, humidity)
                && _this.checkBiomeIndex(cfg.t, temperature)
                && _this.checkBiomeIndex(cfg.a, altitude)
            ) {
                biomeName = cfg.key;
                break;
            }
        }

        if (biomeName === null) {
            throwError('Unknown biome. H:' + humidity + ' T:' + temperature + ' A:' + altitude);
            biomeName = _this.BIOME_UNKNOWN;
        }

        return biomeName;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @return {Biome}
     */
    getBiome(x, y) {
        return new Biome(
            this.findBiomeType(x, y)
        );
    }
}