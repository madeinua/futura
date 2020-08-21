class AltitudeMap extends PointMatrix {

    config;

    /**
     * @param {Object} config
     * @return {AltitudeMap}
     */
    constructor(config) {

        super(config.worldSize, config.worldSize);

        this.config = config;

        return this;
    }

    generateMap = function() {

        let _this = this,
            octaves = [3, 5, 20], // [12, 20, 80]
            maps = [];

        for (let i in octaves) {
            maps[i] = createNoiseMap(
                _this.config.worldSize,
                octaves[i] * (_this.config.worldSize / 75)
            );
        }

        _this.map(function(x, y) {

            let val = 0,
                size = 0;

            // blend maps
            for (let i = 0; i < maps.length; i++) {
                let s = Math.pow(2, i);
                size += s;
                val += maps[i].getTile(x, y) * s;
            }

            val /= size;

            // stretch map
            val = Math.min(1, Math.pow(val, _this.config.WORLD_MAP_OCEAN_LEVEL + 1));

            // make island
            val = _this.makeIsland(x, y, _this.config.worldSize, val);

            return val;
        });
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
            delta = distance / (islandSize * 0.42),
            gradient = delta * delta - 0.2;

        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    };

    /**
     * @param {number} level
     * @return {boolean}
     */
    isGround = function(level) {
        return level > this.config.MAX_WATER_LEVEL;
    };

    /**
     * @param level
     * @return {boolean}
     */
    isWater = function(level) {
        return this.config.MAX_WATER_LEVEL >= level;
    };
}