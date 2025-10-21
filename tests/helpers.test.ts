import {getTimeForEvent, logTimeEvent, resetTimeEvent} from "../src/helpers";

const realRandom = Math.random;

afterEach(() => {
    (Math.random as any) = realRandom;
    jest.restoreAllMocks();
});

test('throwError', () => {
    const {throwError} = require("../src/helpers");

    const spy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {
        });

    throwError('bad input');

    // Default case
    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith('bad input');

    throwError('bad input 2');

    expect(spy).toHaveBeenCalledTimes(2); // New message - should throw again

    throwError('bad input 2');

    expect(spy).toHaveBeenCalledTimes(2); // Same message - should NOT throw again

    throwError('bad input 2', 3, false);

    expect(spy).toHaveBeenCalledTimes(3); // Same message but allow same message - should throw again

    throwError('bad input 2', 3, false);

    expect(spy).toHaveBeenCalledTimes(3); // Limit reached - should NOT throw again

    spy.mockRestore();
});

test('Filters', () => {
    const {Filters} = require("../src/helpers");

    const addExclamation = (str: string) => str + '!';
    const toUpperCase = (str: string) => str.toUpperCase();

    Filters.add('greet', addExclamation);
    Filters.add('greet', toUpperCase);

    let result = Filters.apply('greet', 'hello');
    expect(result).toBe('HELLO!');
});

test('getStep', () => {
    const {getStep} = require("../src/helpers");

    expect(getStep()).toBe(1);
    expect(getStep()).toBe(2);
    expect(getStep()).toBe(3);
});

test('round', () => {
    const {round} = require("../src/helpers");

    expect(round(1.23456, 2)).toBe(1.23);
    expect(round(1.23556, 2)).toBe(1.24);
    expect(round(1.2, 2)).toBe(1.2);
    expect(round(1, 2)).toBe(1);
    expect(round(1.9999, 3)).toBe(2);
    expect(round(0, 0)).toBe(0);
    expect(round(-1.23456, 2)).toBe(-1.23);
});

test('normalRandom', () => {
    const {normalRandom} = require("../src/helpers");

    for (let i = 0; i < 100; i++) {
        const num = normalRandom();
        expect(num).toBeGreaterThanOrEqual(0);
        expect(num).toBeLessThanOrEqual(1);
    }

    const results = new Set<number>();
    for (let i = 0; i < 100; i++) {
        results.add(normalRandom());
    }

    // Be sure that is not always 0 or 1
    expect(results).not.toContain(0);
    expect(results).not.toContain(1);
});

test('normalRandBetweenNumbers', () => {
    const {normalRandBetweenNumbers} = require("../src/helpers");

    for (let i = 0; i < 100; i++) {
        const num = normalRandBetweenNumbers(5, 10);
        expect(num).toBeGreaterThanOrEqual(5);
        expect(num).toBeLessThanOrEqual(10);
    }
});

test('randBetweenNumbers', () => {
    const {randBetweenNumbers} = require("../src/helpers");

    Math.random = jest.fn().mockReturnValue(0.5);
    expect(randBetweenNumbers(0, 10)).toBe(5);

    Math.random = jest.fn().mockReturnValue(0);
    expect(randBetweenNumbers(0, 10)).toBe(0);

    Math.random = jest.fn().mockReturnValue(1);
    expect(randBetweenNumbers(0, 10)).toBe(10);

    Math.random = jest.fn().mockReturnValue(0.25);
    expect(randBetweenNumbers(0, 10)).toBe(2.5);
});

test('iAmLucky', () => {
    const {iAmLucky} = require("../src/helpers");

    // Always true
    for (let i = 0; i < 100; i++) {
        expect(iAmLucky(100)).toBe(true);
    }

    // Always false
    for (let i = 0; i < 100; i++) {
        expect(iAmLucky(0)).toBe(false);
    }

    // Random cases
    let trueCount = 0;
    let falseCount = 0;
    for (let i = 0; i < 1000; i++) {
        if (iAmLucky(30)) {
            trueCount++;
        } else {
            falseCount++;
        }
    }

    expect(trueCount).toBeGreaterThan(0);
    expect(falseCount).toBeGreaterThan(0);
    expect(falseCount).toBeGreaterThan(trueCount);
});

test('fromFraction', () => {
    const {fromFraction} = require("../src/helpers");

    expect(fromFraction(0, 5, 10)).toBe(5);
    expect(fromFraction(1, 5, 10)).toBe(10);
    expect(fromFraction(0.5, 5, 10)).toBe(7.5);
    expect(fromFraction(0.25, 0, 100)).toBe(25);
    expect(fromFraction(0.75, -50, 50)).toBe(25);
});

test('toFraction', () => {
    const {toFraction} = require("../src/helpers");

    expect(toFraction(5, 5, 10)).toBe(0);
    expect(toFraction(10, 5, 10)).toBe(1);
    expect(toFraction(7.5, 5, 10)).toBe(0.5);
    expect(toFraction(25, 0, 100)).toBe(0.25);
    expect(toFraction(25, -50, 50)).toBe(0.75);
});

test('fromMiddleFractionValue', () => {
    const {fromMiddleFractionValue} = require("../src/helpers");

    expect(fromMiddleFractionValue(0)).toBe(0);
    expect(fromMiddleFractionValue(1)).toBe(0);
    expect(fromMiddleFractionValue(0.5)).toBe(1);
    expect(fromMiddleFractionValue(0.25)).toBe(0.5);
    expect(fromMiddleFractionValue(0.75)).toBe(0.5);

    // Different target value
    expect(fromMiddleFractionValue(0, 0)).toBe(1);
    expect(fromMiddleFractionValue(1, 1)).toBe(1);
    expect(fromMiddleFractionValue(0.5, 0)).toBe(0.5);
    expect(fromMiddleFractionValue(0.5, 1)).toBe(0.5);
});

test('changeRange', () => {
    const {changeRange} = require("../src/helpers");

    expect(changeRange(5, 0, 10, 0, 100)).toBe(50);
    expect(changeRange(0, 0, 10, 0, 100)).toBe(0);
    expect(changeRange(10, 0, 10, 0, 100)).toBe(100);
    expect(changeRange(2.5, 0, 10, 0, 100)).toBe(25);
    expect(changeRange(7.5, 0, 10, 0, 100)).toBe(75);
    expect(changeRange(-5, -10, 0, 0, 100)).toBe(50);
    expect(changeRange(-10, -10, 0, 0, 100)).toBe(0);
    expect(changeRange(0, -10, 0, 0, 100)).toBe(100);
});

test('fractionToRGB', () => {
    const {fractionToRGB} = require("../src/helpers");

    expect(fractionToRGB(0)).toBe(0);
    expect(fractionToRGB(1)).toBe(255);
    expect(fractionToRGB(0.5)).toBe(128);
    expect(fractionToRGB(0.25)).toBe(64);
    expect(fractionToRGB(0.75)).toBe(191);
});

test('RGBToFraction', () => {
    const {RGBToFraction} = require("../src/helpers");

    expect(RGBToFraction(0)).toBe(0);
    expect(RGBToFraction(255)).toBe(1);
    expect(RGBToFraction(128)).toBeCloseTo(0.50196, 5);
    expect(RGBToFraction(64)).toBeCloseTo(0.25098, 5);
    expect(RGBToFraction(191)).toBeCloseTo(0.74902, 5);
});

test('distance', () => {
    const {distance} = require("../src/helpers");

    expect(distance(0, 0, 3, 4)).toBe(5);
    expect(distance(1, 1, 4, 5)).toBe(5);
    expect(distance(-1, -1, -4, -5)).toBe(5);
    expect(distance(0, 0, 0, 0)).toBe(0);
    expect(distance(2, 3, 2, 7)).toBe(4);
});

test('LightenDarkenColor', () => {
    const {LightenDarkenColor} = require("../src/helpers");

    expect(LightenDarkenColor('#000000', 20)).toBe('#141414');
    expect(LightenDarkenColor('#ffffff', -20)).toBe('#ebebeb');
    expect(LightenDarkenColor('#123456', 10)).toBe('#1c3e60');
    expect(LightenDarkenColor('#123456', -10)).toBe('#082a4c');
});

test('rgbToRgba', () => {
    const {rgbToRgba} = require("../src/helpers");

    expect(rgbToRgba([255, 0, 0], 1)).toEqual([255, 0, 0, 1]);
    expect(rgbToRgba([0, 255, 0], 0.5)).toEqual([0, 255, 0, 0.5]);
    expect(rgbToRgba([0, 0, 255], 0)).toEqual([0, 0, 255, 0]);
});

test('rgbToHex', () => {
    const {rgbToHex} = require("../src/helpers");

    expect(rgbToHex([255, 0, 0, 1])).toBe('#ff000001');
    expect(rgbToHex([0, 255, 0, 0.5])).toBe('#00ff000.8');
    expect(rgbToHex([0, 0, 255, 0])).toBe('#0000ff00');
});

test('getPolygonAreaSize', () => {
    const {getPolygonAreaSize} = require("../src/helpers");

    expect(getPolygonAreaSize([[0, 0], [4, 0], [4, 3], [0, 3]])).toBe(12);
    expect(getPolygonAreaSize([[1, 1], [5, 1], [5, 4], [1, 4]])).toBe(12);
    expect(getPolygonAreaSize([[0, 0], [1, 0], [1, 1], [0, 1]])).toBe(1);
    expect(getPolygonAreaSize([[0, 0], [2, 0], [1, 1]])).toBe(1);
    expect(getPolygonAreaSize([[0, 0], [4, 0], [4, 3], [2, 4], [0, 3]])).toBe(14);
});

describe('time events utils', () => {
    let logSpy: jest.SpyInstance;

    beforeAll(() => {
        jest.useFakeTimers();
    });

    beforeEach(() => {
        jest.setSystemTime(new Date('2020-01-01T00:00:00.000Z'));
        resetTimeEvent();
        logSpy = jest.spyOn(console, 'log').mockImplementation(() => {
        });
    });

    afterEach(() => {
        logSpy.mockRestore();
    });

    test('getTimeForEvent()', () => {

        jest.advanceTimersByTime(250);
        expect(getTimeForEvent()).toBe(250);

        jest.advanceTimersByTime(50);
        expect(getTimeForEvent()).toBe(300);
    });

    test('logTimeEvent()', () => {

        jest.advanceTimersByTime(100);
        logTimeEvent('A');
        expect(logSpy).toHaveBeenCalledWith('A [100ms]');

        expect(getTimeForEvent()).toBe(0);

        jest.advanceTimersByTime(40);
        logTimeEvent('B');
        expect(logSpy).toHaveBeenLastCalledWith('B [40ms]');

        expect(getTimeForEvent()).toBe(0);
    });

    test('resetTimeEvent()', () => {
        jest.advanceTimersByTime(500);
        expect(getTimeForEvent()).toBe(500);

        resetTimeEvent();
        expect(getTimeForEvent()).toBe(0);

        jest.advanceTimersByTime(5);
        expect(getTimeForEvent()).toBe(5);
    });
});

test('hexToRgb', () => {
    const {hexToRgb} = require("../src/helpers");

    expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
    expect(hexToRgb('#00ff00')).toEqual([0, 255, 0]);
    expect(hexToRgb('#0000ff')).toEqual([0, 0, 255]);
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
    expect(hexToRgb('')).toEqual([0, 0, 0]);
});