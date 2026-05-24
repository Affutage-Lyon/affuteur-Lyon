// --- 1. GESTION NAVIGATION & SCROLL ---
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    const scrollPos = window.scrollY;
    const offset = 120;
    let current = "";

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop - offset) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (current && link.getAttribute("href").includes(current)) {
            link.classList.add("active");
        }
    });
}

window.addEventListener('scroll', () => window.requestAnimationFrame(updateActiveLink), { passive: true });
document.addEventListener('DOMContentLoaded', updateActiveLink);

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
    const navLinksList = document.querySelectorAll('.nav-links a'); // On récupère tous les liens

    if (!burger || !navMenu) return;

    function toggleMenu() {
        burger.classList.toggle('open');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    }

    burger.addEventListener('click', toggleMenu);

    // AJOUT : Fermer le menu lors d'un clic sur un lien
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu(); // On réutilise la fonction pour tout décocher proprement
            }
        });
    });
});


// --- 4. ANIMATION GOUTTES D'EAU (PARTICULES) ---
document.addEventListener('DOMContentLoaded', () => {
    const particleContainer = document.getElementById('water-particles');
    if (!particleContainer) return;

    function createFloatingDrop() {
        for (let i = 0; i < 2; i++) {
            const p = document.createElement('div');
            p.className = 'particle';
            const size = (Math.random() * 3 + 1) + 'px';
            const duration = (Math.random() * 2 + 3) + 's';
            const xDir = (Math.random() - 0.5) * 150 + 'px';
            const yDir = -(Math.random() * 350 + 200) + 'px';
            p.style.width = size; p.style.height = size; p.style.left = '50%';
            p.style.setProperty('--duration', duration);
            p.style.setProperty('--xDir', xDir);
            p.style.setProperty('--yDir', yDir);
            particleContainer.appendChild(p);
            setTimeout(() => p.remove(), parseFloat(duration) * 1000);
        }
    }
    setInterval(createFloatingDrop, 80);
});

// --- 5. RÉPARATION DU COUTEAU AU SCROLL ---
const blade = document.getElementById('main-blade');
const bladeLogo = document.getElementById('blade-logo-scroll');

if (blade && bladeLogo) {
    window.addEventListener('scroll', () => {
        const progress = Math.min(window.scrollY / 100, 1);
        if (progress >= 0.8) {
            blade.setAttribute('d', blade.getAttribute('data-new'));
            blade.style.fill = "#ffffff";
            blade.classList.add('is-repaired');
            bladeLogo.style.transform = "translateY(10px)";
            bladeLogo.style.opacity = "1";
        } else {
            blade.setAttribute('d', blade.getAttribute('data-broken'));
            blade.style.fill = "#555c69";
            blade.classList.remove('is-repaired');
            bladeLogo.style.transform = "translateY(0px)";
            bladeLogo.style.opacity = "0.7";
        }
    }, { passive: true });
}

// GALERIE ANIMATION 

const cards = document.querySelectorAll('.galerie-card');
const dots = document.querySelectorAll('.nav-dot');

cards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        // Nettoyage rapide des états
        cards.forEach(c => c.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        // Activation ciblée
        card.classList.add('active');
        if(dots[index]) dots[index].classList.add('active');
    });
});

// Retour à la première carte quand la souris quitte la galerie
const container = document.querySelector('.galerie-container');
if (!container) return;
container.addEventListener('mouseleave', () => {
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    cards[0].classList.add('active'); // On remet le focus sur la première
    dots[0].classList.add('active');
});

cards.forEach((card, index) => {
    // Ajout de l'événement 'click' pour le mobile
    card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        
        card.classList.add('active');
        if(dots[index]) dots[index].classList.add('active');
    });
});

// --- OPTIMISATION SWIPE POUR LA GALERIE ---
let touchStartX = 0;
let touchEndX = 0;
const galerieContainer = document.querySelector('.galerie-container');

function handleSwipe() {
    const threshold = 50; // Distance minimale en pixels pour valider le swipe
    let currentIndex = Array.from(cards).findIndex(card => card.classList.contains('active'));

    if (touchStartX - touchEndX > threshold) {
        // Swipe vers la gauche -> Carte suivante
        const nextIndex = (currentIndex + 1) % cards.length;
        activateCard(nextIndex);
    } else if (touchEndX - touchStartX > threshold) {
        // Swipe vers la droite -> Carte précédente
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        activateCard(prevIndex);
    }
}

function activateCard(index) {
    cards.forEach(c => c.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    
    cards[index].classList.add('active');
    if(dots[index]) dots[index].classList.add('active');
}

galerieContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, {passive: true});

galerieContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, {passive: true});

// --- 6. ACCORDÉON FAQ ---
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const faqItem = button.parentElement;
        document.querySelectorAll('.faq-item').forEach(item => {
            if (item !== faqItem) item.classList.remove('active');
        });
        faqItem.classList.toggle('active');
    });
});
