/* This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details. */

var renderer = new Renderer(document.getElementById("gameDiv"));

window["redraw"] = function() {
  gameState = new GameState();
  renderer.render(gameState); // Render twice to not animate everything (only draw).
  gameState.draw(); // Initial draw.
  renderer.store(gameState);
  renderer.render(gameState);
}

window["newGame"] = function() {
  localStorage.gamePosition = 0;
  localStorage.seed = Math.floor(Math.random() * 100000);
  window["redraw"]();
}

document.oncontextmenu = function() {
  return false;
};

var gameState;
if (localStorage.gamePosition > 0) {
  gameState = new GameState(JSON.parse(localStorage["gamePosition" + localStorage.gamePosition]));
  renderer.render(gameState); // Render twice to not animate everything (only draw).
  renderer.render(gameState);
  // delete localStorage.games; // So that refresh will restart game
} else {
  window["newGame"]();
}

function canUndo() {
  return localStorage.gamePosition > 1;
}

window["undo"] = function() {
  if (canUndo()) {
    localStorage.gamePosition--;
    gameState = new GameState(JSON.parse(localStorage["gamePosition" + localStorage.gamePosition]));
    renderer.render(gameState);
  }
}

if (window.applicationCache) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      window.applicationCache.swapCache();
      // App will update on next refresh.
    }
  }, false);
}
window["hidePrompt"] = function() {
  document.getElementById('chromePrompt').style.display = 'none';
}
document.getElementById('chromePrompt').className = 'animateOn';

var menu = document.getElementById('menu');
var gears = document.getElementById('gears');
gears.onmouseover = function(evt) {
  if (menu.className != "visible") {
    var undoItem = document.getElementById('undoItem');
    if (canUndo()) {
      undoItem.style.display = "block";
    } else {
      undoItem.style.display = "none";
    }

    menu.className = "visible";
    menuFocused = false;
  }
}
var menuFocused = false;

document.addEventListener("mouseover", function(evt) {
  var element = evt.target;
  while (element && element != document.body) {
    if (element == menu || element == gears) {
      menuFocused = true;
      return;
    }
    element = element.parentNode;
  }
  if (menuFocused) {
    menu.className = "";
    return;
  }

}, false);

if (typeof (chrome) == "undefined" || typeof (chrome["app"]) == "undefined"
    || chrome["app"]["isInstalled"]) {
  window["hidePrompt"]();
}