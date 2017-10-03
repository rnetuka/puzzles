/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 16.3.15
 * Time: 16:09
 * To change this template use File | Settings | File Templates.
 */

QUnit.module('Directed graph', {
    beforeEach: function() {
        this.graph = new pathfinding.Graph();
        this.graph.addNode(1);
        this.graph.addNode(2);
        this.graph.addNode(3);
        this.graph.addNode(4);
        this.graph.addNode(5);

        this.graph.addEdge(1, 2, 10);
        this.graph.addEdge(2, 3, 15);
        this.graph.addEdge(1, 3, 30);
        this.graph.addEdge(4, 5, 1);
    },
    afterEach: function() {
        this.graph = null;
    }
});

QUnit.test('Contains node', function(assert) {
    assert.ok(this.graph.containsNode(1));
});

QUnit.test('Doesn\' contain node', function(assert) {
    assert.ok(! this.graph.containsNode(6));
});

QUnit.test('Contains edge', function(assert) {
    assert.ok(this.graph.containsEdge(1, 2));
});

QUnit.test('Doesn\'t contain edge', function(assert) {
    assert.ok(! this.graph.containsEdge(1, 4));
});

QUnit.test('Cannot add egde for inexisting nodes', function(assert) {
    assert.throws(function() {this.graph.addEdge(1, 6)});
});

QUnit.test('Find shortest path', function(assert) {
    var source = 1;
    var destination = 3;
    var path = this.graph.findShortestPath(source, destination);
    assert.deepEqual(path, [1, 2, 3]);
});

QUnit.test('Unable to find path for unreachable destination', function(assert) {
    var source = 1;
    var destination = 5;
    var path = this.graph.findShortestPath(source, destination);
    assert.equal(path.length, 0);
});

QUnit.test('Unable to find path due to edge directions', function(assert) {
    var source = 2;
    var destination = 1;
    var path = this.graph.findShortestPath(source, destination);
    assert.equal(path.length, 0);
});

QUnit.test('Unable to find path for inexisting nodes', function(assert) {
    var source = 1;
    var destination = 6;
    assert.throws(function() {this.graph.findShortestPath(source, destination)});
});



QUnit.module('Undirected graph', {
    beforeEach: function() {
        this.graph = new pathfinding.Graph(false);
        this.graph.addNode(1);
        this.graph.addNode(2);
        this.graph.addEdge(1, 2);
    }
});

QUnit.test('Find shortest path', function(assert) {
    var source = 2;
    var destination = 1;
    var path = this.graph.findShortestPath(source, destination);
    assert.deepEqual(path, [2, 1]);
});



QUnit.module('Graph with objects as node ids', {
    beforeEach: function() {
        this.graph = new pathfinding.Graph();
        this.graph.addNode({value: 1});
    }
});

QUnit.test('Contains node', function(assert) {
    assert.ok(this.graph.containsNode({value: 1}));
});

QUnit.test('Doesn\' contain node', function(assert) {
    assert.ok(! this.graph.containsNode({value: 2}));
});