class Box {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getTopBox() {
    if (this.y === 0) return null;
    return new Box(this.x, this.y - 1);
  }

  getRightBox() {
    if (this.x === 2) return null;
    return new Box(this.x + 1, this.y);
  }

  getBottomBox() {
    if (this.y === 2) return null;
    return new Box(this.x, this.y + 1);
  }

  getLeftBox() {
    if (this.x === 0) return null;
    return new Box(this.x - 1, this.y);
  }

  getNextdoorBoxes() {
    return [
      this.getTopBox(),
      this.getRightBox(),
      this.getBottomBox(),
      this.getLeftBox()
    ].filter(box => box !== null);
  }

  getRandomNextdoorBox() {
    const nextdoorBoxes = this.getNextdoorBoxes();
    return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
  }
}

const swapBoxes = (grid, box1, box2) => {
  const temp = grid[box1.y][box1.x];
  grid[box1.y][box1.x] = grid[box2.y][box2.x];
  grid[box2.y][box2.x] = temp;
};

const isSolved = grid => {
  return (
    grid[0][0] === 1 &&
    grid[0][1] === 2 &&
    grid[0][2] === 3 &&
    grid[1][0] === 4 &&
    grid[1][1] === 5 &&
    grid[1][2] === 6 &&
    grid[2][0] === 7 &&
    grid[2][1] === 8 &&
    grid[2][2] === 0
  );
};

const getRandomGrid = () => {
  let grid = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];

  // Shuffle
  let blankBox = new Box(2, 2);
  for (let i = 0; i < 1000; i++) {
    const randomNextdoorBox = blankBox.getRandomNextdoorBox();
    swapBoxes(grid, blankBox, randomNextdoorBox);
    blankBox = randomNextdoorBox;
  }

  if (isSolved(grid)) return getRandomGrid();
  return grid;
};

class Box_State {
  constructor(grid, move, time, status, pause) {
    this.grid = grid;
    this.move = move;
    this.time = time;
    this.status = status;
    this.pause = pause;
    
  }

  static ready() {
    return new Box_State(
      [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
      0,
      0,
      "ready"
    );
  }

  static start() {
    return new Box_State(getRandomGrid(), 0, 0, "playing",this.pause);
  }
}

class Game {
  constructor(state) {
    this.state = state;
    this.tickId = null;
    this.pause = false;
    this.tick = this.tick.bind(this);
    this.render();
    this.handleClickBox = this.handleClickBox.bind(this);
  }

  static ready() {
    return new Game(Box_State.ready());
  }

  tick() {
    if (this.pause != true)
    this.setState({ time: this.state.time + 1 });
  }

  pause() {
    this.render();
  }
  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  handleClickBox(box) {
    return function() {
    if (this.pause) {
      return;
    }
      const nextdoorBoxes = box.getNextdoorBoxes();
      const blankBox = nextdoorBoxes.find(
        nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
      );
      if (blankBox) {
        const newGrid = [...this.state.grid];
        swapBoxes(newGrid, box, blankBox);
        if (isSolved(newGrid)) {
          clearInterval(this.tickId);
          this.setState({
            status: "won",
            grid: newGrid,
            move: this.state.move + 1,
            pause: this.pause
          });
        } else {
          this.setState({
            grid: newGrid,
            move: this.state.move + 1,
            pause: this.pause
          });
        }
      }
    }.bind(this);
  }

  render() {

    const { grid, move, time, status, pause} = this.state;
if(!this.pause){  
    // Render grid
    const newGrid = document.createElement("div");
    newGrid.className = "grid";

    for (let i = 0; i < 3; i++) {

      for (let j = 0; j < 3; j++) {
        const button = document.createElement("button");

        if (status === "playing") {
          button.addEventListener("click", this.handleClickBox(new Box(j, i)));
        }

        button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
        newGrid.appendChild(button);
      }
    }

    document.querySelector(".grid").replaceWith(newGrid);

    // Render button
    const newButton = document.createElement("button");
    if (status === "ready") newButton.textContent = "Play";
    if (status === "playing") newButton.textContent = "Reset";
    if (status === "won") newButton.textContent = "Play";
   
    newButton.addEventListener("click", () => {

clearInterval(this.tickId);
this.tickId = setInterval(this.tick, 1000);
this.setState(Box_State.start());
    });
    document.querySelector('#playButtonSpan button').replaceWith(newButton);

    // Render move
    document.getElementById("move").textContent = `Move: ${move}`;

    // Render time
    document.getElementById("time").textContent = `Time: ${time}`;

    // Render message
    if (status === "won") {
      document.querySelector(".message").textContent = "You win!";
    } else {
      document.querySelector(".message").textContent = "";
    }

   // pause buton
   
   const newButton1 = document.createElement("button");
    if (status === "ready") {

      newButton1.textContent = "Pause";
      newButton1.disabled = true;
    }
    if (status === "playing") {

if(!this.pause){
newButton1.textContent = "Pause";
newButton1.disabled = false;
}else{
newButton1.textContent = "Resume";
}
   
  }
  if (status === "Pause") {
    newButton1.textContent = "Play";
  newButton1.disabled = true;
}
    if (status === "won") {newButton1.textContent = "Pause";
    newButton1.disabled = true;
  }
   
    newButton1.addEventListener("click", () => {
     
 this.pause = !this.pause;
 
 if(this.pause){
newButton1.textContent = "Resume";

 }else{
newButton1.textContent = "Pause";
 }  
 
      console.log('pause vlue: ', this.pause);
 
    });
    document.querySelector('#pauseButtonSpan button').replaceWith(newButton1);

  }
 
  }
 
}

const GAME = Game.ready();

