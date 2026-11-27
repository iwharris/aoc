import { DirectedGraph } from '../../src/util/graph';

describe('DirectedGraph', () => {
    const build = () => {
        const graph = new DirectedGraph<string, number, number>();
        graph.addVertex('a', 1);
        graph.addVertex('b', 2);
        graph.addEdge('a', 'b', 10);
        graph.addEdge('b', 'a', 20);
        return graph;
    };

    it('should store vertex values, keeping the first value added', () => {
        const graph = build();
        graph.addVertex('a', 99);

        expect(graph.getVertexValue('a')).toBe(1);
        expect(graph.getVertexValue('z')).toBeUndefined();
    });

    it('should store directed edges', () => {
        const graph = build();
        graph.addEdge('a', 'c', 30);

        expect(graph.getEdgeValue('a', 'b')).toBe(10);
        expect(graph.getEdgeValue('b', 'a')).toBe(20);
        expect(graph.isAdjacent('a', 'c')).toBe(true);
        expect(graph.isAdjacent('c', 'a')).toBe(false);
        expect(graph.getNeighbors('a')).toEqual(['b', 'c']);
        expect(graph.getNeighbors('z')).toEqual([]);
    });

    it('should remove a single edge', () => {
        const graph = build();
        graph.removeEdge('a', 'b');

        expect(graph.isAdjacent('a', 'b')).toBe(false);
        expect(graph.isAdjacent('b', 'a')).toBe(true);
    });

    it("should remove a vertex's edges along with the vertex", () => {
        const graph = build();
        graph.removeVertex('b');

        expect(graph.getVertexValue('b')).toBeUndefined();
        expect(graph.isAdjacent('a', 'b')).toBe(false);
        expect(graph.getNeighbors('a')).toEqual([]);
        expect(graph.getNeighbors('b')).toEqual([]);
    });
});
