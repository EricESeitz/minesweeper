var gameEnded = 0; //Has the game ended? Prevents user input post-end. 0-no, 1-yes

//Creates Global 2D array matching user-defined grid size
let arr;
let gridSize = 0;
let boardLength = 0;
let userNumOfMines = 0; //number of mines as defined by user
let numSquaresFlaggedByUser = 0;
let numSquaresCorrectlyFlaggedByUser = 0;
//Track the total number of clicked-on squares for possible win state (all non-mine squares click, non flagged)
let numOfClickedOnSquares = 0;
let invalidGrid = true;
let invalidMines = true;

/**
 * The function that starts the game.
 */
function startGame() {
  gridSize = Number(document.getElementById("boardLength").value); // gets grid Length from form input
  userNumOfMines = Number(document.getElementById("mineAmount").value); // gets amount of mines from form input

  document.getElementById("boardLength").className = "";
  document.getElementById("mineAmount").className = "";
  let invalidGrid = isNaN(gridSize) || gridSize < 2 || gridSize > 99;
  let invalidMines =
    isNaN(userNumOfMines) ||
    userNumOfMines < 2 ||
    userNumOfMines > gridSize * gridSize - 1;
  if (invalidGrid) {
    document.getElementById("boardLength").classList.add("invalid");
  }
  if (invalidMines) {
    document.getElementById("mineAmount").classList.add("invalid");
  }
  if (!invalidGrid && !invalidMines) {
    document.getElementById("setup").style.display = "none"; //Hides Setup Form
    document.getElementById("resetButton").style.display = "block"; //Shows reset Button
    arr = createArray(gridSize, gridSize);
    arrayFiller();
    randomMineAssign();
    checkNumNeighboringMines();
    drawSquares();

    $(".square").on("click", function() {
      //$(this).addClass("empty-square");
      const elementClicked = $(this);
      const xPos = elementClicked.attr("data-x-coordinate");
      const yPos = elementClicked.attr("data-y-coordinate");
      onClicked(xPos, yPos);
    });

    /**
     * Changes a square's 'state' to 'right-clicked', change color
     */
    $(".square").mousedown(function(e) {
      const elementClicked = $(this);
      const xPos = elementClicked.attr("data-x-coordinate");
      const yPos = elementClicked.attr("data-y-coordinate");

      if (e.which == 3 && gameEnded == 0) {
        // if right-click
        if (arr[xPos][yPos].isFlagged == 1) {
          arr[xPos][yPos].isFlagged = 0;
          let elemID = xPos + " " + yPos;
          document.getElementById(elemID).className = "square";
          numSquaresFlaggedByUser--;
          if (arr[xPos][yPos].isBomb == 1) {
            numSquaresCorrectlyFlaggedByUser--;
          }
        } else if (
          arr[xPos][yPos].isFlagged == 0 &&
          arr[xPos][yPos].isClicked == 0
        ) {
          arr[xPos][yPos].isFlagged = 1;
          let elemID = xPos + " " + yPos;
          document.getElementById(elemID).className = "flagged-square";

          numSquaresFlaggedByUser++;
          if (arr[xPos][yPos].isBomb == 1) {
            numSquaresCorrectlyFlaggedByUser++;
          }
          if (
            numSquaresCorrectlyFlaggedByUser == userNumOfMines &&
            numSquaresFlaggedByUser == userNumOfMines
          ) {
            endScreen("win"); //end screen
          }
        }
        return;
      }
    });
  }
}

/**
 * Creates n-dimensional array. Source below
 * https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
 */
function createArray(length) {
  let arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    let args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
} //end of n-dimensional arr

/**
 * For storing values in the 2D array, used to create unique instance 'objects'. Can be called on by arr[x][y].<property>
 * @param {Number} isClicked
 * @param {Number} isBomb
 * @param {Number} isFlagged
 * @param {Number} numNeighborMines
 */
function squareProperties(isClicked, isBomb, isFlagged, numNeighborMines) {
  this.isClicked = isClicked;
  this.isBomb = isBomb;
  this.isFlagged = isFlagged;
  this.numNeighborMines = numNeighborMines;
}
//fills array with "squareProperties" object, will be used to store properties
//of the grid squares (i.e isClicked - if square has been clicked before. isBomb - if it is a mine space)

function arrayFiller() {
  for (let i = 0; i < gridSize; i++) {
    for (let k = 0; k < gridSize; k++) {
      arr[i][k] = new squareProperties(0, 0, 0, 0, 0); //initial assignment, all properties 0
    }
  }
}

/**
 * Assigns 'isBomb' = 1 to random coordinates. 2/15: temp hard coded value until user asked for number of mines at start
 */
function randomMineAssign() {
  for (let i = 1; i <= userNumOfMines; i++) {
    do {
      xCoord = Math.floor(Math.random() * gridSize); //returns random number between 0 and gridSize-1;
      yCoord = Math.floor(Math.random() * gridSize); //returns random number between 0 and gridSize-1;
    } while (arr[xCoord][yCoord].isBomb != 0); //Loop through random coordinates until a non-mine space is found (avoid multiple assignments to same square)
    arr[xCoord][yCoord].isBomb = 1; //assign isBomb property. 0 - No, 1 - Yes
  }
}

/**
 * Going square by square, check all neighboring mines one by one.
 * If bomb found, itterate numMinesFound up by one. Set final value to arr[x][y]
 */
function checkNumNeighboringMines() {
  let numMinesFound = 0;
  for (let x = 0; x < gridSize; x++) {
    for (
      let y = 0;
      y < gridSize;
      y++ //loop through every square in grid, starting at (0,0) to gridSize-1
    ) {
      numMinesFound = 0;

      if (isValidCoordinate(x - 1, y) == true) {
        if (arr[x - 1][y].isBomb == 1)
          //Left
          numMinesFound++;
      }
      if (isValidCoordinate(x + 1, y) == true) {
        if (arr[x + 1][y].isBomb == 1)
          //Right
          numMinesFound++;
      }
      if (isValidCoordinate(x, y - 1) == true) {
        if (arr[x][y - 1].isBomb == 1)
          //Up
          numMinesFound++;
      }
      if (isValidCoordinate(x, y + 1) == true) {
        if (arr[x][y + 1].isBomb == 1)
          //Down
          numMinesFound++;
      }
      if (isValidCoordinate(x - 1, y - 1) == true) {
        if (arr[x - 1][y - 1].isBomb == 1)
          //Upper left corner
          numMinesFound++;
      }
      if (isValidCoordinate(x + 1, y - 1) == true) {
        if (arr[x + 1][y - 1].isBomb == 1)
          //Upper right corner
          numMinesFound++;
      }
      if (isValidCoordinate(x - 1, y + 1) == true) {
        if (arr[x - 1][y + 1].isBomb == 1)
          //lower left corner
          numMinesFound++;
      }
      if (isValidCoordinate(x + 1, y + 1) == true) {
        if (arr[x + 1][y + 1].isBomb == 1)
          //lower right corner
          numMinesFound++;
      }

      arr[x][y].numNeighborMines = numMinesFound; //assigns the final number of mines found to orig. (x,y) coordinates
    }
  }
}

function drawSquares(square) {
  $("#squareContainer").empty();
  for (let row = 0; row < gridSize; row++) {
    let rowElement = $("<div>");
    rowElement.addClass("row");
    for (let column = 0; column < gridSize; column++) {
      let id = column + " " + row;
      let squareElement = $('<div id = "' + id + '">"');
      squareElement.addClass("square");
      //squareElement.append(arr[column][row].numNeighborMines);
      squareElement.attr("data-x-coordinate", column);
      squareElement.attr("data-y-coordinate", row);
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}

/**
 * on user clicking on a grid square. **Just For testing: should display (x, y) coordinates on grid click, plus number of times a spesific square has been clicked on
 * @param {Number} x - x coordinate
 * @param {Number} y - y coordinate
 */
function onClicked(x, y) {
  if (gameEnded == 0) {
    recHelperFunction(x, y);
    //If the total number of squares minus the number of clicked squares equals the number of bombs, only bombs must be left and should auto-win
    //Also check for if coordinate (x,y) is a bomb, caused issues of both fail and win messages popping up
    if (
      gridSize * gridSize - numOfClickedOnSquares == userNumOfMines &&
      arr[x][y].isBomb == 0
    ) {
      allNonMinesFound();
      return;
    }
  } else {
    return;
  }
}

/**
 * Helper function for the recursive, checks if a given square by coordinate (x, y) is 'valid' and can be used
 * @param {Number} x - x coordinate
 * @param {Number} y - y coordinate
 */
function recHelperFunction(x, y) {
  if (
    arr[x][y].isBomb == 0 &&
    isValidCoordinate(x, y) == true &&
    arr[x][y].isClicked == 0
  ) {
    //If the square is not a bomb or bad coordinates or been clicked already
    userClick(x, y);
    if (arr[x][y].numNeighborMines < 1) {
      //If the number of neighboring mines is 0, recurse. Otherwise stop
      recShowNonMineSquare(x, y);
      return;
    } else {
      return;
    }
  } else if (arr[x][y].isBomb == 1 && arr[x][y].isFlagged == 0) {
    failShowMines();
    for (let x = 0; x < 10; x++) {
      x++;
    }
    endScreen("lose"); //end screen
    return;
  } else {
    return;
  } //end of bomb or coordinate statement
}

/**
 * Recursive function, moves in all directions neighboring a square at coordinates (x, y)
 * @param {Number} x - x coordinate
 * @param {Number} y - y coordinate
 */
function recShowNonMineSquare(x, y) {
  let xInt = parseInt(x); //parse to integer (required)
  let yInt = parseInt(y);

  if (isValidCoordinate(xInt + 1, yInt - 1) == true) {
    recHelperFunction(xInt + 1, yInt - 1); //upper right
  }

  if (isValidCoordinate(xInt - 1, yInt + 1) == true) {
    recHelperFunction(xInt - 1, yInt + 1); //lower left
  }

  if (isValidCoordinate(xInt + 1, yInt + 1) == true) {
    recHelperFunction(xInt + 1, yInt + 1); //lower right
  }

  if (isValidCoordinate(xInt - 1, yInt) == true) {
    recHelperFunction(xInt - 1, yInt); //left
  }

  if (isValidCoordinate(xInt + 1, yInt) == true) {
    recHelperFunction(xInt + 1, yInt); //right
  }

  if (isValidCoordinate(xInt, yInt - 1) == true) {
    recHelperFunction(xInt, yInt - 1); //up
  }

  if (isValidCoordinate(xInt, yInt + 1) == true) {
    recHelperFunction(xInt, yInt + 1); //down
  }

  if (isValidCoordinate(xInt - 1, yInt - 1) == true) {
    recHelperFunction(xInt - 1, yInt - 1); //upper left
  }
} //end of recShowNonMineSquare

/**
 * Changes a square's 'state' to 'clicked', change color, shows number
 * @param {Number} x - x coordinate
 * @param {Number} y - y coordinate
 */
function userClick(x, y) {
  arr[x][y].isClicked = 1;
  numOfClickedOnSquares = numOfClickedOnSquares + 1;
  let elemID = x + " " + y;
  document.getElementById(elemID).className = "empty-square";
  document.getElementById(elemID).innerHTML = arr[x][y].numNeighborMines;
  if (arr[x][y].numNeighborMines == "0") {
    document.getElementById(elemID).className += " zero";
  }
  return;
}

/**
 * fail-state, displays all mines in red
 */
function failShowMines() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (arr[x][y].isBomb == 1) {
        //If it's a bomb, show it as 'exploded'
        let elemID = x + " " + y;
        document.getElementById(elemID).className = "exploded-square";
      }

      if (arr[x][y].isBomb == 0 && arr[x][y].isClicked == 0) {
        //If not a bomb, show it as 'clicked'
        userClick(x, y);
        arr[x][y].isClicked = 0; //'unclick', since user didn't actually click, just for show on end game
      }
    }
  }
}

/**
 * validates if a given coordinate is valid on the 2D array
 * @param {Number} x - x coordinate
 * @param {Number} y - y coordinate
 */
function isValidCoordinate(x, y) {
  if (x < gridSize && x >= 0 && y < gridSize && y >= 0) {
    return true;
  }
  return false;
}

/**
 * Function to show mines in green (flagged) if all non-mine squares are clicked
 */
function allNonMinesFound() {
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (arr[x][y].isBomb == 1) {
        //if bomb, show it as 'flagged'
        let elemID = x + " " + y;
        document.getElementById(elemID).className = "flagged-square";
      }
    }
  }
  endScreen("win"); //end screen
}

function endScreen(condition) {
  if (condition == "win") {
    var myHeading = document.querySelector("h2");
    myHeading.textContent = "You Won!";
    gameEnded = 1;
  } else if (condition == "lose") {
    var myHeading = document.querySelector("h2");
    myHeading.textContent = "Game Over. Try again?";
    gameEnded = 1;
  }
}
