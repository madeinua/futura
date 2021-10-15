class ForestGenerator {

    /**
     * @param {ForestMap} forestMap
     * @param {number} step
     * @param {number} multiply
     */
    generate(forestMap, step, multiply = 1) {

        let _this = this;

        forestMap.foreachFilled(function(x, y) {

            let deadChance = _this.getDeadChance(forestMap, x, y);

            if (deadChance === 0) {
                return;
            }

            deadChance *= multiply;

            if (iAmLucky(deadChance)) {
                forestMap.unfill(x, y);
            }
        });

        forestMap.foreachUnfilled(function(x, y) {

            let createChance = _this.getCreateChance(forestMap, x, y);

            if (createChance === 0) {
                return;
            }

            createChance *= multiply;

            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        });
    }

    /**
     * @param {ForestMap} forestMap
     * @param {number} x
     * @param {number} y
     * @return {number} From 0 to 100
     */
    getCreateChance(forestMap, x, y) {

        let _this = this,
            biome = forestMap.biomes.getTile(x, y),
            GT = _this.getCreateChanceByGround(
                biome.getName()
            );

        if (GT === 0) {
            return 0;
        }

        let NBR = forestMap.sumNeighbors(biome.x, biome.y),
            forestType = _this.getForestType(biome),
            IH, IT, IA,
            BC = config.FOREST_BORN_CHANCE,
            GC = config.FOREST_GROWTH_CHANCE;

        if (forestType === config.FOREST_TEMPERATE) {
            IH = forestMap.ihTemperateMap.getTile(biome.x, biome.y);
            IT = forestMap.itTemperateMap.getTile(biome.x, biome.y);
            IA = forestMap.iaTemperateMap.getTile(biome.x, biome.y);
        } else if (forestType === config.FOREST_TROPICAL) {
            IH = forestMap.ihTropicalMap.getTile(biome.x, biome.y);
            IT = forestMap.itTropicalMap.getTile(biome.x, biome.y);
            IA = forestMap.iaTropicalMap.getTile(biome.x, biome.y);
        }

        if (biome.getDistanceToWater() > 0) {
            let inc = Math.pow(biome.getDistanceToWater(), 2);
            BC += config.FOREST_BORN_NEAR_WATER / inc;
            GC += config.FOREST_GROWTH_NEAR_WATER / inc;
        }

        /**
         * GT = ground type coefficient
         * BC = born chance (if no other forest-based tiles around)
         * GC = growth chance (if there are forest-based tiles around)
         * NBR = number of neighbors forests (filled tiles)
         * IH = coefficient of humidity
         * IT = coefficient of temperature
         * IA = coefficient of altitude
         */
        return Math.min(100, GT * (BC + GC * NBR) * (IH + IT + IA));
    }

    /**
     * @param {Biome} biome
     * @return {number}
     */
    getForestType(biome) {
        return ['savanna', 'savanna-hills', 'tropic'].includes(
            biome.getName()
        ) ? config.FOREST_TEMPERATE : config.FOREST_TROPICAL;
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