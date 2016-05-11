"use strict";
var express = require('express');
var Board = require('../lib/board');
var IA = require('../lib/ia');
var router = express.Router();

/**
 * Simple utility function that takes the game state in the session and sends it as
 * a JSON object.
 */
var sendState = function (req, res) {
  let sess = req.session;
  let board = Board.fromData(sess.board);
  res.setHeader('Content-Type', 'application/json');
  var obj = {
    WIDTH: 7,
    HEIGHT: 6,
    board: [],
    win: board.checkWin(),
  };
  for (var cell of sess.board.board) {
    obj.board.push(cell.color);
  }
  res.send(JSON.stringify(obj));
};

// root page, choice of the game type
router.get('/', function (req, res, next) {
  let sess = req.session;
  res.render('index', {});
});

// initializes a new game
router.get('/play/:vs/:color', function (req, res, next) {
  let sess = req.session;
  sess.vs = req.params.vs;
  sess.color = req.params.color;
  let board = new Board();
  if (sess.vs === 'ia' && sess.color === 'red') {
    // if IA plays first
    board = IA.play(board, 'yellow');
  }
  sess.board = board.toData();
  res.render('play', {});
});

// returns the game state that is stored in session as a JSON
router.get('/state', function (req, res, next) {
  sendState(req, res);
});

// receives a hit from the player, applies it to game state in session, and plays
// IA if applicable.
router.get('/playat/:column', function (req, res, next) {
  let sess = req.session;
  let board = Board.fromData(sess.board);

  // player ply
  board = board.play(Number(req.params.column), sess.color);

  // if player did not win, IA ply
  if (!board.checkWin().won && sess.vs === 'ia') {
    board = IA.play(board, Board.opposite(sess.color));
  }

  // save and sends new state
  sess.board = board.toData();
  sendState(req, res);
});

module.exports = router;
