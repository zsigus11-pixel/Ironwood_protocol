export class World{
 constructor(){this.reset()}
 reset(){
  this.walls=[];this.cover=[];this.objective={x:48,z:24,active:false,progress:0};
  this.attackSpawns=[[7,18],[7,24],[7,30],[13,20],[13,28]];
  this.defendSpawns=[[57,18],[57,24],[57,30],[51,20],[51,28]];
  const W=(x,z,w,d,h=4,destruct=false)=>this.walls.push({x,z,w,d,h,destruct,hp:destruct?100:1e9,dead:false});
  W(0,0,64,1);W(0,48,64,1);W(0,0,1,48);W(64,0,1,48);
  W(20,0,1,15);W(20,28,1,20);W(44,0,1,12);W(44,20,1,28);
  W(20,15,10,1);W(34,15,10,1);W(20,34,10,1);W(34,34,10,1);
  W(30,15,1,7);W(30,27,1,7,true);W(34,15,1,7);W(34,27,1,7,true);
  W(20,24,10,1,true);W(34,24,10,1,true);
  [[9,9],[15,8],[9,39],[15,40],[51,8],[57,12],[51,39],[57,40],[27,20],[38,28],[26,29],[40,19]].forEach(([x,z])=>this.cover.push({x,z,w:2.5,d:1.2,h:1.3}));
 }
 distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}
 blocked(x,z,r=.4){
  if(x<1+r||x>63-r||z<1+r||z>47-r)return true;
  return this.walls.some(w=>!w.dead&&Math.abs(x-w.x)<w.w/2+r&&Math.abs(z-w.z)<w.d/2+r)
 }
 line(a,b){
  const n=Math.ceil(this.distance(a,b)/.35);
  for(let i=1;i<n;i++){const t=i/n,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;if(this.walls.some(w=>!w.dead&&Math.abs(x-w.x)<w.w/2&&Math.abs(z-w.z)<w.d/2))return false}
  return true
 }
 destroyNear(x,z,damage){for(const w of this.walls)if(w.destruct&&!w.dead&&Math.hypot(x-w.x,z-w.z)<Math.max(w.w,w.d)+2){w.hp-=damage;if(w.hp<=0)w.dead=true}}
}