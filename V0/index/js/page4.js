const apiUrl = 'http://localhost:3000/matchs';
let rejectedMatches = [];
let currentMatch = null; // Déclaration de currentMatch à l'échelle globale

async function fetchMatchs() {
    console.log(apiUrl + '?rejected=' + rejectedMatches.join(','));
    try {
        // Envoyer rejectedMatches comme paramètre de requête
        const response = await fetch(`${apiUrl}?rejected=${rejectedMatches.join(',')}`);
        
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des matchs');
        }
        currentMatch = await response.json(); // Mettre à jour currentMatch
        displayMatch(currentMatch);
    } catch (error) {
        console.error('Erreur lors de la récupération des matchs:', error);
    }
}

function displayMatch(match) {
    const matchDiv = document.querySelector('.match');
    matchDiv.querySelector('.nom').textContent = match.name;
    if (match.name != "Aucun cocktail disponible"){
        
        // Itérer sur les ingrédients et les afficher
        const ingredientsList = match.ingredients.map(ingredient => {
            return `${ingredient.name}: ${ingredient.quantity} ${ingredient.unit || ''}`.trim();
        }).join(', ');

        matchDiv.querySelector('.ingredients').textContent = ingredientsList;
    }
    else{
        matchDiv.querySelector('.ingredients').textContent = "";
    }
}

function skip() {
    // Ajouter l'ID du match actuel aux refusés et rechercher un nouveau match
    if (currentMatch && currentMatch.id) {
        rejectedMatches.push(currentMatch.id);
    }
    fetchMatchs();
}

function Make() {
    // Ajouter l'ID du match actuel aux refusés et rechercher un nouveau match
    if (currentMatch && currentMatch.id) {
        localStorage.setItem('selectedCocktailId', currentMatch.id); // Stocke l'ID dans localStorage
        window.location.href = 'page2.html'; // Redirige vers la page 2
    }
}

// Initialisation au chargement de la page
window.onload = fetchMatchs;