import assert from 'assert';
import { BaseSolution } from '../solution';
import { Input } from '../types';
import { Grid } from '../util/grid';
import { Point } from '../util/point';

export class Solution extends BaseSolution {
    description = `
    --- Day 12: Hill Climbing Algorithm ---
    You try contacting the Elves using your handheld device, but the river you're following must be too low to get a decent signal.
    
    You ask the device for a heightmap of the surrounding area (your puzzle input). The heightmap shows the local area from above broken into a grid; the elevation of each square of the grid is given by a single lowercase letter, where a is the lowest elevation, b is the next-lowest, and so on up to the highest elevation, z.
    
    Also included on the heightmap are marks for your current position (S) and the location that should get the best signal (E). Your current position (S) has elevation a, and the location that should get the best signal (E) has elevation z.
    
    You'd like to reach E, but to save energy, you should do it in as few steps as possible. During each step, you can move exactly one square up, down, left, or right. To avoid needing to get out your climbing gear, the elevation of the destination square can be at most one higher than the elevation of your current square; that is, if your current elevation is m, you could step to elevation n, but not to elevation o. (This also means that the elevation of the destination square can be much lower than the elevation of your current square.)
    
    For example:
    
    Sabqponm
    abcryxxl
    accszExk
    acctuvwj
    abdefghi
    Here, you start in the top-left corner; your goal is near the middle. You could start by moving down or right, but eventually you'll need to head toward the e at the bottom. From there, you can spiral around to the goal:
    
    v..v<<<<
    >v.vv<<^
    .>vv>E^^
    ..v>>>^^
    ..>>>>>^
    In the above diagram, the symbols indicate whether the path exits each square moving up (^), down (v), left (<), or right (>). The location that should get the best signal is still E, and . marks unvisited squares.
    
    This path reaches the goal in 31 steps, the fewest possible.
    
    What is the fewest steps required to move from your current position to the location that should get the best signal?
    
    To
    `;

    public solvePart1(lines: Input): string {
        const [grid, start, end] = parseElevationGrid(lines);
        const graph = computeGraph(grid, (e1, e2) => e2 - e1 <= 1);

        const [, distance] = dijkstra(graph, start, end);
        // console.log(path, distance);

        return distance.toString();
    }

    public solvePart2(lines: Input): string {
        const [grid, , end] = parseElevationGrid(lines);
        const graph = computeGraph(grid, (e1, e2) => e1 - e2 <= 1);
        const starts = grid.grid
            .map((val, idx) => (val === 0 ? idx.toString() : null))
            .filter(Boolean) as NodeID[];

        const [, distance] = dijkstra(graph, end, ...starts);

        return distance.toString();
    }
}

type NodeID = string; // using the grid's array index of each node as its id
type Adjacency = Record<NodeID, number>; // a mapping of adjacent nodes to their weight
type Graph = Record<NodeID, Adjacency>; // A directed graph where adjacent nodes are within 1 elevation (could use an array instead)

const parseElevationGrid = (lines: Input): [Grid, NodeID, NodeID] => {
    const letterToElevation = (letter: string) => letter.charCodeAt(0) - 97;

    let start: Point | null = null;
    let end: Point | null = null;

    // Get a grid of elevations and find the start and end nodes
    const grid = Grid.loadFromStrings(lines).map<number>((cellValue: string, point: Point) => {
        // cellValue is a char between a-z, or E or S
        if (cellValue === 'E') {
            end = point;
            cellValue = 'z';
        } else if (cellValue === 'S') {
            start = point;
            cellValue = 'a';
        }

        return letterToElevation(cellValue);
    });

    assert(start && end);

    return [grid, grid.getIndex(start).toString(), grid.getIndex(end).toString()];
};

const computeGraph = (
    grid: Grid<number>,
    isAdjacentCallback: (thisElevation: number, thatElevation: number) => boolean
): Graph => {
    const g: Graph = {};

    grid.forEach((elevation, idx) => {
        const a: Adjacency = {};
        const nodePoint = grid.getPointFromIndex(idx);
        for (const adjacentPoint of grid.adjacentPointGenerator(nodePoint, {
            orthogonalOnly: true,
        })) {
            const adjacentElevation = grid.getValue(adjacentPoint);
            if (isAdjacentCallback(elevation, adjacentElevation)) {
                // then build an edge to the adjacent point
                const adjacentIndex = grid.getIndex(adjacentPoint);
                a[adjacentIndex] = 1; // just use a constant weight of 1 for every edge
            }
        }

        g[idx] = a;
    }, null);

    return g;
};

const dijkstra = (graph: Graph, start: NodeID, ...ends: NodeID[]): [NodeID[], number] => {
    const dist: Record<NodeID, number> = {};
    const prev: Record<NodeID, NodeID | null> = {};
    const Q = new Set<NodeID>();

    for (const v in graph) {
        dist[v] = Infinity;
        prev[v] = null;
        Q.add(v);
    }
    dist[start] = 0;

    let foundEnd: NodeID | null = null;
    while (Q.size) {
        const u = [...Q].reduce<NodeID | null>((min, cur) => {
            return !min || dist[cur] < dist[min] ? cur : min;
        }, null);
        if (!u) {
            throw new Error('Got a null u');
        }
        if (ends.includes(u)) {
            foundEnd = u;
            break; // found the destination
        }

        Q.delete(u);

        Object.keys(graph[u])
            .filter((neighbor) => Q.has(neighbor))
            .forEach((v) => {
                const alt = dist[u] + graph[u][v];
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                }
            });
    }

    // console.log(dist);
    const path: NodeID[] = [];
    let u = foundEnd as NodeID;
    if (prev[u] || u === start) {
        while (u) {
            path.unshift(u);
            u = prev[u] as NodeID;
        }
    }

    // console.log(`path is`, path, 'dist is', dist[end]);

    return [path, dist[foundEnd as NodeID]];
};
