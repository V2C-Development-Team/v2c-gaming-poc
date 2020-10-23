const easyDiff = document.getElementById('easy-diff')
const moderateDiff = document.getElementById('moderate-diff')
const hardDiff = document.getElementById('hard-diff')

let url = 'simonMenu.html'

easyDiff.onclick = () => {
    localStorage.setItem('difficultyCookie', 'easy')
    location.href = url
}

moderateDiff.onclick = () => {
    localStorage.setItem('difficultyCookie', 'moderate')
    location.href = url
}

hardDiff.onclick = () => {
    localStorage.setItem('difficultyCookie', 'hard')
    location.href = url
}