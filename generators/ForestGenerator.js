class ForestGenerator {

    /** @var {BiomesOperator} */
    biomesOperator;

    /** @var {number} */
    maxForestTiles;

    /** @var {object} */
    groundCreateMults = {};

    /**
     * @param {BiomesOperator} biomesOperator
     */
    constructor(biomesOperator) {
        this.biomesOperator = biomesOperator;
        this.maxForestTiles = Math.ceil(biomesOperator.altitudeMap.getLandTilesCount() * config.FOREST_LIMIT / 100);

        let maxGroundMult = 0;

        for (let i in config.FOREST_GROUNDS_MULTS) {
            maxGroundMult = Math.max(maxGroundMult, config.FOREST_GROUNDS_MULTS[i]);
        }

        for (let i in config.FOREST_GROUNDS_MULTS) {
            this.groundCreateMults[i] = changeRange(config.FOREST_GROUNDS_MULTS[i], 0, maxGroundMult, 0, config.FOREST_CREATE_MULTS.GROUND);
        }
    }

    /**
     * @param {ForestMap} forestMap
     * @param {number} step
     */
    generate(forestMap, step) {

        if (step === 0) {
            for (let i = 0; i < config.FOREST_BORN_STARTING_BOOST; i++) {
                this.createTrees(forestMap);
            }
        }

        this.growTrees(forestMap);
        this.createTrees(forestMap);
    }

    /**
     * @param {ForestMap} forestMap
     */
    growTrees(forestMap) {

        let filledTiles = forestMap.getFilledTiles().shuffle();

        this.cutTrees(forestMap, filledTiles);
        this.expandTrees(forestMap, filledTiles);
    }

    /**
     * @param {ForestMap} forestMap
     * @param {array} filledTiles
     */
    cutTrees(forestMap, filledTiles) {

        if (!filledTiles.length) {
            return;
        }

        filledTiles
            .slice(0, filledTiles.length * config.FOREST_DIE_CHANCE)
            .forEach(function(tile) {
                forestMap.unfill(tile[0], tile[1]);
            });
    }

    /**
     * @param {ForestMap} forestMap
     * @param {array} filledTiles
     */
    expandTrees(forestMap, filledTiles) {

        let _this = this,
            usedSpace = filledTiles.length / this.maxForestTiles,
            speed = config.FOREST_GROWTH_CHANCE * (1 - usedSpace);

        if (speed === 0) {
            return;
        }

        filledTiles.forEach(function(tile) {
            forestMap.foreachNeighbors(tile[0], tile[1], function(x, y) {
                if (!filledTiles.includes([x, y])) {

                    let growsChance = _this.getCreateChance(
                        forestMap,
                        _this.biomesOperator.humidityMap.getTile(x, y),
                        x, y, speed
                    );

                    if (iAmLucky(growsChance)) {
                        forestMap.fill(x, y);
                        return true;
                    }
                }

                return false;
            }, true);
        });
    }

    /**
     * @param {ForestMap} forestMap
     */
    createTrees(forestMap) {

        let _this = this;

        forestMap.foreachUnfilled(function(x, y) {

            let createChance = _this.getCreateChance(
                forestMap,
                _this.biomesOperator.humidityMap.getTile(x, y),
                x, y, config.FOREST_BORN_CHANCE
            );

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
     * @param {number} speed
     * @return {number} From 0 to 100
     */
    getCreateChance(forestMap, humidity, x, y, speed) {

        if (humidity === 0) {
            return 0;
        }

        let biome = forestMap.biomes.getTile(x, y);

        if (!this.groundCreateMults.hasOwnProperty(biome.getName())) {
            return 0;
        }

        let waterRatio = Math.max(1, config.FOREST_CREATE_MULTS.WATTER / biome.getDistanceToWater()),
            humidityRatio = changeRange(humidity, 0, 1, 0, config.FOREST_CREATE_MULTS.HUMIDITY),
            groundRatio = this.groundCreateMults[biome.getName()];

        return speed * (groundRatio + humidityRatio + waterRatio);
    }
}