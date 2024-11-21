const express = require('express'); 
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base de données SQLite
const db = new sqlite3.Database('./BSD/api.db', (err) => { 
    if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données :', err.message);
    } else {
        console.log('Connecté à la base de données SQLite.');
    }
});

// Configuration de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Cocktails API',
            version: '1.0.0',
            description: 'API pour récupérer des cocktails et leurs ingrédients',
        },
    },
    apis: ['./api.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /cocktails/search/{name}:
 *   get:
 *     summary: Recherche des cocktails par nom
 *     description: Renvoie une liste de cocktails dont le nom commence par le paramètre spécifié. Si "all" est passé comme nom, renvoie tous les cocktails.
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: Nom du cocktail à rechercher ou "all" pour obtenir tous les cocktails
 *         schema:
 *           type: string
 *           example: "Margarita"
 *     responses:
 *       200:
 *         description: Liste des cocktails trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID unique du cocktail
 *                   name:
 *                     type: string
 *                     description: Nom du cocktail
 *                   glass_type:
 *                     type: string
 *                     description: Type de verre utilisé pour le cocktail
 *                   garnish:
 *                     type: string
 *                     description: Garniture du cocktail
 *                   instructions:
 *                     type: string
 *                     description: Instructions de préparation du cocktail
 *                   alcoholic:
 *                     type: boolean
 *                     description: Indique si le cocktail contient de l'alcool
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Date et heure de création du cocktail
 *       500:
 *         description: Erreur du serveur lors de la recherche des cocktails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 */

// Recherche des cocktails par nom
app.get('/cocktails/search/:name', (req, res) => {
    const cocktailName = req.params.name;
    const query = cocktailName === 'all' 
        ? 'SELECT * FROM cocktails' 
        : 'SELECT * FROM cocktails WHERE "name" LIKE ?';
    const param = cocktailName === 'all' ? [] : [`${cocktailName}%`];

    db.all(query, param, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /ingredient:
 *   get:
 *     summary: Récupère tous les ingrédients
 *     description: Renvoie la liste complète des ingrédients disponibles dans la base de données.
 *     responses:
 *       200:
 *         description: Liste des ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID unique de l'ingrédient
 *                   name:
 *                     type: string
 *                     description: Nom de l'ingrédient
 *                   type:
 *                     type: string
 *                     description: Type de l'ingrédient
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Date et heure de création de l'ingrédient
 *       500:
 *         description: Erreur du serveur lors de la récupération des ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 */

// Sortie de tout les ingredients
app.get('/ingredient', (req, res) => {
    db.all('SELECT * FROM ingredient', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


/**
 * @swagger
 * /cocktail-ingredients-{id}:
 *   get:
 *     summary: Récupère les ingrédients d'un cocktail
 *     description: Retourne les informations d'un cocktail et ses ingrédients associés en fonction de l'ID du cocktail.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID du cocktail pour lequel récupérer les ingrédients
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Détails du cocktail et liste des ingrédients associés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cocktailName:
 *                     type: string
 *                     description: Nom du cocktail
 *                   ingredientName:
 *                     type: string
 *                     description: Nom de l'ingrédient
 *                   type:
 *                     type: string
 *                     description: Type de l'ingrédient
 *                   quantity:
 *                     type: number
 *                     description: Quantité de l'ingrédient utilisée dans le cocktail
 *                   unit:
 *                     type: string
 *                     description: Unité de mesure de l'ingrédient
 *                   glass_type:
 *                     type: string
 *                     description: Type de verre utilisé pour le cocktail
 *                   garnish:
 *                     type: string
 *                     description: Garniture du cocktail
 *                   instructions:
 *                     type: string
 *                     description: Instructions pour préparer le cocktail
 *       500:
 *         description: Erreur du serveur lors de la récupération des ingrédients du cocktail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 */

// recherche des cocktails par ID
app.get('/cocktail-ingredients-:id', (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT cocktails.name AS cocktailName, 
               ingredient.name AS ingredientName, 
               ingredient.type, 
               cocktail_ingredient.quantity, 
               cocktail_ingredient.unit, 
               cocktails.glass_type, 
               cocktails.garnish, 
               cocktails.instructions  
        FROM cocktail_ingredient 
        JOIN cocktails ON cocktail_ingredient.cocktail_id = cocktails.id
        JOIN ingredient ON cocktail_ingredient.ingredient_id = ingredient.id
        WHERE cocktail_ingredient.cocktail_id = ?
    `;
    db.all(query, [id], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
}); 

/**
 * @swagger
 * /cocktails/searchbyingredients:
 *   get:
 *     summary: Recherche des cocktails par ingrédients
 *     description: Renvoie une liste de cocktails qui contiennent les ingrédients spécifiés, triée par le nombre d'ingrédients communs.
 *     parameters:
 *       - name: ingredients
 *         in: query
 *         required: true
 *         description: Liste des noms d'ingrédients, séparés par des virgules, à rechercher dans les cocktails
 *         schema:
 *           type: string
 *           example: "rum,lime,sugar"
 *     responses:
 *       200:
 *         description: Liste des cocktails correspondants avec leurs détails
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   cocktailId:
 *                     type: integer
 *                     description: ID unique du cocktail
 *                   cocktailName:
 *                     type: string
 *                     description: Nom du cocktail
 *                   commonIngredientCount:
 *                     type: integer
 *                     description: Nombre d'ingrédients communs avec la recherche
 *                   ingredientNames:
 *                     type: string
 *                     description: Liste des ingrédients du cocktail trouvés dans la recherche
 *                   glass_type:
 *                     type: string
 *                     description: Type de verre utilisé pour le cocktail
 *                   garnish:
 *                     type: string
 *                     description: Garniture du cocktail
 *                   instructions:
 *                     type: string
 *                     description: Instructions de préparation du cocktail
 *       500:
 *         description: Erreur du serveur lors de la recherche des cocktails par ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 */

// Recherche des cocktails par ingrédients
app.get('/cocktails/searchbyingredients', (req, res) => {

    // Récupérer les ingrédients depuis la requête et les transformer en tableau
    const ingredientNames = req.query.ingredients.split(',').map(ingredient => ingredient.trim());
    console.log(ingredientNames);

    // Construction des placeholders pour la requête SQL
    const placeholders = ingredientNames.map(() => '?').join(',');

    // Requête SQL pour trouver les cocktails contenant les ingrédients spécifiés
    const query = `
        SELECT cocktails.id AS cocktailId,
               cocktails.name AS cocktailName, 
               COUNT(cocktail_ingredient.ingredient_id) AS commonIngredientCount,
               GROUP_CONCAT(ingredient.name) AS ingredientNames,
               cocktails.glass_type, 
               cocktails.garnish, 
               cocktails.instructions  
        FROM cocktails
        JOIN cocktail_ingredient ON cocktails.id = cocktail_ingredient.cocktail_id
        JOIN ingredient ON cocktail_ingredient.ingredient_id = ingredient.id
        WHERE ingredient.id IN (${placeholders})
        GROUP BY cocktails.id
        ORDER BY commonIngredientCount DESC
    `;
    
    // Exécution de la requête SQL
    db.all(query, ingredientNames, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

/**
 * @swagger
 * /ingredient/search:
 *   get:
 *     summary: Recherche d'ingrédients par nom
 *     description: Renvoie une liste d'ingrédients dont le nom contient le paramètre spécifié. Si aucun nom n'est fourni, retourne tous les ingrédients.
 *     parameters:
 *       - name: name
 *         in: query
 *         required: false
 *         description: Nom ou partie du nom de l'ingrédient à rechercher
 *         schema:
 *           type: string
 *           example: "mint"
 *     responses:
 *       200:
 *         description: Liste des ingrédients trouvés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID unique de l'ingrédient
 *                   name:
 *                     type: string
 *                     description: Nom de l'ingrédient
 *                   type:
 *                     type: string
 *                     description: Type de l'ingrédient
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Date et heure de création de l'ingrédient
 *       500:
 *         description: Erreur du serveur lors de la recherche d'ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 */

// Recherche des ingrédients par nom
app.get('/ingredient/search', (req, res) => {
    const name = req.query.name;
    // Construction de la requête SQL avec une condition en fonction de `name`
    const query = name ? `SELECT * FROM ingredient WHERE name LIKE ?` : `SELECT * FROM ingredient`;
    const params = name ? [`%${name}%`] : [];

    db.all(query, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});


/**
 * @swagger
 * /matchs:
 *   get:
 *     summary: Récupère un cocktail alcoolisé aléatoire en excluant les cocktails rejetés
 *     description: Retourne un cocktail alcoolisé aléatoire avec ses ingrédients, en excluant ceux dont les IDs sont spécifiés dans le paramètre `rejected`.
 *     parameters:
 *       - name: rejected
 *         in: query
 *         required: false
 *         description: Liste des IDs des cocktails à exclure de la sélection, séparés par des virgules
 *         schema:
 *           type: string
 *           example: "1,3,5"
 *     responses:
 *       200:
 *         description: Détails d'un cocktail alcoolisé aléatoire et liste de ses ingrédients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID unique du cocktail
 *                 name:
 *                   type: string
 *                   description: Nom du cocktail
 *                 ingredients:
 *                   type: array
 *                   description: Liste des ingrédients du cocktail
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nom de l'ingrédient
 *                       quantity:
 *                         type: number
 *                         description: Quantité de l'ingrédient
 *                       unit:
 *                         type: string
 *                         description: Unité de mesure de l'ingrédient
 *       404:
 *         description: Aucun cocktail disponible
 *       500:
 *         description: Erreur du serveur lors de la récupération des cocktails
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message d'erreur
 */

// generate random cocktail pour les matchs
app.get('/matchs', (req, res) => {
    const rejected = req.query.rejected ? req.query.rejected.split(',').map(Number) : [];

    // Requête SQL pour sélectionner tous les cocktails alcoolisés en excluant les rejetés
    let cocktailQuery = `SELECT id, name FROM cocktails`;
    if (rejected.length > 0) {
        const placeholders = rejected.map(() => '?').join(',');
        cocktailQuery += ` WHERE id NOT IN (${placeholders})`;
    }

    db.all(cocktailQuery, rejected, (err, cocktails) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        if (cocktails.length === 0) {
            return res.json({
                id: "0",
                name: "Aucun cocktail disponible",
            });
        }
        

        // Sélectionner un cocktail aléatoirement parmi ceux restants
        const randomCocktail = cocktails[Math.floor(Math.random() * cocktails.length)];
        const ingredientQuery = `
            SELECT ingredient.name, cocktail_ingredient.quantity, cocktail_ingredient.unit
            FROM cocktail_ingredient
            JOIN ingredient ON cocktail_ingredient.ingredient_id = ingredient.id
            WHERE cocktail_ingredient.cocktail_id = ?
        `;

        db.all(ingredientQuery, [randomCocktail.id], (err, ingredients) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                id: randomCocktail.id,
                name: randomCocktail.name,
                ingredients: ingredients.map(ingredient => ({
                    name: ingredient.name,
                    quantity: ingredient.quantity,
                    unit: ingredient.unit
                }))
            });
        });
    });
});


process.on('SIGINT', () => {
    db.close((err) => {
        if (err) console.error('Erreur lors de la fermeture de la base de données :', err.message);
        console.log('Base de données fermée.');
        process.exit(0);
    });
});

app.listen(3000, () => console.log('API running on port 3000'));
