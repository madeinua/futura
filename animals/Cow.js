class Cow extends Animal {

    static NAME = 'Cow';

    /**
     * @returns {string}
     */
    getImage() {
        return config.COW_IMAGE;
    }

    /**
     * @returns {number}
     */
    getMoveChance() {
        return config.COW_MOVE_CHANCE;
    }

    /**
     * @returns {number}
     */
    getMinLifespan() {
        return config.COW_MIN_LIFESPAN;
    }

    /**
     * @returns {number}
     */
    getMaxLifespan() {
        return config.COW_MAX_LIFESPAN;
    }
}