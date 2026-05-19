/* --- ADMIN --- */
function adminLogin() {
  if (document.getElementById('admin-pw').value === 'admin123') {
    document.getElementById('admin-login-box').style.display = 'none';
    document.getElementById('admin-panel-inner').style.display = 'block';
    renderAdminPanel();
  } else {
    showToast('Incorrect password.', 'warn');
  }
}
function adminLogout() {
  document.getElementById('admin-login-box').style.display = 'block';
  document.getElementById('admin-panel-inner').style.display = 'none';
  document.getElementById('admin-pw').value = '';
}

function renderAdminPanel() {
  const all = getComments();
  const pending = all.filter(c => c.status === 'pending').length;
  const approved = all.filter(c => c.status === 'approved').length;
  const rejected = all.filter(c => c.status === 'rejected').length;

  document.getElementById('admin-stats').innerHTML = `
    <div class="admin-stat"><div class="admin-stat-n">${all.length}</div><span>Total Comments</span></div>
    <div class="admin-stat"><div class="admin-stat-n admin-stat-pending">${pending}</div><span>Pending Review</span></div>
    <div class="admin-stat"><div class="admin-stat-n admin-stat-approved">${approved}</div><span>Approved</span></div>
    <div class="admin-stat"><div class="admin-stat-n admin-stat-rejected">${rejected}</div><span>Rejected</span></div>`;

  if (!all.length) {
    document.getElementById('admin-table').innerHTML = '<div class="empty-state">No comments have been submitted yet.</div>';
    return;
  }

  const artTitle = id => ARTS[id] ? ARTS[id].title.substring(0, 34) + '—' : id;

  document.getElementById('admin-table').innerHTML = `
    <div class="admin-table-wrap">
      <table class="admin-table">
        <thead>
          <tr>
            <th>Commenter</th><th>Article</th><th>Comment</th><th>Date</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${all.map((c, i) => `
            <tr>
              <td><strong>${c.name}</strong>${c.email ? `<br><span class="admin-email">${c.email}</span>` : ''}</td>
              <td class="admin-article-cell">${artTitle(c.articleId)}</td>
              <td class="admin-comment-cell">${c.text.length > 90 ? c.text.substring(0,90) + '—' : c.text}</td>
              <td class="admin-date-cell">${c.date}</td>
              <td><span class="sbadge ${c.status === 'approved' ? 's-approved' : c.status === 'rejected' ? 's-rejected' : 's-pending'}">${c.status}</span></td>
              <td class="admin-action-cell">
                ${c.status !== 'approved' ? `<button class="act-btn act-approve" data-admin-index="${i}" data-admin-action="approved">Approve</button>` : ''}
                ${c.status !== 'rejected' ? `<button class="act-btn act-reject" data-admin-index="${i}" data-admin-action="rejected">Reject</button>` : ''}
                <button class="act-btn act-delete" data-admin-index="${i}" data-admin-action="delete">Delete</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

function adminAct(idx, action) {
  const c = getComments();
  if (action === 'delete') c.splice(idx, 1);
  else c[idx].status = action;
  saveComments(c);
  renderAdminPanel();
  showToast(action === 'delete' ? 'Comment deleted.' : `Comment ${action}.`, 'ok');
}
