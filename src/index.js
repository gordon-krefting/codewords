import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/**
 *  Codewords
 *  TODO: navigate the grid
 *  TODO: save state
 *  TODO: variable grid values (to solve more than one puzzle)
 *  TODO: services (grep against dict; anagrammer)
 *  TODO: change simple components to functions?
 */

const gridValues = [
  [ 1, 2, 3, 4, 0, 5, 6,26, 7, 3, 8, 9,10],
  [24, 0, 2, 0,25, 0, 8, 0,25, 0,11, 0,24],
  [8, 4, 12, 2,13, 0,12,14, 5,24, 2,25,15],
  [16, 0,12, 0,24, 0, 2, 0, 5, 0, 3, 0,10],
  [14, 5,10,24,10, 5, 5, 0,25,12,26, 5, 5],
  [10, 0, 3, 0, 0, 0,17, 0, 8, 0, 0, 0, 9],
  [ 0, 0,26, 2,14, 3, 0,18,24,10,25, 0, 0],
  [25, 0, 0, 0, 4, 0, 5, 0, 0, 0,15, 0, 6],
  [23,19, 2, 3,15, 0, 1,25, 3,25,20,10,24],
  [ 3, 0, 8, 0,10, 0,10, 0,10, 0, 8, 0,14],
  [25, 8,24,10, 3, 2, 4, 0,10,21, 3,10, 9],
  [ 8, 0,10, 0,21, 0, 9, 0, 6, 0,25, 0,22],
  [15, 2, 3,20, 2,14, 5,10, 0,23,24,25,26],
];

// This is kind of dumb
const shadedSquares = [
  "0,0","0,1","0,2","0,3",
  "12,9","12,10","12,11","12,12",
];


class Game extends React.Component {

  constructor(props) {
    super(props);

    console.log("Starting");

    let codeCounts = new Map();
    for (let row of gridValues) {
      for (let value of row) {
        if (codeCounts.has(value)) {
          codeCounts.set(value, codeCounts.get(value)+1);
        } else {
          codeCounts.set(value, 1);
        }
      }
    }
    let popularCodes = Array.from(codeCounts.keys());
    popularCodes.sort(function (a, b) {
      return codeCounts.get(b) - codeCounts.get(a);
    });

    this.state = {
      encodingMap:  new Map(),
      decodingMap:  new Map(),
      selected:     0,
      codeCounts:   codeCounts,
      popularCodes: popularCodes,
    };
  }

  render() {
    return (
      <div id="game">
        <div className="title">CROSSWORDS #6</div>
        <div className="row">
          <div className="input-column">{this.renderInputColumn()}</div>
          <div className="grid">{this.renderGrid()}</div>
          <div className="alpha-column">{this.renderAlphaColumn()}</div>
          <div className="code-count-column">{this.renderCodeCountColumn()}</div>
        </div>
        <div className="row">
          <div className="controls"><div id="clear-button" onClick={() => this.handleClearButton()}>Clear</div></div>
          <div id="instructions">In the crossword puzzle above, every letter is represented by an integer from
            1 through 26.
            You must decipher the code to reveal the words.<br/><br/>
            Arrange the letters in the shaded spaces to spell the final answer, an eight-letter word.
          </div>
        </div>
        <div className="row">
          <MatchForm />
        </div>
      </div>
    );
  }

  renderInputColumn() {
    var rows = [];
    for (let i=0; i<13;i++) {
      rows.push(
        <div className="row" key={"ColumnDiv"+i}>
          <InputSquare
            key={"InputSquare" + i}
            label={i+1}
            value={this.state.decodingMap.get(i+1+"")}
            selected={this.state.selected}
            onClick={() => this.handleInputColumnClick(i)}/>
          <InputSquare
            key={"InputSquare" + i + 13}
            label={i+14}
            value={this.state.decodingMap.get(i+14+"")}
            selected={this.state.selected}
            onClick={() => this.handleInputColumnClick(i+13)}/>
        </div>
      );
    }
    return rows;
  }

  renderGrid() {
    var o = [];
    for (let i=0; i<gridValues.length;i++) {
      var p = [];
      for (let j=0; j<gridValues[i].length;j++) {
        let a = i + "," + j;
        let shaded = shadedSquares.includes(a);
        p.push(
          <GridSquare
            key={"grd"+i+"/"+j}
            value={this.state.decodingMap.get(gridValues[i][j]+"")}
            label={""+gridValues[i][j]}
            shaded={shaded}/>
          );
      }
      o.push(<div className="row" key={"grd"+i}>{p}</div>);
    }
    return o;
  }

  renderAlphaColumn() {
    var rows = [];
    for (let i=0; i<13;i++) {
      let leftChar  = String.fromCharCode(97+i);
      let leftStrikeStyle = this.state.encodingMap.get(leftChar) === undefined ? "" : " strike"
      let rightChar = String.fromCharCode(97+13+i);
      let rightStrikeStyle = this.state.encodingMap.get(rightChar) === undefined ? "" : " strike"
      rows.push(
        <div className="row" key={"AlphaColumnDiv"+i}>
          <div className={"alpha-square" + leftStrikeStyle}>
            {leftChar.toUpperCase()}
          </div>
          <div className={"alpha-square" + rightStrikeStyle}>
            {rightChar.toUpperCase()}
          </div>
        </div>
      );
    }
    return rows;
  }

  renderCodeCountColumn() {
    var rows = [];
    for (let i=1; i<14;i++) {
      rows.push(
        <div className="row">
          <div className="code-count-square">
            <div className="square-label">{i}</div>
            <div className="code-count-value"><i>{this.state.codeCounts.get(i)}</i></div>
          </div>
          <div className="code-count-square">
            <div className="square-label">{i+13}</div>
            <div className="code-count-value"><i>{this.state.codeCounts.get(i+13)}</i></div>
          </div>
        </div>
      );
    }
    return rows;
  }

  handleInputColumnClick(i) {
    this.setState({
      selected: i,
    });
    return;
  }

  handleClearButton() {
    this.setState({
      encodingMap: new Map(),
      decodingMap: new Map(),
      selected:    0,
    });
    return;
  }

  handleKeyDown(key) {
    let sel = this.state.selected;

    console.log(key);

    if (["ArrowDown", "ArrowRight", "ArrowLeft", "ArrowUp"].includes(key)) {
      if (key === "ArrowDown" && sel !== 12 && sel !== 25) {
        sel++;
      }
      else if (key === "ArrowUp" && sel !== 0 && sel !== 13) {
        sel--;
      }
      else if (key === "ArrowLeft" && sel > 12) {
        sel = sel-13;
      }
      else if (key === "ArrowRight" && sel < 13) {
        sel = sel+13;
      }
      this.setState({
        selected: sel,
      });
      return;
    }

    if ((key >= 'a' && key <= 'z') || key === ' ' || key === 'Backspace') {
      // TODO figure out if this is right (do we really need to create new maps?)
      let encodingMap = new Map(this.state.encodingMap);
      let decodingMap = new Map(this.state.decodingMap);

      let newEncoding = 1+sel+"";

      if (key === ' ' || key === 'Backspace') {
        if (decodingMap.get(newEncoding)) {
          encodingMap.delete(decodingMap.get(newEncoding));
          decodingMap.delete(newEncoding);
        }

      }
      else {
        if (decodingMap.get(newEncoding)) {
          encodingMap.delete(decodingMap.get(newEncoding));
        }

        if (encodingMap.get(key)) {
          decodingMap.delete(encodingMap.get(key));
        }

        encodingMap.set(key,newEncoding);
        decodingMap.set(newEncoding,key);
      }

      this.setState({
        encodingMap: encodingMap,
        decodingMap: decodingMap,
      })
      return;
    }
  }

  componentDidMount() {
    window.addEventListener("keydown", (event) => this.handleKeyDown(event.key));
  }

}

class InputSquare extends React.Component {
  render() {
    let selectedStyle = 1+this.props.selected === this.props.label ? " selected" : "";
    let displayVal = this.props.value === undefined ? undefined : this.props.value.toUpperCase();
    return (
      <div className={"square" + selectedStyle}>
        <div className="square-label">{this.props.label}</div>
        <div className="square-button" onClick={this.props.onClick}>
          {displayVal}
        </div>
      </div>
    );
  }
}

class GridSquare extends React.Component {
  render() {
    let blockStyle = this.props.label === "0" ? " block" : "";
    let displayVal = this.props.value === undefined ? undefined : this.props.value.toUpperCase();
    let shadedStyle = this.props.shaded ? " shaded" : "";
    return (
      <div className={"square" + blockStyle + shadedStyle}>
        <div className="square-label">{this.props.label}</div>
        <div className="square-button" onClick={this.props.onClick}>
          {displayVal}
        </div>
      </div>
    );
  }
}



class MatchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    fetch('http://localhost:10010/matching_words?q='+this.state.value)
      .then( result => result.json())
      .then( items => alert(items));
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Match:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Match" />
      </form>
    );
  }
}





ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
