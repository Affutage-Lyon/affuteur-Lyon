// --- ScrollSpy Fluide ---
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

function updateActiveLink() {
    let current = "";
    const scrollPos = window.pageYOffset;

    // Si on est dans le header (avant la première section)
    // On active tous les liens pour qu'ils soient tous en couleur
    if (sections.length > 0 && scrollPos < sections[0].offsetTop - 150) {
        navLinks.forEach((link) => {
            link.classList.add("active");
        });
        return;
    }

    // Logique standard de ScrollSpy pour les sections
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        // Décalage de 100px pour anticiper le scroll
        if (scrollPos >= sectionTop - 100) {
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

// Utilisation de requestAnimationFrame pour plus de fluidité
window.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateActiveLink);
});

// Initialisation au chargement
window.addEventListener("load", updateActiveLink);

function toggleProAddress(show) {
    const section = document.getElementById('pro-address-section');
    if (show) section.classList.add('visible'); else section.classList.remove('visible');
}

const rows = document.querySelectorAll('.item-row');
const synthesis = document.getElementById('synthesis-text');
const hTotal = document.getElementById('hidden-total');
const hList = document.getElementById('hidden-list');

function calculate() {
    let total = 0, qty = 0, list = "";
    rows.forEach(row => {
        const val = parseInt(row.querySelector('.qty-val').innerText);
        if (val > 0) {
            // Utilisation des tarifs officiels 2026
            total += val * parseInt(row.dataset.price);
            qty += val;
            list += val + "x " + row.dataset.name + ", ";
        }
    });
    synthesis.innerText = qty > 0 ? `Estimation (${qty} outil${qty > 1 ? 's' : ''}) : ${total} €` : "Aucun outil sélectionné";
    hTotal.value = total + " €"; 
    hList.value = list.replace(/, $/, ""); 
}

rows.forEach(row => {
    row.querySelector('.plus').onclick = (e) => { 
        e.preventDefault();
        row.querySelector('.qty-val').innerText++; 
        calculate(); 
    };
    row.querySelector('.minus').onclick = (e) => { 
        e.preventDefault();
        let val = parseInt(row.querySelector('.qty-val').innerText);
        if (val > 0) { 
            row.querySelector('.qty-val').innerText = val - 1; 
            calculate(); 
        }
    };
});
