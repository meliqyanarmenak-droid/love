// ─── PETALS CANVAS ───
(function() {
  const canvas = document.getElementById('petals-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const colors = ['#3b0a0a','#6b1a1a','#8b2020','#4a0d0d','#2a0707'];

  class Petal {
    constructor() { this.reset(true); }

    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -20;
      this.size = Math.random() * 7 + 3;
      this.speedY = Math.random() * 1.2 + 0.4;
      this.speedX = (Math.random() - 0.5) * 0.6;
      this.rot = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.opacity = Math.random() * 0.5 + 0.15;
      this.sway = Math.random() * 0.3;
      this.swayOffset = Math.random() * Math.PI * 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(t) {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(t * 0.5 + this.swayOffset) * this.sway;
      this.rot += this.rotSpeed;
      if (this.y > H + 20 || this.x < -20 || this.x > W + 20) this.reset(false);
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const petals = Array.from({ length: 55 }, () => new Petal());
  let t = 0;

  function loop() {
    ctx.clearRect(0, 0, W, H);
    t += 0.016;
    petals.forEach(p => { p.update(t); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

// ─── PAGE TRANSITION ───
function doTransition(href) {
  const overlay = document.getElementById('page-transition');
  if (!overlay) { window.location.href = href; return; }
  overlay.classList.add('active');
  setTimeout(() => { window.location.href = href; }, 700);
}

document.querySelectorAll('[data-transition]').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    doTransition(el.getAttribute('data-transition'));
  });
});

window.addEventListener('pageshow', () => {
  const overlay = document.getElementById('page-transition');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.transition = 'none';
    setTimeout(() => { overlay.style.transition = ''; }, 50);
  }
});

// ─── SCROLL REVEAL ───
function initScrollReveal() {
  const items = document.querySelectorAll('.photo-item, .reason-card, .gallery-finale-text, .reasons-footer');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add('visible'), delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  items.forEach((el, i) => {
    el.dataset.delay = i * 80;
    observer.observe(el);
  });
}

// ─── PARALLAX ───
function initParallax() {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.25}px)`;
    const heroCont = document.querySelector('.hero-content');
    if (heroCont) heroCont.style.transform = `translateY(${scrolled * 0.12}px)`;
  });
}

// ─── TYPEWRITER ───
function initTypewriter() {
  const el = document.getElementById('letter-body');
  if (!el) return;

  const text = el.getAttribute('data-text');
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  el.appendChild(cursor);

  let i = 0;
  const speed = 28;

  function type() {
    if (i < text.length) {
      el.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
      const delay = text[i - 1] === '\n' ? 180 : text[i - 1] === '.' || text[i - 1] === ',' ? 120 : speed + Math.random() * 20;
      setTimeout(type, delay);
    } else {
      cursor.remove();
      const sig = document.querySelector('.letter-signature');
      if (sig) setTimeout(() => sig.classList.add('visible'), 400);
    }
  }

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      setTimeout(type, 600);
      observer.disconnect();
    }
  }, { threshold: 0.3 });

  observer.observe(el);
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initParallax();
  initTypewriter();
});
