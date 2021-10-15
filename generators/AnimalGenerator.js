class AnimalGenerator {

    /** @var {OceanMap} */
    oceanMap;

    /** @var {BinaryMatrix} */
    freshWaterMap;

    /** @var {CoastMap} */
    coastMap;

    /** @var {BinaryMatrix} */
    habitat;

    /**
     * @param {OceanMap} oceanMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {CoastMap} coastMap
     */
    constructor(oceanMap, freshWaterMap, coastMap) {
        this.oceanMap = oceanMap;
        this.freshWaterMap = freshWaterMap;
        this.coastMap = coastMap;
    }

    /**
     * @return {string}
     */
    getName() {
        return Animal.NAME;
    }

    /**
     * @returns {Animal}
     */
    getAnimalClass() {
        return Animal;
    }

    /**
     * @return {number} [0 - 100]
     */
    getCreateChance() {
        return 50;
    }

    /**
     * @return {number}
     */
    getCreateIntensity() {
        return 1;
    }

    /**
     * @return {BinaryMatrix}
     */
    generateHabitat() {
        return new BinaryMatrix(config.WORLD_SIZE, config.WORLD_SIZE, 1);
    }

    /**
     * @return {BinaryMatrix}
     */
    getHabitat() {

        if (typeof this.habitat === 'undefined') {
            this.habitat = this.generateHabitat();
        }

        return this.habitat;
    }

    /**
     * @return {boolean|Animal}
     */
    maybeCreateAnimal() {

        if (!iAmLucky(this.getCreateChance())) {
            return false;
        }

        let tile = this.getHabitat().getRandomFilledTile();

        if (!tile) {
            throwError('Can not create animal', 1, true);
            return false;
        }

        return new (this.getAnimalClass())(tile[0], tile[1]);
    }

    /**
     * @return {Animal[]}
     */
    maybeCreateAnimals() {

        let animals = [],
            animal;

        for (let i = 0; i < this.getCreateIntensity(); i++) {

            animal = this.maybeCreateAnimal();

            if (animal) {
                animals.push(animal);
            }
        }

        return animals;
    }
}