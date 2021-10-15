class FishGenerator extends AnimalGenerator {

    /**
     * @return {string}
     */
    getName() {
        return Fish.NAME;
    }

    /**
     * @returns {Animal}
     */
    getAnimalClass() {
        return Fish;
    }

    /**
     * @return {BinaryMatrix}
     */
    generateHabitat() {
        return this.freshWaterMap.clone().combineWith(this.coastMap);
    }
}