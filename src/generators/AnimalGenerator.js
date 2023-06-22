import BinaryMatrix from "../structures/BinaryMatrix.js";
import { throwError } from "../helpers.js";
import Config from "../../config.js";
import Animal from "../animals/Animal.js";
export default class AnimalGenerator {
    constructor(objects) {
        this.respawnPoints = [];
        this.maxAnimals = -1;
        this.objects = objects;
    }
    getName() {
        return Animal.ANIMAL_NAME;
    }
    getAnimalClass() {
        return Animal;
    }
    getSettings() {
        return Config.ANIMALS[this.getName()];
    }
    getCreateIntensity() {
        return this.getSettings().intensity;
    }
    getRarity() {
        return this.getSettings().rarity;
    }
    updateHabitat() {
        if (typeof this.habitat === 'undefined') {
            this.setHabitat(new BinaryMatrix(1, Config.WORLD_SIZE, Config.WORLD_SIZE));
        }
        return this;
    }
    setHabitat(habitat) {
        this.habitat = habitat;
        this.maxAnimals = -1;
    }
    getHabitat() {
        return this.habitat;
    }
    isCellInHabitat(x, y) {
        return this.getHabitat().filled(x, y);
    }
    createRespawnPoint() {
        const habitat = this.getHabitat().clone();
        habitat.diffCells(this.getRespawnPoints());
        if (!habitat.hasFilled()) {
            return false;
        }
        this.respawnPoints.push(habitat.getFilledCells().randomElement());
        return true;
    }
    getRespawnPoints() {
        return this.respawnPoints;
    }
    checkRespawns(animalsCount) {
        for (let i = 0; i < Math.ceil(animalsCount / 3) + 1; i++) { // @TODO 3 - bigger value = less respawn points
            this.createRespawnPoint();
        }
    }
    getMaxAnimals() {
        if (this.maxAnimals === -1) {
            this.maxAnimals = this.getHabitat().countFilled() * this.getRarity();
        }
        return this.maxAnimals;
    }
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
            return null;
        }
        const cell = respawnPoints.randomElement();
        if (!cell) {
            throwError('Can not create animal', 1, true);
            return null;
        }
        return new (this.getAnimalClass())(cell[0], cell[1], Config.ANIMALS[this.getName()]);
    }
}
