import Config from "../../config.js";
import NumericMatrix from "../structures/NumericMatrix.js";
export default class IslandsMap extends NumericMatrix {
    constructor(oceanMap) {
        // Initialize all cells to -1 to mark them as not processed.
        super(Config.WORLD_SIZE, Config.WORLD_SIZE, -1);
        this.oceanMap = oceanMap;
    }
    /**
     * Returns all the connected non‑ocean cells (an island) starting from (startX, startY)
     * using a flood‑fill that tracks visited cells in a Set for fast lookup.
     *
     * @param startX - The starting x coordinate.
     * @param startY - The starting y coordinate.
     * @returns An array of [x, y] coordinates belonging to the same island.
     */
    getIsland(startX, startY) {
        const islandCells = [];
        const stack = [[startX, startY]];
        const visited = new Set();
        visited.add(`${startX},${startY}`); // Store all processed cells in a Set for fast lookup.
        const notOceanMap = this.oceanMap.getNotOceanMap();
        while (stack.length > 0) {
            const [x, y] = stack.pop();
            islandCells.push([x, y]);
            // For each filled (i.e. non‑ocean) neighbor of (x, y), add it to the stack if not visited.
            notOceanMap.foreachFilledAround(x, y, (nx, ny) => {
                const key = `${nx},${ny}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    stack.push([nx, ny]);
                }
            });
        }
        return islandCells;
    }
    /**
     * Loops over all cells and for each unprocessed non‑ocean cell,
     * flood‑fills the connected region (island) and sets its value to the island size.
     */
    generateMap() {
        for (let x = 0; x < Config.WORLD_SIZE; x++) {
            for (let y = 0; y < Config.WORLD_SIZE; y++) {
                // If the cell already has been assigned a value (>= 0), skip it.
                if (this.getCell(x, y) >= 0) {
                    continue;
                }
                // If the cell is ocean, mark it as 0 and skip.
                if (this.oceanMap.filled(x, y)) {
                    this.setCell(x, y, 0);
                    continue;
                }
                // Flood-fill from this cell to get all connected non‑ocean cells.
                const island = this.getIsland(x, y);
                const islandSize = island.length;
                // Set every cell in the island to the island's size.
                island.forEach(([cellX, cellY]) => {
                    this.setCell(cellX, cellY, islandSize);
                });
            }
        }
        return this;
    }
}
