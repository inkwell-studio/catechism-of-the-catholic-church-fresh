export type MinMax = { min: number; max: number };

/**
 * @param probability a number in the range [0, 1)
 * @returns true according to the given probability
 */
export function chance(probability: number): boolean {
    return Math.random() < probability;
}

export function indexLimits(array: Array<unknown>): MinMax {
    return {
        min: 0,
        max: array.length - 1,
    };
}

/**
 * @returns an integer within the given limit, inclusively
 */
export function randomInt(limits: MinMax): number {
    const min = Math.ceil(limits.min);
    const max = Math.floor(limits.max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomBoolean(): boolean {
    return Math.random() >= 0.5;
}

/**
 * @returns an array of integers whose length is between the given limits (inclusively)
 */
export function intArrayOfRandomLength(limits: MinMax): Array<number> {
    const length = randomInt(limits);

    const array = [];
    for (let i = 1; i <= length; i++) {
        array.push(i);
    }

    return array;
}
