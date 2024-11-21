const apiUrl = 'http://localhost:3000/ingredient';
var ingredientSelected = [];

async function fetchIngredients() {
    document.querySelector('.ingredient_list').innerHTML = "";
    try {
        const response = await fetch(apiUrl);
        const ingredients = await response.json();
        
        const ingredientList = document.querySelector('.ingredient_list');
        ingredients.forEach(ingredient => {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.className = 'ingredient';
            ingredientDiv.innerHTML = `Nom: ${ingredient.name} <button onclick="ajouter(${ingredient.id}, '${ingredient.name}')">Ajouter</button>`;
            ingredientList.appendChild(ingredientDiv);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des ingrédients:', error);
    }
}

function ajouter(id, name) {
    if (ingredientSelected.includes(id)) {
        alert(`L'ingrédient ${name} est déjà sélectionné.`);
        return; // Ne pas ajouter l'ingrédient si déjà sélectionné
    }

    ingredientSelected.push(id);
    console.log(ingredientSelected);

    const ingredientDiv = document.createElement('div');
    ingredientDiv.className = 'ingredient-add';
    ingredientDiv.id = `ingredient-${id}`;
    ingredientDiv.innerHTML = `Nom: ${name} <button onclick="supprimer(${id})">Supprimer</button>`;
    
    document.getElementById('ingredient-selected').appendChild(ingredientDiv);

    searchCocktail(ingredientSelected);
}

function supprimer(id) {
    ingredientSelected = ingredientSelected.filter(ingredientId => ingredientId !== id);
    console.log(ingredientSelected);

    const ingredientDiv = document.getElementById(`ingredient-${id}`);
    if (ingredientDiv) {
        ingredientDiv.remove();
    }

    searchCocktail(ingredientSelected);
}

function searchIngredient() {
    const searchValue = document.getElementById('search-input').value;
    const searchApiUrl = `http://localhost:3000/ingredient/search?name=${encodeURIComponent(searchValue)}`;

    fetch(searchApiUrl)
    .then(response => response.json())
    .then(ingredients => {
        const ingredientList = document.querySelector('.ingredient_list');
        ingredientList.innerHTML = ''; // Vider la liste actuelle

        ingredients.forEach(ingredient => {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.className = 'ingredient';
            ingredientDiv.innerHTML = `Nom: ${ingredient.name} <button onclick="ajouter(${ingredient.id}, '${ingredient.name}')">Ajouter</button>`;
            ingredientList.appendChild(ingredientDiv);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la recherche des ingrédients:', error);
    });
}

function searchCocktail(id) {
    const apiUrl = 'http://localhost:3000/cocktails/searchbyingredients?ingredients=' + id;
    fetch(apiUrl)
    .then(response => response.json())
    .then(cocktails => {
        const cocktailList = document.getElementById('cocktail-list');
        cocktailList.innerHTML = ''; 

        cocktails.forEach(cocktail => {
            const cocktailDiv = document.createElement('div');
            cocktailDiv.className = 'cocktail';
            cocktailDiv.textContent = `ID: ${cocktail.cocktailId} Nom: ${cocktail.cocktailName}, Ingrédients: ${cocktail.ingredientNames}`;
            cocktailList.appendChild(cocktailDiv);

            cocktailDiv.onclick = () => {
                localStorage.setItem('selectedCocktailId', cocktail.cocktailId); // Stocke l'ID dans localStorage
                window.location.href = 'page2.html'; // Redirige vers la page 2
            };
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération des cocktails:', error);
    });
}

window.onload = fetchIngredients;