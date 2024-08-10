import AnimalGenerator from "./AnimalGenerator.js";
import Animal from "../animals/Animal.js";
import Fish from "../animals/Fish.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";

export default class FishGenerator extends AnimalGenerator {

    habitat: BinaryMatrix | undefined;

    getName(): string {
        return Fish.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Fish;
    }

    updateHabitat(): this {
        if (!this.habitat) {
            const combinedHabitat = this.objects.freshWaterMap.clone().combineWith(this.objects.coastMap);
            this.setHabitat(combinedHabitat);
        }

        return this;
    }
}