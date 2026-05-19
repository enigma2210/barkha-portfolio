'use strict';

document.addEventListener('click', event => {
  const action = event.target.closest('[data-page],[data-scroll],[data-article],[data-go-back],[data-gallery-filter],[data-gallery-folder],[data-gallery-path],[data-gallery-home],[data-gallery-index],[data-lightbox-close],[data-lightbox-nav],[data-submit-comment],[data-send-contact],[data-admin-login],[data-admin-logout],[data-admin-action]');
  if (!action) return;

  if (action.dataset.page) {
    event.preventDefault();
    go(action.dataset.page);
  } else if (action.dataset.scroll) {
    event.preventDefault();
    scrollTo_(action.dataset.scroll);
  } else if (action.dataset.article) {
    event.preventDefault();
    openArt(action.dataset.article);
  } else if (action.hasAttribute('data-go-back')) {
    event.preventDefault();
    goBack();
  } else if (action.dataset.galleryFilter) {
    event.preventDefault();
    filterGal(action.dataset.galleryFilter, action);
  } else if (action.dataset.galleryFolder) {
    event.preventDefault();
    renderGallery(action.dataset.galleryFolder);
  } else if (action.dataset.galleryPath) {
    event.preventDefault();
    openGalleryPath(decodeGalleryPath(action.dataset.galleryPath));
  } else if (action.hasAttribute('data-gallery-home')) {
    event.preventDefault();
    renderGalleryFolders();
  } else if (action.hasAttribute('data-gallery-index')) {
    event.preventDefault();
    openLb(Number(action.dataset.galleryIndex));
  } else if (action.hasAttribute('data-lightbox-close')) {
    event.preventDefault();
    closeLb();
  } else if (action.dataset.lightboxNav) {
    event.preventDefault();
    navLb(Number(action.dataset.lightboxNav));
  } else if (action.hasAttribute('data-submit-comment')) {
    event.preventDefault();
    submitComment();
  } else if (action.hasAttribute('data-send-contact')) {
    event.preventDefault();
    sendContact();
  } else if (action.hasAttribute('data-admin-login')) {
    event.preventDefault();
    adminLogin();
  } else if (action.hasAttribute('data-admin-logout')) {
    event.preventDefault();
    adminLogout();
  } else if (action.dataset.adminAction) {
    event.preventDefault();
    adminAct(Number(action.dataset.adminIndex), action.dataset.adminAction);
  }
});

document.addEventListener('keydown', event => {
  if (event.key !== 'Enter') return;
  if (event.target.matches('[data-admin-enter]')) adminLogin();
  if (event.target.closest('[data-page][role="button"]')) go(event.target.closest('[data-page]').dataset.page);
});

go('home');
window.addEventListener('load', initFade);
