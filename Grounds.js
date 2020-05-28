class Grounds {

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
            class: Ground_Tundra,
            h: [0, 0.33],
            t: [0, 0.33],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Grass,
            h: [0.33, 0.66],
            t: [0, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Swamp,
            h: [0.66, 1],
            t: [0, 0.33],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Savanna,
            h: [0, 0.33],
            t: [0.33, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Desert,
            h: [0, 0.33],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Savanna,
            h: [0.33, 0.66],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Grass,
            h: [0.66, 1],
            t: [0.33, 0.66],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Tropic,
            h: [0.66, 1],
            t: [0.66, 1],
            a: [0, this.MAX_LOWLAND_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Tundra_Hills,
            h: [0, 0.33],
            t: [0, 0.33],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Grass_Hills,
            h: [0.33, 1],
            t: [0, 0.66],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Savanna_Hills,
            h: [0, 0.33],
            t: [0.33, 0.66],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Desert_Hills,
            h: [0, 0.33],
            t: [0.66, 1],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Savanna_Hills,
            h: [0.33, 1],
            t: [0.66, 1],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Ice_Rocks,
            h: [0, 1],
            t: [0, 0.5],
            a: [this.MAX_HILLS_LEVEL, this.MAX_MOUNTAINS_LEVEL]
        });

        groundsConfig.push({
            class: Ground_Rocks,
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
    checkGroundIndex = function(fig, index) {

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
     * @return {Ground}
     */
    getGround(x, y) {

        let _this = this,
            altitude = this.altitudeMap.getTile(x, y);

        if (_this.riversMap.filled(x, y)) {
            return new Ground_River(altitude);
        }

        if (_this.lakesMap.filled(x, y)) {
            return new Ground_Lake(altitude);
        }

        let temperature = _this.temperatureMap.getTile(x, y);

        if (_this.oceanMap.filled(x, y)) {
            return _this.isCoast(altitude, temperature)
                ? new Ground_Coast(altitude)
                : new Ground_Ocean(altitude);
        }

        let humidity = _this.humidityMap.getTile(x, y);

        if (_this.isBeach(x, y, altitude, temperature, humidity)) {
            return new Ground_Beach(altitude);
        }

        for (let i = 0; i < _this.groundsConfig.length; i++) {

            let cfg = _this.groundsConfig[i];

            if (
                _this.checkGroundIndex(cfg.h, humidity)
                && _this.checkGroundIndex(cfg.t, temperature)
                && _this.checkGroundIndex(cfg.a, altitude)
            ) {
                return new cfg.class(altitude);
            }
        }

        return null
    }
}

class Ground {

    /**
     * @param {number} altitude
     */
    constructor(altitude) {
        this.altitude = altitude;
    }

    /**
     * @return {string}
     */
    getColor() {
        return '#FFFFFF';
    }
}

class Ground_River extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#74aece', (this.altitude - 0.5) * 200);
    }
}

class Ground_Lake extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#74aece', (this.altitude - 0.5) * 180);
    }
}

class Ground_Coast extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#003eb2', -(this.altitude - 0.5) * 200);
    }
}

class Ground_Ocean extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return '#003eb2';
    }
}

class Ground_Beach extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return '#c2b281';
    }
}

class Ground_Tundra extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#9c9f73', (this.altitude - 0.5) * 200);
    }
}

class Ground_Tundra_Hills extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#686a54', -(this.altitude - 0.5) * 200);
    }
}

class Ground_Grass extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#659c29', (this.altitude - 0.5) * 200);
    }
}

class Ground_Grass_Hills extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#536f34', -(this.altitude - 0.5) * 200);
    }
}

class Ground_Savanna extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#8f9e3f', (this.altitude - 0.5) * 200);
    }
}

class Ground_Savanna_Hills extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#7d7c3e', -(this.altitude - 0.5) * 200);
    }
}

class Ground_Desert extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#cec35d', (this.altitude - 0.5) * 200);
    }
}

class Ground_Desert_Hills extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#af8a62', -(this.altitude - 0.5) * 200);
    }
}

class Ground_Tropic extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return '#19b460';
    }
}

class Ground_Swamp extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return '#258779';
    }
}

class Ground_Rocks extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#727272', (this.altitude - 0.5) * 600);
    }
}

class Ground_Ice_Rocks extends Ground {

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#eeeeee', (this.altitude - 0.5) * 1000);
    }
}