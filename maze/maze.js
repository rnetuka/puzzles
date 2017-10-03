/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 16.3.15
 * Time: 8:32
 * To change this template use File | Settings | File Templates.
 */

var pathfinding = pathfinding || {};

pathfinding.DIRECTIONS = {
    square: [[-1, 0], [0, 1], [1, 0], [0, -1]],
    hex: [[-1, 0], [0, 1], [1, 1], [1, 0], [0, -1], [-1, -1]],
    node: [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
};

pathfinding.Maze = function(tiles, tileType, start, exit) {

    var width = (tiles.length > 0) ? tiles[0].length : 0;

    var height = tiles.length;


    this.getWidth = function() {
        return width;
    };

    this.getHeight = function() {
        return height;
    };

    this.getTile = function(row, column) {
        return tiles[row][column];
    };

    this.getStart = function() {
        return start;
    };

    this.getExit = function() {
        return exit;
    };

    this.getDirections = function() {
        return pathfinding.DIRECTIONS[tileType];
    };

    this.getDirectionIndex = function(direction) {
        var directions = this.getDirections();
        for (var i = 0; i < directions.length; i++) {
            if (direction[0] == directions[i][0] && direction[1] == directions[i][1]) {
                return i;
            }
        }
        throw 'Cannot find direction index for ' + direction;
    };

};

pathfinding.Maze.TILE_EMPTY = '.';
pathfinding.Maze.TILE_WALL = '#';
pathfinding.Maze.TILE_START = 'A';
pathfinding.Maze.TILE_EXIT = 'B';

pathfinding.Maze.TERRAIN_DESERT = 'D';
pathfinding.Maze.TERRAIN_GRASS = 'G';
pathfinding.Maze.TERRAIN_FOREST = 'F';
pathfinding.Maze.TERRAIN_HILLS = 'H';
pathfinding.Maze.TERRAIN_MOUNTAINS = 'M';
pathfinding.Maze.TERRAIN_WATER = 'W';

pathfinding.MazeTile = function(type, borders) {
    borders = borders || [];

    this.getType = function() {
        return type;
    };

    this.isEmpty = function() {
        return type ==  pathfinding.Maze.TILE_EMPTY;
    };

    this.isBlocked = function(directionIndex) {
        return (type == pathfinding.Maze.TILE_WALL) || !!borders[directionIndex];
    };

    this.getBorder = function(directionIndex) {
        return borders[directionIndex];
    };

};

pathfinding.MapTile = function(terrain) {

    this.getTerrain = function() {
        return terrain;
    };

};

pathfinding.Coordinates = function(row, column) {

    this.getRow = function() {
        return row;
    };

    this.getColumn = function() {
        return column;
    };

    this.calculateDirection = function(destination) {
        return [destination.getRow() - row, destination.getColumn() - column];
    };

};



pathfinding.PathfindingPuzzle = function() {

    this.getMaxRowIndex = function() {
        return 0;
    };

    this.getMaxColumnIndex = function() {
        return 0;
    };

    this.getStartCoordinates = function() {
        return new pathfinding.Coordinates(0, 0);
    };

    this.getDestinationCoordinates = function() {
        return new pathfinding.Coordinates(0, 0);
    };

    this.getDirections = function() {
        return [];
    };

    this.isTilePassable = function(source, destination) {
        return true;
    };

    this.getMoveCost = function(source, destination) {
        return 1;
    };

    this.createMove = function(destination, direction) {
        return {row: destination.getRow(), column: destination.getColumn()};
    };

    this.createNodeId = function(coordinates) {
        return {row: coordinates.row, column: coordinates.column};
    };

    this.getPossibleMoves = function(row, column) {

        var isInBounds = (function(puzzle) {
            return function(row, column) {
                return row >= 0
                    && row <= puzzle.getMaxRowIndex()
                    && column >= 0
                    && column <= puzzle.getMaxColumnIndex();
            };
        })(this);

        var directions = this.getDirections();
        var moves = [];

        for (var i = 0; i < directions.length; i++) {
            var direction = directions[i];
            var destinationRow = row + direction[0];
            var destinationColumn = column + direction[1];

            if (isInBounds(destinationRow, destinationColumn)) {

                var source = new pathfinding.Coordinates(row, column);
                var destination = new pathfinding.Coordinates(destinationRow, destinationColumn);

                if (this.isTilePassable(source, destination)) {
                    moves.push(this.createMove(destination, direction));
                }
            }
        }
        return moves;
    };

    this.createSolution = function() {

        var createGraph = (function(puzzle) {
            return function() {
                var graph = new pathfinding.Graph();

                var queue = [startCoordinates];
                graph.addNode(startCoordinates);

                while (queue.length > 0) {
                    var coordinates = queue.shift();
                    puzzle.getPossibleMoves(coordinates.row, coordinates.column).forEach(function(destination) {

                        var sourceNode = puzzle.createNodeId(coordinates);
                        var destinationNode = puzzle.createNodeId(destination);

                        if (! graph.containsNode(destinationNode)) {
                            graph.addNode(destinationNode);
                            queue.push(destination);
                        }
                        graph.addEdge(sourceNode, destinationNode, puzzle.getMoveCost(coordinates, destination));
                    });
                }
                return graph;
            };
        })(this);

        var startCoordinates = this.getStartCoordinates();
        var exitCoordinates = this.getDestinationCoordinates();
        var graph = createGraph();
        return graph.findShortestPath(startCoordinates, exitCoordinates);
    };

};

pathfinding.MazePuzzle = function(maze, configuration) {

    var moveActionCost = getConfigValue('moveCost', 1);

    var robot = getConfigValue('robot', false);

    var turnActionCost = getConfigValue('turnCost', 1);

    var dynamite = getConfigValue('dynamite', false);

    var dynamiteActionCost = getConfigValue('dynamiteCost', maze.getWidth() * maze.getHeight());


    function isUsingDynamite() {
        return dynamite;
    }

    function getConfigValue(propertyName, defaultValue) {
        return (typeof configuration === 'undefined' || typeof configuration[propertyName] === 'undefined') ? defaultValue : configuration[propertyName];
    }

    this.isTilePassable = function(source, destination) {
        var sourceTile = maze.getTile(source.getRow(), source.getColumn());
        var destinationTile = maze.getTile(destination.getRow(), destination.getColumn());
        var direction = source.calculateDirection(destination);

        if (destinationTile.isBlocked()) {
            return isUsingDynamite();
        } else {
            return sourceTile.isBlocked(maze.getDirectionIndex(direction)) ? isUsingDynamite() : true;
        }
    };

    this.getMoveCost = function(source, destination) {
        var tile = maze.getTile(destination.row, destination.column);
        var cost = moveActionCost;
        if (dynamite && tile.getType() == pathfinding.Maze.TILE_WALL) {
            cost += dynamiteActionCost;
        }
        if (robot) {
            cost += turnActionCost * ((source.facingDirection + destination.facingDirection) % 2);
        }
        return cost;
    };

    this.getMaxRowIndex = function() {
        return maze.getHeight() - 1;
    };

    this.getMaxColumnIndex = function() {
        return maze.getWidth() - 1;
    };

    this.getStartCoordinates = function() {
        return maze.getStart();
    };

    this.getDestinationCoordinates = function() {
        return maze.getExit();
    };

    this.getDirections = function() {
        return maze.getDirections();
    };

    this.createMove = function(destination, direction) {
        var move = {row: destination.getRow(), column: destination.getColumn()};
        if (robot) {
            move.facingDirection = direction;
        }
        return move;
    };

    this.createNodeId = function(move) {
        var startRow = maze.getStart().row;
        var startColumn = maze.getStart().column;
        var exitRow = maze.getExit().row;
        var exitColumn = maze.getExit().column;

        function isStart() {
            return (move.row == startRow) && (move.column == startColumn);
        }

        function isExit() {
            return (move.row == exitRow) && (move.column == exitColumn);
        }

        var id = {row: move.row, column: move.column};
        if (robot) {
            if (! (isStart() || isExit())) {
                id.facingDirection = move.facingDirection;
            }
        }
        return id;
    };

};

pathfinding.MazePuzzle.prototype = new pathfinding.PathfindingPuzzle();

pathfinding.MapPuzzle = function(map) {

    this.isTilePassable = function(source, destination) {
        return true;
    };

    this.getMoveCost = function(source, destination) {
        var tile = map.getTile(destination.row, destination.column);
        var cost = 0;
        switch (tile.getTerrain()) {
            case pathfinding.Maze.TERRAIN_GRASS:
                cost += 1;
                break;
            case pathfinding.Maze.TERRAIN_FOREST:
                cost += 5;
                break;
            case pathfinding.Maze.TERRAIN_DESERT:
                cost += 15;
                break;
        }
        return cost;
    };

    this.getMaxRowIndex = function() {
        return map.getHeight() - 1;
    };

    this.getMaxColumnIndex = function() {
        return map.getWidth() - 1;
    };

    this.getStartCoordinates = function() {
        return map.getStart();
    };

    this.getDestinationCoordinates = function() {
        return map.getExit();
    };

    this.getDirections = function() {
        return map.getDirections();
    };

};

pathfinding.MapPuzzle.prototype = new pathfinding.PathfindingPuzzle();