/**
 * PROJET : Ken Aiguise (Affûtage de précision, Lyon)
 * FICHIER : app.js
 * RÔLE : Animations, Navigation mobile et ScrollSpy
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. SÉLECTEURS PRINCIPAUX ---
    const burger = document.getElementById('burger-trigger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const title = document.querySelector('.shimmer-effect');

    // --- 2. GESTION DU MENU MOBILE (BURGER) ---
    function toggleMenu() {
        burger.classList.toggle('open');
        navMenu.classList.toggle('open');
        body.classList.toggle('menu-open'); // Active l'effet de flou défini dans style.css
    }

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    // Fermeture automatique au clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // --- 3. SCROLLSPY (MISE EN AVANT DU LIEN ACTIF) ---
    function updateActiveLink() {
        const scrollPos = window.scrollY;
        const offset = 120; // Décalage pour l'activation
        let current = "";

        // Si on est tout en haut, on active le premier lien
        if (sections.length > 0 && scrollPos < sections[0].offsetTop - offset) {
            navLinks.forEach(link => link.classList.remove("active"));
            if (navLinks[0]) navLinks[0].classList.add("active");
            return;
        }

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

    // Optimisation de la performance du scroll
    window.addEventListener('scroll', () => {
        window.requestAnimationFrame(updateActiveLink);
    });

    // --- 4. ANIMATION DU TITRE (EFFET SHIMMER / SLASH) ---
    if (title) {
        let position = 120; // Point de départ à droite

        function animateShimmer() {
            position -= 0.6; // Vitesse de passage du reflet
            
            // Boucle infinie : une fois à gauche (-20%), on repart à droite (120%)
            if (position < -20) {
                position = 120; 
            }

            title.style.setProperty('--glint-pos', position + '%');
            requestAnimationFrame(animateShimmer);
        }

        animateShimmer();
    }

    // Initialisation immédiate du ScrollSpy
    updateActiveLink();
});

// --- 5. LOGIQUE DU FORMULAIRE (ADRESSE PRO) ---
/**
 * Affiche ou masque les champs spécifiques aux professionnels
 * @param {boolean} show 
 */
function toggleProAddress(show) {
    const section = document.getElementById('pro-address-section');
    if (!section) return;

    if (show) {
        section.classList.add('visible');
    } else {
        section.classList.remove('visible');
    }
}

// --- 6. ÉVÉNEMENTS DE CHARGEMENT ---
window.addEventListener('load', () => {
    // Force le retour en haut de page au rafraîchissement pour l'expérience utilisateur
    window.scrollTo(0, 0);
});
