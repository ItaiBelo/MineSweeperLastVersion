'use strict'
function createMines(board, size) {
    if (size === 4) {
        for (var i = 0; i < 2; i++) {
            createMine(board)
        }
    }
    else if (size === 8) {
        for (var i = 0; i < 14; i++) {
            createMine(board)
        }
    }
    else {
        for (var i = 0; i < 31; i++) {
            createMine(board)
        }
    }
}

function createMine(board) {
    const newMine = {
        location: {
            i: getRandomIntInclusive(0, board.length - 1),
            j: getRandomIntInclusive(0, board.length - 1)
        },
    }
    if (isAvailable(board[newMine.location.i][newMine.location.j])) {
        board[newMine.location.i][newMine.location.j].isMine = true
    }
    else (createMine(board))
}

function isAvailable(currCell) {
    if (currCell.isShown || currCell.isMarked || currCell.isMine) return false
    return true
}