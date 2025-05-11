import AnimalGenerator from "./AnimalGenerator.js";
import Cow from "../animals/Cow.js";
import Biome_Grass from "../biomes/Biome_Grass.js";
export default class CowGenerator extends AnimalGenerator {
    getName() {
        return Cow.ANIMAL_NAME;
    }
    getAnimalClass() {
        return Cow;
    }
    updateHabitat() {
        if (!this.suitableLandMap) {
            const grassMap = this.objects.biomesOperator.getSurfaceByBiomeName(Biome_Grass.name);
            const lowlandsMap = this.objects.altitudeMap.getLowland();
            this.suitableLandMap = grassMap.intersect(lowlandsMap);
        }
        const habitat = this.suitableLandMap.clone();
        habitat.diff(this.objects.forestsOperator.getForestMap());
        this.setHabitat(habitat);
        return this;
    }
}
