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

    updateHabitat(): this {
        const forestsOperator = this.objects.forestsOperator;
        const habitat = forestsOperator.getForestMap().clone();

        // Remove palms from the habitat
        habitat.foreachFilled((x: number, y: number): void => {
            if (forestsOperator.isDesertForest(x, y)) {
                habitat.unfill(x, y);
            }
        });

        this.setHabitat(habitat);

        return this;
    }
}