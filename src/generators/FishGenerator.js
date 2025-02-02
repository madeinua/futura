import AnimalGenerator from "./AnimalGenerator.js";
import Fish from "../animals/Fish.js";
export default class FishGenerator extends AnimalGenerator {
    getName() {
        return Fish.ANIMAL_NAME;
    }
    getAnimalClass() {
        return Fish;
    }
    updateHabitat() {
        if (!this.habitat) {
            // Combine fresh water with coastal water to form the fish habitat.
            const combinedHabitat = this.objects.freshWaterMap.clone().combineWith(this.objects.coastMap);
            this.setHabitat(combinedHabitat);
            this.staticHabitat = true;
        }
        return this;
    }
}
