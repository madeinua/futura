class AltitudeMap extends PointMatrix {

    config;

    WORLD_MAP_OCEAN_LEVEL = 0.5; // [0-1]
    MAX_COAST_LEVEL = 0.3;

    /**
     * @param {Object} config
     * @return {AltitudeMap}
     */
    constructor(config) {

        super(config.worldWidth, config.worldHeight);

        this.WORLD_MAP_OCEAN_LEVEL = typeof config.WORLD_MAP_OCEAN_LEVEL === 'undefined'
                ? this.WORLD_MAP_OCEAN_LEVEL
                : config.WORLD_MAP_OCEAN_LEVEL;

            this.MAX_COAST_LEVEL = typeof config.MAX_COAST_LEVEL === 'undefined'
                ? this.MAX_COAST_LEVEL
                : config.MAX_COAST_LEVEL;

        this.config = config;

        return this;
    }

    generateMap = function () {

        let _this = this,
            octaves = _this.calculateOctaves(_this.config.worldWidth),
            distances = getEqualDistances(octaves, 10, 100),
            maps = [];

        for(let i = 0; i < octaves; i++) {
            maps[i] = createNoiseMap(
                _this.config.worldWidth,
                _this.config.worldHeight,
                distances[i]
            );
        }

        _this.map(function(x, y) {

            let val = 0;

            // blend maps
            for(let i = 0; i < maps.length; i++) {
                val += maps[i].getTile(x, y);
            }

            val /= maps.length;

            // stretch map
            val = Math.min(1, Math.pow(val, _this.WORLD_MAP_OCEAN_LEVEL + 1));

            // make island
            val = _this.makeIsland(x, y, _this.config.worldWidth, _this.config.worldHeight, val);

            return val;
        });
    };

    /**
     * @param {number} worldWidth
     * @return {number}
     */
    calculateOctaves = function(worldWidth) {

        let octaves = 1;

        while(worldWidth > 1) {
            worldWidth = worldWidth / 3;
            octaves++;
        }

        return octaves;
    };

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} maxX
     * @param {number} maxY
     * @param {number} altitude
     * @return {number}
     */
    makeIsland = function(x, y, maxX, maxY, altitude) {

        // Circular Distance
        let dx = Math.abs(x - maxX * 0.5),
            dy = Math.abs(y - maxY * 0.5),
            distance = Math.sqrt(dx * dx + dy * dy),
            delta = distance / (maxX * 0.4),
            gradient = delta * delta - 0.2;

        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    };

    /**
     * @param {number} level
     * @return {boolean}
     */
    isGround = function(level) {
        return level > this.MAX_COAST_LEVEL;
    };

    /**
     * @param level
     * @return {boolean}
     */
    isWater = function(level) {
        return this.MAX_COAST_LEVEL >= level;
    };
}