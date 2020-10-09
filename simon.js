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

            console.log('no board')
            game = new simonBoard()
            game.iterateLevel()
            console.log('level was iterated')

            topRight.onclick = async () => {
                await game.quadrantClicked(topRight)
                game.iterateLevel()
            }
            topLeft.onclick = async () => {
                await game.quadrantClicked(topLeft)
                game.iterateLevel()
            }
            botRight.onclick = async () => {
                await game.quadrantClicked(botRight)
                game.iterateLevel()
            }
            botLeft.onclick = async () => {
                await game.quadrantClicked(botLeft)
                game.iterateLevel()
            }

        } catch (err) {
            console.log('Error: ' + err)
        }
    })
}

const chooseDifficulty = () => {
    const difficulty = document.querySelector('selectedDiff')

    if (difficulty == document.getElementById('easy-diff')) {
        highlightTime = 1000
        timeBetweenHighlights = 250 
    } else if (difficulty == document.getElementById('moderate-diff')) {
        highlightTime = 500
        timeBetweenHighlights = 100 
    } else {
        highlightTime = 250
        timeBetweenHighlights = 0 
    }
}

// Start Game Button
const startGameBtn = document.getElementById('startGameBtn')

startGameBtn.onclick = () => {
    main()
}

// Exit Game Button
const exitBtn = document.getElementById('simonExitBtn')

exitBtn.onclick = () => {
    
}

class simonBoard {
    constructor() {
        this.seqLength = 0
        this.currentSequence = []
        this.userSequenceGuess = []
        this.canClick = false
    }

    async iterateLevel() {
        try {
            this.userSequenceGuess = []
            this.seqLength++
            document.getElementById("levelHeader").innerHTML = "Level " + this.seqLength
            console.log('seq length in itlvl = ' + this.seqLength)
            this.addToSequence()
            for (const quadrant of this.currentSequence) {
                await this.highlightQuadrant(quadrant)
            }
            this.canClick = true
        } catch(err) {
            console.log('Error in iterateLevel function = ' + err)
        }
    }

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

    // highlights quadrants from the list colorSeq
     highlightQuadrant(quadrant) {
        return new Promise((resolve, reject) => {
            try {
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



}

// -------------------------------------------------------------------


// const topLeft = document.getElementById('topLeft')
// const topRight = document.getElementById('topRight')
// const botLeft = document.getElementById('botLeft')
// const botRight = document.getElementById('botRight')

// const highlightTime = 750
// const timeBetweenHighlights = 500
// const numOfQuadrants = 4

// // let canClick = false
// // let seqLength = 1
// // let numClicksAvailable = 0
// // let inputSequence = []

// const main = async () => {
//     let canClick = false
//     let seqLength = 1
//     let numClicksAvailable = 0
//     let colorSeq = [] // options: topLeft, topRight, botRight, botLeft
//     let isGameOver = false
//     let inSequence = [] // user input color sequence

//     try {
//         colorSeq = generateSequence(seqLength) // random sequence
//         for (quadrant of colorSeq) {
//             await highlight(quadrant)
//         }
//         inputSequence(numClicksAvailable, canClick)
//         //numClicksAvailable = seqLength
//         //canClick = true
//         // returns true if input quadrant is incorrect
//         // isGameOver = checkForGameOver(topRight, seqLength, numClicksAvailable)

//     } catch (err) {
//         console.log('Error: ' + err)
//     }
// }

// // returns a random array of quandrants of the length seqLength passed to it
// const generateSequence = seqLength => {
//     let generatedColorSeq = []
//     let randomQuadrant = null

//     for (i = 0; i < seqLength; i++) {
//         randNum = Math.floor(Math.random() * numOfQuadrants) + 1 // generate num 1 to numOfQuadrants
//         switch (randNum) {
//             case 1:
//                 randomQuadrant = topRight
//                 break
//             case 2:
//                 randomQuadrant = topLeft
//                 break
//             case 3:
//                 randomQuadrant = botLeft
//                 break
//             case 4:
//                 randomQuadrant = botRight
//                 break
//             default:
//                 null
//         }
//         generatedColorSeq.push(randomQuadrant)
//     }
//     return generatedColorSeq
// }

// // highlights quadrants from the list colorSeq
// const highlight = quadrant => {
//     return new Promise((resolve, reject) => {
//         if (quadrant == topLeft) {
//             quadrant.className = quadrant.className += ' TL-highlight'
//             setTimeout(() => {
//                 quadrant.className = quadrant.className.replace(' TL-highlight', '')
//                 setTimeout(() => {resolve()}, timeBetweenHighlights)
//             }, highlightTime);   
//         } else if (quadrant == topRight) {
//             quadrant.className = quadrant.className += ' TR-highlight'
//             setTimeout(() => {
//                 quadrant.className = quadrant.className.replace(' TR-highlight', '')
//                 setTimeout(() => {resolve()}, timeBetweenHighlights)
//             }, highlightTime);  
//         } else if (quadrant == botLeft) {
//             quadrant.className = quadrant.className += ' BL-highlight'
//             setTimeout(() => {
//                 quadrant.className = quadrant.className.replace(' BL-highlight', '')
//                 setTimeout(() => {resolve()}, timeBetweenHighlights)
//             }, highlightTime);  
//         } else if (quadrant == botRight) {
//             quadrant.className = quadrant.className += ' BR-highlight'
//             setTimeout(() => {
//                 quadrant.className = quadrant.className.replace(' BR-highlight', '')
//                 setTimeout(() => {resolve()}, timeBetweenHighlights)
//             }, highlightTime);  
//         } else {
//             reject('error in highlight')
//         }
//     })
// }

// // // User Interactions
// // const quadrantClicked = quadrant => {
// //     if (!canClick) {
// //         return
// //     } else {
// //         console.log(quadrant)
        
// //     }
// // }

// const inputSequence = (numClicksAvailable, canClick) => {
//     new Promise((resolve, reject), () => {
//         let inputSeq = []

//         document.getElementById('topRight').addEventListener("click", () => {
//             if (canClick) {
//                 inputSeq.push(topRight)
//                 console.log('Pushed TR')
//                 numClicksAvailable--
//                 resolve()
//             }
//         })
//         if (numClicksAvailable === 0) {
//             resolve()
//             return inputSeq
//         } else if (numClicksAvailable < 0) {
//             reject('in inputSequence function: numClicksAvailable is negative')
//         }
//     })
// }



// // Game Logic
// // const checkForGameOver = (quadrant, seqLength, numClicksAvailable) => {
// //     new Promise((resolve, reject) => {
// //         let currentIndex = seqLength - numClicksAvailable
// //         if (colorSeq[currentIndex] === quadrant) {
// //             numClicksAvailable--
// //             if(numClicksAvailable === 0) {
// //                 console.log('You WIN!')
// //                 resolve()
// //             }
// //         } else if(inputSeq[currentIndex !== colorSeq[currentIndex]]) {
// //             console.log('Game Over!')
// //             resolve()
// //         } else {
// //             reject('error in checkForGameOver')
// //         }
// //     })
// // }

// // Start Game Button
// const startGameBtn = document.getElementById('startGameBtn')

// startGameBtn.onclick = () => {
//     main()
//     // document.getElementById('win-msg-id').className += " show"
// }

// // Exit Game Button
// const exitBtn = document.getElementById('simonExitBtn')

// exitBtn.onclick = () => {
//     document.getElementById('gameover-msg-id').className += ' show'
// }