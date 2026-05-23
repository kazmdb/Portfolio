/* ============================================
   PORTFOLIO — interactions
   ============================================ */

(() => {
  'use strict';

  /* ---------- CUSTOM CURSOR ---------- */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`; }
  }, { passive: true });

  function tickCursor() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    if (ring) ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  document.querySelectorAll('a, button, .project-card, .stack-item, input, textarea')
    .forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });

  /* ---------- MOBILE MENU ---------- */
  const menuBtn = document.querySelector('.nav-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const menuClose = menu && menu.querySelector('.mm-close');

  if (menuBtn && menu) {
    const open = () => {
      menu.classList.add('open');
      menu.setAttribute('aria-hidden', 'false');
      menuBtn.setAttribute('aria-expanded', 'true');
      menuBtn.setAttribute('aria-label', 'Cerrar menú');
      document.body.classList.add('menu-open');
    };
    const close = () => {
      menu.classList.remove('open');
      menu.setAttribute('aria-hidden', 'true');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.setAttribute('aria-label', 'Abrir menú');
      document.body.classList.remove('menu-open');
    };
    menuBtn.addEventListener('click', () => {
      if (menu.classList.contains('open')) close(); else open();
    });
    if (menuClose) menuClose.addEventListener('click', close);
    // close on link click (lets the smooth-scroll happen)
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
    // close on escape
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    // close on click outside the inner panel
    menu.addEventListener('click', (e) => {
      if (e.target === menu) close();
    });
  }

  /* ---------- NAVBAR SCROLL STATE ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        // skill bars
        if (e.target.classList.contains('skills')) {
          e.target.querySelectorAll('.skill-row .fill').forEach(f => {
            const v = f.dataset.value || '0';
            requestAnimationFrame(() => { f.style.width = v + '%'; });
          });
        }
        // stat counters (hero-hud, hero-stats, hero-stats-section)
        if (e.target.classList.contains('hero-stats') ||
            e.target.classList.contains('hero-stats-section') ||
            e.target.classList.contains('hero-hud')) {
          e.target.querySelectorAll('[data-count]').forEach(animateCount);
        }
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal, .skills, .hero-stats, .hero-hud').forEach(el => io.observe(el));

  /* ---------- COUNT-UP ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec = (el.dataset.dec | 0);
    const dur = 1400;
    const start = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      const v = target * eased;
      el.textContent = dec ? v.toFixed(dec) : Math.round(v).toString();
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- TYPEWRITER ---------- */
  const roles = ['Fullstack Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Code Architect'];
  const roleEl = document.querySelector('.hero-typer .role');
  if (roleEl) {
    let i = 0, j = 0, deleting = false;
    const tick = () => {
      const word = roles[i];
      roleEl.textContent = word.slice(0, j);
      let delay = deleting ? 35 : 75;
      if (!deleting && j === word.length) { delay = 1600; deleting = true; }
      else if (deleting && j === 0) { deleting = false; i = (i + 1) % roles.length; delay = 250; }
      else j += deleting ? -1 : 1;
      setTimeout(tick, delay);
    };
    tick();
  }

  /* ---------- SKY PARTICLES (top half of hero only) ---------- */
  const sky = document.getElementById('sky-particles');
  if (sky) {
    const sctx = sky.getContext('2d');
    let SW = 0, SH = 0, sdpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars = [];
    const SCOUNT = window.innerWidth < 768 ? 24 : 50;
    const SLINK = 120;
    let sInit = false;

    const sSeed = () => {
      stars = [];
      for (let i = 0; i < SCOUNT; i++) {
        stars.push({
          x: Math.random() * SW,
          y: Math.random() * SH,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.10,
          r: Math.random() * 1.2 + 0.4
        });
      }
    };
    const sResize = () => {
      const r = sky.getBoundingClientRect();
      const nW = Math.max(r.width, 1), nH = Math.max(r.height, 1);
      if (sInit && SW > 0 && SH > 0) {
        const sx = nW / SW, sy = nH / SH;
        for (const p of stars) { p.x *= sx; p.y *= sy; }
      }
      SW = nW; SH = nH;
      sky.width = SW * sdpr; sky.height = SH * sdpr;
      sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
      if (!sInit) { sSeed(); sInit = true; }
    };
    sResize();
    window.addEventListener('load', sResize);
    window.addEventListener('resize', sResize);

    let smx = -9999, smy = -9999;
    const heroEl = sky.closest('.hero') || document;
    heroEl.addEventListener('mousemove', (e) => {
      const r = sky.getBoundingClientRect();
      smx = e.clientX - r.left;
      smy = e.clientY - r.top;
    });
    heroEl.addEventListener('mouseleave', () => { smx = smy = -9999; });

    // throttle to ~30fps for canvas paint — saves significant CPU vs 60fps,
    // and the motion is slow enough that it looks identical
    let last = 0;
    const draw = (t) => {
      requestAnimationFrame(draw);
      if (t - last < 33) return;
      last = t;
      sctx.clearRect(0, 0, SW, SH);
      for (const p of stars) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > SW) p.vx *= -1;
        if (p.y < 0 || p.y > SH) p.vy *= -1;
      }
      // links between particles
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        for (let j = i + 1; j < stars.length; j++) {
          const b = stars[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < SLINK * SLINK) {
            const op = 1 - Math.sqrt(d2) / SLINK;
            sctx.strokeStyle = `rgba(0, 245, 255, ${op * 0.16})`;
            sctx.lineWidth = 0.5;
            sctx.beginPath(); sctx.moveTo(a.x, a.y); sctx.lineTo(b.x, b.y); sctx.stroke();
          }
        }
        // mouse interaction (only if cursor is in the sky region)
        if (smy >= 0 && smy <= SH) {
          const dx = a.x - smx, dy = a.y - smy;
          const d2 = dx * dx + dy * dy;
          if (d2 < 20000) {
            const op = 1 - Math.sqrt(d2) / 142;
            sctx.strokeStyle = `rgba(255, 0, 128, ${op * 0.45})`;
            sctx.lineWidth = 0.7;
            sctx.beginPath(); sctx.moveTo(a.x, a.y); sctx.lineTo(smx, smy); sctx.stroke();
          }
        }
      }
      // dots
      sctx.fillStyle = 'rgba(0, 245, 255, .55)';
      for (const p of stars) {
        sctx.beginPath();
        sctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        sctx.fill();
      }
    };
    requestAnimationFrame(draw);
  }

  /* ---------- HERO MOUSE-FOLLOW SPOTLIGHT (replaces particles) ---------- */
  const hero = document.querySelector('.hero');
  const spot = document.querySelector('.hero-spot');
  if (hero && spot) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      spot.style.setProperty('--mx', x + '%');
      spot.style.setProperty('--my', y + '%');
    });
  }

  /* ---------- BUTTON RIPPLE ---------- */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const r = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - r.left) + 'px';
      ripple.style.top = (e.clientY - r.top) + 'px';
      ripple.style.width = '40px';
      ripple.style.height = '40px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 800);
    });
  });

  /* ---------- PROJECT CARD 3D TILT ---------- */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const max = 6;
      card.style.transform = `translateY(-6px) rotateX(${-y * max}deg) rotateY(${x * max}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- FLOATING LABELS ---------- */
  document.querySelectorAll('.field input, .field textarea').forEach(inp => {
    const field = inp.closest('.field');
    inp.addEventListener('focus', () => field.classList.add('focused'));
    inp.addEventListener('blur', () => {
      field.classList.remove('focused');
      field.classList.toggle('filled', inp.value.trim().length > 0);
    });
    inp.addEventListener('input', () => {
      field.classList.toggle('filled', inp.value.trim().length > 0);
    });
  });

  /* ---------- CONTACT FORM SUBMIT ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit-btn');
      btn.dataset.state = 'loading';
      setTimeout(() => {
        btn.dataset.state = 'done';
        setTimeout(() => {
          btn.dataset.state = 'default';
          form.reset();
          form.querySelectorAll('.field').forEach(f => f.classList.remove('filled', 'focused'));
        }, 2200);
      }, 1500);
    });
  }

  /* ---------- MATRIX EASTER EGG ---------- */
  const trigger = document.querySelector('[data-easter]');
  const overlay = document.getElementById('matrix-overlay');
  if (trigger && overlay) {
    const mxc = overlay.querySelector('canvas');
    const mctx = mxc.getContext('2d');
    let running = false, drops = [];
    const fontSize = 16;

    const startMatrix = () => {
      if (running) return;
      running = true;
      overlay.classList.add('on');
      const w = mxc.width = window.innerWidth;
      const h = mxc.height = window.innerHeight;
      const cols = Math.floor(w / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.random() * -50);
      const chars = '01アイウエオカキクケコサシスセソ<>{}[]/\\$#*+=-';

      const step = () => {
        mctx.fillStyle = 'rgba(5,5,8,0.08)';
        mctx.fillRect(0, 0, w, h);
        mctx.font = fontSize + 'px JetBrains Mono, monospace';
        for (let i = 0; i < drops.length; i++) {
          const text = chars[(Math.random() * chars.length) | 0];
          const x = i * fontSize;
          const y = drops[i] * fontSize;
          mctx.fillStyle = drops[i] < 2 ? '#fff' : '#00f5ff';
          mctx.fillText(text, x, y);
          if (y > h && Math.random() > 0.975) drops[i] = 0;
          drops[i] += 1;
        }
        if (running) requestAnimationFrame(step);
      };
      step();

      setTimeout(stopMatrix, 3500);
    };
    const stopMatrix = () => {
      overlay.classList.remove('on');
      setTimeout(() => { running = false; mctx.clearRect(0, 0, mxc.width, mxc.height); }, 320);
    };
    trigger.addEventListener('click', (e) => { e.preventDefault(); startMatrix(); });
  }

  /* ---------- UPDATE CLOCK ---------- */
  const clock = document.querySelector('[data-clock]');
  if (clock) {
    const update = () => {
      const d = new Date();
      const pad = n => String(n).padStart(2, '0');
      clock.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} UTC`;
    };
    update();
    setInterval(update, 1000);
  }

})();
