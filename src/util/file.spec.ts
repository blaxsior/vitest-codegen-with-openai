import { describe, it, expect, vi, Mock } from 'vitest';
import { getFilenamesFromRoot } from './file';
import { readdir, stat } from 'fs/promises';
import {resolve} from 'path';

vi.mock('fs/promises');

describe('getFilenamesFromRoot', () => {
    it('should return an array with the filename if the root is a file', async () => {
        const root = 'file.txt';
        (stat as Mock).mockResolvedValueOnce({
            isFile: () => true,
            isDirectory: () => false,
        });
        
        const result = await getFilenamesFromRoot(root);
        expect(result).toEqual([resolve(root)]);
    });

    it('should return an empty array if the root is not a directory', async () => {
        const root = 'not-a-directory';
        (stat as Mock).mockResolvedValueOnce({
            isFile: () => false,
            isDirectory: () => false,
        });
        
        const result = await getFilenamesFromRoot(root);
        expect(result).toEqual([]);
    });

    it('should return filenames in an array from the specified directory', async () => {
        const root = 'some-directory';
        (stat as Mock).mockResolvedValueOnce({
            isFile: () => false,
            isDirectory: () => true,
        });
        (readdir as Mock).mockResolvedValueOnce([
            { isFile: () => true, name: 'file1.txt', parentPath: root },
            { isFile: () => true, name: 'file2.txt', parentPath: root },
            { isFile: () => false, name: 'subdir', parentPath: root },
        ]);
        
        const result = await getFilenamesFromRoot(root);
        expect(result).toEqual([resolve(`${root}/file1.txt`), resolve(`${root}/file2.txt`)]);
    });

    it('should handle empty directories', async () => {
        const root = 'empty-directory';
        (stat as Mock).mockResolvedValueOnce({
            isFile: () => false,
            isDirectory: () => true,
        });
        (readdir as Mock).mockResolvedValueOnce([]);
        
        const result = await getFilenamesFromRoot(root);
        expect(result).toEqual([]);
    });
});