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





// ----faq accoordion

(() => {
  const root = document.getElementById("faqAccordion");
  if (!root) return;

  const items = Array.from(root.querySelectorAll("details.acc-item"));
  const DURATION = 280; // keep close to your CSS

  let isBusy = false;

  function getPanel(details) {
    return details.querySelector(".acc-panel");
  }

  function waitTransition(panel) {
    return new Promise((resolve) => {
      let done = false;

      const finish = () => {
        if (done) return;
        done = true;
        panel.removeEventListener("transitionend", onEnd);
        resolve();
      };

      const onEnd = (e) => {
        if (e.propertyName === "height") finish();
      };

      panel.addEventListener("transitionend", onEnd);

      // fallback in case transitionend doesn't fire
      setTimeout(finish, DURATION + 60);
    });
  }

  async function open(details) {
    const panel = getPanel(details);
    if (!panel) return;

    details.open = true;

    // start closed
    panel.style.height = "0px";
    panel.getBoundingClientRect(); // force reflow

    // measure target height
    const target = panel.scrollHeight;

    // animate open
    panel.style.height = target + "px";
    await waitTransition(panel);

    // allow natural height after animation
    panel.style.height = "auto";
  }

  async function close(details) {
    const panel = getPanel(details);
    if (!panel) return;

    // if it's auto, lock to px first
    const start = panel.scrollHeight;
    panel.style.height = start + "px";
    panel.getBoundingClientRect(); // force reflow

    // animate close
    panel.style.height = "0px";
    await waitTransition(panel);

    details.open = false;
  }

  // init panels so closed ones are truly height 0
  items.forEach((d) => {
    const panel = getPanel(d);
    if (!panel) return;
    panel.style.height = d.open ? "auto" : "0px";
  });

  items.forEach((details) => {
    const summary = details.querySelector("summary");
    if (!summary) return;

    summary.addEventListener("click", async (e) => {
      e.preventDefault();
      if (isBusy) return;

      isBusy = true;

      const currentlyOpen = items.find((d) => d.open);
      const clickedIsOpen = details.open;

      // If clicking the open one, just close it
      if (clickedIsOpen) {
        await close(details);
        isBusy = false;
        return;
      }

      // Close currently open first, smoothly
      if (currentlyOpen && currentlyOpen !== details) {
        await close(currentlyOpen);
      }

      // Then open the clicked one
      await open(details);

      isBusy = false;
    });
  });

  // keep open panel height correct on resize (only if not auto)
  window.addEventListener("resize", () => {
    const openDetails = items.find((d) => d.open);
    if (!openDetails) return;
    const panel = getPanel(openDetails);
    if (!panel) return;
    if (panel.style.height === "auto") return;
    panel.style.height = panel.scrollHeight + "px";
  });
})();




 // ------------- Slider
(() => {
  const slider = document.getElementById("caseSlider");
  if (slider) {
    const track = slider.querySelector(".case-track");
    const prev = slider.querySelector(".slider-btn.prev");
    const next = slider.querySelector(".slider-btn.next");

    function scrollByCard(dir) {
      const card = track.querySelector(".case-card");
      if (!card) return;
      const style = getComputedStyle(track);
      const gap = parseFloat(style.columnGap || style.gap || "28") || 28;
      const step = card.getBoundingClientRect().width + gap;
      track.scrollBy({ left: dir * step, behavior: "smooth" });
    }

    prev?.addEventListener("click", () => scrollByCard(-1));
    next?.addEventListener("click", () => scrollByCard(1));
  }

  // Modal (TEXT ONLY)
  const modal = document.getElementById("caseModal");
  const titleEl = document.getElementById("caseModalTitle");
  const bodyEl = document.getElementById("caseModalBody");
  
function escapeHtml(str){
  return str
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;");
}

function formatCaseBody(raw){
  // convert literal "\n" into real newlines
  raw = (raw || "").replace(/\\n/g, "\n");

  let safe = escapeHtml(raw);

  const blocks = safe.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);

  return blocks.map(b => {
    if (/^\d+\.\s+[A-Z0-9 ,+&-]{3,}$/.test(b)) return `<h4 class="case-h">${b}</h4>`;
    if (/^[A-Z][A-Z0-9 ,+&-]{5,}$/.test(b)) return `<h4 class="case-h">${b}</h4>`;

    b = b.replace(/\n/g, "<br>");
    return `<p class="case-p">${b}</p>`;
  }).join("");
}


  function openModal(title, body) {
    if (!modal) return;
    titleEl.textContent = title || "";
   bodyEl.innerHTML = formatCaseBody(body || "");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Only open modal when clicking the button
  document.addEventListener("click", (e) => {
    const expandBtn = e.target.closest(".case-expand");
    if (expandBtn) {
      const card = expandBtn.closest(".case-card");
      if (!card) return;
      openModal(card.getAttribute("data-title"), card.getAttribute("data-body"));
      return;
    }

    if (e.target.matches("[data-close='true']")) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();



// hero section video

(() => {
  const trigger = document.getElementById("videoTrigger");
  const surface = document.getElementById("videoSurface");

  if (!trigger || !surface) return;

  let mounted = false;

  function mountAndPlay(){
    if (mounted) return;

    mounted = true;
 surface.style.backgroundImage = "none";
    // remove play overlay + UI
    surface.innerHTML = `
      <video controls autoplay playsinline preload="metadata">
        <source src="./assets/Sunset.mp4" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;

    const vid = surface.querySelector("video");
    // Force play (some browsers block autoplay without user gesture, but click counts)
    vid.play().catch(() => {});
  }

  trigger.addEventListener("click", mountAndPlay);

  // keyboard accessibility (Enter/Space)
  trigger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      mountAndPlay();
    }
  });
})();


 
