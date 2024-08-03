import { modFox, modScene, togglePoopBag, writeModal } from "./ui";
import { RAIN_CHANCE, SCENES, DAY_LENGTH, NIGHT_LENGTH, getNextDieTime, getNextHungerTime, getNextPoopTime } from "./constants";

//the object that represents game logic
const gameState = {
  current: "INIT",
  clock: 1,
  wakeTime: -1, //sentinel value, signals that the fox is not waking up
  sleepTime: -1,
  hungryTime: -1,
  dieTime: -1,
  timeToStartCelebrating: -1,
  timeToEndCelebrating: -1,
  poopTime: -1,

  tick() {
    this.clock++;
    if(this.clock === this.wakeTime) {
      this.wake();
    }
    else if(this.clock === this.sleepTime) {
      this.sleep();
    }
    else if(this.clock === this.hungryTime) {
      this.getHungry();
    }
    else if(this.clock === this.dieTime) {
      this.die();
    }
    else if(this.clock === this.timeToStartCelebrating) {
      this.startCelebrating();
    }
    else if(this.clock === this.timeToEndCelebrating) {
      this.endCelebrating();
    }
    else if(this.clock === this.poopTime) {
      this.poop();
    }
  },

  startGame() {
    writeModal();
    this.current = "HATCHING";
    this.wakeTime = this.clock + 3;
    modFox('egg');
    modScene('day');
  },

  wake() {
    this.current = "IDLING";
    this.wakeTime = -1;
    //creating the random chance of having rain (scenes day and rain with 0 and 1 as indexes)
    this.scene = Math.random() > RAIN_CHANCE ? 0 : 1;
    modScene(SCENES[this.scene]);
    //amount of time before the fox goes to sleep
    this.sleepTime = this.clock + DAY_LENGTH;
    this.hungryTime = getNextHungerTime(this.clock);
    this.determineFoxState();
  },
  sleep() {
    this.current = "SLEEP";
    modFox('sleep');
    modScene('night');
    this.clearTimes();
    //amount of time before the fox wakes up
    this.wakeTime = this.clock + NIGHT_LENGTH;
  },
  getHungry() {
    this.current = "HUNGRY";
    this.dieTime = getNextDieTime(this.clock);
    this.hungryTime = -1;
    modFox("hungry");
  },
  die() {
    this.current = "DEAD";
    modScene('dead');
    modFox('dead');
    this.clearTimes();
    writeModal('The fox died :( <br/> Press middle button to start again.');
  },
  startCelebrating() {
    this.current = "CELEBRATING";
    modFox('celebrate');
    this.timeToStartCelebrating = -1;
    this.timeToEndCelebrating = this.clock + 2;
  },
  endCelebrating() {
    togglePoopBag(false);
    this.timeToEndCelebrating = -1;
    this.current = "IDLING";
    //because the fox looks differently at the camera
    this.determineFoxState();
  },
  poop() {
    this.current = "POOPING",
    this.poopTime = -1;
    this.dieTime = getNextDieTime(this.clock);
    modFox('pooping');
  },

  determineFoxState() {
    if(this.current === "IDLING") {
      if(SCENES[this.scene] === "rain") {
        modFox("rain");
      }
      else {
        modFox('idling');
      }
    }
  },

  clearTimes() {
    this.wakeTime = -1;
    this.sleepTime = -1;
    this.hungryTime = -1;
    this.dieTime = -1;
    this.poopTime = -1;
    this.timeToEndCelebrating = -1;
    this.timeToStartCelebrating = -1;
  },

  //this is where things happen when user clicks depending on the icon (feeding, weather, poop)
  handleUserAction(icon) {
    if(["SLEEP", "FEEDING", "CELEBRATING", "HATCHING"].includes(this.current)) {
      return;
    }
    if(this.current === "INIT" || this.current === "DEAD") {
      this.startGame();
      return;
    }
    //based on icon clicked what does the program do
    switch(icon) {
      case "weather":
        this.changeWeather();
        break;
      case "poop":
        this.cleanUpPoop();
        break;
      case "fish":
        this.feed();
        break;
    }
  },

  changeWeather() {
    this.scene = (this.scene + 1) % SCENES.length;
    modScene(SCENES[this.scene]);
    this.determineFoxState();
  },
  cleanUpPoop() {
    if(this.current !== "POOPING") {
      return;
    }
    this.dieTime = -1;
    togglePoopBag(true);
    this.startCelebrating();
    this.hungryTime = getNextHungerTime(this.clock);
  },
  feed() {
    if(this.current !== "HUNGRY") {
      return;
    }
    this.current = "FEEDING";
    this.dieTime = -1;
    this.poopTime = getNextPoopTime(this.clock);
    modFox('eating');
    this.timeToStartCelebrating = this.clock + 2;
  },
};

//binding handleUserAction to 'this' so when you call handleUserAction outside of gameState 'this' always refers to gameState
export const handleUserAction = gameState.handleUserAction.bind(gameState);
export default gameState;
