import _extends from 'babel-runtime/helpers/extends';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { Component } from 'react';
import Draft from 'draft-js';

var convertFromRaw = Draft.convertFromRaw,
    convertToRaw = Draft.convertToRaw,
    CompositeDecorator = Draft.CompositeDecorator,
    Editor = Draft.Editor,
    EditorState = Draft.EditorState,
    Entity = Draft.Entity,
    Modifier = Draft.Modifier;


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
    _inherits(FormulaEditor, _Component);

    function FormulaEditor(props) {
        _classCallCheck(this, FormulaEditor);

        var _this = _possibleConstructorReturn(this, (FormulaEditor.__proto__ || _Object$getPrototypeOf(FormulaEditor)).call(this, props));

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

    _createClass(FormulaEditor, [{
        key: 'render',
        value: function render() {
            var _this2 = this;

            return React.createElement(
                'div',
                { style: styles.root },
                React.createElement(
                    'div',
                    { style: styles.editor, onClick: this.focus },
                    React.createElement(Editor, {
                        editorState: this.state.editorState,
                        onChange: this.onChange,
                        placeholder: 'Your formulae goes here...',
                        ref: function ref(_ref) {
                            _this2.editorRef = _ref;
                        }
                    })
                ),
                React.createElement('input', {
                    onClick: this.logState,
                    style: styles.button,
                    type: 'button',
                    value: 'Log State'
                }),
                React.createElement('input', { type: 'text', onChange: this.setName }),
                React.createElement(
                    'button',
                    { onClick: this.addEntity },
                    'Add Tag with "Mark"'
                )
            );
        }
    }]);

    return FormulaEditor;
}(Component);

export default FormulaEditor;


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
    return React.createElement(
        'span',
        _extends({}, props, { style: style }),
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