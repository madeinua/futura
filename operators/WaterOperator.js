class WaterOperator {

    /**
     * @param {AltitudeMap} altitudeMap
     * @return {OceanMap}
     */
    generateOceanMap = function(altitudeMap) {

        let oceanMap = new OceanMap(altitudeMap),
            storage = config.storeData ? localStorage.getItem('oceanMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            oceanMap.fromString(storage);
        } else {

            oceanMap.generateMap();

            if (config.storeData) {
                localStorage.setItem('oceanMap', oceanMap.toString());
            }
        }

        oceanMap = Filters.apply('oceanMap', oceanMap);

        if (config.logs) {
            logTimeEvent('Ocean map calculated. Size: ' + oceanMap.getSize() + '%');
        }

        return oceanMap;
    }

    /**
     * @param {OceanMap} oceanMap
     * @param {AltitudeMap} altitudeMap
     * @param {TemperatureMap} temperatureMap
     * @return {CoastMap}
     */
    getCoastMap = function(oceanMap, altitudeMap, temperatureMap) {

        let coastMap = new CoastMap(oceanMap, altitudeMap, temperatureMap),
            storage = config.storeData ? localStorage.getItem('coastMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            coastMap.fromString(storage);
        } else {

            coastMap.generateMap();

            if (config.storeData) {
                localStorage.setItem('coastMap', coastMap.toString());
            }
        }

        coastMap = Filters.apply('coastMap', coastMap);

        if (config.logs) {
            logTimeEvent('Coast map calculated.');
        }

        return coastMap;
    }

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {OceanMap} oceanMap
     * @return {LakesMap}
     */
    generateLakesMap = function(altitudeMap, oceanMap) {

        let lakesMap = new LakesMap(altitudeMap, oceanMap),
            storage = config.storeData ? localStorage.getItem('lakesMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            lakesMap.fromString(storage);
        } else {

            lakesMap.generateMap();

            if (config.storeData) {
                localStorage.setItem('lakesMap', lakesMap.toString());
            }
        }

        lakesMap = Filters.apply('lakesMap', lakesMap);

        if (config.logs) {
            logTimeEvent('Lakes map calculated. Size: ' + lakesMap.getSize() + '%');
        }

        return lakesMap;
    }

    /**
     * @param {AltitudeMap} altitudeMap
     * @param {LakesMap} lakesMap
     * @return {RiversMap}
     */
    generateRiversMap = function(altitudeMap, lakesMap) {

        let riversMap = new RiversMap(altitudeMap, lakesMap),
            storage = config.storeData ? localStorage.getItem('riversMap') : null;

        if (typeof storage !== 'undefined' && storage !== null) {
            riversMap.fromString(storage);
        } else {

            riversMap.generateMap();

            if (config.storeData) {
                localStorage.setItem('riversMap', riversMap.toString());
            }
        }

        riversMap = Filters.apply('riversMap', riversMap);

        if (config.logs) {
            logTimeEvent('Rivers generated. Rivers: ' + riversMap.getGeneratedRiversCount());
        }

        return riversMap;
    }

    /**
     * @param {LakesMap} lakesMap
     * @param {RiversMap} riversMap
     * @return {BinaryMatrix}
     */
    getFreshWaterMap = function(lakesMap, riversMap) {

        let freshWaterMap = new BinaryMatrix(config.worldSize, config.worldSize);

        freshWaterMap.combineWith(lakesMap);
        freshWaterMap.combineWith(riversMap);

        return freshWaterMap;
    }
}