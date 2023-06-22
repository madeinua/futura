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
        if (typeof this.grassMap === 'undefined') {
            this.grassMap = this.objects.biomesOperator.getSurfaceByBiomeName(Biome_Grass.BIOME_NAME);
        }
        const habitat = this.grassMap.clone();
        habitat.diff(this.objects.forestsOperator.getForestMap());
        this.setHabitat(habitat);
        return this;
    }
}
