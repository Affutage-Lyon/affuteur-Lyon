// --- ScrollSpy Fluide ---
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    const scrollPos = window.scrollY;
    const offset = 120;
    let current = "";

    if (sections.length > 0 && scrollPos < sections[0].offsetTop - offset) {
        navLinks.forEach(link => link.classList.add("active"));
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

// Optimisation du scroll
window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActiveLink);
});
document.addEventListener('DOMContentLoaded', updateActiveLink);
window.addEventListener("load", updateActiveLink);

// Gestion de l'affichage de l'adresse pro
function toggleProAddress(show) {
    const section = document.getElementById('pro-address-section');
    if (show) {
        section.classList.add('visible');
    } else {
        section.classList.remove('visible');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.shimmer-effect');
    if (!title) return;

    let position = 120; // On commence juste à droite du texte

    function animate() {
        position -= 0.6; // Vitesse du slash (ajuste à ta guise)
        
        // LA MAGIE EST ICI :
        // Dès que la position atteint -20% (le slash a fini de passer à gauche)
        // on le renvoie immédiatement à 120% (il s'apprête à revenir par la droite)
        if (position < -20) {
            position = 120; 
        }

        title.style.setProperty('--glint-pos', position + '%');
        requestAnimationFrame(animate);
    }

    animate();
});

window.onload = () => {
    // Force le scroll en haut de page au rafraîchissement
    window.scrollTo(0, 0);
};

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.getElementById('burger-trigger');
    const navMenu = document.getElementById('nav-menu');
    const body = document.body;
    const links = document.querySelectorAll('.nav-links a');

    // Fonction pour basculer le menu
    function toggleMenu() {
        burger.classList.toggle('open');
        navMenu.classList.toggle('open');
        body.classList.toggle('menu-open'); // Active l'effet de flou CSS
    }

    burger.addEventListener('click', toggleMenu);

    // Fermer le menu quand on clique sur un lien
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });
    
    /**
 * Animation personnalisée : envolée fluide des gouttes d'eau
 */
function createFloatingDrop() {
    const container = document.getElementById('water-particles');
    if (!container) return;

    // Création par grappes de 2 pour un flux élégant
    for (let i = 0; i < 2; i++) {
        const p = document.createElement('div');
        p.className = 'particle';

        const size = (Math.random() * 3 + 1) + 'px';
        // Durée plus longue (3 à 5s) pour apprécier le ralentissement
        const duration = (Math.random() * 2 + 3) + 's';
        
        // Projection vers le haut (négatif) couvrant le haut du header
        const xDir = (Math.random() - 0.5) * 150 + 'px';
        const yDir = -(Math.random() * 350 + 200) + 'px';

        p.style.width = size;
        p.style.height = size;
        p.style.left = '50%';
        
        p.style.setProperty('--duration', duration);
        p.style.setProperty('--xDir', xDir);
        p.style.setProperty('--yDir', yDir);

        container.appendChild(p);

        // Nettoyage après l'envolée complète [cite: 26-03-27]
        setTimeout(() => p.remove(), parseFloat(duration) * 1000);
    }
}

// Intervalle de 80ms pour une densité harmonieuse
setInterval(createFloatingDrop, 80);

});



