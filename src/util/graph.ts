type NodeKey = string | number | symbol;

export interface Graph<TKey extends NodeKey, TVertexValue = any, TEdgeValue = any> {
    // readonly vertices: Record<TKey, Vertex<TKey, TVertexValue>>;
    // readonly edges: Record<TKey, Edge<TKey, TEdgeValue>>;

    addVertex: (key: TKey, value: TVertexValue) => void;

    getVertexValue: (key: TKey) => TVertexValue | undefined;

    removeVertex: (key: TKey) => void;

    /**
     * Add an edge connecting the 'from' vertex to the 'to' vertex.
     */
    addEdge: (from: TKey, to: TKey, value: TEdgeValue) => void;

    getEdgeValue: (from: TKey, to: TKey) => TEdgeValue | undefined;

    removeEdge: (from: TKey, to: TKey) => void;

    /**
     * Return true if the 'from' vertex is connected to the 'to' vertex via an edge.
     */
    isAdjacent: (from: TKey, to: TKey) => boolean;

    getNeighbors: (key: TKey) => TKey[];
}

export class DirectedGraph<TKey extends NodeKey, TVertexValue = any, TEdgeValue = any>
    implements Graph<TKey, TVertexValue, TEdgeValue>
{
    protected readonly vertices: Map<TKey, TVertexValue>;
    protected readonly edges: Map<TKey, Map<TKey, TEdgeValue>>;

    constructor() {
        this.vertices = new Map<TKey, TVertexValue>();
        this.edges = new Map<TKey, Map<TKey, TEdgeValue>>();
    }

    addVertex(key: TKey, value: TVertexValue): void {
        if (!this.vertices.has(key)) this.vertices.set(key, value);
    }

    getVertexValue(key: TKey): TVertexValue | undefined {
        return this.vertices.get(key);
    }

    removeVertex(key: TKey): void {
        this.vertices.delete(key);
    }

    addEdge(from: TKey, to: TKey, value: TEdgeValue): void {
        if (!this.edges.has(from)) this.edges.set(from, new Map<TKey, TEdgeValue>());
        this.edges.get(from)?.set(to, value);
    }

    getEdgeValue(from: TKey, to: TKey): TEdgeValue | undefined {
        return this.edges.get(from)?.get(to);
    }

    removeEdge(from: TKey, to: TKey): void {
        this.edges.get(from)?.delete(to);
    }

    isAdjacent(from: TKey, to: TKey): boolean {
        return !!this.edges.get(from)?.has(to);
    }

    getNeighbors(key: TKey): TKey[] {
        return Array.from(this.edges.get(key)?.keys() || []);
    }
}
