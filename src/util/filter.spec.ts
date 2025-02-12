import { describe, it, expect, vi, Mock } from 'vitest';
import { filterStringsByRegex } from './filter';

describe('filterStringsByRegex', () => {
    it('should return all strings when no filters are provided', () => {
        const strings = ['apple', 'banana', 'cherry'];
        const filters: string[] = [];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(strings);
    });

    it('should filter strings based on provided regex patterns', () => {
        const strings = ['apple', 'banana', 'cherry', 'blueberry'];
        const filters = ['^b', 'y$'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(['blueberry']);
    });

    it('should return an empty array if no strings match the filters', () => {
        const strings = ['apple', 'banana', 'cherry'];
        const filters = ['^z'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual([]);
    });

    it('should handle complex regex patterns', () => {
        const strings = ['apple', 'banana', '123', 'abc123', 'abc'];
        const filters = ['^a.*[0-9]$'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(['abc123']);
    });

    it('should correctly handle single character filters', () => {
        const strings = ['a', 'b', 'c', 'ab', 'bc'];
        const filters = ['a', 'b'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(['ab']);
    });
});