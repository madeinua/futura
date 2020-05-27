class Grounds {

    GROUND_UNKNOWN = -1;
    GROUND_OCEAN = 0;
    GROUND_RIVER = 1;
    GROUND_LAKE = 2;
    GROUND_COAST = 3;
    GROUND_BEACH = 4;
    GROUND_TUNDRA = 5;
    GROUND_GRASS = 6;
    GROUND_DESERT = 7;
    GROUND_SAVANNA = 8;
    GROUND_TROPIC = 9;
    GROUND_SWAMP = 10;
    GROUND_TUNDRA_HILLS = 11;
    GROUND_GRASS_HILLS = 12;
    GROUND_DESERT_HILLS = 13;
    GROUND_SAVANNA_HILLS = 14;
    GROUND_ROCKS = 15;
    GROUND_ICE_ROCKS = 16;

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
        this.groundsConfig = this.getGroundsConfiguration();
    }

    /**
     * @param {Ground} ground
     * @param {number} altitude
     * @return {array}
     */
    getGroundColor(ground, altitude) {

        let colors = [],
            powAltitude = (altitude - 0.5) * 200;

        colors[this.GROUND_OCEAN] = '#003eb2';
        colors[this.GROUND_RIVER] = LightenDarkenColor('#74aece', powAltitude);
        colors[this.GROUND_LAKE] = LightenDarkenColor('#74aece', powAltitude);
        colors[this.GROUND_COAST] = LightenDarkenColor('#003eb2', - powAltitude);
        colors[this.GROUND_BEACH] = '#c2b281';
        colors[this.GROUND_TUNDRA] = LightenDarkenColor('#9c9f73', powAltitude);
        colors[this.GROUND_TUNDRA_HILLS] = LightenDarkenColor('#747658', -powAltitude);
        colors[this.GROUND_GRASS] = LightenDarkenColor('#659c29', powAltitude);
        colors[this.GROUND_GRASS_HILLS] = LightenDarkenColor('#518719', -powAltitude);
        colors[this.GROUND_DESERT] = LightenDarkenColor('#cec35d', powAltitude);
        colors[this.GROUND_DESERT_HILLS] = LightenDarkenColor('#af8a62', -powAltitude);
        colors[this.GROUND_SAVANNA] = LightenDarkenColor('#8f9e3f', powAltitude);
        colors[this.GROUND_SAVANNA_HILLS] = LightenDarkenColor('#7d7c3e', - powAltitude);
        colors[this.GROUND_TROPIC] = '#19b460';
        colors[this.GROUND_SWAMP] = '#258779';
        colors[this.GROUND_ROCKS] = LightenDarkenColor('#575757', powAltitude * 3);
        colors[this.GROUND_ICE_ROCKS] = LightenDarkenColor('#eeeeee', powAltitude * 5);
        colors[this.GROUND_UNKNOWN] = '#000000';

        let color = colors[ground.getType()];

        if (typeof color === 'undefined') {
            color = colors[this.GROUND_UNKNOWN];
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
    getGroundsConfiguration() {

        let groundsConfig = [];

        groundsConfig.push({
            key: this.GROUND_TUNDRA,
            h: [0, 0.33],
            t: [0, 0.33],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_GRASS,
            h: [0.33, 0.66],
            t: [0, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_SWAMP,
            h: [0.66, 1],
            t: [0, 0.33],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_SAVANNA,
            h: [0, 0.33],
            t: [0.33, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_DESERT,
            h: [0, 0.33],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_SAVANNA,
            h: [0.33, 0.66],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_GRASS,
            h: [0.66, 1],
            t: [0.33, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_TROPIC,
            h: [0.66, 1],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_TUNDRA_HILLS,
            h: [0, 0.33],
            t: [0, 0.33],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_GRASS_HILLS,
            h: [0.33, 1],
            t: [0, 0.66],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_SAVANNA_HILLS,
            h: [0, 0.33],
            t: [0.33, 0.66],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_DESERT_HILLS,
            h: [0, 0.33],
            t: [0.66, 1],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_SAVANNA_HILLS,
            h: [0.33, 1],
            t: [0.66, 1],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_ICE_ROCKS,
            h: [0, 1],
            t: [0, 0.5],
            a: [this.MAX_HILLS_LEVEL, this.MAX_MOUNTAINS_LEVEL]
        });

        groundsConfig.push({
            key: this.GROUND_ROCKS,
            h: [0, 1],
            t: [0.5, 1],
            a: [this.MAX_HILLS_LEVEL, this.MAX_MOUNTAINS_LEVEL]
        });

        return groundsConfig;
    }

    /**
     * @internal
     * @param {Array} fig
     * @param {number} index
     * @return {boolean}
     */
    checkGroundIndex = function (fig, index) {

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
    findGroundType(x, y) {

        let _this = this;

        if (_this.riversMap.filled(x, y)) {
            return _this.GROUND_RIVER;
        }

        if (_this.lakesMap.filled(x, y)) {
            return _this.GROUND_LAKE;
        }

        let altitude = _this.altitudeMap.getTile(x, y),
            temperature = _this.temperatureMap.getTile(x, y),
            humidity = _this.humidityMap.getTile(x, y);

        if (_this.oceanMap.filled(x, y)) {
            return _this.isCoast(altitude, temperature)
                ? _this.GROUND_COAST
                : _this.GROUND_OCEAN;
        }

        if (_this.isBeach(x, y, altitude, temperature, humidity)) {
            return _this.GROUND_BEACH;
        }

        let groundName = null;

        for (let i = 0; i < _this.groundsConfig.length; i++) {

            let cfg = _this.groundsConfig[i];

            if (
                _this.checkGroundIndex(cfg.h, humidity)
                && _this.checkGroundIndex(cfg.t, temperature)
                && _this.checkGroundIndex(cfg.a, altitude)
            ) {
                groundName = cfg.key;
                break;
            }
        }

        if (groundName === null) {
            throwError('Unknown ground. H:' + humidity + ' T:' + temperature + ' A:' + altitude);
            groundName = _this.GROUND_UNKNOWN;
        }

        return groundName;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @return {Ground}
     */
    getGround(x, y) {
        return new Ground(
            this.findGroundType(x, y)
        );
    }
}