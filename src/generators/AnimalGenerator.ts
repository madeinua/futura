import BinaryMatrix from "../structures/BinaryMatrix.js";
import {throwError} from "../helpers.js";
import Config from "../../config.js";
import Animal from "../animals/Animal.js";
import {CellsList} from "../structures/Cells.js";
import CoastMap from "../maps/CoastMap.js";
import ForestsOperator from "../operators/ForestsOperator.js";
import BiomesOperator from "../operators/BiomesOperator.js";
import Timer from "../services/Timer.js";

type AnimalType = {
    intensity: number;
    moveChance: number;
    rarity: number;
    color: string;
    image: string | null;
};

export type AnimalsGeneratorArgs = {
    freshWaterMap: BinaryMatrix,
    coastMap: CoastMap,
    forestsOperator: ForestsOperator,
    biomesOperator: BiomesOperator,
    timer: Timer
};

export default class AnimalGenerator {

    readonly objects: AnimalsGeneratorArgs;
    habitat: BinaryMatrix;
    respawnPoints: CellsList = [];
    maxAnimals: number = -1;

    constructor(objects: AnimalsGeneratorArgs) {
        this.objects = objects;
    }

    getName(): string {
        return Animal.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Animal;
    }

    getSettings(): AnimalType {
        return Config.ANIMALS[this.getName()];
    }

    getCreateIntensity(): number {
        return this.getSettings().intensity;
    }

    getRarity(): number {
        return this.getSettings().rarity;
    }

    updateHabitat(): this {

        if (typeof this.habitat === 'undefined') {
            this.setHabitat(new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 1));
        }

        return this;
    }

    setHabitat(habitat: BinaryMatrix) {
        this.habitat = habitat;
        this.maxAnimals = -1;
    }

    getHabitat(): BinaryMatrix {
        return this.habitat;
    }

    isCellInHabitat(x: number, y: number): boolean {
        return this.getHabitat().filled(x, y);
    }

    createRespawnPoint(): boolean {

        const habitat = this.getHabitat().clone();

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

    getRespawnPoints(): CellsList {
        return this.respawnPoints;
    }

    checkRespawns(animalsCount: number) {
        for (let i = 0; i < Math.ceil(animalsCount / 3) + 1; i++) { // @TODO 3 - bigger value = less respawn points
            this.createRespawnPoint();
        }
    }

    getMaxAnimals(): number {

        if (this.maxAnimals === -1) {
            this.maxAnimals = this.getHabitat().countFilled() * this.getRarity();
        }

        return this.maxAnimals;
    }

    createAnimal(anotherAnimalsPositions: CellsList): null | Animal {

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

        return new (this.getAnimalClass())(
            cell[0],
            cell[1],
            Config.ANIMALS[this.getName()]
        );
    }
}