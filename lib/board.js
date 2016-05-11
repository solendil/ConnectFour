"use strict";
var range = require('../lib/range');

var WIDTH = 7;
var HEIGHT = 6;
var SIZE = WIDTH * HEIGHT;

class Board {

  /**
   * Builds a board.
   * @constructor
   * @param {Board} other - Optional board to clone
   */
  constructor(other) {
    this.board = [SIZE];
    if (!other) {
      this.hit = 0;
      for (let i of range(0, SIZE)) {
        this.board[i] = {
          color: 'none'
        };
      }
    } else {
      this.hit = other.hit;
      for (let i of range(0, SIZE)) {
        this.board[i] = Object.assign({}, other.board[i]);
      }
    }
  }

  /**
   * Checks if this board has been won and returns a status object. This method
   * is unreliable if the board is invalid (i.e. multiple winning streaks)
   * @returns {Object} - an object with the following properties:
   *   won : true or false
   *   color : if won is true, color is 'red' or 'yellow'
   *   cells : if won is true, an array of 4 objects {i,j}, the cells of the winning streak
   */
  checkWin() {
    let lastCells = [];
    let getWinObject = function (color) {
      return {
        won: true,
        color,
        cells: lastCells.slice(lastCells.length - 4)
      };
    };

    // check horizontal lines for a 4-streak
    for (let j of range(0, HEIGHT)) {
      let color = 'none';
      let streak = 1;
      for (let i of range(0, WIDTH)) {
        lastCells.push({
          i,
          j
        });
        let cell = this.board[j * WIDTH + i];
        if (cell.color !== 'none' && cell.color === color) {
          streak++;
          if (streak === 4) {
            return getWinObject(cell.color);
          }
        } else {
          color = cell.color;
          streak = 1;
        }
      }
    }
    // check vertical lines for a 4-streak
    for (let i of range(0, WIDTH)) {
      let color = 'none';
      let streak = 1;
      for (let j of range(0, HEIGHT)) {
        lastCells.push({
          i,
          j
        });
        let cell = this.board[j * WIDTH + i];
        if (cell.color !== 'none' && cell.color === color) {
          streak++;
          if (streak === 4) {
            return getWinObject(cell.color);
          }
        } else {
          color = cell.color;
          streak = 1;
        }
      }
    }
    // check downward diagonals for a 4-streak
    // iterated diagonals start or end outside of board; only cells inside are considered
    for (let i of range(0 - HEIGHT + 4, WIDTH - 4 + 1)) {
      let color = 'none';
      let streak = 1;
      for (let j of range(0, HEIGHT)) {
        let truei = i + j;
        if (truei < 0 || truei >= WIDTH) {
          continue;
        }
        lastCells.push({
          i: truei,
          j
        });
        let cell = this.board[j * WIDTH + truei];
        if (cell.color !== 'none' && cell.color === color) {
          streak++;
          if (streak === 4) {
            return getWinObject(cell.color);
          }
        } else {
          color = cell.color;
          streak = 1;
        }
      }
    }
    // check upward diagonals for a 4-streak
    // iterated diagonals start or end outside of board; only cells inside are considered
    for (let i of range(0 - HEIGHT + 4, WIDTH - 4 + 1)) {
      let color = 'none';
      let streak = 1;
      for (let j of range(HEIGHT, 0)) {
        let truei = i + (HEIGHT - j - 1);
        if (truei < 0 || truei >= WIDTH) {
          continue;
        }
        lastCells.push({
          i: truei,
          j
        });
        let cell = this.board[j * WIDTH + truei];
        if (cell.color !== 'none' && cell.color === color) {
          streak++;
          if (streak === 4) {
            return getWinObject(cell.color);
          }
        } else {
          color = cell.color;
          streak = 1;
        }
      }
    }
    // nothing has been found
    return {
      won: false
    };
  }

  /**
   * Get possible moves on this board.
   * @return {Array} - Array of columns where it is possible to play
   */
  possibleMoves() {
    let res = [];
    for (let i of range(0, WIDTH)) {
      if (this.board[i].color === 'none') {
        res.push(i);
      }
    }
    return res;
  }

  /**
   * Returns a new board where player 'color' played on 'column'.
   * @param {number} column - Zero-based column number
   * @param {string} color - Color of the token, must be either 'yellow' or 'red'
   */
  play(column, color) {
    // verify validity of arguments
    if (color !== 'yellow' && color !== 'red') {
      throw 'Invalid color ' + color;
    }

    if (column < 0 || column >= WIDTH) {
      throw 'Invalid column ' + column;
    }

    // clone board
    let res = new Board(this);

    // iterate column bottom-up finding the first empty cell
    for (let j of range(HEIGHT, 0)) {
      let cell = res.board[j * WIDTH + column];
      if (cell.color === 'none') {
        // play at this cell
        cell.color = color;
        cell.hit = res.hit++;
        return res;
      }
    }

    // no free cell found, raise exception
    throw 'Column full';
  }

  /**
   * Returns a string representation of this board for debugging purposes.
   * @param {number} padding - Optional padding
   */
  toString(padding) {
    padding = padding || "";
    let res = padding;
    for (let j of range(0, HEIGHT)) {
      for (let i of range(0, WIDTH)) {
        let color = this.board[j * WIDTH + i].color;
        switch (color) {
        case 'none':
          res += "_ ";
          break;
        case 'yellow':
          res += "O ";
          break;
        case 'red':
          res += "X ";
          break;
        }
      }
      res += "\n" + padding;
    }
    return res;
  }

  /**
   * Returns a heuristic value for this board from the point of view of a player.
   * This simple heuristic values tokens in the central columns.
   * @param {number} color - The player to consider
   * @returns {Number} - The heuristic value, in the range -60..60 for a standard board
   */
  heuristic(color) {
    let res = 0;
    for (let i of range(0, WIDTH)) {
      // central column is strongest, ie 1, 2, 3, 4, 3, 2, 1
      let colStrength = Math.trunc(WIDTH / 2) + 1 - Math.abs(Math.trunc(WIDTH / 2) - i);
      for (let j of range(0, HEIGHT)) {
        if (color === this.board[j * WIDTH + i].color) {
          res += colStrength;
        } else if ('none' !== this.board[j * WIDTH + i].color) {
          res -= colStrength;
        }
      }
    }
    return res;
  }

  /**
   * @returns {Object} - This object without its methods (can be represented as JSON)
   */
  toData() {
    return {
      hit: this.hit,
      board: this.board
    };
  }

  /**
   * Builds a Board from a naked data object.
   * @see toData()
   * @param {Object} data - Data issued from toData()
   * @returns {Board} - A proper Board object
   */
  static fromData(data) {
    let res = new Board();
    res.hit = data.hit;
    res.board = data.board;
    return res;
  }

  /**
   * Utility method returning the opposite of the given color.
   * @param {String} color - 'red' or 'yellow'
   * @returns {String} - 'yellow' or 'red'
   */
  static opposite(color) {
    if (color === 'red') {
      return 'yellow';
    }
    if (color === 'yellow') {
      return 'red';
    }
    throw 'Invalid color';
  }
}

module.exports = Board;
