import BinaryMatrix from "../structures/BinaryMatrix.js";
import Config from "../../config.js";
export default class OceanMap extends BinaryMatrix {
    constructor(altitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap = altitudeMap;
    }
    includeAllWaterCellsAround(startX, startY) {
        this.fill(startX, startY);
        const activeCells = [[startX, startY]];
        while (activeCells.length) {
            const [x, y] = activeCells.pop();
            this.altitudeMap.foreachAroundRadius(x, y, 1, (nx, ny) => {
                const altitude = this.altitudeMap.getCell(nx, ny);
                if (this.altitudeMap.isWater(altitude) && !this.filled(nx, ny)) {
                    this.fill(nx, ny);
                    activeCells.push([nx, ny]);
                }
            });
        }
    }
    bigLakesToSeas() {
        const tempMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.altitudeMap.foreachValues((altitude, x, y) => {
            if (this.altitudeMap.isWater(altitude) && !this.filled(x, y)) {
                tempMap.fill(x, y);
            }
        });
        tempMap.foreachFilled((x, y) => {
            if (!this.filled(x, y) && tempMap.getSizeFromPoint(x, y) > Config.WORLD_SIZE) {
                this.includeAllWaterCellsAround(x, y);
            }
        });
    }
    generateMap() {
        const startX = 0, startY = 0;
        if (!this.altitudeMap.isWater(this.altitudeMap.getCell(startX, startY))) {
            return this;
        }
        this.includeAllWaterCellsAround(startX, startY);
        this.bigLakesToSeas();
        return this;
    }
    getNotOceanMap() {
        const notOceanMap = new BinaryMatrix(Config.WORLD_SIZE, Config.WORLD_SIZE, 0);
        this.foreachUnfilled((x, y) => {
            notOceanMap.fill(x, y);
        });
        return notOceanMap;
    }
}
