// script.js — front-end only demo for "MEOW OR NEVER" clone

document.addEventListener('DOMContentLoaded', () => {
  // --- config / placeholders ---
  const CONTRACT = "0xYOUR_CONTRACT_ADDRESS_HERE"; // <- replace with real contract
  const DEX_URL = "https://dexscreener.com/";     // <- replace with real token link
  const X_URL = "https://x.com/";                 // <- replace with real social link

  // sample images (placeholders). Replace with your actual images or IPFS URLs
  const sampleImages = [
    "https://picsum.photos/seed/meow1/600/400",
    "https://picsum.photos/seed/meow2/600/400",
    "https://picsum.photos/seed/meow3/600/400",
    "https://picsum.photos/seed/meow4/600/400",
    "https://picsum.photos/seed/meow5/600/400",
    "https://picsum.photos/seed/meow6/600/400",
    "https://picsum.photos/seed/meow7/600/400",
    "https://picsum.photos/seed/meow8/600/400",
    "https://picsum.photos/seed/meow9/600/400"
  ];

  // DOM refs
  const galleryGrid = document.getElementById('galleryGrid');
  const memeGrid = document.getElementById('memeGrid');
  const contractDisplay = document.getElementById('contractDisplay');
  const copyBtn = document.getElementById('copyBtn');
  const buyBtn = document.getElementById('buyBtn');
  const dexLink = document.getElementById('dexLink');
  const xLink = document.getElementById('xLink');
  const buyModal = document.getElementById('buyModal');
  const modalClose = document.getElementById('modalClose');
  const cancelBuy = document.getElementById('cancelBuy');
  const execBuy = document.getElementById('execBuy');
  const buyAmount = document.getElementById('buyAmount');
  const estMeow = document.getElementById('estMeow');
  const year = document.getElementById('year');

  // populate year
  year.textContent = new Date().getFullYear();

  // set links and contract display
  contractDisplay.textContent = CONTRACT;
  copyBtn.dataset.ca = CONTRACT;
  dexLink.href = DEX_URL;
  xLink.href = X_URL;

  // build thumbnails in console (3x3)
  for (let i=0;i<9;i++){
    const t = document.createElement('div');
    t.className = 'thumb';
    t.innerHTML = `<img src="${sampleImages[i%sampleImages.length]}" alt="Meow #${i+1}" loading="lazy">`;
    t.addEventListener('click', () => selectMeme(i));
    memeGrid.appendChild(t);
  }

  // build gallery
  sampleImages.forEach((src, idx) => {
    const t = document.createElement('div');
    t.className = 'thumb';
    const img = document.createElement('img');
    img.src = src;
    img.alt = `MEOW #${idx+1}`;
    t.appendChild(img);
    t.addEventListener('click', () => openLightbox(src, idx));
    galleryGrid.appendChild(t);
  });

  // meme select animation / indicator
  function selectMeme(i){
    const all = memeGrid.querySelectorAll('.thumb');
    all.forEach((el, idx) => {
      el.style.outline = idx === i ? `2px solid rgba(255,122,172,0.45)` : 'none';
      el.style.transform = idx === i ? 'translateY(-6px) scale(1.02)' : '';
    });
  }

  // lightbox (simple)
  function openLightbox(src, idx){
    const L = document.createElement('div');
    L.style.position='fixed'; L.style.inset=0; L.style.display='flex';
    L.style.alignItems='center'; L.style.justifyContent='center'; L.style.background='rgba(0,0,0,0.85)'; L.style.zIndex=9999;
    L.innerHTML = `<div style="max-width:90%;max-height:90%;border-radius:12px;overflow:hidden"><img src="${src}" style="display:block;max-width:100%;height:auto"></div>`;
    L.addEventListener('click', ()=>document.body.removeChild(L));
    document.body.appendChild(L);
  }

  // copy contract
  copyBtn.addEventListener('click', async () => {
    const text = copyBtn.dataset.ca || CONTRACT;
    try {
      await navigator.clipboard.writeText(text);
      flash(copyBtn, 'Copied!');
    } catch (e) {
      // fallback
      prompt('Copy contract address:', text);
    }
  });

  function flash(el, txt){
    const orig = el.textContent;
    el.textContent = txt;
    setTimeout(()=>el.textContent = orig, 1400);
  }

  // buy modal handlers
  buyBtn.addEventListener('click', () => {
    buyModal.classList.remove('hidden');
    buyModal.setAttribute('aria-hidden','false');
    buyAmount.value = '';
    estMeow.textContent = '—';
  });
  modalClose.addEventListener('click', closeModal);
  cancelBuy.addEventListener('click', closeModal);
  function closeModal(){
    buyModal.classList.add('hidden');
    buyModal.setAttribute('aria-hidden','true');
  }

  // estimate display (naive)
  buyAmount.addEventListener('input', () => {
    const v = parseFloat(buyAmount.value) || 0;
    // fake price: 1 ETH = 10,000,000 MEOW (just for demo)
    const est = Math.round(v * 10000000);
    estMeow.textContent = est.toLocaleString() + ' $MEOW';
  });

  execBuy.addEventListener('click', () => {
    const amt = parseFloat(buyAmount.value);
    if (!amt || amt <= 0) {
      alert('Enter a positive ETH amount to simulate a buy.');
      return;
    }
    // simulate success
    alert(`Simulated swap: ${amt} ETH → ~${estMeow.textContent}. This is only a UI demo.`);
    closeModal();
  });

  // small UX: keyboard escape to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !buyModal.classList.contains('hidden')) closeModal();
  });

  // helper: graceful fallback if clipboard API missing
  if (!navigator.clipboard) {
    copyBtn.title = 'Clipboard API not available — will open a prompt';
  }
});
