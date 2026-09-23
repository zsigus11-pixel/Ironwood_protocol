import {WEAPONS} from "./data.js";
export class Bot{
 constructor(game,team,pos,id){this.game=game;this.team=team;this.name=(team==="A"?"A":"D")+(id+1);this.x=pos[0];this.z=pos[1];this.hp=100;this.alive=true;this.state="setup";this.lastSeen=null;this.cool=0;this.mag=30;this.dir=Math.random()*6.28;this.role=team==="A"?["scout","entry","support","breach"][id%4]:["anchor","roam","anchor","flank","anchor"][id%5]}
 update(dt){
  if(!this.alive)return;const g=this.game,w=g.world;let target=null;
  const enemies=this.team==="A"?g.bots.filter(b=>b.team==="D"&&b.alive).concat(g.player.alive?[g.player]:[]):g.bots.filter(b=>b.team==="A"&&b.alive);
  let seen=enemies.filter(e=>w.distance(this,e)<38&&w.line(this,e)).sort((a,b)=>w.distance(this,a)-w.distance(this,b))[0];
  if(seen){this.lastSeen={x:seen.x,z:seen.z,t:performance.now()};this.state="engage";target=seen}
  else if(this.lastSeen&&performance.now()-this.lastSeen.t<5000){target=this.lastSeen;this.state="search"}
  else{
   target=this.team==="D"?w.objective:{x:46,z:24};
   if(this.team==="D"&&this.role==="roam")target={x:48+Math.cos(this.dir)*8,z:24+Math.sin(this.dir)*10};
   if(this.team==="A"&&w.objective.active)target=w.objective;
  }
  if(target){
   const d=Math.hypot(target.x-this.x,target.z-this.z);
   if(d>4)this.move(target.x,target.z,dt);
   if(seen&&d<30)this.fire(seen);
  }
  if(this.hp<30&&this.state==="engage"){this.state="retreat";this.move(this.team==="A"?10:55,24,dt)}
  this.dir+=dt*.2;
 }
 move(tx,tz,dt){
  const dx=tx-this.x,dz=tz-this.z,l=Math.hypot(dx,dz)||1,sp=this.game.diff==="hard"?3.4:this.game.diff==="easy"?2:2.7;
  let nx=this.x+dx/l*sp*dt,nz=this.z+dz/l*sp*dt;
  if(!this.game.world.blocked(nx,this.z,.48))this.x=nx;else this.dir+=1.2;
  if(!this.game.world.blocked(this.x,nz,.48))this.z=nz;else this.dir+=.8;
 }
 fire(e){
  const n=performance.now(),w=WEAPONS.AR7;if(n-this.cool<1000/w.rate)return;this.cool=n;
  const d=this.game.world.distance(this,e),difficulty=this.game.diff;
  let acc=difficulty==="easy"?.38:difficulty==="hard"?.82:.62;if(!this.game.world.line(this,e)||Math.random()>acc)return;
  e.hp-=w.damage*(Math.random()<.12?w.head:1);if(e.hp<=0)this.game.eliminate(e,this);
 }
}