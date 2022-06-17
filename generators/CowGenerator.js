class CowGenerator extends AnimalGenerator {

    /** @var {BinaryMatrix} */
    grassMap;

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
    updateHabitat() {

        if (typeof this.grassMap === 'undefined') {
            this.grassMap = this.objects.biomesOperator.getSurfaceByBiomeName(Biome_Grass.NAME);
        }

        this.habitat = this.grassMap.clone();

        this.habitat.diff(
            this.objects.forestsOperator.getForestMap()
        );

        return this;
    }
}