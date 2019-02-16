let validGridSize = false;
let gridSize = parseInt(Number(prompt("Input a size for the grid")));

while (validGridSize == false) {  

  if (gridSize < 2 || gridSize % 1 !== 0) {
    alert("Invalid input. Enter an integer between 2 and 100");
    gridSize = parseInt(Number(prompt("Input a size for the grid")));
  }
  else if (gridSize > 100 || gridSize % 1 !== 0) {
    alert("Invalid input. Enter an integer between 2 and 100");
    gridSize = parseInt(Number(prompt("Input a size for the grid")));
  }
  else {
    validGridSize = true;
  }
}

//Copied from Lauren's code above, asks user for number of mines
let validMineNumber = false;
let mineNumber = parseInt(Number(prompt("Input the number of mines")));

while (validMineNumber == false) {

  if (mineNumber < 1 || mineNumber % 1 !== 0) {
    alert("Invalid input. Enter an integer between 1 and " + ((gridSize * gridSize) - 1) + ".");
    mineNumber = parseInt(Number(prompt("Input the number of mines")));
  }
  else if (mineNumber > ((gridSize * gridSize) - 1) || mineNumber % 1 !== 0) {
    alert("Invalid input. Enter an integer between 1 and " + ((gridSize * gridSize) - 1) + ".");
    mineNumber = parseInt(Number(prompt("Input the number of mines")));
  }
  else {
    validMineNumber = true;
  }
}

//Creates n-dimensional array. Source below
//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length) {
  let arr = new Array(length || 0),
    i = length;

  if (arguments.length > 1) {
    let args = Array.prototype.slice.call(arguments, 1);
    while (i--) arr[length - 1 - i] = createArray.apply(this, args);
  }

  return arr;
}//end of n-dimensional arr

//Creates Global 2D array matching user-defined grid size
let arr = createArray(gridSize, gridSize);

//For storing values in the 2D array, used to create unique instance 'objects'. Can be called on by arr[x][y].<property>
function squareProperties(isClicked, isBomb, isFlagged, numNeighborMines, testingClickTimes)
{
  this.isClicked = isClicked;
  this.isBomb = isBomb;
  this.isFlagged = isFlagged;
  this.numNeighborMines = numNeighborMines;
  this.testingClickTimes = testingClickTimes;
}
//fills array with "squareProperties" object, will be used to store properties
//of the grid squares (i.e isClicked - if square has been clicked before. isBomb - if it is a mine space)
arrayFiller();
function arrayFiller() {
  for (let i = 0; i < gridSize; i++) {
    for (let k = 0; k < gridSize; k++) {
      arr[i][k] = new squareProperties(0, 0, 0, 0, 0);  //initial assignment, all properties 0
    }
  }
}

//Assigns 'isBomb' = 1 to random coordinates. 2/15: temp hard coded value until user asked for number of mines at start
randomMineAssign();
function randomMineAssign() {
  let userNumOfMines = mineNumber;  //number of mines as defined by user

  for (let i = 1; i <= userNumOfMines; i++) {
    do {
      xCoord = Math.floor(Math.random() * gridSize); //returns random number between 0 and gridSize-1;
      yCoord = Math.floor(Math.random() * gridSize); //returns random number between 0 and gridSize-1;
    } while (arr[xCoord][yCoord].isBomb != 0);   //Loop through random coordinates until a non-mine space is found (avoid multiple assignments to same square)
    arr[xCoord][yCoord].isBomb = 1;   //assign isBomb property. 0 - No, 1 - Yes
  }
}

//Going square by square, check all neighboring mines one by one. 
//If bomb found, itterate numMinesFound up by one. Set final value to arr[x][y]
checkNumNeighboringMines();
function checkNumNeighboringMines() {
  let numMinesFound = 0;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++)  //loop through every square in grid, starting at (0,0) to gridSize-1
    {
      numMinesFound = 0;

      if (isValidCoordinate((x - 1), (y)) == true) {
        if (arr[x - 1][y].isBomb == 1)  //Left
          numMinesFound++;
      }
      if (isValidCoordinate((x + 1), (y)) == true) {
        if (arr[x + 1][y].isBomb == 1)  //Right
          numMinesFound++;
      }
      if (isValidCoordinate((x), (y - 1)) == true) {
        if (arr[x][y - 1].isBomb == 1)  //Up
          numMinesFound++;
      }
      if (isValidCoordinate((x), (y + 1)) == true) {
        if (arr[x][y + 1].isBomb == 1)  //Down
          numMinesFound++;
      }
      if (isValidCoordinate((x - 1), (y - 1)) == true) {
        if (arr[x - 1][y - 1].isBomb == 1)  //Upper left corner
          numMinesFound++;
      }
      if (isValidCoordinate((x + 1), (y - 1)) == true) {
        if (arr[x + 1][y - 1].isBomb == 1)  //Upper right corner
          numMinesFound++;
      }
      if (isValidCoordinate((x - 1), (y + 1)) == true) {
        if (arr[x - 1][y + 1].isBomb == 1)  //lower left corner
          numMinesFound++;
      }
      if (isValidCoordinate((x + 1), (y + 1)) == true) {
        if (arr[x + 1][y + 1].isBomb == 1)  //lower right corner
          numMinesFound++;
      }

      arr[x][y].numNeighborMines = numMinesFound; //assigns the final number of mines found to orig. (x,y) coordinates

    }
  }
}

drawSquares();
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

$(".square").on("click", function () {
  const elementClicked = $(this);
  //$(this).addClass("empty-square");
  const xPos = elementClicked.attr("data-x-coordinate");
  const yPos = elementClicked.attr("data-y-coordinate");
  onClicked(xPos, yPos);
});

//on user clicking on a grid square. **Just For testing: should display (x, y) coordinates on grid click, plus number of times a spesific square has been clicked on
function onClicked(x, y) {
  //alert('Coordinates: (' + x + ', ' + y + ')' + "\nIs Bomb? (0/No, 1/Yes): " + arr[x][y].isBomb + "\nNum Neighboring Mines: " + arr[x][y].numNeighborMines);
  recHelperFunction(x, y);
}

//Helper function for the recursive, checks if a given square by coordinate (x, y) is 'valid' and can be used
function recHelperFunction(x, y) {
  if (arr[x][y].isBomb == 0 && isValidCoordinate(x, y) == true && arr[x][y].isClicked == 0) {  //If the square is not a bomb or bad coordinates or been clicked already
    userClick(x, y);
    if (arr[x][y].numNeighborMines < 1) {   //If the number of neighboring mines is 0, recurse. Otherwise stop
      recShowNonMineSquare(x, y);
      return;
    } else {
      return;
    }
  } else {
    return;
  }//end of bomb or coordinate statement
}

//Recursive function, moves in all directions neighboring a square at coordinates (x, y)
function recShowNonMineSquare(x, y) {

  let xInt = parseInt(x); //parse to integer (required)
  let yInt = parseInt(y);

  if (isValidCoordinate((xInt + 1), (yInt - 1)) == true) {
    recHelperFunction((xInt + 1), (yInt - 1));   //upper right
  }

  if (isValidCoordinate((xInt - 1), (yInt + 1)) == true) {
    recHelperFunction(xInt - 1, yInt + 1);   //lower left
  }

  if (isValidCoordinate((xInt + 1), (yInt + 1)) == true) {
    recHelperFunction(xInt + 1, yInt + 1);   //lower right
  }

  if (isValidCoordinate((xInt - 1), (yInt)) == true) {
    recHelperFunction(xInt - 1, yInt);  //left
  }

  if (isValidCoordinate((xInt + 1), (yInt)) == true) {
    recHelperFunction(xInt + 1, yInt);   //right
  }

  if (isValidCoordinate((xInt), (yInt - 1)) == true) {
    recHelperFunction(xInt, yInt - 1);   //up
  }

  if (isValidCoordinate((xInt), (yInt + 1)) == true) {
    recHelperFunction(xInt, yInt + 1);   //down
  }

  if (isValidCoordinate((xInt - 1), (yInt - 1)) == true) {
    recHelperFunction(xInt - 1, yInt - 1);   //upper left
  }
}//end of recShowNonMineSquare

//Changes a square's 'state' to 'clicked', change color, shows number
function userClick(x, y) {
  arr[x][y].isClicked = 1;
  let elemID = x + " " + y;
  document.getElementById(elemID).className = 'empty-square';
  document.getElementById(elemID).innerHTML = arr[x][y].numNeighborMines;
  return;
}

//valides if a given coordinate is valid on the 2D array
function isValidCoordinate(x, y) {
  if (x < gridSize && x >= 0 && y < gridSize && y >= 0) {
    return true;
  }
  return false;
}