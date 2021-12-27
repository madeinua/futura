class Fish extends Animal {

    static NAME = 'Fish';

    /**
     * @returns {string}
     */
    getImage() {
        return config.FISH_IMAGE;
    }

    /**
     * @returns {number}
     */
    getMoveChance() {
        return config.FISH_MOVE_CHANCE;
    }

    /**
     * @returns {number}
     */
    getMinLifespan() {
        return config.FISH_MIN_LIFESPAN;
    }

    /**
     * @returns {number}
     */
    getMaxLifespan() {
        return config.FISH_MAX_LIFESPAN;
    }
}