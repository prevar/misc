let centerHoriz = 0;
let centerVert = 0;
  /**
   * Create a divElement with randowm x and y position
   * @param {*} divId 
   * @returns 
   */
  function createRandom(divId, type) {
  // get the width and height of the window and generate a randow x and y position for the initial position of the ball
  const width = globalThis.innerWidth;
  const height = globalThis.innerHeight;
  console.log('width='+width);
  centerHoriz = width/3;
  console.log('height='+height);
  centerVert = height/3;
 
  //generate random x and y for different positions of the balls
  let x = Math.floor(Math.random() * width);
  let y = Math.floor(Math.random() * height);
  if (x > width - 50) x = width - 50; //If ball is out of bounds, then move it inside the width of screen- width of ball.
  if (y > height - 50) y = height - 50; //If ball is out of bounds, then move it inside the width of screen- height of ball.

  // Create a new div element
  const div = document.createElement("div");

  div.id = divId; //Add the index to the id so ids are unique
  div.style.zIndex = "1";
  div.style.position = "absolute";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.style.width = "50px";
  div.style.height = "50px";
  div.style.backgroundSize = 'cover';
  div.style.backgroundRepeat = 'no-repeat';
  div.style.backgroundPosition = 'center';

  div.style.backgroundImage = "url('"+ type + ".jpg')";
  div.x = x; //starting x pos
  div.y = y; //starting y pos

  // Then append the whole thing onto the body
  document.getElementsByTagName("body")[0].appendChild(div);
  return div; //return created div element
}

//Create balls with random color and position and store the div elements in a ballArray
let ballArray = [];
const numBalls = 16; //Change for the number of balls to spawn
const half = Math.floor(numBalls / 2); //Use this to spawn half in each direction
const third = Math.floor(numBalls/3); 

for (let i = 0; i < numBalls; i++) {
    const type = i < third? 'ROCK': i < 2*third ? 'PAPER' :'SCISSORS';
    const id = "div" + i; //id for each ball
    const divElement = createRandom(id, type);
  
  //create a new ball Object for every ball and set its x and y direction
  //and push into ballArray.
  const ballElement = {
    id: id, //id of div element
    posX: divElement.x, //left space
    posY: divElement.y, //top space
    reverse: i > half ? true : false, //create half the balls going forward and other half reverse
    goingDown: i > half ? false : true, //create half balls going up, other half going down
    type: type //to identify ROCK, PAPER, SCISSORS
};

  //Add ball objects to the global array
  ballArray.push(ballElement);
}

// Call moveBall function every few seconds and note intervalId which is needed to end the game
const intervalId = setInterval(moveBalls, 30);


/**
 * moveBalls() will take the ballsArray and take out the balls one by one and move them
 * @returns
 */
function moveBalls() {
  // two fixed x-axis coordinates (you will use these variable in step 3)

  for (let k = 0; k < ballArray.length; k++) {
    //Take the ballElement out of the array one by one
    const ball = ballArray[k];
    const divElement = document.getElementById(ball.id);

    moveBall(ball, divElement);
    const collisionArr = checkCollision(ball.id, ball.posX, ball.posY);

    //if a collision is found/ reverse direction of balls
     if (collisionArr != null && collisionArr.length > 0) {
        reboundBalls(ball, collisionArr);
    }
  }
  return;
}

/**
 * move a single ball given its ballelement and divelement
 * @param {} ballElement 
 * @param {*} divElement 
 */
function moveBall(ballElement, divElement) {
    const Xmin = 10;
    const Xmax = 975;
    const Ymin = 10;
    const Ymax = 775;
    const velocity = 5;

    let positionX = divElement.x;
    let positionY = divElement.y;

    //Get Horizontal and vertical direction of movement of the ball
    const reverse = ballElement.reverse;
    const goingDown = ballElement.goingDown;

    //If ball is going left, x is decreasing, reduce velocity value from x
    if (reverse) {
      positionX = positionX - velocity;

      //If x position becomes <= the Xmin(on the container), then set x-position to Xmin so it doesnt go out of container
      if (positionX <= Xmin) {
        positionX = Xmin;
        //Once the ball touches the left of the container, make the ball radius to 20% and assign random color
        //assignRandomColorToDiv(divElement);
        divElement.style.borderRadius = "20%";
      }
    } else {
      //else add velocity to x position
      positionX = positionX + velocity;
      //If positionx becomes > right boundary of container, make x position= Xmax so it doesnt go out of container
      if (positionX >= Xmax) {
        positionX = Xmax;
        //change color of ball to random when it touches right end of container and make it round
        //colorRandom(divElement);
        divElement.style.borderRadius = "50%";
      }
      //console.log("X in range so x+v="+positionX);
    }

    //If Ball is going down, y needs to decrease so subtract velocity
    if (goingDown) {
      positionY = positionY - velocity;

      //If Y reaches bottom of container, set it to Ymin
      if (positionY <= Ymin) {
        //assignRandomColorToDiv(divElement);
        positionY = Ymin;
      }
    } //If ball is going up , y increases so add velocity
    else {
      positionY = positionY + velocity;

      // If y position > right end of container, set y to ymax
      if (positionY >= Ymax) {
        //colorRandom(divElement);
        positionY = Ymax;
      }
    }

    //Set the left and top values of the ball
    divElement.style.left = positionX + "px";
    divElement.x = positionX;
    ballElement.posX = positionX;

    divElement.style.top = positionY + "px";
    divElement.y = positionY;
    ballElement.posY = positionY;

    //If ball is going out of bounds in either direction, reverse the direction
    if (positionX >= Xmax || positionX <= Xmin) {
        ballElement.reverse = !ballElement.reverse;
    }

    if (positionY >= Ymax || positionY <= Ymin) {
        ballElement.goingDown = !ballElement.goingDown;
    }
}


/**
 * Check if the new position of a moving ball matches the position of any other ball in the ball Array
 * which will decide if there is a collision or not
 * @param {*} ballid 
 * @param {*} xposition 
 * @param {*} yposition 
 * @returns 
 */
function checkCollision(ballid, xposition, yposition) {
    const collidingBallElementArr = ballArray.filter((eachBallElem) => {
      const xpo = eachBallElem.posX;
      const ypo = eachBallElem.posY;
  
      //If Distance between 2 centers is less than sum of radii, then they collide
      if ( eachBallElem.id != ballid &&
        Math.sqrt(
          (xpo - xposition) * (xpo - xposition) +
            (ypo - yposition) * (ypo - yposition)
        ) < 50
      )
        return true;
      else return false;
    });
  
    if (collidingBallElementArr != null && collidingBallElementArr.length > 0) {
      //console.log(`collidingBallElementArr ${collidingBallElementArr.length} ${collidingBallElementArr[0].id}`);
    }
    return collidingBallElementArr;
  }

  
/**
 * Rebound balls when they collide with each other . Also based on which balls are colliding, change the 
 * image to whoever wins. Also, call checkWinner to see if all images are changed and game needs to halt.
 * @param {*} ballElement 
 * @param {*} collisionArr 
 */
function reboundBalls(ballElement, collisionArr) {
    ballElement.goingDown = !ballElement.goingDown;
    ballElement.reverse = !ballElement.reverse;
    const divElement = document.getElementById(ballElement.id);
   
    collisionArr.forEach( (eachball) => {
        const hitballArr = ballArray.filter((ballinarray) => eachball.id == ballinarray.id);
        hitballArr.forEach((hitball)=> {
            hitball.reverse = !hitball.reverse;
            hitball.goingDown = !hitball.going
            const hitBallDivElem = document.getElementById(hitball.id);
            const winner = winnerChangesImage(ballElement.type, hitball.type);
            if (winner) {
                divElement.style.backgroundImage = "url('"+ winner + ".jpg')";
                ballElement.type = winner;

                hitBallDivElem.style.backgroundImage = "url('"+ winner + ".jpg')";
                hitball.type = winner;
                checkWinner(winner);
            }
            moveBall(hitball, hitBallDivElem);
        })
    } )
    moveBall(ballElement, divElement);
    
}

/**
 * If all elements in the ballArray match the winner after a collision, then that type wins
 * @param {*} winnerType 
 */
function checkWinner(winnerType) {
    const ballsWithWinnerType = ballArray.filter((ball) => ball.type === winnerType);
    //console.log('in checkWonner'+winnerType);
    if (ballsWithWinnerType != null && ballsWithWinnerType.length === ballArray.length) {
        //ballArray = [];
      //  console.log('in checkWonnerequal len');
       
        haltGame(winnerType);
    }
}

/**
 * Method is used to decide who is in the winner in a collision of rock, paper and scissors.
 * @param {*} type1 
 * @param {*} type2 
 * @returns 
 */
function winnerChangesImage(type1, type2){
    let winner = null;

    switch (type1){
    case 'ROCK':
       switch(type2){
        case 'PAPER':
            winner='PAPER';
            break;
        case 'SCISSORS':
            winner='ROCK';
            break;
        default:
            break;
       }
        break;
    case 'PAPER':
       switch(type2){
        case 'ROCK':
            winner='PAPER';
            break;
        case 'SCISSORS':
            winner='SCISSORS';
            break;
        default:
            break;
       }
        break;
    case 'SCISSORS':
       switch(type2){
        case 'ROCK':
            winner='ROCK';
            break;
        case 'PAPER':
            winner='SCISSORS';
            break;
        default:
            break;
       }
        break;
    default:
        break;        
    }
    return winner;
}

/**
 * If all balls are of same type, halt the game by removing all balldivs and clearing the ballArray.
 */
function haltGame(winnerType) {

    const container = document.getElementById('container');
    container.innerHTML = `<div style="position:absolute; left:${centerHoriz}px; top:${centerVert}px;" class="winner"> ${winnerType} wins!</div>`;
    clearInterval(intervalId);
    for (let i=0;i<numBalls;i++) {
        const ballId = 'div'+i;

        const element = document.getElementById(ballId);
        if (element) {
            element.remove(element);
        }
        
    }
    ballArray = [];
}
