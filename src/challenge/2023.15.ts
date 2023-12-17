import { BaseSolution } from '../solution';
import { Input } from '../types';
import { sum } from '../util/fp';

export class Solution extends BaseSolution {
    preserveEmptyLines = true;

    description = `

    `;

    public solvePart1(lines: Input): string {
        const tokens = lines[0].split(',');
        return sum(tokens.map(hash)).toString();
    }

    public solvePart2(lines: Input): string {
        const map = new HashMap();
        const tokens = lines[0].split(',');
        tokens.forEach((token) => {
            if (token.includes('=')) {
                // set operation
                const [label, focalLength] = token.split('=');
                map.set({ label, focalLength: parseInt(focalLength) });
            } else if (token.includes('-')) {
                const label = token.substring(0, token.length - 1);
                map.delete(label);
            }
        });

        // console.log(map.toString());
        return map.getFocusingPower().toString();
    }
}

const hash = (str: string): number =>
    [...str].reduce((acc, cur) => ((acc + cur.charCodeAt(0)) * 17) % 256, 0);

type Lens = {
    label: string;
    focalLength: number;
};

class HashMap {
    private buckets: Array<Lens[]>;

    public constructor(size?: number) {
        this.buckets = new Array(size ?? 256);
        for (let i = 0; i < this.buckets.length; i++) {
            this.buckets[i] = [];
        }
    }

    private getBucket(label: string): Lens[] {
        return this.buckets[hash(label)];
    }

    public set(lens: Lens): void {
        const bucket = this.getBucket(lens.label);

        const existingIndex = bucket.findIndex((l) => l.label === lens.label);
        if (existingIndex >= 0) {
            bucket[existingIndex].focalLength = lens.focalLength;
        } else {
            bucket.push(lens);
        }
    }

    public delete(label: string): void {
        const bucket = this.getBucket(label);
        // console.log(label, bucket);

        const existingIndex = bucket.findIndex((l) => l.label === label);
        if (existingIndex >= 0) {
            bucket.splice(existingIndex, 1);
        }
    }

    public toString(): string {
        return this.buckets
            .map((bucket, idx) =>
                bucket.length
                    ? `Box ${idx}: ${bucket.map((l) => `[${l.label} ${l.focalLength}]`).join(' ')}`
                    : null
            )
            .filter(Boolean)
            .join('\n');
    }

    public getFocusingPower(): number {
        return sum(
            this.buckets.map((bucket, i) =>
                sum(bucket.map((lens, j) => (i + 1) * (j + 1) * lens.focalLength))
            )
        );
    }
}
