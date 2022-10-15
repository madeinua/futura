class AltitudeMap extends PointMatrix {

    waterSize = 0;
    landSize = 0;

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

        this.initVariables();
    };

    /**
     * @param {String} str
     */
    loadMap = function(str) {
        this.fromString(str);
        this.initVariables();
    }

    initVariables()
    {
        let _this = this;

        _this.foreach(function(x, y) {
            _this.isWater(_this.getTile(x, y))
                ? _this.waterSize++
                : _this.landSize++;
        });
    }

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

    /**
     * @returns {number}
     */
    getWaterTilesCount = function() {
        return this.landSize;
    }

    /**
     * @returns {number}
     */
    getLandTilesCount = function() {
        return this.landSize;
    }
}