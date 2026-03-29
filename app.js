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




