const searchBar = document.getElementById('main-search-bar')

searchBar.addEventListener('keyup', (event) => {
    search(searchBar.value, 'search-bar')
})

//SUPPRIMER LES DOUBLONS ET REVENIR A LA MISE EN FORME INITIALE DES RECETTES
const removeDuplicates = (rawResults) => {
    filteredResults = rawResults.filter((result, resultIndex, table) => table.findIndex(t => (t.id === result.id)) === resultIndex)
                                /**
                                 * donne l'index du premier élément de globalResults dont "recipe.id" est égal
                                 * à "recipe.id" testé par filter()
                                 * ce premier élément est inclus dans filteredResults si son index est aussi le même
                                 */
                                
                                //revenir aux propriétés initiales :
                                .map(recipe => {
                                    // Trouver la recette correspondante dans le tableau 'recipes'
                                    const correspondingRecipe = recipes.find(r => r.id === recipe.id);
                                    
                                    // remplacer les valeurs trouvées correspondantes
                                    return {
                                        ...recipe,
                                        ingredients: correspondingRecipe.ingredients,
                                        name: correspondingRecipe.name,
                                        description: correspondingRecipe.description,
                                        appliance: correspondingRecipe.appliance
                                    }
                                })

    return filteredResults
}

//on obtient les résultats des filtre + ceux de la searchbar. Il faudrait les résultats qui correspondent aux 2 en m^ tps

const search = (term, source) => {

    //CONVERTIR LES CRITERES A PARCOURIR SOUS FORME DE TABLEAU POUR FACILITER LEUR PARCOURS
    const tabledCriteriaRecipes = recipes.map((recipe) => {
        //convertir la liste des ingrédients sous forme de tableau
        const ingredientsTable = recipe.ingredients.map(ingredients => ingredients.ingredient)
        //convertir l'appareil, le nom et la description sous forme de tableau :
        const applianceTable = [recipe.appliance]
        const nameTable = [recipe.name]
        const descriptionTable = [recipe.description]

        return {
            ...recipe,
            ingredients: ingredientsTable,
            name: nameTable,
            description: descriptionTable,
            appliance: applianceTable
        }
    })

    if (source === 'search-bar') {

        //fermer les sliders des filtres
        const sliders = ['ingredients-slider', 'appliances-slider', 'ustensils-slider']
        sliders.forEach((e) => {
            sliderClose(e)
        })

        //supprimer les tags actifs
        const allTags = document.querySelectorAll('.tags-section > div')
        allTags.forEach(tag => {
            tagToRemove = tag.getAttribute('tag-name')
            removeTag(tagToRemove)
        })

        const searchBarTerm = searchBar.value.length >= 3 ? searchBar.value : ''
        //sortir les recettes qui correspondent à la search bar (si au moins 3 caractères) :
        const nameResults = tabledCriteriaRecipes.filter(recipe => recipe.name.some(item => item.toLowerCase().includes(searchBarTerm.toLowerCase())))
        const descResults = tabledCriteriaRecipes.filter(recipe => recipe.description.some(item => item.toLowerCase().includes(searchBarTerm.toLowerCase())))
        const ingResults = tabledCriteriaRecipes.filter(recipe => recipe.ingredients.some(item => item.toLowerCase().includes(searchBarTerm.toLowerCase())))

        const searchBarResults = [...nameResults, ...descResults, ...ingResults]

        removeDuplicates(searchBarResults)
        displayData(filteredResults) //provient de removeDuplicates()

    }

    //si la recherche est appelée depuis un filtre, ajouter les tags correspondant
    if (source === "ingredients-list" || source === "appliances-list" || source === "ustensils-list" || source === "remove") {

        if (source != "remove") {
            displayTags(term, source)
            
            //effacer la searchBar
            searchBar.value = ''
        }


        
        //stocker tous les tags dans un tableau
        //maper ce tableau pour sortir un objet du type : [{"term":"term1","source":"source1"},{"term":"term2","source":"source2"}]
    
        const allTags = document.querySelectorAll('.tags-section > div')
        
        let advancedTerms = []
        
        allTags.forEach((tag) => advancedTerms.push({term: tag.getAttribute('tag-name'), source: tag.getAttribute('tag-source')}))
    
        //sortir les recettes qui correspondent aux filtres de recherche avancés :
        let advancedResults = tabledCriteriaRecipes.filter(recipe => {
            return advancedTerms.every(criterion => {
                return recipe[criterion.source].map(item => item.toLowerCase()).includes(criterion.term.toLowerCase())
            })
        })
    
        //fusionner et supprimer les doublons :
        removeDuplicates(advancedResults)
        displayData(filteredResults)

    }

}