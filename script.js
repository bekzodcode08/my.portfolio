document.getElementById('year').textContent = new Date().getFullYear();
 
const cur = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cur.style.left = mx + 'px';
  cur.style.top = my + 'px';
  ring.style.left = mx + 'px';
  ring.style.top = my + 'px';
});

const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.textContent = '☰';
  });
});

const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

const bars = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('animate'); }
  });
}, { threshold: 0.3 });
bars.forEach(b => barObs.observe(b));

function countUp(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + '+'; clearInterval(timer); return; }
    el.textContent = Math.floor(start);
  }, 16);
}
const statNums = document.querySelectorAll('.stat-num[data-target]');
const statObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      countUp(e.target, parseInt(e.target.dataset.target));
      statObs.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(n => statObs.observe(n));

document.getElementById('formBtn').addEventListener('click', () => {
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const msg = document.getElementById('fmsg').value.trim();
  const msgEl = document.getElementById('formMsg');
  if (!email || !msg) { msgEl.textContent = 'Iltimos, email va xabarni kiriting.'; msgEl.style.color = '#ff6b6b'; msgEl.style.display = 'block'; return; }
  try {
    const list = JSON.parse(localStorage.getItem('messages') || '[]');
    list.push({ name, email, message: msg, date: new Date().toISOString() });
    localStorage.setItem('messages', JSON.stringify(list));
  } catch(e) {}
  msgEl.textContent = `Rahmat, ${name || 'do\'st'}! Xabaringiz qabul qilindi.`;
  msgEl.style.color = 'var(--teal)';                 
  msgEl.style.display = 'block';
  document.getElementById('fname').value = '';
  document.getElementById('femail').value = '';
  document.getElementById('fsubject').value = '';
  document.getElementById('fmsg').value = '';
  setTimeout(() => { msgEl.style.display = 'none'; }, 5000);
});

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 80) cur = s.id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--text)' : '';
  });
});