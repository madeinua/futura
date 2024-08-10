import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";

export default class AltitudeMap extends PointMatrix {

    waterSize: number = 0;
    landSize: number = 0;

    generateMap(): void {
        const octaves = [3, 5, 20]; // [12, 20, 80]
        const maps = octaves.map(octave =>
            new NoiseMapGenerator(
                Config.WORLD_SIZE,
                octave * (Config.WORLD_SIZE / 75)
            ).generate()
        );

        this.map((x: number, y: number): number => {
            let val = 0;
            let size = 0;

            // Blend maps
            maps.forEach((map, i) => {
                const s = Math.pow(2, i);
                size += s;
                val += map.getCell(x, y) * s;
            });

            val /= size;

            // Stretch map
            val = Math.min(1, Math.pow(val, Config.WORLD_MAP_OCEAN_INTENSITY + 1));

            // Make island
            val = this.makeIsland(x, y, Config.WORLD_SIZE, val);

            // Round to 2 decimals
            return Math.round(val * 100) / 100;
        });

        this.initVariables();
    }

    loadMap(str: string): void {
        this.fromString(str);
        this.initVariables();
    }

    protected initVariables(): void {
        this.waterSize = 0;
        this.landSize = 0;

        this.foreachValues((altitude: number): void => {
            this.isWater(altitude) ? this.waterSize++ : this.landSize++;
        });
    }

    private makeIsland(x: number, y: number, islandSize: number, altitude: number): number {
        const dx = Math.abs(x - islandSize * 0.5);
        const dy = Math.abs(y - islandSize * 0.5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delta = distance / (islandSize * 0.42);
        const gradient = delta * delta - 0.2;

        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    }

    isWater(level: number): boolean {
        return Config.MIN_GROUND_LEVEL >= level;
    }

    isGround(level: number): boolean {
        return level > Config.MIN_GROUND_LEVEL;
    }

    isLowLand(level: number): boolean {
        return level > Config.MIN_GROUND_LEVEL && level <= Config.MAX_LOWLAND_LEVEL;
    }

    isHills(level: number): boolean {
        return level > Config.MAX_LOWLAND_LEVEL && level <= Config.MAX_HILLS_LEVEL;
    }

    isMountains(level: number): boolean {
        return level > Config.MAX_HILLS_LEVEL;
    }

    getLandCellsCount(): number {
        return this.landSize;
    }

    getWaterCellsCount(): number {
        return this.waterSize;
    }
}