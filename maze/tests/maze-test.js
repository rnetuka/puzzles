/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 24.3.15
 * Time: 9:34
 * To change this template use File | Settings | File Templates.
 */

QUnit.module('Maze test');

QUnit.test('getting direction index', function(assert) {
    var maze = new pathfinding.Maze([], 'hex');
    var direction = [1, 1];
    var index = maze.getDirectionIndex(direction);
    assert.equal(index, 2);
});