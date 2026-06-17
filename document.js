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
