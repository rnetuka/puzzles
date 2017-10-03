/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 27.3.15
 * Time: 14:10
 * To change this template use File | Settings | File Templates.
 */

QUnit.module('Tile tests');

QUnit.test('empty tile is open', function(assert) {
    var tile = new sokoban.Tile(sokoban.EMPTY);
    assert.ok(tile.isOpen());
});

QUnit.test('storage tile is open', function(assert) {
    var tile = new sokoban.Tile(sokoban.STORAGE);
    assert.ok(tile.isOpen());
});

QUnit.test('wall tile is not open', function(assert) {
    var tile = new sokoban.Tile(sokoban.WALL);
    assert.ok(! tile.isOpen());
});

QUnit.test('tile with content is not open', function(assert) {
    var tile = new sokoban.Tile(sokoban.EMPTY, sokoban.CRATE);
    assert.ok(! tile.isOpen());
});

QUnit.test('is occupied', function(assert) {
    var tile = new sokoban.Tile(sokoban.EMPTY, sokoban.CRATE);
    assert.ok(tile.isOccupied());
});

QUnit.test('is not occupied', function(assert) {
    var tile = new sokoban.Tile(sokoban.EMPTY);
    assert.ok(! tile.isOccupied());
});



QUnit.module('Tile equal tests', {
    beforeEach: function() {
        this.tile = new sokoban.Tile(sokoban.EMPTY, sokoban.PLAYER);
    }
});

QUnit.test('is equal', function(assert) {
    var other = new sokoban.Tile(sokoban.EMPTY, sokoban.PLAYER);
    assert.ok(this.tile.equals(other));
});

QUnit.test('is not equal - type is different', function(assert) {
    var other = new sokoban.Tile(sokoban.STORAGE, sokoban.PLAYER);
    assert.ok(! this.tile.equals(other));
});

QUnit.test('is not equal - content is different', function(assert) {
    var other = new sokoban.Tile(sokoban.EMPTY, sokoban.CRATE);
    assert.ok(! this.tile.equals(other));
});