let gridSize = prompt("Input a size for the grid");
drawSquares();
function drawSquares(square) {
  $("#squareContainer").empty();
  for (let row = 0; row < gridSize; row++) {
    let rowElement = $("<div>");
    rowElement.addClass("row");
    for (let column = 0; column < gridSize; column++) {
      let squareElement = $("<div>");
      squareElement.addClass("square");
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}
