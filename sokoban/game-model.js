/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 3.3.15
 * Time: 7:25
 * To change this template use File | Settings | File Templates.
 */

/** Sokoban game namespace */
var sokoban = sokoban || {};

/**
 * @constant
 */
sokoban.PLAYER = '@';

/**
 * @constant
 */
sokoban.CRATE = '$';

/**
 * @constant
 */
sokoban.STORAGE = '.';

/**
 * @constant
 */
sokoban.WALL = '#';

/**
 * @constant
 */
sokoban.EMPTY = ' ';

/**
 *
 * @param   {number} width
 *          map width (in tile count)
 *
 * @param   {number} height
 *          map height (in tile count)
 *
 * @param   {array} tiles
 *          2D array of map tiles
 *
 * @typedef Map
 * @constructor
 */
sokoban.Map = function(width, height, tiles) {

    function countContent(contentType) {
        var count = 0;
        tiles.forEach(function(row) {
            row.forEach(function(tile) {
                if (tile.getContent() == contentType) {
                    count++;
                }
            });
        });
        return count;
    }

    this.getTiles = function() {
        var result = [];
        for (var row = 0; row < height; row++) {
            result.push([]);
            for (var column = 0; column < width; column++) {
                result[row][column] = this.getTile(row, column);
            }
        }
        return result;
    };

    /**
     * @returns {number} map width (in tile count)
     */
    this.getWidth = function() {
        return width;
    };

    /**
     * @returns {number} map height (in tile count)
     */
    this.getHeight = function() {
        return height;
    };

    /**
     * Gets tile an specified row and column.
     *
     * @param   {number} row
     *          row index
     *
     * @param   {number} column
     *          column index
     *
     * @returns {Tile} tile in given row and column
     */
    this.getTile = function(row, column) {
        return tiles[row][column];
    };

    /**
     * Counts all players on the map.
     *
     * @returns {number} number of players
     */
    this.countPlayers = function() {
        return countContent(sokoban.PLAYER);
    };

    /**
     * Counts all crates on the map.
     *
     * @returns {number} number of crates
     */
    this.countCrates = function() {
        return countContent(sokoban.CRATE);
    };

    this.countStorageAreas = function() {
        return this.getStorageTiles().length;
    };

    /**
     * Returns player position. If there are several players, this method returns position of the first player. If there
     * are no players at all it returns <code>null</code>
     *
     * @returns {Position} player position
     */
    this.getPlayerPosition = function() {
        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                if (this.getTile(row, column).getContent() == sokoban.PLAYER) {
                    return new sokoban.Coordinates(row, column);
                }
            }
        }
        return null;
    };

    this.getCratePositions = function() {
        var positions = [];
        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                if (this.getTile(row, column).getContent() == sokoban.CRATE) {
                    positions.push(new sokoban.Coordinates(row, column));
                }
            }
        }
        return positions;
    };

    /**
     * Gets all tiles with storages.
     *
     * @returns {Array} array of tiles
     */
    this.getStorageTiles = function() {
        var positions = [];
        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                var tile = this.getTile(row, column);
                if (tile.getType() == sokoban.STORAGE) {
                    positions.push(tile);
                }
            }
        }
        return positions;
    };

    this.toString = function() {
        var result = '';
        for (var row = 0; row < height; row++) {
            for (var column = 0; column < width; column++) {
                var tile = this.getTile(row, column);
                if (tile.isOccupied()) {
                    result += tile.getContent();
                } else {
                    result += tile.getType();
                }
            }
            result += '\n';
        }
        return result;
    };

    this.equals = function(other) {

        function tilesEqual(otherTiles) {
            for (var row = 0; row < height; row++) {
                for (var column = 0; column < width; column++) {
                    if (! tiles[row][column].equals(otherTiles[row][column])) {
                        return false;
                    }
                }
            }
            return true;
        }

        return (width == other.getWidth()) && (height == other.getHeight()) && tilesEqual(other.getTiles());
    };

};

sokoban.Tile = function(type, content) {

    this.getType = function() {
        return type;
    };

    this.getContent = function() {
        return content;
    };

    this.isWall = function() {
        return type == sokoban.WALL;
    };

    this.isStorage = function() {
        return type == sokoban.STORAGE;
    };

    this.isOpen = function() {
        return (! content) && (type == sokoban.EMPTY || type == sokoban.STORAGE);
    };

    this.isOccupied = function() {
        return !!content;
    };

    this.equals = function(other) {
        return (type == other.getType()) && (content == other.getContent());
    };

};

/**
 * Creates new coordinates. It points to the map and is made of row and column index.
 *
 * @param   {number} row
 *          row index
 *
 * @param   {number} column
 *          column index
 *
 * @constructor
 */
sokoban.Coordinates = function(row, column) {

    /**
     * @returns {number} row index
     */
    this.getRow = function() {
        return row;
    };

    /**
     * @returns {number} column index
     */
    this.getColumn = function() {
        return column;
    };

    /**
     * Creates a new position by adding a destination vector to this position.
     *
     * @param   {number} rowDirection
     *          row vector direction
     *
     * @param   {number} columnDirection
     *          column vector direction
     *
     * @returns {Position} new position
     */
    this.plus = function(rowDirection, columnDirection) {
        return new sokoban.Coordinates(row + rowDirection, column + columnDirection);
    };

};

sokoban.Game = function(map) {

    function performMove(map, rowDirection, columnDirection) {

        function walkPlayer(source, destination) {
            var tiles = map.getTiles();
            var sourceTile = map.getTile(source.getRow(), source.getColumn());
            var destinationTile = map.getTile(destination.getRow(), destination.getColumn());
            tiles[source.getRow()][source.getColumn()] = new sokoban.Tile(sourceTile.getType(), null);
            tiles[destination.getRow()][destination.getColumn()] = new sokoban.Tile(destinationTile.getType(), sokoban.PLAYER);
            return new sokoban.Map(map.getWidth(), map.getHeight(), tiles);
        }

        function pushCrate(source, destination, behind) {
            var tiles = map.getTiles();
            var tileBehind = map.getTile(behind.getRow(), behind.getColumn());
            if (tileBehind.isOpen()) {
                var sourceTile = map.getTile(source.getRow(), source.getColumn());
                var destinationTile = map.getTile(destination.getRow(), destination.getColumn());

                tiles[source.getRow()][source.getColumn()] = new sokoban.Tile(sourceTile.getType(), null);;
                tiles[destination.getRow()][destination.getColumn()] = new sokoban.Tile(destinationTile.getType(), sokoban.PLAYER);;
                tiles[behind.getRow()][behind.getColumn()] = new sokoban.Tile(tileBehind.getType(), sokoban.CRATE);;
            }
            return new sokoban.Map(map.getWidth(), map.getHeight(), tiles);
        }

        var source = map.getPlayerPosition();
        var destination = source.plus(rowDirection, columnDirection);

        var destinationTile = map.getTile(destination.getRow(), destination.getColumn());

        if (destinationTile.isOpen()) {
            return walkPlayer(source, destination);
        } else if (destinationTile.isOccupied()) {
            var behind = destination.plus(rowDirection, columnDirection);

            if (map.getTile(behind.getRow(), behind.getColumn()).isOpen()) {
                return pushCrate(source, destination, behind);
            }
        }
        return map;
    }

    function isMovePossible(map, rowDirection, columnDirection) {
        var source = map.getPlayerPosition();
        var destination = source.plus(rowDirection, columnDirection);
        var destinationTile = map.getTile(destination.getRow(), destination.getColumn());

        if (destinationTile.isOpen()) {
            return true;
        } else if (destinationTile.isOccupied()) {
            var behind = destination.plus(rowDirection, columnDirection);

            if (map.getTile(behind.getRow(), behind.getColumn()).isOpen()) {
                return true;
            }
        }
        return false;
    }

    function getPossibleMoves(map) {
        var directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        var moves = [];

        directions.forEach(function(direction) {
            if (isMovePossible(map, direction[0], direction[1])) {
                moves.push(direction);
            }
        });
        return moves;
    }

    function isDeadState(map) {

        function isCrateStuckInCorner() {
            var stuck = false;
            map.getCratePositions().forEach(function(position) {
                if (map.getTile)
                var north = position.plus(-1, 0);
                var east = position.plus(0, 1);
                var south = position.plus(1, 0);
                var west = position.plus(0, -1);
                if (map.getTile(north.getRow(), north.getColumn()).isWall() || map.getTile(south.getRow(), south.getColumn()).isWall()) {
                    if (map.getTile(east.getRow(), east.getColumn()).isWall() || map.getTile(west.getRow(), west.getColumn()).isWall()) {
                        stuck = true;
                    }
                }
            });
            return stuck;
        }

        function isCrateStuckToWall() {
            return false;
        }

        return isCrateStuckInCorner() || isCrateStuckToWall();

    }

    function isImportantState() {

    }

    function isSolved(map) {
        var solved = true;
        map.getStorageTiles().forEach(function(tile) {
            solved = solved && (tile.getContent() == sokoban.CRATE);
        });
        return solved;
    }

    this.getMap = function() {
        return map;
    };

    this.moveUp = function() {
        map = performMove(map, -1, 0);
    };

    this.moveDown = function() {
        map = performMove(map, 1, 0);
    };

    this.moveLeft = function() {
        map = performMove(map, 0, -1);
    };

    this.moveRight = function() {
        map = performMove(map, 0, 1);
    };

    this.isValid = function() {
        return (map.countPlayers() == 1) && (map.countCrates() == map.countStorageAreas());
    };

    this.isOver = function() {
        return isSolved(map);
    };

    this.createSolution = function() {

        var graph = new pathfinding.Graph();
        var queue = [map];
        var solvedMaps = [];

        graph.addNode(map);

        while (queue.length > 0) {

            var currentMap = queue.shift();

            getPossibleMoves(currentMap).forEach(function(move) {
                var resultMap = performMove(currentMap, move[0], move[1]);

                if (! isDeadState(resultMap)) {
                    if (! graph.containsNode(resultMap)) {
                        graph.addNode(resultMap);
                        queue.push(resultMap);
                        if (isSolved(resultMap)) {
                            solvedMaps.push(resultMap);
                        }
                    }
                    graph.addEdge(currentMap, resultMap);
                }
            });

        }

        console.log('graph construction done');

        if (solvedMaps.length == 0) {
            throw 'This map has no solution';
        } else {
            var minPath = graph.findShortestPath(map, solvedMaps[0]);

            for (var i = 1; i < solvedMaps.length; i++) {
                var path = graph.findShortestPath(map, solvedMaps[i]);
                if (path.length < minPath.length) {
                    minPath = path;
                }
            }
            return minPath;
        }
    };

};
