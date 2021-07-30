function getConfig() {

    return {

        // Global
        logs: true,
        storeData: true,
        worldSize: 250,
        visibleCols: 30,
        worldWrapper: worldWrapper,
        worldCanvas: worldCanvas,
        miniMapCanvas: miniMapCanvas,
        showCoordinates: false,
        minTickInterval: 1,
        ticksCount: 20,

        // Altitude
        WORLD_MAP_OCEAN_LEVEL: 0.5, // [0-1]
        MAX_WATER_LEVEL: 0.3,

        // Rivers
        RIVERS_DENSITY: 0.5, // [0-1]
        RIVER_SOURCE_MIN_ALTITUDE: 0.5,
        RIVER_SOURCE_MAX_ALTITUDE: 0.9,
        RIVER_START_CLOSENESS: 6,
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

        // Forests
        FOREST_TROPICAL: 1,
        FOREST_TEMPERATE: 2,

        FOREST_BEST_TEMPERATE_HUMIDITY: 0.4,
        FOREST_BEST_TEMPERATE_TEMPERATURE: 0.4,
        FOREST_BEST_TEMPERATE_ALTITUDE: 0.4,

        FOREST_BEST_TROPICAL_HUMIDITY: 0.6,
        FOREST_BEST_TROPICAL_TEMPERATURE: 0.6,
        FOREST_BEST_TROPICAL_ALTITUDE: 0.3,

        FOREST_TUNDRA_GROWTH: 0.12,
        FOREST_TUNDRA_HILLS_GROWTH: 0.08,
        FOREST_GRASS_GROWTH: 0.30,
        FOREST_GRASS_HILLS_GROWTH: 0.35,
        FOREST_DESERT_HILLS_GROWTH: 0.01,
        FOREST_SWAMP_GROWTH: 0.08,
        FOREST_ROCKS_GROWTH: 0.08,
        FOREST_SAVANNA_GROWTH: 0.25,
        FOREST_SAVANNA_HILLS_GROWTH: 0.08,
        FOREST_TROPICS_GROWTH: 0.55,
        FOREST_BEACH_GROWTH: 0,

        FOREST_BORN_CHANCE: 0.4, // 0-1
        FOREST_GROWTH_CHANCE: 12, // 1-20
        FOREST_DEAD_CHANCE: 0.5, // 0-1

        FOREST_BORN_NEAR_WATER: 5, // 1-20
        FOREST_GROWTH_NEAR_WATER: 15, // 1-20

        FOREST_PRE_GENERATION_STEPS: 40,
        FOREST_PRE_GENERATION_MULTIPLY: 0.001,

        FOREST_COLOR: '#3c5626',
        FOREST_IMAGES: [
            'images/forest-1.png',
            'images/forest-2.png'
        ],

        ANIMALS_LIMIT: 100,
        ANIMAL_COLOR: '#f7ff00'
    };
}