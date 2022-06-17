class AnimalGenerator {

    /** @var {Object} */
    objects;

    /** @var {BinaryMatrix} */
    habitat;

    /** @var {Array} */
    respawnPoints = [];

    /**
     * @param {Object} objects
     */
    constructor(objects) {
        this.objects = objects;
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
    updateHabitat() {

        if (typeof this.habitat === 'undefined') {
            this.habitat = new BinaryMatrix(1);
        }

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
        return Math.floor(
            this.getHabitat().countFilled() / config.ANIMAL_RESPAWN_AREA
        );
    }

    /**
     * @returns {boolean}
     */
    createRespawnPoint() {

        let habitat = this.getHabitat().clone();

        habitat.diffTiles(
            this.getRespawnPoints()
        );

        if (!habitat.hasFilled()) {
            return false;
        }

        this.respawnPoints.push(
            habitat.getFilledTiles().randomElement()
        );

        return true;
    }

    /**
     * @returns {number}
     */
    getAllowedRespawnPoints() {
        return Math.min(
            this.getRespawnPointsLimit(),
            this.objects.timer.getTick()
        );
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

        let missedRespawnPoints = Math.max(0, this.getAllowedRespawnPoints() - this.getRespawnPoints().length);

        for (let i = 0; i < missedRespawnPoints; i++) {
            this.createRespawnPoint();
        }
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

        for (let i = 0; i < respawnPoints.length; i++) {
            if (!this.isTileInHabitat(respawnPoints[i][0], respawnPoints[i][1])) {
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