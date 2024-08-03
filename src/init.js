import gameState, { handleUserAction } from "./gameState";
import { TICK_RATE } from "./constants";
import initButtons from "./buttons";

async function init() {
  //calling init buttons from buttons.js and passing the callback from the game logic
  initButtons(handleUserAction);

  let nextTimeToTick = Date.now();
  function nextAnimationFrame() {
    const now = Date.now();
    if(nextTimeToTick <= now) {
      gameState.tick();
      nextTimeToTick = now + TICK_RATE;
    } 
    //when idle do this so it can check the time
    requestAnimationFrame(nextAnimationFrame);
  }
  //scheduling it the first time
  nextAnimationFrame();
}

init();
