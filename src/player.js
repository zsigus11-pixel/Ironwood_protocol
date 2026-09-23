import {WEAPONS} from "./data.js";
export class Player{
 constructor(game){this.game=game;this.team="A";this.name="YOU";this.reset();this.weaponKeys=["AR7","SMG","SHOT"];this.wi=0}
 reset(){this.x=7;this.z=24;this.yaw=0;this.pitch=0;this.hp=100;this.alive=true;this.mag=30;this.reserve=120;this.lastShot=0;this.reloadUntil=0;this.firing=false}
 get weapon(){return WEAPONS[this.weaponKeys[this.wi]]}
 update(dt){
  const g=this.game,k=g.keys,sp=k.ShiftLeft?6.5:k.ControlLeft?2.1:4;
  let x=(k.KeyD?1:0)-(k.KeyA?1:0),z=(k.KeyS?1:0)-(k.KeyW?1:0),l=Math.hypot(x,z)||1;
  const c=Math.cos(this.yaw),s=Math.sin(this.yaw),nx=this.x+(x*c-z*s)/l*sp*dt,nz=this.z+(x*s+z*c)/l*sp*dt;
  if(!g.world.blocked(nx,this.z,.45))this.x=nx;if(!g.world.blocked(this.x,nz,.45))this.z=nz;
  if(k.KeyR)this.reload();if(k.Digit1)this.wi=0;if(k.Digit2)this.wi=1;if(k.Digit3)this.wi=2;
  if(this.firing)this.shoot();
 }
 reload(){if(this.reloadUntil||this.mag>=this.weapon.mag||this.reserve<=0)return;this.reloadUntil=performance.now()+this.weapon.reload*1000}
 shoot(){
  const w=this.weapon,n=performance.now();if(this.reloadUntil){if(n>=this.reloadUntil){const q=Math.min(w.mag-this.mag,this.reserve);this.mag+=q;this.reserve-=q;this.reloadUntil=0}return}
  if(n-this.lastShot<1000/w.rate||this.mag<=0)return;if(this.mag<=0){this.reload();return}
  this.lastShot=n;this.mag--;
  let best=null,bd=1e9;
  for(const b of this.game.bots)if(b.alive&&b.team!=="A"&&this.game.world.line(this,b)){const d=this.game.world.distance(this,b);if(d<w.range&&d<bd)best=b,bd=d}
  if(best&&Math.random()>w.spread*bd*.9){let dmg=w.damage*(Math.random()<.15?w.head:1);best.hp-=dmg;if(w===WEAPONS.SHOT)this.game.world.destroyNear(best.x,best.z,18);if(best.hp<=0)this.game.eliminate(best,this)}
 }
}