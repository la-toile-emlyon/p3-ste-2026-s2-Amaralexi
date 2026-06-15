const card = document.getElementById('avis-card');
const quoteEl = document.getElementById('avis-quote');
const starsEl = document.getElementById('avis-stars');
const textEl = document.getElementById('avis-text');
const avatarEl = document.getElementById('avis-avatar');
const nameEl = document.getElementById('avis-name');
const ageEl = document.getElementById('avis-age');

let comments = [];
let currentIndex = 0;
const SWITCH_DELAY = 5000;
const ANIMATION_DELAY = 450;

function buildStars(rating) {
	const safeRating = Number.isFinite(rating) ? rating : 5;
	return '★'.repeat(Math.max(0, Math.min(5, safeRating)));
}

function applyComment(comment) {
	const quoteColor = comment.quoteColor === 'orange' ? 'orange' : 'green';
	const avatarPath = comment.avatar ? comment.avatar : 'asset/photo claire.png';

	quoteEl.classList.toggle('orange', quoteColor === 'orange');
	quoteEl.textContent = '“';
	starsEl.textContent = buildStars(comment.rating);
	textEl.textContent = comment.text;
	avatarEl.src = avatarPath;
	avatarEl.alt = `Photo de ${comment.author}`;
	nameEl.textContent = comment.author;
	ageEl.textContent = `${comment.age} ans`;
}

function showNextComment() {
	if (!comments.length || !card) {
		return;
	}

	card.classList.remove('fade-in-right');
	card.classList.add('fade-out-left');

	setTimeout(() => {
		currentIndex = (currentIndex + 1) % comments.length;
		applyComment(comments[currentIndex]);

		card.classList.remove('fade-out-left');
		card.classList.add('fade-in-right');

		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				card.classList.remove('fade-in-right');
			});
		});
	}, ANIMATION_DELAY);
}

async function initReviews() {
	if (!card || !textEl) {
		return;
	}

	try {
		const response = await fetch('json/data.json');
		const data = await response.json();

		comments = Array.isArray(data.comments) ? data.comments : [];

		if (!comments.length) {
			textEl.textContent = 'Aucun commentaire disponible pour le moment.';
			return;
		}

		applyComment(comments[0]);
		setInterval(showNextComment, SWITCH_DELAY);
	} catch (error) {
		textEl.textContent = 'Impossible de charger les commentaires pour le moment.';
		console.error('Erreur chargement commentaires:', error);
	}
}

initReviews();
