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
            const combinedHabitat = this.objects.freshWaterMap.clone().combineWith(this.objects.coastMap);
            this.setHabitat(combinedHabitat);
        }
        return this;
    }
}
