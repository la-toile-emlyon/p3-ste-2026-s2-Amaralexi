// ===== 1) Section avis =====
// On recupere les elements HTML utiles.
const carteAvis = document.getElementById('review-card');
const guillemetAvis = document.getElementById('quote-mark');
const imageEtoiles = document.getElementById('stars');
const texteAvis = document.getElementById('review-text');
const avatarUtilisateur = document.getElementById('user-avatar');
const nomUtilisateur = document.getElementById('user-name');
const ageUtilisateur = document.getElementById('user-age');

// Variables globales simples.
let listeAvis = [];
let indexAvisActuel = 0;
const DELAI_CHANGEMENT_AVIS = 5000;
const DELAI_ANIMATION_AVIS = 450;

const AVATAR_PAR_DEFAUT = 'asset/photo hugo.png';
const IMAGE_ETOILES = 'asset/⭐⭐⭐⭐⭐.png';

// Affiche un avis dans la carte.
function afficherAvis(avis) {
    const couleurGuillemet = avis.quoteColor === 'orange' ? 'orange' : 'green';
    const cheminAvatar = avis.avatar ? avis.avatar : AVATAR_PAR_DEFAUT;

    guillemetAvis.classList.toggle('orange', couleurGuillemet === 'orange');
    guillemetAvis.textContent = '"';
    imageEtoiles.src = IMAGE_ETOILES;

    texteAvis.textContent = avis.text;
    avatarUtilisateur.src = cheminAvatar;
    avatarUtilisateur.alt = `Photo de ${avis.author}`;
    nomUtilisateur.textContent = avis.author;
    ageUtilisateur.textContent = `${avis.age} ans`;
}

// Passe a l'avis suivant avec animation.
function passerAvisSuivant() {
    if (!listeAvis.length || !carteAvis) {
        return;
    }

    carteAvis.classList.remove('fade-in');
    carteAvis.classList.add('fade-out');

    setTimeout(() => {
        indexAvisActuel = (indexAvisActuel + 1) % listeAvis.length;
        afficherAvis(listeAvis[indexAvisActuel]);

        carteAvis.classList.remove('fade-out');
        carteAvis.classList.add('fade-in');

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                carteAvis.classList.remove('fade-in');
            });
        });
    }, DELAI_ANIMATION_AVIS);
}

// Charge les avis depuis le fichier JSON.
async function initialiserAvis() {
    if (!carteAvis || !texteAvis) {
        return;
    }

    try {
        const reponse = await fetch('json/data.json');
        const donnees = await reponse.json();

        listeAvis = Array.isArray(donnees.comments) ? donnees.comments : [];

        if (!listeAvis.length) {
            texteAvis.textContent = 'Aucun commentaire disponible pour le moment.';
            return;
        }

        // Si Julien existe, on le met en premier.
        const indexJulien = listeAvis.findIndex((element) => element.author === 'Julien');
        if (indexJulien > 0) {
            const avisJulien = listeAvis[indexJulien];
            listeAvis.splice(indexJulien, 1);
            listeAvis.unshift(avisJulien);
        }

        afficherAvis(listeAvis[0]);
        setInterval(passerAvisSuivant, DELAI_CHANGEMENT_AVIS);
    } catch (erreur) {
        texteAvis.textContent = 'Impossible de charger les commentaires pour le moment.';
        console.error('Erreur chargement commentaires:', erreur);
    }
}

initialiserAvis();

// ===== 2) Section mockups =====
// Ouvre les mockups au survol (desktop) et au clic (mobile).
function initialiserMockupsEtapes() {
    const listeEtapes = document.querySelectorAll('.bloc-etape');

    if (!listeEtapes.length) {
        return;
    }

    listeEtapes.forEach((etape) => {
        const zoneMockup = etape.querySelector('.zone-mockup');

        if (!zoneMockup) {
            return;
        }

        etape.addEventListener('mouseenter', () => {
            etape.classList.add('is-open');
        });

        etape.addEventListener('mouseleave', () => {
            etape.classList.remove('is-open');
        });

        zoneMockup.addEventListener('click', (event) => {
            event.stopPropagation();

            const estOuvert = etape.classList.contains('is-open');

            listeEtapes.forEach((item) => {
                item.classList.remove('is-open');
            });

            if (!estOuvert) {
                etape.classList.add('is-open');
            }
        });
    });

    // Clic en dehors: on ferme tout.
    document.addEventListener('click', () => {
        listeEtapes.forEach((etape) => {
            etape.classList.remove('is-open');
        });
    });
}

initialiserMockupsEtapes();

// ===== 3) Header au scroll =====
// Cache le header quand on descend, le remonte quand on monte.
function initialiserHeaderAuScroll() {
    const entete = document.querySelector('.header');

    if (!entete) {
        return;
    }

    let dernierScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const scrollActuelY = window.scrollY;

        if (scrollActuelY <= 10) {
            entete.classList.remove('header-hidden');
            dernierScrollY = scrollActuelY;
            return;
        }

        if (scrollActuelY > dernierScrollY) {
            entete.classList.add('header-hidden');
        } else {
            entete.classList.remove('header-hidden');
        }

        dernierScrollY = scrollActuelY;
    });
}

initialiserHeaderAuScroll();
