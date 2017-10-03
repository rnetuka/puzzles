/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 4.3.15
 * Time: 7:16
 * To change this template use File | Settings | File Templates.
 */

var PUZZLE_1 = new Puzzle([9, 6, 2], [5, 2, 2]);
var PUZZLE_2 = new Puzzle([8, 5, 3], [4, 4, 0]);
var PUZZLE_3 = new Puzzle([9, 7, 4, 2], [3, 3, 3, 0]);
var PUZZLE_4 = new Puzzle([12, 7, 5], [6, 6, 0]);

function Puzzle(capacities, expectedAmounts) {

    var MAX_WATER_CONTAINERS = 4;

    var waterContainers;

    function createStartingWaterContainers() {
        var result = [];
        var maximalCapacity = 0;
        capacities.forEach(function(capacity) {
            maximalCapacity = Math.max(capacity, maximalCapacity);
        });
        capacities.forEach(function(capacity) {
            result.push(new WaterContainer(capacity, (capacity == maximalCapacity ? capacity : 0)));
        });
        return result;
    }

    function createExpectedWaterContainers() {
        var result = [];
        for (var i = 0; i < capacities.length; i++) {
            result[i] = new WaterContainer(capacities[i], expectedAmounts[i]);
        }
        return result;
    }

    this.getWaterContainers = function() {
        return waterContainers.slice();
    };

    this.getWaterContainer = function(i) {
        return waterContainers[i];
    };

    this.validate = function() {

        function isAmountSumValid() {
            var maxCapacity = Math.max.apply(null, capacities);
            var totalAmounts = 0;
            expectedAmounts.forEach(function(amount) {
                totalAmounts += amount;
            });
            return maxCapacity == totalAmounts;
        }

        if (capacities > MAX_WATER_CONTAINERS) {
            throw 'Maximum number of bowls is: ' + MAX_WATER_CONTAINERS;
        }
        if (! isAmountSumValid()) {
            throw 'Sum of expected amounts is not the same as starting water amount';
        }
    };

    this.createSolution = function() {

        function copyBowls(bowls) {
            var result = [];
            bowls.forEach(function(original) {
                result.push(new WaterContainer(original.getCapacity(), original.getAmount()));
            });
            return result;
        }

        function createGraph() {
            var graph = new pathfinding.Graph();

            var startingBowls = createStartingWaterContainers();
            var startingNode = copyBowls(startingBowls);

            var queue = [];

            queue.push(startingBowls);
            graph.addNode(startingNode);

            while (queue.length > 0) {
                var currentBowls = queue.shift();

                for (var i = 0; i < currentBowls.length; i++) {
                    for (var j = 0; j <currentBowls.length; j++) {
                        if (i != j) {
                            var modifiedBowls = copyBowls(currentBowls);
                            var sourceBowl = modifiedBowls[i];
                            var targetBowl = modifiedBowls[j];

                            if (! sourceBowl.isEmpty()) {
                                sourceBowl.pour(targetBowl);

                                if (graph.containsNode(modifiedBowls)) {
                                    graph.addEdge(currentBowls, modifiedBowls);
                                } else {
                                    graph.addNode(modifiedBowls);
                                    graph.addEdge(currentBowls, modifiedBowls);
                                    queue.push(modifiedBowls);
                                }
                            }
                        }
                    }
                }
            }
            return graph;
        }

        var graph = createGraph();
        var startingBowls = createStartingWaterContainers();
        var expectedBowls = createExpectedWaterContainers();
        return graph.findShortestPath(startingBowls, expectedBowls);
    };

    waterContainers = createStartingWaterContainers();

}

function WaterContainer(capacity, amount) {

    this.getAmount = function() {
        return amount;
    };

    this.addAmount = function(addedAmount) {
        amount += addedAmount;
    };

    this.getCapacity = function() {
        return capacity;
    };

    this.isEmpty = function() {
        return amount == 0;
    };

    this.equals = function(other) {
        return (capacity == other.getCapacity()) && (amount == other.getAmount());
    };

    this.pour = function(target) {
        var limit = amount;
        for (var i = 0; i < limit; i++) {
            if (target.getAmount() < target.getCapacity()) {
                amount -= 1;
                target.addAmount(1);
            }
        }
    };

}

