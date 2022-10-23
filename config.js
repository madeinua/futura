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
        SHOW_RECTANGLES: false,
        SHOW_COORDINATES: false,

        // Steps
        STEPS_ENABLED: true,
        STEPS_MIN_INTERVAL: 500,
        STEPS_LIMIT: 50,
        STEPS_BOOST: 5,
        STEPS_BOOST_STEPS: 50,

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
        LOW_HUMIDITY: 25,
        NORMAL_HUMIDITY: 50,
        HIGH_HUMIDITY: 75,
        MAX_HUMIDITY: 100,

        // Temperature
        SHOW_TEMPERATURES: false,
        MIN_TEMPERATURE: 0,
        LOW_TEMPERATURE: 14,
        NORMAL_TEMPERATURE: 21,
        HIGH_TEMPERATURE: 28,
        MAX_TEMPERATURE: 45,

        // Biomes
        SHOW_BIOMES_INFO: false,
        MIN_LEVEL: 0,
        MAX_OCEAN_LEVEL: 0.25,
        MAX_COAST_LEVEL: 0.3,
        MAX_BEACH_LEVEL: 0.32,
        MAX_LOWLAND_LEVEL: 0.5,
        MAX_HILLS_LEVEL: 0.7,
        MAX_MOUNTAINS_LEVEL: 1,

        COAST_TEMPERATURE_RATIO: 0.05,
        BEACH_TEMPERATURE_RATIO: -0.02,
        BEACH_HUMIDITY_RATIO: 0.01,
        MAX_BEACH_DISTANCE_FROM_OCEAN: 3,

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
                a: [config.MIN_LEVEL, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Swamp,
                h: [config.HIGH_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.NORMAL_TEMPERATURE],
                a: [config.MIN_LEVEL, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Grass,
                h: [config.LOW_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.LOW_TEMPERATURE, config.HIGH_TEMPERATURE],
                a: [config.MIN_LEVEL, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Savanna,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.NORMAL_TEMPERATURE, config.HIGH_TEMPERATURE],
                a: [config.MIN_LEVEL, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Savanna,
                h: [config.MIN_HUMIDITY, config.LOW_HUMIDITY],
                t: [config.LOW_TEMPERATURE, config.NORMAL_TEMPERATURE],
                a: [config.MIN_LEVEL, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Tropic,
                h: [config.NORMAL_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [config.MIN_LEVEL, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Desert,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [config.MIN_LEVEL, config.MAX_LOWLAND_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Tundra_Hills,
                h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.LOW_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Grass_Hills,
                h: [config.LOW_HUMIDITY, config.MAX_HUMIDITY],
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
                class: Biome_Savanna_Hills,
                h: [config.MIN_HUMIDITY, config.LOW_HUMIDITY],
                t: [config.LOW_TEMPERATURE, config.NORMAL_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Desert_Hills,
                h: [config.MIN_HUMIDITY, config.NORMAL_HUMIDITY],
                t: [config.HIGH_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [config.MAX_LOWLAND_LEVEL, config.MAX_HILLS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Ice_Rocks,
                h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.MIN_TEMPERATURE, config.LOW_TEMPERATURE],
                a: [config.MAX_HILLS_LEVEL, config.MAX_MOUNTAINS_LEVEL]
            });

            biomesConfig.push({
                class: Biome_Rocks,
                h: [config.MIN_HUMIDITY, config.MAX_HUMIDITY],
                t: [config.LOW_TEMPERATURE, config.MAX_TEMPERATURE],
                a: [config.MAX_HILLS_LEVEL, config.MAX_MOUNTAINS_LEVEL]
            });

            return biomesConfig;
        },

        BIOME_COLORS: {
            Biome_Beach: '#c2b281',
            Biome_Coast: '#003eb2',
            Biome_Desert: '#e8c57e',
            Biome_Desert_Hills: '#c4a37e',
            Biome_Grass: '#659c29',
            Biome_Grass_Hills: '#778e5d',
            Biome_Rocks: '#818f71',
            Biome_Ice_Rocks: '#fff',
            Biome_Ocean: '#003eb2',
            Biome_Savanna: '#9b9e3f',
            Biome_Savanna_Hills: '#7f7946',
            Biome_Swamp: '#20a894',
            Biome_Tropic: '#3c8045',
            Biome_Tundra: '#d5d7b7',
            Biome_Tundra_Hills: '#a8a996',
            Biome_Water: '#74aece',
        },

        BIOME_IMAGES: {
            Biome_Rocks: 'images/mountains-1.png',
            Biome_Ice_Rocks: 'images/mountains-2.png',
        },

        // Forests
        FOREST_LIMIT: 30, // %, compared to the possible tiles
        FOREST_BORN_CHANCE: 0.005, // %
        FOREST_GROWTH_CHANCE: 0.05, // %
        FOREST_DIE_CHANCE: 0.001, // %
        FOREST_GROUNDS_MULTS: {
            'tundra': 1.2,
            'tundra-hills': 0.8,
            'grass': 2,
            'grass-hills': 5,
            'desert': 0.5,
            'desert-hills': 1.5,
            'swamp': 2,
            'rocks': 0.8,
            'savanna': 2.5,
            'savanna-hills': 4,
            'tropic': 6
        },
        FOREST_CREATE_MULTS: { // Must be 100 in the total
            WATTER: 35,
            HUMIDITY: 35,
            GROUND: 30
        },
        FOREST_COLOR: '#3c5626',
        FOREST_IMAGES: [
            'images/forest-1.png',
            'images/forest-2.png'
        ],
        FOREST_PALM_IMAGE: 'images/palm-1.png',

        // Animals
        ANIMALS: {
            'Animal': { // defaults
                intensity: 100,
                moveChance: 100,
                rarity: 0.01, // % of all tiles
                color: '#000000',
                image: null
            },
            'Fish': {
                intensity: 75,
                moveChance: 50,
                rarity: 0.01,
                color: '#4fd0ff',
                image: 'images/fish-1.png'
            },
            'Deer': {
                intensity: 75,
                moveChance: 30,
                rarity: 0.01,
                color: '#ffc800',
                image: 'images/deer-1.png'
            },
            'Cow': {
                intensity: 50,
                moveChance: 10,
                rarity: 0.01,
                color: '#ffffff',
                image: 'images/cow-1.png'
            }
        }
    };
}