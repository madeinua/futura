class AnimalGenerator {

    /** @var {Object} */
    config;

    /** @var {OceanMap} */
    oceanMap;

    /** @var {BinaryMatrix} */
    freshWaterMap;

    /** @var {CoastMap} */
    coastMap;

    /** @var {BinaryMatrix} */
    movementsArea;

    /**
     * @param {OceanMap} oceanMap
     * @param {BinaryMatrix} freshWaterMap
     * @param {CoastMap} coastMap
     * @param {Object} config
     */
    constructor(oceanMap, freshWaterMap, coastMap, config) {

        this.oceanMap = oceanMap;
        this.freshWaterMap = freshWaterMap;
        this.coastMap = coastMap;
        this.config = config;
    }

    /**
     * @param {Array} collisions
     * @return {boolean|Animal}
     */
    create(collisions) {

        let ma = this.getMovementsArea(collisions);

        let tile = ma.getRandomFilledTile();

        if (!tile) {
            throwError('Can not create animal', 1, true);
            return false;
        }

        return new Animal(tile[0], tile[1]);
    }

    /**
     * @return {BinaryMatrix}
     */
    createMovementsArea() {
        return new BinaryMatrix(this.config.worldSize, this.config.worldSize, 1);
    }

    /**
     * @return {BinaryMatrix}
     */
    getMovementsArea(collisions) {

        if (typeof this.movementsArea === 'undefined') {
            this.movementsArea = this.createMovementsArea();
        }

        let result = this.movementsArea;

        for (let i = 0; i < collisions.length; i++) {
            result.unfill(collisions[i][0], collisions[i][1]);
        }

        return result;
    }
}