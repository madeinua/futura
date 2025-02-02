import BinaryMatrix from "../structures/BinaryMatrix.js";
import {throwError} from "../helpers.js";
import Config from "../../config.js";
import Animal from "../animals/Animal.js";
import {CellsList, Cell} from "../structures/Cells.js";
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
    freshWaterMap: BinaryMatrix;
    coastMap: CoastMap;
    forestsOperator: ForestsOperator;
    biomesOperator: BiomesOperator;
    timer: Timer;
};

export default class AnimalGenerator {

    readonly objects: AnimalsGeneratorArgs;
    public habitat: BinaryMatrix;
    private respawnPoints: CellsList = [];
    private maxAnimals = -1;
    protected staticHabitat: boolean = false;

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

    public isHabitatStatic(): boolean {
        return this.staticHabitat;
    }

    updateHabitat(): this {
        if (!this.habitat) {
            this.setHabitat(new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 1));
        }
        return this;
    }

    setHabitat(habitat: BinaryMatrix): void {
        this.habitat = habitat;
        this.maxAnimals = -1; // Force recalculation
    }

    getHabitat(): BinaryMatrix {
        return this.habitat;
    }

    isCellInHabitat(x: number, y: number): boolean {
        return this.getHabitat().filled(x, y);
    }

    createRespawnPoint(): boolean {
        const habitatClone = this.getHabitat().clone();
        habitatClone.diffCells(this.getRespawnPoints());
        if (!habitatClone.hasFilled()) {
            return false;
        }
        const point = habitatClone.getFilledCells().randomElement();
        if (!point) {
            throwError("Cannot create animal", 1, true);
            return false;
        }
        this.respawnPoints.push(point);
        return true;
    }

    getRespawnPoints(): CellsList {
        return this.respawnPoints;
    }

    checkRespawns(animalsCount: number): void {
        const respawnChecks = Math.ceil(animalsCount / 3) + 1;
        for (let i = 0; i < respawnChecks; i++) {
            this.createRespawnPoint();
        }
    }

    getMaxAnimals(): number {
        if (this.maxAnimals === -1) {
            this.maxAnimals = this.getHabitat().countFilled() * this.getRarity();
        }
        return this.maxAnimals;
    }

    createAnimal(anotherAnimalsPositions: CellsList): Animal | null {
        // Filter respawn points that are sufficiently far from existing animals and inside the habitat.
        const availableRespawns = this.getRespawnPoints().filter((cell: Cell) => {
            return (
                anotherAnimalsPositions.getClosestDistanceTo(cell[0], cell[1]) >= 3 &&
                this.isCellInHabitat(cell[0], cell[1])
            );
        });

        if (!availableRespawns.length) {
            return null;
        }

        const cell = availableRespawns.randomElement();

        if (!cell) {
            throwError("Cannot create animal", 1, true);
            return null;
        }

        return new (this.getAnimalClass())(cell[0], cell[1], this.getSettings());
    }
}