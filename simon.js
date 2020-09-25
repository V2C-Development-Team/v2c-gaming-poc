const startGameBtn = document.getElementById('startGameBtn')

startGameBtn.onclick = function() {
    document.getElementById('win-msg-id').className += " show";
};

const exitBtn = document.getElementById('simonExitBtn')

exitBtn.onclick = function() {
    document.getElementById('gameover-msg-id').className += " show";
};
