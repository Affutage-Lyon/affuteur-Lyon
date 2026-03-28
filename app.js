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
