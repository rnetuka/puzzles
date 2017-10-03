/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 3.3.15
 * Time: 7:33
 * To change this template use File | Settings | File Templates.
 */

var sokoban = sokoban || {};

sokoban.parseMap = function(string) {

    function isValidChar(character) {
        var validChars = [sokoban.PLAYER, sokoban.CRATE, sokoban.STORAGE, sokoban.WALL, sokoban.EMPTY];
        return validChars.indexOf(character) != -1;
    }

    function isTileContent(tileData) {
        return (tileData == sokoban.PLAYER || tileData == sokoban.CRATE);
    }

    function getTileType(tileData) {
        return isTileContent(tileData) ? sokoban.EMPTY : tileData;
    }

    function getTileContent(tileData) {
        return isTileContent(tileData) ? tileData : null;
    }

    function createTile(tileData) {
        return new sokoban.Tile(getTileType(tileData), getTileContent(tileData));
    }

    function create2DArray(width, height) {
        var array = [];
        for (var i = 0; i < height; i++) {
            array.push([]);
        }
        return array;
    }

    var lines = string.split(/[(\r\n)|\n]+/);
    var width = (lines[0] ? lines[0].length : 0);
    var height = lines.length;
    var tiles = create2DArray(width, height);

    for (var row = 0; row < height; row++) {
        var line = lines[row];
        for (var column = 0; column < width; column++) {
            var character = line.charAt(column);
            if (isValidChar(character)) {
                tiles[row][column] = createTile(character);
            } else {
                throw 'Invalid character: ' + character;
            }

        }
    }
    return new sokoban.Map(width, height, tiles);

};

sokoban.level1 = function() {
    return sokoban.parseMap(
        '      ######' + '\n' +
        '      #    #' + '\n' +
        '  ##### .  #' + '\n' +
        '###  ###.  #' + '\n' +
        '# $ $$  . ##' + '\n' +
        '# @ $ # . # ' + '\n' +
        '##    ##### ' + '\n' +
        ' ######     '
    );
};