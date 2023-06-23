import AnimalGenerator from "./AnimalGenerator.js";
import Animal from "../animals/Animal.js";
import Fish from "../animals/Fish.js";

export default class FishGenerator extends AnimalGenerator {

    getName(): string {
        return Fish.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Fish;
    }

    updateHabitat(): this {

        if (typeof this.habitat === 'undefined') {
            this.setHabitat(
                this.objects.freshWaterMap.clone().combineWith(this.objects.coastMap)
            );
        }

        return this;
    }
}