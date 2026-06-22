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
const DUREE_MOCKUP_ORIGINE = '1.1s';
const DUREE_MOCKUP_LENTE = '1.2s';

function appliquerDureeAnimationMockup(duree) {
    document.documentElement.style.setProperty('--mockup-animation-duration', duree);
}

function initialiserCommandeResetMockup() {
    // Par defaut, on ralentit un peu l'animation.
    appliquerDureeAnimationMockup(DUREE_MOCKUP_LENTE);

    let bufferTouches = '';
    let timeoutBuffer = null;

    document.addEventListener('keydown', (event) => {
        if (event.key.length !== 1) {
            return;
        }

        bufferTouches = (bufferTouches + event.key.toLowerCase()).slice(-5);

        if (timeoutBuffer) {
            clearTimeout(timeoutBuffer);
        }

        timeoutBuffer = setTimeout(() => {
            bufferTouches = '';
        }, 1600);

        if (bufferTouches === 'reset') {
            appliquerDureeAnimationMockup(DUREE_MOCKUP_ORIGINE);
            activerCarrouselPartenairesAncien();
            remettreDoubleBeneficeCommeAvant();
            bufferTouches = '';
            console.info('Reset active: mockup, carrousel partenaires et double benefice remis comme avant.');
        }
    });
}

function initialiserAnimationDoubleBenefice() {
    const sectionDoubleBenefice = document.querySelector('.double-benef-section');

    if (!sectionDoubleBenefice) {
        return;
    }

    sectionDoubleBenefice.classList.add('double-benef-3d');

    const observateurDoubleBenefice = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                sectionDoubleBenefice.classList.add('double-benef-in-view');
            } else {
                sectionDoubleBenefice.classList.remove('double-benef-in-view');
            }
        });
    }, {
        threshold: 0.35
    });

    observateurDoubleBenefice.observe(sectionDoubleBenefice);
}

function remettreDoubleBeneficeCommeAvant() {
    const sectionDoubleBenefice = document.querySelector('.double-benef-section');

    if (!sectionDoubleBenefice) {
        return;
    }

    sectionDoubleBenefice.classList.remove('double-benef-3d');
    sectionDoubleBenefice.classList.remove('double-benef-in-view');
}

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
initialiserAnimationDoubleBenefice();
initialiserCommandeResetMockup();

// ===== 3) Header au scroll =====
// Cache le header quand on descend, le remonte quand on monte.
function initialiserHeaderAuScroll() {
    const entete = document.querySelector('.header');
    const racineDocument = document.documentElement;
    const blocSommaireDocumentation = document.querySelector('.sommaire-documentation');

    if (!entete) {
        return;
    }

    function ajusterEspaceHeader(estVisible) {
        const hauteurHeader = entete.offsetHeight;
        const hauteurSommaire = blocSommaireDocumentation ? blocSommaireDocumentation.offsetHeight : 0;

        // Si le header est cache, on ne garde plus son espace en haut.
        const espaceHaut = (estVisible ? hauteurHeader : 0) + hauteurSommaire;

        document.body.style.paddingTop = `${espaceHaut}px`;
        racineDocument.style.setProperty('--header-height', `${entete.offsetHeight}px`);
        racineDocument.style.setProperty('--sommaire-height', `${hauteurSommaire}px`);
        const offsetHeader = estVisible ? `${entete.offsetHeight}px` : '0px';
        racineDocument.style.setProperty('--header-offset', offsetHeader);
    }

    entete.classList.remove('header-hidden');
    ajusterEspaceHeader(true);

    window.addEventListener('resize', () => {
        const headerVisible = !entete.classList.contains('header-hidden');
        ajusterEspaceHeader(headerVisible);
    });

    window.addEventListener('scroll', () => {
        const scrollActuelY = window.scrollY;

        // Regle simple demandee:
        // - en haut de page: header visible
        // - sinon: header cache
        if (scrollActuelY <= 10) {
            entete.classList.remove('header-hidden');
            ajusterEspaceHeader(true);
            return;
        }

        entete.classList.add('header-hidden');
        ajusterEspaceHeader(false);
    }, { passive: true });
}

initialiserHeaderAuScroll();

// ===== 4) Animation section communaute au scroll =====
// Quand la section arrive a l'ecran:
// - le texte vient de la gauche
// - la photo vient de la droite
function initialiserAnimationCommunaute() {
    const sectionCommunaute = document.querySelector('.bloc-communaute');
    const blocTexte = document.querySelector('.texte-communaute');
    const blocImage = document.querySelector('.image-communaute');

    if (!sectionCommunaute || !blocTexte || !blocImage) {
        return;
    }

    // On prepare les classes de depart (cachees + decalees).
    blocTexte.classList.add('anim-gauche');
    blocImage.classList.add('anim-droite');

    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                blocTexte.classList.add('visible');
                blocImage.classList.add('visible');
            } else {
                // Quand on quitte la section, on remet l'etat initial.
                // Ainsi, l'animation se rejoue a la prochaine entree.
                blocTexte.classList.remove('visible');
                blocImage.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.25
    });

    observateur.observe(sectionCommunaute);
}

initialiserAnimationCommunaute();

// ===== 5) Carrousel partenaires automatique =====
// Ici, les logos sont deja dupliques dans le HTML (2 series identiques).
// On calcule juste la distance d'une serie pour avoir une boucle continue.
function activerCarrouselPartenairesAncien() {
    const listePartenaires = document.querySelector('.liste-partenaires');

    if (!listePartenaires) {
        return;
    }

    // On force le mode dynamique JS (comportement d'origine).
    listePartenaires.classList.add('mode-js');

    // Evite de relancer l'initialisation plusieurs fois.
    if (listePartenaires.dataset.carouselPret === 'oui') {
        return;
    }

    const tousLesLogos = Array.from(listePartenaires.querySelectorAll('img'));

    if (tousLesLogos.length < 2) {
        return;
    }

    // On considere que la 1re moitie est la serie de reference.
    const nombreLogosSerie = Math.floor(tousLesLogos.length / 2);
    const logosSerie = tousLesLogos.slice(0, nombreLogosSerie);

    const appliquerDistanceDefilement = () => {
        const stylesListe = window.getComputedStyle(listePartenaires);
        const gapHorizontal = parseFloat(stylesListe.columnGap || stylesListe.gap || '0') || 0;

        const largeurSerie = logosSerie.reduce((total, logo) => {
            return total + logo.getBoundingClientRect().width;
        }, 0) + (gapHorizontal * logosSerie.length);

        listePartenaires.style.setProperty('--defilement-distance', `${largeurSerie}px`);
    };

    appliquerDistanceDefilement();

    // Active le style carrousel dans le CSS.
    listePartenaires.classList.add('is-carousel');
    listePartenaires.dataset.carouselPret = 'oui';

    // Si la taille change (responsive), on recalcule la distance.
    window.addEventListener('resize', () => {
        appliquerDistanceDefilement();
    });
}

// ===== 6) Apparition des sections au scroll =====
// On cache les sections puis elles apparaissent quand elles entrent dans l'ecran.
function initialiserApparitionSections() {
    const sections = document.querySelectorAll('main > section:not(.bloc-partenaires)');

    if (!sections.length) {
        return;
    }

    sections.forEach((section) => {
        section.classList.add('section-cachee');
    });

    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                entree.target.classList.add('section-visible');
                observateur.unobserve(entree.target);
            }
        });
    }, {
        threshold: 0.15
    });

    sections.forEach((section) => {
        observateur.observe(section);
    });
}

initialiserApparitionSections();

// ===== 7) Compteur anime pour les chiffres =====
// Les chiffres montent de 0 jusqu'a leur valeur finale une seule fois.
function initialiserCompteurChiffres() {
    const blocChiffres = document.querySelector('.bloc-chiffres');
    const elementsChiffres = document.querySelectorAll('.chiffre-valeur');

    if (!blocChiffres || !elementsChiffres.length) {
        return;
    }

    function afficherChiffreAvecSpans(element, texteFinal) {
        element.textContent = '';

        texteFinal.split('').forEach((caractere) => {
            const span = document.createElement('span');
            span.className = 'chiffre-digit';
            span.textContent = caractere;
            element.appendChild(span);
        });
    }

    function animerUnChiffre(element, valeurCible, suffixe) {
        const duree = 1200;
        const debut = performance.now();

        function etape(tempsActuel) {
            const progression = Math.min((tempsActuel - debut) / duree, 1);
            const valeurActuelle = Math.floor(progression * valeurCible);

            element.textContent = `${valeurActuelle}${suffixe}`;

            if (progression < 1) {
                requestAnimationFrame(etape);
            } else {
                afficherChiffreAvecSpans(element, `${valeurCible}${suffixe}`);
            }
        }

        requestAnimationFrame(etape);
    }

    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (!entree.isIntersecting) {
                return;
            }

            elementsChiffres.forEach((element) => {
                const valeurCible = Number(element.dataset.cible || '0');
                const suffixe = element.dataset.suffix || '';
                animerUnChiffre(element, valeurCible, suffixe);
            });

            observateur.unobserve(blocChiffres);
        });
    }, {
        threshold: 0.35
    });

    observateur.observe(blocChiffres);
}

initialiserCompteurChiffres();

// ===== 8) Bouton retour en haut =====
// Le bouton apparait apres un petit scroll puis remonte la page en douceur.
function initialiserBoutonRetourHaut() {
    const boutonRetourHaut = document.getElementById('bouton-retour-haut');

    if (!boutonRetourHaut) {
        return;
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            boutonRetourHaut.classList.add('visible');
        } else {
            boutonRetourHaut.classList.remove('visible');
        }
    }, { passive: true });

    boutonRetourHaut.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

initialiserBoutonRetourHaut();
