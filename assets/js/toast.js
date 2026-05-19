/* --- TOAST --- */
let toastTimer;
function showToast(msg, type) {
  const t = document.getElementById('toast');
  const txt = document.getElementById('toast-text');
  const icon = t.querySelector('.toast-icon');
  txt.textContent = msg;
  t.className = 'toast';
  if (type === 'warn') { t.classList.add('toast-warn'); icon.textContent = '⚠'; }
  else if (type === 'ok') { t.classList.add('toast-ok'); icon.textContent = '✓'; }
  else { icon.textContent = '✓'; }
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 4200);
}
