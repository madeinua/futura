import PointMatrix from "../structures/PointMatrix.js";
import NoiseMapGenerator from "../generators/NoiseMapGenerator.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";
import RiversMap from "./RiversMap.js";
import LakesMap from "./LakesMap.js";

export default class HumidityMap extends PointMatrix {

    readonly altitudeMap: AltitudeMap;
    readonly riversMap: RiversMap;
    readonly lakesMap: LakesMap;

    constructor(altitudeMap: AltitudeMap, riversMap: RiversMap, lakesMap: LakesMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.altitudeMap = altitudeMap;
        this.riversMap = riversMap;
        this.lakesMap = lakesMap;
    }

    /**
     * 0 = wet
     * 1 = dry
     */
    generateMap = (): HumidityMap => {
        this.generateNoiseMap();
        this.considerAltitude();
        this.considerRivers();
        this.considerLakes();
        this.normalize();
        return this;
    };

    private generateNoiseMap(): void {
        this.setAll(
            new NoiseMapGenerator(Config.WORLD_SIZE, 150)
                .generate()
                .getValues()
        );
    }

    private considerAltitude(): void {
        // Higher altitude = lower humidity
        this.foreachValues((altitude: number, x: number, y: number): void => {
            this.addToCell(x, y, -altitude * 0.5);
        });
    }

    private considerRivers(): void {
        // Rivers increase humidity.
        // Instead of calling a separate "distance" function, we inline the calculation.
        this.riversMap.foreachFilled((x: number, y: number): void => {
            this.foreachAroundRadius(x, y, 4, (nx: number, ny: number): void => {
                const dx = nx - x;
                const dy = ny - y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist !== 0) {
                    this.addToCell(nx, ny, 0.015 / dist);
                }
            });
        });
    }

    private considerLakes(): void {
        // Lakes increase humidity.
        this.lakesMap.foreachFilled((x: number, y: number): void => {
            this.foreachAroundRadius(x, y, 5, (nx: number, ny: number): void => {
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