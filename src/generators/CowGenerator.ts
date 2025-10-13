import AnimalGenerator from "./AnimalGenerator";
import Cow from "../animals/Cow";
import Animal from "../animals/Animal";
import Biome_Grass from "../biomes/Biome_Grass";
import BinaryMatrix from "../structures/BinaryMatrix";

export default class CowGenerator extends AnimalGenerator {
    private suitableLandMap?: BinaryMatrix;

    getName(): string {
        return Cow.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Cow;
    }

    updateHabitat(): this {

        if (!this.suitableLandMap) {
            const grassMap = this.objects.biomesOperator.getSurfaceByBiomeName(Biome_Grass.prototype.getName());
            const lowlandsMap = this.objects.altitudeMap.getLowland();
            this.suitableLandMap = grassMap.intersect(lowlandsMap);
        }

        const habitat = this.suitableLandMap.clone();
        habitat.diff(this.objects.forestsOperator.getForestMap());
        this.setHabitat(habitat);

        return this;
    }
}