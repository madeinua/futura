import Biome_Ocean from "./Biome_Ocean";
import Biome_Coast from "./Biome_Coast";
import Biome_Water from "./Biome_Water";
import Biome_Beach from "./Biome_Beach";
import Biome_Desert from "./Biome_Desert";
import Biome_Grass from "./Biome_Grass";
import Biome_Tropic from "./Biome_Tropic";
import Biome_Tundra from "./Biome_Tundra";

import type Biome from "./Biome";
import type { BiomeArgs } from "./Biome";

export type BiomeCtor = new (x: number, y: number, args: BiomeArgs) => Biome;

const biomes: Record<string, BiomeCtor> = {
  Biome_Ocean,
  Biome_Coast,
  Biome_Water,
  Biome_Beach,
  Biome_Desert,
  Biome_Grass,
  Biome_Tropic,
  Biome_Tundra,
};

export default biomes;