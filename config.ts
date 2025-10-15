export type BiomeHTConfig = {
    class: string;
    h: [number, number];
    t: [number, number];
};

export type AnimalConfig = {
    rarity: number; // % of all tiles
    moveChance: number; // 1 of X chance to move on each step
    color: string; // for debug
    image: string | null; // image path
};

const Config = {

    // Global
    LOGS: true,
    STORE_DATA: false,
    RANDOM_WORLD: false,
    SEED: 103,

    // Maps
    WORLD_SIZE: 200,
    CELL_SIZE: 22, // WORLD_SIZE * CELL_SIZE * 2 < 23.000!
    SHOW_RECTANGLES: false,
    SHOW_COORDINATES: false,
    DRAW_TECHNICAL_MAPS: true,

    // Steps
    STEPS_ENABLED: true,
    STEPS_AUTO_START: false,
    STEPS_MIN_INTERVAL: 500,
    STEPS_LIMIT: 500,
    STEPS_BOOST: 5,
    STEPS_BOOST_STEPS: 200,

    // Altitude
    WORLD_MAP_OCEAN_INTENSITY: 0.2, // [0-1]
    EROSION_ITERATIONS: 5, // [0-100]

    // Temperature
    SHOW_TEMPERATURES: false,
    MIN_TEMPERATURE: 0,
    LOW_TEMPERATURE: 14,
    NORMAL_TEMPERATURE: 21,
    HIGH_TEMPERATURE: 28,
    MAX_TEMPERATURE: 45,

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

    // Biomes
    SHOW_BIOMES_INFO: false,
    MIN_LEVEL: 0,
    MIN_COAST_LEVEL: 0.2,
    MIN_GROUND_LEVEL: 0.3,
    MAX_BEACH_LEVEL: 0.32,
    MAX_LOWLAND_LEVEL: 0.42,
    MAX_HILLS_LEVEL: 0.7,
    MAX_LEVEL: 1,

    BEACH_TEMPERATURE_RATIO: -0.02,
    BEACH_HUMIDITY_RATIO: 0.01,
    MAX_BEACH_DISTANCE_FROM_OCEAN: 3,

    /**
     * @internal
     * @return {BiomeHTConfig[]}
     */
    biomeHTConfigs: function (): BiomeHTConfig[] {
        const biomeConfigs: BiomeHTConfig[] = [];

        biomeConfigs.push({
            class: 'Biome_Grass',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.LOW_TEMPERATURE, this.HIGH_TEMPERATURE],
        });

        biomeConfigs.push({
            class: 'Biome_Tundra',
            h: [this.MIN_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.MIN_TEMPERATURE, this.LOW_TEMPERATURE],
        });

        biomeConfigs.push({
            class: 'Biome_Tropic',
            h: [this.NORMAL_HUMIDITY, this.MAX_HUMIDITY],
            t: [this.HIGH_TEMPERATURE, this.MAX_TEMPERATURE],
        });

        biomeConfigs.push({
            class: 'Biome_Desert',
            h: [this.MIN_HUMIDITY, this.NORMAL_HUMIDITY],
            t: [this.HIGH_TEMPERATURE, this.MAX_TEMPERATURE],
        });

        return biomeConfigs;
    },

    BIOME_COLORS: {
        Biome_Ocean: ['#0652a2', '#1f67b4', '#4087d2'],
        Biome_Coast: ['#549ae3', '#78baff'],
        Biome_Water: ['#3592c5'],
        Biome_Beach: ['#fff1ac'],
        Biome_Desert: ['#e8c57e', '#ecc26f', '#eebe62'],
        Biome_Grass: ['#78d741', '#6fbb43', '#649d43', '#57803f'],
        Biome_Tropic: ['#3da678', '#3f9871', '#418869', '#396c56'],
        Biome_Tundra: ['#d5d9a6', '#c3c5a5', '#afb09e', '#9d9d95'],
    },

    BIOME_IMAGES: {
        Ocean: 'images/ocean-1.png',
        Water: 'images/water-1.png',
        Rocks: ['images/mountains-1.png', 'images/mountains-2.png'],
        Desert: 'images/desert-1.png',
        Beach: 'images/beach-1.png',
        Grass: 'images/grass-1.png',
        Tundra: 'images/tundra-1.png',
        Tropic: 'images/tropic-1.png',
    },

    // Forests
    FOREST_LIMIT: 25, // %, compared to the possible tiles
    FOREST_BORN_CHANCE: 0.03, // %
    FOREST_BORN_BOOST: 7,
    FOREST_GROWTH_CHANCE: 0.02, // %
    FOREST_DIE_CHANCE: 0.001, // %
    FOREST_GROUNDS_MULTS: {
        Biome_Tundra: 1.2,
        Biome_Grass: 2,
        Biome_Desert: 0.5,
        Biome_Tropic: 6
    },
    FOREST_CREATE_MULTS: { // Must be 100 in the total
        WATER: 35,
        HUMIDITY: 35,
        GROUND: 30
    },
    FOREST_COLOR: '#3c5626',
    FOREST_IMAGES: {
        'forest_1': 'images/forest-1.png',
    },
    FOREST_PALM_IMAGE: 'images/palm-1.png',
    FOREST_TUNDRA_IMAGE: 'images/forest-3.png',

    // Animals
    DISTANCE_BETWEEN_ANIMALS: 10,
    ANIMALS: {
        'Animal': { // defaults
            rarity: 0.01, // % of all tiles
            moveChance: 100,
            color: '#000000',
            image: null
        },
        'Fish': {
            rarity: 0.005,
            moveChance: 7,
            color: '#4fd0ff',
            image: 'images/fish-1.png'
        },
        'Deer': {
            rarity: 0.01,
            moveChance: 5,
            color: '#ffc800',
            image: 'images/deer-1.png'
        },
        'Cow': {
            rarity: 0.01,
            moveChance: 3,
            color: '#ffffff',
            image: 'images/cow-1.png'
        }
    } as Record<string, AnimalConfig>,

    // Factions
    FACTIONS: {
        COUNT: 10,
        AUTO_CREATE_ON_STEP: -1,
        // Note: < 1 --> negative, >= 1 --> positive
        CREATE_PROBABILITIES: {
            BIOMES: {
                Biome_Beach: 0.1,
                Biome_Tundra: 0.05,
                Biome_Grass: 0.3,
                Biome_Desert: 0.01,
                Biome_Tropic: 0.25,
            },
            MIN_ISLAND_SIZE: 50,
            CLOSE_TO_OCEAN: 2,
            CLOSE_TO_WATER: 5,
            IS_FOREST: 0.3,
            CLOSE_TO_FOREST: 2,
        },
        INFLUENCE: {
            // Boosts
            HILLS_BOOST: 0.5,
            MOUNTAINS_BOOST: 0.1,
            FOREST_BOOST: 0.5,
            // Biomes
            Biome_Ocean: 0.1,
            Biome_Coast: 0.25,
            Biome_Water: 0.25,
            Biome_Beach: 0.8,
            Biome_Tundra: 0.5,
            Biome_Grass: 1.0,
            Biome_Desert: 0.2,
            Biome_Tropic: 0.33,
        },
        COLORS: [
            '#ff0000',
            '#00ff00',
            '#ffff00',
            '#c62ce0',
            '#00f7ff',
            '#31057a',
            '#ff4b89',
            '#ff9100',
            '#00ff80',
            '#641841',
            '#000000',
        ]
    }
} as const;

export default Config;