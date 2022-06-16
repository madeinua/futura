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
            groundType = _this.getCreateChanceByGround(
                biome.getName()
            );

        if (groundType === 0) {
            return 0;
        }

        let neighbors = (forestMap.getFilledNeighbors(x, y).length * config.FOREST_NEIGHBORS_MULT + 1),
            bornChance = config.FOREST_BORN_CHANCE,
            water = Math.max(1, config.FOREST_WATTER_MULT / biome.getDistanceToWater());

        return bornChance * groundType * humidity * water * neighbors * boost;
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

        return 100 * config.FOREST_DEAD_CHANCE;
    }
}