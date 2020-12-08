type NodeKey = string | number | symbol;

export interface Vertex<TKey extends NodeKey, TValue = any> {
    key: TKey;
    value?: TValue;
}

export interface Edge<TKey extends NodeKey, TValue = any> {
    points: [TKey, TKey];
    value?: TValue;
}

export interface DirectedEdge<TKey = NodeKey> extends Edge {
    from: TKey;
    to: TKey;
}

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
    implements Graph<TKey, TVertexValue, TEdgeValue> {
    protected readonly vertices: Record<TKey, TVertexValue>;
    protected readonly edges: Record<TKey, Record<TKey, TEdgeValue>>;

    constructor() {
        this.vertices = {} as Record<TKey, TVertexValue>;
        this.edges = {} as Record<TKey, Record<TKey, TEdgeValue>>;
    }

    addVertex(key: TKey, value: TVertexValue): void {
        if (!this.vertices[key]) {
            this.vertices[key] = value;
        }
    }

    getVertexValue(key: TKey): TVertexValue | undefined {
        return this.vertices[key];
    }

    removeVertex(key: TKey): void {
        delete this.vertices[key];
    }

    addEdge(from: TKey, to: TKey, value: TEdgeValue): void {
        if (!this.edges[from]) this.edges[from] = {} as Record<TKey, TEdgeValue>;
        if (!this.edges[from][to]) this.edges[from][to] = value;
    }

    getEdgeValue(from: TKey, to: TKey): TEdgeValue | undefined {
        return this.edges[from]?.[to];
    }

    removeEdge(from: TKey, to: TKey): void {}

    isAdjacent(from: TKey, to: TKey): boolean {
        return !!this.edges[from]?.[to];
    }

    getNeighbors(key: TKey): TKey[] {}
}
