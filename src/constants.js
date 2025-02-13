export const TICK_RATE = 3000;
export const ICONS = ["fish", "poop", "weather"];
export const RAIN_CHANCE = 0.2; //rains 20% of the time
export const SCENES = ['day', 'rain'];
export const DAY_LENGTH = 60; //amount of ticks
export const NIGHT_LENGTH = 5; 

//amount of time before fox gets hungry, dies, and poops
export const getNextHungerTime = clock => Math.floor(Math.random() * 3) + 5 + clock;
export const getNextDieTime = clock => Math.floor(Math.random() * 2) + 3 + clock;
export const getNextPoopTime = clock => Math.floor(Math.random() * 3) + 4 + clock;
