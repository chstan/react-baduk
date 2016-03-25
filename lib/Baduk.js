/* eslint-disable react/no-multi-comp */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var PIECE_RADIUS = 0.48;

var Piece = (function (_React$Component) {
  _inherits(Piece, _React$Component);

  function Piece() {
    _classCallCheck(this, Piece);

    _get(Object.getPrototypeOf(Piece.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Piece, [{
    key: 'render',
    value: function render() {
      return _react2['default'].createElement('circle', { cx: '' + this.props.x, cy: '' + this.props.y, r: PIECE_RADIUS,
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
    key: 'getStarPoints',
    value: function getStarPoints() {
      // should give adaptive star point locations based on board size
      var size = this.props.size;

      var middleOffset = (size - 1) / 2;
      var sideOffset = 3; // this is the constant we should adapt to board size

      var STAR_POINT_RADIUS = 0.12;
      var starPointAt = function starPointAt(x, y) {
        return _react2['default'].createElement('circle', { cx: '' + x, cy: '' + y, r: STAR_POINT_RADIUS,
          className: 'star-point', key: 'sp' + x + '-' + y
        });
      };

      if (size === 9) {
        // just return one star point in the case of a 9x9 board
        return [starPointAt(4, 4)];
      }

      // why no cross product, lodash?
      var locations = [[sideOffset, sideOffset], [sideOffset, size - sideOffset - 1], [size - sideOffset - 1, sideOffset], [size - sideOffset - 1, size - sideOffset - 1]];
      if (size % 2) {
        // the board is a normal size, so we place 9 star points
        // we'll also begrudgingly accept the even case and return just four star points
        locations = locations.concat([[middleOffset, middleOffset], [middleOffset, sideOffset], [sideOffset, middleOffset], [middleOffset, size - sideOffset - 1], [size - sideOffset - 1, middleOffset]]);
      }

      return locations.map(function (args) {
        return starPointAt.apply(undefined, _toConsumableArray(args));
      });
    }
  }, {
    key: 'getEmptyPieceTargets',
    value: function getEmptyPieceTargets() {
      var _this2 = this;

      var size = this.props.size;

      return _lodash2['default'].range(size * size).map(function (i) {
        var x = i % size;
        var y = Math.trunc(i / size);
        var onClickForPiece = _this2.props.onClickEmpty.bind(_this2, _this2.props.size - x - 1, y);
        return _react2['default'].createElement('circle', { cx: '' + x, cy: '' + y, r: PIECE_RADIUS, key: 'pt' + i,
          className: 'piece-target', onClick: onClickForPiece
        });
      });
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
              { className: 'empty-piece-targets' },
              this.getEmptyPieceTargets()
            ),
            _react2['default'].createElement(
              'g',
              { className: 'star-points' },
              this.getStarPoints()
            ),
            _react2['default'].createElement(
              'g',
              { className: 'pieces', transform: 'translate(' + (size - 1) + ', 0), scale(-1, 1)' },
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
  starPoints: _react2['default'].PropTypes.bool,
  size: _react2['default'].PropTypes.number,
  onClickEmpty: _react2['default'].PropTypes.func,
  children: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.arrayOf(_react2['default'].PropTypes.node), _react2['default'].PropTypes.node]),
  labelStyle: _react2['default'].PropTypes.oneOf(['number', 'hybrid', 'letter'])
};

BadukBoard.defaultProps = {
  size: 19, // prefer a standard, full-sized board
  // `onClickEmpty` should take the coordinates of the clicked location on the board
  onClickEmpty: _lodash2['default'].noop,
  starPoints: true
};

// this class contains all the logic of the game itself

var BadukGame = (function () {
  // stone values are null, 'black', and 'white'

  function BadukGame(size, mode) {
    _classCallCheck(this, BadukGame);

    this.mode = mode || 'freeplay';
    this.size = size;
    this.moves = [];

    // rewinding has the effect of cleaning up and populating
    // the rest of the initial state
    this.rewindToStart();
  }

  _createClass(BadukGame, [{
    key: 'isMoveLegal',
    value: function isMoveLegal(x, y) {
      // we have to check the liberties of the played piece after captures, check
      // remanining stones, check occupancy, and compare the board to the history for ko
      var groupsForPlayer = this.toPlay === 'black' ? this.blackGroups : this.whiteGroups;
      if (this.board[x][y]) return false;
      if (this.toPlay === 'black' ? !this.blackStonesRemaining : !this.whiteStonesRemaining) {
        return false;
      }

      // this is not very efficient: we shouldn't need to peek the next state often
      // because we only need to reject the move when it attempts to play against ko
      var legal = true;
      this.move(x, y, false);
      if (this.positions.has(this.koString())) {
        // illegal for reasons of ko
        legal = false;
      }
      if (this.groupHasNoLiberties(groupsForPlayer[this.hashLocation(x, y)])) {
        // you cannot play into a dead shape
        legal = false;
      }
      this.rewind();
      this.moves.pop(); // flush the fake move
      return legal;
    }
  }, {
    key: 'koString',
    value: function koString() {
      // gets the current state of the board as a string
      return _lodash2['default'].flatten(this.board).map(function (p) {
        return _lodash2['default'].head(String(p));
      }).join('');
    }
  }, {
    key: 'mergeGroupsWithPiece',
    value: function mergeGroupsWithPiece(allGroups, toMerge, x, y) {
      var hash = this.hashLocation(x, y);
      var group = undefined;
      if (toMerge.length === 0) {
        group = new Set();
      } else if (toMerge.length === 1) {
        group = toMerge[0];
      } else {
        // we actually have groups to merge

        var _toMerge = _toArray(toMerge);

        var first = _toMerge[0];

        var rest = _toMerge.slice(1);

        group = first;
        _lodash2['default'].each(rest, function (g) {
          g.forEach(function (h) {
            allGroups[h] = group; // eslint-disable-line no-param-reassign
            group.add(h);
          });
        });
      }
      group.add(hash);
      allGroups[hash] = group; // eslint-disable-line no-param-reassign
    }
  }, {
    key: 'adjacentLocations',
    value: function adjacentLocations(x, y) {
      var _this3 = this;

      return [[x, y + 1], [x, y - 1], [x + 1, y], [x - 1, y]].filter(function (loc) {
        return _lodash2['default'].every(loc, function (i) {
          return i >= 0 && i < _this3.size;
        });
      });
    }
  }, {
    key: 'hashLocation',
    value: function hashLocation(x, y) {
      return x + '.' + y;
    }
  }, {
    key: 'dehashLocation',
    value: function dehashLocation(hash) {
      return hash.split('.').map(_lodash2['default'].parseInt);
    }
  }, {
    key: 'pieceHasLiberties',
    value: function pieceHasLiberties(x, y) {
      var _this4 = this;

      return _lodash2['default'].some(this.adjacentLocations(x, y), function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2);

        var px = _ref2[0];
        var py = _ref2[1];
        return !_this4.board[px][py];
      });
    }
  }, {
    key: 'groupHasNoLiberties',
    value: function groupHasNoLiberties(group) {
      var _this5 = this;

      // not a very efficient implementation: a better option might be to cache
      // liberties on each group; such a strategy would also complicate merging
      return !_lodash2['default'].some(_lodash2['default'].toArray(group), function (hash) {
        return _this5.pieceHasLiberties.apply(_this5, _toConsumableArray(_this5.dehashLocation(hash)));
      });
    }
  }, {
    key: 'move',
    value: function move(x, y) {
      var _this6 = this;

      var checkLegal = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

      if (checkLegal && !this.isMoveLegal(x, y)) {
        throw new Error('Illegal move attempt at ' + x + ' ' + y);
      }

      this.board[x][y] = this.toPlay;

      // once the piece has been played, we must merge any groups of the side that
      // played, or else create a new group for the played piece
      var adjacentPieces = this.adjacentLocations(x, y);

      var allFriendlyGroups = this.toPlay === 'black' ? this.blackGroups : this.whiteGroups;
      var allEnemyGroups = this.toPlay === 'black' ? this.whiteGroups : this.blackGroups;

      var groupsContainingPieces = function groupsContainingPieces(groups, pieces) {
        return new Set(_lodash2['default'].filter(pieces.map(function (loc) {
          return groups[_this6.hashLocation.apply(_this6, _toConsumableArray(loc))];
        }), function (g) {
          return g;
        }));
      };

      var adjacentFriendlyGroups = groupsContainingPieces(allFriendlyGroups, adjacentPieces);
      // we did not really merge any groups if all we did was integrate one piece
      var joined = adjacentFriendlyGroups.size > 1 ? _lodash2['default'].cloneDeep(_lodash2['default'].toArray(adjacentFriendlyGroups)) : [];
      this.mergeGroupsWithPiece(allFriendlyGroups, _lodash2['default'].toArray(adjacentFriendlyGroups), x, y);

      // then we must check for captures by seeing what groups were touched by the
      // played piece, and checking their liberties
      var adjacentEnemyGroups = groupsContainingPieces(allEnemyGroups, adjacentPieces);
      var captured = _lodash2['default'].cloneDeep(_lodash2['default'].toArray(adjacentEnemyGroups).filter(this.groupHasNoLiberties.bind(this)));
      _lodash2['default'].each(captured, function (g) {
        if (_this6.toPlay === 'black') {
          _this6.capturedByBlack += g.size;
        } else {
          _this6.capturedByWhite += g.size;
        }
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = g[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var hash = _step.value;

            delete allEnemyGroups[hash];
            _lodash2['default'].set(_this6.board, hash, null);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      });

      // we log the move and cache any groups that might have been captured as a result
      var newMove = {
        joined: joined, // we keep joined to make rewinding easier
        captured: captured,
        location: [x, y]
      };
      if (this.moveCursor === this.moves.length) {
        // we are appending to the end of the moveset
        this.moves.push(newMove);
      } else {
        // we are overwriting or updating
        this.moves[this.moveCursor] = newMove;
      }
      this.moveCursor += 1;

      // we record the current state of the board for ko checking
      if (checkLegal) {
        this.positions.add(this.koString());
      }

      // finally we end the current color's turn
      if (this.toPlay === 'black') {
        this.toPlay = 'white';
        this.blackStonesRemaining -= 1;
      } else {
        this.toPlay = 'black';
        this.whiteStonesRemaining -= 1;
      }
    }
  }, {
    key: 'pass',
    value: function pass() {
      this.moves.push({
        location: null
      });
      this.moveCursor += 1;
    }
  }, {
    key: 'rewindToStart',
    value: function rewindToStart() {
      var _this7 = this;

      // different behavior than rewind to start, just sets the move cursor to 0
      // and clears the internal board
      this.positions = new Set(); // used for checking ko
      this.whiteGroups = {};
      this.blackGroups = {};
      this.moveCursor = 0;
      this.capturedByWhite = 0;
      this.capturedByBlack = 0;
      this.whiteStonesRemaining = Math.trunc(this.size * this.size / 2);
      this.blackStonesRemaining = this.size * this.size - this.whiteStonesRemaining;
      this.toPlay = 'black';
      this.board = _lodash2['default'].range(this.size).map(function () {
        return _lodash2['default'].range(_this7.size).map(function () {
          return null;
        });
      });
    }
  }, {
    key: 'rewind',
    value: function rewind(n) {
      var _this8 = this;

      var nRewinds = n || 1;
      if (nRewinds > this.moveCursor) {
        throw new Error('Cannot rewind past the beginning of the game');
      }
      _lodash2['default'].times(nRewinds, function () {
        _this8.moveCursor -= 1;
        var move = _this8.moves[_this8.moveCursor];

        // revert the color, give a stone back
        var enemyColor = _this8.toPlay;
        var allEnemyGroups = enemyColor === 'black' ? _this8.blackGroups : _this8.whiteGroups;
        var allFriendlyGroups = enemyColor === 'black' ? _this8.whiteGroups : _this8.blackGroups;
        if (_this8.toPlay === 'white') {
          // it WAS black's turn
          _this8.blackStonesRemaining += 1;
          _this8.toPlay = 'black';
        } else {
          _this8.whiteStonesRemaining += 1;
          _this8.toPlay = 'white';
        }

        // restore any captured groups
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = move.captured[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var group = _step2.value;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = group[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var stone = _step4.value;

                // put the stone back on the board

                var _dehashLocation = _this8.dehashLocation(stone);

                var _dehashLocation2 = _slicedToArray(_dehashLocation, 2);

                var _x2 = _dehashLocation2[0];
                var _y = _dehashLocation2[1];

                _this8.board[_x2][_y] = enemyColor;
                allEnemyGroups[stone] = group;
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                  _iterator4['return']();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }
          }

          // unjoin any joined groups
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2['return']) {
              _iterator2['return']();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = move.joined[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var group = _step3.value;
            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
              for (var _iterator5 = group[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                var stone = _step5.value;

                allFriendlyGroups[stone] = group;
              }
            } catch (err) {
              _didIteratorError5 = true;
              _iteratorError5 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                  _iterator5['return']();
                }
              } finally {
                if (_didIteratorError5) {
                  throw _iteratorError5;
                }
              }
            }
          }

          // remove the placed stone
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3['return']) {
              _iterator3['return']();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        var _move$location = _slicedToArray(move.location, 2);

        var x = _move$location[0];
        var y = _move$location[1];

        _this8.board[x][y] = null;
        delete allFriendlyGroups[_this8.hashLocation(x, y)];
      });
    }
  }, {
    key: 'fastForward',
    value: function fastForward(n) {
      var nFastForwards = n || 1;
      if (nFastForwards + this.moveCursor > this.moves.length) {
        throw new Error('Cannot fast forward past the present state of the game');
      }
      var that = this;
      _lodash2['default'].times(nFastForwards, function () {
        var _that$moves$that$currentMove$location = _slicedToArray(that.moves[that.currentMove].location, 2);

        var x = _that$moves$that$currentMove$location[0];
        var y = _that$moves$that$currentMove$location[1];

        that.move(x, y, false); // in theory we are playing an already verified move
      });
    }
  }]);

  return BadukGame;
})();

var Baduk = (function (_React$Component3) {
  _inherits(Baduk, _React$Component3);

  function Baduk() {
    _classCallCheck(this, Baduk);

    _get(Object.getPrototypeOf(Baduk.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(Baduk, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      this.setState({
        game: new BadukGame(this.props.size)
      });
    }
  }, {
    key: 'getPieces',
    value: function getPieces() {
      var pieces = [];
      var game = this.state.game;

      if (game) {
        for (var x = 0; x < this.props.size; x++) {
          for (var y = 0; y < this.props.size; y++) {
            var color = game.board[x][y];
            if (color) {
              pieces.push(_react2['default'].createElement(Piece, { x: x, y: y, color: color, key: 'p' + x + '-' + y }));
            }
          }
        }
      }
      return pieces;
    }
  }, {
    key: 'playMove',
    value: function playMove(x, y) {
      this.state.game.move(x, y);
      this.forceUpdate();
    }
  }, {
    key: 'render',
    value: function render() {
      // TODO prefer `@autobind` from `core-decorators`
      var playMove = this.playMove.bind(this);
      return _react2['default'].createElement(
        'section',
        { className: 'game ' + this.props.className },
        _react2['default'].createElement(
          BadukBoard,
          { size: this.props.size, labelStyle: this.props.labelStyle,
            onClickEmpty: playMove
          },
          this.getPieces()
        )
      );
    }
  }]);

  return Baduk;
})(_react2['default'].Component);

Baduk.propTypes = {
  className: _react2['default'].PropTypes.string,
  size: _react2['default'].PropTypes.number,
  komi: _react2['default'].PropTypes.number,
  starPoints: _react2['default'].PropTypes.bool,
  labelStyle: _react2['default'].PropTypes.oneOf(['number', 'hybrid', 'letter'])
};

Baduk.defaultProps = {
  size: 19,
  starPoints: true,
  komi: 6.5, // this would probably be superseded by rule variants if I add those
  labelStyle: 'hybrid'
};

exports.Baduk = Baduk;
exports.BadukBoard = BadukBoard;
exports.BadukGame = BadukGame;
exports.Piece = Piece;
// we will keep the first one