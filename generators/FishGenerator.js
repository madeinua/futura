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
     * @return {number}
     */
    getCreateIntensity() {
        return config.FISH_CREATE_INTENSITY;
    }

    /**
     * @returns {FishGenerator}
     */
    generateHabitat() {

        if (typeof this.habitat === 'undefined') {

            /** @var {BinaryMatrix} freshWaterMap */
            let freshWaterMap = this.objects.freshWaterMap;

            this.habitat = freshWaterMap.clone().combineWith(this.objects.coastMap);
        }

        return this;
    }

    /**
     * @returns {number}
     */
    getRespawnPointsLimit() {
        return config.FISH_RESPAWN_POINTS;
    }
}