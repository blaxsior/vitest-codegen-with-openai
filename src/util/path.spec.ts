import { describe, it, expect, vi, Mock } from 'vitest';
import {getTestFileName} from './path';

describe('getTestFileName', () => {
    it('should replace .ts with .spec.ts', () => {
        const filename = 'example.ts';
        const result = getTestFileName(filename);
        expect(result).toBe('example.spec.ts');
    });

    it('should not modify filenames without .ts extension', () => {
        const filename = 'example.js';
        const result = getTestFileName(filename);
        expect(result).toBe('example.js');
    });

    it('should handle filenames with multiple dots', () => {
        const filename = 'example.test.ts';
        const result = getTestFileName(filename);
        expect(result).toBe('example.test.spec.ts');
    });

    it('should handle empty strings gracefully', () => {
        const filename = '';
        const result = getTestFileName(filename);
        expect(result).toBe('');
    });
});