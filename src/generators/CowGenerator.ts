import AnimalGenerator from "./AnimalGenerator.js";
import Cow from "../animals/Cow.js";
import Animal from "../animals/Animal.js";
import Biome_Grass from "../biomes/Biome_Grass.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";

export default class CowGenerator extends AnimalGenerator {

    private grassMap: BinaryMatrix | undefined;

    getName(): string {
        return Cow.ANIMAL_NAME;
    }

    getAnimalClass(): typeof Animal {
        return Cow;
    }

    updateHabitat(): this {
        if (!this.grassMap) {
            this.grassMap = this.objects.biomesOperator.getSurfaceByBiomeName(Biome_Grass.name);
        }

        const habitat = this.grassMap.clone();
        habitat.diff(this.objects.forestsOperator.getForestMap());

        this.setHabitat(habitat);

        return this;
    }
}