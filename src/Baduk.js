/* eslint-disable react/no-multi-comp */
import React from 'react';
import _ from 'lodash';

const PIECE_RADIUS = 0.48;

class Piece extends React.Component {
  render() {
    return (
      <circle cx={`${this.props.x}`} cy={`${this.props.y}`} r={PIECE_RADIUS}
        className={`piece ${this.props.color}`} onClick={this.props.onClick}
      />
    );
  }
}

Piece.propTypes = {
  color: React.PropTypes.string,
  className: React.PropTypes.string,
  x: React.PropTypes.number.isRequired,
  y: React.PropTypes.number.isRequired,
  onClick: React.PropTypes.func,
};

class BadukBoard extends React.Component {
  getLabels() {
    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const numbers = _.range(1, 27);
    const xLabelSet = _.get({
      number: numbers,
      hybrid: letters,
      letter: letters,
    }, this.props.labelStyle, null);
    const yLabelSet = _.get({
      number: numbers,
      hybrid: numbers,
      letter: letters,
    }, this.props.labelStyle, null);

    const labelsFor = (labelSet, direction) => {
      if (!labelSet) return [];
      let tx; let ty; let labelClass;
      if (direction === 'x') {
        tx = i => `${this.props.size - 1 - i}`;
        ty = () => '-1';
        labelClass = 'label x-label';
      } else {
        tx = () => `${this.props.size}`;
        ty = i => `${i}`;
        labelClass = 'label y-label';
      }
      return _.range(this.props.size).map(i =>
        <text textAnchor="middle"
          key={`ll${i}${direction}`}
          className={labelClass} x={tx(i)} y={ty(i)}
        >
          { labelSet[i] }
        </text>
      );
    };

    return _.concat(
      labelsFor(xLabelSet, 'x'),
      labelsFor(yLabelSet, 'y'),
    );
  }
  getStarPoints() {
    // should give adaptive star point locations based on board size
    const { size } = this.props;
    const middleOffset = (size - 1) / 2;
    const sideOffset = 3; // this is the constant we should adapt to board size

    const STAR_POINT_RADIUS = 0.12;
    const starPointAt = (x, y) => (
      <circle cx={`${x}`} cy={`${y}`} r={STAR_POINT_RADIUS}
        className="star-point" key={`sp${x}-${y}`}
      />
    );

    if (size === 9) {
      // just return one star point in the case of a 9x9 board
      return [starPointAt(4, 4)];
    }

    // why no cross product, lodash?
    let locations = [
      [sideOffset, sideOffset],
      [sideOffset, size - sideOffset - 1],
      [size - sideOffset - 1, sideOffset],
      [size - sideOffset - 1, size - sideOffset - 1],
    ];
    if (size % 2) {
      // the board is a normal size, so we place 9 star points
      // we'll also begrudgingly accept the even case and return just four star points
      locations = locations.concat([
        [middleOffset, middleOffset],
        [middleOffset, sideOffset],
        [sideOffset, middleOffset],
        [middleOffset, size - sideOffset - 1],
        [size - sideOffset - 1, middleOffset],
      ]);
    }

    return locations.map((args) => starPointAt(...args));
  }
  getEmptyPieceTargets() {
    const { size } = this.props;
    return _.range(size * size).map(i => {
      const x = i % size;
      const y = Math.trunc(i / size);
      const onClickForPiece = this.props.onClickEmpty.bind(
        this, this.props.size - x - 1, y);
      return (
        <circle cx={`${x}`} cy={`${y}`} r={PIECE_RADIUS} key={`pt${i}`}
          className="piece-target" onClick={ onClickForPiece }
        />
      );
    });
  }
  render() {
    const className = _.join(_.filter(['table', this.props.className]), ' ');
    const { size } = this.props;
    const viewBox = `0 0 ${size - 1} ${size - 1}`;

    return (
      <div className={ className }>
        <div className="board">
          <svg viewBox={ viewBox }>
            <rect x="0" y="0" width={`${size - 1}`} height={`${size - 1}`} />
              { _.range(size).map(i =>
                <line key={`lx${i}`} x1="0" x2={`${size - 1}`} y1={`${i}`} y2={`${i}`} />
              )}
              { _.range(size).map(i =>
                <line key={`ly${i}`} y1="0" y2={`${size - 1}`} x1={`${i}`} x2={`${i}`} />
              )}
              { this.getLabels() }
              <g className="empty-piece-targets">
                { this.getEmptyPieceTargets() }
              </g>
              <g className="star-points">
                { this.getStarPoints() }
              </g>
              <g className="pieces" transform={`translate(${size - 1}, 0), scale(-1, 1)`}>
                { this.props.children }
              </g>
          </svg>
        </div>
      </div>
    );
  }
}

BadukBoard.propTypes = {
  className: React.PropTypes.string,
  starPoints: React.PropTypes.bool,
  size: React.PropTypes.number,
  onClickEmpty: React.PropTypes.func,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node,
  ]),
  labelStyle: React.PropTypes.oneOf([
    'number',
    'hybrid',
    'letter',
  ]),
};

BadukBoard.defaultProps = {
  size: 19, // prefer a standard, full-sized board
  // `onClickEmpty` should take the coordinates of the clicked location on the board
  onClickEmpty: _.noop,
  starPoints: true,
};

// this class contains all the logic of the game itself
class BadukGame {
  // stone values are null, 'black', and 'white'
  constructor(size, mode) {
    this.mode = mode || 'freeplay';
    this.size = size;
    this.moves = [];

    // rewinding has the effect of cleaning up and populating
    // the rest of the initial state
    this.rewindToStart();
  }
  isMoveLegal(x, y) {
    // we have to check the liberties of the played piece after captures, check
    // remanining stones, check occupancy, and compare the board to the history for ko
    const groupsForPlayer = this.toPlay === 'black' ? this.blackGroups : this.whiteGroups;
    if (this.board[x][y]) return false;
    if (this.toPlay === 'black' ? !this.blackStonesRemaining : !this.whiteStonesRemaining) {
      return false;
    }

    // this is not very efficient: we shouldn't need to peek the next state often
    // because we only need to reject the move when it attempts to play against ko
    let legal = true;
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
  koString() {
    // gets the current state of the board as a string
    return _.flatten(this.board).map(p => _.head(String(p))).join('');
  }
  mergeGroupsWithPiece(allGroups, toMerge, x, y) {
    const hash = this.hashLocation(x, y);
    let group;
    if (toMerge.length === 0) {
      group = new Set();
    } else if (toMerge.length === 1) {
      group = toMerge[0];
    } else {
      // we actually have groups to merge
      // we will keep the first one
      const [first, ...rest] = toMerge;
      group = first;
      _.each(rest, g => {
        g.forEach(h => {
          allGroups[h] = group; // eslint-disable-line no-param-reassign
          group.add(h);
        });
      });
    }
    group.add(hash);
    allGroups[hash] = group; // eslint-disable-line no-param-reassign
  }
  adjacentLocations(x, y) {
    return [
      [x, y + 1],
      [x, y - 1],
      [x + 1, y],
      [x - 1, y],
    ].filter(loc => _.every(loc, i => i >= 0 && i < this.size));
  }
  hashLocation(x, y) {
    return `${x}.${y}`;
  }
  dehashLocation(hash) {
    return hash.split('.').map(_.parseInt);
  }
  pieceHasLiberties(x, y) {
    return _.some(this.adjacentLocations(x, y), ([px, py]) => !(this.board[px][py]));
  }
  groupHasNoLiberties(group) {
    // not a very efficient implementation: a better option might be to cache
    // liberties on each group; such a strategy would also complicate merging
    return !_.some(_.toArray(group), hash =>
      this.pieceHasLiberties(...this.dehashLocation(hash))
    );
  }
  move(x, y, checkLegal = true) {
    if (checkLegal && !this.isMoveLegal(x, y)) {
      throw new Error(`Illegal move attempt at ${x} ${y}`);
    }

    this.board[x][y] = this.toPlay;

    // once the piece has been played, we must merge any groups of the side that
    // played, or else create a new group for the played piece
    const adjacentPieces = this.adjacentLocations(x, y);

    const allFriendlyGroups = this.toPlay === 'black' ? this.blackGroups : this.whiteGroups;
    const allEnemyGroups = this.toPlay === 'black' ? this.whiteGroups : this.blackGroups;

    const groupsContainingPieces = (groups, pieces) => new Set(_.filter(
      pieces.map(loc => groups[this.hashLocation(...loc)]),
      g => g)
    );

    const adjacentFriendlyGroups = groupsContainingPieces(allFriendlyGroups, adjacentPieces);
    // we did not really merge any groups if all we did was integrate one piece
    const joined = adjacentFriendlyGroups.size > 1 ?
      _.cloneDeep(_.toArray(adjacentFriendlyGroups)) :
      [];
    this.mergeGroupsWithPiece(allFriendlyGroups, _.toArray(adjacentFriendlyGroups), x, y);

    // then we must check for captures by seeing what groups were touched by the
    // played piece, and checking their liberties
    const adjacentEnemyGroups = groupsContainingPieces(allEnemyGroups, adjacentPieces);
    const captured = _.cloneDeep(_.toArray(adjacentEnemyGroups).filter(
      this.groupHasNoLiberties.bind(this)));
    _.each(captured, g => {
      if (this.toPlay === 'black') {
        this.capturedByBlack += g.size;
      } else {
        this.capturedByWhite += g.size;
      }
      for (const hash of g) {
        delete allEnemyGroups[hash];
        _.set(this.board, hash, null);
      }
    });

    // we log the move and cache any groups that might have been captured as a result
    const newMove = {
      joined, // we keep joined to make rewinding easier
      captured,
      location: [x, y],
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
  pass() {
    this.moves.push({
      location: null,
    });
    this.moveCursor += 1;
  }
  rewindToStart() {
    // different behavior than rewind to start, just sets the move cursor to 0
    // and clears the internal board
    this.positions = new Set(); // used for checking ko
    this.whiteGroups = {};
    this.blackGroups = {};
    this.moveCursor = 0;
    this.capturedByWhite = 0;
    this.capturedByBlack = 0;
    this.whiteStonesRemaining = Math.trunc((this.size * this.size) / 2);
    this.blackStonesRemaining = this.size * this.size - this.whiteStonesRemaining;
    this.toPlay = 'black';
    this.board = _.range(this.size).map(() => _.range(this.size).map(() => null));
  }
  rewind(n) {
    const nRewinds = n || 1;
    if (nRewinds > this.moveCursor) {
      throw new Error('Cannot rewind past the beginning of the game');
    }
    _.times(nRewinds, () => {
      this.moveCursor -= 1;
      const move = this.moves[this.moveCursor];

      // revert the color, give a stone back
      const enemyColor = this.toPlay;
      const allEnemyGroups = enemyColor === 'black' ? this.blackGroups : this.whiteGroups;
      const allFriendlyGroups = enemyColor === 'black' ? this.whiteGroups : this.blackGroups;
      if (this.toPlay === 'white') {
        // it WAS black's turn
        this.blackStonesRemaining += 1;
        this.toPlay = 'black';
      } else {
        this.whiteStonesRemaining += 1;
        this.toPlay = 'white';
      }

      // restore any captured groups
      for (const group of move.captured) {
        for (const stone of group) {
          // put the stone back on the board
          const [x, y] = this.dehashLocation(stone);
          this.board[x][y] = enemyColor;
          allEnemyGroups[stone] = group;
        }
      }

      // unjoin any joined groups
      for (const group of move.joined) {
        for (const stone of group) {
          allFriendlyGroups[stone] = group;
        }
      }

      // remove the placed stone
      const [x, y] = move.location;
      this.board[x][y] = null;
      delete allFriendlyGroups[this.hashLocation(x, y)];
    });
  }
  fastForward(n) {
    const nFastForwards = n || 1;
    if (nFastForwards + this.moveCursor > this.moves.length) {
      throw new Error('Cannot fast forward past the present state of the game');
    }
    const that = this;
    _.times(nFastForwards, () => {
      const [x, y] = that.moves[that.currentMove].location;
      that.move(x, y, false); // in theory we are playing an already verified move
    });
  }
}

class Baduk extends React.Component {
  componentWillMount() {
    this.setState({
      game: new BadukGame(this.props.size),
    });
  }
  getPieces() {
    const pieces = [];
    const { game } = this.state;
    if (game) {
      for (let x = 0; x < this.props.size; x++) {
        for (let y = 0; y < this.props.size; y++) {
          const color = game.board[x][y];
          if (color) {
            pieces.push(<Piece x={x} y={y} color={color} key={`p${x}-${y}`} />);
          }
        }
      }
    }
    return pieces;
  }
  playMove(x, y) {
    this.state.game.move(x, y);
    this.forceUpdate();
  }
  render() {
    // TODO prefer `@autobind` from `core-decorators`
    const playMove = this.playMove.bind(this);
    return (
      <section className={`game ${this.props.className}`}>
        <BadukBoard size={this.props.size} labelStyle={this.props.labelStyle}
          onClickEmpty={playMove}
        >
          { this.getPieces() }
        </BadukBoard>
      </section>
    );
  }
}

Baduk.propTypes = {
  className: React.PropTypes.string,
  size: React.PropTypes.number,
  komi: React.PropTypes.number,
  starPoints: React.PropTypes.bool,
  labelStyle: React.PropTypes.oneOf([
    'number',
    'hybrid',
    'letter',
  ]),
};

Baduk.defaultProps = {
  size: 19,
  starPoints: true,
  komi: 6.5, // this would probably be superseded by rule variants if I add those
  labelStyle: 'hybrid',
};

export {
  Baduk,
  BadukBoard,
  BadukGame,
  Piece,
};
