import {getAroundRadius, getRectangleAround, iAmLucky, hexToRgb, logTimeEvent, Filters} from '../helpers.js';
import Config from "../../config.js";
import CowGenerator from "../generators/CowGenerator.js";
import DeerGenerator from "../generators/DeerGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
import {Cell, CellsList} from "../structures/Cells.js";
import Animal from "../animals/Animal.js";
import AnimalGenerator, {AnimalsGeneratorArgs} from "../generators/AnimalGenerator.js";
import {Layer} from "../render/Layer.js";
import FishGenerator from "../generators/FishGenerator.js";

type AnimalsTypesCounter = {
    [key: string]: number;
}

type AnimalsOperatorArgs = AnimalsGeneratorArgs & {
    habitatLayer: Layer,
    animalsLayer: Layer
};

export default class AnimalsOperator {

    animals: Animal[] = [];
    animalsPositions: CellsList = [];
    animalsTypesCounter: AnimalsTypesCounter = {};
    animalsGenerators: AnimalGenerator[] = [];
    animalImagesCache: DisplayCell[] = [];

    constructor(args: AnimalsOperatorArgs) {

        this.animalImagesCache = [];

        const _this: AnimalsOperator = this,
            animalGenerators = this.getAvailableGenerators();

        for (let i = 0; i < animalGenerators.length; i++) {
            _this.registerAnimalsGenerator(
                new animalGenerators[i](args)
            );
        }

        if (Config.LOGS) {
            logTimeEvent('Animals initialized.');
        }

        args.timer.addStepsHandler(function (): void {

            args.habitatLayer.reset();
            _this.updateHabitats();
            //_this.showHabitatsOnLayer(habitatLayer, Fish);

            args.animalsLayer.reset();

            _this.maybeCreateAnimals();
            _this.moveAnimals(args.animalsLayer);

            Filters.apply('animalsSteps', _this.animals);
        });
    }

    private updateHabitats() {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            this.animalsGenerators[i].updateHabitat();
        }
    }

    private addAnimalToLayer = function (animalsLayer: Layer, animal: Animal): void {
        const _this: AnimalsOperator = this;

        animalsLayer.setCell(
            animal.x,
            animal.y,
            _this.getDisplayCell(animal)
        );
    }

    private getAvailableGenerators = function (): typeof AnimalGenerator[] {
        return [
            //AnimalGenerator,
            FishGenerator,
            DeerGenerator,
            CowGenerator
        ];
    }

    private getCellsAvailableToMove(animal: Animal): CellsList {

        const result: CellsList = [],
            habitat = this.getAnimalGeneratorByAnimal(animal).getHabitat(),
            cellsAround = getRectangleAround(
                animal.x,
                animal.y,
                Config.WORLD_SIZE,
                Config.WORLD_SIZE
            );

        for (let i = 0; i < cellsAround.length; i++) {
            if (habitat.filled(cellsAround[i][0], cellsAround[i][1])) {
                result.push(cellsAround[i]);
            }
        }

        return result;
    }

    private isAnimalsAroundPoint = function (cell: Cell, animalToExcept: Animal): boolean {

        const availableCells = getAroundRadius(cell[0], cell[1], Config.WORLD_SIZE, Config.WORLD_SIZE, 2);

        for (let j = 0; j < availableCells.length; j++) {
            for (let i = 0; i < this.animals.length; i++) {
                if (
                    this.animals[i].id !== animalToExcept.id
                    && this.animals[i].x === availableCells[j][0]
                    && this.animals[i].y === availableCells[j][1]
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    private isAnimalsGeneratorRegistered(generator: AnimalGenerator): boolean {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === generator.getName()) {
                return true;
            }
        }

        return false;
    }

    private registerAnimalsGenerator(generator: AnimalGenerator) {
        if (!this.isAnimalsGeneratorRegistered(generator)) {

            this.animalsGenerators.push(generator);

            if (Config.LOGS) {
                console.log('Generator "' + generator.getName() + '" registered');
            }
        }
    }

    private incAnimalsCount(name: string) {
        this.animalsTypesCounter[name]++;
    }

    private decAnimalsCount(name: string) {
        this.animalsTypesCounter[name]--;
    }

    private getAnimalsCountByName(name: string): number {

        if (typeof this.animalsTypesCounter[name] === 'undefined') {
            this.animalsTypesCounter[name] = 0;
        }

        return this.animalsTypesCounter[name];
    }

    private maybeCreateAnimals() {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            const generator = this.animalsGenerators[i],
                animalsCount = this.getAnimalsCountByName(generator.getName());

            if (animalsCount > generator.getMaxAnimals()) {
                continue;
            }

            if (!iAmLucky(generator.getCreateIntensity())) {
                continue;
            }

            generator.checkRespawns(animalsCount);

            const animal = generator.createAnimal(this.animalsPositions);

            if (animal) {
                this.animals.push(animal);
                this.incAnimalsCount(animal.getName());
            }
        }
    }

    private getAnimalGeneratorByAnimal(animal: Animal): null | AnimalGenerator {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.getName()) {
                return this.animalsGenerators[i];
            }
        }

        return null;
    }

    private killAnimal(animal: Animal) {
        this.animals = this.animals.removeElementByValue(animal);
        this.decAnimalsCount(animal.getName());
    }

    private getNextMove(animal: Animal): null | Cell {

        if (!iAmLucky(animal.getMoveChance())) {
            return null;
        }

        let nextPoint: null | Cell = null,
            availableCells = this.getCellsAvailableToMove(animal);

        while (!nextPoint && availableCells.length) {
            nextPoint = availableCells.randomElement();

            if (this.isAnimalsAroundPoint(nextPoint, animal)) {
                availableCells = availableCells.removeElementByValue(nextPoint);
                nextPoint = null;
            }
        }

        return nextPoint;
    }

    private moveAnimals(animalsLayer: Layer) {

        let animal: Animal,
            nextPoint: Cell;

        this.animalsPositions = [];

        for (let i = 0; i < this.animals.length; i++) {

            animal = this.animals[i];
            nextPoint = this.getNextMove(animal);

            if (nextPoint) {
                animal.moveTo(nextPoint[0], nextPoint[1]);
                this.addAnimalToLayer(animalsLayer, animal);
            } else {

                const generator = this.getAnimalGeneratorByAnimal(animal);

                if (generator.isCellInHabitat(animal.x, animal.y)) {
                    this.addAnimalToLayer(animalsLayer, animal);
                } else { // if animal can't move & it's not in habitat - it must be killed
                    this.killAnimal(animal);
                }
            }

            this.animalsPositions.push(
                animal.getPosition()
            );
        }
    }

    private getDisplayCell = function (animal: Animal): DisplayCell {

        if (typeof this.animalImagesCache[animal.getName()] === 'undefined') {
            this.animalImagesCache[animal.getName()] = new DisplayCell(
                hexToRgb(animal.getColor()),
                animal.getImage()
            );
        }

        return this.animalImagesCache[animal.getName()];
    }

    private showHabitatsOnLayer(habitatLayer: Layer, animal: Animal) {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.getName()) {
                this.animalsGenerators[i].getHabitat().foreachFilled(function (x: number, y: number): void {
                    habitatLayer.setCell(x, y, new DisplayCell([100, 100, 200, 255], null));
                });
            }
        }
    }
}