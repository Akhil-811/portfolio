const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const navToggle=$(".nav-toggle"),navLinks=$(".nav-links");
navToggle?.addEventListener("click",()=>{const o=navLinks.classList.toggle("open");navToggle.setAttribute("aria-expanded",String(o))});
$$(".nav-links a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));
const progress=$("#progress");
addEventListener("scroll",()=>{const h=document.documentElement;progress.style.width=`${(h.scrollTop/(h.scrollHeight-h.clientHeight))*100}%`},{passive:true});
const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}}),{threshold:.08});
$$(".reveal").forEach(e=>observer.observe(e));
$$(".filter").forEach(btn=>btn.addEventListener("click",()=>{$$(".filter").forEach(b=>b.classList.remove("active"));btn.classList.add("active");const f=btn.dataset.filter;$$(".project").forEach(c=>c.classList.toggle("is-hidden",f!=="all"&&!c.dataset.tags.split(" ").includes(f)))}));

// GitHub repository snapshot: public API, no token required for this portfolio use.
const repoGrid=$("#repo-grid");
async function loadRepos(){
  try{
    const r=await fetch("https://api.github.com/users/Akhil-811/repos?per_page=100&sort=updated");
    if(!r.ok) throw new Error("GitHub API unavailable");
    const repos=await r.json();
    repoGrid.innerHTML=repos.slice(0,12).map(x=>`<a class="repo-card" href="${x.html_url}" target="_blank" rel="noreferrer">
      <span class="section-kicker">${(x.language||"CODE").toUpperCase()}</span>
      <h3>${x.name.replaceAll("-"," ")}</h3><p>${(x.description||"Public repository from the AI/ML engineering journey.").slice(0,150)}</p>
      <div class="repo-meta"><span>★ ${x.stargazers_count}</span><b>View ↗</b></div></a>`).join("");
  }catch(e){repoGrid.innerHTML=`<div class="repo-loading">GitHub activity is available on <a href="https://github.com/Akhil-811?tab=repositories" target="_blank" style="color:var(--cyan)">github.com/Akhil-811</a>.</div>`}
}
loadRepos();

const canvas=$("#network"),ctx=canvas.getContext("2d");let points=[];
function resize(){const d=Math.min(devicePixelRatio||1,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(d,0,0,d,0,0);points=Array.from({length:Math.min(44,Math.floor(innerWidth/24))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,vx:(Math.random()-.5)*.16,vy:(Math.random()-.5)*.16}))}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const p of points){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>innerWidth)p.vx*=-1;if(p.y<0||p.y>innerHeight)p.vy*=-1}for(let i=0;i<points.length;i++){const a=points[i];for(let j=i+1;j<points.length;j++){const b=points[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<150){ctx.strokeStyle=`rgba(92,225,230,${(1-d/150)*.08})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}ctx.fillStyle="rgba(155,124,255,.22)";ctx.beginPath();ctx.arc(a.x,a.y,1.2,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}
resize();addEventListener("resize",resize);draw();
