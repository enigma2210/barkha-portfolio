/* --- COMMENT STORE --- */
const STORE_KEY = 'bm_v2_comments';
function getComments() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || '[]'); }
  catch(e) { return []; }
}
function saveComments(c) {
  localStorage.setItem(STORE_KEY, JSON.stringify(c));
}
// Seed approved comment for NIST article
if (!localStorage.getItem(STORE_KEY)) {
  saveComments([{
    id:'seed-001', articleId:'nist',
    name:'Rishabh Singh', email:'',
    text:'This article is a great starting point for someone who is interested in DNSSEC!',
    date:'April 19, 2026', status:'approved'
  }]);
}
