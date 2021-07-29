class AnimalsOperator {

    /** @var {Object} */
    config;

    /** @var {Array} */
    animals = [];

    /** @var {Array} */
    animalsGenerators = [];

    /**
     * @param {Object} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @param {Animal} animal
     * @return {Array}
     */
    getTilesAvailableToMove(animal) {
        return getTilesAround(
            animal.x,
            animal.y,
            this.config.worldSize,
            this.config.worldSize,
            2
        );
    }

    /**
     * @param {number} x
     * @param {number} y
     * @param {Animal} animalToExcept
     * @return {boolean}
     */
    isAnimalsAroundPoint = function(x, y, animalToExcept) {

        let availableTiles = getTilesAround(x, y, this.config.worldSize, this.config.worldSize, 3);

        for (let j = 0; j < availableTiles.length; j++) {
            for (let i = 0; i < this.animals.length; i++) {
                if (
                    this.animals[i].id !== animalToExcept.id
                    && this.animals[i].atPos(availableTiles[j])
                ) {
                    return true;
                }
            }
        }

        return false;
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
                    animal.moveToTile(nextPoint);
                }
            }

            callback(animal);
        }
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
            console.log('Generator ' + generator.getName() + ' registered'); // @TODO: remove this
        }
    }

    maybeCreateAnimals() {

        if (this.animals.length > this.config.ANIMALS_LIMIT) {
            return;
        }

        for (let i = 0; i < this.animalsGenerators.length; i++) {

            let animals = this.animalsGenerators[i].maybeCreateAnimals();

            for (let j = 0; j < animals.length; j++) {
                this.animals.push(animals[j]);
            }
        }
        
        console.log(this.animals); // @TODO: remove this
    }
}