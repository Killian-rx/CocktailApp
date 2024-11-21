// URL de votre API
const apiUrl = 'http://localhost:3000/cocktails/search/';

// Fonction pour récupérer les utilisateurs
async function fetchcocktails() {
    //efacer les anciens cocktails
    document.getElementById('cocktail-list').innerHTML = "";

    var param= document.querySelector('input').value;
    if (param == ""){
        param = "all";
    }

    try {
        const response = await fetch(apiUrl+param);
        const cocktails = await response.json();
        
        // Afficher les utilisateurs
        const cocktailList = document.getElementById('cocktail-list');
        cocktails.forEach(cocktail => {
            const cocktailDiv = document.createElement('div');
            cocktailDiv.className = 'cocktail';
            cocktailDiv.textContent = `ID: ${cocktail.id}, Nom: ${cocktail.name}, instructions: ${cocktail.instructions}`;
            cocktailList.appendChild(cocktailDiv);

    
            cocktailDiv.onclick = () => {
                localStorage.setItem('selectedCocktailId', cocktail.id); // Stocke l'ID dans localStorage
                window.location.href = 'page2.html'; // Redirige vers la page 2
            };
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
}

// Appeler la fonction au chargement de la page
fetchcocktails();