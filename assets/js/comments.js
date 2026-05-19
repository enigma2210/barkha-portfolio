function renderArticleComments(articleId) {
  const approved = getComments().filter(c => c.articleId === articleId && c.status === 'approved');
  const el = document.getElementById('art-comments');
  if (!el) return;
  el.innerHTML = approved.length
    ? approved.map(c => `
        <div class="comment-item">
          <div class="c-avatar">${c.name.charAt(0).toUpperCase()}</div>
          <div>
            <div><span class="c-name">${c.name}</span><span class="c-date">${c.date}</span></div>
            <p class="c-text">${c.text}</p>
          </div>
        </div>`).join('')
    : '<p class="no-comments">No comments yet. Be the first to share your perspective!</p>';
}

function submitComment() {
  const name = (document.getElementById('cm-name').value || '').trim();
  const email = (document.getElementById('cm-email').value || '').trim();
  const text = (document.getElementById('cm-text').value || '').trim();
  if (!name || !text) { showToast('Please fill in your name and comment.', 'warn'); return; }
  const comments = getComments();
  comments.push({
    id: 'c' + Date.now(),
    articleId: currentArtId,
    name, email, text,
    date: new Date().toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric' }),
    status: 'pending'
  });
  saveComments(comments);
  document.getElementById('cm-name').value = '';
  document.getElementById('cm-email').value = '';
  document.getElementById('cm-text').value = '';
  showToast('Your insight has been sent for professional moderation.', 'ok');
}
