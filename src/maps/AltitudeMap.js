import PointMatrix from "../structures/PointMatrix.js";
import BinaryMatrix from "../structures/BinaryMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";
export default class AltitudeMap extends PointMatrix {
    constructor() {
        super(...arguments);
        this.waterSize = 0;
        this.landSize = 0;
    }
    generateMap() {
        // Generate several noise maps and blend them.
        const octaves = [3, 5, 20];
        const maps = octaves.map(octave => new NoiseMapGenerator(Config.WORLD_SIZE, octave * (Config.WORLD_SIZE / 75)).generate());
        this.map((x, y) => {
            let val = 0;
            let size = 0;
            // Blend maps using a weighted sum.
            maps.forEach((map, i) => {
                const s = Math.pow(2, i);
                size += s;
                val += map.getCell(x, y) * s;
            });
            val /= size;
            // Stretch the noise to adjust ocean vs. land ratio.
            val = Math.min(1, Math.pow(val, Config.WORLD_MAP_OCEAN_INTENSITY + 0.95)); // Note 1.0 adds too much ocean, so I reduced it
            // Apply island shaping with a non‑symmetric mask.
            val = this.makeIsland(x, y, Config.WORLD_SIZE, val);
            val = Math.min(1, val);
            // Return the value rounded to 2 decimals.
            return Math.round(val * 100) / 100;
        });
        // Optionally, apply erosion to simulate thermal erosion.
        this.applyErosion(Config.EROSION_ITERATIONS || 3);
        this.initVariables();
    }
    loadMap(str) {
        this.fromString(str);
        this.initVariables();
    }
    initVariables() {
        this.waterSize = 0;
        this.landSize = 0;
        this.foreachValues((altitude) => {
            if (this.isWater(altitude)) {
                this.waterSize++;
            }
            else {
                this.landSize++;
            }
        });
    }
    /**
     * Applies a non-symmetric island mask.
     * Instead of a simple radial falloff, we add a noise offset to vary the edge.
     *
     * @param x - the x coordinate.
     * @param y - the y coordinate.
     * @param islandSize - the overall size of the island (assumed square).
     * @param altitude - the computed altitude from noise.
     * @returns The modified altitude after applying the island mask.
     */
    makeIsland(x, y, islandSize, altitude) {
        const cx = islandSize * 0.5;
        const cy = islandSize * 0.5;
        // Compute normalized distances from center.
        const dx = (x - cx) / cx;
        const dy = (y - cy) / cy;
        const baseDistance = Math.sqrt(dx * dx + dy * dy);
        // Introduce non-symmetric variation with additional noise.
        const noiseScale = islandSize * 0.1;
        const noiseVal = (noise.simplex2(x / noiseScale, y / noiseScale) + 1) / 2; // in [0,1]
        // Increase the threshold to enlarge the island.
        // For instance, changing the base from 0.42 to 0.7.
        const threshold = 0.7 + (noiseVal - 0.5) * 0.1;
        // Compute a modified distance factor.
        const delta = baseDistance / threshold;
        const gradient = delta * delta - 0.2;
        // Reduce altitude near edges. (Clamp to [0, altitude])
        return Math.min(altitude, altitude * Math.max(0, 1 - gradient));
    }
    /**
     * Applies a simple thermal erosion simulation.
     * For each cell, if its altitude is significantly higher than its neighbors,
     * a fraction of the difference is transferred, smoothing out sharp features.
     *
     * @param iterations - number of erosion passes.
     */
    applyErosion(iterations) {
        for (let iter = 0; iter < iterations; iter++) {
            // Create a deep copy of the current map data.
            const newMap = this.toArray().map(row => [...row]);
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    const currentAltitude = this.getCell(x, y);
                    const neighbors = this.getNeighbors(x, y);
                    // Transfer a fraction of the altitude difference to each lower neighbor.
                    neighbors.forEach(([nx, ny]) => {
                        const neighborAltitude = this.getCell(nx, ny);
                        const diff = currentAltitude - neighborAltitude;
                        if (diff > 0.01) { // Only transfer if the difference is significant.
                            const transfer = 0.05 * diff;
                            newMap[x][y] -= transfer;
                            newMap[nx][ny] += transfer;
                        }
                    });
                }
            }
            this.setAll(newMap);
        }
    }
    isWater(level) {
        return Config.MIN_GROUND_LEVEL >= level;
    }
    isGround(level) {
        return level > Config.MIN_GROUND_LEVEL;
    }
    isLowLand(level) {
        return level > Config.MIN_GROUND_LEVEL && level <= Config.MAX_LOWLAND_LEVEL;
    }
    isHills(level) {
        return level > Config.MAX_LOWLAND_LEVEL && level <= Config.MAX_HILLS_LEVEL;
    }
    isMountains(level) {
        return level > Config.MAX_HILLS_LEVEL;
    }
    getLandCellsCount() {
        return this.landSize;
    }
    getWaterCellsCount() {
        return this.waterSize;
    }
    getLowland() {
        const lowland = new BinaryMatrix(this.width, this.height);
        this.foreachValues((altitude, x, y) => {
            if (this.isLowLand(altitude)) {
                lowland.setCell(x, y, 1);
            }
        });
        return lowland;
    }
}
