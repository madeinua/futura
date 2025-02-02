import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";
export default class HumidityMap extends PointMatrix {
    constructor(altitudeMap, riversMap, lakesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
        /**
         * 0 = wet
         * 1 = dry
         */
        this.generateMap = () => {
            this.generateNoiseMap();
            this.considerAltitude();
            this.considerRivers();
            this.considerLakes();
            this.normalize();
            return this;
        };
        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
    }
    generateNoiseMap() {
        this.setAll(new NoiseMapGenerator(Config.WORLD_SIZE, 150)
            .generate()
            .getValues());
    }
    considerAltitude() {
        // Higher altitude = lower humidity
        this.foreachValues((altitude, x, y) => {
            this.addToCell(x, y, -altitude * 0.5);
        });
    }
    considerRivers() {
        // Rivers increase humidity.
        // Instead of calling a separate "distance" function, we inline the calculation.
        this.riversMap.foreachFilled((x, y) => {
            this.foreachAroundRadius(x, y, 4, (nx, ny) => {
                const dx = nx - x;
                const dy = ny - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist !== 0) {
                    this.addToCell(nx, ny, 0.015 / dist);
                }
            });
        });
    }
    considerLakes() {
        // Lakes increase humidity.
        this.lakesMap.foreachFilled((x, y) => {
            this.foreachAroundRadius(x, y, 5, (nx, ny) => {
                const dx = nx - x;
                const dy = ny - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist !== 0) {
                    this.addToCell(nx, ny, 0.01 / dist);
                }
            });
        });
    }
}
