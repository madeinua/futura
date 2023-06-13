import CowGenerator from "../generators/CowGenerator.js";
import DeerGenerator from "../generators/DeerGenerator.js";
import FishGenerator from "../generators/FishGenerator.js";
import DisplayCell from "../render/DisplayCell.js"
import {getAroundRadius, getRectangleAround, iAmLucky, hexToRgb, createImage, logTimeEvent, Filters} from '../helpers.js';

export default class AnimalsOperator {

    /** @var {Animal[]} */
    animals = [];

    /** @var {Array} */
    animalsPositions = [];

    /** @var {Object} */
    animalsTypesCounter = {};

    /** @var {AnimalGenerator[]} */
    animalsGenerators = [];

    /** @var {Object} */
    config;

    /**
     * @param {Timer} timer
     * @param {Layer} habitatLayer
     * @param {Layer} animalsLayer
     * @param {Object} objects
     * @param {Object} config
     */
    constructor(timer, habitatLayer, animalsLayer, objects, config) {

        this.animalImagesCache = [];
        this.config = config;

        let _this = this,
            animalGenerators = this.getAvailableGenerators();

        objects.timer = timer;

        for (let i = 0; i < animalGenerators.length; i++) {
            _this.registerAnimalsGenerator(
                new animalGenerators[i](objects, config)
            );
        }

        if (config.LOGS) {
            logTimeEvent('Animals initialized.');
        }

        timer.addStepsHandler(function() {

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

    /**
     * @param {Layer} animalsLayer
     * @param {Animal} animal
     */
    addAnimalToLayer = function(animalsLayer, animal) {
        animalsLayer.setCell(
            animal.x,
            animal.y,
            this.getDisplayCell(animal)
        );
    };

    /**
     * @returns {AnimalGenerator[]}
     */
    getAvailableGenerators = function() {
        return [
            //AnimalGenerator,
            FishGenerator,
            DeerGenerator,
            CowGenerator
        ];
    };

    /**
     * @param {Animal} animal
     * @return {Array}
     */
    getCellsAvailableToMove(animal) {

        let result = [],
            habitat = this.getAnimalGeneratorByAnimal(animal).getHabitat(),
            cellsAround = getRectangleAround(
                animal.x,
                animal.y,
                this.config.WORLD_SIZE,
                this.config.WORLD_SIZE
            );

        for (let i = 0; i < cellsAround.length; i++) {
            if (habitat.filled(cellsAround[i][0], cellsAround[i][1])) {
                result.push(cellsAround[i]);
            }
        }

        return result;
    }

    /**
     * @param {Array} cell
     * @param {Animal} animalToExcept
     * @return {boolean}
     */
    isAnimalsAroundPoint = function(cell, animalToExcept) {

        let availableCells = getAroundRadius(cell[0], cell[1], this.config.WORLD_SIZE, this.config.WORLD_SIZE, 2);

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

    /**
     * @param {AnimalGenerator} generator
     * @return {boolean}
     */
    isAnimalsGeneratorRegistered(generator) {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === generator.getName()) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {AnimalGenerator} generator
     */
    registerAnimalsGenerator(generator) {
        if (!this.isAnimalsGeneratorRegistered(generator)) {

            this.animalsGenerators.push(generator);

            if (this.config.LOGS) {
                console.log('Generator "' + generator.getName() + '" registered');
            }
        }
    }

    /**
     * @param {string} name
     */
    incAnimalsCount(name) {
        this.animalsTypesCounter[name]++;
    }

    /**
     * @param {string} name
     */
    decAnimalsCount(name) {
        this.animalsTypesCounter[name]--;
    }

    /**
     * @param {string} name
     * @returns {number}
     */
    getAnimalsCountByName(name) {

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

    /**
     * @param {Animal} animal
     * @returns {null|AnimalGenerator}
     */
    getAnimalGeneratorByAnimal(animal) {

        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.getName()) {
                return this.animalsGenerators[i];
            }
        }

        return null;
    }

    /**
     * @param {Animal} animal
     */
    killAnimal(animal) {
        this.animals = this.animals.removeElementByValue(animal);
        this.decAnimalsCount(animal.getName());
    }

    /**
     * @param {Layer} habitatLayer
     * @param {Animal} animal
     */
    showHabitatsOnLayer(habitatLayer, animal) {
        for (let i = 0; i < this.animalsGenerators.length; i++) {
            if (this.animalsGenerators[i].getName() === animal.constructor.NAME) {
                this.animalsGenerators[i].getHabitat().foreachFilled(function(x, y) {
                    habitatLayer.setCell(x, y, [100, 100, 200, 255]);
                });
            }
        }
    }

    /**
     * @param {Animal} animal
     * @return {boolean|Array}
     */
    getNextMove(animal) {

        if (!iAmLucky(animal.getMoveChance())) {
            return false;
        }

        let nextPoint = false,
            availableCells = this.getCellsAvailableToMove(animal);

        while(!nextPoint && availableCells.length) {

            nextPoint = availableCells.randomElement();

            if (this.isAnimalsAroundPoint(nextPoint, animal)) {
                availableCells = availableCells.removeElementByValue(nextPoint);
                nextPoint = false;
            }
        }

        return nextPoint;
    }

    /**
     * @parma {Layer} animalsLayer
     */
    moveAnimals(animalsLayer) {

        let animal,
            nextPoint;

        this.animalsPositions = [];

        for (let i = 0; i < this.animals.length; i++) {

            animal = this.animals[i];

            nextPoint = this.getNextMove(animal);

            if (nextPoint !== false) {
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

    /**
     * @param {Animal} animal
     * @return {DisplayCell}
     */
    getDisplayCell = function(animal) {

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