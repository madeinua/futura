import AnimalGenerator from "./AnimalGenerator.js";
import Deer from "../animals/Deer.js";
export default class DeerGenerator extends AnimalGenerator {
    getName() {
        return Deer.ANIMAL_NAME;
    }
    getAnimalClass() {
        return Deer;
    }
    updateHabitat() {
        let forestsOperator = this.objects.forestsOperator, habitat = forestsOperator.getForestMap().clone();
        // Remove palms
        habitat.foreachFilled(function (x, y) {
            if (forestsOperator.isDesertForest(x, y)) {
                habitat.unfill(x, y);
            }
        });
        this.setHabitat(habitat);
        return this;
    }
}
