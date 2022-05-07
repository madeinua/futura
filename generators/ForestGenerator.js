class ForestGenerator {

    /**
     * @param {ForestMap} forestMap
     * @param {HumidityMap} humidityMap
     * @param {number} step
     */
    generate(forestMap, humidityMap, step) {

        let _this = this;

        forestMap.foreachFilled(function(x, y) {

            let deadChance = _this.getDeadChance(forestMap, x, y);

            if (deadChance === 0) {
                return;
            }

            if (iAmLucky(deadChance)) {
                forestMap.unfill(x, y);
            }
        });

        forestMap.foreachUnfilled(function(x, y) {

            let createChance = _this.getCreateChance(
                forestMap,
                humidityMap.getTile(x, y),
                x,
                y,
                config.TICKS_BOOST_STEPS > step ? config.FOREST_BOOST : 1
            );

            if (createChance === 0) {
                return;
            }

            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        });
    }

    /**
     * @param {ForestMap} forestMap
     * @param {number} humidity
     * @param {number} x
     * @param {number} y
     * @param {number} boost
     * @return {number} From 0 to 100
     */
    getCreateChance(forestMap, humidity, x, y, boost) {

        if (humidity === 0) {
            return 0;
        }

        let _this = this,
            biome = forestMap.biomes.getTile(x, y),
            GT = _this.getCreateChanceByGround(
                biome.getName()
            );

        if (GT === 0) {
            return 0;
        }

        let NBR = forestMap.sumNeighbors(x, y),
            BC = config.FOREST_BORN_CHANCE,
            dtw = biome.getDistanceToWater();

        if (dtw >= 0 && dtw <= 1) {
            BC *= 10;
        } else if (dtw > 1 && dtw <= 2) {
            BC *= 5;
        }

        /**
         * GT = ground type coefficient
         * BC = born chance (if no other forest-based tiles around)
         * GC = growth chance (if there are forest-based tiles around)
         * NBR = number of neighbors forests (filled tiles)
         */
        return Math.min(100, GT * humidity * (BC + NBR / 10) * config.FOREST_GROWTH_SPEED * boost);
    }

    /**
     * @param {string} groundName
     * @return {number}
     */
    getCreateChanceByGround(groundName) {
        switch(groundName) {
            case 'tundra':
                return config.FOREST_TUNDRA_GROWTH;
            case 'tundra-hills':
                return config.FOREST_TUNDRA_HILLS_GROWTH;
            case 'grass':
                return config.FOREST_GRASS_GROWTH;
            case 'grass-hills':
                return config.FOREST_GRASS_HILLS_GROWTH;
            case 'desert':
                return config.FOREST_DESERT_GROWTH;
            case 'desert-hills':
                return config.FOREST_DESERT_HILLS_GROWTH;
            case 'swamp':
                return config.FOREST_SWAMP_GROWTH;
            case 'rocks':
                return config.FOREST_ROCKS_GROWTH;
            case 'savanna':
                return config.FOREST_SAVANNA_GROWTH;
            case 'savanna-hills':
                return config.FOREST_SAVANNA_HILLS_GROWTH;
            case 'tropic':
                return config.FOREST_TROPICS_GROWTH;
            case 'beach':
                return config.FOREST_BEACH_GROWTH;
        }

        return 0;
    }

    /**
     * @param {ForestMap} forestMap
     * @param {number} x
     * @param {number} y
     * @return {number} From 0 to 100
     */
    getDeadChance(forestMap, x, y) {

        let NBR = forestMap.sumNeighbors(x, y);

        // if no neighbor forest
        if (NBR === 0 || NBR > 5) {
            return 0;
        }

        let DC = config.FOREST_DEAD_CHANCE, // dead chance
            GC = config.FOREST_GROWTH_CHANCE; // growth chance (if there are forest-based tiles around)

        return (100 - GC) * DC;
    }
}