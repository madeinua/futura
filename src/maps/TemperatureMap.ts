import PointMatrix from "../structures/PointMatrix.js";
import Config from "../../config.js";
import AltitudeMap from "./AltitudeMap.js";

export default class TemperatureMap extends PointMatrix {

    readonly altitudeMap: AltitudeMap;

    constructor(altitudeMap: AltitudeMap) {
        super(Config.WORLD_SIZE, Config.WORLD_SIZE);
        this.altitudeMap = altitudeMap;
    }

    generateMap(): TemperatureMap {
        this.addGradient();
        this.considerAltitude();
        this.normalize();
        return this;
    }

    private addGradient(): void {
        const gradient: number[] = [];

        for (let i = 0; i < Config.WORLD_SIZE; i++) {
            gradient[i] = i / Config.WORLD_SIZE;
        }

        this.foreach((x: number, y: number): void => {
            this.addToCell(x, y, gradient[y]);
        });
    }

    private considerAltitude(): void {
        const minLevel = Config.MIN_GROUND_LEVEL;

        this.foreach((x: number, y: number): void => {
            let altitude = this.altitudeMap.getCell(x, y);
            altitude = altitude >= minLevel ? (altitude - minLevel) * (altitude - minLevel) : 0;
            this.subtractFromCell(x, y, altitude);
        });
    }
}