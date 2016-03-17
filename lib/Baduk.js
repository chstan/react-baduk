/* eslint-disable react/no-multi-comp */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var Piece = (function (_React$Component) {
  _inherits(Piece, _React$Component);

  function Piece() {
    _classCallCheck(this, Piece);

    _get(Object.getPrototypeOf(Piece.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Piece, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement('circle', { cx: '' + this.props.x, cy: '' + this.props.y, r: '0.48',
        className: 'piece ' + this.props.color, onClick: this.props.onClick
      });
    }
  }]);

  return Piece;
})(_react2['default'].Component);

Piece.propTypes = {
  color: _react2['default'].PropTypes.string,
  className: _react2['default'].PropTypes.string,
  x: _react2['default'].PropTypes.number.isRequired,
  y: _react2['default'].PropTypes.number.isRequired,
  onClick: _react2['default'].PropTypes.func
};

var BadukBoard = (function (_React$Component2) {
  _inherits(BadukBoard, _React$Component2);

  function BadukBoard() {
    _classCallCheck(this, BadukBoard);

    _get(Object.getPrototypeOf(BadukBoard.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BadukBoard, [{
    key: 'getLabels',
    value: function getLabels() {
      var _this = this;

      var letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
      var numbers = _lodash2['default'].range(1, 27);
      var xLabelSet = _lodash2['default'].get({
        number: numbers,
        hybrid: letters,
        letter: letters
      }, this.props.labelStyle, null);
      var yLabelSet = _lodash2['default'].get({
        number: numbers,
        hybrid: numbers,
        letter: letters
      }, this.props.labelStyle, null);

      var labelsFor = function labelsFor(labelSet, direction) {
        if (!labelSet) return [];
        var tx = undefined;var ty = undefined;var labelClass = undefined;
        if (direction === 'x') {
          tx = function (i) {
            return '' + (_this.props.size - 1 - i);
          };
          ty = function () {
            return '-1';
          };
          labelClass = 'label x-label';
        } else {
          tx = function () {
            return '' + _this.props.size;
          };
          ty = function (i) {
            return '' + i;
          };
          labelClass = 'label y-label';
        }
        return _lodash2['default'].range(_this.props.size).map(function (i) {
          return _react2['default'].createElement(
            'text',
            { textAnchor: 'middle',
              key: 'll' + i + direction,
              className: labelClass, x: tx(i), y: ty(i)
            },
            labelSet[i]
          );
        });
      };

      return _lodash2['default'].concat(labelsFor(xLabelSet, 'x'), labelsFor(yLabelSet, 'y'));
    }
  }, {
    key: 'render',
    value: function render() {
      var className = _lodash2['default'].join(_lodash2['default'].filter(['table', this.props.className]), ' ');
      var size = this.props.size;

      var viewBox = '0 0 ' + (size - 1) + ' ' + (size - 1);

      return _react2['default'].createElement(
        'div',
        { className: className },
        _react2['default'].createElement(
          'div',
          { className: 'board' },
          _react2['default'].createElement(
            'svg',
            { viewBox: viewBox },
            _react2['default'].createElement('rect', { x: '0', y: '0', width: '' + (size - 1), height: '' + (size - 1) }),
            _lodash2['default'].range(size).map(function (i) {
              return _react2['default'].createElement('line', { key: 'lx' + i, x1: '0', x2: '' + (size - 1), y1: '' + i, y2: '' + i });
            }),
            _lodash2['default'].range(size).map(function (i) {
              return _react2['default'].createElement('line', { key: 'ly' + i, y1: '0', y2: '' + (size - 1), x1: '' + i, x2: '' + i });
            }),
            this.getLabels(),
            _react2['default'].createElement(
              'g',
              { transform: 'translate(' + (size - 1) + ', 0), scale(-1, 1)' },
              this.props.children
            )
          )
        )
      );
    }
  }]);

  return BadukBoard;
})(_react2['default'].Component);

BadukBoard.propTypes = {
  className: _react2['default'].PropTypes.string,
  size: _react2['default'].PropTypes.number,
  onClickEmpty: _react2['default'].PropTypes.func,
  children: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.node), _react2['default'].PropTypes.node]),
  labelStyle: _react2['default'].PropTypes.oneOf(['number', 'hybrid', 'letter'])
};

exports.Piece = Piece;
exports.BadukBoard = BadukBoard;