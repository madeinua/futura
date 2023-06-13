import TemperatureMap from "../maps/TemperatureMap.js";
import {logTimeEvent, Filters} from "../helpers.js";

export default class WeatherOperator {

    /** @var {Object} */
    config;

    /**
     * @param {Object} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {TemperatureMap}
     */
    generateTemperatureMap = function(altitudeMap) {

        let temperatureMap = new TemperatureMap(altitudeMap, this.config),
            storage = this.config.STORE_DATA ? localStorage.getItem('temperatureMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            temperatureMap.fromString(storage);
        } else {

            temperatureMap.generateMap();

            if (this.config.STORE_DATA) {
                localStorage.setItem('temperatureMap', temperatureMap.toString());
            }
        }

        temperatureMap = Filters.apply('temperatureMap', temperatureMap);

        if (this.config.LOGS) {
            logTimeEvent('Temperature map created. Min: ' + temperatureMap.getMin() + ' Max: ' + temperatureMap.getMax() + ' Avg.: ' + temperatureMap.getAvgValue());
        }

        return temperatureMap;
    }
}