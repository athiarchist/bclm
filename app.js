/* ==========================================================================
   BCLM (Black Cow Lives Matter) - Web Application Logic with Theme Explorer
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeSwitcher();
  initPledgeCounter();
  initParticleCanvas();
  initSoundboard();
  initGuestbook();
  initGalleryLightbox();
});

/* ==========================================================================
   0. 3-in-1 Live Theme Switcher Logic
   ========================================================================== */
function initThemeSwitcher() {
  const savedTheme = localStorage.getItem('bclm_theme') || 'movement';
  setTheme(savedTheme);

  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const themeId = btn.dataset.themeId;
      if (themeId) {
        setTheme(themeId);
        localStorage.setItem('bclm_theme', themeId);
      }
    });
  });
}

function setTheme(themeId) {
  document.documentElement.setAttribute('data-theme', themeId);

  const themeBtns = document.querySelectorAll('.theme-btn');
  themeBtns.forEach(btn => {
    if (btn.dataset.themeId === themeId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

/* ==========================================================================
   1. Pledge Counter & Confetti Burst
   ========================================================================== */
let pledgeCount = 14892;

function initPledgeCounter() {
  const savedPledges = localStorage.getItem('bclm_pledges');
  if (savedPledges) {
    pledgeCount = parseInt(savedPledges, 10);
  } else {
    localStorage.setItem('bclm_pledges', pledgeCount.toString());
  }

  updatePledgeUI();

  const heroBtn = document.getElementById('hero-pledge-btn');
  const navBtn = document.getElementById('nav-pledge-btn');

  const handlePledge = (e) => {
    pledgeCount += 1;
    localStorage.setItem('bclm_pledges', pledgeCount.toString());
    updatePledgeUI();
    triggerConfettiBurst(e.clientX || window.innerWidth / 2, e.clientY || window.innerHeight / 2);
  };

  if (heroBtn) heroBtn.addEventListener('click', handlePledge);
  if (navBtn) navBtn.addEventListener('click', handlePledge);
}

function updatePledgeUI() {
  const formatted = pledgeCount.toLocaleString();
  const heroSpan = document.getElementById('pledge-count-hero');
  const badgeSpan = document.getElementById('supporter-count-badge');
  const navSpan = document.getElementById('supporter-count-nav');

  if (heroSpan) heroSpan.textContent = formatted;
  if (badgeSpan) badgeSpan.textContent = formatted;
  if (navSpan) navSpan.textContent = formatted;
}

/* ==========================================================================
   2. Canvas Confetti Particles
   ========================================================================== */
let particles = [];
let canvas, ctx;

function initParticleCanvas() {
  canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  requestAnimationFrame(animParticles);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function triggerConfettiBurst(x, y) {
  const colors = ['#f59e0b', '#ffffff', '#e07a5f', '#fbbf24', '#fef08a'];
  for (let i = 0; i < 45; i++) {
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 12,
      vy: (Math.random() - 0.5) * 12 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      decay: Math.random() * 0.02 + 0.015,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.2
    });
  }
}

function animParticles() {
  if (ctx && canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.alpha -= p.decay;
      p.rotation += p.vRot;

      if (p.alpha <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }
  }
  requestAnimationFrame(animParticles);
}

/* ==========================================================================
   3. Web Audio Moo Synthesizer
   ========================================================================== */
let audioCtx = null;
let mooCount = 428;

function initSoundboard() {
  const btn = document.getElementById('moo-trigger-btn');
  const slider = document.getElementById('pitch-slider');
  const pitchLabel = document.getElementById('pitch-val');
  const mooCounterEl = document.getElementById('moo-counter');

  const savedMoos = localStorage.getItem('bclm_moos');
  if (savedMoos) mooCount = parseInt(savedMoos, 10);
  if (mooCounterEl) mooCounterEl.textContent = mooCount.toString();

  if (slider && pitchLabel) {
    slider.addEventListener('input', () => {
      const val = parseFloat(slider.value);
      if (val < 0.85) pitchLabel.textContent = 'Deep Moo';
      else if (val > 1.15) pitchLabel.textContent = 'High Calf';
      else pitchLabel.textContent = 'Standard';
    });
  }

  if (btn) {
    btn.addEventListener('click', () => {
      playMooSound();
      mooCount += 1;
      localStorage.setItem('bclm_moos', mooCount.toString());
      if (mooCounterEl) mooCounterEl.textContent = mooCount.toString();
      animateVisualizer();
    });
  }
}

function animateVisualizer() {
  const vis = document.getElementById('sound-visualizer');
  if (!vis) return;
  vis.classList.add('active');
  setTimeout(() => {
    vis.classList.remove('active');
  }, 1200);
}

function playMooSound() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const pitchMultiplier = parseFloat(document.getElementById('pitch-slider')?.value || '1.0');
  const now = audioCtx.currentTime;

  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, now);
  filter.frequency.exponentialRampToValueAtTime(180, now + 1.1);

  const baseFreq = 130 * pitchMultiplier;

  osc1.type = 'sawtooth';
  osc1.frequency.setValueAtTime(baseFreq * 0.9, now);
  osc1.frequency.linearRampToValueAtTime(baseFreq * 1.15, now + 0.3);
  osc1.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, now + 1.2);

  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(baseFreq * 1.8, now);
  osc2.frequency.linearRampToValueAtTime(baseFreq * 2.1, now + 0.3);
  osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 1.2);

  gain1.gain.setValueAtTime(0, now);
  gain1.gain.linearRampToValueAtTime(0.4, now + 0.2);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  gain2.gain.setValueAtTime(0, now);
  gain2.gain.linearRampToValueAtTime(0.15, now + 0.25);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc1.connect(gain1);
  osc2.connect(gain2);
  gain1.connect(filter);
  gain2.connect(filter);
  filter.connect(audioCtx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 1.25);
  osc2.stop(now + 1.25);
}

/* ==========================================================================
   4. Guestbook & Photo Upload Wall (SQLite API + Local Storage Fallback)
   ========================================================================== */
let guestbookEntries = [];
let currentPhotoDataUrl = null;

const STARTER_ENTRIES = [
  {
    id: 'starter-1',
    name: 'Marcus Vance',
    location: 'Pasture Sanctuary, OR',
    message: 'So heartwarming to hear his rescue story! Saving him from slaughter and keeping him as a pasture pet steer is pure inspiration. Every living creature deserves this peace.',
    photo: '/assets/gallery/cow1.png',
    time: '2 hours ago',
    likes: 34,
    liked: false
  },
  {
    id: 'starter-2',
    name: 'Elena Rostova',
    location: 'Austin, TX',
    message: 'Look at how gentle and happy he is! Here is a photo of a rescued steer I visited at our local farm sanctuary. BCLM forever! 🖤🐮',
    photo: '/assets/gallery/cow2.png',
    time: '5 hours ago',
    likes: 52,
    liked: true
  },
  {
    id: 'starter-3',
    name: 'Cody & Family',
    location: 'Fayetteville, AR',
    message: 'Teaching the kids that steers are sweet pasture pets with personalities just like dogs and cats. Thank you for rescuing him!',
    photo: '/assets/gallery/cow3.png',
    time: '1 day ago',
    likes: 27,
    liked: false
  }
];

function initGuestbook() {
  loadGuestbookData();
  setupPhotoUpload();
  setupFormSubmission();
  setupFilterTabs();
}

async function loadGuestbookData() {
  try {
    const res = await fetch('/api/guestbook');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const myLikes = JSON.parse(localStorage.getItem('bclm_my_likes') || '{}');
        guestbookEntries = data.map(item => ({
          ...item,
          liked: Boolean(myLikes[item.id])
        }));
        renderGuestbook('all');
        return;
      }
    }
  } catch (err) {
    console.warn('SQLite API fetch offline or not deployed yet, falling back to local mode.', err);
  }

  // Fallback to localStorage / Starter entries
  const stored = localStorage.getItem('bclm_guestbook');
  if (stored) {
    try {
      guestbookEntries = JSON.parse(stored);
    } catch (e) {
      guestbookEntries = [...STARTER_ENTRIES];
    }
  } else {
    guestbookEntries = [...STARTER_ENTRIES];
    saveGuestbookData();
  }
  renderGuestbook('all');
}

function saveGuestbookData() {
  localStorage.setItem('bclm_guestbook', JSON.stringify(guestbookEntries));
}

function setupPhotoUpload() {
  const fileInput = document.getElementById('gb-photo');
  const dropzone = document.getElementById('upload-dropzone');
  const prompt = document.getElementById('dropzone-prompt');
  const previewBox = document.getElementById('photo-preview-box');
  const previewImg = document.getElementById('photo-preview-img');
  const removeBtn = document.getElementById('btn-remove-photo');

  if (!fileInput || !dropzone) return;

  ['dragenter', 'dragover'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  });

  function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      currentPhotoDataUrl = evt.target.result;
      previewImg.src = currentPhotoDataUrl;
      prompt.classList.add('hidden');
      previewBox.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearPhotoUpload();
    });
  }
}

function clearPhotoUpload() {
  currentPhotoDataUrl = null;
  const fileInput = document.getElementById('gb-photo');
  const prompt = document.getElementById('dropzone-prompt');
  const previewBox = document.getElementById('photo-preview-box');
  const previewImg = document.getElementById('photo-preview-img');

  if (fileInput) fileInput.value = '';
  if (previewImg) previewImg.src = '';
  if (prompt) prompt.classList.remove('hidden');
  if (previewBox) previewBox.classList.add('hidden');
}

function setupFormSubmission() {
  const form = document.getElementById('guestbook-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('gb-name');
    const locInput = document.getElementById('gb-location');
    const msgInput = document.getElementById('gb-message');

    const name = nameInput.value.trim();
    const location = locInput.value.trim() || 'Pasture Supporter';
    const message = msgInput.value.trim();

    if (!name || !message) return;

    const payload = {
      name,
      location,
      message,
      photo: currentPhotoDataUrl
    };

    // Try posting to SQLite API first
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.entry) {
          guestbookEntries.unshift(data.entry);
          renderGuestbook('all');
          form.reset();
          clearPhotoUpload();
          triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 3);
          return;
        }
      }
    } catch (err) {
      console.warn('API submission offline, using local fallback.', err);
    }

    // Local fallback
    const newEntry = {
      id: 'gb-' + Date.now(),
      name,
      location,
      message,
      photo: currentPhotoDataUrl,
      time: 'Just now',
      likes: 1,
      liked: true
    };

    guestbookEntries.unshift(newEntry);
    saveGuestbookData();
    renderGuestbook('all');

    form.reset();
    clearPhotoUpload();
    triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 3);
  });
}

function setupFilterTabs() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGuestbook(btn.dataset.filter);
    });
  });
}

function renderGuestbook(filter = 'all') {
  const feed = document.getElementById('guestbook-feed');
  const countBadge = document.getElementById('feed-count-badge');
  if (!feed) return;

  let list = [...guestbookEntries];
  if (filter === 'photos') {
    list = list.filter(item => Boolean(item.photo));
  }

  if (countBadge) countBadge.textContent = `${list.length} Entries`;

  if (list.length === 0) {
    feed.innerHTML = `
      <div style="text-align: center; padding: 40px; color: var(--text-muted);">
        No posts found for this filter. Be the first to upload!
      </div>
    `;
    return;
  }

  feed.innerHTML = list.map(entry => {
    const initials = entry.name.slice(0, 2).toUpperCase();
    const photoHtml = entry.photo ? `
      <div class="gb-photo-wrap">
        <img src="${entry.photo}" alt="Uploaded by ${entry.name}" class="lightbox-trigger" data-src="${entry.photo}" data-caption="Uploaded by ${entry.name}">
      </div>
    ` : '';

    return `
      <div class="gb-card" data-id="${entry.id}">
        <div class="gb-card-header">
          <div class="gb-author-info">
            <div class="gb-avatar">${initials}</div>
            <div>
              <div class="gb-author-name">${escapeHtml(entry.name)}</div>
              <div class="gb-author-meta">${escapeHtml(entry.location)}</div>
            </div>
          </div>
          <span class="gb-time">${entry.time}</span>
        </div>
        <p class="gb-message">${escapeHtml(entry.message)}</p>
        ${photoHtml}
        <div class="gb-card-footer">
          <button class="like-btn ${entry.liked ? 'liked' : ''}" onclick="toggleEntryLike('${entry.id}')">
            <span>${entry.liked ? '❤️' : '🤍'}</span>
            <span class="like-count">${entry.likes}</span>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.toggleEntryLike = async function(id) {
  const entry = guestbookEntries.find(item => item.id === id);
  if (entry) {
    const isNowLiked = !entry.liked;
    entry.liked = isNowLiked;
    entry.likes = isNowLiked ? entry.likes + 1 : Math.max(0, entry.likes - 1);

    const myLikes = JSON.parse(localStorage.getItem('bclm_my_likes') || '{}');
    if (isNowLiked) myLikes[id] = true;
    else delete myLikes[id];
    localStorage.setItem('bclm_my_likes', JSON.stringify(myLikes));

    // Try API like update
    try {
      fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, increment: isNowLiked })
      });
    } catch (e) {}

    saveGuestbookData();
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderGuestbook(activeFilter);
  }
};

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
}

/* ==========================================================================
   5. Lightbox Modal Viewer
   ========================================================================== */
function initGalleryLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCap = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!modal || !modalImg) return;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.gallery-item, .lightbox-trigger');
    if (trigger) {
      const src = trigger.dataset.src || trigger.getAttribute('src');
      const caption = trigger.dataset.caption || '';
      if (src) {
        modalImg.src = src;
        modalCap.textContent = caption;
        modal.classList.remove('hidden');
      }
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });
}
