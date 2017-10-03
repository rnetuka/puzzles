/*
 *
 *
 * Created on 9 Mar 2015
 *
 * Author: Radovan Netuka.
 */

var pathfinding = pathfinding || {};

/**
 * Creates a new graph. The graph consists of nodes and edges, which one can add by {@link addNode(id)} and
 * {@link addEdge(source, destination, length)} methods.
 *
 * <p>
 * Each node has an <em>id</em> which must be a unique identifier. The client will interact with the graph only
 * through these ids, not the nodes themselves. If an object is used as id, it will be compared with deep equals method,
 * so <code>{x: 1, y: 2}</code> will be equal to <code>{y: 2, x: 1}</code>, <code>[1, 2, 3]</code> will be equal to
 * <code>[1,2,3]</code> etc.
 * </p>
 *
 * <p>
 * The graph itself is directed by default which means adding the edge from node <em>A</em> to node <em>B</em>
 * creates only one-directional edge. To create bidirectional edges, either call <code>addEdge(B, A)</code> in addition,
 * or set the graph as undirected (in which case all edges will be bidirectional).
 * </p>
 *
 * @param   {boolean} [directed=true]
 *          flag if the graph is directed or undirected
 *
 * @constructor
 */
pathfinding.Graph = function(directed) {

    directed = (typeof directed === 'undefined') ? true : directed;

    var nodes = [];
    var edges = [];

    /**
     * Creates a new node with assigned id.
     *
     * @param   {object} id
     *          node id
     *
     * @constructor
     */
    function Node(id) {

        this.getId = function() {
            return id;
        };

    }

    /**
     * Creates a new edge between two nodes.
     *
     * @param   {Node} source
     *          source node
     *
     * @param   {Node} destination
     *          destination node
     *
     * @param   {number} [length=1]
     *          edge length
     *
     * @constructor
     */
    function Edge(source, destination, length) {
        length = length || 1;

        this.getSource = function() {
            return source;
        };

        this.getDestination = function() {
            return destination;
        };

        this.getLength = function() {
            return length;
        };

    }

    /**
     * Gets node with given id. If no such node exists <code>null</code> is returned.
     *
     * @param id
     *
     * @returns {Node} node with given id
     */
    function getNode(id) {

        function deepEqual(x, y) {
            if ((typeof x == 'object' && !!x) && (typeof y == 'object' && !!y)) {
                if (x.equals) {
                    return x.equals(y);
                }
                if (Object.keys(x).length != Object.keys(y).length) {
                    return false;
                }
                for (var property in x) {
                    if (y.hasOwnProperty(property)) {
                        if (! deepEqual(x[property], y[property])) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                return true;
            } else {
                return x === y;
            }
        }

        var compareFunction =  (id.equal ? function(first, second) {return first.equal(second);} : deepEqual);

        for (var i = 0; i < nodes.length; i++) {
            if (compareFunction(id, nodes[i].getId())) {
                return nodes[i];
            }
        }
        return null;
    }

    /**
     * Gets all edges leading from specified node. If no edges leads from the node, an empty array is returned.
     *
     * @param   {Node} source
     *          source node
     *
     * @returns {Array} an array of edges ({@link Edge} objects)
     */
    function getEdges(source) {
        var result = [];
        edges.forEach(function(edge) {
            if (source == edge.getSource()) {
                result.push(edge);
            }
        });
        return result;
    }

    function getEdge(source, destination) {
        for (var i = 0; i < edges.length; i++) {
            var edge = edges[i];
            if ((source == edge.getSource()) && (destination == edge.getDestination())) {
                return edge;
            }
        }
        return null;
    }

    function isUndirected() {
        return !directed;
    }

    /**
     * Checks if this graph contains specified node.
     *
     * @param   {object} id
     *          node id
     *
     * @returns {boolean} <code>true</code> if the graph contains the node, <code>false</code> otherwise
     */
    this.containsNode = function(id) {
        return !!getNode(id);
    };

    /**
     * Adds a node to the graph. Duplicate node entries are skipped.
     *
     * @param   {object} id
      *          node id
     */
    this.addNode = function(id) {
        if (! this.containsNode(id)) {
            nodes.push(new Node(id));
        }
    };

    this.containsEdge = function(sourceId, destinationId) {
        var source = getNode(sourceId);
        var destination = getNode(destinationId);

        if (!source) {
            throw 'Source node is not a part of this graph';
        }
        if (!destination) {
            throw 'Destination node is not a part of this graph';
        }
        return !!getEdge(source, destination);
    };

    /**
     * Adds an edge from one node to another node.
     *
     * @param   {object} sourceId
     *          source node id
     *
     * @param   {object} destinationId
     *          destination node id
     *
     * @param   {number} [length=1]
     *          edge length
     */
    this.addEdge = function(sourceId, destinationId, length) {
        length = length || 1;
        if (! this.containsEdge(sourceId, destinationId)) {
            var source = getNode(sourceId);
            var destination = getNode(destinationId);
            edges.push(new Edge(source, destination, length));
            if (isUndirected()) {
                edges.push(new Edge(destination, source, length));
            }
        }
    };

    this.findShortestPath = function(sourceId, destinationId) {

        function setUp() {
            nodes.forEach(function(node) {
                node.path = {distance: 0, visited: false};
            });
        }

        function cleanUp() {
            nodes.forEach(function(node) {
                delete node.path;
                delete node.visited;
            });
        }

        function createPath() {
            var node = destination;
            var path = [];
            while (node != source) {
                if (node) {
                    path.push(node.getId());
                    node = node.path.parent;
                } else {
                    return [];
                }
            }
            path.push(source.getId());
            path.reverse();
            return path;
        }

        function visitNode(node, distance, parent) {
            node.path.distance = distance;
            node.path.parent = parent;
        }

        function getMinimalDistanceNode(nodes) {
            var minDistance = nodes[0].path.distance;
            var node = nodes[0];
            for (var i = 1; i < nodes.length; i++) {
                if (nodes[i].path.distance < minDistance) {
                    minDistance = nodes[i].path.distance;
                    node = nodes[i];
                }
            }
            return node;
        }

        setUp();
        try {
            var source = getNode(sourceId);
            var destination = getNode(destinationId);

            if (!source) {
                throw 'Source node is not a part of this graph';
            }
            if (!destination) {
                throw 'Destination node is not a part of this graph';
            }

            var queue = [source];

            while (queue.length > 0) {
                var node = getMinimalDistanceNode(queue);
                node.visited = true;
                queue.splice(queue.indexOf(node), 1);

                getEdges(node).forEach(function(edge) {
                    var nextNode = edge.getDestination();

                    if (!nextNode.visited) {
                        var distance = node.path.distance + edge.getLength();

                        if (nextNode.path.distance == 0 || distance < nextNode.path.distance) {
                            visitNode(nextNode, distance, node);
                            queue.push(nextNode);
                        }
                    }
                });
            }
            return createPath();
        } finally {
            cleanUp();
        }
    }

};


pathfinding.DirectedGraph = function() {
	return pathfinding.Graph(true);
};

pathfinding.UndirectedGraph = function() {
    return pathfinding.Graph(false);
};
