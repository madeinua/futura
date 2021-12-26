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
        return 50;
    }
}