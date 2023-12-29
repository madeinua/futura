import Config from "../../config.js";
import HumidityMap from '../maps/HumidityMap.js';
import { Filters, logTimeEvent } from "../helpers.js";
export default class HumidityOperator {
    constructor() {
        this.generateHumidityMap = function (altitudeMap, riversMap, lakesMap) {
            let humidityMap = new HumidityMap(altitudeMap, riversMap, lakesMap), storage = Config.STORE_DATA ? localStorage.getItem('humidityMap') : null;
            if (typeof storage !== 'undefined' && storage !== null) {
                humidityMap.fromString(storage);
            }
            else {
                humidityMap.generateMap();
                if (Config.STORE_DATA) {
                    localStorage.setItem('humidityMap', humidityMap.toString());
                }
            }
            humidityMap = Filters.apply('humidityMap', humidityMap);
            if (Config.LOGS) {
                logTimeEvent('Humidity map created. Min: ' + humidityMap.getMin() + ' Max: ' + humidityMap.getMax() + ' Avg: ' + humidityMap.getAvgValue());
            }
            return humidityMap;
        };
    }
}
