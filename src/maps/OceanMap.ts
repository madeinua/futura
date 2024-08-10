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
        const activeCells = [[startX, startY]];

        while (activeCells.length) {
            const [x, y] = activeCells.pop()!;
            this.altitudeMap.foreachAroundRadius(x, y, 1, (nx: number, ny: number): void => {
                const altitude = this.altitudeMap.getCell(nx, ny);
                if (this.altitudeMap.isWater(altitude) && !this.filled(nx, ny)) {
                    this.fill(nx, ny);
                    activeCells.push([nx, ny]);
                }
            });
        }
    }

    private bigLakesToSeas(): void {
        const tempMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.altitudeMap.foreachValues((altitude: number, x: number, y: number): void => {
            if (this.altitudeMap.isWater(altitude) && !this.filled(x, y)) {
                tempMap.fill(x, y);
            }
        });

        tempMap.foreachFilled((x: number, y: number): void => {
            if (!this.filled(x, y) && tempMap.getSizeFromPoint(x, y) > Config.WORLD_SIZE) {
                this.includeAllWaterCellsAround(x, y);
            }
        });
    }

    generateMap(): OceanMap {
        const startX = 0, startY = 0;

        if (!this.altitudeMap.isWater(this.altitudeMap.getCell(startX, startY))) {
            return this;
        }

        this.includeAllWaterCellsAround(startX, startY);
        this.bigLakesToSeas();

        return this;
    }

    getNotOceanMap(): BinaryMatrix {
        const notOceanMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);

        this.foreachUnfilled((x: number, y: number): void => {
            notOceanMap.fill(x, y);
        });

        return notOceanMap;
    }
}