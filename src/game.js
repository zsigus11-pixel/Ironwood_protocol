import {Renderer} from "./renderer.js";
import {World} from "./world.js";
import {Player} from "./player.js";
import {Bot} from "./bot.js";
import {WEAPONS,OPERATORS} from "./data.js";

export class Game{
 constructor(canvas){
  this.canvas=canvas;this.renderer=new Renderer(canvas);this.world=new World();
  this.player=new Player(this);this.bots=[];this.round=0;this.running=false;this.paused=false;
  this.diff="normal";this.feed=[];this.clock=150;this.last=performance.now();this.operatorIndex=0;
  this.keys={};addEventListener("keydown",e=>this.keys[e.code]=true);addEventListener("keyup",e=>this.keys[e.code]=false);
  addEventListener("mousedown",()=>canvas.requestPointerLock());addEventListener("mousemove",e=>{if(document.pointerLockElement===canvas&&!this.paused){this.player.yaw-=e.movementX*.002;this.player.pitch=Math.max(-1.25,Math.min(1.25,this.player.pitch-e.movementY*.002))}});
  addEventListener("mousedown",e=>{if(e.button===0)this.player.firing=true});addEventListener("mouseup",e=>{if(e.button===0)this.player.firing=false});
 }
 start(diff){this.diff=diff;document.querySelector("#menu").classList.add("hidden");this.newRound()}
 mainMenu(){this.running=false;document.querySelector("#pause").classList.add("hidden");document.querySelector("#menu").classList.remove("hidden");document.exitPointerLock?.()}
 cycleOperator(){this.operatorIndex=(this.operatorIndex+1)%OPERATORS.length;document.querySelector("#op").textContent="OPERATOR: "+OPERATORS[this.operatorIndex].name}
 newRound(){this.round++;this.clock=150;this.feed=[];this.world.reset();this.player.reset();this.bots=[];for(let i=0;i<4;i++)this.bots.push(new Bot(this,"A",this.world.attackSpawns[i+1],i));for(let i=0;i<5;i++)this.bots.push(new Bot(this,"D",this.world.defendSpawns[i],i));this.running=true;this.paused=false;document.querySelector("#round").classList.add("hidden")}
 continueRound(){document.querySelector("#round").classList.add("hidden");this.newRound()}
 togglePause(force){if(!this.running)return;this.paused=force??!this.paused;document.querySelector("#pause").classList.toggle("hidden",!this.paused)}
 notify(text){this.feed.unshift(text);this.feed=this.feed.slice(0,7);document.querySelector("#feed").innerHTML=this.feed.map(x=>`<div>${x}</div>`).join("")}
 eliminate(v,k){if(!v.alive)return;v.alive=false;v.hp=0;this.notify(`${k.name||"YOU"}  →  ${v.name||"PLAYER"}`);this.checkWin()}
 checkWin(){
  const a=this.bots.filter(b=>b.team==="A"&&b.alive).length+(this.player.team==="A"&&this.player.alive?1:0);
  const d=this.bots.filter(b=>b.team==="D"&&b.alive).length;
  if(a===0)this.endRound("DEFENDERS WIN","A támadó csapat kiesett.");
  else if(d===0)this.endRound("ATTACKERS WIN","A védő csapat kiesett.");
 }
 endRound(title,msg){this.running=false;document.querySelector("#roundTitle").textContent=title;document.querySelector("#roundInfo").textContent=`Round ${this.round}: ${msg}`;document.querySelector("#round").classList.remove("hidden")}
 update(dt){
  if(!this.running||this.paused)return;
  this.clock-=dt;if(this.clock<=0){this.endRound("DEFENDERS WIN","Az idő lejárt.");return}
  this.player.update(dt);
  for(const b of this.bots)b.update(dt);
  if(this.world.objective.active){
   this.world.objective.progress+=this.bots.filter(b=>b.team==="A"&&b.alive&&this.world.distance(b,this.world.objective)<3).length*dt*.035;
   if(this.world.objective.progress>=1){this.endRound("ATTACKERS WIN","Az objektív aktiválódott.");return}
  }
  if(this.player.team==="A"&&this.world.distance(this.player,this.world.objective)<3&&this.keys.KeyE)this.world.objective.progress+=dt*.28;
  if(this.player.team==="D"&&this.world.objective.active&&this.world.distance(this.player,this.world.objective)<3&&this.keys.KeyE)this.world.objective.progress=Math.max(0,this.world.objective.progress-dt*.22);
  if(this.world.objective.progress>.02)this.world.objective.active=true;
  if(this.world.objective.progress<=0)this.world.objective.active=false;
 }
 render(){
  this.renderer.render(this);
  const p=this.player,w=p.weapon;
  document.querySelector("#hp").textContent=Math.ceil(p.hp);document.querySelector("#ammo").textContent=`${p.mag} / ${p.reserve}`;
  document.querySelector("#weapon").textContent=w.name;document.querySelector("#clock").textContent=`${String(Math.floor(this.clock/60)).padStart(2,"0")}:${String(Math.floor(this.clock%60)).padStart(2,"0")}`;
  document.querySelector("#obj").textContent=this.world.objective.active?`OBJECTIVE ACTIVE · ${Math.floor(this.world.objective.progress*100)}%`:"OBJECTIVE: SECURE";
  document.querySelector("#stance").textContent=this.keys.ControlLeft?"CROUCH":"STAND";
  document.querySelector("#team").innerHTML=this.bots.filter(b=>b.team==="A").map(b=>`<div class="${b.alive?"":"muted"}">${b.name} ${b.alive?Math.ceil(b.hp):"DOWN"}</div>`).join("");
 }
 loop=()=>{const n=performance.now(),dt=Math.min(.05,(n-this.last)/1000);this.last=n;this.update(dt);this.render();requestAnimationFrame(this.loop)}
}