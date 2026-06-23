 AOS.init();

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

// ===== 9) Header documentation au scroll =====
// Le header se cache en descendant, puis revient apres une vraie remontee.
function initialiserHeaderDocumentationAuScroll() {
    const entete = document.querySelector('.header');
    const blocSommaireDocumentation = document.querySelector('.sommaire-documentation');
    const racineDocument = document.documentElement;

    if (!entete || !blocSommaireDocumentation) {
        return;
    }

    const CONFIG_SCROLL_HEADER_DOC = {
        seuilHautPage: 10,
        seuilMouvement: 10,
        seuilReapparition: 440,
        delaiReapparitionMs: 300,
    };

    function ajusterEspaceHeaderDocumentation(estVisible) {
        const hauteurHeader = entete.offsetHeight;
        const hauteurSommaire = blocSommaireDocumentation.offsetHeight;
        const positionHeader = window.getComputedStyle(entete).position;
        const headerEstFixe = positionHeader === 'fixed';
        const espaceHeaderReserve = headerEstFixe ? (estVisible ? hauteurHeader : 0) : 0;
        const espaceSommaireReserve = estVisible ? 0 : hauteurSommaire;

        document.body.style.paddingTop = `${espaceHeaderReserve + espaceSommaireReserve}px`;
        racineDocument.style.setProperty('--header-height', `${hauteurHeader}px`);
        racineDocument.style.setProperty('--sommaire-height', `${hauteurSommaire}px`);
        racineDocument.style.setProperty('--header-offset', estVisible ? `${hauteurHeader}px` : '0px');
    }

    entete.classList.remove('header-hidden');
    ajusterEspaceHeaderDocumentation(true);

    let dernierePositionY = window.scrollY;
    let distanceRemonteeCumulee = 0;
    let debutRemonteeTimestamp = null;

    window.addEventListener('resize', () => {
        const headerVisible = !entete.classList.contains('header-hidden');
        ajusterEspaceHeaderDocumentation(headerVisible);
    });

    window.addEventListener('scroll', () => {
        const scrollActuelY = Math.max(0, window.scrollY);
        const variationScroll = scrollActuelY - dernierePositionY;

        if (scrollActuelY <= CONFIG_SCROLL_HEADER_DOC.seuilHautPage) {
            entete.classList.remove('header-hidden');
            ajusterEspaceHeaderDocumentation(true);
            distanceRemonteeCumulee = 0;
            debutRemonteeTimestamp = null;
            dernierePositionY = scrollActuelY;
            return;
        }

        if (Math.abs(variationScroll) < CONFIG_SCROLL_HEADER_DOC.seuilMouvement) {
            return;
        }

        if (variationScroll > 0) {
            entete.classList.add('header-hidden');
            ajusterEspaceHeaderDocumentation(false);
            distanceRemonteeCumulee = 0;
            debutRemonteeTimestamp = null;
        } else {
            if (debutRemonteeTimestamp === null) {
                debutRemonteeTimestamp = performance.now();
            }

            distanceRemonteeCumulee += Math.abs(variationScroll);
            const dureeRemontee = performance.now() - debutRemonteeTimestamp;

            if (
                distanceRemonteeCumulee >= CONFIG_SCROLL_HEADER_DOC.seuilReapparition
                && dureeRemontee >= CONFIG_SCROLL_HEADER_DOC.delaiReapparitionMs
            ) {
                entete.classList.remove('header-hidden');
                ajusterEspaceHeaderDocumentation(true);
                distanceRemonteeCumulee = 0;
                debutRemonteeTimestamp = null;
            }
        }

        dernierePositionY = scrollActuelY;
    }, { passive: true });
}

initialiserHeaderDocumentationAuScroll();
