import Config from "../../config.js";
import NumericMatrix from "../structures/NumericMatrix.js";
import { arrayHasPoint } from "../helpers.js";
export default class IslandsMap extends NumericMatrix {
    constructor(oceanMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, -1);
        this.getIsland = function (startX, startY) {
            const _this = this, activeCells = [], islandCells = [], notOceanMap = _this.oceanMap.getNotOceanMap();
            activeCells.push([startX, startY]);
            islandCells.push([startX, startY]);
            while (activeCells.length) {
                const cell = activeCells.pop();
                notOceanMap.foreachFilledAround(cell[0], cell[1], function (x, y) {
                    if (!arrayHasPoint(activeCells, x, y) && !arrayHasPoint(islandCells, x, y)) {
                        islandCells.push([x, y]);
                        activeCells.push([x, y]);
                    }
                });
            }
            return islandCells;
        };
        this.generateMap = function () {
            const _this = this;
            for (let x = 0; x < Config.WORLD_SIZE; x++) {
                for (let y = 0; y < Config.WORLD_SIZE; y++) {
                    if (_this.getCell(x, y) >= 0) {
                        continue;
                    }
                    if (_this.oceanMap.filled(x, y)) {
                        _this.setCell(x, y, 0);
                        continue;
                    }
                    const island = _this.getIsland(x, y), islandSize = island.length;
                    island.forEach(function (cell) {
                        _this.setCell(cell[0], cell[1], islandSize);
                    });
                }
            }
            return _this;
        };
        this.oceanMap = oceanMap;
    }
}
