'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

exports.formulaParser = formulaParser;

var _fp = require('lodash/fp');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// parseFormula :: regexp -> formula -> [object]
var parseFormula = (0, _fp.curry)(function (regexp, formula) {
    var matches = [];
    var match = void 0;

    while (match = regexp.exec(formula)) {
        matches.push(match);
    }

    return matches;
});

// extractDataElements :: string -> [object]
var extractDataElements = parseFormula(/(#{[A-z0-9]{11}\.?(?:[A-z0-9]{11})?})/g);
// extractOperators :: string -> [object]
var extractOperators = parseFormula(/([+\-/\*]|\[days\])/g);
// extractBrackets :: string -> [object]
var extractBrackets = parseFormula(/([\(\)])/g);
// createFormulaPartObject :: string -> object -> object
var createFormulaPartObject = (0, _fp.curry)(function (entityType, match) {
    return {
        entityType: entityType,
        value: match[1],
        index: match.index
    };
});

function getCharForIndex(index) {
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    if (index < 26) {
        return alphabet[index];
    }

    return getCharForIndex(Math.floor(index / 26) - 1) + getCharForIndex(index % 26);
}

var addVariableNames = function addVariableNames(parts) {
    return parts.map(function (part, index) {
        return (0, _assign2.default)({}, part, { displaySubstitute: getCharForIndex(index) });
    });
};

var extractFormulaParts = function extractFormulaParts(formula) {
    return [].concat((0, _fp.compose)(addVariableNames, (0, _fp.map)(createFormulaPartObject('dataElement')), extractDataElements)(formula), (0, _fp.compose)((0, _fp.map)(createFormulaPartObject('operator')), extractOperators)(formula), (0, _fp.compose)((0, _fp.map)(createFormulaPartObject('bracket')), extractBrackets)(formula));
};

var getOrderedFormulaParts = (0, _fp.compose)((0, _fp.sortBy)('index'), extractFormulaParts);

function formulaParser(formula) {
    if (!formula) {
        return [];
    }

    return getOrderedFormulaParts(formula);
}