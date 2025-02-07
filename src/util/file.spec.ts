import { describe, it, expect, vi, Mock } from 'vitest';
import { getFilenamesFromRoot } from './file';
import { stat, readdir } from 'fs/promises';
import path from 'path';

vi.mock('fs/promises', () => ({
    stat: vi.fn(),
    readdir: vi.fn(),
}));

describe('getFilenamesFromRoot', () => {
    it('should return a single file path if the root is a file', async () => {
        (stat as Mock).mockResolvedValueOnce({ isFile: () => true });
        const result = await getFilenamesFromRoot('some/file.txt');
        expect(result).toEqual([path.resolve('some/file.txt')]);
    });

    it('should return an empty array if the root is not a file or directory', async () => {
        (stat as Mock).mockResolvedValueOnce({ isFile: () => false, isDirectory: () => false });
        const result = await getFilenamesFromRoot('some/invalid-path');
        expect(result).toEqual([]);
    });

    it('should return file paths from a directory', async () => {
        (stat as Mock).mockResolvedValueOnce({ isFile: () => false, isDirectory: () => true });
        (readdir as Mock).mockResolvedValueOnce([
            { name: 'file1.txt', isFile: () => true, parentPath: 'some/directory' },
            { name: 'file2.txt', isFile: () => true, parentPath: 'some/directory' },
            { name: 'dir1', isFile: () => false, parentPath: 'some/directory' }
        ]);
        const result = await getFilenamesFromRoot('some/directory');
        expect(result).toEqual([
            path.resolve('some/directory/file1.txt'), 
            path.resolve('some/directory/file2.txt')
        ]);
    });

    it('should not include directories in the result', async () => {
        (stat as Mock).mockResolvedValueOnce({ isFile: () => false, isDirectory: () => true });
        (readdir as Mock).mockResolvedValueOnce([
            { name: 'file1.txt', isFile: () => true, parentPath: 'some/dir' },
            { name: 'dir1', isFile: () => false, parentPath: 'some/dir' }
        ]);
        const result = await getFilenamesFromRoot('some/dir');
        expect(result).toEqual([path.resolve('some/dir/file1.txt')]);
    });
});