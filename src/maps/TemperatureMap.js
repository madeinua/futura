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
        for (let i = 0; i < Config.WORLD_SIZE; i++) {
            gradient[i] = i / Config.WORLD_SIZE;
        }
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
