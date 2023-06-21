import AltitudeMap from "../maps/AltitudeMap.js";
import { Filters, logTimeEvent } from "../helpers.js";
import Config from "../../config.js";
export default class SurfaceOperator {
    constructor() {
        this.generateAltitudeMap = function () {
            let altitudeMap = new AltitudeMap(Config.WORLD_SIZE, Config.WORLD_SIZE), storage = Config.STORE_DATA ? localStorage.getItem('altitudeMap') : null;
            if (typeof storage !== 'undefined' && storage !== null) {
                altitudeMap.loadMap(storage);
            }
            else {
                altitudeMap.generateMap();
                if (Config.STORE_DATA) {
                    localStorage.setItem('altitudeMap', altitudeMap.toString());
                }
            }
            altitudeMap = Filters.apply('altitudeMap', altitudeMap);
            if (Config.LOGS) {
                logTimeEvent('Altitude map generated. Min: ' + altitudeMap.getMin() + ' Max: ' + altitudeMap.getMax() + ' Avg: ' + altitudeMap.getAvgValue());
            }
            return altitudeMap;
        };
    }
}
