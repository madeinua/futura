import {getAroundRadius, getRectangleAround, iAmLucky, hexToRgb, createImage, logTimeEvent, Filters} from '../helpers.js';
import Config from "../../config.js";
import CowGenerator from "../generators/CowGenerator.js";
import DeerGenerator from "../generators/DeerGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
import {Cell, CellsList} from "../structures/Cells.js";
import Animal from "../animals/Animal.js";
import AnimalGenerator from "../generators/AnimalGenerator.js";
import Timer from "../services/Timer.js";
import {Layer} from "../render/Layer.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import CoastMap from "../maps/CoastMap.js";
import BiomesOperator from "./BiomesOperator.js";
import ForestsOperator from "./ForestsOperator.js";
import FishGenerator from "../generators/FishGenerator.js";

type AnimalsTypesCounter = {
    [key: string]: number;
}

export type AnimalsOperatorArgs = {
    freshWaterMap: BinaryMatrix,
    coastMap: CoastMap,
    forestsOperator: ForestsOperator,
    biomesOperator: BiomesOperator,
    timer: Timer
}

export default class AnimalsOperator {

    animals: Animal[] = [];
    animalsPositions: CellsList = [];
    animalsTypesCounter: AnimalsTypesCounter = {};
    animalsGenerators: AnimalGenerator[] = [];
    animalImagesCache: DisplayCell[] = [];

    constructor(timer: Timer, habitatLayer: Layer, animalsLayer: Layer, objects: AnimalsOperatorArgs) {

        this.animalImagesCache = [];

        let _this = this,
            animalGenerators = this.getAvailableGenerators();

        objects.timer = timer;

        for (let i = 0; i < animalGenerators.length; i++) {
            _this.registerAnimalsGenerator(
                new animalGenerators[i](objects)
            );
        }

        if (Config.LOGS) {
            logTimeEvent('Animals initialized.');
        }

        timer.addStepsHandler(function () {

            habitatLayer.reset();
            _this.updateHabitats();
            //_this.showHabitatsOnLayer(habitatLayer, Fish);

            animalsLayer.reset();

            _this.maybeCreateAnimals();
            _this.moveAnimals(animalsLayer);

            Filters.apply('animalsSteps', _this.animals);
        });
    }

    updateHabitats() {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            this.animalsGenerators[i].updateHabitat();
        }
    }

    addAnimalToLayer = function (animalsLayer: Layer, animal: Animal) {
        animalsLayer.setCell(
            animal.x,
            animal.y,
            this.getDisplayCell(animal)
        );
    }

    getAvailableGenerators = function (): typeof AnimalGenerator[] {
        return [
            //AnimalGenerator,
            FishGenerator,
            DeerGenerator,
            CowGenerator
        ];
    }

    getCellsAvailableToMove(animal: Animal): CellsList {

        let result = [],
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

    isAnimalsAroundPoint = function (cell: Cell, animalToExcept: Animal): boolean {

        let availableCells = getAroundRadius(cell[0], cell[1], Config.WORLD_SIZE, Config.WORLD_SIZE, 2);

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

    isAnimalsGeneratorRegistered(generator: AnimalGenerator): boolean {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === generator.getName()) {
                return true;
            }
        }

        return false;
    }

    registerAnimalsGenerator(generator: AnimalGenerator) {
        if (!this.isAnimalsGeneratorRegistered(generator)) {

            this.animalsGenerators.push(generator);

            if (Config.LOGS) {
                console.log('Generator "' + generator.getName() + '" registered');
            }
        }
    }

    incAnimalsCount(name: string) {
        this.animalsTypesCounter[name]++;
    }

    decAnimalsCount(name: string) {
        this.animalsTypesCounter[name]--;
    }

    getAnimalsCountByName(name: string): number {

        if (typeof this.animalsTypesCounter[name] === 'undefined') {
            this.animalsTypesCounter[name] = 0;
        }

        return this.animalsTypesCounter[name];
    }

    maybeCreateAnimals() {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            let generator = this.animalsGenerators[i],
                animalsCount = this.getAnimalsCountByName(generator.getName());

            if (animalsCount > generator.getMaxAnimals()) {
                continue;
            }

            if (!iAmLucky(generator.getCreateIntensity())) {
                continue;
            }

            generator.checkRespawns(animalsCount);

            let animal = generator.createAnimal(
                this.animalsPositions
            );

            if (animal) {
                this.animals.push(animal);
                this.incAnimalsCount(animal.getName());
            }
        }
    }

    getAnimalGeneratorByAnimal(animal: Animal): null | AnimalGenerator {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.getName()) {
                return this.animalsGenerators[i];
            }
        }

        return null;
    }

    killAnimal(animal: Animal) {
        this.animals = this.animals.removeElementByValue(animal);
        this.decAnimalsCount(animal.getName());
    }

    getNextMove(animal: Animal): null | Cell {

        if (!iAmLucky(animal.getMoveChance())) {
            return null;
        }

        let nextPoint = null,
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

    moveAnimals(animalsLayer: Layer) {

        let animal,
            nextPoint;

        this.animalsPositions = [];

        for (let i = 0; i < this.animals.length; i++) {

            animal = this.animals[i];

            nextPoint = this.getNextMove(animal);

            if (nextPoint) {
                animal.moveTo(nextPoint[0], nextPoint[1]);
                this.addAnimalToLayer(animalsLayer, animal);
            } else {

                let generator = this.getAnimalGeneratorByAnimal(animal);

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

    showHabitatsOnLayer(habitatLayer: Layer, animal: Animal) {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.getName()) {
                this.animalsGenerators[i].getHabitat().foreachFilled(function (x, y) {
                    habitatLayer.setCell(x, y, [100, 100, 200, 255]);
                });
            }
        }
    }

    getDisplayCell = function (animal: Animal): DisplayCell {

        if (typeof this.animalImagesCache[animal.getName()] === 'undefined') {
            this.animalImagesCache[animal.getName()] = new DisplayCell(
                hexToRgb(animal.getColor()),
                createImage(animal.getImage()),
                false
            );
        }

        return this.animalImagesCache[animal.getName()];
    }
}