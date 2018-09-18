export default function Square(row, col, mine, board) {
  this.row = row;
  this.col = col;
  this.mine = mine;
  this.reveal = false;
  this.flagged = false;
  this.mineNum = '';
  this.board = board;
}

Square.prototype.render = function(parent) {
  this.elem = document.createElement('div');
  this.elem.setAttribute('class', 'square hiddenSquare');
  this.text = document.createElement('span');
  this.text.setAttribute('class', 'innerText');
  this.text.innerHTML = '';
  this.elem.appendChild(this.text);
  this.elem.onclick = function(e) {
    if (e.metaKey) {
      this.toggleFlagSquare();
    } else {
      this.clickSquare();
    }
  }.bind(this);
  this.board.elem.appendChild(this.elem);
};
Square.prototype.destroy = function() {
  this.elem.remove();
};

Square.prototype.findNum = function() {
  let num = 0;
  let row = Math.max(this.row - 1, 0);
  let col = Math.max(this.col - 1, 0);
  let maxRow = Math.min(this.row + 1, this.board.rows - 1);
  let maxCol = Math.min(this.col + 1, this.board.cols - 1);
  for (let i = row; i <= maxRow; i += 1) {
    for (let j = col; j <= maxCol; j += 1) {
      if (this.board.squares[i][j].mine) {
        num += 1;
      }
    }
  }
  return num;
};

Square.prototype.findFlagNum = function() {
  let num = 0;
  let row = Math.max(this.row - 1, 0);
  let col = Math.max(this.col - 1, 0);
  let maxRow = Math.min(this.row + 1, this.board.rows - 1);
  let maxCol = Math.min(this.col + 1, this.board.cols - 1);
  for (let i = row; i <= maxRow; i += 1) {
    for (let j = col; j <= maxCol; j += 1) {
      if (this.board.squares[i][j].flagged) {
        num += 1;
      }
    }
  }
  return num;
};

Square.prototype.clickSquare = function() {
  if (this.board.gameOver) {
    this.board.newGame(this.row, this.col);
    this.board.gameOver = false;
  }
  if (!this.reveal && !this.flagged) {
    this.reveal = true;
    if (!this.board.gameOver) {
      if (this.mine) {
        this.elem.setAttribute('class', 'square mine');
        this.board.gameOver = true;
      } else {
        this.elem.setAttribute('class', 'square noMine');
        const num = this.findNum();
        this.mineNum = num ? num : '';
        this.text.innerHTML = this.mineNum;
        if (num === 0) {
          this.zeroSquare();
        }
      }
    }
  } else if (!this.flagged) {
    if (this.findFlagNum() === this.mineNum) {
      this.zeroSquare();
    }
  }
};

Square.prototype.toggleFlagSquare = function() {
  if (!this.reveal && !this.flagged) {
    this.elem.setAttribute('class', 'square hiddenSquare flag');
    this.text.innerHTML = 'F'
    this.flagged = true;
  } else if (!this.reveal && this.flagged) {
    this.elem.setAttribute('class', 'square hiddenSquare');
    this.text.innerHTML = '';
    this.flagged = false;
  }
};

Square.prototype.zeroSquare = function() {
  let row = Math.max(this.row - 1, 0);
  let col = Math.max(this.col - 1, 0);
  let maxRow = Math.min(this.row + 1, this.board.rows - 1);
  let maxCol = Math.min(this.col + 1, this.board.cols - 1);
  for (let i = row; i <= maxRow; i += 1) {
    for (let j = col; j <= maxCol; j += 1) {
      if (!this.board.squares[i][j].reveal && !(this.row === i && this.col === j)) {
        this.board.squares[i][j].clickSquare();
      }
    }
  }
};