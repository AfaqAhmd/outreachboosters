(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const toggle = $('#navToggle');
  const nav = $('#navLinks');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    $$('.nav-link', nav).forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll for in page links
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Video modal
  // const modal = $('#videoModal');
  // const trigger = $('#videoTrigger');
  // const closeBtn = $('#modalClose');

  // const openModal = () => {
  //   if (!modal) return;
  //   modal.classList.add('show');
  //   modal.setAttribute('aria-hidden', 'false');
  //   document.body.style.overflow = 'hidden';
  // };

  // const closeModal = () => {
  //   if (!modal) return;
  //   modal.classList.remove('show');
  //   modal.setAttribute('aria-hidden', 'true');
  //   document.body.style.overflow = '';
  // };

  // if (trigger) {
  //   trigger.addEventListener('click', openModal);
  //   trigger.addEventListener('keydown', (e) => {
  //     if (e.key === 'Enter' || e.key === ' ') openModal();
  //   });
  // }
  // if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // if (modal) {
  //   modal.addEventListener('click', (e) => {
  //     const close = e.target?.dataset?.close === 'true';
  //     if (close) closeModal();
  //   });
  // }
  // document.addEventListener('keydown', (e) => {
  //   if (e.key === 'Escape') closeModal();
  // });

  // FAQ, only one open at a time, keeps it tidy
  // const faq = $('#faqAccordion');
  // if (faq) {
  //   const items = $$('details', faq);
  //   items.forEach(d => {
  //     d.addEventListener('toggle', () => {
  //       if (!d.open) return;
  //       items.forEach(other => {
  //         if (other !== d) other.open = false;
  //       });
  //     });
  //   });
  // }


  
  // Newsletter form, fake submit for demo
  const form = $('#newsletterForm');
  const note = $('#formNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#email')?.value?.trim();
      if (!email) return;
      note.textContent = 'Thanks, you are subscribed 🌸';
      form.reset();
      setTimeout(() => { note.textContent = ''; }, 3500);
    });
  }
})();