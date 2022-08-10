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
     * @returns {DeerGenerator}
     */
    updateHabitat() {

        /** @var {ForestsOperator} */
        let forestsOperator = this.objects.forestsOperator;
        let habitat = forestsOperator.getForestMap().clone();

        // Remove palms
        habitat.foreachFilled(function(x, y) {
            if (forestsOperator.isPalm(x, y)) {
                habitat.unfill(x, y);
            }
        });

        this.setHabitat(habitat);

        return this;
    }
}