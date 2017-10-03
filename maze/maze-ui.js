/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 16.3.15
 * Time: 8:38
 * To change this template use File | Settings | File Templates.
 */

var pathfinding = pathfinding || {};

pathfinding.ui = pathfinding.ui || {};

pathfinding.ui.createMaze = function(maze, id) {

    function createRowElement(row) {
        var element = document.createElement('tr');
        for (var column = 0; column < maze.getWidth(); column++) {
            element.appendChild(createTileElement(row, column));
        }
        return element;
    }

    function createTileElement(row, column) {

        function getClassName() {
            var tile = maze.getTile(row, column);
            var className = tileClasses[tile.getType()];
            if (row == maze.getStart().row && column == maze.getStart().column) {
                className += ' start';
            }
            else if (row == maze.getExit().row && column == maze.getExit().column) {
                className += ' exit';
            }
            for (var i = 0; i < maze.getDirections().length; i++) {
                if (tile.getBorder(i)) {
                    className += ' border' + i;
                }
            }
            return className;
        }

        var tileClasses = {};
        tileClasses[pathfinding.Maze.TILE_EMPTY] = 'empty';
        tileClasses[pathfinding.Maze.TILE_WALL] = 'wall';

        var element = document.createElement('td');
        element.className = getClassName();
        return element;
    }

    var element = document.createElement('table');
    if (id) {
        element.id = id;
    }
    element.className = 'maze';
    for (var row = 0; row < maze.getHeight(); row++) {
        element.appendChild(createRowElement(row));
    }
    return element;
};

pathfinding.ui.createHexMap = function(map, id) {

    var terrainClasses = {};
    terrainClasses[pathfinding.Maze.TERRAIN_GRASS] = 'grass';
    terrainClasses[pathfinding.Maze.TERRAIN_WATER] = 'water';
    terrainClasses[pathfinding.Maze.TERRAIN_FOREST] = 'forest';
    terrainClasses[pathfinding.Maze.TERRAIN_HILLS] = 'hills';
    terrainClasses[pathfinding.Maze.TERRAIN_MOUNTAINS] = 'mountains';
    terrainClasses[pathfinding.Maze.TERRAIN_DESERT] = 'desert';

    function createTileElement(row, column) {

        function createDiv(className) {
            var element = document.createElement('div');
            element.className = className;
            return element;
        }

        var element = document.createElement('div');
        if (column % 2 == 0) {
            element.className = 'hex even';
        } else {
            element.className = 'hex';
        }
        element.className += ' ' + terrainClasses[map.getTile(row, column).getTerrain()];
        element.appendChild(createDiv('left'));
        element.appendChild(createDiv('middle'));
        element.appendChild(createDiv('right'));
        return element;
    }

    function createRowElement(row) {
        var element = document.createElement('div');
        element.className = 'hex-row';
        for (var column = 0; column < map.getWidth(); column++) {
            element.appendChild(createTileElement(row, column));
        }
        return element;
    }


    var element = document.createElement('div');
    if (id) {
        element.id = id;
    }
    //element.className = 'maze';
    for (var row = 0; row < map.getHeight(); row++) {
        element.appendChild(createRowElement(row));
    }
    return element;

    //<div class="hex"><div class="top"></div><div class="middle"></div><div class="bottom"></div></div>
};

pathfinding.ui.drawPath = function(mazeElement, path) {
    var tiles = [];

    function getTile(coordinates) {
        for (var i = 0; i < tiles.length; i++) {
            var tile = tiles[i];
            if (tile.row == coordinates.row && tile.column == coordinates.column) {
                return tile;
            }
        }
    }

    path.forEach(function(coordinates) {
        tiles.push({
            row: coordinates.row,
            column: coordinates.column,
            element: $(mazeElement).find('tr:nth-child(' + (coordinates.row + 1) + ') td:nth-child(' + (coordinates.column + 1) + ')'),
            top: false,
            bottom: false,
            left: false,
            right: false
        });
    });

    for (var i = 1; i < path.length; i++) {
        var from = path[i - 1];
        var to = path[i];

        var sourceTile = getTile(from);
        var destinationTile = getTile(to);

        switch (from.row - to.row) {
            case -1:
                sourceTile.bottom = true
                destinationTile.top = true;
                break;
            case 1:
                sourceTile.top = true;
                destinationTile.bottom = true;
                break;
        }
        switch (from.column - to.column) {
            case -1:
                sourceTile.right = true;
                destinationTile.left = true;
                break;
            case 1:
                sourceTile.left = true;
                destinationTile.right = true;
                break;
        }
    }

    tiles.forEach(function(tile) {
        /*tile.element.addClass('path');
        if (tile.left && tile.right) {
            tile.element.addClass('horizontal');
        }
        else if (tile.top && tile.bottom) {
            tile.element.addClass('vertical');
        }
        else if (tile.left && tile.top) {
            tile.element.addClass('left-top');
        }
        else if (tile.left && tile.bottom) {
            tile.element.addClass('left-bottom');
        }
        else if (tile.right && tile.top) {
            tile.element.addClass('right-top');
        }
        else if (tile.right && tile.bottom) {
            tile.element.addClass('right-bottom');
        }
        else if (tile.left) {
            tile.element.addClass('left');
        }
        else if (tile.right) {
            tile.element.addClass('right');
        }
        else if (tile.top) {
            tile.element.addClass('top');
        }
        else if (tile.bottom) {
            tile.element.addClass('bottom');
        }*/
        tile.element.addClass('path');
        tile.element.text('⚫');
    });
};

$(function() {

    function initTab(mazeId, maze, configuration) {
        $('#' + mazeId + '-tab').find('.maze-wrapper').append(pathfinding.ui.createMaze(maze, mazeId));
        $('#solve-' + mazeId).bind('click', function() {

            var solution = new pathfinding.MazePuzzle(maze, configuration).createSolution();
            solution.forEach(function(coordinates) {
                console.log(coordinates.row + ', ' + coordinates.column);
            });
            pathfinding.ui.drawPath($('#' + mazeId), solution);

        });
    }

    function initTab2(mazeId, maze, configuration) {
        $('#' + mazeId + '-tab').find('.maze-wrapper').append(pathfinding.ui.createHexMap(maze, mazeId));
        $('#solve-' + mazeId).bind('click', function() {

            var solution = new pathfinding.MapPuzzle(maze, configuration).createSolution();
            solution.forEach(function(coordinates) {
                console.log(coordinates.row + ', ' + coordinates.column);
            });
            //pathfinding.ui.drawPath($('#' + mazeId), solution);

        });
    }

    $('#maze-tabs').tabs();

    initTab('wall-maze', pathfinding.WALL_MAZE);
    initTab('robot-maze', pathfinding.ROBOT_MAZE, {robot: true});
    initTab('dynamite-maze', pathfinding.DYNAMITE_MAZE, {dynamite: true});
    initTab('border-maze', pathfinding.BORDER_MAZE);
    initTab2('map-maze', pathfinding.HEX_MAP);
});