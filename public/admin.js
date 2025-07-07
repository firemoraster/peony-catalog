const API = '/api/flowers';
let flowers = [], isAdmin = false, editId = null, files = [], vf = 0, vi = 0, searchText = '', sortOption = 'name-asc';

// DOM
const list = document.getElementById('flower-list'),
      adminBtn = document.getElementById('admin-login-btn'),
      addBtn = document.getElementById('add-flower-btn'),
      modal = document.getElementById('modal'),
      form  = document.getElementById('flower-form'),
      cancelBtn = document.getElementById('cancel-btn'),
      imgInput  = document.getElementById('flower-image-files'),
      viewer    = document.getElementById('image-viewer'),
      vImg      = document.getElementById('image-viewer-img'),
      prevBtn   = document.getElementById('viewer-prev'),
      nextBtn   = document.getElementById('viewer-next'),
      searchInput = document.getElementById('search-input'),
      sortSelect = document.getElementById('sort-select');

const show = (e) => e.classList.remove('hidden');
const hide = (e) => e.classList.add('hidden');

async function load() {
  const res = await fetch(API);
  flowers = await res.json();
  render();
}
function render() {
  list.innerHTML = '';
  let filtered = flowers.filter(f => f.name.toLowerCase().includes(searchText.toLowerCase()));

  switch (sortOption) {
    case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
    case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
  }

  filtered.forEach((f, i) => {
    let currentIndex = 0;
    const card = document.createElement('div'); 
    card.className = 'flower-card';

    const img = document.createElement('img');
    img.src = f.images[currentIndex]; 
    img.alt = f.name;
    img.onclick = () => openViewer(i, currentIndex);

    const ctr = document.createElement('div'); 
    ctr.className = 'carousel-controls';
    ['◀︎','▶︎'].forEach((s, ii) => {
      const b = document.createElement('button'); 
      b.textContent = s;
      b.onclick = (e) => {
        e.stopPropagation();
        currentIndex = (currentIndex + (ii ? 1 : -1) + f.images.length) % f.images.length;
        img.src = f.images[currentIndex];
      };
      ctr.append(b);
    });

    const cnt = document.createElement('div'); 
    cnt.className = 'content';
    const descId = `desc-${i}`;
    cnt.innerHTML = `
        <h3>${f.name}</h3>
        <div id="${descId}" class="card-desc">${f.desc}</div>
        <span class="read-more" onclick="toggleDesc('${descId}', this)">Детальніше...</span>
        <p><strong>${f.price} грн</strong></p>
    `;

    if (isAdmin) {
      const ab = document.createElement('div'); 
      ab.className = 'admin-btns';
      const eB = document.createElement('button'); 
      eB.textContent = '✏️'; 
      eB.onclick = () => startEdit(f);
      const dB = document.createElement('button'); 
      dB.textContent = '🗑️'; 
      dB.onclick = () => remove(f.id);
      ab.append(eB, dB); 
      cnt.append(ab);
    }

    card.append(img, ctr, cnt);
    list.append(card);
  });
}


window.toggleDesc = function (id, btn) {
  const el = document.getElementById(id);
  el.classList.toggle('expanded');
  btn.textContent = el.classList.contains('expanded') ? 'Згорнути' : 'Детальніше...';
};

adminBtn.onclick = () => {
  const p = prompt('Пароль:');
  if (p === 'admin123') {
    isAdmin = true;
    document.querySelectorAll('.admin-only').forEach(show);
    load();
  } else {
    alert('Невірний пароль');
  }
};

addBtn.onclick = () => {
  editId = null; form.reset(); files = []; show(modal);
  document.getElementById('modal-title').innerText = 'Нова півонія';
};
cancelBtn.onclick = () => hide(modal);

imgInput.onchange = e => files = Array.from(e.target.files);

form.onsubmit = async e => {
  e.preventDefault();
  const fd = new FormData(form);
  files.forEach(f => fd.append('images', f));
  if (editId) await fetch(`${API}/${editId}`, { method: 'PUT', body: fd });
  else await fetch(API, { method: 'POST', body: fd });
  hide(modal); load();
};

function startEdit(f) {
  editId = f.id;
  form['flower-name'].value = f.name;
  form['flower-desc'].value = f.desc;
  form['flower-price'].value = f.price;
  files = [];
  show(modal);
  document.getElementById('modal-title').innerText = 'Редагування півонії';
}

async function remove(id) {
  if (confirm('Видалити?')) {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    load();
  }
}

function openViewer(fi, ii = 0) {
  vf = fi; vi = ii; updateViewer(); show(viewer);
}
function updateViewer() {
  vImg.src = flowers[vf].images[vi];
  vImg.classList.remove('zoomed');
}
prevBtn.onclick = () => {
  vi = (vi - 1 + flowers[vf].images.length) % flowers[vf].images.length;
  updateViewer();
};
nextBtn.onclick = () => {
  vi = (vi + 1) % flowers[vf].images.length;
  updateViewer();
};
vImg.ondblclick = () => vImg.classList.toggle('zoomed');
viewer.onclick = e => { if (e.target === viewer) hide(viewer); };

searchInput.oninput = e => {
  searchText = e.target.value;
  render();
};
sortSelect.onchange = e => {
  sortOption = e.target.value;
  render();
};

load();

// Анімація пелюсток
window.addEventListener('DOMContentLoaded', () => {
  const flowerSection = document.querySelector('.flower-fall');
  if (!flowerSection) return;

  for (let i = 0; i < 30; i++) {
    const flower = document.createElement('div');
    flower.className = 'petal';
    flower.style.left = `${Math.random() * 100}%`;
    flower.style.animationDuration = `${3 + Math.random() * 5}s`;
    flower.style.animationDelay = `-${Math.random() * 5}s`;
    flower.style.opacity = Math.random().toFixed(1);
    flowerSection.appendChild(flower);
  }

  setInterval(() => {
    const flower = document.createElement('div');
    flower.className = 'petal';
    flower.style.left = `${Math.random() * 100}%`;
    flower.style.animationDuration = `${3 + Math.random() * 5}s`;
    flower.style.animationDelay = `0s`;
    flower.style.opacity = Math.random().toFixed(1);
    flowerSection.appendChild(flower);
    setTimeout(() => flower.remove(), 10000);
  }, 700);
});
