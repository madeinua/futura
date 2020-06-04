function getConfig() {

    return {

        // Global
        storeData: true,
        worldSize: 300,
        visibleCols: 30,
        worldCanvas: worldCanvas,
        miniMapCanvas: miniMapCanvas,
        showCoordinates: false,

        // Altitude
        ALTITUDE_OCTAVES: [12, 20, 80],
        WORLD_MAP_OCEAN_LEVEL: 0.5, // [0-1]
        MAX_WATER_LEVEL: 0.3,

        // Rivers
        RIVERS_DENSITY: 0.5, // [0-1]
        RIVER_SOURCE_MIN_ALTITUDE: 0.5,
        RIVER_SOURCE_MAX_ALTITUDE: 0.9,
        RIVERS_CLOSENESS: 3,
        RIVER_MIN_LENGTH: 5,
        RIVER_DELTA_MAX_LENGTH: 0.25, // [0-1] 1 = 100% of length
        LAKE_TO_RIVER_RATIO: 1.3,

        // Humidity
        MIN_HUMIDITY: 0,
        NORMAL_HUMIDITY: 0.3,
        HIGH_HUMIDITY: 0.6,
        MAX_HUMIDITY: 1,

        // Temperature
        ALTITUDE_TEMPERATURE_FACTOR: 0.5,
        MIN_TEMPERATURE: 0,
        NORMAL_TEMPERATURE: 0.3,
        HIGH_TEMPERATURE: 0.6,
        MAX_TEMPERATURE: 1,

        // Biomes
        MAX_OCEAN_LEVEL: 0.25,
        MAX_COAST_LEVEL: 0.3,
        MAX_BEACH_LEVEL: 0.32,
        MAX_LOWLAND_LEVEL: 0.5,
        MAX_HILLS_LEVEL: 0.75,
        MAX_MOUNTAINS_LEVEL: 1,

        COAST_TEMPERATURE_RATIO: 0.05,
        BEACH_TEMPERATURE_RATIO: -0.02,
        BEACH_HUMIDITY_RATIO: 0.01,

        MAX_BEACH_DISTANCE_FROM_OCEAN: 5,

        FOREST_TROPICAL: 1,
        FOREST_TEMPERATE: 2,
        FOREST_BOREAL: 3,

        BOREAL_FOREST_MIN_ALTITUDE: 0.7,
    };
}