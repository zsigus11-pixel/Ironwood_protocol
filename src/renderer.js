export class Renderer{
 constructor(canvas){this.c=canvas;this.x=canvas.getContext("2d");addEventListener("resize",()=>this.resize());this.resize()}
 resize(){this.c.width=innerWidth;this.c.height=innerHeight}
 render(g){
  const c=this.x,W=this.c.width,H=this.c.height;c.fillStyle="#0a1117";c.fillRect(0,0,W,H);
  const horizon=H*.5;c.fillStyle="#253038";c.fillRect(0,horizon,W,H-horizon);c.fillStyle="#34434b";c.fillRect(0,0,W,horizon);
  const cols=Math.max(180,Math.floor(W/4)),fov=Math.PI/2.7;
  for(let i=0;i<cols;i++){const a=g.player.yaw-fov/2+fov*i/cols,dx=Math.cos(a),dz=Math.sin(a);let t=.2;
   while(t<70){t+=.08;const x=g.player.x+dx*t,z=g.player.z+dz*t,w=g.world.walls.find(q=>!q.dead&&Math.abs(x-q.x)<q.w/2&&Math.abs(z-q.z)<q.d/2);
    if(w){const ph=H/(t*.72),top=horizon-ph*.52,bottom=horizon+ph*.48;c.fillStyle=w.destruct?"#66737b":"#505d66";c.fillRect(i*W/cols,top,W/cols+1,Math.min(ph,H));break}
   }
  }
  // enemies as simple projected silhouettes
  for(const b of g.bots)if(b.alive&&g.world.line(g.player,b)){const dx=b.x-g.player.x,dz=b.z-g.player.z,d=Math.hypot(dx,dz),a=Math.atan2(dz,dx)-g.player.yaw;if(Math.abs(Math.atan2(Math.sin(a),Math.cos(a)))<fov/2){const sx=W/2+Math.tan(a)*(W/fov),sy=horizon-H/(d*.75)*.15,sz=Math.max(8,90/d);c.fillStyle=b.team==="D"?"#d76b5d":"#69a7d8";c.fillRect(sx-sz/2,sy-sz,sz,sz*2)}} 
  c.strokeStyle="#dfe8ef";c.beginPath();c.moveTo(W/2-9,H/2);c.lineTo(W/2+9,H/2);c.moveTo(W/2,H/2-9);c.lineTo(W/2,H/2+9);c.stroke();
 }
}