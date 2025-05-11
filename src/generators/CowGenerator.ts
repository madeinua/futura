import AnimalGenerator from "./AnimalGenerator.js";
import Cow from "../animals/Cow.js";
import Animal from "../animals/Animal.js";
import Biome_Grass from "../biomes/Biome_Grass.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";

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