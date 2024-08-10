import Config from "../../config.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import OceanMap from "./OceanMap.js";
import {arrayHasPoint} from "../helpers.js";

export default class IslandsMap extends NumericMatrix {

    readonly oceanMap: OceanMap;

    constructor(oceanMap: OceanMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, -1);
        this.oceanMap = oceanMap;
    }

    private getIsland(startX: number, startY: number): Array<Array<number>> {
        const activeCells: Array<Array<number>> = [];
        const islandCells: Array<Array<number>> = [];
        const notOceanMap = this.oceanMap.getNotOceanMap();

        activeCells.push([startX, startY]);
        islandCells.push([startX, startY]);

        while (activeCells.length) {
            const cell = activeCells.pop();
            notOceanMap.foreachFilledAround(cell[0], cell[1], (x: number, y: number): void => {
                if (!arrayHasPoint(activeCells, x, y) && !arrayHasPoint(islandCells, x, y)) {
                    islandCells.push([x, y]);
                    activeCells.push([x, y]);
                }
            });
        }

        return islandCells;
    }

    generateMap(): IslandsMap {
        for (let x = 0; x < Config.WORLD_SIZE; x++) {
            for (let y = 0; y < Config.WORLD_SIZE; y++) {

                if (this.getCell(x, y) >= 0) {
                    continue;
                }

                if (this.oceanMap.filled(x, y)) {
                    this.setCell(x, y, 0);
                    continue;
                }

                const island = this.getIsland(x, y);
                const islandSize = island.length;

                island.forEach((cell: Array<number>): void => {
                    this.setCell(cell[0], cell[1], islandSize);
                });
            }
        }

        return this;
    }
}