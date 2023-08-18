function recipeFactory(recipe) {

    function getRecipeCardDOM() {
        const article = document.createElement( 'article' )

        /**IMAGE */
        const imgDiv = document.createElement( 'div' )
        const img = document.createElement('img')
        img.setAttribute('src', 'img/recipes/'+recipe.image)
        img.classList.add('w-100')
        article.appendChild(imgDiv)
        imgDiv.appendChild(img)


        /**TEXTE */
        const txtDiv = document.createElement('div')
        txtDiv.classList.add('container-lg')
        article.appendChild(txtDiv)

        /**Titre */
        const titleDiv = document.createElement('div')
        titleDiv.classList.add('row')
        const title = document.createElement('h2')
        title.classList.add('col')
        title.textContent = recipe.name
        txtDiv.appendChild(titleDiv)
        titleDiv.appendChild(title)

        /**Sous-titre "Recette" */
        const recipeSubtitleDiv = document.createElement('div')
        recipeSubtitleDiv.classList.add('row')
        const recipeSubtitle = document.createElement('h3')
        recipeSubtitle.classList.add('col')
        recipeSubtitle.textContent = 'Recette'
        txtDiv.appendChild(recipeSubtitleDiv)
        recipeSubtitleDiv.appendChild(recipeSubtitle)

        /**Description "Recette" */
        const recipeDescriptionDiv = document.createElement('div')
        recipeDescriptionDiv.classList.add('row')
        const recipeDescription = document.createElement('div')
        recipeDescription.classList.add('col')
        recipeDescription.textContent = recipe.description
        txtDiv.appendChild(recipeDescriptionDiv)
        recipeDescriptionDiv.appendChild(recipeDescription)

        /**Sous-titre "Ingrédients" */
        const ingredientsSubtitleDiv = document.createElement('div')
        ingredientsSubtitleDiv.classList.add('row')
        const ingredientsSubtitle = document.createElement('h3')
        ingredientsSubtitle.classList.add('col')
        ingredientsSubtitle.textContent = 'Ingrédients'
        txtDiv.appendChild(ingredientsSubtitleDiv)
        ingredientsSubtitleDiv.appendChild(ingredientsSubtitle)

        /**Liste des ingrédients */
        const ingredientsList = document.createElement('div')
        ingredientsList.classList.add('row')
        ingredientsList.classList.add('ingredients-list')
        txtDiv.appendChild(ingredientsList)
        recipe.ingredients.forEach(e => {
            const ingredientDiv = document.createElement('div')
            ingredientsList.appendChild(ingredientDiv)
            const ingredientName = document.createElement('span')
            ingredientName.textContent = e.ingredient
            ingredientDiv.appendChild(ingredientName)
            if (e.quantity) {
                const ingredientQuantity = document.createElement('span')
                ingredientQuantity.textContent = e.quantity
                if (e.unit) {
                    ingredientQuantity.textContent += ' '+e.unit
                }
                ingredientDiv.appendChild(ingredientQuantity)
            }
        });

        return (article);
    }

    return { getRecipeCardDOM }
}

function displayData(recipes) {
    const recipesSection = document.querySelector(".recipes-section");

    for (i=0; i<recipes.length;i++) {
        const recipeModel = recipeFactory(recipes[i]);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    }
}

function init() {
    displayData(recipes);
}

init();