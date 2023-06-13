import AnimalGenerator from "./AnimalGenerator.js";
import Fish from "../animals/Fish.js";

export default class FishGenerator extends AnimalGenerator {

    /**
     * @return {string}
     */
    getName() {
        return Fish.NAME;
    }

    /**
     * @returns {Animal}
     */
    getAnimalClass() {
        return Fish;
    }

    /**
     * @returns {FishGenerator}
     */
    updateHabitat() {

        if (typeof this.habitat === 'undefined') {

            /** @var {BinaryMatrix} freshWaterMap */
            let freshWaterMap = this.objects.freshWaterMap;

            this.setHabitat(
                freshWaterMap.clone().combineWith(this.objects.coastMap)
            );
        }

        return this;
    }
}