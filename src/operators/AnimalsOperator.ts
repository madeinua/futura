import {
    getAroundRadius,
    getRectangleAround,
    iAmLucky,
    hexToRgb,
    logTimeEvent,
    Filters,
} from "../helpers.js";
import Config from "../../config.js";
import CowGenerator from "../generators/CowGenerator.js";
import DeerGenerator from "../generators/DeerGenerator.js";
import FishGenerator from "../generators/FishGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
import {Cell, CellsList} from "../structures/Cells.js";
import Animal from "../animals/Animal.js";
import AnimalGenerator, {AnimalsGeneratorArgs} from "../generators/AnimalGenerator.js";
import {Layer} from "../render/Layer.js";

type AnimalsTypesCounter = { [key: string]: number };

type AnimalsOperatorArgs = AnimalsGeneratorArgs & {
    habitatLayer: Layer;
    animalsLayer: Layer;
};

export default class AnimalsOperator {
    animals: Animal[] = [];
    animalsPositions: CellsList = [];
    animalsTypesCounter: AnimalsTypesCounter = {};
    animalsGenerators: AnimalGenerator[] = [];
    private animalImagesCache: { [key: string]: DisplayCell } = {};
    private habitatInitialized = false;

    constructor(args: AnimalsOperatorArgs) {
        this.initializeAnimalGenerators(args);

        if (Config.LOGS) {
            logTimeEvent("Animals initialized.");
        }

        args.timer.addStepsHandler((): void => {
            this.step(args.habitatLayer, args.animalsLayer);
        });
    }

    private initializeAnimalGenerators(args: AnimalsOperatorArgs): void {
        const availableGenerators = this.getAvailableGenerators();

        availableGenerators.forEach((Generator) => {
            const generatorInstance = new Generator(args);
            this.registerAnimalsGenerator(generatorInstance);
        });
    }

    private step(habitatLayer: Layer, animalsLayer: Layer): void {
        habitatLayer.reset();
        this.updateHabitats();

        animalsLayer.reset();
        this.maybeCreateAnimals();
        this.moveAnimals(animalsLayer);

        Filters.apply("animalsSteps", this.animals);
    }

    private updateHabitats(): void {
        this.animalsGenerators.forEach(generator => {
            // Only update habitat if it is not static.
            if (!this.habitatInitialized || generator.needUpdateHabitat()) {
                generator.updateHabitat();
            }
        });

        this.habitatInitialized = true;
    }

    private addAnimalToLayer(animalsLayer: Layer, animal: Animal): void {
        animalsLayer.setCell(animal.x, animal.y, this.getDisplayCell(animal));
    }

    private getAvailableGenerators(): typeof AnimalGenerator[] {
        return [FishGenerator, DeerGenerator, CowGenerator];
    }

    private getCellsAvailableToMove(animal: Animal): CellsList {
        const generator = this.getAnimalGeneratorByAnimal(animal);
        if (!generator) {
            return [];
        }

        const habitat = generator.getHabitat();
        const cellsAround = getRectangleAround(animal.x, animal.y, Config.WORLD_SIZE, Config.WORLD_SIZE);

        return cellsAround.filter(([x, y]) => habitat.filled(x, y));
    }

    private isAnimalsAroundPoint(cell: Cell, animalToExcept: Animal): boolean {
        const availableCells = getAroundRadius(cell[0], cell[1], Config.WORLD_SIZE, Config.WORLD_SIZE, 2);

        return availableCells.some(([x, y]) =>
            this.animals.some((animal) => animal.id !== animalToExcept.id && animal.x === x && animal.y === y)
        );
    }

    private isAnimalsGeneratorRegistered(generator: AnimalGenerator): boolean {
        return this.animalsGenerators.some((registered) => registered.getName() === generator.getName());
    }

    private registerAnimalsGenerator(generator: AnimalGenerator): void {
        if (!this.isAnimalsGeneratorRegistered(generator)) {
            this.animalsGenerators.push(generator);

            if (Config.LOGS) {
                console.log(`Generator "${generator.getName()}" registered`);
            }
        }
    }

    private incAnimalsCount(name: string): void {
        this.animalsTypesCounter[name] = (this.animalsTypesCounter[name] || 0) + 1;
    }

    private decAnimalsCount(name: string): void {
        this.animalsTypesCounter[name] = (this.animalsTypesCounter[name] || 1) - 1;
    }

    private getAnimalsCountByName(name: string): number {
        return this.animalsTypesCounter[name] || 0;
    }

    private maybeCreateAnimals(): void {
        this.animalsGenerators.forEach((generator) => {
            const name = generator.getName();
            const animalsCount = this.getAnimalsCountByName(name);

            if (animalsCount > generator.getMaxAnimals() || !iAmLucky(generator.getCreateIntensity())) {
                return;
            }

            generator.checkRespawns(animalsCount);

            const animal = generator.createAnimal(this.animalsPositions);

            if (animal) {
                this.animals.push(animal);
                this.incAnimalsCount(animal.getName());
            }
        });
    }

    private getAnimalGeneratorByAnimal(animal: Animal): AnimalGenerator | null {
        return this.animalsGenerators.find((generator) => generator.getName() === animal.getName()) || null;
    }

    private killAnimal(animal: Animal): void {
        this.animals = this.animals.filter((a) => a !== animal);
        this.decAnimalsCount(animal.getName());
    }

    private getNextMove(animal: Animal): Cell | null {

        if (!iAmLucky(animal.getMoveChance())) {
            return null;
        }

        let availableCells = this.getCellsAvailableToMove(animal);
        let nextPoint: Cell | null = null;

        while (!nextPoint && availableCells.length) {
            nextPoint = availableCells.randomElement() || null;
            if (nextPoint && this.isAnimalsAroundPoint(nextPoint, animal)) {
                availableCells = availableCells.filter((cell) => cell !== nextPoint);
                nextPoint = null;
            }
        }
        return nextPoint;
    }

    private moveAnimals(animalsLayer: Layer): void {
        this.animalsPositions = [];

        this.animals.forEach((animal) => {
            const nextPoint = this.getNextMove(animal);

            if (nextPoint) {
                animal.moveTo(nextPoint[0], nextPoint[1]);
                this.addAnimalToLayer(animalsLayer, animal);
            } else {
                const generator = this.getAnimalGeneratorByAnimal(animal);

                if (generator?.isCellInHabitat(animal.x, animal.y)) {
                    this.addAnimalToLayer(animalsLayer, animal);
                } else {
                    this.killAnimal(animal);
                }
            }

            this.animalsPositions.push(animal.getPosition());
        });
    }

    private getDisplayCell(animal: Animal): DisplayCell {
        const key = animal.getName();

        if (!this.animalImagesCache[key]) {
            this.animalImagesCache[key] = new DisplayCell(
                hexToRgb(animal.getColor()),
                animal.getImage()
            );
        }

        return this.animalImagesCache[key];
    }

    private showHabitatsOnLayer(habitatLayer: Layer, animal: Animal): void {
        const generator = this.getAnimalGeneratorByAnimal(animal);

        generator?.getHabitat().foreachFilled((x, y) => {
            habitatLayer.setCell(x, y, new DisplayCell([100, 100, 200, 255], null));
        });
    }
}