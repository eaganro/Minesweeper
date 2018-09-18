import Board from './Board.js';
const app = document.getElementById('app');

const board = new Board(15, 15, app);
board.newGame();