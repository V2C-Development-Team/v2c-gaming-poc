const easyDiff = document.getElementById('easy-diff')
const moderateDiff = document.getElementById('moderate-diff')
const hardDiff = document.getElementById('hard-diff')

easyDiff.onclick = () => {
    easyDiff.className = easyDiff.className += ' selectedDiff'
    moderateDiff.classList.remove('selectedDiff')
    hardDiff.classList.remove('selectedDiff')
}

    moderateDiff.onclick = () => {
    easyDiff.classList.remove('selectedDiff')
    moderateDiff.className = moderateDiff.className += ' selectedDiff'
    hardDiff.classList.remove('selectedDiff')
}

hardDiff.onclick = () => {
    easyDiff.classList.remove('selectedDiff')
    moderateDiff.classList.remove('selectedDiff')
    hardDiff.className = hardDiff.className += ' selectedDiff'
}