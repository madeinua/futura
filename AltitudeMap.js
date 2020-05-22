class AltitudeMap extends PointMatrix {

    config;

    WORLD_MAP_OCEAN_LEVEL = 0.5; // [0-1]
    MAX_WATER_LEVEL = 0.3;

    /**
     * @param {Object} config
     * @return {AltitudeMap}
     */
    constructor(config) {

        super(config.worldSize, config.worldSize);

        this.WORLD_MAP_OCEAN_LEVEL =
            typeof config.WORLD_MAP_OCEAN_LEVEL === 'undefined'
                ? this.WORLD_MAP_OCEAN_LEVEL
                : config.WORLD_MAP_OCEAN_LEVEL;

        this.MAX_WATER_LEVEL =
            typeof config.MAX_WATER_LEVEL === 'undefined'
                ? this.MAX_WATER_LEVEL
                : config.MAX_WATER_LEVEL;

        this.config = config;

        return this;
    }

    generateMap = function() {

        let _this = this,
            octaves = _this.calculateOctaves(_this.config.worldSize),
            distances = getEqualDistances(octaves, 10, 100),
            maps = [];

        for (let i = 0; i < octaves; i++) {
            maps[i] = createNoiseMap(
                _this.config.worldSize,
                distances[i]
            );
        }

        _this.map(function(x, y) {

            let val = 0;

            // blend maps
            for (let i = 0; i < maps.length; i++) {
                val += maps[i].getTile(x, y);
            }

            val /= maps.length;

            // stretch map
            val = Math.min(1, Math.pow(val, _this.WORLD_MAP_OCEAN_LEVEL + 1));

            // make island
            val = _this.makeIsland(x, y, _this.config.worldSize, val);

            return val;
        });
    };

    /**
     * @param {number} worldSize
     * @return {number}
     */
    calculateOctaves = function(worldSize) {

        let octaves = 1;

        while(worldSize > 1) {
            worldSize = worldSize / 3;
            octaves++;
        }

        return octaves;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} islandSize
     * @param {number} altitude
     * @return {number}
     */
    makeIsland = function(x, y, islandSize, altitude) {

        // Circular Distance
        let dx = Math.abs(x - islandSize * 0.5),
            dy = Math.abs(y - islandSize * 0.5),
            distance = Math.sqrt(dx * dx + dy * dy),
            delta = distance / (islandSize * 0.4),
            gradient = delta * delta - 0.2;

        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    };

    /**
     * @param {number} level
     * @return {boolean}
     */
    isGround = function(level) {
        return level > this.MAX_WATER_LEVEL;
    };

    /**
     * @param level
     * @return {boolean}
     */
    isWater = function(level) {
        return this.MAX_WATER_LEVEL >= level;
    };
}