/* eslint-disable react/no-multi-comp */
import React from 'react';
import _ from 'lodash';

class Piece extends React.Component {
  render() {
    return (
      <circle cx={`${this.props.x}`} cy={`${this.props.y}`} r="0.48"
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
              <g transform={`translate(${size - 1}, 0), scale(-1, 1)`}>
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

export {
  Piece,
  BadukBoard,
};
