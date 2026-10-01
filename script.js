/**
 * KREATIVA STUDIO - SCRIPT.JS
 * Fitur: Mobile Navigation, Scrollspy, Portfolio Filter, Lightbox Modal,
 *        Pre-fill Paket Harga, dan Validasi Formulir Kontak Interaktif.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ----------------------------------------------------
  // 1. MOBILE NAVIGATION TOGGLE
  // ----------------------------------------------------
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-cta a');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Close menu when a navigation link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('open')) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----------------------------------------------------
  // 2. STICKY HEADER & ACTIVE NAVIGATION LINK ON SCROLL
  // ----------------------------------------------------
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;

    // Header shadow on scroll
    if (scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 130;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-list a[href="#${sectionId}"]`);

      if (targetNavLink) {
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // ----------------------------------------------------
  // 3. PORTOFOLIO FILTER TAB
  // ----------------------------------------------------
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.classList.remove('filtered-out');
        } else {
          item.classList.add('filtered-out');
        }
      });
    });
  });

  // ----------------------------------------------------
  // 4. MODAL PREVIEW PORTOFOLIO (LIGHTBOX)
  // ----------------------------------------------------
  const modal = document.getElementById('portfolio-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalCat = document.getElementById('modal-cat');
  const previewButtons = document.querySelectorAll('.btn-preview');

  const openModal = (imgSrc, title, category) => {
    modalImg.src = imgSrc;
    modalImg.alt = title;
    modalTitle.textContent = title;
    modalCat.textContent = category;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  previewButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title');
      const category = btn.getAttribute('data-cat');
      openModal(imgSrc, title, category);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // ----------------------------------------------------
  // 5. TOMBOL PAKET HARGA (AUTO-SELECT SERVICE DI FORM)
  // ----------------------------------------------------
  const selectPlanButtons = document.querySelectorAll('.select-plan-btn');
  const serviceDropdown = document.getElementById('service');
  const messageInput = document.getElementById('message');
  const nameInput = document.getElementById('name');

  selectPlanButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      if (serviceDropdown) {
        for (let i = 0; i < serviceDropdown.options.length; i++) {
          if (serviceDropdown.options[i].value === planName || serviceDropdown.options[i].text.includes(planName)) {
            serviceDropdown.selectedIndex = i;
            // Clear previous error if any
            clearError(serviceDropdown);
            break;
          }
        }
        
        if (messageInput) {
          messageInput.placeholder = `Halo, saya ingin memesan ${planName}. Bisnis saya bergerak di bidang...`;
        }

        if (nameInput) {
          setTimeout(() => nameInput.focus(), 350);
        }
      }
    });
  });

  // ----------------------------------------------------
  // 6. FORM KONTAK DENGAN VALIDASI & RESPON CEPAT
  // ----------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackDesc = document.getElementById('feedback-desc');
  const btnSubmit = document.getElementById('btn-submit');

  if (contactForm) {
    // Clear validation error on input
    const inputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        clearError(input);
      });
      input.addEventListener('change', () => {
        clearError(input);
      });
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      let firstInvalidElement = null;

      // Field References
      const nameField = document.getElementById('name');
      const waField = document.getElementById('whatsapp');
      const emailField = document.getElementById('email');
      const serviceField = document.getElementById('service');
      const messageField = document.getElementById('message');

      // 1. Name Validation
      if (!nameField.value.trim()) {
        setError(nameField, 'Harap masukkan nama lengkap atau nama bisnis Anda');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = nameField;
      } else {
        clearError(nameField);
      }

      // 2. WhatsApp Validation (Minimal 9 digit angka)
      const waValue = waField.value.replace(/\D/g, '');
      if (!waValue || waValue.length < 9) {
        setError(waField, 'Harap masukkan nomor WhatsApp yang aktif (min. 9 digit)');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = waField;
      } else {
        clearError(waField);
      }

      // 3. Email Validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailField.value.trim() || !emailPattern.test(emailField.value.trim())) {
        setError(emailField, 'Harap masukkan alamat email yang valid');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = emailField;
      } else {
        clearError(emailField);
      }

      // 4. Service Selection
      if (!serviceField.value) {
        setError(serviceField, 'Harap pilih salah satu layanan');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = serviceField;
      } else {
        clearError(serviceField);
      }

      // 5. Message Validation
      if (!messageField.value.trim()) {
        setError(messageField, 'Harap jelaskan singkat kebutuhan desain produk Anda');
        isValid = false;
        if (!firstInvalidElement) firstInvalidElement = messageField;
      } else {
        clearError(messageField);
      }

      // Jika ada error, scroll dan fokus ke input pertama yang bermasalah
      if (!isValid && firstInvalidElement) {
        firstInvalidElement.focus();
        firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      if (isValid) {
        // Ambil data sebelum reset
        const clientName = nameField.value.trim();
        const clientPhone = waField.value.trim();
        const clientEmail = emailField.value.trim();
        const chosenService = serviceField.value;
        const userMsg = messageField.value.trim();

        // Format pesan WhatsApp yang ramah dan terstruktur
        const whatsappText = `Halo Kreativa Studio! Saya ingin memesan/konsultasi jasa desain.
Nama / Bisnis: ${clientName}
No. WhatsApp: ${clientPhone}
Email: ${clientEmail}
Layanan: ${chosenService}

Detail Kebutuhan:
"${userMsg}"

Mohon info penawaran dan jadwal pengerjaannya. Terima kasih!`;

        const waUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappText)}`;

        // Tampilkan status pengiriman visual
        const originalBtnHTML = btnSubmit.innerHTML;
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `
          <span>Memproses Permintaan...</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin-icon"><circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-linecap="round"></circle></svg>
        `;

        setTimeout(() => {
          btnSubmit.innerHTML = originalBtnHTML;
          btnSubmit.disabled = false;

          // Tampilkan feedback sukses
          formFeedback.classList.remove('hidden');
          feedbackTitle.textContent = `Permintaan Diterima, Terima Kasih ${clientName}!`;
          feedbackDesc.innerHTML = `
            Data Anda telah tercatat dengan baik. Jika aplikasi WhatsApp tidak terbuka otomatis, silakan klik tombol di bawah untuk melanjutkan chat langsung:
            <br><br>
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.9rem; display: inline-flex; margin-top: 0.35rem;">
              Buka WhatsApp Sekarang &rarr;
            </a>
          `;

          // Buka WhatsApp di tab baru secara langsung
          window.open(waUrl, '_blank');

          // Reset form
          contactForm.reset();

          // Scroll halus ke pesan feedback
          formFeedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 500);
      }
    });
  }

  function setError(inputElement, message) {
    const parent = inputElement.closest('.form-group');
    if (parent) {
      parent.classList.add('has-error');
      const errorMsg = parent.querySelector('.error-msg');
      if (errorMsg) errorMsg.textContent = message;
    }
  }

  function clearError(inputElement) {
    const parent = inputElement.closest('.form-group');
    if (parent) {
      parent.classList.remove('has-error');
    }
  }

  // ----------------------------------------------------
  // 7. ANIMASI FAVICON BURUNG HANTU (HTML5 CANVAS PNG)
  // ----------------------------------------------------
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');

  let dynamicFavicon = document.getElementById('dynamic-favicon');
  if (!dynamicFavicon) {
    dynamicFavicon = document.createElement('link');
    dynamicFavicon.id = 'dynamic-favicon';
    dynamicFavicon.rel = 'icon';
    dynamicFavicon.type = 'image/png';
    document.head.appendChild(dynamicFavicon);
  }

  function drawOwlFavicon(eyeState, pupilOffset = 0, earOffset = 0) {
    if (!ctx) return;

    ctx.clearRect(0, 0, 32, 32);

    // 1. Background Rounded Badge (#0f172a)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(0, 0, 32, 32, 8);
    } else {
      ctx.rect(0, 0, 32, 32);
    }
    ctx.fill();

    // 2. Ears (#2563eb)
    ctx.fillStyle = '#2563eb';
    // Telinga Kiri
    ctx.beginPath();
    ctx.moveTo(8 + earOffset, 11);
    ctx.lineTo(11, 4);
    ctx.lineTo(14, 11);
    ctx.closePath();
    ctx.fill();

    // Telinga Kanan
    ctx.beginPath();
    ctx.moveTo(24 - earOffset, 11);
    ctx.lineTo(21, 4);
    ctx.lineTo(18, 11);
    ctx.closePath();
    ctx.fill();

    // 3. Owl Body (#1e293b)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(16, 19, 10, 9.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Owl Belly (#334155)
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(16, 21, 5.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 5. Owl Head (#2563eb)
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.ellipse(16, 13, 8.5, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // 6. Eyes (White and Moving Pupil)
    if (eyeState === 'blink') {
      // Mata Merem / Berkedip
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.6;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.arc(12.5, 13, 2.4, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(19.5, 13, 2.4, 0.2 * Math.PI, 0.8 * Math.PI, false);
      ctx.stroke();
    } else {
      // Mata Melek (Putih)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(12.5, 12.5, 3.4, 0, Math.PI * 2);
      ctx.arc(19.5, 12.5, 3.4, 0, Math.PI * 2);
      ctx.fill();

      // Pupil Mata (Hitam)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(12.5 + pupilOffset, 12.5, 1.8, 0, Math.PI * 2);
      ctx.arc(19.5 + pupilOffset, 12.5, 1.8, 0, Math.PI * 2);
      ctx.fill();

      // Kilau Mata (Putih)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(12 + pupilOffset, 11.8, 0.6, 0, Math.PI * 2);
      ctx.arc(19 + pupilOffset, 11.8, 0.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. Beak (#f59e0b)
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(16, 14.5);
    ctx.lineTo(14.2, 17.5);
    ctx.lineTo(17.8, 17.5);
    ctx.closePath();
    ctx.fill();

    // 8. Feet (#f59e0b)
    ctx.beginPath();
    ctx.ellipse(13, 28, 1.8, 1, 0, 0, Math.PI * 2);
    ctx.ellipse(19, 28, 1.8, 1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Update Favicon Link
    if (dynamicFavicon) {
      dynamicFavicon.href = canvas.toDataURL('image/png');
    }
  }

  // Siklus animasi alami burung hantu:
  const animationSteps = [
    { state: 'open', offset: 0, ear: 0, duration: 2200 },       // Lurus ke depan
    { state: 'open', offset: -1.3, ear: -0.6, duration: 1100 }, // Melirik ke kiri
    { state: 'open', offset: 0, ear: 0, duration: 700 },        // Kembali ke tengah
    { state: 'open', offset: 1.3, ear: 0.6, duration: 1100 },   // Melirik ke kanan
    { state: 'open', offset: 0, ear: 0, duration: 1400 },       // Kembali ke tengah
    { state: 'blink', offset: 0, ear: 0, duration: 220 },       // Berkedip mata merem!
    { state: 'open', offset: 0, ear: 0, duration: 1800 }        // Buka mata kembali
  ];

  let currentStep = 0;
  function runFaviconLoop() {
    const step = animationSteps[currentStep];
    drawOwlFavicon(step.state, step.offset, step.ear);
    currentStep = (currentStep + 1) % animationSteps.length;
    setTimeout(runFaviconLoop, step.duration);
  }

  // Mulai animasi loop favicon
  runFaviconLoop();
});

