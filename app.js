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


async function accessClientSpace() {
    const codeSaisi = document.getElementById('client-code').value.trim().toUpperCase();
    const errorMsg = document.getElementById('login-error');

    try {
        // Chargement de la base client depuis le dossier data
        const response = await fetch('./data/clients.json');
        const data = await response.json();

        // Vérification du code (ID)
        const client = data.clients.find(c => c.id === codeSaisi);

        if (client) {
            // On mémorise le client pour la page suivante
            sessionStorage.setItem('kenAiguise_client', JSON.stringify(client));
            // Redirection vers l'interface unique
            window.location.href = 'rapport.html';
        } else {
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Code inconnu. Vérifiez vos documents Ken Aiguise.";
        }
    } catch (error) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Erreur de connexion aux données.";
    }
}

// --- Gestion de la réparation du couteau au scroll ---
window.addEventListener('scroll', () => {
    const blade = document.getElementById('main-blade');
    const logo = document.getElementById('blade-logo-scroll');
    if (!blade || !logo) return;

    const scrollY = window.scrollY;
    // L'animation se complète après 300px de scroll
    const threshold = 130; 
    const progress = Math.min(scrollY / threshold, 1);

    if (progress >= 0.8) {
        // État : RÉPARÉ
        blade.setAttribute('d', blade.getAttribute('data-new'));
        blade.style.fill = "#ffffff";
        blade.classList.add('is-repaired');
        logo.style.transform = "translateY(10px)";
        logo.style.opacity = "1";
    } else {
        // État : CASSÉ
        blade.setAttribute('d', blade.getAttribute('data-broken'));
        blade.style.fill = "#555c69";
        blade.classList.remove('is-repaired');
        logo.style.transform = "translateY(0px)";
        logo.style.opacity = "0.7";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarDays = document.getElementById('calendarDays');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const selectedDateInput = document.getElementById('selectedDateInput');
    const dateStatus = document.getElementById('dateStatus');

    let currentDate = new Date();

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthDisplay.innerText = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startingDay = firstDay === 0 ? 6 : firstDay - 1; // Ajustement pour commencer par Lundi

        // Cases vides pour le début du mois
        for (let i = 0; i < startingDay; i++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(div);
        }

        // Jours du mois
        for (let day = 1; day <= daysInMonth; day++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day');
            div.innerText = day;

            // Marquer aujourd'hui
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                div.classList.add('today');
            }

            div.onclick = () => {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                div.classList.add('selected');
                const formattedDate = `${day} ${monthDisplay.innerText}`;
                selectedDateInput.value = `${year}-${month + 1}-${day}`;
                dateStatus.innerText = `Souhaité pour le : ${formattedDate}`;
            };

            calendarDays.appendChild(div);
        }
    }

    prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
});





