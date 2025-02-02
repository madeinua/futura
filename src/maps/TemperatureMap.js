import PointMatrix from "../structures/PointMatrix.js";
import Config from "../../config.js";
export default class TemperatureMap extends PointMatrix {
    constructor(altitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.altitudeMap = altitudeMap;
    }
    generateMap() {
        this.addGradient();
        this.considerAltitude();
        this.normalize();
        return this;
    }
    addGradient() {
        const gradient = [];
        const worldSize = Config.WORLD_SIZE;
        for (let i = 0; i < worldSize; i++) {
            // Compute a linear value for the central area.
            const linearValue = i / worldSize;
            // Clamp the value to [0, 1]
            const clamped = Math.min(1, Math.max(0, linearValue));
            // Apply an ease-in-out sine curve.
            // This creates a curved gradient rather than a linear one.
            gradient[i] = 0.5 - 0.5 * Math.cos(clamped * Math.PI);
        }
        // Apply the gradient value (which now uses our curved mapping)
        // based on the y coordinate for every cell.
        this.foreach((x, y) => {
            this.addToCell(x, y, gradient[y]);
        });
    }
    considerAltitude() {
        const minLevel = Config.MIN_GROUND_LEVEL;
        this.foreach((x, y) => {
            let altitude = this.altitudeMap.getCell(x, y);
            altitude = altitude >= minLevel ? (altitude - minLevel) * (altitude - minLevel) : 0;
            this.subtractFromCell(x, y, altitude);
        });
    }
}
