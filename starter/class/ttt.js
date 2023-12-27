const Screen = require("./screen");
const Cursor = require("./cursor");

class TTT {

  constructor() {

    this.playerO = "O";
    this.playerX = "X";
    this.turns = [this.playerX, this.playerO];
    // this.currentPlayer = this.turns[0];

    this.grid = [[' ',' ',' '],
                 [' ',' ',' '],
                 [' ',' ',' ']]

    this.cursor = new Cursor(3, 3);

    // Initialize a 3x3 tic-tac-toe grid
    Screen.initialize(this.cursor.numRows, this.cursor.numCols);
    Screen.setGridlines(true);

    // Set the initial background color to highlight the cursor's position
    this.cursor.setBackgroundColor(); // green

    // Start listening for keypress events
    // Screen.waitForInput();

    // Replace this with real commands
    Screen.addCommand('w', 'Move up', () => {
      this.cursor.up();
      Screen.render();
    });
    Screen.addCommand('s', 'Move down', () => {
      this.cursor.down();
      Screen.render();
    });
    Screen.addCommand('a', 'Move left', () => {
      this.cursor.left();
      Screen.render();
    });
    Screen.addCommand('d', 'Move right', () => {
      this.cursor.right();
      Screen.render();
    });

    Screen.addCommand('p', 'Place cursor', () => {
      const position = this.cursor.cursorCurrentPosition(); // A grid coordinate

      if (Screen.grid[position[0]][position[1]] === " ") {
        Screen.setGrid(position[0], position[1], this.turns[0]);
        TTT.rotateTurns(this.turns);
        Screen.render();

        this.gameState = TTT.checkWin(Screen.grid);
        if (this.gameState !== false) TTT.endGame(this.gameState);

      }
    })

    // game state
    /*
    We are either returning a boolean or a string
    When we return a boolean === 'Game Over', we want to avoid that.
    When return a string also ends the game
    There is an edge case where true is returned.
      Wrong it will never explicitly return true
      'T' will be return before it reaches that part of the code.

    */

    Screen.render();
  }

  static rotateTurns(turns) {
    [turns[0], turns[1]] = [turns[1], turns[0]];
    return true;
  }

  static checkWin(grid) {

    if (this.countSpaces(grid) > 0) { // There no win yet
      // Return 'X' if player X wins
      // Return 'O' if player O wins
      let horizontalWin = this.checkHorizontal(grid);
      if (horizontalWin) return horizontalWin; // Note: it will be X or O

      let verticalWin = this.checkVertical(grid);
      if (verticalWin) return verticalWin; // Note: it will be X or O

      // check for diagonal win
      let diagonalWin = this.checkDiagonal(grid);
      if (diagonalWin) return diagonalWin; // Note: it will be X or O

      return false;
    } else {
      return 'T'; // its a tie
    }

  }

  static countSpaces(grid) {
    let countedSpaces = 0;

    for (let i = 0; i < grid.length; i++) {

      for (let j = 0; j < grid.length; j++) {

        if (grid[i][j] === ' ') countedSpaces++;
      }
    }

    return countedSpaces;
  }

  static isEmptyGrid(grid) {
    let countedSpaces = 0;

    for (let i = 0; i < grid.length; i++) {

      for (let j = 0; j < grid.length; j++) {

        if (grid[i][j] === ' ') countedSpaces++;
      }
    }

    return (countedSpaces === grid.length * grid.length) ? true : false;
  }

  static checkHorizontal(grid) {

    for (let row = 0; row < grid.length; row++) {
      const collectedSymbols = [];

      for (let col = 0; col < grid[row].length; col++) {
        collectedSymbols.push(grid[row][col]);

      }

      // check for X
      if(collectedSymbols.every((symbol) => symbol === 'X')) return 'X';
      // check for O
      if(collectedSymbols.every((symbol) => symbol === 'O')) return 'O';
    }

    return false;
  }

  static checkVertical(grid) {

    for (let row = 0; row < grid.length; row++) {
      const collectedSymbols = [];

      for (let col = 0; col < grid.length; col++) {
        collectedSymbols.push(grid[col][row]);

      }

      // check for X
      if(collectedSymbols.every((symbol) => symbol === 'X')) return 'X';
      // check for O
      if(collectedSymbols.every((symbol) => symbol === 'O')) return 'O';
    }

    return false;
  }

  static checkDiagonal(grid) {
    let result = this.diagonalTopLeft(grid);
    if(result) return result;

    let result2 = this.diagonalBottomLeft(grid);
    if(result2) return result2;

    return false;
  }

  static diagonalTopLeft(grid) {
    let row = 0;
    let col = 0;

    const collectedSymbols = [];

    while(row < grid.length || col < grid.length) {
      collectedSymbols.push(grid[row][col]);

      row++;
      col++;
    }

    // check for X
    if(collectedSymbols.every((symbol) => symbol === 'X')) return 'X';
    // check for O
    if(collectedSymbols.every((symbol) => symbol === 'O')) return 'O';

    return false;
  }

  static diagonalBottomLeft(grid) {
    let row = grid.length - 1;
    let col = 0;

    const collectedSymbols = [];

    while(row >= 0) {
      collectedSymbols.push(grid[col][row]);

      row--;
      col++;
    }

    // check for X
    if(collectedSymbols.every((symbol) => symbol === 'X')) return 'X';
    // check for O
    if(collectedSymbols.every((symbol) => symbol === 'O')) return 'O';

    return false;
  }

  static endGame(winner) {
    if (winner === 'O' || winner === 'X') {
      Screen.setMessage(`Player ${winner} wins!`);
    } else if (winner === 'T') {
      Screen.setMessage(`Tie game!`);
    } else {
      Screen.setMessage(`Game Over`);
    }
    Screen.render();
    Screen.quit();
  }

}

module.exports = TTT;
