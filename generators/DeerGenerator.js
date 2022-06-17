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
    updateHabitat() {

        let _this = this;

        /** @var {ForestsOperator} */
        let forestsOperator = _this.objects.forestsOperator;

        _this.habitat = forestsOperator.getForestMap().clone();

        // Remove palms
        _this.habitat.foreachFilled(function(x, y) {
            if (forestsOperator.isPalm(x, y)) {
                _this.habitat.unfill(x, y);
            }
        });

        return _this;
    }
}