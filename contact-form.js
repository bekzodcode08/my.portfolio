// contact-form.js — HTML forminizga ulang: <script src="contact-form.js"></script>

const API_URL = 'http://localhost:3000/api/contact';

document.getElementById('formBtn').addEventListener('click', async () => {
  const btn = document.getElementById('formBtn');
  const msgEl = document.getElementById('formMsg');

  const name    = document.getElementById('fname').value.trim();
  const email   = document.getElementById('femail').value.trim();
  const subject = document.getElementById('fsubject').value.trim();
  const message = document.getElementById('fmsg').value.trim();

  // Reset
  msgEl.style.display = 'none';
  msgEl.style.color = '';

  // Client-side tekshiruv
  if (!name || !email || !subject || !message) {
    showMsg('Barcha maydonlarni to\'ldiring.', 'error');
    return;
  }

  // Yuborish
  btn.disabled = true;
  btn.textContent = 'Yuborilmoqda...';

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await res.json();

    if (data.success) {
      showMsg('Rahmat! Xabaringiz qabul qilindi.', 'success');
      // Formni tozalash
      ['fname', 'femail', 'fsubject', 'fmsg'].forEach(id => {
        document.getElementById(id).value = '';
      });
    } else {
      const errText = data.errors ? data.errors.join(' ') : 'Xatolik yuz berdi.';
      showMsg(errText, 'error');
    }
  } catch {
    showMsg('Server bilan bog\'lanib bo\'lmadi. Keyinroq urinib ko\'ring.', 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `Yuborish <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
});

function showMsg(text, type) {
  const el = document.getElementById('formMsg');
  el.textContent = text;
  el.style.color = type === 'error' ? '#e74c3c' : '#27ae60';
  el.style.display = 'block';
}
