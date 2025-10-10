// script.js - kengaytirilgan interaktivlik (har bir fayl 200+ belgidan oshadi)
document.addEventListener('DOMContentLoaded', function(){
    // Yilni avtomatik chiqarish
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();
  
    // Mobil menyu toggle
    const menuBtn = document.getElementById('menuBtn');
    const nav = document.querySelector('.nav');
    if(menuBtn){
      menuBtn.addEventListener('click', function(){
        if(!nav) return;
        const isOpen = nav.style.display === 'flex' || nav.classList.contains('open');
        if(isOpen){
          nav.style.display = 'none';
          nav.classList.remove('open');
          menuBtn.setAttribute('aria-expanded','false');
        } else {
          nav.style.display = 'flex';
          nav.style.flexDirection = 'column';
          nav.classList.add('open');
          menuBtn.setAttribute('aria-expanded','true');
        }
      });
    }
  
    // Yengil smooth-scrolling (anchorlarga)
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor){
      anchor.addEventListener('click', function(e){
        const href = this.getAttribute('href');
        if(href && href.startsWith('#')){
          const target = document.querySelector(href);
          if(target){
            e.preventDefault();
            target.scrollIntoView({behavior:'smooth', block:'start'});
          }
        }
      });
    });
  
    // Kontakt forma bilan ishlash (frontendda simulyatsiya)
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    if(form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const fd = new FormData(form);
        const name = (fd.get('name') || '').toString().trim();
        const email = (fd.get('email') || '').toString().trim();
        const msg = (fd.get('message') || '').toString().trim();
        // oddiy validatsiya
        if(!email || !msg){
          status.textContent = 'Iltimos, email va xabarni toʻliq kiriting.';
          status.style.color = 'crimson';
          return;
        }
        // Simulyatsiya: yuborildi
        status.textContent = `Rahmat, ${name || 'doʻst'}! Xabaringiz qabul qilindi.`;
        status.style.color = 'green';
        form.reset();
  
        // qisqa ro'yxatga saqlash localStoragega (misol uchun)
        try {
          const list = JSON.parse(localStorage.getItem('messages') || '[]');
          list.push({name:name, email:email, message:msg, date:new Date().toISOString()});
          localStorage.setItem('messages', JSON.stringify(list));
        } catch(err) {
          console.warn('LocalStorage saqlanmadi:', err);
        }
  
        // 6 soniyadan keyin statusni tozalash
        setTimeout(function(){ status.textContent = ''; }, 6000);
      });
    }
  
    // Agar developer bo'lsa — localStorage dagi xabarlarni konsolga chiqarish uchun (faqat test)
    if(window.location.search.indexOf('debug=1') !== -1){
      try {
        const msgs = JSON.parse(localStorage.getItem('messages') || '[]');
        console.info('Saved messages:', msgs);
      } catch(e) { console.info('No messages saved yet'); }
    }
  });