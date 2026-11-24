const screens=[...document.querySelectorAll('.screen')];
const dots=[...document.querySelectorAll('.dot')];
let current='home';
function showScreen(id){
  const target=document.getElementById(id); if(!target)return;
  screens.forEach(s=>s.classList.toggle('active',s.id===id));
  dots.forEach(d=>d.classList.toggle('active',d.dataset.go===id));
  current=id; window.scrollTo({top:0,behavior:'smooth'});
  burst(window.innerWidth/2,window.innerHeight*.55,9);
}
document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',e=>{e.stopPropagation();showScreen(el.dataset.go);burst(e.clientX||innerWidth/2,e.clientY||innerHeight/2,15)}));
dots.forEach(d=>d.addEventListener('click',e=>{showScreen(d.dataset.go);burst(e.clientX,e.clientY,10)}));

// Every tap/click creates a small floating heart or sparkle reaction.
const colors=['#ff9fc8','#ffd5e8','#d9b7ff','#fff0c9'];
function burst(x,y,count=7){
  for(let i=0;i<count;i++){
    const el=document.createElement('span');el.className='heart-pop';
    el.textContent=['♥','♡','✦','✧','❀'][Math.floor(Math.random()*5)];
    el.style.setProperty('--x',x+'px');el.style.setProperty('--y',y+'px');
    el.style.setProperty('--dx',(Math.random()*150-75)+'px');
    el.style.setProperty('--size',(12+Math.random()*20)+'px');
    el.style.setProperty('--color',colors[Math.floor(Math.random()*colors.length)]);
    document.body.appendChild(el);setTimeout(()=>el.remove(),1300);
  }
}
document.addEventListener('click',e=>{
  if(e.target.closest('button,a,.gift-box'))return;
  burst(e.clientX,e.clientY,6);
});
document.getElementById('gardenScene').addEventListener('click',e=>burst(e.clientX,e.clientY,18));

// Starfield background.
const canvas=document.getElementById('stars'),ctx=canvas.getContext('2d');let stars=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(110,Math.floor(innerWidth/8))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.5+.25,a:Math.random(),v:Math.random()*.008+.002}));}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);stars.forEach(s=>{s.a+=s.v;if(s.a>1||s.a<.15)s.v*=-1;ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,225,244,${Math.max(.12,Math.min(.8,s.a))})`;ctx.fill()});requestAnimationFrame(draw)}
addEventListener('resize',resize);resize();draw();

// Countdown: upcoming January 2, 2027, at midnight in the visitor's local time.
const targetDate=new Date(2027,0,2,0,0,0);
const $=id=>document.getElementById(id);
function updateCountdown(){
  const diff=targetDate.getTime()-Date.now();
  if(diff<=0){
    $('countdownCard').classList.add('hidden');$('giftBox').querySelector('.lock').textContent='✨';
    $('giftBox').setAttribute('aria-label','Unlocked surprise gift');$('unlockedMessage').classList.remove('hidden');return;
  }
  const day=Math.floor(diff/86400000),hour=Math.floor(diff%86400000/3600000),minute=Math.floor(diff%3600000/60000),second=Math.floor(diff%60000/1000);
  $('days').textContent=String(day).padStart(2,'0');$('hours').textContent=String(hour).padStart(2,'0');$('minutes').textContent=String(minute).padStart(2,'0');$('seconds').textContent=String(second).padStart(2,'0');
}
updateCountdown();setInterval(updateCountdown,1000);
$('giftBox').addEventListener('click',e=>{burst(e.clientX,e.clientY,18);if(Date.now()<targetDate.getTime()){ $('countdownHint').textContent='Not yet… your surprise is saving its sparkle. ♡'; }else{$('unlockedMessage').classList.remove('hidden');}});
$('giftBox').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('giftBox').click();}});
$('openGift').addEventListener('click',e=>{$('surpriseModal').classList.remove('hidden');burst(e.clientX,e.clientY,24)});
$('closeModal').addEventListener('click',()=> $('surpriseModal').classList.add('hidden'));
$('surpriseModal').addEventListener('click',e=>{if(e.target.id==='surpriseModal')e.currentTarget.classList.add('hidden')});

// Optional gentle sound toggle using a quiet synthesized chime; starts only after user interaction.
let audioCtx=null,soundOn=false;
$('soundToggle').addEventListener('click',()=>{
  soundOn=!soundOn;$('soundToggle').querySelector('span').textContent=soundOn?'Sound on':'Sound off';
  if(soundOn){try{audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)();const now=audioCtx.currentTime;[523.25,659.25,783.99].forEach((freq,i)=>{const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,now+i*.16);g.gain.exponentialRampToValueAtTime(.035,now+i*.16+.04);g.gain.exponentialRampToValueAtTime(.0001,now+i*.16+.6);o.connect(g);g.connect(audioCtx.destination);o.start(now+i*.16);o.stop(now+i*.16+.65)});}catch(err){soundOn=false;$('soundToggle').querySelector('span').textContent='Sound off'}}
});
