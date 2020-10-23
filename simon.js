const numOfQuadrants = 4
const botLeft = document.getElementById('botLeft')
const topRight = document.getElementById('topRight')
const botRight = document.getElementById('botRight')
const topLeft = document.getElementById('topLeft')
let highlightTime = 0
let timeBetweenHighlights = 0

const main = async () => {
    return new Promise((resolve, reject) => {
        try {
            chooseDifficulty()
            game = new simonBoard()
            game.iterateLevel()

            if (!game.canClick) {
                topRight.onclick = async () => {
                    await game.quadrantClicked(topRight)
                }
                topLeft.onclick = async () => {
                    await game.quadrantClicked(topLeft)
                }
                botRight.onclick = async () => {
                    await game.quadrantClicked(botRight)
                }
                botLeft.onclick = async () => {
                    await game.quadrantClicked(botLeft)
                }
            }

        } catch (err) {
            console.log('Error: ' + err)
        }
    })
}

// Difficulty level set using localStorage
const chooseDifficulty = () => {
    var difficulty = localStorage.getItem('difficultyCookie')
    console.log('this is the diff: ' + difficulty)

    if (difficulty === 'easy') {
        highlightTime = 1000
        timeBetweenHighlights = 250 
    } else if (difficulty === 'moderate') {
        highlightTime = 500
        timeBetweenHighlights = 100 
    } else {
        highlightTime = 250
        timeBetweenHighlights = 25 
    }
}

// Start Game Button
const startGameBtn = document.getElementById('startGameBtn')
startGameBtn.onclick = () => {
    main()
}

class simonBoard {
    constructor() {
        this.seqLength = 0
        this.currentSequence = []
        this.userSequenceGuess = []
        this.canClick = false
        this.gameStarted = false
    }

    // increases the sequence length and updates level title
    async iterateLevel() {
        try {
            this.userSequenceGuess = []
            this.seqLength++
            document.getElementById("levelHeader").innerHTML = "Level " + this.seqLength
            this.addToSequence()
            for (const quadrant of this.currentSequence) {
                await this.highlightQuadrant(quadrant)
            }
            this.gameStarted = true
            this.canClick = true
        } catch(err) {
            console.log('Error in iterateLevel function = ' + err)
        }
    }

    // adds a random quadrant to the color sequence
    addToSequence() {
        let randomQuadrant = null
        let randNum = Math.floor(Math.random() * numOfQuadrants) + 1 // generate num 1 to numOfQuadrants

        switch (randNum) {
            case 1:
                randomQuadrant = topRight
                break
            case 2:
                randomQuadrant = topLeft
                break
            case 3:
                randomQuadrant = botLeft
                break
            case 4:
                randomQuadrant = botRight
                break
            default:
                null
        }
        this.currentSequence.push(randomQuadrant)
    }

    // highlights the input quadrant
     highlightQuadrant(quadrant) {
        return new Promise((resolve, reject) => {
            try {
                this.canClick = false

                if (quadrant === topLeft) {
                    console.log('TL!!!')
                    quadrant.className = quadrant.className += ' TL-highlight'
                    setTimeout(() => {
                        quadrant.className = quadrant.className.replace(' TL-highlight', '')
                        setTimeout(() => {resolve()}, timeBetweenHighlights)
                    }, highlightTime);   
                } else if (quadrant === topRight) {
                    console.log('TR!!!')
                    quadrant.className = quadrant.className += ' TR-highlight'
                    setTimeout(() => {
                        quadrant.className = quadrant.className.replace(' TR-highlight', '')
                        setTimeout(() => {resolve()}, timeBetweenHighlights)
                    }, highlightTime);  
                } else if (quadrant === botLeft) {
                    console.log('BL!!!')
                    quadrant.className = quadrant.className += ' BL-highlight'
                    setTimeout(() => {
                        quadrant.className = quadrant.className.replace(' BL-highlight', '')
                        setTimeout(() => {resolve()}, timeBetweenHighlights)
                    }, highlightTime);  
                } else if (quadrant === botRight) {
                    console.log('BR!!!')
                    quadrant.className = quadrant.className += ' BR-highlight'
                    setTimeout(() => {
                        quadrant.className = quadrant.className.replace(' BR-highlight', '')
                        setTimeout(() => {resolve()}, timeBetweenHighlights)
                    }, highlightTime);  
                } else {
                    reject('highlightQuadrant function rejected')
                }
            } catch (err) {
                console.log('Error in highlightQuadrant: ' + err)
            }
        })
    }

    quadrantClicked(quadrant) {
        return new Promise((resolve, reject) => {
            try {
                if (!this.canClick) {
                    resolve()
                } else {
                    console.log(quadrant)
                    this.userSequenceGuess.push(quadrant)
                    console.log('user sequence length is ' + this.userSequenceGuess.length)
                    let curIndex = this.userSequenceGuess.length - 1
                    if (this.userSequenceGuess[curIndex] === this.currentSequence[curIndex]) {
                        if(this.userSequenceGuess.length === this.seqLength) {
                            console.log('YOU WIN!!!!!!!')
                            document.getElementById('win-msg-id').className += " show"
                            document.getElementById('nextLevelBtn').onclick = () => {
                                document.getElementById('win-msg-id').classList.remove("show")
                                console.log('YOU HIT THE NEXT LEVEL!!!!!!!!!')
                                this.canClick = false
                                this.iterateLevel()
                                console.log('after iteration the seq length is ' + this.currentSequence.length)
                            }
                        }
                    } else {
                        this.gameStarted = false
                        console.log('YOU LOSE!!!!!')
                        document.getElementById('gameover-msg-id').className += ' show'
                    }
                }
            } catch (err) {
                console.log('Error in quadrantClicked function: ' + err)
                reject('Error in quadrantClicked function promise')
            }
        })
    }

    isGameStarted() {
        if(this.gameStarted) {
            return true
        } else {
            return false
        }
    }

}
