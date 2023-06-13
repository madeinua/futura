import BinaryMatrix from "../structures/BinaryMatrix.js";
import {throwError} from "../helpers.js";

export default class AnimalGenerator {

    /** @var {Object} */
    objects;

    /** @var {Object} */
    config;

    /** @var {BinaryMatrix} */
    habitat;

    /** @var {Array} */
    respawnPoints = [];

    /** @var {number} */
    maxAnimals = -1;

    /**
     * @param {Object} objects
     * @param {Object} config
     */
    constructor(objects, config) {
        this.objects = objects;
        this.config = config;
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
        return this.config.ANIMALS[this.getName()];
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
            this.setHabitat(new BinaryMatrix(1, this.config.WORLD_SIZE, this.config.WORLD_SIZE));
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
    isCellInHabitat(x, y) {
        return this.getHabitat().filled(x, y);
    }

    /**
     * @returns {boolean}
     */
    createRespawnPoint() {

        let habitat = this.getHabitat().clone();

        habitat.diffCells(
            this.getRespawnPoints()
        );

        if (!habitat.hasFilled()) {
            return false;
        }

        this.respawnPoints.push(
            habitat.getFilledCells().randomElement()
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
            if (!this.isCellInHabitat(respawnPoints[i][0], respawnPoints[i][1])) {
                respawnPoints = respawnPoints.removeElementByIndex(i);
            }
        }

        if (!respawnPoints.length) {
            return false;
        }

        let cell = respawnPoints.randomElement();

        if (!cell) {
            throwError('Can not create animal', 1, true);
            return false;
        }

        return new (this.getAnimalClass())(
            cell[0],
            cell[1],
            this.config.ANIMALS[this.getName()]
        );
    }
}