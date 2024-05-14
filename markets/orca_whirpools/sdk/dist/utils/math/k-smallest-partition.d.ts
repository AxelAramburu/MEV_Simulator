/**
 * Implementation of Floyd-Rivest selection
 * https://en.wikipedia.org/wiki/Floyd%E2%80%93Rivest_algorithm
 *
 * Performs an in place partition of an array of items, such that
 * indices [0, k) contain the k smallest elements and all indices
 * [k, array.length) are larger than all elements in [0, k)
 *
 * @param array
 * @param k
 * @param left
 * @param right
 * @param compare
 */
export declare function kSmallestPartition<T>(array: T[], k: number, left?: number, right?: number, compare?: (a: T, b: T) => number): void;
