// --- 1. GESTION NAVIGATION & SCROLL ---
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function syncNavHeight() {
    if (!siteNav) return;
    document.documentElement.style.setProperty('--nav-height', `${siteNav.offsetHeight}px`);
}

function updateActiveLink() {
    const navHeight = siteNav?.offsetHeight || 72;
    const scrollPos = window.scrollY + navHeight + 40;
    let current = '';

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (current && link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    siteNav?.classList.toggle('is-scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', () => window.requestAnimationFrame(updateActiveLink));
window.addEventListener('resize', syncNavHeight);
document.addEventListener('DOMContentLoaded', () => {
    syncNavHeight();
    updateActiveLink();
});

// --- 2. ANIMATION TITRE (SHIMMER) ---
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.shimmer-effect');
    if (!title) return;
    let position = 120;
    function animate() {
        position -= 0.6;
        if (position < -20) position = 120; 
        title.style.setProperty('--glint-pos', position + '%');
        requestAnimationFrame(animate);
    }
    animate();
});

// --- 3. MENU BURGER MOBILE ---
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger-trigger');
    const navMenu = document.getElementById('nav-menu');
    const overlay = document.getElementById('nav-overlay');

    if (!burger || !navMenu) return;

    function setMenuOpen(isOpen) {
        burger.classList.toggle('open', isOpen);
        navMenu.classList.toggle('open', isOpen);
        overlay?.classList.toggle('is-visible', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
        burger.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    }

    function toggleMenu() {
        setMenuOpen(!navMenu.classList.contains('open'));
    }

    burger.addEventListener('click', toggleMenu);
    overlay?.addEventListener('click', () => setMenuOpen(false));

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) setMenuOpen(false);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) setMenuOpen(false);
    });
});


// --- 4. ANIMATION GOUTTES D'EAU (PARTICULES) ---
(function initWaterParticles() {
    const container = document.getElementById('water-particles');
    const hero = document.getElementById('home');
    if (!container || !hero) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let intervalId = null;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const intervalMs = isMobile ? 200 : 120;

    function createFloatingDrop() {
        const batchSize = isMobile ? 1 : 2;
        for (let i = 0; i < batchSize; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = (Math.random() * 3 + 1) + 'px';
            const duration = (Math.random() * 2 + 3) + 's';
            const xDir = (Math.random() - 0.5) * 150 + 'px';
            const yDir = -(Math.random() * 350 + 200) + 'px';
            p.style.width = size;
            p.style.height = size;
            p.style.left = '50%';
            p.style.setProperty('--duration', duration);
            p.style.setProperty('--xDir', xDir);
            p.style.setProperty('--yDir', yDir);
            container.appendChild(p);
            setTimeout(() => p.remove(), parseFloat(duration) * 1000);
        }
    }

    function startParticles() {
        if (intervalId) return;
        intervalId = setInterval(createFloatingDrop, intervalMs);
    }

    function stopParticles() {
        if (!intervalId) return;
        clearInterval(intervalId);
        intervalId = null;
        container.replaceChildren();
    }

    const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? startParticles() : stopParticles()),
        { threshold: 0.1 }
    );
    observer.observe(hero);
})();

// --- 5. RÉPARATION DES OUTILS AU SCROLL ---
function updateKnifeOnScroll() {
    const blades = document.querySelectorAll('.tool-blade');
    const logos = document.querySelectorAll('.tool-logo');
    const showcase = document.getElementById('knife-showcase');
    if (!blades.length) return;

    const repaired = Math.min(window.scrollY / 100, 1) >= 0.8;

    blades.forEach((blade) => {
        blade.setAttribute('d', blade.getAttribute(repaired ? 'data-new' : 'data-broken'));
        blade.style.fill = repaired ? '#ffffff' : '#555c69';
        blade.classList.toggle('is-repaired', repaired);
    });

    logos.forEach((logo) => {
        logo.style.transform = repaired ? 'translateY(10px)' : 'translateY(0px)';
        logo.style.opacity = repaired ? '1' : '0.7';
    });

    showcase?.classList.toggle('is-repaired', repaired);
}

window.addEventListener('scroll', () => requestAnimationFrame(updateKnifeOnScroll));
document.addEventListener('DOMContentLoaded', updateKnifeOnScroll);

// --- GALERIE 9 PHOTOS ---
(function initGalerie() {
    // Modifier ce tableau pour ajouter / remplacer vos photos (01.webp → 09.webp dans img/galerie/)
    const PHOTOS = [
        { src: 'img/galerie/01.webp', tag: 'Avant', title: 'Lame avant affûtage', alt: 'Couteau émoussé avant intervention' },
        { src: 'img/galerie/02.webp', tag: 'Après', title: 'Tranchant rasoir', alt: 'Tranchant miroir après affûtage' },
        { src: 'img/galerie/03.webp', tag: 'Geste', title: 'Sur la meule Tormek', alt: 'Geste technique sur meule à eau' },
        { src: 'img/galerie/04.webp', tag: 'Détail', title: 'Fil du tranchant', alt: 'Gros plan sur la lame affûtée' },
        { src: 'img/galerie/05.webp', tag: 'Atelier', title: "L'atelier d'Ypres", alt: 'Intérieur de l\'atelier Ken Aiguise' },
        { src: 'img/galerie/06.webp', tag: 'Japonais', title: 'Couteau japonais', alt: 'Affûtage de couteau japonais' },
        { src: 'img/galerie/07.webp', tag: 'Pro', title: 'Matériel de cuisine', alt: 'Couteaux professionnels affûtés' },
        { src: 'img/galerie/08.webp', tag: 'Outil', title: 'Ciseaux & secateurs', alt: 'Affûtage de ciseaux et outils' },
        { src: 'img/galerie/09.webp', tag: 'Finition', title: 'Polissage diamant', alt: 'Finition sur pierre diamant' },
    ];

    const track = document.getElementById('galerie-track');
    const thumbsEl = document.getElementById('galerie-thumbs');
    const progress = document.getElementById('galerie-progress');
    const counter = document.getElementById('galerie-counter');
    const caption = document.getElementById('galerie-caption');
    const btnPrev = document.getElementById('galerie-prev');
    const btnNext = document.getElementById('galerie-next');
    const lightbox = document.getElementById('galerie-lightbox');
    const lightboxTrack = document.getElementById('galerie-lightbox-track');
    const lightboxClose = document.getElementById('galerie-lightbox-close');
    const lbCounter = document.getElementById('galerie-lightbox-counter');
    const lbCaption = document.getElementById('galerie-lightbox-caption');

    if (!track || !thumbsEl) return;

    const total = PHOTOS.length;
    let activeIndex = 0;
    let isSyncing = false;

    function buildSlide(photo, index, forLightbox) {
        const el = document.createElement(forLightbox ? 'div' : 'article');
        el.className = forLightbox ? 'galerie-lightbox-slide' : 'galerie-slide';
        el.dataset.index = index;
        if (!forLightbox) {
            el.innerHTML = `
                <img src="${photo.src}" alt="${photo.alt}" loading="${index < 2 ? 'eager' : 'lazy'}">
                <div class="galerie-slide-overlay"></div>
                <span class="galerie-slide-tag">${photo.tag}</span>
                <p class="galerie-slide-title">${photo.title}</p>
            `;
            el.addEventListener('click', () => openLightbox(index));
        } else {
            el.innerHTML = `<img src="${photo.src}" alt="${photo.alt}">`;
        }
        return el;
    }

    PHOTOS.forEach((photo, i) => {
        track.appendChild(buildSlide(photo, i, false));
        const thumb = document.createElement('button');
        thumb.type = 'button';
        thumb.className = 'galerie-thumb' + (i === 0 ? ' active' : '');
        thumb.dataset.index = i;
        thumb.setAttribute('aria-label', `Photo ${i + 1} : ${photo.title}`);
        thumb.innerHTML = `<img src="${photo.src}" alt="" loading="lazy">`;
        thumb.addEventListener('click', () => goTo(i));
        thumbsEl.appendChild(thumb);
        if (lightboxTrack) lightboxTrack.appendChild(buildSlide(photo, i, true));
    });

    const slides = track.querySelectorAll('.galerie-slide');
    const thumbs = thumbsEl.querySelectorAll('.galerie-thumb');
    const lbSlides = lightboxTrack?.querySelectorAll('.galerie-lightbox-slide');

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function updateUI(index) {
        activeIndex = index;
        const photo = PHOTOS[index];
        if (progress) progress.style.width = `${((index + 1) / total) * 100}%`;
        if (counter) counter.textContent = `${pad(index + 1)} / ${pad(total)}`;
        if (caption) caption.textContent = photo.title;
        thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
        const activeThumb = thumbs[index];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function goTo(index) {
        const i = ((index % total) + total) % total;
        isSyncing = true;
        slides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        if (lightbox?.classList.contains('is-open') && lbSlides?.[i]) {
            lbSlides[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
        updateUI(i);
        if (lbCounter) lbCounter.textContent = `${pad(i + 1)} / ${pad(total)}`;
        if (lbCaption) lbCaption.textContent = PHOTOS[i].title;
        setTimeout(() => { isSyncing = false; }, 400);
    }

    function observeTrack(container, onIndex) {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isSyncing) return;
                entries.forEach((entry) => {
                    if (!entry.isIntersecting || entry.intersectionRatio < 0.6) return;
                    const index = Number(entry.target.dataset.index);
                    if (!Number.isNaN(index)) onIndex(index);
                });
            },
            { root: container, threshold: [0.6, 0.85] }
        );
        container.querySelectorAll('[data-index]').forEach(el => observer.observe(el));
    }

    observeTrack(track, (index) => {
        updateUI(index);
        if (lightbox?.classList.contains('is-open') && lbSlides?.[index]) {
            isSyncing = true;
            lbSlides[index].scrollIntoView({ behavior: 'auto', inline: 'center' });
            setTimeout(() => { isSyncing = false; }, 50);
        }
    });

    if (lightboxTrack) {
        observeTrack(lightboxTrack, (index) => {
            updateUI(index);
            if (lbCounter) lbCounter.textContent = `${pad(index + 1)} / ${pad(total)}`;
            if (lbCaption) lbCaption.textContent = PHOTOS[index].title;
            isSyncing = true;
            slides[index].scrollIntoView({ behavior: 'auto', inline: 'center' });
            setTimeout(() => { isSyncing = false; }, 50);
        });
    }

    btnPrev?.addEventListener('click', () => goTo(activeIndex - 1));
    btnNext?.addEventListener('click', () => goTo(activeIndex + 1));

    function openLightbox(index) {
        if (!lightbox) return;
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('menu-open');
        goTo(index);
        if (lbCounter) lbCounter.textContent = `${pad(index + 1)} / ${pad(total)}`;
        if (lbCaption) lbCaption.textContent = PHOTOS[index].title;
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
    }

    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
        if (!lightbox?.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') goTo(activeIndex - 1);
        if (e.key === 'ArrowRight') goTo(activeIndex + 1);
    });

    updateUI(0);
})();

// --- 8. APPARITION AU SCROLL (sections & grilles) ---
(function initScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('js-reveal');

    function markVisible(el) {
        el.classList.add('is-visible');
        el.querySelectorAll('.reveal-stagger > *').forEach((child) => {
            child.classList.add('is-visible');
        });
    }

    if (prefersReduced) {
        document.querySelectorAll('.reveal, .reveal-stagger > *').forEach(markVisible);
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                markVisible(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    document.querySelectorAll('.reveal-stagger').forEach((container) => {
        [...container.children].forEach((child, index) => {
            child.style.setProperty('--reveal-delay', `${index * 0.1}s`);
            observer.observe(child);
        });
    });
})();

// --- 9. LIVRE BIO (FEUILLETAGE) ---
(function initBioBook() {
    const pagesEl = document.getElementById('bio-pages');
    const btnPrev = document.getElementById('bio-prev');
    const btnNext = document.getElementById('bio-next');
    const labelEl = document.getElementById('bio-chapter-label');
    const counterEl = document.getElementById('bio-page-counter');
    const tocEl = document.getElementById('bio-toc');
    const bookEl = document.getElementById('bio-book');

    if (!pagesEl || !btnPrev || !btnNext) return;

    const pages = [...pagesEl.querySelectorAll('.bio-page')];
    const tocButtons = tocEl ? [...tocEl.querySelectorAll('button[data-page]')] : [];
    const total = pages.length;
    const FLIP_MS = 650;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let current = 0;
    let animating = false;

    function pad(n) {
        return String(n);
    }

    function updateUI() {
        const chapter = pages[current].dataset.chapter || `Page ${current + 1}`;
        if (labelEl) labelEl.textContent = chapter;
        if (counterEl) counterEl.textContent = `${pad(current + 1)} / ${pad(total)}`;
        btnPrev.disabled = current === 0;
        btnNext.disabled = current === total - 1;
        tocButtons.forEach((btn) => {
            btn.classList.toggle('is-current', Number(btn.dataset.page) === current);
        });
    }

    function resetPageScroll(page) {
        const inner = page?.querySelector('.bio-page-inner');
        if (inner) inner.scrollTop = 0;
    }

    function goTo(index) {
        if (animating || index === current || index < 0 || index >= total) return;

        const outgoing = pages[current];
        const incoming = pages[index];

        if (prefersReduced) {
            outgoing.classList.remove('is-active');
            incoming.classList.add('is-active');
            current = index;
            resetPageScroll(incoming);
            updateUI();
            return;
        }

        animating = true;
        outgoing.classList.add('is-flipping-out');
        outgoing.classList.remove('is-active');

        incoming.classList.add('is-flipping-in', 'is-active');

        setTimeout(() => {
            outgoing.classList.remove('is-flipping-out');
            incoming.classList.remove('is-flipping-in');
            current = index;
            resetPageScroll(incoming);
            animating = false;
            updateUI();
        }, FLIP_MS);
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    tocButtons.forEach((btn) => {
        btn.addEventListener('click', () => goTo(Number(btn.dataset.page)));
    });

    if (bookEl) {
        let touchStartX = 0;
        let touchStartY = 0;

        bookEl.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        bookEl.addEventListener('touchend', (e) => {
            const dx = e.changedTouches[0].screenX - touchStartX;
            const dy = e.changedTouches[0].screenY - touchStartY;
            if (Math.abs(dx) < 40) return;
            if (Math.abs(dy) > Math.abs(dx)) return;
            if (dx < 0) goTo(current + 1);
            else goTo(current - 1);
        }, { passive: true });
    }

    document.addEventListener('keydown', (e) => {
        const bioSection = document.getElementById('bio');
        if (!bioSection) return;
        const rect = bioSection.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
        if (!inView) return;
        if (e.key === 'ArrowRight') goTo(current + 1);
        if (e.key === 'ArrowLeft') goTo(current - 1);
    });

    updateUI();
})();
