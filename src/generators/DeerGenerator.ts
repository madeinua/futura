import AnimalGenerator from "./AnimalGenerator.js";
import Deer from "../animals/Deer.js";
import Animal from "../animals/Animal.js";

export default class DeerGenerator extends AnimalGenerator {

    getName(): string {
        return Deer.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Deer;
    }

    updateHabitat(): any {

        let forestsOperator = this.objects.forestsOperator,
            habitat = forestsOperator.getForestMap().clone();

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