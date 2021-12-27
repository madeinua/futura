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
    getAverageLifespan() {
        return config.FISH_LIFESPAN;
    }
}