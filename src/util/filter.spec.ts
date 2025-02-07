import { describe, it, expect, vi, Mock } from 'vitest';
import { filterStringsByRegex } from './filter';

describe('filterStringsByRegex', () => {
    it('should return the original array when filters are empty', () => {
        const strings = ['apple', 'banana', 'cherry'];
        const filters: string[] = [];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(strings);
    });

    it('should return strings that match all provided regex patterns', () => {
        const strings = ['abc123', 'def456', 'ghi789'];
        const filters = ['^abc', '[0-9]{3}$'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(['abc123']);
    });

    it('should return an empty array if no strings match the filters', () => {
        const strings = ['apple', 'banana', 'cherry'];
        const filters = ['^z', 'y$'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual([]);
    });

    it('should handle case when some strings match and others do not', () => {
        const strings = ['Test1', 'test2', 'TEST3'];
        const filters = ['^Test', '[0-9]$'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(['Test1']);
    });

    it('should handle multiple regex patterns correctly', () => {
        const strings = ['A1', 'B2', 'C3', 'D4'];
        const filters = ['^[A-Z]', '^[A-C]'];
        const result = filterStringsByRegex(strings, filters);
        expect(result).toEqual(['A1', 'B2', 'C3']);
    });
});