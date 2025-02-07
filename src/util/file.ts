import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';

export async function getFilenamesFromRoot(root: string): Promise<string[]> {
    root = resolve(root);
    const dirs: string[] = [];

    const rootCheck = await stat(root);
    if(rootCheck.isFile()) return [root];
    // if(rootCheck.isSymbolicLink()) {
    //     const real_root = await realpath(root);
    //     return await getFilenamesFromRoot(real_root);
    // }
    if(!rootCheck.isDirectory()) return [];
    
    const target = await readdir(root, { recursive: true, withFileTypes: true });
    target.forEach((it) => {
        if (it.isFile()) {
            dirs.push(resolve(it.parentPath, it.name));
        }
    });

    return dirs;
}

