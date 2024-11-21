// URL de votre API
const apiUrl = 'http://localhost:3000/cocktail-ingredients-'+ localStorage.getItem('selectedCocktailId');

async function fetchIngredients() {
    try {
        const response = await fetch(apiUrl);
        const ingredients = await response.json();
        
        const ingredientsList = document.getElementById('ingrdients-list');
        ingredients.forEach(ingredient => {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.className = 'ingredient';
            ingredientDiv.textContent = `Nom: ${ingredient.ingredientName}, Type: ${ingredient.type}, Quantité: ${ingredient.quantity} ${ingredient.unit}`;
            ingredientsList.appendChild(ingredientDiv);
        });

        const cocktailName = document.getElementById('cocktail-name');
        cocktailName.textContent = `Nom du cocktail: ${ingredients[0].cocktailName}`;

        const cocktailInstructions = document.getElementById('cocktail-instructions');
        cocktailInstructions.textContent = `Instructions: ${ingredients[0].instructions}`;

        const cocktailGarniture = document.getElementById('cocktail-garniture');
        cocktailGarniture.textContent = `Garniture: ${ingredients[0].garnish}`;
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
}

fetchIngredients();