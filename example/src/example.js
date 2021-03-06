/* eslint-disable react/jsx-no-bind, no-console */
const React = require('react');
const ReactDOM = require('react-dom');
const { Baduk, BadukBoard, Piece } = require('react-baduk');

const App = React.createClass({ // eslint-disable-line
  render() {
    return (
      <article>
        <Baduk size={19} />
        <section>
          <BadukBoard size={19} labelStyle="hybrid"
            onClickEmpty={(x, y) => console.log(`empty ${x} ${y}`)}
          >
            <Piece x={4} y={7} color="white" onClick={() => console.log('white')} />
            <Piece x={0} y={0} color="black" onClick={() => console.log('black')} />
          </BadukBoard>
        </section>
      </article>
    );
  },
});

ReactDOM.render(<App />, document.getElementById('app'));
