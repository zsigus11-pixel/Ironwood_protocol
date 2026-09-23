import { Game } from "./game.js";
const canvas=document.querySelector("#game");
const game=new Game(canvas);
document.querySelector("#play").onclick=()=>game.start(document.querySelector("#diff").value);
document.querySelector("#continue").onclick=()=>game.continueRound();
document.querySelector("#resume").onclick=()=>game.togglePause(false);
document.querySelector("#back").onclick=()=>game.mainMenu();
document.querySelector("#op").onclick=()=>game.cycleOperator();
addEventListener("keydown",e=>{
 if(e.code==="Escape")game.togglePause();
 if(e.code==="Tab")e.preventDefault();
});
game.loop();