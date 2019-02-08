let gridSize = prompt("Input a size for the grid");
drawSquares();
function drawSquares(square) {
  $("#squareContainer").empty();
  let id = 0;
  for (let row = 0; row < gridSize; row++) {
    let rowElement = $("<div>");
    rowElement.addClass("row");
    for (let column = 0; column < gridSize; column++) {
      let squareElement = $("<div>");
      squareElement.addClass("square");
      squareElement.attr("id", id);
      id++;
      rowElement.append(squareElement);
    }
    $("#squareContainer").append(rowElement);
  }
}
