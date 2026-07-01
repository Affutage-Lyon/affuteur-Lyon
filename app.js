// --- CENTRALISATION DU DOM INITIALISÉ ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation & Scroll
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const offset = 120;

    function updateActiveLink() {
        const scrollPos = window.scrollY;
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
    updateActiveLink();

    // 2. Animation Titre (Shimmer)
    const title = document.querySelector('.shimmer-effect');
    if (title) {
        let position = 120;
        function animateShimmer() {
            position -= 0.6;
            if (position < -20) position = 120; 
            title.style.setProperty('--glint-pos', position + '%');
            requestAnimationFrame(animateShimmer);
        }
        animateShimmer();
    }

    // 3. Menu Burger Mobile
    const burger = document.getElementById('burger-trigger');
    const navMenu = document.getElementById('nav-menu');
    if (burger && navMenu) {
        const toggleMenu = () => {
            burger.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.classList.toggle('menu-open');
        };
        burger.addEventListener('click', toggleMenu);
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('open')) toggleMenu();
            });
        });
    }
    
    // --- 6. ANIMATIONS FLUIDES (HORS DOMCONTENTLOADED POUR LES PERFORMANCES) ---
window.addEventListener('scroll', () => {
    // Animation 1 : Couteau dynamique & Logo
    const blade = document.getElementById('main-blade');
    const logo = document.getElementById('blade-logo-scroll');
    if (blade && logo) {
        const progressKnife = Math.min(window.scrollY / 100, 1);
        if (progressKnife >= 0.8) {
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
    }

    // Animation 2 : Carte d'identité Contact interactive en direct au scroll
    const contactCard = document.querySelector('.contact-direct');
    if (contactCard) {
        const cardPosition = contactCard.getBoundingClientRect().top;
        const screenHeight = window.innerHeight;

        // On calcule l'apparition de la carte quand elle entre dans l'écran
        // 0 = hors écran en bas, 1 = totalement centrée/dépassée
        let progressCard = (screenHeight - cardPosition) / (screenHeight * 0.5);
        progressCard = Math.max(0, Math.min(progressCard, 1)); // Sécurité entre 0 et 1

        // Application chirurgicale des styles en temps réel
        const translateY = 30 - (progressCard * 30); // Glisse de 30px à 0px
        contactCard.style.opacity = progressCard;
        contactCard.style.transform = `translateY(${translateY}px)`;
    }
});


    // 4. Calendrier de Réservation
    initCalendar();
});

// --- 5. LOGIQUE DU CALENDRIER (EXTRAITE POUR PLUS DE CLARTÉ) ---
function initCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarDays = document.getElementById('calendarDays');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const selectedDateInput = document.getElementById('selectedDateInput');
    const dateStatus = document.getElementById('dateStatus');

    if (!monthDisplay || !calendarDays) return;

    let currentDate = new Date();

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        monthDisplay.innerText = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate);

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const startingDay = firstDay === 0 ? 6 : firstDay - 1; 

        for (let i = 0; i < startingDay; i++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(div);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const div = document.createElement('div');
            div.classList.add('calendar-day');
            div.innerText = day;

            const cellDate = new Date(year, month, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0); 

            if (cellDate < today) {
                div.classList.add('past-date');
            } else {
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
            }
            calendarDays.appendChild(div);
        }
    }

    prevBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
    nextBtn.onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

    renderCalendar();
}

// --- 6. ANIMATIONS FLUIDES (HORS DOMCONTENTLOADED POUR LES PERFORMANCES) ---
window.addEventListener('scroll', () => {
    const blade = document.getElementById('main-blade');
    const logo = document.getElementById('blade-logo-scroll');
    if (!blade || !logo) return;
    const progress = Math.min(window.scrollY / 100, 1);

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
