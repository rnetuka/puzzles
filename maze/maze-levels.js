/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 16.3.15
 * Time: 8:48
 * To change this template use File | Settings | File Templates.
 */

var pathfinding = pathfinding || {};

pathfinding.parseWallMaze = function(text, tileType) {
    var data = [];
    var rows = text.split('\n');
    var start;
    var exit;
    for (var row = 0; row < rows.length; row++) {
        var line = rows[row].trim();
        data.push([]);
        for (var column = 0; column < line.length; column++) {
            var type = line[column];
            if (type == pathfinding.Maze.TILE_START) {
                start = {row: row, column: column};
                type = pathfinding.Maze.TILE_EMPTY;
            }
            if (type == pathfinding.Maze.TILE_EXIT) {
                exit = {row: row, column: column};
                type = pathfinding.Maze.TILE_EMPTY;
            }
            data[row][column] = new pathfinding.MazeTile(type);
        }
    }
    return new pathfinding.Maze(data, tileType, start, exit);
};

pathfinding.parseBorderMaze = function(text) {

    function create2dArray(width, height) {
        var array = [];
        for (var i = 0; i < height; i++) {
            array.push([]);
        }
        return array;
    }

    var lines = text.split('\n');

    var textWidth = lines[0].length;
    var textHeight = lines.length;

    var width = (textWidth - 1) / 2;
    var height = (textHeight - 1) / 2;
    var data = create2dArray(width, height);

    var start;
    var exit;

    for (var i = 1; i < textHeight; i+=2) {
        for (var j = 1; j < textWidth; j+= 2) {
            var row = Math.floor(i / 2);
            var column = Math.floor(j / 2);

            if (lines[i][j] == pathfinding.Maze.TILE_START) {
                start = {row: row, column: column};
            }
            if (lines[i][j] == pathfinding.Maze.TILE_EXIT) {
                exit = {row: row, column: column};
            }

            var borderNorth = (lines[i - 1][j] == '-');
            var borderEast = (lines[i][j + 1] == '|');
            var borderSouth = (lines[i + 1][j] == '-');
            var borderWest = (lines[i][j - 1] == '|');

            data[row][column] = new pathfinding.MazeTile(pathfinding.Maze.TILE_EMPTY, [borderNorth, borderEast, borderSouth, borderWest]);
        }
    }
    return new pathfinding.Maze(data, 'square', start, exit);
};

pathfinding.parseMap = function(text, tileType, start, exit) {
    var data = [];
    var rows = text.split('\n');
    for (var row = 0; row < rows.length; row++) {
        var line = rows[row].trim();
        data.push([]);
        for (var column = 0; column < line.length; column++) {
            var terrain = line[column];
            data[row][column] = new pathfinding.MapTile(terrain);
        }
    }
    return new pathfinding.Maze(data, tileType, start, exit);
};

pathfinding.WALL_MAZE = pathfinding.parseWallMaze('' +
    'A..#.##\n' +
    '##.#...\n' +
    '...#.#.\n' +
    '#.##.#B\n' +
    '...#.#.\n' +
    '.#...#.', 'square'
);

pathfinding.ROBOT_MAZE = pathfinding.parseWallMaze('' +
    'A......\n' +
    '..####.\n' +
    '#..###.\n' +
    '##..##.\n' +
    '###..#.\n' +
    '####..B', 'square'
);

pathfinding.DYNAMITE_MAZE = pathfinding.parseWallMaze('' +
    '...#.##\n' +
    '.#.#.#.\n' +
    'A#.###.\n' +
    '####.#B\n' +
    '.#.#.#.\n' +
    '.#...#.', 'square'
);

pathfinding.BORDER_MAZE = pathfinding.parseBorderMaze(
    ' - - - - - - - - - - \n' +
    '|A  |               |\n' +
    ' -   -   - - - - -   \n' +
    '| |   | |   |       |\n' +
    '   -     -     - - - \n' +
    '|     |     |       |\n' +
    '   - - - -   - - -   \n' +
    '|   |   |     |     |\n' +
    ' -       - - -   -   \n' +
    '| |   |   |     |   |\n' +
    '   - - -     - -   - \n' +
    '|         |     |   |\n' +
    '   - - - - - -   -   \n' +
    '|     |       | |   |\n' +
    ' - -     - -     -   \n' +
    '|   |   |     |   | |\n' +
    '   - - -   - - -     \n' +
    '|         |     | | |\n' +
    '   - - - -   -       \n' +
    '|           |     |B|\n' +
    ' - - - - - - - - - - - ',
    {row: 0, column: 0},
    {row: 9, column: 9}
);

pathfinding.HEX_MAP = pathfinding.parseMap('' +
    'GGGGHGG\n' +
    'GGGGHGG\n' +
    'GFFGGGG\n' +
    'GFFWWGG\n' +
    'GFGGWDD\n' +
    'GGGGGDD',
    'hex',
    {row: 6, column: 0},
    {row: 0, column: 6}
);
