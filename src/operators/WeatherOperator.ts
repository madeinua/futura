import TemperatureMap from "../maps/TemperatureMap.js";
import {logTimeEvent, Filters} from "../helpers.js";
import Config from "../../config.js";
import AltitudeMap from "../maps/AltitudeMap";

export default class WeatherOperator {

    generateTemperatureMap = function(altitudeMap: AltitudeMap): TemperatureMap {

        let temperatureMap = new TemperatureMap(altitudeMap),
            storage = Config.STORE_DATA ? localStorage.getItem('temperatureMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            temperatureMap.fromString(storage);
        } else {

            temperatureMap.generateMap();

            if (Config.STORE_DATA) {
                localStorage.setItem('temperatureMap', temperatureMap.toString());
            }
        }

        temperatureMap = Filters.apply('temperatureMap', temperatureMap);

        if (Config.LOGS) {
            logTimeEvent('Temperature map created. Min: ' + temperatureMap.getMin() + ' Max: ' + temperatureMap.getMax() + ' Avg.: ' + temperatureMap.getAvgValue());
        }

        return temperatureMap;
    }
}