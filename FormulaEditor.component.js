'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _draftJs = require('draft-js');

var _draftJs2 = _interopRequireDefault(_draftJs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var convertFromRaw = _draftJs2.default.convertFromRaw,
    convertToRaw = _draftJs2.default.convertToRaw,
    CompositeDecorator = _draftJs2.default.CompositeDecorator,
    Editor = _draftJs2.default.Editor,
    EditorState = _draftJs2.default.EditorState,
    Entity = _draftJs2.default.Entity,
    Modifier = _draftJs2.default.Modifier;


var rawContent = {
    blocks: [{
        text: 'This is an "immutable" entity: Superman. Deleting any ' + 'characters will delete the entire entity. Adding characters ' + 'will remove the entity from the range.',
        type: 'unstyled',
        entityRanges: []
    }],

    entityMap: {
        dataElement: {
            type: 'TOKEN',
            mutability: 'IMMUTABLE'
        }
        // second: {
        //     type: 'TOKEN',
        //     mutability: 'MUTABLE',
        // },
        // third: {
        //     type: 'TOKEN',
        //     mutability: 'SEGMENTED',
        // },
    }
};

var FormulaEditor = function (_Component) {
    (0, _inherits3.default)(FormulaEditor, _Component);

    function FormulaEditor(props) {
        (0, _classCallCheck3.default)(this, FormulaEditor);

        var _this = (0, _possibleConstructorReturn3.default)(this, (FormulaEditor.__proto__ || (0, _getPrototypeOf2.default)(FormulaEditor)).call(this, props));

        var contentState = convertFromRaw(rawContent);

        _this.state = {
            editorState: EditorState.createWithContent(contentState, decorator)
        };

        _this.focus = function () {
            return _this.editorRef.focus();
        };
        _this.onChange = function (editorState) {
            return _this.setState({ editorState: editorState });
        };
        _this.logState = function () {
            var content = _this.state.editorState.getCurrentContent();
            console.log(convertToRaw(content));
        };

        _this.addEntity = function () {
            var currentState = _this.state.editorState.getCurrentContent();
            var newCurrentState = Modifier.insertText(currentState, _this.state.editorState.getSelection(), _this.state.dataElementName, undefined, Entity.create('dataElement', 'IMMUTABLE'));

            _this.setState({
                editorState: EditorState.createWithContent(newCurrentState, decorator)
            });
        };

        _this.setName = function (event) {
            _this.setState({
                dataElementName: event.currentTarget.value
            });
        };
        return _this;
    }

    (0, _createClass3.default)(FormulaEditor, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return _react2.default.createElement(
                'div',
                { style: styles.root },
                _react2.default.createElement(
                    'div',
                    { style: styles.editor, onClick: this.focus },
                    _react2.default.createElement(Editor, {
                        editorState: this.state.editorState,
                        onChange: this.onChange,
                        placeholder: 'Your formulae goes here...',
                        ref: function ref(_ref) {
                            _this2.editorRef = _ref;
                        }
                    })
                ),
                _react2.default.createElement('input', {
                    onClick: this.logState,
                    style: styles.button,
                    type: 'button',
                    value: 'Log State'
                }),
                _react2.default.createElement('input', { type: 'text', onChange: this.setName }),
                _react2.default.createElement(
                    'button',
                    { onClick: this.addEntity },
                    'Add Tag with "Mark"'
                )
            );
        }
    }]);
    return FormulaEditor;
}(_react.Component);

exports.default = FormulaEditor;


function getEntityStrategy(mutability) {
    return function (contentBlock, callback) {
        contentBlock.findEntityRanges(function (character) {
            var entityKey = character.getEntity();
            if (entityKey === null) {
                return false;
            }
            return Entity.get(entityKey).getMutability() === mutability;
        }, callback);
    };
}

function getDecoratedStyle(mutability) {
    switch (mutability) {
        case 'IMMUTABLE':
            return styles.immutable;
        case 'MUTABLE':
            return styles.mutable;
        case 'SEGMENTED':
            return styles.segmented;
        default:
            return null;
    }
}

var TokenSpan = function TokenSpan(props) {
    console.log(Entity.get(props.entityKey));

    var style = getDecoratedStyle(Entity.get(props.entityKey).getMutability());
    return _react2.default.createElement(
        'span',
        (0, _extends3.default)({}, props, { style: style }),
        props.children
    );
};

var decorator = new CompositeDecorator([{
    strategy: getEntityStrategy('IMMUTABLE'),
    component: TokenSpan
}, {
    strategy: getEntityStrategy('MUTABLE'),
    component: TokenSpan
}, {
    strategy: getEntityStrategy('SEGMENTED'),
    component: TokenSpan
}]);

var styles = {
    root: {
        fontFamily: '\'Helvetica\', sans-serif',
        padding: 20,
        width: 600
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 80,
        padding: 10
    },
    button: {
        marginTop: 10,
        textAlign: 'center'
    },
    immutable: {
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        padding: '2px 0'
    },
    mutable: {
        backgroundColor: 'rgba(204, 204, 255, 1.0)',
        padding: '2px 0'
    },
    segmented: {
        backgroundColor: 'rgba(248, 222, 126, 1.0)',
        padding: '2px 0'
    }
};