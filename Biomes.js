class Biomes {

    BIOME_OCEAN = 0;
    BIOME_COAST = 1;
    BIOME_RIVER = 2;
    BIOME_LAKE = 3;

    BIOME_BEACH = 10;

    BIOME_TROP_RF = 20; // Tropical rain forest
    BIOME_TMPR_RF = 21; // Temperate rain forest
    BIOME_TROP_SEF = 22; // Tropical seasonal forest
    BIOME_TMPR_FST = 23; // Temperate forest
    BIOME_TAIGA = 24;
    BIOME_TROP_TS = 25; // Tropical thorn scrub and woodland
    BIOME_SAVANNA = 26;
    BIOME_TUNDRA = 27;
    BIOME_DESERT = 28;

    BIOME_SWAMP = 30;

    BIOME_ICE = 40;

    // @TODO
    MAX_OCEAN_LEVEL = 0.2;
    MAX_COAST_LEVEL = 0.3;
    MAX_BEACH_LEVEL = 0.32;
    MAX_LOWLAND_LEVEL = 0.4;
    MAX_HILLS_LEVEL = 0.6;

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @param {BeachesMap} beachesMap
     * @param {RiversMap} riversMap
     * @param {LakesMap} lakesMap
     * @param {TemperatureMap} temperatureMap
     * @param {HumidityMap} humidityMap
     */
    constructor(altitudeMap, oceanMap, beachesMap, riversMap, lakesMap, temperatureMap, humidityMap) {
        this.altitudeMap = altitudeMap;
        this.oceanMap = oceanMap;
        this.beachesMap = beachesMap;
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

        colors[_this.BIOME_OCEAN] = '#003eb2';
        colors[_this.BIOME_COAST] = LightenDarkenColor('#4bbeff', powAltitude);
        colors[_this.BIOME_BEACH] = LightenDarkenColor('#c2b281', powTemperature);
        colors[_this.BIOME_TROP_RF] = '#0e3d17';
        colors[_this.BIOME_TMPR_RF] = '#143128';
        colors[_this.BIOME_TROP_SEF] = '#618a19';
        colors[_this.BIOME_TMPR_FST] = '#4bae60';
        colors[_this.BIOME_TAIGA] = '#176b56';
        colors[_this.BIOME_TROP_TS] = '#b39b29';
        colors[_this.BIOME_SAVANNA] = '#bcca5d';
        colors[_this.BIOME_TUNDRA] = '#b9ffe6';
        colors[_this.BIOME_DESERT] = '#fcfda5';
        colors[_this.BIOME_SWAMP] = '#008f5c';
        colors[_this.BIOME_RIVER] = '#0952c6';
        colors[_this.BIOME_LAKE] = '#007bbf';
        colors[_this.BIOME_ICE] = '#eeeeee';

        let color = colors[biome.getType()];

        if (typeof color === 'undefined') {
            color = colors[_this.BIOME_OCEAN];
        }

        return hexToRgb(color);
    }

    /**
     * @param {number} x
     * @param {number} y
     * @return {number}
     */
    findBiomeType(x, y) {

        let _this = this;

        if (_this.oceanMap.filled(x, y)) {
            return _this.altitudeMap.getTile(x, y) > _this.oceanMap.MAX_OCEAN_LEVEL ? _this.BIOME_COAST : _this.BIOME_OCEAN;
        }

        if (_this.beachesMap.filled(x, y)) {
            return _this.BIOME_BEACH;
        }

        if (_this.riversMap.filled(x, y)) {
            return _this.BIOME_RIVER;
        }

        if (_this.lakesMap.filled(x, y)) {
            return _this.BIOME_LAKE;
        }

        let temperature = _this.temperatureMap.getTile(x, y),
            humidity = _this.humidityMap.getTile(x, y);

        if (temperature > 0.9 || humidity < 0.1) {
            return _this.BIOME_DESERT;
        }

        let rb = function(biome1, biome2) {
            return Math.random() > 0.5 ? biome1 : biome2;
        };

        let map = [
            [_this.BIOME_TROP_RF, _this.BIOME_TROP_RF, _this.BIOME_TROP_RF, rb(_this.BIOME_TROP_RF, _this.BIOME_TMPR_RF), _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, _this.BIOME_TUNDRA, _this.BIOME_TUNDRA],
            [_this.BIOME_TROP_RF, _this.BIOME_TROP_RF, _this.BIOME_TROP_RF, _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, rb(_this.BIOME_TMPR_RF, _this.BIOME_TUNDRA), _this.BIOME_TUNDRA, _this.BIOME_TUNDRA],
            [_this.BIOME_TROP_RF, _this.BIOME_TROP_RF, rb(_this.BIOME_TROP_RF, _this.BIOME_TMPR_RF), _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, _this.BIOME_TUNDRA, _this.BIOME_TUNDRA, _this.BIOME_TUNDRA],
            [_this.BIOME_TROP_RF, _this.BIOME_TROP_RF, rb(_this.BIOME_TROP_RF, _this.BIOME_TMPR_RF), _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, _this.BIOME_TUNDRA, _this.BIOME_TUNDRA, _this.BIOME_TUNDRA],
            [rb(_this.BIOME_TROP_RF, _this.BIOME_TROP_SEF), _this.BIOME_TROP_RF, rb(_this.BIOME_TROP_RF, _this.BIOME_TMPR_RF), _this.BIOME_TMPR_RF, _this.BIOME_TMPR_RF, rb(_this.BIOME_TMPR_RF, _this.BIOME_TUNDRA), _this.BIOME_TUNDRA, _this.BIOME_TUNDRA, rb(_this.BIOME_TUNDRA, _this.BIOME_TAIGA)],
            [_this.BIOME_TROP_SEF, _this.BIOME_TROP_SEF, rb(_this.BIOME_TROP_SEF, _this.BIOME_TMPR_FST), rb(_this.BIOME_TMPR_RF, _this.BIOME_TMPR_FST), _this.BIOME_TMPR_RF, _this.BIOME_TUNDRA, _this.BIOME_TUNDRA, rb(_this.BIOME_TUNDRA, _this.BIOME_TAIGA), _this.BIOME_TAIGA],
            [_this.BIOME_TROP_SEF, _this.BIOME_TROP_SEF, rb(_this.BIOME_TROP_SEF, _this.BIOME_TMPR_FST), _this.BIOME_TMPR_FST, _this.BIOME_TMPR_FST, _this.BIOME_TUNDRA, _this.BIOME_TUNDRA, _this.BIOME_TAIGA, _this.BIOME_TAIGA],
            [rb(_this.BIOME_DESERT, _this.BIOME_TROP_TS), _this.BIOME_TROP_TS, rb(_this.BIOME_TROP_TS, _this.BIOME_SAVANNA), rb(_this.BIOME_SAVANNA, _this.BIOME_TMPR_FST), _this.BIOME_TMPR_FST, _this.BIOME_TUNDRA, rb(_this.BIOME_TUNDRA, _this.BIOME_TAIGA), _this.BIOME_TAIGA, _this.BIOME_TAIGA],
            [_this.BIOME_DESERT, rb(_this.BIOME_DESERT, _this.BIOME_TROP_TS), rb(_this.BIOME_DESERT, _this.BIOME_TROP_TS), _this.BIOME_SAVANNA, _this.BIOME_SAVANNA, rb(_this.BIOME_SAVANNA, _this.BIOME_TUNDRA), rb(_this.BIOME_TUNDRA, _this.BIOME_TAIGA), _this.BIOME_TAIGA, _this.BIOME_TAIGA]
        ];

        let w = map[0].length - 1,
            h = map.length - 1,
            col = Math.floor(temperature * w),
            row = Math.floor(humidity * h);

        return map[row][col];
    };

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