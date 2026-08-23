// --- 1. MODULES FIREBASE & INITIALISATION ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCeAutpjSd99WhhYOJnKqmRLDNJ6305w-8",
  authDomain: "ken-aiguise-app.firebaseapp.com",
  projectId: "ken-aiguise-app",
  storageBucket: "ken-aiguise-app.firebasestorage.app",
  messagingSenderId: "215038466816",
  appId: "1:215038466816:web:e2104fa0954c08529eb1e5",
  measurementId: "G-N31GJX4H5C"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// --- 2. TRAITEMENT & ENVOI DU FORMULAIRE VERS FIRESTORE ---
function initContactForm() {
  const contactForm = document.getElementById("contact-form");
  const submitBtn = document.querySelector(".btn-submit-pro");
  const statusMsg = document.getElementById("dateStatus");

  if (!contactForm || !submitBtn) return;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    const initialText = submitBtn.innerText;
    submitBtn.innerText = "ENVOI EN COURS...";

    const nouvelleDemande = {
      type_client: document.getElementById("client-type")?.value || "Particulier",
      estimation_lames: document.getElementById("lames-count")?.value || "",
      nom_etablissement: document.querySelector('input[name="name"]')?.value.trim() || "",
      telephone: document.querySelector('input[name="telephone_client"]')?.value.trim() || "",
      adresse_complete: document.querySelector('input[name="adresse_complete"]')?.value.trim() || "",
      identite: document.querySelector('input[name="facturation_identite"]')?.value.trim() || "",
      date_souhaitee: document.getElementById("selectedDateInput")?.value || "",
      message: document.querySelector('textarea[name="message"]')?.value.trim() || "",
      statut: "a_traiter",
      created_at: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "demandes"), nouvelleDemande);

      submitBtn.innerText = "DEMANDE ENVOYÉE !";
      submitBtn.style.borderColor = "#67c090";
      submitBtn.style.color = "#67c090";

      if (statusMsg) {
        statusMsg.innerText = "Votre demande a bien été transmise à Ken Aiguise.";
        statusMsg.style.color = "#67c090";
      }

      contactForm.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = initialText;
        submitBtn.style.borderColor = "";
        submitBtn.style.color = "";
      }, 4000);

    } catch (error) {
      console.error("Erreur Firestore :", error);
      submitBtn.disabled = false;
      submitBtn.innerText = "RÉESSAYER";
      
      if (statusMsg) {
        statusMsg.innerText = "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";
        statusMsg.style.color = "#e13f7c";
      }
    }
  });
}

// --- 3. CENTRALISATION DU DOM INITIALISÉ ---
document.addEventListener("DOMContentLoaded", () => {
  // Navigation & Scroll
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

  // Animation Titre (Shimmer)
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

  // Menu Burger Mobile
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
  
  // Particules d'eau
  createWaterParticles();

  // Calendrier, Formulaire & Focus Galerie
  initCalendar();
  initContactForm();
  initClientTypeToggle()
  initGalerieScrollFocus();
  // Initialisation forcée des animations au chargement
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
          const m = String(month + 1).padStart(2, '0');
          const d = String(day).padStart(2, '0');
          selectedDateInput.value = `${year}-${m}-${d}`;
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

// --- GESTION DYNAMIQUE DU CHAMP ÉTABLISSEMENT ---
function initClientTypeToggle() {
  const selectType = document.getElementById("client-type");
  const groupEtab = document.getElementById("group-etablissement");
  const inputEtab = document.getElementById("input-etablissement");

  if (!selectType || !groupEtab || !inputEtab) return;

  selectType.addEventListener("change", () => {
    if (selectType.value === "Professionnel") {
      groupEtab.style.display = "block";
      inputEtab.required = true;
    } else {
      groupEtab.style.display = "none";
      inputEtab.required = false;
      inputEtab.value = "";
    }
  });
}


// --- ANIMATION PARTICULES D'EAU ---
function createWaterParticles() {
  const container = document.getElementById("water-particles");
  if (!container) return;

  setInterval(() => {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    
    const size = Math.random() * 0.5 + 3.5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    
    particle.style.setProperty("--duration", `${Math.random() * 4.5 + 3.5}s`);
    particle.style.setProperty("--xDir", `${(Math.random() - 0.5) * 90}px`);
    particle.style.setProperty("--yDir", `-${Math.random() * 350 + 250}px`); 
    
    container.appendChild(particle);
    
    setTimeout(() => particle.remove(), 9500);
  }, 75); 
}

// --- ANIMATIONS FLUIDES DYNAMIQUES ---
function handleScrollAnimations() {
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

  const contactCard = document.querySelector(".contact-direct");
  if (contactCard) {
    const cardRect = contactCard.getBoundingClientRect();
    const cardCenter = cardRect.top + cardRect.height / 2;
    const screenHeight = window.innerHeight;

    if (cardCenter > screenHeight * 0.15 && cardCenter < screenHeight * 0.85) {
      contactCard.classList.add("neon-active");
    } else {
      contactCard.classList.remove("neon-active");
    }

    let progressCard = (screenHeight - cardRect.top) / screenHeight;
    progressCard = Math.max(0, Math.min(progressCard, 1));

    const translateY = 30 - progressCard * 30;
    contactCard.style.opacity = progressCard;
    contactCard.style.transform = `translateY(${translateY}px)`;
  }
}

// --- ANIMATION SÉQUENTIELLE CARTE PAR CARTE AU SCROLL ---
function initGalerieScrollFocus() {
  const items = document.querySelectorAll('.galerie-item');
  if (!items.length) return;

  function updateFocus() {
    const viewportCenterY = window.innerHeight / 2;
    let closestItem = null;
    let minScore = Infinity;

    items.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const cardCenterY = rect.top + rect.height / 2;
        const offsetDirection = (index % 2 === 0) ? -50 : 50; 
        const score = Math.abs(viewportCenterY - (cardCenterY + offsetDirection));

        if (score < minScore) {
          minScore = score;
          closestItem = item;
        }
      }
    });

    items.forEach((item) => {
      if (item === closestItem) {
        item.classList.add('is-focused');
      } else {
        item.classList.remove('is-focused');
      }
    });
  }

  window.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateFocus);
  });

  updateFocus();
}

window.addEventListener("scroll", () =>
  window.requestAnimationFrame(handleScrollAnimations),
);
