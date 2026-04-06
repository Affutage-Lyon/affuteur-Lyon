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

window.addEventListener('scroll', () => window.requestAnimationFrame(updateActiveLink));
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
function createFloatingDrop() {
    const container = document.getElementById('water-particles');
    if (!container) return;
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
        container.appendChild(p);
        setTimeout(() => p.remove(), parseFloat(duration) * 1000);
    }
}
setInterval(createFloatingDrop, 80);

// --- 5. RÉPARATION DU COUTEAU AU SCROLL ---
window.addEventListener('scroll', () => {
    const blade = document.getElementById('main-blade');
    const logo = document.getElementById('blade-logo-scroll');
    if (!blade || !logo) return;
    const progress = Math.min(window.scrollY / 130, 1);

    if (progress >= 0.8) {
        blade.setAttribute('d', blade.getAttribute('data-new'));
        blade.style.fill = "#ffffff";
        blade.classList.add('is-repaired');
        logo.style.transform = "translateY(10px)";
        logo.style.opacity = "1";
    } else {
        blade.setAttribute('d', blade.getAttribute('data-broken'));
        blade.style.fill = "#555c69";
        blade.classList.remove('is-repaired');
        logo.style.transform = "translateY(0px)";
        logo.style.opacity = "0.7";
    }
});

// --- 7. GESTION DU CALENDRIER DE RÉSERVATION ---
document.addEventListener('DOMContentLoaded', () => {
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarDays = document.getElementById('calendarDays');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const selectedDateInput = document.getElementById('selectedDateInput');
    const dateStatus = document.getElementById('dateStatus');

    // On vérifie que les éléments existent (uniquement sur la page contact/index)
    if (!monthDisplay || !calendarDays) return;

    let currentDate = new Date();

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Affichage du mois en français (ex: Avril 2026)
        monthDisplay.innerText = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Ajustement pour que la semaine commence le Lundi (standard européen)
        const startingDay = firstDay === 0 ? 6 : firstDay - 1; 

        // Création des cases vides pour le début du mois
        for (let i = 0; i < startingDay; i++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(div);
        }

        // Génération des jours cliquables
        for (let day = 1; day <= daysInMonth; day++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day');
            div.innerText = day;

            // Identification du jour actuel pour le souligner (style.css)
            const today = new Date();
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                div.classList.add('today');
            }

            // Gestion de la sélection au clic
            div.onclick = () => {
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                div.classList.add('selected');
                
                // On met à jour le champ caché pour l'envoi du formulaire
                const formattedDate = `${day} ${monthDisplay.innerText}`;
                selectedDateInput.value = `${year}-${month + 1}-${day}`;
                dateStatus.innerText = `Souhaité pour le : ${formattedDate}`;
            };

            calendarDays.appendChild(div);
        }
    }

    // Navigation entre les mois
    prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
});


// --- 6. ACCÈS ESPACE CLIENT DYNAMIQUE ---
async function accessClientSpace() {
    const codeSaisi = document.getElementById('client-code').value.trim().toUpperCase();
    const errorMsg = document.getElementById('login-error');
    try {
        const [resClients, resRapports] = await Promise.all([
            fetch('./data/clients.json'),
            fetch('./data/rapport.json')
        ]);
        const dataClients = await resClients.json();
        const dataRapports = await resRapports.json();

        const client = dataClients.clients.find(c => c.id === codeSaisi);

        if (client) {
            // Filtrage dynamique par ID
            const historique = dataRapports.interventions.filter(r => r.client_id === client.id); 
            sessionStorage.setItem('kenAiguise_client', JSON.stringify(client));
            sessionStorage.setItem('kenAiguise_historique', JSON.stringify(historique));
            window.location.href = 'rapport.html';
        } else {
            errorMsg.style.display = 'block';
            errorMsg.innerText = "Code inconnu.";
        }
    } catch (error) {
        errorMsg.style.display = 'block';
        errorMsg.innerText = "Erreur de chargement.";
    }
}
