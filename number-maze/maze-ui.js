/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 5.3.15
 * Time: 8:24
 * To change this template use File | Settings | File Templates.
 */

(function() {

    var maze;

    var mazeElement;

    function createRow(row, i) {
        var tr = document.createElement('tr');
        row.forEach(function(value) {
            var td = document.createElement('td');
            td.innerText = value;
            tr.appendChild(td);
        });
        return tr;
    }

    function drawMaze() {
        for (var i = 0; i < maze.getSize(); i++) {
            mazeElement.appendChild(createRow(maze.getRow(i), i));
        }
        markCurrentTile();
        markFinish();
    }

    function markFinish() {
        $('#maze').find('tr:last td:last').text('☆').addClass('finish');
    }

    function unmarkTile(x, y) {
        getTile(x, y).removeClass('current');
    }

    function markCurrentTile() {
        getTile(maze.getX(), maze.getY()).addClass('current');
    }

    function getTile(x, y) {
        var row = y + 1;
        var column = x + 1;
        return $('#maze').find('tr:nth-child(' + row + ') td:nth-child(' + column + ')');
    }

    function checkUndoRedo() {
        checkUndo();
        checkRedo();
    }

    function checkUndo() {
        $('#undo-button').prop("disabled", !maze.getHistory().isUndoPossible());
    }

    function checkRedo() {
        $('#redo-button').prop("disabled", !maze.getHistory().isRedoPossible());
    }

    function undo() {
        markedMove(maze.getHistory().undo);
    }

    function redo() {
        markedMove(maze.getHistory().redo);
    }

    function markedMove(moveFunction) {
        unmarkTile(maze.getX(), maze.getY());
        unmarkPossibleMoves(maze.getX(), maze.getY());
        moveFunction();
        markCurrentTile();
        markPossibleMoves();
        checkUndoRedo();
    }

    function unmarkPossibleMoves() {
        maze.getPossibleMoves().forEach(function(coordinates) {
            getTile(coordinates.x, coordinates.y).removeClass('possible');
        });
    }

    function markPossibleMoves() {
        maze.getPossibleMoves().forEach(function(coordinates) {
            getTile(coordinates.x, coordinates.y).addClass('possible');
        });
    }

    function displayHint() {
        var solution = findSolution(maze, maze.getTile());
        if (!solution) {
            //TODO flash undo button
        } else {
            var nextMove = solution[1];
            flashTile(nextMove.x, nextMove.y);
        }
    }

    function flashTile(x, y) {
        var tile = getTile(x, y);
        tile.addClass('hint', 1000, function() {
            setTimeout(function() {
                tile.removeClass('hint', 1000);
            }, 10);
        });
    }

    function displaySolution() {
        var solution = findSolution(maze);
        solution.forEach(function(coordinates) {
            console.log(coordinates);
        });
    }

    window.onload = function() {
        maze = PUZZLE1;
        mazeElement = document.getElementById('maze');
        drawMaze();

        $('#undo-button').bind('click', undo);
        $('#redo-button').bind('click', redo);
        $('#hint-button').bind('click', displayHint);
        $('#solution-button').bind('click', displaySolution);
        $('#maze').bind('click', function(event) {
            var cell = $(event.target);
            var row = cell.parent();
            var x = row.children().index(cell);
            var y = row.parent().children().index(row);
            if (maze.isMovePossible(x, y)) {
                markedMove(function() {maze.move(x, y)});
                if (maze.isSolved()) {
                    alert('Solved!');
                } else if (maze.isLost()) {
                    alert('Lost!');
                }
            }
        });

        findSolution(maze);
    };

}());

