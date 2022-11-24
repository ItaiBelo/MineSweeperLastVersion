'use strict'

//////////////// gameElements 
const MINE = '💣'
const FLAG = '🚩'
const BROKEN_HEART = '💔'
const HEART = '💖'
const BULB = '💡'

const gElHearts = document.querySelector('.lives')
var gBoard
var gMinesClicked = 0
var gLevel
var gFlagsLeft
var gMinesMarked = 0
var gIntervalTimer
var gIntervalHide
var gIsBoardClean
var gHintIsOn
var gHintsLeft = 3


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function createHearts() {
    gMinesClicked = 0
    var strHTML = `
     <span class="heart1"> ${HEART}</span>
    <span class="heart2"> ${HEART}</span>
    <span class="heart3"> ${HEART} </span>`
    gElHearts.innerHTML = strHTML
}

function onInit() {
    onRestart()
    gGame.isOn = true
    gBoard = createBoard((gLevel.SIZE))
    createMines(gBoard, gLevel.SIZE)
    renderBoard(gBoard)
    createHearts()
}

function onCellClicked(elCell, currRow, currCol) {

    if (gIsBoardClean) runTimer()

    var clickedCell = gBoard[currRow][currCol]
    if (!gGame.isOn) return         //////// game over 
    if (clickedCell.isShown) return //////// cell already shown
    if (clickedCell.isMarked) return

    if (!clickedCell.isShown && gHintIsOn) {
        expandShown({ i: currRow, j: currCol })
        gIntervalHide = setInterval(hideNeighbors, 1000, { i: currRow, j: currCol })
        return
    }
    clickedCell.isShown = true
    elCell.style.opacity = 1

    if (clickedCell.isMine) {
        ++gMinesClicked
        checkGameOver()
        var gElBrokenHeart = document.querySelector(`.heart${gMinesClicked}`)
        gElBrokenHeart.innerText = BROKEN_HEART
        return
    }

    elCell.style.backgroundColor = 'gray'
    if (clickedCell.minesAroundCount !== 0) return  ////// if there are neighbors brake
    expandShown({ i: currRow, j: currCol })
}

function markCell(ev, elCell, i, j) {
    ev.preventDefault()
    if (!gGame.isOn) return ////////////// gameover
    if (gIsBoardClean) runTimer()
    var clickedCell = gBoard[i][j]
    if (gFlagsLeft === 0 && clickedCell.isMarked) {        ///////// if the player wants to remove a mark 
        gFlagsLeft++
        clickedCell.isMarked = false
        elCell.innerText = clickedCell.minesAroundCount
        elCell.style.opacity = 0
    }
    else if (gFlagsLeft === 0) return                      ////////// if the player wants to mark and there are no flags left
    if (!clickedCell.isMarked && !clickedCell.isShown) {   ////////// if the player wants to mark a hidden cell 
        gFlagsLeft--
        elCell.innerText = FLAG
        elCell.style.backgroundColor = 'gray'
        clickedCell.isMarked = true
        elCell.style.opacity = 1
        if (clickedCell.isMine) {
            gMinesMarked++
            checkVictory()
        }

    }
    else if (clickedCell.isMarked) {
        gFlagsLeft++
        clickedCell.isMarked = false
        elCell.innerText = clickedCell.minesAroundCount
        elCell.style.opacity = 0
    }
    // if (clickedCell.isMarked && clickedCell.isMine) checkVictory()
}

function expandShown(pos) {

    const neighbors = getNeighbors(pos)
    for (var i = 0; i < neighbors.length; i++) {

        const currNeighborCell = neighbors[i].boardCell
        if (currNeighborCell.minesAroundCount === 0) currNeighborCell.innerText = ''
        if (currNeighborCell.isMine) continue

        const currNeighborLocation = neighbors[i].location
        currNeighborLocation.neighborsShown = true

        currNeighborCell.neighborsShown = checkIfNeighborsShown(currNeighborCell, currNeighborLocation)

        var elCurrNeighbor = document.querySelector(`.cell.cell-${currNeighborLocation.i}-${currNeighborLocation.j}`)
        elCurrNeighbor.style.opacity = 1
        elCurrNeighbor.style.backgroundColor = 'gray'
        if (!gHintIsOn) currNeighborCell.isShown = true

        // console.dir(elCurrNeighbor)
    }
}

function checkIfNeighborsShown(currLocation) {
    const neighbors = getNeighbors(currLocation)
    for (var i = 0; i < neighbors.length; i++) {
        if (neighbors[i].boardCell.neighborsShown) return false
    }
    return true
}

function getNeighbors(pos) { //////1,1
    var neighbors = []
    for (var i = pos.i - 1; i <= pos.i + 1; i++) {
        // neighbors[i]
        if (i < 0 || i >= gBoard.length) continue
        for (var j = pos.j - 1; j <= pos.j + 1; j++) {
            if (j < 0 || j >= gBoard[0].length) continue
            if (i === pos.i && j === pos.j) continue
            var currNeighbor = { boardCell: gBoard[i][j], location: { i: i, j: j } }
            neighbors.push(currNeighbor)
        }
    }
    // console.log(neighbors)
    return neighbors
}

function checkGameOver() {
    switch (gMinesClicked) {
        case 1:
            {
                elSmiley.innerText = HURT
            }
            break
        case 2:
            {
                elSmiley.innerText = AWCH
                break
            }
        case 3:
            {
                elSmiley.innerText = DEAD
                clearInterval(gIntervalTimer)
                gGame.isOn = false
                gameOverSound.play()
                openAllMines()
                break
            }
    }
}

function checkVictory() {
    if (gMinesMarked === gLevel.MINES) {
        openAllCells()
        clearInterval(gIntervalTimer)
        elLevels.innerText = TROPHY
        gGame.isOn = false
        victorySound.play()
    }
}

function onChooseLevel(elBtn) {
    if (elBtn.innerText === 'Easy') {
        gLevel = {
            SIZE: 4,
            MINES: 2
        };
        gFlagsLeft = 2
    }
    else if (elBtn.innerText === 'Medium') {
        gLevel = {
            SIZE: 8,
            MINES: 14
        };
        gFlagsLeft = 14
    }
    else {
        gLevel = {
            SIZE: 12,
            MINES: 32
        };
        gFlagsLeft = 32
    }
    // console.log(gLevel.SIZE)
    onInit()
}

function openAllMines() {
    var elMines = document.querySelector('mine cell')
    elMines.style.opacity = 1
}
function openAllCells() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            var currCell = gBoard[i][j]
            if (currCell.isMarked) continue
            // console.log(currCell.i)
            currCell.isShown = true
            var elCurrCell = document.querySelector(`.cell.cell-${i}-${[j]}`)
            elCurrCell.style.opacity = 1
            elCurrCell.style.backgroundColor = 'gray'
        }
    }
}

function hideNeighbors(pos) {
    elLevels.innerHTML = `
      <button class="bulb" onclick="onUseHint()"> 💡 </button>
      <h6> hints left: ${gHintsLeft}</h6>`

    const neighbors = getNeighbors(pos)
    if (gHintsLeft === 0) { elLevels.style.display = 'none' }
    for (var i = 0; i < neighbors.length; i++) {
        const currNeighborCell = neighbors[i].boardCell

        if (currNeighborCell.isShown) continue
        if (currNeighborCell.isMine) continue

        const currNeighborLocation = neighbors[i].location

        var elCurrNeighbor = document.querySelector(`.cell.cell-${currNeighborLocation.i}-${currNeighborLocation.j}`)
        elCurrNeighbor.style.opacity = 0
        elCurrNeighbor.style.backgroundColor = 'darkgray'
        currNeighborCell.isShown = false
    }
    gHintIsOn = false
    clearInterval(gIntervalHide)
}
