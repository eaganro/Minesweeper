import Square from './Square.js';
export default function Board(rows, cols, parent) {
  this.rows = rows;
  this.cols = cols;
  this.height = rows * 40;
  this.width = cols * 40;
  this.squares = [];
  this.gameOver = true;
  this.parentElem = parent;
}

Board.prototype.render = function() {
  this.elem = document.createElement('div');
  Object.assign(this.elem.style, {
    height: `${this.height}px`,
    width: `${this.width}px`,
    border: '1px solid black',
  });
  this.parentElem.appendChild(this.elem);
  this.squares.forEach(s => s.forEach(q => q.render()));
};

Board.prototype.destroy = function() {
  this.elem.remove();
};

Board.prototype.newGame = function(startRow = this.rows + 5, startCol = this.cols + 5) {
  if (this.squares.length) {
    this.destroy();
    this.squares.forEach(s => s.forEach(q => q.destroy()));
  }
  this.squares = [];
  const mines = [];
  let mineNum = 0;
  for (let row = 0; row < this.rows; row += 1) {
    mines.push([]);
    for (let col = 0; col < this.cols; col += 1) {
      mines[row].push(false);
    }
  }

  while (mineNum < 40) {
    const col = Math.floor(Math.random() * this.cols);
    const row = Math.floor(Math.random() * this.rows);
    if (!mines[row][col] && !(Math.abs(startRow - row) <= 1 && Math.abs(startCol - col) <= 1)) {
      mines[row][col] = true;
      mineNum += 1;
    }
  }

  for (let row = 0; row < this.rows; row += 1) {
    this.squares.push([]);
    for (let col = 0; col < this.cols; col += 1) {
      this.squares[row].push(new Square(row, col, mines[row][col], this));
    }
  }

  this.render();
}