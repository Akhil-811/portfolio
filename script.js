const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

const navToggle = $(".nav-toggle");
const navLinks = $(".nav-links");
navToggle?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(open));
});
$$(".nav-links a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

const progress = $("#progress");
window.addEventListener("scroll", () => {
  const h = document.documentElement;
  progress.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`;
}, {passive:true});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$(".reveal").forEach(el => observer.observe(el));

$$(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    $$(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const filter = btn.dataset.filter;
    $$(".project").forEach(card => {
      const tags = card.dataset.tags.split(" ");
      card.classList.toggle("is-hidden", filter !== "all" && !tags.includes(filter));
    });
  });
});

// Lightweight animated network background; intentionally dependency-free for GitHub Pages.
const canvas = $("#network");
const ctx = canvas.getContext("2d");
let points = [];
function resize(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = innerWidth*dpr; canvas.height = innerHeight*dpr;
  canvas.style.width = innerWidth+"px"; canvas.style.height = innerHeight+"px";
  ctx.setTransform(dpr,0,0,dpr,0,0);
  points = Array.from({length: Math.min(44, Math.floor(innerWidth/24))}, () => ({
    x:Math.random()*innerWidth, y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.16, vy:(Math.random()-.5)*.16
  }));
}
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1;}
  for(let i=0;i<points.length;i++){
    const a=points[i];
    for(let j=i+1;j<points.length;j++){
      const b=points[j], dx=a.x-b.x, dy=a.y-b.y, d=Math.hypot(dx,dy);
      if(d<150){
        ctx.strokeStyle=`rgba(92,225,230,${(1-d/150)*.08})`;
        ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
    ctx.fillStyle="rgba(155,124,255,.22)";ctx.beginPath();ctx.arc(a.x,a.y,1.2,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(draw);
}
resize(); addEventListener("resize", resize); draw();
