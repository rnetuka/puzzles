/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 5.3.15
 * Time: 7:20
 * To change this template use File | Settings | File Templates.
 */

function Maze(data) {

    var x = 0;

    var y = 0;

    var size = data.length;

    var history = new History();


    function History() {

        var moves = [];

        this.isUndoPossible = function() {
            return moves.length > 0;
        };

        this.isRedoPossible = function() {

        };

        this.undo = function() {
            var move = moves.pop();
            x = move.x;
            y = move.y;
        };

        this.redo = function() {

        };

        this.addMove = function(move) {
            moves.push(move);
        };

    }

    function isInBounds(x, y) {
        return (x >= 0) && (x < size) && (y >= 0) && (y < size);
    }

    function getValue(x, y) {
        return data[y][x];
    }

    this.getStart = function() {
        return {x: 0, y: 0};
    };

    this.getFinish = function() {
        return {x: size - 1, y: size - 1};
    };

    this.getX = function() {
        return x;
    };

    this.getY = function() {
        return y;
    };

    this.getTile = function() {
        return {x: x, y: y};
    };

    this.getSize = function() {
        return size;
    };

    this.getRow = function(i) {
        return data[i].slice();
    };

    this.getHistory = function() {
        return history;
    };

    this.getPossibleMoves = function(tile) {
        tile = tile || {x: x, y: y};

        var value = getValue(tile.x, tile.y);
        var moves = [];
        var directions = [{sx: -value, sy: 0}, {sx: value, sy: 0}, {sx: 0, sy: -value}, {sx: 0, sy: value}];

        if (value > 0) {
            directions.forEach(function(direction) {
                var destination = {
                    x: tile.x + direction.sx,
                    y: tile.y + direction.sy
                };
                if (isInBounds(destination.x, destination.y)) {
                    moves.push(destination);
                }
            });
        }
        return moves;
    };

    this.coordinatesEqual = function(first, second) {
        return (first.x == second.x) && (first.y == second.y);
    };

    this.isMovePossible = function(x, y) {
        var coordinates = {x: x, y: y};
        var valid = false;
        this.getPossibleMoves().forEach((function(maze) {
            return function(move) {
                if (maze.coordinatesEqual(coordinates, move)) {
                    valid = true;
                }
            };
        })(this));
        return valid;
    };

    this.move = function(destinationX, destinationY) {
        if (! this.isMovePossible(destinationX, destinationY)) {
            throw 'Invalid move';
        }
        history.addMove({x: x, y: y});
        x = destinationX;
        y = destinationY;
    };

    this.isLost = function() {
        return this.getPossibleMoves().length == 0;
    };

    this.isSolved = function() {
        var finish = this.getFinish();
        return (x == finish.x) && (y == finish.y);
    };

}

function findSolution(maze, tile) {
    tile = tile || maze.getStart();
    var graph = createGraph(maze);
    return graph.findShortestPath(tile, maze.getFinish());
}

function createGraph(maze) {
    var graph = new pathfinding.Graph(true);
    var queue = [maze.getStart()];

    graph.addNode(maze.getStart());

    while (queue.length > 0) {
        var current = queue.shift();

        maze.getPossibleMoves(current).forEach(function(destination) {
            if (! graph.containsNode(destination)) {
                graph.addNode(destination);
				queue.push(destination);
            }
            graph.addEdge(current, destination)
        });
    }
    return graph;
}

var PUZZLE1 = new Maze([
    [2, 4, 4, 3, 3],
    [2, 3, 3, 2, 3],
    [3, 2, 3, 1, 3],
    [2, 2, 3, 2, 1],
    [1, 4, 4, 4, 0]
]);
