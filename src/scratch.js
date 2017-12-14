import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class InputSquare extends React.Component {
  render() {
    return (
      <div>
        <div className="square-label">{this.props.label}</div>
        <button className="square" onKeyDown={(event) => alert(event.type + ":" + event.key)}>
          {this.props.value}
        </button>
      </div>
    );
  }
}

class InputColumn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.code,
    }
  }


  renderSquare(label, value) {
    return <InputSquare key={"is" + label} label={label} value={value}/>;
  }

  render() {
    var rows = [];
    for (let i=0; i<13;i++) {
      rows.push(<div className="row" key={"isd"+i}>{this.renderSquare(i+1, this.state.code[i])}{this.renderSquare(i+14, this.state.code[i+13])}</div>);
    }
    return <div>{rows}</div>
  }
}

class GridSquare extends React.Component {
  render() {
    return (
      <div>
        <div className="square-label">{this.props.label}</div>
        <div className="square" onKeyPress={(event) => alert(event.type + ":" + event.key)} onKeyDown={(event) => alert(event.type + ":" + event.key)}>
          {this.props.value}
        </div>
      </div>
    );
  }
}

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: props.code,
    }
  }

  //       o.push(<div>Row {i}: {gridValues[i].length}</div>);


  render() {
    var o = [];
    for (let i=0; i<gridValues.length;i++) {
      var p = [];
      for (let j=0; j<gridValues[i].length;j++) {
        p.push(<div key={"grd"+i+"/"+j}><GridSquare label={gridValues[i][j]}/></div>);
      }
      o.push(<div className="row" key={"grd"+i}>{p}</div>);
    }
    return o;
  }
}


const gridValues = [
  [ 1, 2, 3, 4, 0, 5, 6,26, 7, 3, 8, 9,10],
  [24, 0, 2, 0,25, 0, 8, 0,25, 0,11, 0,24],
];

class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      code: Array(26).fill(null),
    };
    this.state.code[4] = 'A';
    this.state.code[25] = 'B';
  }

  render() {
    return (
      <div className="game">
        <div className="game-board">
          <InputColumn code={this.state.code} />
        </div>
        <div className="grid">
          <Grid code={this.state.code} />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
