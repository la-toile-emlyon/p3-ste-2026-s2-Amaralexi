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
const IMAGE_ETOILES = 'asset/etoiles.png';

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
// initialiserAnimationDoubleBenefice();  // Animation désactivée
initialiserCommandeResetMockup();

// ===== 3) Header au scroll =====
// Cache le header quand on descend, le remonte quand on monte.
function initialiserHeaderAuScroll() {
    const entete = document.querySelector('.header');
    const racineDocument = document.documentElement;
    const blocSommaireDocumentation = document.querySelector('.sommaire-documentation');
    // Reglages rapides du header au scroll (tu peux ajuster ici directement)
    const CONFIG_SCROLL_HEADER = {
        seuilHautPage: 10,
        seuilMouvement: 10,
        // Plus la valeur est grande, plus il faut remonter avant que le header revienne.
        seuilReapparition: 150,
        // Plus la valeur est grande, plus il attend avant de reapparaitre.
        delaiReapparitionMs: 150,
    };

    if (!entete) {
        return;
    }

    // La page documentation gere son header dans document.js.
    if (blocSommaireDocumentation) {
        return;
    }

    function ajusterEspaceHeader(estVisible) {
        const hauteurHeader = entete.offsetHeight;
        const positionHeader = window.getComputedStyle(entete).position;
        const headerEstFixe = positionHeader === 'fixed';

        // Avec un header sticky, il ne faut pas ajouter son espace dans le body,
        // sinon cela cree un vide inutile en haut de page.
        const espaceHeaderReserve = headerEstFixe ? (estVisible ? hauteurHeader : 0) : 0;
        const espaceHaut = espaceHeaderReserve;

        document.body.style.paddingTop = `${espaceHaut}px`;
        racineDocument.style.setProperty('--header-height', `${entete.offsetHeight}px`);
        const offsetHeader = estVisible ? `${entete.offsetHeight}px` : '0px';
        racineDocument.style.setProperty('--header-offset', offsetHeader);
    }

    entete.classList.remove('header-hidden');
    ajusterEspaceHeader(true);

    let dernierePositionY = window.scrollY;
    let distanceRemonteeCumulee = 0;
    let debutRemonteeTimestamp = null;

    window.addEventListener('resize', () => {
        const headerVisible = !entete.classList.contains('header-hidden');
        ajusterEspaceHeader(headerVisible);
    });

    window.addEventListener('scroll', () => {
        const scrollActuelY = Math.max(0, window.scrollY);
        const variationScroll = scrollActuelY - dernierePositionY;

        if (scrollActuelY <= CONFIG_SCROLL_HEADER.seuilHautPage) {
            entete.classList.remove('header-hidden');
            ajusterEspaceHeader(true);
            distanceRemonteeCumulee = 0;
            debutRemonteeTimestamp = null;
            dernierePositionY = scrollActuelY;
            return;
        }

        // Evite les micro variations qui provoquent des clignotements.
        if (Math.abs(variationScroll) < CONFIG_SCROLL_HEADER.seuilMouvement) {
            return;
        }

        if (variationScroll > 0) {
            // On descend: on cache le header.
            entete.classList.add('header-hidden');
            ajusterEspaceHeader(false);
            distanceRemonteeCumulee = 0;
            debutRemonteeTimestamp = null;
        } else {
            // On remonte: on attend une vraie remontee avant de reafficher le header.
            if (debutRemonteeTimestamp === null) {
                debutRemonteeTimestamp = performance.now();
            }

            distanceRemonteeCumulee += Math.abs(variationScroll);
            const dureeRemontee = performance.now() - debutRemonteeTimestamp;

            if (distanceRemonteeCumulee >= CONFIG_SCROLL_HEADER.seuilReapparition && dureeRemontee >= CONFIG_SCROLL_HEADER.delaiReapparitionMs) {
                entete.classList.remove('header-hidden');
                ajusterEspaceHeader(true);
                distanceRemonteeCumulee = 0;
                debutRemonteeTimestamp = null;
            }
        }

        dernierePositionY = scrollActuelY;
    }, { passive: true });
}

initialiserHeaderAuScroll();

/*
function testheader(){
    const h = document.querySelector('.header');
    document.addEventListener('mousewheel', (e) => {
        console.log(e.deltaY);
        if(e.deltaY < 0) {
            h.classList.remove('header-hidden');
        }else{
            h.classList.add('header-hidden');
        }

    })

}
testheader();
*/

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

// ===== 4b) Animation section double benefice au scroll =====
// Utilise la meme animation que communaute : gauche/droite
function initialiserAnimationDoubleBenefice() {
    const sectionDoubleBenef = document.querySelector('.benefits-grid.anim-double-benef');
    const cardUsers = document.querySelector('.benefit-users.anim-gauche');
    const cardShops = document.querySelector('.benefit-shops.anim-droite');

    if (!sectionDoubleBenef || !cardUsers || !cardShops) {
        return;
    }

    const observateur = new IntersectionObserver((entrees) => {
        entrees.forEach((entree) => {
            if (entree.isIntersecting) {
                cardUsers.classList.add('visible');
                cardShops.classList.add('visible');
            } else {
                cardUsers.classList.remove('visible');
                cardShops.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.25
    });

    observateur.observe(sectionDoubleBenef);
}

initialiserAnimationDoubleBenefice();
// Ici, les logos sont deja dupliques dans le HTML (2 series identiques).
// On calcule juste la distance d'une serie pour avoir une boucle continue.
function activerCarrouselPartenairesAncien() {
    const listePartenaires = document.querySelector('.liste-partenaires');

    if (!listePartenaires) {
        return;
    }

    // Evite de relancer l'initialisation plusieurs fois.
    if (listePartenaires.dataset.carouselPret === 'oui') {
        return;
    }

    const tousLesLogos = Array.from(listePartenaires.querySelectorAll('img'));

    if (tousLesLogos.length < 2) {
        return;
    }

    // On considere que la 1re serie est la serie de reference (sur 3 series totales).
    const nombreLogosSerie = Math.floor(tousLesLogos.length / 3);
    const logosSerie = tousLesLogos.slice(0, nombreLogosSerie);

    const appliquerDistanceDefilement = () => {
        // Avec 3 séries de logos, divise par 3 pour avoir la distance correcte
        const distanceReelle = listePartenaires.scrollWidth / 3;

        listePartenaires.style.setProperty('--defilement-distance', `${distanceReelle}px`);
    };

    const activerModeCarrousel = () => {
        // On bascule en mode JS seulement quand les tailles sont fiables.
        listePartenaires.classList.add('mode-js');
        // Petit délai pour s'assurer que le rendu est stable
        setTimeout(() => {
            appliquerDistanceDefilement();
            listePartenaires.classList.add('is-carousel');
            listePartenaires.dataset.carouselPret = 'oui';
        }, 50);
    };

    const imagesSerieNonChargees = logosSerie.filter((logo) => !logo.complete);

    if (!imagesSerieNonChargees.length) {
        activerModeCarrousel();
    } else {
        let imagesRestantes = imagesSerieNonChargees.length;

        const gererFinChargement = () => {
            imagesRestantes -= 1;

            if (imagesRestantes <= 0) {
                // Délai supplémentaire après le chargement pour stabiliser les dimensions.
                setTimeout(() => {
                    activerModeCarrousel();
                }, 100);
            }
        };

        imagesSerieNonChargees.forEach((logo) => {
            logo.addEventListener('load', gererFinChargement, { once: true });
            logo.addEventListener('error', gererFinChargement, { once: true });
        });
    }

    // Si la taille change (responsive), on recalcule la distance.
    window.addEventListener('resize', () => {
        appliquerDistanceDefilement();
    });
}

activerCarrouselPartenairesAncien();

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

