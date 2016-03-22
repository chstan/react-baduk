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
        className="star-point"
      />
    );

    // why no cross product lodash?
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
      const onClickForPiece = this.props.onClickEmpty.bind(this, x, y);
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

export {
  Piece,
  BadukBoard,
};
