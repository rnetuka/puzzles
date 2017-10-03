/**
 * Created with JetBrains WebStorm.
 * User: rnetuka
 * Date: 11.3.15
 * Time: 15:14
 * To change this template use File | Settings | File Templates.
 */

// based on http://www.html5rocks.com/en/tutorials/dnd/basics/

var puzzle = PUZZLE_2;

function getWaterContainers() {
    if (! getWaterContainers.result) {
        getWaterContainers.result = [];
        ['water-container-1', 'water-container-2', 'water-container-3'].forEach(function(id) {
            getWaterContainers.result.push(document.getElementById(id));
        });
    }
    return getWaterContainers.result;
}

function handleDragStart(event) {
    event.dataTransfer.setData('text', event.target.dataset.id);
    this.classList.add('source');
}

function handleDragEnter(event) {
    this.classList.add('over');
}

function handleDragOver(event) {
    this.classList.add('over');
    event.preventDefault();
}

function handleDragLeave(event) {
    this.classList.remove('over');
}

function handleDrop(event) {
    event.preventDefault();
    var sourceId = event.dataTransfer.getData('text');
    var targetId = this.dataset.id;

    (function pourWater() {
        puzzle.getWaterContainer(sourceId).pour(puzzle.getWaterContainer(targetId));
        displayWaterContainers();
    })();
}

function handleDragEnd(event) {
    getWaterContainers().forEach(function(element) {
        element.classList.remove('source');
        element.classList.remove('over');
    });
}

function createWaterContainerImage(waterContainer) {
    var SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

    function createBorder() {
        var element = document.createElementNS(SVG_NAMESPACE, 'path');
        element.setAttribute('d', 'M 41.266803,6.5422348 ' +
            'C 46.772513,12.064901 46.744913,16.466719 46.744913,23.090338 ' +
            'L 46.744913,36.859371 ' +
            'C 27.505319,43.308103 13.750318,60.645198 13.750318,81.071864 ' +
            'C 13.750319,98.616685 23.937111,113.94392 39,122 ' +
            'L 87.610356,122 ' +
            'C 102.67325,113.94392 112.86004,98.616685 112.86004,81.071864 ' +
            'C 112.86004,60.645198 99.042069,43.308103 79.802477,36.859371 ' +
            'L 79.802477,23.090338 ' +
            'C 79.802477,16.466719 79.774874,12.064901 85.280585,6.5422348 ' +
            'L 41.266803,6.5422348 ' +
            'z');
        element.setAttribute('style', 'fill:none;fill-opacity:1;fill-rule:nonzero;stroke:#000000;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:inline;overflow:visible;enable-background:accumulate');
        return element;
    }

    function createWater() {
        var element = document.createElementNS(SVG_NAMESPACE, 'path');
        element.setAttribute('d', 'M 24,53 ' +
            'C 17.429601,60.953488 13.750318,70.177658 13.750318,81.071864 ' +
            'C 13.750319,98.616685 23.937111,113.94392 39,122 ' +
            'L 87.610356,122 ' +
            'C 102.67325,113.94392 112.86004,98.616685 112.86004,81.071864 ' +
            'C 112.86004,70.790866 109.35962,61.29253 103.42933,53.571208 ' +
            'C 75,53 66,53 24,53 ' +
            'z');
        element.setAttribute('style', 'fill:#00ffff;fill-opacity:1;fill-rule:nonzero;stroke:none;stroke-width:6;stroke-linecap:round;stroke-linejoin:round;marker:none;marker-start:none;marker-mid:none;marker-end:none;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1;visibility:visible;display:inline;overflow:visible;enable-background:accumulate');
        return element;
    }

    var g = document.createElementNS(SVG_NAMESPACE, 'g');
    if (! waterContainer.isEmpty()) {
        g.appendChild(createWater());
    }
    g.appendChild(createBorder());

    var svg = document.createElementNS(SVG_NAMESPACE, 'svg');
    svg.setAttribute('version', '1.1');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', '0 0 128 128');
    svg.appendChild(g);
    return svg;
}

function displayWaterContainers() {

    function displayWaterContainer(i, waterContainer) {

        var div = document.getElementById('water-container-' + (i + 1));
        div.innerHTML = '';
        div.appendChild(createWaterContainerImage(waterContainer));

        (function displayAmount() {
            var element = document.querySelector('.water-container-wrapper span.amount[data-id=\"' + i + '\"]');
            element.textContent = waterContainer.getAmount();
        })();

        (function displayCapacity() {
            var element = document.querySelector('.water-container-wrapper span.capacity[data-id=\"' + i + '\"]');
            element.textContent = waterContainer.getCapacity();
        })();

    }

    var waterContainers = puzzle.getWaterContainers();
    for (var i = 0; i < waterContainers.length; i++) {
        displayWaterContainer(i, waterContainers[i]);
    }
}

function displaySolution() {
    var solution = puzzle.createSolution();

    $('#solution-details .step-count').text('Počet kroků: ' + (solution.length - 1));
    $('#solution-details ul').empty();

    solution.forEach(function(waterContainers) {
        var text = '';
        waterContainers.forEach(function(waterContainer) {
            text += waterContainer.getAmount() + ' ';
        });
        var element = document.createElement('li');
        element.textContent = text;

        $('#solution-details ul').append(element);
    });
}


window.onload = function() {
    getWaterContainers().forEach(function(element) {
        element.addEventListener('dragstart', handleDragStart, false);
        element.addEventListener('dragenter', handleDragEnter, false);
        element.addEventListener('dragover', handleDragOver, false);
        element.addEventListener('dragleave', handleDragLeave, false);
        element.addEventListener('drop', handleDrop, false);
        element.addEventListener('dragend', handleDragEnd, false);
    });
    displayWaterContainers();
    displaySolution();

    (function() {
        var element = document.getElementById('puzzle-select');
        var puzzles = [PUZZLE_1, PUZZLE_2, PUZZLE_3, PUZZLE_4];
        for (var i = 0; i < puzzles.length; i++) {
            var option = document.createElement('option');
            option.textContent = 'Hádanka ' + (i + 1);
            element.appendChild(option);
        }
        element.addEventListener('change', function(event) {
            console.log(event);
        }, false);
    })();

    (function initJqueryUi() {
        $(function() {
            $(".tab-panel").tabs();
        });
    })();
};