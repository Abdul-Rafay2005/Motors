// Stylish site JS - manages inventory, filters, modal
const carsData = [
  { id:'c1', make:'AUDI', model:'Q2', year:2018, price:8500, mileage:'58,000 km', transmission:'Automatic', engine:'1.5L', color:'RED', location:'JAPAN', images:['assets/images/AUDI Q2.jpg','assets/images/AUDI Q2 1.jpg','assets/images/AUDI Q2 2.jpg'], desc:'Well-maintained Audi. Economical and reliable.'},
  { id:'c2', make:'Mazda', model:'CX-3', year:2019, price:11200, mileage:'42,000 km', transmission:'CVT', engine:'1.2L hybrid', color:'White', location:'Osaka', images:['assets/images/Mazda CX-3.jpg','assets/images/Mazda CX-3 2.jpg','assets/images/Mazda CX-3 3.jpg','assets/images/Mazda CX-3 1.jpg'], desc:'Comfortable hatchback with economical hybrid powertrain.'},
  { id:'c3', make:'Mitsubishi  ', model:'Outlander', year:2017, price:7200, mileage:'69,000 km', transmission:'Automatic', engine:'1.3L', color:'Blue', location:'Yokohama', images:['assets/images/Mitsubishi Outlander.jpg','assets/images/Mitsubishi Outlander 1.jpg','assets/images/Mitsubishi Outlander 2.jpg'], desc:'Compact and practical. Great city car.'}
];

// Detect pages
const grid = document.getElementById('grid');          // stock.html
const featuredGrid = document.getElementById('featuredGrid'); // index.html

// Filters (stock page only)
const searchInput = document.getElementById('search');
const makeFilter = document.getElementById('makeFilter');
const yearFilter = document.getElementById('yearFilter');
const sortSelect = document.getElementById('sort');

// Modal elements
const modalBackdrop = document.getElementById('modalBackdrop');
const closeModalBtn = document.getElementById('closeModal');
const carouselImg = document.getElementById('carouselImg');
const thumbs = document.getElementById('thumbs');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const modalPrice = document.getElementById('modalPrice');
const modalSpecs = document.getElementById('modalSpecs');
const modalDesc = document.getElementById('modalDesc');
const contactBtn = document.getElementById('contactBtn');

function formatPrice(n){ return 'USD ' + n.toLocaleString(); }

function buildFilters(){
  if(!makeFilter || !yearFilter) return;
  const makes = Array.from(new Set(carsData.map(c=>c.make))).sort();
  makeFilter.innerHTML = '<option value="">All makes</option>' + makes.map(m=>`<option value="${m}">${m}</option>`).join('');
  const years = Array.from(new Set(carsData.map(c=>c.year))).sort((a,b)=>b-a);
  yearFilter.innerHTML = '<option value="">All years</option>' + years.map(y=>`<option value="${y}">${y}</option>`).join('');
}

function buildCard(car){
  const el = document.createElement('article');
  el.className='card';
  el.innerHTML = `
    <img src="${car.images[0]}" alt="${car.make} ${car.model}" loading="lazy"/>
    <div class="meta">
      <div>
        <div class="title">${car.make} ${car.model}</div>
        <div class="muted">${car.year} • ${car.location}</div>
      </div>
      <div class="price">${formatPrice(car.price)}</div>
    </div>
    <div class="chips">
      <div class="chip">${car.mileage}</div>
      <div class="chip">${car.transmission}</div>
      <div class="chip">${car.engine}</div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;align-items:center">
      <button class="btn btn-primary viewBtn" data-id="${car.id}">View</button>
      <div class="muted">Color: ${car.color}</div>
    </div>
  `;
  return el;
}

function render(list){
  if(!grid) return;
  grid.innerHTML='';
  if(!list.length){ 
    grid.innerHTML='<div style="grid-column:1/-1;text-align:center;color:var(--muted)">No cars found</div>'; 
    return; 
  }
  list.forEach(c=>grid.appendChild(buildCard(c)));
  document.querySelectorAll('.viewBtn').forEach(b=>b.addEventListener('click', ()=> openModalById(b.dataset.id)));
}

function applyFilters(){
  if(!grid) return;
  const q = searchInput.value.trim().toLowerCase();
  const make = makeFilter.value;
  const year = yearFilter.value;
  let list = carsData.filter(c=>{
    if(make && c.make !== make) return false;
    if(year && String(c.year)!==String(year)) return false;
    if(q && !(`${c.make} ${c.model} ${c.desc} ${c.location}`.toLowerCase().includes(q))) return false;
    return true;
  });
  const sort = sortSelect.value;
  if(sort==='priceAsc') list.sort((a,b)=>a.price-b.price);
  else if(sort==='priceDesc') list.sort((a,b)=>b.price-a.price);
  else list.sort((a,b)=>b.year-b.year);
  render(list);
}

function openModalById(id){
  const car = carsData.find(c=>c.id===id); if(!car) return;
  modalTitle.textContent = `${car.make} ${car.model}`;
  modalSub.textContent = `${car.year} • ${car.location} • ${car.mileage}`;
  modalPrice.textContent = formatPrice(car.price);
  modalSpecs.innerHTML = '';
  ['engine','transmission','color','mileage'].forEach(k=>{ 
    if(car[k]){ 
      const d=document.createElement('div'); 
      d.className='chip'; 
      d.textContent = `${k.charAt(0).toUpperCase()+k.slice(1)}: ${car[k]}`; 
      modalSpecs.appendChild(d);
    } 
  });
  modalDesc.textContent = car.desc || '';
  // carousel
  let cur = 0; carouselImg.src = car.images[cur] || '';
  thumbs.innerHTML=''; 
  car.images.forEach((src, idx)=>{ 
    const t = document.createElement('img'); 
    t.src=src; 
    t.dataset.idx=idx; 
    t.addEventListener('click', ()=>{ 
      carouselImg.src = src; 
      document.querySelectorAll('.thumbs img').forEach(i=>i.classList.remove('active')); 
      t.classList.add('active'); 
    }); 
    if(idx===0) t.classList.add('active'); 
    thumbs.appendChild(t); 
  });
  modalBackdrop.style.display='flex';
}

if(closeModalBtn){
  closeModalBtn.addEventListener('click', ()=> modalBackdrop.style.display='none');
}
if(modalBackdrop){
  modalBackdrop.addEventListener('click',(e)=>{ if(e.target===modalBackdrop) modalBackdrop.style.display='none'; });
}

// -------- PAGE INITIALIZATION --------

// Stock page
if(grid){
  buildFilters(); 
  applyFilters();
  searchInput.addEventListener('input', applyFilters);
  makeFilter.addEventListener('change', applyFilters);
  yearFilter.addEventListener('change', applyFilters);
  sortSelect.addEventListener('change', applyFilters);
}

// Homepage (Featured section)
if(featuredGrid){
  featuredGrid.innerHTML='';
  const featuredCars = carsData.slice(0, 3); // show first 3 cars
  featuredCars.forEach(c=> featuredGrid.appendChild(buildCard(c)));
  document.querySelectorAll('.viewBtn').forEach(b=>b.addEventListener('click', ()=> openModalById(b.dataset.id)));
}
