/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 3.3.15
 * Time: 7:33
 * To change this template use File | Settings | File Templates.
 */

var sokoban = sokoban || {};

sokoban.ARROW_LEFT = 37;
sokoban.ARROW_UP = 38;
sokoban.ARROW_RIGHT = 39;
sokoban.ARROW_DOWN = 40;

sokoban.getCanvas = function() {
    if (! sokoban.getCanvas.result) {
        sokoban.getCanvas.result = document.getElementById('sokoban-canvas');
    }
    return sokoban.getCanvas.result;
};

sokoban.getContext = function() {
    if (! sokoban.getContext.result) {
        sokoban.getContext.result = sokoban.getCanvas().getContext('2d');
    }
    return sokoban.getContext.result;
};

sokoban.draw = function(game) {
    if (! game.isOver()) {
        sokoban.drawWarehouse(game);
        window.requestAnimationFrame(function() {
            sokoban.draw(game);
        });
    }
};

sokoban.drawWarehouse = function(game) {
    if (! sokoban.drawFunctions) {
        sokoban.initDrawFunctions();
    }
    sokoban.clearCanvas();
    var TILE_SIZE = 30;

    for (var row = 0; row < game.getMap().getHeight(); row++) {
        for (var column = 0; column < game.getMap().getWidth(); column++) {
            var tile = game.getMap().getTile(row, column);
            var tileContent = tile.getContent();
            var x = column * TILE_SIZE;
            var y = row * TILE_SIZE;
            sokoban.drawFunctions[tile.getType()](x, y, TILE_SIZE);
            if (tileContent) {
                sokoban.drawFunctions[tile.getContent()](x, y, TILE_SIZE);
            }
        }
    }
};

sokoban.clearCanvas = function() {
    var canvas = sokoban.getCanvas();
    var context = sokoban.getContext();
    sokoban.getContext().clearRect(0, 0, canvas.width, canvas.height);
};

sokoban.drawPlayer = function(x, y, size) {
    var context = sokoban.getContext();
    context.fillStyle = 'green';
    context.beginPath();
    context.arc(x + size /2, y + size / 2, size / 2, 0 , 2 * Math.PI);
    context.fill();
};

sokoban.drawCrate = function(x, y, size) {
    var context = sokoban.getContext();
    context.fillStyle = 'orange';
    context.fillRect(x, y, size, size);
};

sokoban.drawWall = function(x, y, size) {
    var context = sokoban.getContext();
    context.fillStyle = 'red';
    context.fillRect(x, y, size, size);
};

sokoban.drawStorageLocation = function(x, y, size) {
    var context = sokoban.getContext();
    context.fillStyle = 'lightgrey';
    context.fillRect(x, y, size, size);
};

sokoban.drawEmptyLocation = function(x, y, size) {
    var context = sokoban.getContext();
    context.fillStyle = 'white';
    context.fillRect(x, y, size, size);
};

sokoban.initDrawFunctions = function() {

    function createDrawFunction(handler) {
        return function(x, y, size) {
            handler(x, y, size);
        }
    }

    sokoban.drawFunctions = {};
    sokoban.drawFunctions[sokoban.PLAYER] = createDrawFunction(sokoban.drawPlayer);
    sokoban.drawFunctions[sokoban.CRATE] = createDrawFunction(sokoban.drawCrate);
    sokoban.drawFunctions[sokoban.WALL] = createDrawFunction(sokoban.drawWall);
    sokoban.drawFunctions[sokoban.STORAGE] = createDrawFunction(sokoban.drawStorageLocation);
    sokoban.drawFunctions[sokoban.EMPTY] = createDrawFunction(sokoban.drawEmptyLocation);
};

sokoban.initControls = function(game) {
    var actionMappings = {};
    actionMappings[sokoban.ARROW_UP] = game.moveUp;
    actionMappings[sokoban.ARROW_DOWN] = game.moveDown;
    actionMappings[sokoban.ARROW_LEFT] = game.moveLeft;
    actionMappings[sokoban.ARROW_RIGHT] = game.moveRight;

    function onKeyUp (event) {
        var action = actionMappings[event.keyCode];
        if (action) {
            action();
        }
    }

    window.addEventListener('keyup', onKeyUp, true);
};

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.oRequestAnimationFrame
        || window.msRequestAnimationFrame
        || function(callback) {window.setTimeout(callback, 1000 / 60);};
})();

window.onload = function() {
    var game = new sokoban.Game(sokoban.level1());
    sokoban.initControls(game);
    sokoban.draw(game);

    document.getElementById('sokoban-solve').addEventListener('click', function() {
        var solution = game.createSolution();
        console.log('Step count: ' + solution.length);
        solution.forEach(function(step) {

        });
    }, false);
};