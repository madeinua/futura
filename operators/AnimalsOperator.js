class AnimalsOperator {

    /** @var {Array} */
    animals = [];

    /** @var {Array} */
    animalsGenerators = [];

    /**
     * @param {OceanMap} oceanMap
     * @param {CoastMap} coastMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {Array} tickHandlers
     * @param {Layer} animalsLayer
     */
    constructor(oceanMap, freshWaterMap, coastMap, tickHandlers, animalsLayer) {

        this.animalImagesCache = [];

        let _this = this,
            animalsMap = new AnimalsMap(),
            animalGenerators = this.getAvailableGenerators();

        for (let i = 0; i < animalGenerators.length; i++) {
            _this.registerAnimalsGenerator(
                new animalGenerators[i](oceanMap, freshWaterMap, coastMap)
            );
        }

        if (config.LOGS) {
            logTimeEvent('Animals initialized.');
        }

        tickHandlers.push(function() {

            animalsMap.map(false);
            _this.cleanAnimalsLayer(animalsLayer);

            _this.touchAnimals();
            _this.maybeKillAnimals();
            _this.maybeCreateAnimals();

            _this.moveAnimals(function(animal) {
                _this.addAnimalToLayer(animalsLayer, animal);
                animalsMap.setTile(animal.x, animal.y, 1);
            });

            Filters.apply('animalsMap', animalsMap);
        });
    }

    /**
     * @param {Layer} animalsLayer
     */
    cleanAnimalsLayer = function(animalsLayer) {
        animalsLayer.reset();
    };

    /**
     * @param {Layer} animalsLayer
     * @param {Animal} animal
     */
    addAnimalToLayer = function(animalsLayer, animal) {
        animalsLayer.setTile(
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
            FishGenerator
        ];
    };

    /**
     * @param {Animal} animal
     * @return {Array}
     */
    getTilesAvailableToMove(animal) {

        let result = [],
            habitat = this.getAnimalGeneratorByAnimal(animal).getHabitat(),
            tilesAround = getRectangleAround(
                animal.x,
                animal.y,
                config.WORLD_SIZE,
                config.WORLD_SIZE
            );

        for (let i = 0; i < tilesAround.length; i++) {
            if (habitat.filled(tilesAround[i][0], tilesAround[i][1])) {
                result.push(tilesAround[i]);
            }
        }

        return result;
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Animal} animalToExcept
     * @return {boolean}
     */
    isAnimalsAroundPoint = function(x, y, animalToExcept) {

        let availableTiles = getAroundRadius(x, y, config.WORLD_SIZE, config.WORLD_SIZE, 2);

        for (let j = 0; j < availableTiles.length; j++) {
            for (let i = 0; i < this.animals.length; i++) {
                if (
                    this.animals[i].id !== animalToExcept.id
                    && this.animals[i].x === availableTiles[j][0]
                    && this.animals[i].y === availableTiles[j][1]
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

            if (config.LOGS) {
                console.log('Generator "' + generator.getName() + '" registered');
            }
        }
    }

    maybeCreateAnimals() {

        if (this.animals.length > config.ANIMALS_LIMIT) {
            return;
        }

        for (let i = 0; i < this.animalsGenerators.length; i++) {

            let animals = this.animalsGenerators[i].maybeCreateAnimals();

            for (let j = 0; j < animals.length; j++) {
                this.animals.push(animals[j]);
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
     * @return {boolean}
     */
    canDie() {
        return iAmLucky(1);
    }

    maybeKillAnimals() {
        for (let i = 0; i < this.animals.length; i++) {
            if (this.canDie()) {
                this.animals.splice(i, 1);
            }
        }
    }

    touchAnimals() {
        for (let i = 0; i < this.animals.length; i++) {
            ++this.animals[i].age;
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

        let availableTiles = this.getTilesAvailableToMove(animal),
            nextPoint = false;

        while(!nextPoint && availableTiles.length) {

            nextPoint = availableTiles.randomElement();

            if (this.isAnimalsAroundPoint(nextPoint[0], nextPoint[1], animal)) {
                nextPoint = false;
                availableTiles.splice(availableTiles.indexOf(nextPoint), 1);
            }
        }

        return nextPoint;
    }

    /**
     * @param callback
     */
    moveAnimals(callback) {

        let animal,
            nextPoint;

        for (let i = 0; i < this.animals.length; i++) {

            animal = this.animals[i];

            if (animal.canMove()) {

                nextPoint = this.getNextMove(animal);

                if (nextPoint !== false) {
                    animal.x = nextPoint[0];
                    animal.y = nextPoint[1];
                }
            }

            callback(animal);
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
                createImage(animal.getImage())
            );
        }

        return this.animalImagesCache[animal.getName()];
    }
}