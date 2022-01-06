class CowGenerator extends AnimalGenerator {

    /** @var {BinaryMatrix} */
    grassMatrix;

    /**
     * @return {string}
     */
    getName() {
        return Cow.NAME;
    }

    /**
     * @returns {Animal}
     */
    getAnimalClass() {
        return Cow;
    }

    /**
     * @return {number}
     */
    getCreateIntensity() {
        return config.COW_CREATE_INTENSITY;
    }

    /**
     * @returns {CowGenerator}
     */
    generateHabitat() {

        if (typeof this.grassMatrix === 'undefined') {
            this.grassMatrix = this.objects.biomesOperator.getSurfaceByBiomeName(Biome_Grass.NAME);
        }

        this.habitat = this.grassMatrix.clone();

        this.habitat.diff(
            this.objects.forestOperator.getForestMap()
        );

        return this;
    }

    /**
     * @returns {number}
     */
    getRespawnPointsLimit() {
        return config.COW_RESPAWN_POINTS;
    }
}