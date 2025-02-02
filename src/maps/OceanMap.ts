import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";

export default class OceanMap extends BinaryMatrix {

    readonly altitudeMap: AltitudeMap;

    constructor(altitudeMap: AltitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
    }

    private includeAllWaterCellsAround(startX: number, startY: number): void {
        this.fill(startX, startY);
        const activeCells: [number, number][] = [[startX, startY]];
        // Cache altitudeMap locally for faster access.
        const altMap = this.altitudeMap;

        while (activeCells.length) {
            const [x, y] = activeCells.pop()!;
            altMap.foreachAroundRadius(x, y, 1, (nx, ny) => {
                const altitude = altMap.getCell(nx, ny);
                if (altMap.isWater(altitude) && !this.filled(nx, ny)) {
                    this.fill(nx, ny);
                    activeCells.push([nx, ny]);
                }
            });
        }
    }

    private bigLakesToSeas(): void {
        const worldSize = Config.WORLD_SIZE;
        const altMap = this.altitudeMap;
        // Create a temporary BinaryMatrix to mark water that is not yet ocean.
        const tempMap = new BinaryMatrix(worldSize, worldSize, 0);

        altMap.foreachValues((altitude, x, y) => {
            if (altMap.isWater(altitude) && !this.filled(x, y)) {
                tempMap.fill(x, y);
            }
        });

        tempMap.foreachFilled((x, y) => {
            // If this water body in tempMap is large enough (exceeds worldSize), include it.
            if (!this.filled(x, y) && tempMap.getSizeFromPoint(x, y) > worldSize) {
                this.includeAllWaterCellsAround(x, y);
            }
        });
    }

    generateMap(): OceanMap {
        const startX = 0,
            startY = 0;
        const altMap = this.altitudeMap;

        // If the top-left cell is not water, return immediately.
        if (!altMap.isWater(altMap.getCell(startX, startY))) {
            return this;
        }

        this.includeAllWaterCellsAround(startX, startY);
        this.bigLakesToSeas();
        return this;
    }

    getNotOceanMap(): BinaryMatrix {
        const notOceanMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.foreachUnfilled((x, y) => {
            notOceanMap.fill(x, y);
        });

        return notOceanMap;
    }
}