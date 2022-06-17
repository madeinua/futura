/**
 * @returns {Object}
 */
function getConfig() {

    return {

        // Global
        LOGS: true,
        STORE_DATA: false,
        RANDOM_WORLD: false,
        SEED: 12345,

        // Maps
        WORLD_SIZE: 250,
        VISIBLE_COLS: 30,
        MAIN_MAP_SCALE: 2.5,
        SHOW_COORDINATES: true,

        // Ticks
        TICKS_ENABLED: true,
        TICKS_MIN_INTERVAL: 500,
        TICKS_LIMIT: 100,
        TICKS_BOOST: 5,
        TICKS_BOOST_STEPS: 40,

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
        LOW_HUMIDITY: 0.2,
        NORMAL_HUMIDITY: 0.5,
        HIGH_HUMIDITY: 0.8,
        MAX_HUMIDITY: 1,

        // Temperature
        ALTITUDE_TEMPERATURE_FACTOR: 0.5,
        MIN_TEMPERATURE: 0,
        LOW_TEMPERATURE: 0.2,
        NORMAL_TEMPERATURE: 0.5,
        HIGH_TEMPERATURE: 0.8,
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

        /**
         * @internal
         * @return {[]}
         */
        biomesConfig: function() {

            let biomesConfig = [];

            biomesConfig.push({
                class: Biome_Tundra,
                h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.LOW_TEMPERATURE],
                a: [0, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Swamp,
                h: [config.HIGH_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
                a: [0, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Grass,
                h: [config.LOW_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.LOW_TEMPERATURE, config.HIGH_TEMPERATURE],
                a: [0, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Savanna,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.NORMAL_TEMPERATURE, config.HIGH_TEMPERATURE],
                a: [0, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Savanna,
                h: [config.MIN_HUMIDITY, config.LOW_HUMIDITY],
                t: [config.LOW_TEMPERATURE, config.NORMAL_TEMPERATURE],
                a: [0, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Tropic,
                h: [config.NORMAL_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [0, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Desert,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [0, config.MAX_LOWLAND_LEVEL]
            });

            ///

            biomesConfig.push({
                class: Biome_Tundra_Hills,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Tundra_Hills,
                h: [config.NORMAL_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.LOW_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Grass_Hills,
                h: [config.NORMAL_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.LOW_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Savanna_Hills,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.NORMAL_TEMPERATURE, config.HIGH_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Desert_Hills,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            ///

            biomesConfig.push({
                class: Biome_Ice_Rocks,
                h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
                a: [config.MAX_HILLS_LEVEL, config.MAX_MOUNTAINS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Rocks,
                h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.NORMAL_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [config.MAX_HILLS_LEVEL, config.MAX_MOUNTAINS_LEVEL]
            });

            return biomesConfig;
        },

        // Forests
        FOREST_TUNDRA_GROWTH: 1.2,
        FOREST_TUNDRA_HILLS_GROWTH: 0.8,
        FOREST_GRASS_GROWTH: 2,
        FOREST_GRASS_HILLS_GROWTH: 5,
        FOREST_DESERT_GROWTH: 0.5,
        FOREST_DESERT_HILLS_GROWTH: 1.5,
        FOREST_SWAMP_GROWTH: 2,
        FOREST_ROCKS_GROWTH: 0.8,
        FOREST_SAVANNA_GROWTH: 2.5,
        FOREST_SAVANNA_HILLS_GROWTH: 4,
        FOREST_TROPICS_GROWTH: 6,
        FOREST_BEACH_GROWTH: 0,

        FOREST_BORN_CHANCE: 0.0014,
        FOREST_NEIGHBORS_MULT: 1.2, // always multiplied by 9 in the formula. means 1 = 9. 2 = 18..
        FOREST_WATTER_MULT: 15,
        FOREST_DEAD_CHANCE: 0.00005,
        FOREST_BOOST: 80,
        FOREST_COLOR: '#3c5626',
        FOREST_IMAGES: [
            'images/forest-1.png',
            'images/forest-2.png'
        ],
        FOREST_PALM_IMAGE: 'images/palm-1.png',

        // Animals
        ANIMAL_RESPAWN_AREA: 20, // of available tiles per 1 animal
        ANIMAL_CREATE_INTENSITY: 100,
        ANIMAL_MOVE_CHANCE: 100,
        ANIMAL_MIN_LIFESPAN: 50,
        ANIMAL_MAX_LIFESPAN: 100,
        ANIMAL_COLOR: '#f7ff00',

        FISH_CREATE_INTENSITY: 75,
        FISH_MOVE_CHANCE: 100,
        FISH_MIN_LIFESPAN: 15,
        FISH_MAX_LIFESPAN: 30,
        FISH_IMAGE: 'images/fish-1.png',

        DEER_CREATE_INTENSITY: 75,
        DEER_MOVE_CHANCE: 75,
        DEER_MIN_LIFESPAN: 15,
        DEER_MAX_LIFESPAN: 30,
        DEER_IMAGE: 'images/deer-1.png',

        COW_CREATE_INTENSITY: 50,
        COW_MOVE_CHANCE: 25,
        COW_MIN_LIFESPAN: 25,
        COW_MAX_LIFESPAN: 50,
        COW_IMAGE: 'images/cow-1.png',
    };
}