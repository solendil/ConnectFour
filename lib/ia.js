"use strict";
var range = require('../lib/range');
var Board = require('../lib/board');
// depth of IA analysis; depth 3 is instant, 4 takes ~600ms, 5 takes >3s, etc...
var IA_DEPTH = 3;

class IA {

  /**
   * Standard negamax implementation https://en.wikipedia.org/wiki/Negamax
   * @param {Board} board - The initial board
   * @param {Number} depth - Depth of analysis
   * @param {Number} posneg - The flip-flop status, can be +1 or -1, see algorithm reference
   * @param {Number} color - Color to optimize, either 'red' or 'yellow'
   * @returns - an object {value, hit} giving the optimum value, and the optimum hit (column number)
   */
  static negamax(board, depth, posneg, color) {
    // activate this variable to get debug information on the running algorithm
    // this mechanism should be moved to a proper logging framework
    var debug = false,
      pad;
    if (debug) {
      pad = new Array((4 - depth) * 4).join(' ');
      console.log(pad, "> negamax", depth, posneg);
      console.log(board.toString(pad));
    }
    let win = board.checkWin();
    if (win.won) {
      // if the game is won, returns the highest evaluation possible
      let heur = -1000;
      if (debug) {
        console.log(pad, "< end won", heur);
      }
      return {
        value: heur,
        hit: null
      };
    } else if (depth === 0) {
      // if maximum depth is reached, returns a heuristic for this position
      let heur = posneg * board.heuristic(color);
      if (debug) {
        console.log(pad, "< end depth", heur);
      }
      return {
        value: heur,
        hit: null
      };
    }

    // apply negamax on all possible children
    let bestValue = Number.NEGATIVE_INFINITY;
    let bestHit = Number.NEGATIVE_INFINITY;
    for (let column of board.possibleMoves()) {
      let childBoard = board.play(column, posneg < 0 ? Board.opposite(color) : color);
      let neg = IA.negamax(childBoard, depth - 1, -posneg, color);
      let value = -neg.value;
      if (value > bestValue) {
        bestValue = value;
        bestHit = column;
      }
      bestValue = Math.max(value, bestValue);
    }

    if (debug) {
      console.log(pad, "< end best hit", bestHit, "value", bestValue);
    }
    return {
      value: bestValue,
      hit: bestHit
    };
  }

  /**
   * Plays a single ply on a board.
   * @param {Board} board - The board to play on
   * @param {String} color - The color to play, 'red' or 'yellow'
   * @returns - The new board
   */
  static play(board, color) {
    var nega = IA.negamax(board, IA_DEPTH, 1, color);
    return board.play(nega.hit, color);
  }
}

module.exports = IA;
