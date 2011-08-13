/*
  Copyright Islam El-Ashi <islam@elashi.me>

  This file is part of El-Tetris.

  El-Tetris is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  El-Tetris is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with El-Tetris.  If not, see <http://www.gnu.org/licenses/>.
*/

ElTetrisTest = TestCase("ElTetrisTest");

/**
 * Tests the landing height feature.
 */
ElTetrisTest.prototype.testLandingHeight = function() {
  var evaluation_function = function(last_move, board) {
    return GetLandingHeight(last_move, board) * -1;
  };

  this.assertBoard([4, 6, 6, 0, 2, 5, 5, 1],
    [497, 511, 463, 351, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    evaluation_function);
};

/**
 * Tests the row transitions feature.
 */
ElTetrisTest.prototype.testRowTransitions = function() {
  var evaluation_function = function(last_move, board) {
    return GetRowTransitions(board, this.number_of_columns) * -1;
  };

  this.assertBoard([1, 1, 6, 3, 3, 3, 2, 6, 4, 2, 3, 3, 6, 4, 2, 1, 3],
    [1017, 1019, 961, 961, 771, 519, 771, 519, 769, 519, 513, 7, 1, 3, 3, 1, 3,
        3, 7, 0],
    evaluation_function);
};

/**
 * Tests the column transitions sequence.
 */
ElTetrisTest.prototype.testColumnTransitionSequence = function() {
  var evaluation_function = function(last_move, board) {
    return GetColumnTransitions(board, this.number_of_columns) * -1;
  };

  this.assertBoard([5, 1, 6, 4, 0, 0, 6],
    [126, 47, 47, 15, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    evaluation_function);
};

/**
 * Tests the column transitions feature.
 */
ElTetrisTest.prototype.testColumnTransitions = function() {
  var board = [1, 7, 0];

  assertEquals(GetColumnTransitions(board, 10), 14);
};

/**
 * Tests the number of holes feature.
 */
ElTetrisTest.prototype.testNumberOfHoles = function() {
  var evaluation_function = function(last_move, board) {
    return GetNumberOfHoles(board, this.number_of_columns) * -1;
  };

  this.assertBoard([4, 0, 1, 6, 0, 3, 0, 1, 0, 5],
    [255, 45, 13, 13, 13, 13, 13, 5, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    evaluation_function);
};

/**
 * Tests entire algorithm (game seed 33 in mdptetris).
 */
ElTetrisTest.prototype.testSeed33 = function() {
  this.assertBoard([4, 5, 3, 3, 6, 1, 4, 5, 1, 2, 6],
    [511, 507, 491, 377, 57, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //[126, 47, 47, 15, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    eltetris.evaluateBoard);//evaluation_function);
};

/**
 * Tests entire algorithm (on a small board).
 */
ElTetrisTest.prototype.testSmallBoard = function() {
  /*:DOC += <canvas id="board" width="500" height="610"></canvas></div>*/
  var renderer = new Renderer(5, 5, 20);
  eltetris = new ElTetris(5, 5, renderer);

  var piece_list = [4, 1, 2, 2, 4, 5, 6];//, 4];//, 5, 2, 2, 2];
  eltetris.piece_list = piece_list;

  ElTetris.prototype.getRandomPieceIndex = function() {
    return this.piece_list.shift();
  };

  for (var i = piece_list.length; i > 0; --i) {
    eltetris.play();
  }

  // Assert how the board should look.
  assertEquals(eltetris.board, [27,15,27,30,3]);
};

/**
 * Tests well sums.
 */
ElTetrisTest.prototype.testWellSums = function() {
  var board = [
      parseInt('00010000', 2),
      parseInt('00011000', 2),
      parseInt('01011000', 2),
      parseInt('01111101', 2),
      parseInt('01111101', 2),
      parseInt('11111001', 2),
      parseInt('00011101', 2),
      parseInt('10100101', 2)
  ].reverse();

  assertEquals(GetWellSums(board, 8), 20);
};

ElTetrisTest.prototype.assertBoard = function(piece_list, expected_board,
    evaluation_function) {
  /*:DOC += <canvas id="board" width="500" height="610"></canvas>*/

  var renderer = new Renderer(10, 20, 20);
  eltetris = new ElTetris(10, 20, renderer);

  eltetris.piece_list = piece_list;
  eltetris.evaluateBoard = evaluation_function;

  ElTetris.prototype.getRandomPieceIndex = function() {
    return this.piece_list.shift();
  };

  for (var i = piece_list.length; i > 0; --i) {
    eltetris.play();
  }

  // Assert how the board should look.
  assertEquals(eltetris.board, expected_board);
};

ElTetrisTest.prototype.testFullRowsAreDeleted = function() {
  /*:DOC += <canvas id="board" width="500" height="610"></canvas>*/
  var renderer = new Renderer(10, 20, 20);
  var tetris = new ElTetris(10, 20, renderer);

  // Fill all the columns with 'I' pieces.
  for (var i = 0; i < 10; i++) {
    tetris.playMove(tetris.board, PIECES[0][0].orientation, i);
  }

  // Expect the board to be empty, since all rows should have been cleared.
  assertEquals(tetris.board[0], 0);
};
