import { describe, it, expect, vi, Mock } from 'vitest';
import { getTestFileName } from './path';

describe('getTestFileName', () => {
    it('should replace .ts with .spec.ts', () => {
        const input = 'example.ts';
        const expected = 'example.spec.ts';
        const result = getTestFileName(input);
        expect(result).toEqual(expected);
    });

    it('should not modify filenames without .ts extension', () => {
        const input = 'example.js';
        const expected = 'example.js';
        const result = getTestFileName(input);
        expect(result).toEqual(expected);
    });

    it('should handle filenames with multiple dots', () => {
        const input = 'my.file.ts';
        const expected = 'my.file.spec.ts';
        const result = getTestFileName(input);
        expect(result).toEqual(expected);
    });

    it('should return an empty string when provided with an empty string', () => {
        const input = '';
        const expected = '';
        const result = getTestFileName(input);
        expect(result).toEqual(expected);
    });
});