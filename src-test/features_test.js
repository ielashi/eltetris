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
FeaturesTest = TestCase("FeaturesTest");

FeaturesTest.prototype.testRowTransitionsEmptyRow = function() {
  assertEquals(GetRowTransitions([0], 4), 2);
};

FeaturesTest.prototype.testRowTransitionsZigZagRow = function() {
  assertEquals(GetRowTransitions([parseInt('1010', 2)], 4), 4);
};

FeaturesTest.prototype.testColumnTransitionsEmptyColumns = function() {
  assertEquals(GetColumnTransitions([0, 0, 0, 0], 1), 1);
};

FeaturesTest.prototype.testColumnTransitionsZigZagColumn = function() {
  assertEquals(GetColumnTransitions([1, 0, 1, 0], 2), 4);
};

FeaturesTest.prototype.testNumberOfHoles = function() {
  var board = [parseInt('10101', 2),
               parseInt('01010', 2),
               parseInt('10101', 2)];

  assertEquals(GetNumberOfHoles(board, 5), 5);
};

