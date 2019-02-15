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

//Creates n-dimensional array. Source below
//https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length) {
  let arr = new Array(length || 0),
      i = length;

  if (arguments.length > 1) {
      let args = Array.prototype.slice.call(arguments, 1);
      while(i--) arr[length-1 - i] = createArray.apply(this, args);
  }
  
  return arr;
}//end of n-dimensional arr

//Creates Global 2D array matching user-defined grid size
let arr = createArray(gridSize, gridSize);

//Testing function, fills the array with random numbers
//to test 'connection' between clickable grid and array
/*
arrayFillerRandom();
function arrayFillerRandom()
{
  for (let i = 0; i < gridSize; i++)
  {
    for (let k = 0; k < gridSize; k++)
    {
    arr[i][k] = Math.floor(Math.random() * 101); //returns random number between 0 and 100;
    }
  }

}
*/

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
function arrayFiller()
{
  for (let i = 0; i < gridSize; i++)
  {
    for (let k = 0; k < gridSize; k++)
    {
    arr[i][k] = new squareProperties(0, 0, 0, 0, 0);  //initial assignment, all properties 0
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
      let squareElement = $("<div>");
      squareElement.addClass("square");
      squareElement.attr("data-x-coordinate", column);
      squareElement.attr("data-y-coordinate", row);
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}

$(".square").on("click", function() {
  const elementClicked = $(this);
  const xPos = elementClicked.attr("data-x-coordinate");
  const yPos = elementClicked.attr("data-y-coordinate");
  onClicked(xPos, yPos);
});

//on user clicking on a grid square. **Just For testing: should display (x, y) coordinates on grid click, plus number of times a spesific square has been clicked on
function onClicked(x, y)
{
  arr[x][y].testingClickTimes = arr[x][y].testingClickTimes + 1;  //increments testingClickTimes up by one for each click
    alert('Coordinates: (' + x + ', ' + y + ')' + "\nNum Clicked: " + arr[x][y].testingClickTimes);
}
