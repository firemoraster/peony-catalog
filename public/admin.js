const API = '/api/flowers';

let flowers = [], isAdmin=false, editId=null, files=[], vf=0, vi=0;

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
      nextBtn   = document.getElementById('viewer-next');

const show=(e)=>e.classList.remove('hidden'),
      hide=(e)=>e.classList.add('hidden');

async function load() {
  const res=await fetch(API);
  flowers=await res.json();
  render();
}

function render() {
  list.innerHTML='';
  flowers.forEach((f,i)=>{
    let ci=0;
    const card=document.createElement('div'); card.className='flower-card';
    const img=document.createElement('img');
    img.src=f.images[ci]; img.alt=f.name;
    img.onclick=()=>openViewer(i,ci);
    const ctr=document.createElement('div'); ctr.className='carousel-controls';
    ['◀︎','▶︎'].forEach((s,ii)=>{
      const b=document.createElement('button'); b.textContent=s;
      b.onclick=()=>{
        ci=(ci + (ii?1:-1)+f.images.length)%f.images.length;
        img.src=f.images[ci];
      };
      ctr.append(b);
    });
    const cnt=document.createElement('div'); cnt.className='content';
    cnt.innerHTML=`<h3>${f.name}</h3><p>${f.desc}</p><p><strong>${f.price} грн</strong></p>`;
    if(isAdmin){
      const ab=document.createElement('div'); ab.className='admin-btns';
      const eB=document.createElement('button'); eB.textContent='✏️'; eB.onclick=()=>startEdit(f);
      const dB=document.createElement('button'); dB.textContent='🗑️'; dB.onclick=()=>remove(f.id);
      ab.append(eB,dB); cnt.append(ab);
    }
    card.append(img,ctr,cnt); list.append(card);
  });
}

adminBtn.onclick = ()=>{
  const p=prompt('Пароль:');
  if(p==='admin123'){
    isAdmin=true; document.querySelectorAll('.admin-only').forEach(show); load();
  } else alert('Невірний пароль');
};

addBtn.onclick = ()=>{
  editId=null; form.reset(); files=[]; show(modal);
  document.getElementById('modal-title').innerText='Нова півонія';
};
cancelBtn.onclick = ()=>hide(modal);

imgInput.onchange = e=> files=Array.from(e.target.files);

form.onsubmit = async e=>{
  e.preventDefault();
  const fd=new FormData(form);
  files.forEach(f=>fd.append('images',f));
  if(editId) await fetch(`${API}/${editId}`,{method:'PUT',body:fd});
  else await fetch(API,{method:'POST',body:fd});
  hide(modal); load();
};

function startEdit(f){
  editId=f.id;
  form['flower-name'].value=f.name;
  form['flower-desc'].value=f.desc;
  form['flower-price'].value=f.price;
  files=[];
  show(modal);
  document.getElementById('modal-title').innerText='Редагування півонії';
}

async function remove(id){
  if(confirm('Видалити?')) {
    await fetch(`${API}/${id}`,{method:'DELETE'});
    load();
  }
}

function openViewer(fi,ii=0){
  vf=fi; vi=ii; updateViewer(); show(viewer);
}
function updateViewer(){
  vImg.src=flowers[vf].images[vi];
  vImg.classList.remove('zoomed');
}
prevBtn.onclick=()=>{ vi=(vi-1+flowers[vf].images.length)%flowers[vf].images.length; updateViewer(); };
nextBtn.onclick=()=>{ vi=(vi+1)%flowers[vf].images.length; updateViewer(); };
vImg.ondblclick=()=>vImg.classList.toggle('zoomed');
viewer.onclick=e=>{ if(e.target===viewer) hide(viewer); };

load();
