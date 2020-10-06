const topLeft = document.getElementById('topLeft')
const topRight = document.getElementById('topRight')
const botLeft = document.getElementById('botLeft')
const botRight = document.getElementById('botRight')

colorSeq = [topLeft, topRight, botRight, botLeft]

let highlight = quadrant => {
    return new Promise((resolve, reject) => {
        if (quadrant == topLeft) {
            quadrant.className = quadrant.className += ' TL-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' TL-highlight', '')
                resolve()
            }, 1000);   
        } else if (quadrant == topRight) {
            quadrant.className = quadrant.className += ' TR-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' TR-highlight', '')
                resolve()
            }, 1000);   
        } else if (quadrant == botLeft) {
            quadrant.className = quadrant.className += ' BL-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' BL-highlight', '')
                resolve()
            }, 1000);   
        } else if (quadrant == botRight) {
            quadrant.className = quadrant.className += ' BR-highlight'
            setTimeout(() => {
                quadrant.className = quadrant.className.replace(' BR-highlight', '')
                resolve()
            }, 1000);   
        } else {
            reject('error in highlight')
        }
    })
};

const startGameBtn = document.getElementById('startGameBtn')

startGameBtn.onclick = () => {
    document.getElementById('win-msg-id').className += " show"
};

const exitBtn = document.getElementById('simonExitBtn')

exitBtn.onclick = () => {
    document.getElementById('gameover-msg-id').className += " show"
};

const main = async () => {
    try {
        for (quadrant of colorSeq) {
            await highlight(quadrant)
        }
    } catch (err) {
        console.log('Error: ' + err)
    }
};

main();
/*
let generateSequence = () => {
    let seqLength = Math.random() *
}
*/