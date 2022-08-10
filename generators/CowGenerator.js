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
     * @returns {CowGenerator}
     */
    updateHabitat() {

        if (typeof this.grassMap === 'undefined') {
            this.grassMap = this.objects.biomesOperator.getSurfaceByBiomeName(Biome_Grass.NAME);
        }

        let habitat = this.grassMap.clone();

        habitat.diff(
            this.objects.forestsOperator.getForestMap()
        );

        this.setHabitat(habitat);

        return this;
    }
}