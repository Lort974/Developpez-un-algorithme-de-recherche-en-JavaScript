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
    /*filterList.forEach(element => {
        filterName = element.getAttribute('data-name')
        filterNames.push(filterName)
    })*/
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
    /*const filterToHide = filterNames.filter(name => !name.toLowerCase().includes(term.toLowerCase()))
    filterToHide.forEach(name => {
        const hide = document.querySelector('.tags-list[list-type="'+listType+'"] > .filter-list > li[data-name="'+name+'"]')
        hide.style.display = 'none'
    })
    //montrer ceux qui contiennent le terme recherché :
    const filterToShow = filterNames.filter(name => name.toLowerCase().includes(term.toLowerCase()))
    filterToShow.forEach(name => {
        const show = document.querySelector('.tags-list[list-type="'+listType+'"] > .filter-list > li[data-name="'+name+'"]')
        show.style.display = 'block'
    })*/
}

const searchBar = document.getElementById('main-search-bar')

searchBar.addEventListener('keyup', () => {
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

    //redimensionner les sliders ouverts
    const sliders = ['ingredients-slider', 'appliances-slider', 'ustensils-slider']
    sliders.forEach(sliderId => {
        const sliderStatus = document.getElementById(sliderId).getAttribute('data-slide')
        if (sliderStatus === 'down') {
            sliderResize(sliderId)            
        }
    })

    //effacer les barres de recherche de filtres :
    filterSearchBars.forEach(bar => bar.value = '')

}

