class ForestGenerator {

    /** @var {BiomesOperator} */
    biomesOperator;

    /** @var {number} */
    maxForestCells;

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
        _this.maxForestCells = Math.ceil(biomesOperator.altitudeMap.getLandCellsCount() * config.FOREST_LIMIT / 100);
        _this.minCreateIntensity = Math.ceil(_this.maxForestCells / 10);

        let maxGroundMult = 0;

        for (let i in config.FOREST_GROUNDS_MULTS) {
            maxGroundMult = Math.max(maxGroundMult, config.FOREST_GROUNDS_MULTS[i]);
        }

        for (let i in config.FOREST_GROUNDS_MULTS) {
            _this.groundCreateMults[i] = changeRange(config.FOREST_GROUNDS_MULTS[i], 0, maxGroundMult, 0, config.FOREST_CREATE_MULTS.GROUND);
        }

        biomesOperator.altitudeMap.foreach(function(x, y) {
            if (biomesOperator.altitudeMap.getCell(x, y) > config.MAX_HILLS_LEVEL) {
                _this.unallowedCells.push([x, y]);
            }
        });
    }

    /**
     * @param {ForestMap} forestMap
     * @param {number} step
     */
    generate(forestMap, step) {
        let filledCells = forestMap.getFilledCells().shuffle();

        this.createTrees(forestMap, filledCells, step);
        this.growTrees(forestMap, filledCells, step);
    }

    /**
     * @param {ForestMap} forestMap
     * @param {array} filledCells
     * @param {number} step
     */
    growTrees(forestMap, filledCells, step) {
        this.cutTrees(forestMap, filledCells);
        this.expandTrees(forestMap, filledCells, step);
    }

    /**
     * @param {ForestMap} forestMap
     * @param {array} filledCells
     */
    cutTrees(forestMap, filledCells) {

        if (!filledCells.length) {
            return;
        }

        filledCells
            .slice(0, filledCells.length * config.FOREST_DIE_CHANCE)
            .forEach(function(cell) {
                forestMap.unfill(cell[0], cell[1]);
            });
    }

    /**
     * @param {ForestMap} forestMap
     * @param {array} filledCells
     * @param {number} step
     */
    expandTrees(forestMap, filledCells, step) {

        let _this = this,
            usedSpace = filledCells.length / this.maxForestCells,
            chance = step <= config.STEPS_BOOST_STEPS ? config.FOREST_GROWTH_CHANCE * 3 : config.FOREST_GROWTH_CHANCE,
            speed = chance * (1 - usedSpace);

        if (speed === 0) {
            return;
        }

        filledCells.forEach(function(cell) {
            forestMap.foreachNeighbors(cell[0], cell[1], function(x, y) {
                if (!filledCells.includes([x, y])) {

                    let growsChance = _this.getCreateChance(
                        forestMap,
                        _this.biomesOperator.humidityMap.getCell(x, y),
                        x,
                        y,
                        speed
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
     * @param {array} filledCells
     * @param {number} step
     */
    createTrees(forestMap, filledCells, step) {
        let _this = this,
            createIntensity = Math.ceil(Math.max(_this.minCreateIntensity, this.maxForestCells / Math.max(1, filledCells.length))),
            potentialCells = forestMap.getUnfilledCells().shuffle().slice(0, createIntensity),
            i, x, y, createChance;

        for (i = 0; i < potentialCells.length; i++) {
            x = potentialCells[i][0];
            y = potentialCells[i][1];

            createChance = _this.getCreateChance(
                forestMap,
                _this.biomesOperator.humidityMap.getCell(x, y),
                x,
                y,
                step <= config.STEPS_BOOST_STEPS
                    ? config.FOREST_BORN_CHANCE * config.FOREST_BORN_BOOST
                    : config.FOREST_BORN_CHANCE
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

        if (humidity === 0 || this.unallowedCells.includesCell([x, y])) {
            return 0;
        }

        let biome = forestMap.biomes.getCell(x, y);

        if (!this.groundCreateMults.hasOwnProperty(biome.getName())) {
            return 0;
        }

        let waterRatio = Math.max(1, config.FOREST_CREATE_MULTS.WATTER / biome.getDistanceToWater()),
            humidityRatio = changeRange(humidity, 0, 1, 0, config.FOREST_CREATE_MULTS.HUMIDITY),
            groundRatio = this.groundCreateMults[biome.getName()];

        return speed * (groundRatio + humidityRatio + waterRatio);
    }
}