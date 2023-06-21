import HumidityMap from '../maps/HumidityMap.js';
import {Filters, logTimeEvent} from "../helpers.js";
import Config from "../../config.js";
import AltitudeMap from "../maps/AltitudeMap";
import RiversMap from "../maps/RiversMap";
import LakesMap from "../maps/LakesMap";

export default class HumidityOperator {

    generateHumidityMap = function (altitudeMap: AltitudeMap, riversMap: RiversMap, lakesMap: LakesMap): HumidityMap {

        let humidityMap = new HumidityMap(altitudeMap, riversMap, lakesMap),
            storage = Config.STORE_DATA ? localStorage.getItem('humidityMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            humidityMap.fromString(storage);
        } else {

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
    }
}