/* --- CONTACT --- */
function sendContact() {
  const name = (document.getElementById('c-name').value || '').trim();
  const msg = (document.getElementById('c-msg').value || '').trim();
  if (!name || !msg) { showToast('Please fill in your name and message.', 'warn'); return; }
  ['c-name','c-email','c-subject','c-msg'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  showToast('Message received! Connect via LinkedIn for a faster response.', 'ok');
}
