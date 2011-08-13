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
 * A renderer for El-Tetris.
 *
 * Uses HTML5 canvas to draw the game.
 */

function Renderer(numberOfColumns, numberOfRows, squareSize) {
  this.numberOfRows = numberOfRows;
  this.numberOfColumns = numberOfColumns;
  this.squareSize = squareSize;
  this.context = document.getElementById('board').getContext("2d");
  this.startX = 0.5;
  this.startY = 0.5;
}

Renderer.prototype.drawGrid = function() {
  var nColumnLines = this.numberOfColumns + 1;

  this.context.beginPath();
  for (var x = 0.5, i = 0; i < nColumnLines; x += this.squareSize, i++) {
    this.context.moveTo(x, 0);
    this.context.lineTo(x, this.numberOfRows * this.squareSize);
  }

  var nRowLines = this.numberOfRows + 1;
  for (var y = 0.5, i = 0; i < nRowLines; y += this.squareSize, i++) {
    this.context.moveTo(0, y);
    this.context.lineTo(this.numberOfColumns * this.squareSize, y);
  }

  this.context.strokeStyle = "#eee";
  this.context.stroke();
};

Renderer.prototype.draw = function(board) {
  // Clear the drawing grid.
  this.context.clearRect(0, 0, 500, 500);

  // Draw grid
  this.drawGrid();

  // Fill cells
  for (var row = 0; row < this.numberOfRows; row++) {
    this.fillRow(row, board[row]);
  }
};

Renderer.prototype.fillCell = function(x, y, color) {
  this.context.fillStyle = color;
  this.context.fillRect(
      this.startX + (x * this.squareSize),
      this.startY + ((this.numberOfRows - 1 - y) * this.squareSize),
      this.squareSize,
      this.squareSize);
};

Renderer.prototype.fillRow = function(rowNumber, rowValue) {
  for (var i = 0; i < this.numberOfColumns && rowValue !== 0; i++) {
    if (rowValue & 1) {
      this.fillCell(i, rowNumber, "#00FF00");
    }
    rowValue = rowValue >> 1;
  }
};
