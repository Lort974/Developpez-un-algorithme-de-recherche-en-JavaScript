/**FOR LOOP VERSION */

/**
 * RECHERCHE DE FILTRES
 */

const ingredientSearchBar = document.getElementById('ingredient-search')
const applianceSearchBar = document.getElementById('appliance-search')
const ustensilSearchBar = document.getElementById('ustensil-search')

//appel de la recherche
ingredientSearchBar.addEventListener('keyup', () => {filterSearch(ingredientSearchBar.value, ingredientSearchBar.getAttribute('id'))})
applianceSearchBar.addEventListener('keyup', () => {filterSearch(applianceSearchBar.value, applianceSearchBar.getAttribute('id'))})
ustensilSearchBar.addEventListener('keyup', () => {filterSearch(ustensilSearchBar.value, ustensilSearchBar.getAttribute('id'))})

const filterSearch = (term, source) => {
    const listType = source.slice(0, -7) + 's' //"ingredient-search" devient "ingredients" par exemple
    //se placer sur la bonne catagorie :
    const filterList = document.querySelectorAll('.tags-list[list-type="'+listType+'"] > .filter-list > li')
    let filterNames = [] //stocker tous les noms des filtre disponibles
    for (let i = 0; i < filterList.length; i++) {
        filterName = filterList[i].getAttribute('data-name')
        filterNames.push(filterName)
    }
    //cacher ceux qui ne contiennent pas le terme recherché :
    const filterToShow = []
    const filterToHide = []
    for (i = 0; i < filterNames.length; i++) {
        filterNames[i].toLowerCase().includes(term.toLowerCase()) ? filterToShow.push(filterNames[i]) : filterToHide.push(filterNames[i])
    }
    for (i = 0; i < filterToShow.length; i++) {
        const show = document.querySelector('.tags-list[list-type="'+listType+'"] > .filter-list > li[data-name="'+filterToShow[i]+'"]')
        show.style.display = 'block'
    }
    for (i = 0; i < filterToHide.length; i++) {
        const hide = document.querySelector('.tags-list[list-type="'+listType+'"] > .filter-list > li[data-name="'+filterToHide[i]+'"]')
        hide.style.display = 'none'
    }

}

const searchBar = document.getElementById('main-search-bar')

searchBar.addEventListener('keyup', () => {
    search(searchBar.value, 'search-bar')
})

//SUPPRIMER LES DOUBLONS ET REVENIR A LA MISE EN FORME INITIALE DES RECETTES
const removeDuplicates = (rawResults) => {

    //repérer les doublons
    duplicateResults = []

    for (let i = 0; i < rawResults.length - 1; i++) {
        rawResults.sort((a, b) => a.id - b.id)
        if (rawResults[i]['id'] === rawResults[i+1]['id']) {
            duplicateResults.push(rawResults[i])
        }
    }

    //les supprimer
    for (let i = 0; i < rawResults.length; i++) {
        for (let j = 0; j < duplicateResults.length; j++) {
            if (rawResults[i]['id'] === duplicateResults[j]['id']) {
                rawResults.splice(i, 1)
            }
        }
    }

    //revenir au format de recettes initial
    for (let i = 0; i < rawResults.length; i++) { //parcourir tous les résultats
        recipeId = rawResults[i]['id'] //en obtenir l'id de la recette
        //remplacer les propriétés ingredients, name, description et appliance par celles des recettes initiales
        rawResults[i]['ingredients'] = recipes.find(recipe => recipe.id === recipeId)['ingredients']
                                                //find pour trouver la recette dans recipes dont l'id est recipeId
        rawResults[i]['name'] = recipes.find(recipe => recipe.id === recipeId)['name']
        rawResults[i]['description'] = recipes.find(recipe => recipe.id === recipeId)['description']
        rawResults[i]['appliance'] = recipes.find(recipe => recipe.id === recipeId)['appliance']
    }

    return rawResults

}

const search = (term, source) => {

    //CONVERTIR LES CRITERES A PARCOURIR SOUS FORME DE TABLEAU POUR FACILITER LEUR PARCOURS
    
    let tabledCriteriaRecipes = []

    for (i = 0; i < recipes.length; i++) {
        tabledCriteriaRecipes.push(Object.assign({}, recipes[i])) //pour éviter de modifier racipes, on ne met pas tabledCriteriaRecipes = recipes
    }

    for (let i = 0; i < tabledCriteriaRecipes.length; i++) {

        let ingredientsTable = []

        for (let j = 0; j<tabledCriteriaRecipes[i]['ingredients'].length; j++) {

            let ingredient = tabledCriteriaRecipes[i]['ingredients'][j]['ingredient']
            ingredientsTable.push(ingredient)

        }

        tabledCriteriaRecipes[i]['ingredients'] = ingredientsTable
        tabledCriteriaRecipes[i]['name'] = [tabledCriteriaRecipes[i]['name']]
        tabledCriteriaRecipes[i]['description'] = [tabledCriteriaRecipes[i]['description']]
        tabledCriteriaRecipes[i]['appliance'] = [tabledCriteriaRecipes[i]['appliance']]

    }

    //FONCTION FACTORISEE POUR LA RECHERCHE A PARTIR D'UN TERME ET D'UNE SOURCE
    const browse = (term, source, recipeIndex) => {
        //initialiser un compteur
        let matches = 0
        let results
        //parcourir la propriété "source" que chaque recette
        for (let j = 0; j < tabledCriteriaRecipes[recipeIndex][source].length; j++) {
            //si la valeur de la propriété correspond au terme de recherche
            if (tabledCriteriaRecipes[recipeIndex][source][j].toLowerCase().includes(term.toLowerCase())) {
                //incrémenter le compteur
                matches++

            }
        }
        //et si le compteur a été incrémenté
        if (matches > 0) {
            //la recette est à afficher
            results = tabledCriteriaRecipes[recipeIndex]

        }
        //donc on la retourne
        return results

    }

    if (source === 'search-bar') {

        //fermer les sliders des filtres
        const sliders = ['ingredients-slider', 'appliances-slider', 'ustensils-slider']
        for (let i = 0; i < sliders.length; i++) {
            sliderClose(sliders[i])
        }
        //supprimer les tags actifs
        const allTags = document.querySelectorAll('.tags-section > div')
        for (let i = 0; i < allTags.length; i++) {
            tagToRemove = allTags[i].getAttribute('tag-name')
            removeTag(tagToRemove)
        }
        //initialiser les variables de résultats
        let nameResults = []
        let descResults = []
        let ingResults = []
        let defaultResults = [] //pour afficher toutes les recettes lorsque moins de 3 caractères
        //récupérer la valeur de la searchBar
        const searchBarTerm = searchBar.value
        //si plus de 3 caractères
        if (searchBarTerm.length >= 3) {
            //sortir les recettes qui correspondent à la search bar :
            //parcourir les recettes
            for (let i = 0; i < tabledCriteriaRecipes.length; i++) {
                //recherche dans le nom :
                //stocket le résultat de la fonction de recherche dans la variable correspondante
                const nameResult = browse(searchBarTerm, 'name', i)
                //s'il y a un résultat, c'est-à-dire si la valeur de retour est différente de undefined
                if (nameResult != undefined) {
                    //on récupère ce résultat
                    nameResults.push(nameResult)
    
                }
                //recherche dans la description :
                const descResult = browse(searchBarTerm, 'description', i)
    
                if (descResult != undefined) {
    
                    descResults.push(descResult)
    
                }
                //recherche dans les ingrédients :
                const ingResult = browse(searchBarTerm, 'ingredients', i)
    
                if (ingResult != undefined) {
    
                    ingResults.push(ingResult)
    
                }

            }

        }
        //sinon, si moins de 3 caractères
        else {

            for (let i = 0; i < tabledCriteriaRecipes.length; i++) {
                //on affichera toutes les recettes :
                defaultResults.push(tabledCriteriaRecipes[i])

            }

        }
        //rassembler tous les résultats en 1
        const searchBarResults = [...nameResults, ...descResults, ...ingResults, ...defaultResults]
        //retirer les doublons et revenir à la mise en forme originelle :
        const filteredResults = removeDuplicates(searchBarResults)
        //afficher les résultats
        filteredResults.length > 0 ?
            displayData(filteredResults)
            :
            document.querySelector('.recipes-section').textContent = 'Aucune recette ne contient "'+searchBarTerm+'", vous pouvez chercher "tarte aux pommes", "poisson", etc.'
        document.querySelector('.filter-section > div:nth-child(2)').textContent = filteredResults.length > 1 ? 
            filteredResults.length + ' recettes'
            : 
            filteredResults.length + ' recette'

    }

    //si la recherche est appelée depuis un filtre, ajouter les tags correspondant
    if (source === "ingredients-list" || source === "appliances-list" || source === "ustensils-list" || source === "remove") {

        if (source != "remove") {
            displayTags(term, source)
            
            //effacer la searchBar
            searchBar.value = ''

        }
        
        //repérer tous les tags sélectionnés
        const allTags = document.querySelectorAll('.tags-section > div')
        //préparer la liste des termes de recherche avancés
        let advancedTerms = []
        //pour chacun des tags sélectionnés
        for (let i = 0; i < allTags.length; i++) {
            //ajouter le nom du terme et sa source dans la liste des termes de recherche avancé
            advancedTerms.push({term: allTags[i].getAttribute('tag-name'), source: allTags[i].getAttribute('tag-source')})

        }
        
        //sortir les recettes qui correspondent aux filtres de recherche avancés :
        //initialiter la variable des résultats
        let advancedResults = []
        //parcourir toutes les recettes
        for (i = 0; i < tabledCriteriaRecipes.length; i++) {
            //parcourir tous les termes avancés (item), y appliquer la fonction de recherche et vérifier si la valeur retournée n'est pas undefined
            //si c'est bien le cas, alors allTagsMatch vaut TRUE et ça signifie que la recette testée correspond à tous les tags à la fois
            const allTagsMatch = advancedTerms.every(item => browse(item['term'], item['source'], i) != undefined)
            //si c'est bien true
            if (allTagsMatch) {
                //alors la recette est retenue
                advancedResults.push(tabledCriteriaRecipes[i])

            }

        }
    
        //fusionner et supprimer les doublons :
        const filteredResults = removeDuplicates(advancedResults)
        displayData(filteredResults)
        //afficher le nombre de recettes trouvées
        document.querySelector('.filter-section > div:nth-child(2)').textContent = filteredResults.length > 1 ? 
            filteredResults.length + ' recettes'
            : 
            filteredResults.length + ' recette'

    }

    //redimensionner les sliders ouverts
    const sliders = ['ingredients-slider', 'appliances-slider', 'ustensils-slider']

    for (i = 0; i < sliders.length; i++) {

        const sliderStatus = document.getElementById(sliders[i]).getAttribute('data-slide')

        if (sliderStatus === 'down') {

            sliderResize(sliders[i])   

        }
        
    }

    //effacer les barres de recherche de filtres :
    ingredientSearchBar.value = ''
    applianceSearchBar.value = ''
    ustensilSearchBar.value = ''

}

