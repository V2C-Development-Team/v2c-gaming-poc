const topLeft = document.getElementById('topLeft')
const topRight = document.getElementById('topRight')
const botLeft = document.getElementById('botLeft')
const botRight = document.getElementById('botRight')

const seqLength = 5
const highlightTime = 750
const timeBetweenHighlights = 500
const numOfQuadrants = 4
colorSeq = [topLeft, topRight, botRight, botLeft]

// highlights quadrants from the list colorSeq
const highlight = quadrant => {
    return new Promise((resolve, reject) => {
        if (quadrant == topLeft) {
            quadrant.className = quadrant.className += ' TL-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' TL-highlight', '')
                setTimeout(() => {resolve()}, timeBetweenHighlights)
            }, highlightTime);   
        } else if (quadrant == topRight) {
            quadrant.className = quadrant.className += ' TR-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' TR-highlight', '')
                setTimeout(() => {resolve()}, timeBetweenHighlights)
            }, highlightTime);  
        } else if (quadrant == botLeft) {
            quadrant.className = quadrant.className += ' BL-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' BL-highlight', '')
                setTimeout(() => {resolve()}, timeBetweenHighlights)
            }, highlightTime);  
        } else if (quadrant == botRight) {
            quadrant.className = quadrant.className += ' BR-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' BR-highlight', '')
                setTimeout(() => {resolve()}, timeBetweenHighlights)
            }, highlightTime);  
        } else {
            reject('error in highlight')
        }
    })
}

const generateSequence = () => {
    colorSeq = []
    let randomQuadrant = null

    for (i = 0; i < seqLength; i++) {
        randNum = Math.floor(Math.random() * numOfQuadrants) + 1 // generate num 1 to numOfQuadrants
        console.log('Random number: ' + randNum)
        switch (randNum) {
            case 1:
                console.log('Quadrant 1')
                randomQuadrant = topRight
                break
            case 2:
                console.log('Quadrant 2')
                randomQuadrant = topLeft
                break
            case 3:
                console.log('Quadrant 3')
                randomQuadrant = botLeft
                break
            case 4:
                console.log('Quadrant 4')
                randomQuadrant = botRight
                break
            default:
                null
        }
        
        colorSeq.push(randomQuadrant)
    }
}

// Start Game Button
const startGameBtn = document.getElementById('startGameBtn')

startGameBtn.onclick = () => {
    main();
    // document.getElementById('win-msg-id').className += " show"
}

// Exit Game Button
const exitBtn = document.getElementById('simonExitBtn')

exitBtn.onclick = () => {
    document.getElementById('gameover-msg-id').className += " show"
}

const main = async () => {
    try {
        generateSequence()
        for (quadrant of colorSeq) {
            await highlight(quadrant)
        }
    } catch (err) {
        console.log('Error: ' + err)
    }
}
