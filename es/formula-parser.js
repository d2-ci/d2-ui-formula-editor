import _Object$assign from 'babel-runtime/core-js/object/assign';
import { curry } from 'lodash/fp';
import { compose } from 'lodash/fp';
import { map } from 'lodash/fp';
import { sortBy } from 'lodash/fp';

// parseFormula :: regexp -> formula -> [object]
var parseFormula = curry(function (regexp, formula) {
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
var createFormulaPartObject = curry(function (entityType, match) {
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
        return _Object$assign({}, part, { displaySubstitute: getCharForIndex(index) });
    });
};

var extractFormulaParts = function extractFormulaParts(formula) {
    return [].concat(compose(addVariableNames, map(createFormulaPartObject('dataElement')), extractDataElements)(formula), compose(map(createFormulaPartObject('operator')), extractOperators)(formula), compose(map(createFormulaPartObject('bracket')), extractBrackets)(formula));
};

var getOrderedFormulaParts = compose(sortBy('index'), extractFormulaParts);

export function formulaParser(formula) {
    if (!formula) {
        return [];
    }

    return getOrderedFormulaParts(formula);
}