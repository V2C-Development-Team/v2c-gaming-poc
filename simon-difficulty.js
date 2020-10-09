const easyDiff = document.getElementById('easy-diff')
const moderateDiff = document.getElementById('moderate-diff')
const hardDiff = document.getElementById('hard-diff')

easyDiff.onclick = () => {
    localStorage.setItem('difficultyCookie', 'easy')
}

moderateDiff.onclick = () => {
    localStorage.setItem('difficultyCookie', 'moderate')
}

hardDiff.onclick = () => {
    localStorage.setItem('difficultyCookie', 'hard')
}