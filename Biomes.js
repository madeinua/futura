class Biomes {

    config;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     * @param {Object} config
     */
    constructor(altitudeMap, oceanMap, riversMap, lakesMap, temperatureMap, humidityMap, config) {

        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
        this.temperatureMap = temperatureMap;
        this.humidityMap = humidityMap;
        this.config = config;
        this.biomesConfig = this.getBiomesConfiguration();
    }

    /**
     * @param {number} altitude
     * @param {number} temperature
     * @return {boolean}
     */
    isCoast(altitude, temperature) {
        return altitude > this.config.MAX_OCEAN_LEVEL
            - (temperature * this.config.COAST_TEMPERATURE_RATIO * 2 - this.config.COAST_TEMPERATURE_RATIO)
            && altitude <= this.config.MAX_COAST_LEVEL;
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

        let distanceToRiver = this.riversMap.distanceTo(x, y, 5),
            distanceToLake = this.lakesMap.distanceTo(x, y, 5);

        let distanceToWater = Math.min(distanceToLake, distanceToRiver);

        distanceToWater = distanceToWater > 100 ? 0 : distanceToWater;

        let args = {
            altitude: this.altitudeMap.getTile(x, y),
            temperature: this.temperatureMap.getTile(x, y),
            humidity: this.humidityMap.getTile(x, y),
            distanceToWater: distanceToWater
        };

        if (this.riversMap.filled(x, y)) {
            return new Biome_River(x, y, args);
        }

        if (this.lakesMap.filled(x, y)) {
            return new Biome_Lake(x, y, args);
        }

        if (this.oceanMap.filled(x, y)) {
            return this.isCoast(args.altitude, args.temperature)
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

class Biome {

    static NAME = '';

    /**
     * @param {number} x
     * @param {number} y
     * @param {object} args
     */
    constructor(x, y, args) {
        this.x = x;
        this.y = y;
        this.altitude = args.altitude;
        this.temperature = args.temperature;
        this.humidity = args.humidity;
        this.distanceToWater = args.distanceToWater;
    }

    /**
     * @return {string}
     */
    getName() {
        return this.constructor.NAME;
    }

    /**
     * @return {string}
     */
    getColor() {
        throwError('Unknown biome color', 1, true);
        return '#FFFFFF';
    }

    /**
     * @return {Array}
     */
    getHexColor() {
        return hexToRgb(
            this.getColor()
        );
    }

    /**
     * @return {number}
     */
    getHumidity() {
        return this.humidity;
    }

    /**
     * @return {number}
     */
    getTemperature() {
        return this.temperature;
    }

    /**
     * @return {number}
     */
    getAltitude() {
        return this.altitude;
    }

    /**
     * @return {number}
     */
    getDistanceToWater() {
        return this.distanceToWater;
    }
}

class Biome_River extends Biome {

    static NAME = 'river';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#74aece', (this.altitude - 0.5) * 200);
    }
}

class Biome_Lake extends Biome {

    static NAME = 'lake';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#74aece', (this.altitude - 0.5) * 180);
    }
}

class Biome_Coast extends Biome {

    static NAME = 'coast';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#003eb2', -(this.altitude - 0.5) * 200);
    }
}

class Biome_Ocean extends Biome {

    static NAME = 'ocean';

    /**
     * @return {string}
     */
    getColor() {
        return '#003eb2';
    }
}

class Biome_Beach extends Biome {

    static NAME = 'beach';

    /**
     * @return {string}
     */
    getColor() {
        return '#c2b281';
    }
}

class Biome_Tundra extends Biome {

    static NAME = 'tundra';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#9c9f73', (this.altitude - 0.5) * 200);
    }
}

class Biome_Tundra_Hills extends Biome {

    static NAME = 'tundra-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#686a54', -(this.altitude - 0.5) * 200);
    }
}

class Biome_Grass extends Biome {

    static NAME = 'grass';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#659c29', (this.altitude - 0.5) * 200);
    }
}

class Biome_Grass_Hills extends Biome {

    static NAME = 'grass-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#778e5d', -(this.altitude - 0.5) * 200);
    }
}

class Biome_Savanna extends Biome {

    static NAME = 'savanna';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#9b9e3f', (this.altitude - 0.5) * 200);
    }
}

class Biome_Savanna_Hills extends Biome {

    static NAME = 'savanna-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#7f7946', -(this.altitude - 0.5) * 200);
    }
}

class Biome_Desert extends Biome {

    static NAME = 'desert';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#e8c57e', (this.altitude - 0.5) * 200);
    }
}

class Biome_Desert_Hills extends Biome {

    static NAME = 'desert-hills';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#c4a37e', -(this.altitude - 0.5) * 200);
    }
}

class Biome_Tropic extends Biome {

    static NAME = 'tropic';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#3c8045', -(this.altitude - 0.5) * 200);
    }
}

class Biome_Swamp extends Biome {

    static NAME = 'swamp';

    /**
     * @return {string}
     */
    getColor() {
        return '#258779';
    }
}

class Biome_Rocks extends Biome {

    static NAME = 'rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#726f62', (this.altitude - 0.5) * 250);
    }
}

class Biome_Ice_Rocks extends Biome {

    static NAME = 'ice-rocks';

    /**
     * @return {string}
     */
    getColor() {
        return LightenDarkenColor('#eeeeee', (this.altitude - 0.5) * 500);
    }
}