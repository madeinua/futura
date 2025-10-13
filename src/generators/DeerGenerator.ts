import AnimalGenerator from "./AnimalGenerator";
import Deer from "../animals/Deer";
import Animal from "../animals/Animal";

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

        // Remove desert areas (e.g., palm groves) from the habitat.
        habitat.foreachFilled((x: number, y: number): void => {
            if (forestsOperator.isDesertForest(x, y)) {
                habitat.unfill(x, y);
            }
        });

        this.setHabitat(habitat);

        return this;
    }

    needUpdateHabitat(): boolean {
        return true;
    }
}