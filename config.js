const Config = {

    // Global
    LOGS: true,
    STORE_DATA: false,
    RANDOM_WORLD: false,
    SEED: 12345,

    // Maps
    WORLD_SIZE: 250,
    VISIBLE_COLS: 60,
    VISIBLE_ROWS: 30,
    SHOW_RECTANGLES: false,
    SHOW_COORDINATES: false,
    DRAW_TECHNICAL_MAPS: false,

    // Steps
    STEPS_ENABLED: true,
    STEPS_MIN_INTERVAL: 500,
    STEPS_LIMIT: 40,
    STEPS_BOOST: 5,
    STEPS_BOOST_STEPS: 40,

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

        const biomesConfig = [];

        biomesConfig.push({
            class: 'Biome_Tundra',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.MIN_TEMPERATURE, this.LOW_TEMPERATURE],
            a: [this.MIN_LEVEL, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Swamp',
            h: [this.HIGH_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.MIN_TEMPERATURE, this.NORMAL_TEMPERATURE],
            a: [this.MIN_LEVEL, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Grass',
            h: [this.LOW_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.LOW_TEMPERATURE, this.HIGH_TEMPERATURE],
            a: [this.MIN_LEVEL, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Savanna',
            h: [this.MIN_HUMIDITY, this.NORMAL_HUMIDITY],
            t: [this.NORMAL_TEMPERATURE, this.HIGH_TEMPERATURE],
            a: [this.MIN_LEVEL, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Savanna',
            h: [this.MIN_HUMIDITY, this.LOW_HUMIDITY],
            t: [this.LOW_TEMPERATURE, this.NORMAL_TEMPERATURE],
            a: [this.MIN_LEVEL, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Tropic',
            h: [this.NORMAL_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.HIGH_TEMPERATURE, this.MAX_TEMPERATURE],
            a: [this.MIN_LEVEL, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Desert',
            h: [this.MIN_HUMIDITY, this.NORMAL_HUMIDITY],
            t: [this.HIGH_TEMPERATURE, this.MAX_TEMPERATURE],
            a: [this.MIN_LEVEL, this.MAX_LOWLAND_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Tundra_Hills',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.MIN_TEMPERATURE, this.LOW_TEMPERATURE],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Grass_Hills',
            h: [this.LOW_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.LOW_TEMPERATURE, this.MAX_TEMPERATURE],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Savanna_Hills',
            h: [this.MIN_HUMIDITY, this.NORMAL_HUMIDITY],
            t: [this.NORMAL_TEMPERATURE, this.HIGH_TEMPERATURE],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Savanna_Hills',
            h: [this.MIN_HUMIDITY, this.LOW_HUMIDITY],
            t: [this.LOW_TEMPERATURE, this.NORMAL_TEMPERATURE],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Desert_Hills',
            h: [this.MIN_HUMIDITY, this.NORMAL_HUMIDITY],
            t: [this.HIGH_TEMPERATURE, this.MAX_TEMPERATURE],
            a: [this.MAX_LOWLAND_LEVEL, this.MAX_HILLS_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Ice_Rocks',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.MIN_TEMPERATURE, this.LOW_TEMPERATURE],
            a: [this.MAX_HILLS_LEVEL, this.MAX_MOUNTAINS_LEVEL]
        });

        biomesConfig.push({
            class: 'Biome_Rocks',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.LOW_TEMPERATURE, this.MAX_TEMPERATURE],
            a: [this.MAX_HILLS_LEVEL, this.MAX_MOUNTAINS_LEVEL]
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
        Biome_Ice_Rocks: '#a6a6a6',
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
        Biome_Rocks: 'public/images/mountains-1.png',
        Biome_Ice_Rocks: 'public/images/mountains-2.png',
    },

    // Forests
    FOREST_LIMIT: 30, // %, compared to the possible tiles
    FOREST_BORN_CHANCE: 0.03, // %
    FOREST_BORN_BOOST: 7,
    FOREST_GROWTH_CHANCE: 0.02, // %
    FOREST_DIE_CHANCE: 0.001, // %
    FOREST_GROUNDS_MULTS: {
        Biome_Tundra: 1.2,
        Biome_Tundra_Hills: 0.8,
        Biome_Grass: 2,
        Biome_Grass_Hills: 5,
        Biome_Desert: 0.5,
        Biome_Desert_Hills: 1.5,
        Biome_Swamp: 2,
        Biome_Rocks: 0.8,
        Biome_Savanna: 2.5,
        Biome_Savanna_Hills: 4,
        Biome_Tropic: 6
    },
    FOREST_CREATE_MULTS: { // Must be 100 in the total
        WATTER: 35,
        HUMIDITY: 35,
        GROUND: 30
    },
    FOREST_COLOR: '#3c5626',
    FOREST_IMAGES: {
        'forest_1': 'public/images/forest-1.png',
        'forest_2': 'public/images/forest-2.png',
    },
    FOREST_PALM_IMAGE: 'public/images/palm-1.png',
    FOREST_TUNDRA_IMAGE: 'public/images/forest-3.png',

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
            rarity: 0.05,
            color: '#4fd0ff',
            image: 'public/images/fish-1.png'
        },
        'Deer': {
            intensity: 75,
            moveChance: 30,
            rarity: 0.01,
            color: '#ffc800',
            image: 'public/images/deer-1.png'
        },
        'Cow': {
            intensity: 50,
            moveChance: 10,
            rarity: 0.01,
            color: '#ffffff',
            image: 'public/images/cow-1.png'
        }
    },

    // Fractions
    FRACTIONS: {
        AUTO_CREATE_ON_STEP: 25,
        // Note: < 1 --> negative, >= 1 --> positive
        CREATE_PROBABILITIES: {
            BIOMES: {
                Biome_Tundra: 0.05,
                Biome_Tundra_Hills: 0.01,
                Biome_Grass: 0.3,
                Biome_Grass_Hills: 0.2,
                Biome_Savanna: 0.2,
                Biome_Savanna_Hills: 0.15,
                Biome_Desert: 0.01,
                Biome_Desert_Hills: 0.05,
                Biome_Swamp: 0.1,
                Biome_Tropic: 0.25,
                Biome_Rocks: 0.01,
            },
            CLOSE_TO_OCEAN: 3,
            CLOSE_TO_WATER: 5,
            IS_FOREST: 0.3,
            CLOSE_TO_FOREST: 2,
            CLOSE_TO_FRACTION: 0.05,
        },
        CREATE_COUNT: 5,
        COLORS: [
            '#ff0000',
            '#00ff00',
            '#0099ff',
            '#ffff00',
            '#ff00ff',
            '#00ccaa',
            '#ffffff',
            '#000000',
        ]
    }
}

export default Config;