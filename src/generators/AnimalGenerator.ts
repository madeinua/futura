import Config from "../../config";
import {throwError} from "../helpers";
import BinaryMatrix from "../structures/BinaryMatrix";
import Animal from "../animals/Animal";
import {CellsList, Cell} from "../structures/Cells";
import CoastMap from "../maps/CoastMap";
import ForestsOperator from "../operators/ForestsOperator";
import BiomesOperator from "../operators/BiomesOperator";
import Timer from "../services/Timer";
import AltitudeMap from "../maps/AltitudeMap";

type AnimalKey = keyof typeof Config.ANIMALS;
type AnimalSettings = typeof Config.ANIMALS[AnimalKey];

export type AnimalsGeneratorArgs = {
    altitudeMap: AltitudeMap,
    freshWaterMap: BinaryMatrix;
    coastMap: CoastMap;
    forestsOperator: ForestsOperator;
    biomesOperator: BiomesOperator;
    timer: Timer;
};

export default class AnimalGenerator {

    readonly objects: AnimalsGeneratorArgs;
    public habitat!: BinaryMatrix;
    private respawnPoints: CellsList = [];
    private maxAnimals = -1;

    constructor(objects: AnimalsGeneratorArgs) {
        this.objects = objects;
    }

    getName(): string {
        return Animal.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Animal;
    }

    getSettings(): AnimalSettings {
        return Config.ANIMALS[this.getName() as AnimalKey];
    }

    getRarity(): number {
        return this.getSettings().rarity;
    }

    needUpdateHabitat(): boolean {
        return false;
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
                anotherAnimalsPositions.getClosestDistanceTo(cell[0], cell[1]) >= Config.DISTANCE_BETWEEN_ANIMALS &&
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