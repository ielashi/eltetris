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

/**
 * This file is the core of the El-Tetris algorithm.
 *
 * Features that are used by the algorithm are implemented here.
 */

function GetLandingHeight(last_move, board) {
  return last_move.landing_height + ((last_move.piece.length - 1) / 2);
}

function GetRowTransitions(board, num_columns) {
  var transitions = 0;
  var last_bit = 1;

  for (var i = 0; i < board.length; ++i) {
    var row = board[i];

    for (var j = 0; j < num_columns; ++j) {
      var bit = (row >> j) & 1;
      
      if (bit != last_bit) {
        ++transitions;
      }

      last_bit = bit;
    }

    if (bit == 0) {
      ++transitions;
    }
    last_bit = 1;
  }
  return transitions;
}

function GetColumnTransitions(board, num_columns) {
  var transitions = 0;
  var last_bit = 1;

  for (var i = 0; i < num_columns; ++i) {
    for (var j = 0; j < board.length; ++j) {
      var row = board[j];
      var bit = (row >> i) & 1;
      
      if (bit != last_bit) {
        ++transitions;
      }

      last_bit = bit;
    }

    last_bit = 1;
  }
  
  return transitions;
}

function GetNumberOfHoles(board, num_columns) {
  var holes = 0;
  var row_holes = 0x0000;
  var previous_row = board[board.length - 1];

  for (var i = board.length - 2; i >= 0; --i) {
    row_holes = ~board[i] & (previous_row | row_holes);

    for (var j = 0; j < num_columns; ++j) {
      holes += ((row_holes >> j) & 1);
    }

    previous_row = board[i];
  }

  return holes;
}

function GetWellSums(board, num_columns) {
  var well_sums = 0;

  for (var i = 1; i < num_columns - 1; ++i) {
    for (var j = board.length - 1; j >= 0; --j) {
      if ((((board[j] >> i) & 1) == 0) && 
        (((board[j] >> (i - 1)) & 1) == 1) &&
        (((board[j] >> (i + 1)) & 1) == 1)) {
        // Found well cell, count it + the number of empty cells below it.

        ++well_sums;
        for (var k = j - 1; k >= 0; --k) {
          if (((board[k] >> i) & 1) == 0) {
            ++well_sums;
          } else {
            break;
          }
        }
      }
    }
  }

  for (var j = board.length - 1; j >= 0; --j) {
    if ((((board[j] >> 0) & 1) == 0) && 
      (((board[j] >> (0 + 1)) & 1) == 1)) {
      // Found well cell, count it + the number of empty cells below it.

      ++well_sums;
      for (var k = j - 1; k >= 0; --k) {
        if (((board[k] >> 0) & 1) == 0) {
          ++well_sums;
        } else {
          break;
        }
      }
    }
  }

  for (var j = board.length - 1; j >= 0; --j) {
    if ((((board[j] >> (num_columns - 1)) & 1) == 0) && 
      (((board[j] >> (num_columns - 2)) & 1) == 1)) {
      // Found well cell, count it + the number of empty cells below it.

      ++well_sums;
      for (var k = j - 1; k >= 0; --k) {
        if (((board[k] >> (num_columns - 1)) & 1) == 0) {
          ++well_sums;
        } else {
          break;
        }
      }
    }
  }

  return well_sums;
}
