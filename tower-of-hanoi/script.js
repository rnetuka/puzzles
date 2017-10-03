/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 10.3.15
 * Time: 15:52
 * To change this template use File | Settings | File Templates.
 */

var puzzle = puzzle || {};

puzzle.TowerOfHanoi = function(numberOfDisks) {

    var rodA = new Rod('A');
    var rodB = new Rod('B');
    var rodC = new Rod('C');

    function Rod(name) {

        var disks = [];

        this.getName = function() {
            return name;
        };

        this.countDisks = function() {
            return disks.length;
        };

        this.isEmpty = function() {
            return disks.length == 0;
        };

        this.push = function(disk) {
            disks.push(disk);
        };

        this.pop = function() {
            return disks.pop();
        };

        this.peek = function() {
            return disks[disks.length - 1];
        }

    }

    function isValidMove(disk, rod) {
        return (rod.isEmpty()) ? true : rod.peek() < disk;
    }

    this.moveDisk = function(sourceRod, targetRod) {
        var disk = sourceRod.peek();
        if (! isValidMove(disk, targetRod)) {
            throw 'This move is not valid';
        }
        sourceRod.pop();
        targetRod.push(disk);
    };

    this.getSolution = function() {
        var solution = [];

        function moveDisksThrough(n, sourceRod, targetRod, throughRod) {
            if (n == 1) {
                solution.push({from: sourceRod, to: targetRod});
            } else {
                moveDisksThrough(n - 1, sourceRod, throughRod, targetRod);
                moveDisksThrough(1, sourceRod, targetRod, throughRod);
                moveDisksThrough(n - 1, throughRod, targetRod, sourceRod);
            }
        }

        moveDisksThrough(numberOfDisks, rodA, rodC, rodB);
        return solution;
    };

    for (var i = 0; i <= numberOfDisks; i++) {
        rodA.push(i);
    }

};

window.onload = function() {
    var puzzle1 = new puzzle.TowerOfHanoi(3);
    var solution = puzzle1.getSolution();
    solution.forEach(function(move) {
        console.log(move.from.getName() + ' -> ' + move.to.getName());
    });
};


