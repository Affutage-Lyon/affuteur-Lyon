// --- CENTRALISATION DU DOM INITIALISÉ ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. Navigation & Scroll
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");
  const offset = 120;

  function updateActiveLink() {
    const scrollPos = window.scrollY;
    let current = "";
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop - offset) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (current && link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  }
  window.addEventListener("scroll", () =>
    window.requestAnimationFrame(updateActiveLink),
  );
  updateActiveLink();

  // 2. Animation Titre (Shimmer)
  const title = document.querySelector(".shimmer-effect");
  if (title) {
    let position = 120;
    function animateShimmer() {
      position -= 0.6;
      if (position < -20) position = 120;
      title.style.setProperty("--glint-pos", position + "%");
      requestAnimationFrame(animateShimmer);
    }
    animateShimmer();
  }

  // 3. Menu Burger Mobile
  const burger = document.getElementById("burger-trigger");
  const navMenu = document.getElementById("nav-menu");
  if (burger && navMenu) {
    const toggleMenu = () => {
      burger.classList.toggle("open");
      navMenu.classList.toggle("open");
      document.body.classList.toggle("menu-open");
    };
    burger.addEventListener("click", toggleMenu);
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navMenu.classList.contains("open")) toggleMenu();
      });
    });
  }
  
  // --- ANIMATION PARTICULES D'EAU (Jet Dense & Rapide) ---
  function createWaterParticles() {
    const container = document.getElementById("water-particles");
    if (!container) return;

    // Intervalle à 30ms = Flux continu très dense
    setInterval(() => {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      
      // Taille cohérente : entre 3.5px et 4px
      const size = Math.random() * 0.5 + 3.5;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      
      // Mouvement : Durée plus longue (3.5s à 8s) pour un jet fluide et constant
      particle.style.setProperty("--duration", `${Math.random() * 4.5 + 3.5}s`);
      
      // Amplitude augmentée : jaillissement large et haut
      particle.style.setProperty("--xDir", `${(Math.random() - 0.5) * 90}px`);
      particle.style.setProperty("--yDir", `-${Math.random() * 350 + 250}px`); 
      
      container.appendChild(particle);
      
      // Nettoyage après 9.5s pour laisser le temps au jet de se dissiper complètement
      setTimeout(() => particle.remove(), 9500);
    }, 75); 
  }


  // Appel de la fonction directement (sans imbriquer un nouvel écouteur d'événement)
  createWaterParticles();

  // 4. Calendrier de Réservation
  initCalendar();

  // 5. Initialisation forcée des animations au chargement
  // (Évite que la carte soit invisible si on rafraîchit en bas de page)
  handleScrollAnimations();
});

// --- LOGIQUE DU CALENDRIER ---
function initCalendar() {
  const monthDisplay = document.getElementById("monthDisplay");
  const calendarDays = document.getElementById("calendarDays");
  const prevBtn = document.getElementById("prevMonth");
  const nextBtn = document.getElementById("nextMonth");
  const selectedDateInput = document.getElementById("selectedDateInput");
  const dateStatus = document.getElementById("dateStatus");

  if (!monthDisplay || !calendarDays) return;

  let currentDate = new Date();

  function renderCalendar() {
    calendarDays.innerHTML = "";
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthDisplay.innerText = new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric",
    }).format(currentDate);

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startingDay; i++) {
      const div = document.createElement("div");
      div.classList.add("calendar-day", "empty");
      calendarDays.appendChild(div);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const div = document.createElement("div");
      div.classList.add("calendar-day");
      div.innerText = day;

      const cellDate = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (cellDate < today) {
        div.classList.add("past-date");
      } else {
        if (
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear()
        ) {
          div.classList.add("today");
        }

        div.onclick = () => {
          document
            .querySelectorAll(".calendar-day")
            .forEach((d) => d.classList.remove("selected"));
          div.classList.add("selected");

          const formattedDate = `${day} ${monthDisplay.innerText}`;
          selectedDateInput.value = `${year}-${month + 1}-${day}`;
          dateStatus.innerText = `Souhaité pour le : ${formattedDate}`;
        };
      }
      calendarDays.appendChild(div);
    }
  }

  prevBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  };
  nextBtn.onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  };

  renderCalendar();
}

// --- 6. ANIMATIONS FLUIDES DYNAMIQUES ---
function handleScrollAnimations() {
  // Animation 1 : Couteau dynamique & Logo
  const blade = document.getElementById("main-blade");
  const logo = document.getElementById("blade-logo-scroll");
  if (blade && logo) {
    const progressKnife = Math.min(window.scrollY / 100, 1);
    if (progressKnife >= 0.8) {
      blade.setAttribute("d", blade.getAttribute("data-new"));
      blade.style.fill = "#ffffff";
      blade.classList.add("is-repaired");
      logo.style.transform = "translateY(10px)";
      logo.style.opacity = "1";
    } else {
      blade.setAttribute("d", blade.getAttribute("data-broken"));
      blade.style.fill = "#555c69";
      blade.classList.remove("is-repaired");
      logo.style.transform = "translateY(0px)";
      logo.style.opacity = "0.7";
    }
  }

  // Animation 2 : Carte d'identité Contact (en direct)
  const contactCard = document.querySelector(".contact-direct");
  if (contactCard) {
    const cardRect = contactCard.getBoundingClientRect();
    const cardCenter = cardRect.top + cardRect.height / 2;
    const screenHeight = window.innerHeight;

    // 1. Allumage des Néons (si la carte est bien centrée sur l'écran)
    if (cardCenter > screenHeight * 0.15 && cardCenter < screenHeight * 0.85) {
      contactCard.classList.add("neon-active");
    } else {
      contactCard.classList.remove("neon-active");
    }

    // 2. Mouvement fluide (Calcul de l'opacité et position)
    let progressCard = (screenHeight - cardRect.top) / screenHeight;
    progressCard = Math.max(0, Math.min(progressCard, 1));

    const translateY = 30 - progressCard * 30;
    contactCard.style.opacity = progressCard;
    contactCard.style.transform = `translateY(${translateY}px)`;
  }
}

// Lier l'animation au défilement de la page
window.addEventListener("scroll", () =>
  window.requestAnimationFrame(handleScrollAnimations),
);
