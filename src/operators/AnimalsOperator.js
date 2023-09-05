import { getAroundRadius, getRectangleAround, iAmLucky, hexToRgb, createImage, logTimeEvent, Filters } from '../helpers.js';
import Config from "../../config.js";
import CowGenerator from "../generators/CowGenerator.js";
import DeerGenerator from "../generators/DeerGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
import FishGenerator from "../generators/FishGenerator.js";
export default class AnimalsOperator {
    constructor(habitatLayer, animalsLayer, objects) {
        this.animals = [];
        this.animalsPositions = [];
        this.animalsTypesCounter = {};
        this.animalsGenerators = [];
        this.animalImagesCache = [];
        this.addAnimalToLayer = function (animalsLayer, animal) {
            const _this = this;
            animalsLayer.setCell(animal.x, animal.y, _this.getDisplayCell(animal));
        };
        this.getAvailableGenerators = function () {
            return [
                //AnimalGenerator,
                FishGenerator,
                DeerGenerator,
                CowGenerator
            ];
        };
        this.isAnimalsAroundPoint = function (cell, animalToExcept) {
            const availableCells = getAroundRadius(cell[0], cell[1], Config.WORLD_SIZE, Config.WORLD_SIZE, 2);
            for (let j = 0; j < availableCells.length; j++) {
                for (let i = 0; i < this.animals.length; i++) {
                    if (this.animals[i].id !== animalToExcept.id
                        && this.animals[i].x === availableCells[j][0]
                        && this.animals[i].y === availableCells[j][1]) {
                        return true;
                    }
                }
            }
            return false;
        };
        this.getDisplayCell = function (animal) {
            if (typeof this.animalImagesCache[animal.getName()] === 'undefined') {
                this.animalImagesCache[animal.getName()] = new DisplayCell(hexToRgb(animal.getColor()), createImage(animal.getImage()), false);
            }
            return this.animalImagesCache[animal.getName()];
        };
        this.animalImagesCache = [];
        const _this = this, animalGenerators = this.getAvailableGenerators();
        for (let i = 0; i < animalGenerators.length; i++) {
            _this.registerAnimalsGenerator(new animalGenerators[i](objects));
        }
        if (Config.LOGS) {
            logTimeEvent('Animals initialized.');
        }
        objects.timer.addStepsHandler(function () {
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
    getCellsAvailableToMove(animal) {
        const result = [], habitat = this.getAnimalGeneratorByAnimal(animal).getHabitat(), cellsAround = getRectangleAround(animal.x, animal.y, Config.WORLD_SIZE, Config.WORLD_SIZE);
        for (let i = 0; i < cellsAround.length; i++) {
            if (habitat.filled(cellsAround[i][0], cellsAround[i][1])) {
                result.push(cellsAround[i]);
            }
        }
        return result;
    }
    isAnimalsGeneratorRegistered(generator) {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === generator.getName()) {
                return true;
            }
        }
        return false;
    }
    registerAnimalsGenerator(generator) {
        if (!this.isAnimalsGeneratorRegistered(generator)) {
            this.animalsGenerators.push(generator);
            if (Config.LOGS) {
                console.log('Generator "' + generator.getName() + '" registered');
            }
        }
    }
    incAnimalsCount(name) {
        this.animalsTypesCounter[name]++;
    }
    decAnimalsCount(name) {
        this.animalsTypesCounter[name]--;
    }
    getAnimalsCountByName(name) {
        if (typeof this.animalsTypesCounter[name] === 'undefined') {
            this.animalsTypesCounter[name] = 0;
        }
        return this.animalsTypesCounter[name];
    }
    maybeCreateAnimals() {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            const generator = this.animalsGenerators[i], animalsCount = this.getAnimalsCountByName(generator.getName());
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
    getAnimalGeneratorByAnimal(animal) {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.getName()) {
                return this.animalsGenerators[i];
            }
        }
        return null;
    }
    killAnimal(animal) {
        this.animals = this.animals.removeElementByValue(animal);
        this.decAnimalsCount(animal.getName());
    }
    getNextMove(animal) {
        if (!iAmLucky(animal.getMoveChance())) {
            return null;
        }
        let nextPoint = null, availableCells = this.getCellsAvailableToMove(animal);
        while (!nextPoint && availableCells.length) {
            nextPoint = availableCells.randomElement();
            if (this.isAnimalsAroundPoint(nextPoint, animal)) {
                availableCells = availableCells.removeElementByValue(nextPoint);
                nextPoint = null;
            }
        }
        return nextPoint;
    }
    moveAnimals(animalsLayer) {
        let animal, nextPoint;
        this.animalsPositions = [];
        for (let i = 0; i < this.animals.length; i++) {
            animal = this.animals[i];
            nextPoint = this.getNextMove(animal);
            if (nextPoint) {
                animal.moveTo(nextPoint[0], nextPoint[1]);
                this.addAnimalToLayer(animalsLayer, animal);
            }
            else {
                const generator = this.getAnimalGeneratorByAnimal(animal);
                if (generator.isCellInHabitat(animal.x, animal.y)) {
                    this.addAnimalToLayer(animalsLayer, animal);
                }
                else { // if animal can't move & it's not in habitat - it must be killed
                    this.killAnimal(animal);
                }
            }
            this.animalsPositions.push(animal.getPosition());
        }
    }
    showHabitatsOnLayer(habitatLayer, animal) {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.getName()) {
                this.animalsGenerators[i].getHabitat().foreachFilled(function (x, y) {
                    habitatLayer.setCell(x, y, [100, 100, 200, 255]);
                });
            }
        }
    }
}
