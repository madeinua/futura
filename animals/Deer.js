class Deer extends Animal {

    static NAME = 'Deer';

    /**
     * @returns {string}
     */
    getImage() {
        return config.DEER_IMAGE;
    }

    /**
     * @returns {number}
     */
    getMoveChance() {
        return config.DEER_MOVE_CHANCE;
    }

    /**
     * @returns {number}
     */
    getMinLifespan() {
        return config.DEER_MIN_LIFESPAN;
    }

    /**
     * @returns {number}
     */
    getMaxLifespan() {
        return config.DEER_MAX_LIFESPAN;
    }
}