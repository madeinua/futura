class Biomes {

    SMOOTHING = false;

    // @TODO
    BIOME_OCEAN = 0;
    BIOME_RIVER = 1;
    BIOME_LAKE = 2;
    BIOME_COAST = 3;
    BIOME_BEACH = 4;
    BIOME_TUNDRA = 5;
    BIOME_GRASS = 6;
    BIOME_DESERT = 7;
    BIOME_SAVANNA = 8;
    BIOME_SWAMP = 9;
    BIOME_TUNDRA_HILLS = 10;
    BIOME_GRASS_HILLS = 11;
    BIOME_DESERT_HILLS = 12;
    BIOME_SAVANNA_HILLS = 13;
    BIOME_ROCKS = 14;
    BIOME_ICE_ROCKS = 15;

    MAX_OCEAN_LEVEL = 0.25;
    MAX_COAST_LEVEL = 0.3;
    MAX_BEACH_LEVEL = 0.32;
    MAX_LOWLAND_LEVEL = 0.6;
    MAX_HILLS_LEVEL = 0.8;
    //MAX_MOUNTAINS_LEVEL = 1;

    COAST_TEMPERATURE_RATIO = 0.05;
    BEACH_TEMPERATURE_RATIO = -0.02;
    BEACH_HUMIDITY_RATIO = 0.01;

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

            colors[_this.BIOME_OCEAN] = LightenDarkenColor('#00daff', powAltitude);
            colors[_this.BIOME_RIVER] = LightenDarkenColor('#74aece', powAltitude);
            colors[_this.BIOME_LAKE] = LightenDarkenColor('#74aece', powAltitude);
            colors[_this.BIOME_COAST] = LightenDarkenColor('#81e6ff', (altitude - 0.5) * 150);
            colors[_this.BIOME_BEACH] = LightenDarkenColor('#c2b281', powTemperature);

            // @TODO
            colors[_this.BIOME_TUNDRA] = '#9c9f73';
            colors[_this.BIOME_TUNDRA_HILLS] = '#747658';
            colors[_this.BIOME_GRASS] = '#618a19';
            colors[_this.BIOME_GRASS_HILLS] = '#3f5713';
            colors[_this.BIOME_DESERT] = '#fcfda5';
            colors[_this.BIOME_DESERT_HILLS] = '#919261';
            colors[_this.BIOME_SAVANNA] = '#bcca5d';
            colors[_this.BIOME_SAVANNA_HILLS] = '#7c8445';
            colors[_this.BIOME_SWAMP] = '#008f5c';
            colors[_this.BIOME_ROCKS] = '#727461';
            colors[_this.BIOME_ICE_ROCKS] = '#eeeeee';

        } else {

            colors[_this.BIOME_OCEAN] = '#0687cb';
            colors[_this.BIOME_RIVER] = '#0952c6';
            colors[_this.BIOME_LAKE] = '#007bbf';
            colors[_this.BIOME_COAST] = '#4bbeff';
            colors[_this.BIOME_BEACH] = '#eed58b';
            colors[_this.BIOME_TUNDRA] = '#9c9f73';
            colors[_this.BIOME_TUNDRA_HILLS] = '#747658';
            colors[_this.BIOME_GRASS] = '#618a19';
            colors[_this.BIOME_GRASS_HILLS] = '#3f5713';
            colors[_this.BIOME_DESERT] = '#fcfda5';
            colors[_this.BIOME_DESERT_HILLS] = '#919261';
            colors[_this.BIOME_SAVANNA] = '#bcca5d';
            colors[_this.BIOME_SAVANNA_HILLS] = '#7c8445';
            colors[_this.BIOME_SWAMP] = '#008f5c';
            colors[_this.BIOME_ROCKS] = '#727461';
            colors[_this.BIOME_ICE_ROCKS] = '#eeeeee';
        }

        let color = colors[biome.getType()];

        if (typeof color === 'undefined') {
            color = colors[_this.BIOME_OCEAN];
        }

        return hexToRgb(color);
    }

    /**
     * @param {number} altitude
     * @param {number} temperature
     * @return {boolean}
     */
    isCoast(altitude, temperature) {
        return altitude > this.MAX_OCEAN_LEVEL - (temperature * this.COAST_TEMPERATURE_RATIO * 2 - this.COAST_TEMPERATURE_RATIO)
            && altitude <= this.MAX_COAST_LEVEL;
    }

    /**
     * @param {number} altitude
     * @param {number} temperature
     * @param {number} humidity
     * @return {boolean}
     */
    isBeach(altitude, temperature, humidity) {
        return altitude > this.MAX_COAST_LEVEL
            && altitude <= this.MAX_BEACH_LEVEL
            - (temperature * this.BEACH_TEMPERATURE_RATIO * 2 - this.BEACH_TEMPERATURE_RATIO)
            - (humidity * this.BEACH_HUMIDITY_RATIO * 2 - this.BEACH_HUMIDITY_RATIO);
    }

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

        if (_this.isBeach(altitude, temperature, humidity)) {
            return _this.BIOME_BEACH;
        }



        return _this.BIOME_GRASS;
    };

    getWideBiome(temperature, humidity) {

        let rb = function(biome1, biome2) {
            return Math.random() > 0.5 ? biome1 : biome2;
        };

        let map = [
            [this.BIOME_TROP_RF, this.BIOME_TROP_RF, this.BIOME_TROP_RF, rb(this.BIOME_TROP_RF, this.BIOME_TMPR_RF), this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, this.BIOME_TUNDRA, this.BIOME_TUNDRA],
            [this.BIOME_TROP_RF, this.BIOME_TROP_RF, this.BIOME_TROP_RF, this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, rb(this.BIOME_TMPR_RF, this.BIOME_TUNDRA), this.BIOME_TUNDRA, this.BIOME_TUNDRA],
            [this.BIOME_TROP_RF, this.BIOME_TROP_RF, rb(this.BIOME_TROP_RF, this.BIOME_TMPR_RF), this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, this.BIOME_TUNDRA, this.BIOME_TUNDRA, this.BIOME_TUNDRA],
            [this.BIOME_TROP_RF, this.BIOME_TROP_RF, rb(this.BIOME_TROP_RF, this.BIOME_TMPR_RF), this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, this.BIOME_TUNDRA, this.BIOME_TUNDRA, this.BIOME_TUNDRA],
            [rb(this.BIOME_TROP_RF, this.BIOME_TROP_SEF), this.BIOME_TROP_RF, rb(this.BIOME_TROP_RF, this.BIOME_TMPR_RF), this.BIOME_TMPR_RF, this.BIOME_TMPR_RF, rb(this.BIOME_TMPR_RF, this.BIOME_TUNDRA), this.BIOME_TUNDRA, this.BIOME_TUNDRA, rb(this.BIOME_TUNDRA, this.BIOME_TAIGA)],
            [this.BIOME_TROP_SEF, this.BIOME_TROP_SEF, rb(this.BIOME_TROP_SEF, this.BIOME_TMPR_FST), rb(this.BIOME_TMPR_RF, this.BIOME_TMPR_FST), this.BIOME_TMPR_RF, this.BIOME_TUNDRA, this.BIOME_TUNDRA, rb(this.BIOME_TUNDRA, this.BIOME_TAIGA), this.BIOME_TAIGA],
            [this.BIOME_TROP_SEF, this.BIOME_TROP_SEF, rb(this.BIOME_TROP_SEF, this.BIOME_TMPR_FST), this.BIOME_TMPR_FST, this.BIOME_TMPR_FST, this.BIOME_TUNDRA, this.BIOME_TUNDRA, this.BIOME_TAIGA, this.BIOME_TAIGA],
            [rb(this.BIOME_DESERT, this.BIOME_TROP_TS), this.BIOME_TROP_TS, rb(this.BIOME_TROP_TS, this.BIOME_SAVANNA), rb(this.BIOME_SAVANNA, this.BIOME_TMPR_FST), this.BIOME_TMPR_FST, this.BIOME_TUNDRA, rb(this.BIOME_TUNDRA, this.BIOME_TAIGA), this.BIOME_TAIGA, this.BIOME_TAIGA],
            [this.BIOME_DESERT, rb(this.BIOME_DESERT, this.BIOME_TROP_TS), rb(this.BIOME_DESERT, this.BIOME_TROP_TS), this.BIOME_SAVANNA, this.BIOME_SAVANNA, rb(this.BIOME_SAVANNA, this.BIOME_TUNDRA), rb(this.BIOME_TUNDRA, this.BIOME_TAIGA), this.BIOME_TAIGA, this.BIOME_TAIGA]
        ];

        let w = map[0].length - 1,
            h = map.length - 1,
            col = Math.floor(temperature * w),
            row = Math.floor(humidity * h);

        return map[row][col];
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {Biome}
     */
    findBiome(x, y) {
        return new Biome(
            this.findBiomeType(x, y)
        );
    }
}