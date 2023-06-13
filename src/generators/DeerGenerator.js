import AnimalGenerator from "./AnimalGenerator.js";
import Deer from "../animals/Deer.js";

export default class DeerGenerator extends AnimalGenerator {

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
            if (forestsOperator.isDesertForest(x, y)) {
                habitat.unfill(x, y);
            }
        });

        this.setHabitat(habitat);

        return this;
    }
}