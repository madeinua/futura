class AnimalsOperator {

    /** @var {Array} */
    animals = [];

    /** @var {Array} */
    animalsGenerators = [];

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
        animalsLayer.setTile(animal.x, animal.y, hexToRgb(config.ANIMAL_COLOR));
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
     * @param {OceanMap} oceanMap
     * @param {CoastMap} coastMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {Array} tickHandlers
     * @param {Layer} animalsLayer
     */
    initAnimalsGeneration = function(oceanMap, freshWaterMap, coastMap, tickHandlers, animalsLayer) {

        let _this = this,
            animalsOperator = new AnimalsOperator(),
            animalsMap = new BinaryMatrix(config.WORLD_SIZE, config.WORLD_SIZE),
            animalGenerators = this.getAvailableGenerators();

        for (let i = 0; i < animalGenerators.length; i++) {
            animalsOperator.registerAnimalsGenerator(
                new animalGenerators[i](oceanMap, freshWaterMap, coastMap)
            );
        }

        if (config.LOGS) {
            logTimeEvent('Animals initialized.');
        }

        tickHandlers.push(function() {

            animalsMap.map(false);
            _this.cleanAnimalsLayer(animalsLayer);

            animalsOperator.touchAnimals();
            animalsOperator.maybeKillAnimals();
            animalsOperator.maybeCreateAnimals();

            animalsOperator.moveAnimals(function(animal) {
                _this.addAnimalToLayer(animalsLayer, animal);
                animalsMap.setTile(animal.x, animal.y, 1);
            });

            Filters.apply('animalsMap', animalsMap);
        });
    }

    /**
     * @param {Animal} animal
     * @return {Array}
     */
    getTilesAvailableToMove(animal) {

        let g = this.getAnimalGeneratorByAnimal(animal);

        if (g === null) {
            return [];
        }

        let creationArea = this.getAnimalGeneratorByAnimal(animal).getCreationArea(),
            tilesAround = getRectangleAround(
                animal.x,
                animal.y,
                config.WORLD_SIZE,
                config.WORLD_SIZE
            );

        for (let i = 0; i < tilesAround.length; i++) {
            if (!creationArea.filled(tilesAround[i][0], tilesAround[i][1])) {
                tilesAround.splice(i, 1);
            }
        }

        return tilesAround;
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
     * @param {number} age
     * @param {number} lifespan
     * @return {boolean}
     */
    canDie(age, lifespan) {
        return age > (lifespan + 10) || (age > (lifespan - 10) && iAmLucky(5));
    }

    maybeKillAnimals() {
        for (let i = 0; i < this.animals.length; i++) {
            if (this.canDie(this.animals[i].age, this.animals[i].getLifespan())) {
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
}