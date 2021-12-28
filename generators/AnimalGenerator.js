class AnimalGenerator {

    /** @var {Object} */
    maps;

    /** @var {BinaryMatrix} */
    habitat;

    /** @var {Array} */
    respawnPoints = [];

    /**
     * @param {Object} maps
     */
    constructor(maps) {

        this.maps = maps;

        this.generateHabitat()
            .generateRespawnPoints();
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
        return config.ANIMAL_CREATE_INTENSITY;
    }

    /**
     * @returns {AnimalGenerator}
     */
    generateHabitat() {

        this.habitat = new BinaryMatrix(config.WORLD_SIZE, config.WORLD_SIZE, 1);

        return this;
    }

    /**
     * @return {BinaryMatrix}
     */
    getHabitat() {
        return this.habitat;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @returns {boolean}
     */
    isTileInHabitat(x, y) {
        return this.getHabitat().filled(x, y);
    }

    /**
     * @returns {number}
     */
    getRespawnPointsLimit() {
        return config.ANIMAL_RESPAWN_POINTS;
    }

    /**
     * @returns {boolean}
     */
    createRespawnPoint() {

        let habitat = this.getHabitat()
            .clone()
            .diffTiles(this.getRespawnPoints());

        if (!habitat.hasFilled()) {
            return false;
        }

        this.respawnPoints.push(
            habitat.getFilledTiles().randomElement()
        );

        return true;
    }

    /**
     * @returns {AnimalGenerator}
     */
    generateRespawnPoints() {

        for (let i = 0; i < this.getRespawnPointsLimit(); i++) {
            this.createRespawnPoint();
        }

        if (!this.getRespawnPoints().length) {
            throwError('Can not create respawn points for ' + this.getName(), 1, true);
        }

        return this;
    }

    /**
     * @returns {Array}
     */
    getRespawnPoints() {
        return this.respawnPoints;
    }

    /**
     * @returns {boolean}
     */
    checkRespawns() {

        let missedRespawnPoints = this.getRespawnPointsLimit() - this.getRespawnPoints().length;

        if (missedRespawnPoints < 1) {
            return true;
        }

        for (let i = 0; i < missedRespawnPoints; i++) {
            this.createRespawnPoint();
        }

        return false;
    }

    /**
     * @param {Array} anotherAnimalsPositions
     * @return {boolean|Animal}
     */
    createAnimal(anotherAnimalsPositions) {

        let respawnPoints = this.getRespawnPoints();

        for (let i = 0; i < respawnPoints.length; i++) {
            if (anotherAnimalsPositions.getClosestDistanceTo(respawnPoints[i][0], respawnPoints[i][1]) < 3) {
                respawnPoints = respawnPoints.removeElementByIndex(i);
            }
        }

        if (!respawnPoints.length) {
            return false;
        }

        let tile = respawnPoints.randomElement();

        if (!tile) {
            throwError('Can not create animal', 1, true);
            return false;
        }

        return new (this.getAnimalClass())(tile[0], tile[1]);
    }
}