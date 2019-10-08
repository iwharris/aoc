import fs, { PathLike } from "fs";

export function readInput(encoding: string = "utf8"): string[] {
    const data = fs.readFileSync(0, encoding); // Read data from stdin

    return data
        .split("\n") // Split data on newlines
        .map((str: string) => str.trim()) // Trim whitespace
        .filter(Boolean); // Omit empty (falsy) lines
}

export function readdirAsync(path: PathLike, options?: any) {
    return new Promise((resolve, reject) => fs.readdir(path, options, (err?, files?: string[]) => {
        if (err) reject(err);
        else resolve(files);
    }));
}