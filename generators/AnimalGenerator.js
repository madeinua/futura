class AnimalGenerator {

    /** @var {OceanMap} */
    oceanMap;

    /** @var {BinaryMatrix} */
    freshWaterMap;

    /** @var {CoastMap} */
    coastMap;

    /** @var {BinaryMatrix} */
    habitat;

    /** @var {Array} */
    respawnPoints;

    /**
     * @param {OceanMap} oceanMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {CoastMap} coastMap
     */
    constructor(oceanMap, freshWaterMap, coastMap) {
        this.oceanMap = oceanMap;
        this.freshWaterMap = freshWaterMap;
        this.coastMap = coastMap;
        this.habitat = this.generateHabitat();
        this.respawnPoints = this.generateRespawnPoints();
    }

    /**
     * @return {string}
     */
    getName() {
        return Animal.NAME;
    }

    /**
     * @returns {Animal}
     */
    getAnimalClass() {
        return Animal;
    }

    /**
     * @return {number}
     */
    getCreateIntensity() {
        return 50;
    }

    /**
     * @return {BinaryMatrix}
     */
    generateHabitat() {
        return new BinaryMatrix(config.WORLD_SIZE, config.WORLD_SIZE, 1);
    }

    /**
     * @return {BinaryMatrix}
     */
    getHabitat() {
        return this.habitat;
    }

    /**
     * @returns {number}
     */
    getRespawnPointsLimit() {
        return config.ANIMAL_RESPAWN_POINTS;
    }

    /**
     * @returns {Array}
     */
    generateRespawnPoints() {

        let tiles = [],
            tile;

        for (let i = 0; i < this.getRespawnPointsLimit(); i++) {
            for (let j = 0; j < 3; j++) {

                tile = this.getHabitat().getRandomFilledTile();

                if (!tiles.includesTile(tile)) {
                    tiles.push(tile);
                    break;
                }
            }
        }

        if (!tiles.length) {
            throwError('Can not create respawn points', 1, true);
        }

        return tiles;
    }

    /**
     * @returns {Array}
     */
    getRespawnPoints() {
        return this.respawnPoints;
    }

    /**
     * @param {Array} excludeTiles
     * @return {boolean|Animal}
     */
    createAnimal(excludeTiles) {

        let tile = this.getRespawnPoints()
            .diffTiles(excludeTiles)
            .randomElement();

        if (!tile) {
            throwError('Can not create animal', 1, true);
            return false;
        }

        return new (this.getAnimalClass())(tile[0], tile[1]);
    }
}