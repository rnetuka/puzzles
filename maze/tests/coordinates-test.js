/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 24.3.15
 * Time: 9:24
 * To change this template use File | Settings | File Templates.
 */

QUnit.module('Coordinates test', {});

QUnit.test('calculating directions', function(assert) {
    var source = new pathfinding.Coordinates(4, 7);
    var destination = new pathfinding.Coordinates(4, 8);
    var direction = source.calculateDirection(destination);
    assert.deepEqual(direction, [0, 1]);
});