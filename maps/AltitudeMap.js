class AltitudeMap extends PointMatrix {

    /**
     * @return {AltitudeMap}
     */
    constructor() {
        super(config.WORLD_SIZE, config.WORLD_SIZE);
        return this;
    }

    generateMap = function() {

        let _this = this,
            octaves = [3, 5, 20], // [12, 20, 80]
            maps = [];

        for (let i in octaves) {
            maps[i] = createNoiseMap(
                config.WORLD_SIZE,
                octaves[i] * (config.WORLD_SIZE / 75)
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
            val = Math.min(1, Math.pow(val, config.WORLD_MAP_OCEAN_LEVEL + 1));

            // make island
            val = _this.makeIsland(x, y, config.WORLD_SIZE, val);

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
        return level > config.MAX_WATER_LEVEL;
    };

    /**
     * @param level
     * @return {boolean}
     */
    isWater = function(level) {
        return config.MAX_WATER_LEVEL >= level;
    };
}