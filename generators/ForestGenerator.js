class ForestGenerator {

    /** @var {BiomesOperator} */
    biomesOperator;

    /** @var {number} */
    maxForestTiles;

    /** @var {object} */
    groundCreateMults = {};

    unallowedCells = [];

    /** @var {number} */
    minCreateIntensity;

    /**
     * @param {BiomesOperator} biomesOperator
     */
    constructor(biomesOperator) {
        let _this = this;

        _this.biomesOperator = biomesOperator;
        _this.maxForestTiles = Math.ceil(biomesOperator.altitudeMap.getLandTilesCount() * config.FOREST_LIMIT / 100);
        _this.minCreateIntensity = _this.maxForestTiles / 100;

        let maxGroundMult = 0;

        for (let i in config.FOREST_GROUNDS_MULTS) {
            maxGroundMult = Math.max(maxGroundMult, config.FOREST_GROUNDS_MULTS[i]);
        }

        for (let i in config.FOREST_GROUNDS_MULTS) {
            _this.groundCreateMults[i] = changeRange(config.FOREST_GROUNDS_MULTS[i], 0, maxGroundMult, 0, config.FOREST_CREATE_MULTS.GROUND);
        }

        biomesOperator.altitudeMap.foreach(function(x, y) {
            if (biomesOperator.altitudeMap.getTile(x, y) > config.MAX_HILLS_LEVEL) {
                _this.unallowedCells.push([x, y]);
            }
        });
    }

    /**
     * @param {ForestMap} forestMap
     * @param {number} step
     */
    generate(forestMap, step) {
        let filledTiles = forestMap.getFilledTiles().shuffle();

        this.createTrees(forestMap, filledTiles, step);
        this.growTrees(forestMap, filledTiles);
    }

    /**
     * @param {ForestMap} forestMap
     * @param {array} filledTiles
     */
    growTrees(forestMap, filledTiles) {
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
     * @param {array} filledTiles
     * @param {number} step
     */
    createTrees(forestMap, filledTiles, step) {
        let _this = this,
            createIntensity = Math.max(_this.minCreateIntensity, Math.ceil(this.maxForestTiles / Math.max(1, filledTiles.length))),
            potentialTiles = forestMap.getUnfilledTiles().shuffle().slice(0, createIntensity),
            i, x, y, createChance;

        for (i = 0; i < potentialTiles.length; i++) {
            x = potentialTiles[i][0];
            y = potentialTiles[i][1];

            createChance = _this.getCreateChance(
                forestMap,
                _this.biomesOperator.humidityMap.getTile(x, y),
                x,
                y,
                step <= config.STEPS_BOOST_STEPS ? config.FOREST_BORN_CHANCE * config.STEPS_BOOST_STEPS : config.FOREST_BORN_CHANCE
            );

            if (iAmLucky(createChance)) {
                forestMap.fill(x, y);
            }
        }
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

        if (humidity === 0 || this.unallowedCells.includesTile([x, y])) {
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