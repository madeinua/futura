import AnimalGenerator from "./AnimalGenerator";
import Animal from "../animals/Animal";
import Fish from "../animals/Fish";
import BinaryMatrix from "../structures/BinaryMatrix";

export default class FishGenerator extends AnimalGenerator {

    public habitat!: BinaryMatrix;

    getName(): string {
        return Fish.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Fish;
    }

    updateHabitat(): this {
        if (!this.habitat) {
            // Combine fresh water with coastal water to form the fish habitat.
            const combinedHabitat = this.objects.freshWaterMap
                .clone()
                .combineWith(this.objects.coastMap);
            this.setHabitat(combinedHabitat);
        }
        return this;
    }
}