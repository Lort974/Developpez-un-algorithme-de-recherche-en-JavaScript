const searchBar = document.getElementById('main-search-bar')

searchBar.addEventListener('keyup', (event) => {
    search(searchBar.value, 'search-bar')
})

const search = (term, source) => {

    if (term.length >= 3) { //lancer la recherche si 3 caractères minimum

        /**
         * fonction de retour de filter : la recette est incluse si elle inclu le terme recherché
         * toLowerCase partout pour ignorer la casse
         */
        const filterBy = ((criteria) => criteria.toLowerCase().includes(term.toLowerCase()))
        /**
         * stringifier la liste des ingrédients pour parcourir plus simplement les ingrédients
         */
        const criteriaToString = ((criteria) => criteria .map(ingredients => ingredients.ingredient)
                                                            //map pour en sortir uniquement la ligne "ingredient"
                                                            .reduce((allIngredients, ingredient) => allIngredients + ', ' + ingredient))
                                                            //que l'on réduit en 1 string composée de la somme de chaque string)
        //rechercher sur le nom
        const nameResults = recipes.filter(recipes => filterBy(recipes.name))
        //rechercher sur la description
        const descResults = recipes.filter(recipes => filterBy(recipes.description))
        //rechercher sur les ingrédients
        const ingResults = recipes.filter(recipes => filterBy(criteriaToString(recipes.ingredients)))
        //compiler les résultats
        const globalResults = [...nameResults, ...descResults, ...ingResults]
                            //éliminer les doublons
                            .filter((result, resultIndex, table) => table.findIndex(t => (t.id === result.id)) === resultIndex)
                            /**
                             * donne l'index du premier élément de globalResults dont "recipe.id" est égal
                             * à "recipe.id" testé par filter()
                             * ce premier élément est inclus dans filteredResults si son index est aussi le même
                             */

        //reconstruire la section des recettes avec les résultats obtenus
        displayData(globalResults)

        if (source === "ingredients-list") {

            displayTags(term)

        }

        if (source === "search-bar") {

            const sliders = ['ingredients-slider', 'appareils-slider', 'ustensils-slider']
            sliders.forEach((e) => {
                sliderClose(e)
            })

        }

    }

    else {

        //displayData(recipes)

    }
}