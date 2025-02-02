import { getAroundRadius, getRectangleAround, iAmLucky, hexToRgb, logTimeEvent, Filters, } from "../helpers.js";
import Config from "../../config.js";
import CowGenerator from "../generators/CowGenerator.js";
import DeerGenerator from "../generators/DeerGenerator.js";
import FishGenerator from "../generators/FishGenerator.js";
import DisplayCell from "../render/DisplayCell.js";
export default class AnimalsOperator {
    constructor(args) {
        this.animals = [];
        this.animalsPositions = [];
        this.animalsTypesCounter = {};
        this.animalsGenerators = [];
        this.animalImagesCache = {};
        this.initializeAnimalGenerators(args);
        if (Config.LOGS) {
            logTimeEvent("Animals initialized.");
        }
        args.timer.addStepsHandler(() => {
            this.step(args.habitatLayer, args.animalsLayer);
        });
    }
    initializeAnimalGenerators(args) {
        const availableGenerators = this.getAvailableGenerators();
        availableGenerators.forEach((Generator) => {
            const generatorInstance = new Generator(args);
            this.registerAnimalsGenerator(generatorInstance);
        });
    }
    step(habitatLayer, animalsLayer) {
        habitatLayer.reset();
        this.updateHabitats();
        animalsLayer.reset();
        this.maybeCreateAnimals();
        this.moveAnimals(animalsLayer);
        Filters.apply("animalsSteps", this.animals);
    }
    updateHabitats() {
        this.animalsGenerators.forEach(generator => {
            // Only update habitat if it is not static.
            if (!generator.isHabitatStatic()) {
                generator.updateHabitat();
            }
        });
    }
    addAnimalToLayer(animalsLayer, animal) {
        animalsLayer.setCell(animal.x, animal.y, this.getDisplayCell(animal));
    }
    getAvailableGenerators() {
        return [FishGenerator, DeerGenerator, CowGenerator];
    }
    getCellsAvailableToMove(animal) {
        const generator = this.getAnimalGeneratorByAnimal(animal);
        if (!generator) {
            return [];
        }
        const habitat = generator.getHabitat();
        const cellsAround = getRectangleAround(animal.x, animal.y, Config.WORLD_SIZE, Config.WORLD_SIZE);
        return cellsAround.filter(([x, y]) => habitat.filled(x, y));
    }
    isAnimalsAroundPoint(cell, animalToExcept) {
        const availableCells = getAroundRadius(cell[0], cell[1], Config.WORLD_SIZE, Config.WORLD_SIZE, 2);
        return availableCells.some(([x, y]) => this.animals.some((animal) => animal.id !== animalToExcept.id && animal.x === x && animal.y === y));
    }
    isAnimalsGeneratorRegistered(generator) {
        return this.animalsGenerators.some((registered) => registered.getName() === generator.getName());
    }
    registerAnimalsGenerator(generator) {
        if (!this.isAnimalsGeneratorRegistered(generator)) {
            this.animalsGenerators.push(generator);
            if (Config.LOGS) {
                console.log(`Generator "${generator.getName()}" registered`);
            }
        }
    }
    incAnimalsCount(name) {
        this.animalsTypesCounter[name] = (this.animalsTypesCounter[name] || 0) + 1;
    }
    decAnimalsCount(name) {
        this.animalsTypesCounter[name] = (this.animalsTypesCounter[name] || 1) - 1;
    }
    getAnimalsCountByName(name) {
        return this.animalsTypesCounter[name] || 0;
    }
    maybeCreateAnimals() {
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
    getAnimalGeneratorByAnimal(animal) {
        return this.animalsGenerators.find((generator) => generator.getName() === animal.getName()) || null;
    }
    killAnimal(animal) {
        this.animals = this.animals.filter((a) => a !== animal);
        this.decAnimalsCount(animal.getName());
    }
    getNextMove(animal) {
        if (!iAmLucky(animal.getMoveChance())) {
            return null;
        }
        let availableCells = this.getCellsAvailableToMove(animal);
        let nextPoint = null;
        while (!nextPoint && availableCells.length) {
            nextPoint = availableCells.randomElement() || null;
            if (nextPoint && this.isAnimalsAroundPoint(nextPoint, animal)) {
                availableCells = availableCells.filter((cell) => cell !== nextPoint);
                nextPoint = null;
            }
        }
        return nextPoint;
    }
    moveAnimals(animalsLayer) {
        this.animalsPositions = [];
        this.animals.forEach((animal) => {
            const nextPoint = this.getNextMove(animal);
            if (nextPoint) {
                animal.moveTo(nextPoint[0], nextPoint[1]);
                this.addAnimalToLayer(animalsLayer, animal);
            }
            else {
                const generator = this.getAnimalGeneratorByAnimal(animal);
                if (generator === null || generator === void 0 ? void 0 : generator.isCellInHabitat(animal.x, animal.y)) {
                    this.addAnimalToLayer(animalsLayer, animal);
                }
                else {
                    this.killAnimal(animal);
                }
            }
            this.animalsPositions.push(animal.getPosition());
        });
    }
    getDisplayCell(animal) {
        const key = animal.getName();
        if (!this.animalImagesCache[key]) {
            this.animalImagesCache[key] = new DisplayCell(hexToRgb(animal.getColor()), animal.getImage());
        }
        return this.animalImagesCache[key];
    }
    showHabitatsOnLayer(habitatLayer, animal) {
        const generator = this.getAnimalGeneratorByAnimal(animal);
        generator === null || generator === void 0 ? void 0 : generator.getHabitat().foreachFilled((x, y) => {
            habitatLayer.setCell(x, y, new DisplayCell([100, 100, 200, 255], null));
        });
    }
}
