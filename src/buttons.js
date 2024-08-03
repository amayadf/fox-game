import { ICONS } from "./constants";

const toggleHighlighted = (icon, show) => {
  document
    .querySelector(`.${ICONS[icon]}-icon`)
    .classList.toggle("highlighted", show);
}

//receiving the function (callback) which will come from gameState (game logic)
//this function will be called when user hits middle button
export default function initButtons(handleUserAction) {
  let selectedIcon = 0; //fish

  function buttonClick(event) {
    if(event.target.classList.contains("left-btn")) {
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (2 + selectedIcon) % ICONS.length;
      toggleHighlighted(selectedIcon, true);
    }
    else if(event.target.classList.contains("right-btn")) {
      toggleHighlighted(selectedIcon, false);
      selectedIcon = (1 + selectedIcon) % ICONS.length;
      toggleHighlighted(selectedIcon, true);
    }
    else {
      handleUserAction(ICONS[selectedIcon]);
    }
  }

  document.querySelector(".buttons").addEventListener("click", buttonClick);
}
