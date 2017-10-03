/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 27.3.15
 * Time: 14:10
 * To change this template use File | Settings | File Templates.
 */

QUnit.module('Map test');

QUnit.test('Get tiles', function(assert) {

});

QUnit.test('Get tiles returns defensive copy', function(assert) {

});

QUnit.test('Count players', function(assert) {

});

QUnit.test('Count crates', function(assert) {

});

QUnit.test('Count storage areas', function(assert) {

});

QUnit.test('Get player position', function(assert) {

});

QUnit.test('Get storage tiles', function(assert) {

});

QUnit.module('Map equals test', {
    beforeEach: function() {
        var width = 2;
        var height = 2;
        var tiles = [
            [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY)],
            [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY, sokoban.PLAYER)]
        ];
        this.map = new sokoban.Map(width, height, tiles);
    }
});

QUnit.test('is equal', function(assert) {
    var width = 2;
    var height = 2;
    var tiles = [
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY)],
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY, sokoban.PLAYER)]
    ];
    var map = new sokoban.Map(width, height, tiles);
    assert.ok(this.map.equals(map));
});

QUnit.test('is not equal - height is different', function(assert) {
    var width = 2;
    var height = 1;
    var tiles = [
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY)],
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY, sokoban.PLAYER)]
    ];
    var map = new sokoban.Map(width, height, tiles);
    assert.ok(! this.map.equals(map));
});

QUnit.test('is not equal - width is different', function(assert) {
    var width = 1;
    var height = 2;
    var tiles = [
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY)],
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY, sokoban.PLAYER)]
    ];
    var map = new sokoban.Map(width, height, tiles);
    assert.ok(! this.map.equals(map));
});

QUnit.test('is not equal - tiles are different', function(assert) {
    var width = 2;
    var height = 2;
    var tiles = [
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY)],
        [new sokoban.Tile(sokoban.EMPTY), new sokoban.Tile(sokoban.EMPTY, sokoban.CRATE)]
    ];
    var map = new sokoban.Map(width, height, tiles);
    assert.ok(! this.map.equals(map));
});