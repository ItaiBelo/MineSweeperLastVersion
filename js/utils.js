'use strict'
const victorySound = new Audio('audio/victory.mp3')
const gameOverSound = new Audio('audio/gameOver.wav')
const elLevels = document.querySelector('.levels')
var elSmiley = document.querySelector('.smiley button')
var gElSec = document.querySelector('.sec')
var gCurrSec = gElSec.innerText


const HAPPY = '😁'
const HURT = '😐'
const AWCH = '😥'
const DEAD = ' 😱'
const TROPHY = '🏆'

function createBoard(size) {
    const board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] =
            {
                minesAroundCount: 0,
                neighborsShown: false,
                isShown: false,
                isMine: false,
                isMarked: false
            }
        }
    }
    return board
}

function runTimer() {
    changeElements()
    gIntervalTimer = setInterval(timer, 1000)
    gIsBoardClean = false
}

function changeElements() {
    elLevels.innerHTML = `  <button class="bulb" onclick="onUseHint()"> 💡 </button>
    <h6> hints left: ${gHintsLeft}</h6>`
    elLevels.style.fontSize = '35px'
    elSmiley.innerText = HAPPY
    elSmiley.style.display = 'block'
    elSmiley.style.fontSize = '25px'
}

function timer() {
    //sec
    gCurrSec++
    gElSec.innerText = gCurrSec
    //min
    var elMin = document.querySelector('.min')
    var currMin = elMin.innerText
    if (gCurrSec > 60) {
        currMin++
        elMin.innerText = currMin
        //need to reset the sec
        gCurrSec = 0
        gElSec.innerText = gCurrSec
    }
    gIsBoardClean = false
}

function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]
            // var cellData = 'data-i="' + i + '" data-j="' + j + '"'
            var className = `cell cell-${i}-${j}`
            const minesAround = currCell.minesAroundCount = setMinesNegsCount(board, i, j)
            if
                (currCell.isMine) {
                className = 'mine cell-${i}-${j}`'
                strHTML +=
                    `<td class=${className}"
                  onclick="onCellClicked(this,${i},${j},event)" 
                  oncontextmenu="markCell(event,this,${i},${j})">
                  ${MINE}</td>`
            }
            else if (!currCell.isMine && currCell.minesAroundCount) {
                strHTML +=
                    `<td class="${className}"
                onclick="onCellClicked(this,${i},${j},event)"
                oncontextmenu="markCell(event,this,${i},${j})">
                ${minesAround}</td>`
            }
            else if (!currCell.isMine && !currCell.minesAroundCount) {
                strHTML +=
                    `<td class="${className}"
                  onclick="onCellClicked(this,${i},${j},event)"
                  oncontextmenu="markCell(event,this,${i},${j})"> </td>`
            }
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML
}

function setMinesNegsCount(board, currRow, currCol) {
    var minesAround = 0
    for (var i = currRow - 1; i <= currRow + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (var j = currCol - 1; j <= currCol + 1; j++) {
            if (i === currRow && j === currCol) continue
            if (j < 0 || j >= board[0].length) continue
            if (board[i][j].isMine) {
                minesAround++
            }
        }
    }
    return minesAround
}

function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function onRestart() {
    gCurrSec = 0
    gElSec.innerText = gCurrSec
    gMinesClicked = 0
    gIsBoardClean = true
    gHintsLeft = 3
    changeElements()
    elLevels.style.display = 'block'
    clearInterval(gIntervalTimer)
    if (gGame.isOn) {
        gGame.isOn = false
        onInit()
    }
}

function onUseHint() {
    gHintIsOn = true
    gHintsLeft--
}