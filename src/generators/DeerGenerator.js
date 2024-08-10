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
        const forestsOperator = this.objects.forestsOperator;
        const habitat = forestsOperator.getForestMap().clone();
        // Remove palms from the habitat
        habitat.foreachFilled((x, y) => {
            if (forestsOperator.isDesertForest(x, y)) {
                habitat.unfill(x, y);
            }
        });
        this.setHabitat(habitat);
        return this;
    }
}
