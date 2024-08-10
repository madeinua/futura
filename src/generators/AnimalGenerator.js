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
        if (!this.habitat) {
            this.setHabitat(new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 1));
        }
        return this;
    }
    setHabitat(habitat) {
        this.habitat = habitat;
        this.maxAnimals = -1; // Reset maxAnimals to force recalculation
    }
    getHabitat() {
        return this.habitat;
    }
    isCellInHabitat(x, y) {
        return this.getHabitat().filled(x, y);
    }
    createRespawnPoint() {
        const habitatClone = this.getHabitat().clone();
        habitatClone.diffCells(this.getRespawnPoints());
        if (!habitatClone.hasFilled()) {
            return false;
        }
        this.respawnPoints.push(habitatClone.getFilledCells().randomElement());
        return true;
    }
    getRespawnPoints() {
        return this.respawnPoints;
    }
    checkRespawns(animalsCount) {
        const respawnChecks = Math.ceil(animalsCount / 3) + 1; // @TODO 3 - bigger value = less respawn points
        for (let i = 0; i < respawnChecks; i++) {
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
        let respawnPoints = this.getRespawnPoints().filter((cell) => {
            return (anotherAnimalsPositions.getClosestDistanceTo(cell[0], cell[1]) >= 3 &&
                this.isCellInHabitat(cell[0], cell[1]));
        });
        if (!respawnPoints.length) {
            return null;
        }
        const cell = respawnPoints.randomElement();
        if (!cell) {
            throwError('Cannot create animal', 1, true);
            return null;
        }
        return new (this.getAnimalClass())(cell[0], cell[1], this.getSettings());
    }
}
