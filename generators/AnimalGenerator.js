class AnimalGenerator {

    /** @var {Object} */
    objects;

    /** @var {BinaryMatrix} */
    habitat;

    /** @var {Array} */
    respawnPoints = [];

    /** @var {number} */
    maxAnimals = -1;

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
     * @returns {*}
     */
    getSettings() {
        return config.ANIMALS[this.getName()];
    }

    /**
     * @return {number}
     */
    getCreateIntensity() {
        return this.getSettings().intensity;
    }

    /**
     * @returns {number}
     */
    getRarity() {
        return this.getSettings().rarity;
    }

    /**
     * @returns {AnimalGenerator}
     */
    updateHabitat() {

        if (typeof this.habitat === 'undefined') {
            this.setHabitat(new BinaryMatrix(1));
        }

        return this;
    }

    /**
     * @param {BinaryMatrix} habitat
     */
    setHabitat(habitat) {
        this.habitat = habitat;
        this.maxAnimals = -1;
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
     * @returns {Array}
     */
    getRespawnPoints() {
        return this.respawnPoints;
    }

    /**
     * @returns {boolean}
     */
    checkRespawns(animalsCount) {
        for (let i = 0; i < Math.ceil(animalsCount / 3) + 1; i++) { // @TODO 3 - bigger value = less respawn points
            this.createRespawnPoint();
        }
    }

    /**
     * @returns {number}
     */
    getMaxAnimals() {

        if (this.maxAnimals === -1) {
            this.maxAnimals = this.getHabitat().countFilled() * this.getRarity();
        }

        return this.maxAnimals;
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