class DeerGenerator extends AnimalGenerator {

    /**
     * @return {string}
     */
    getName() {
        return Deer.NAME;
    }

    /**
     * @returns {Animal}
     */
    getAnimalClass() {
        return Deer;
    }

    /**
     * @return {number}
     */
    getCreateIntensity() {
        return config.DEER_CREATE_INTENSITY;
    }

    /**
     * @returns {DeerGenerator}
     */
    generateHabitat() {

        this.habitat = this.maps.forestMap;

        return this;
    }

    /**
     * @returns {number}
     */
    getRespawnPointsLimit() {
        return config.DEER_RESPAWN_POINTS;
    }
}