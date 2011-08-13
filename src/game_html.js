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
$(function() {
  $("#num_column_slider").slider({
      min:4, 
      max: 10,
      change: function( event, ui ) {
        $("#num_columns").val(ui.value);
      },
      slide: function( event, ui ) {
        $("#num_columns").val(ui.value);
      },
      value: 10
    });
  $("#num_row_slider").slider({
      min:4,
      max: 20,
      change: function(event, ui) {
        $("#num_rows").val(ui.value);
      },
      slide: function(event, ui) {
        $("#num_rows").val(ui.value);
      },
      value: 20
    });
  $("#speed_slider").slider({
      min:1,
      max: 100,
      change: function(event, ui) {
        wait_interval = 1000 / parseInt($("#speed_slider").slider("value"));
        $("#speed").val(ui.value);
      },
      slide: function(event, ui) {
        wait_interval = 1000 / parseInt($("#speed_slider").slider("value"));
        $("#speed").val(ui.value);
      },
      value: 50,
    });
  $("#num_columns").val($("#num_column_slider").slider("value"));
  $("#num_rows").val($("#num_row_slider").slider("value"));
  $("#speed").val($("#speed_slider").slider("value"));
  wait_interval = 1000 / parseInt($("#speed_slider").slider("value"));

  $( "#play" ).button({
      text: false,
      icons: {
        primary: "ui-icon-play"
      }
    })
    .click(function() {
      var options;
      if ( $( this ).text() === "play" ) {
        // Un-pause the game
        paused = false;

        if (game_started) {
          play();
        } else {
          startGame(parseInt($("#num_columns").val()),
              parseInt($("#num_rows").val()));
        }
        options = {
          label: "pause",
          icons: {
            primary: "ui-icon-pause"
          }
        };
      } else {
        paused = true;
        options = {
          label: "play",
          icons: {
            primary: "ui-icon-play"
          }
        };
      }
      $( this ).button( "option", options );
    });
    $( "#stop" ).button({
      text: false,
      icons: {
        primary: "ui-icon-stop"
      }
    })
    .click(function() {
      paused = true;
      game_started = false;
      enableSliders();
      $( "#play" ).button( "option", {
        label: "play",
        icons: {
          primary: "ui-icon-play"
        }
      });
    });
  $( "#hardcore" ).button().click(function() {
    if (!hardcore) {
      if (confirm("Hardcore mode speeds up the game by using more of your " +
          "computer's resources. Your browser may feel sluggish. Continue?")) {
        hardcore = true;
      } else {
        $('#hardcore').prop('checked', false);
        $('#hardcore_label').removeClass("ui-state-active");
      }
    } else {
      hardcore = false;
    }
  });
});

function disableSliders() {
  $("#num_column_slider").slider("disable");
  $("#num_row_slider").slider("disable");
}

function enableSliders() {
  $("#num_column_slider").slider("enable");
  $("#num_row_slider").slider("enable");
}

var paused = false;
var game_started = false;
var hardcore = false;
var renderer = new Renderer(10, 20, 20);
var eltetris = new ElTetris(10, 20, renderer);

renderer.draw(eltetris.board);

function play() {
  var counter = 0;

  while (!paused) {
    var last_move = eltetris.play();

    if (!last_move.game_over) {
      if (!hardcore) {
        renderer.draw(eltetris.board);

        if (last_move.rows_removed > 0) {
          // Update the score
          document.getElementById('score').innerHTML = eltetris.rows_completed;
        }

        setTimeout(play, wait_interval);
        return;
      }

      if (counter == 10000) {
        // Update the score
        document.getElementById('score').innerHTML = eltetris.rows_completed;
        setTimeout(play, 1);
        return;
      }
    } else {
      document.getElementById('score').innerHTML = eltetris.rows_completed;
      alert('Game over. Rows completed: ' + eltetris.rows_completed);
      $("#stop").click();
      return;
    }

    ++counter;
  }
}

function playHardcore() {
  var counter = 0;
  while (eltetris.play()) {
    ++counter;

    if (counter == 10000) {
      document.getElementById('score').innerHTML = eltetris.rows_completed;
      counter = 0;
    }
  }

  alert('Game over. Completed ' + eltetris.rows_completed);
  $("#stop").click();
}

function startGame(num_columns, num_rows) {
  renderer = new Renderer(num_columns, num_rows, 20);
  eltetris = new ElTetris(num_columns, num_rows, wait_interval);
  game_started = true;
  disableSliders();
  play();
}
