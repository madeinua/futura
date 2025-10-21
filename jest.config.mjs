export default {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/?(*.)+(test|spec).ts?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    extensionsToTreatAsEsm: ['.ts', '.tsx'],
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', {useESM: true, tsconfig: 'tsconfig.test.json'}],
    },
    clearMocks: true,
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/index.{ts,tsx}'],

    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy'
    }
};