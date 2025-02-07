
export function getTestFileName(filename: string) {
    return filename.replace(/\.ts$/, '.spec.ts');
}