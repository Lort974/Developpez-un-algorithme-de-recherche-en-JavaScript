const toggleSlider = (sliderId) => {
    const slider = document.getElementById(sliderId)
    const sliderState = slider.getAttribute('data-slide')
    
    if (sliderState === 'up') {
        slider.setAttribute('data-slide', 'down')
        slider.children[0].children[1].style.transform = 'rotate(180deg)' //retourner la flèche
        sliderResize(sliderId)
    }
    else if (sliderState === 'down') {
        sliderClose(sliderId)
    }

}

const sliderResize = (sliderId) => {

    const slider = document.getElementById(sliderId)
    const listLength = slider.children[2].children[1].children.length
    let sliderHeight = listLength > 6 ? 

                        315
                        
                        :

                        126 + 31*listLength

    slider.style.height = sliderHeight+'px'

}

const sliderClose = (sliderId) => {

    const slider = document.getElementById(sliderId)

    slider.setAttribute('data-slide', 'up')
    slider.children[0].children[1].style.transform = 'rotate(0deg)' //retourner la flèche
    slider.style.height = '55px'

}

function recipeFactory(recipe) {

    function getRecipeCardDOM() {
        const article = document.createElement( 'article' )
        article.setAttribute('data-id', recipe.id) //servira à l'affichage ou non de la recette
        article.setAttribute('data-display', 'true')
        article.style.display = 'block'

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

function ingredientsFactory(ingredients) {

    function getIngredientDOM() {
        
        const li = document.createElement('li')
        li.setAttribute('data-selected', 'false')
        li.setAttribute('data-name', ingredients)
        li.setAttribute('onclick', 'search("'+ingredients+'", "ingredients-list")')
        li.textContent = ingredients

        return (li)
    }

    return { getIngredientDOM }
}

//construire le tableau des ingrédients à filtrer
let ingredientsFilter = []

const ingredientsFilterUpdate = (displayedRecipes) => {

    ingredientsFilter = displayedRecipes.length > 1 ?
                        //1er map donne tout le sous-tableau ingredients avec les quantités et les unités
                        //2ème map sur ce sous-tableau pour ne sortir que des tableaux d'ingrédients
                        displayedRecipes.map(recipe => recipe.ingredients.map(ingredients => ingredients.ingredient))
                        //réduire en une string composée de tous les ingrédients de toutes les recettes
                        .reduce((allIngredients, ingredient) => allIngredients + ',' + ingredient)
                        //transformer cette string en un tableau
                        .split(',')
                        //maîtriser la casse en mettant la 1re lettre en maj et le reste en minuscules
                        .map(ingredient => ingredient.slice(0,1).toUpperCase()+ingredient.slice(1).toLowerCase())
                        //éliminer les doublons
                        .filter((ingredient, ingredientIndex, table) => table.findIndex(t => (t === ingredient)) === ingredientIndex)
                        //ranger par ordre alphabétique
                        .sort()
                        
                        :

                        displayedRecipes.map(recipe => recipe.ingredients.map(ingredients => ingredients.ingredient))
                        .reduce((allIngredients, ingredient) => allIngredients + ',' + ingredient)
                        //pas de .split si 1 seule recette en résultat
                        .map(ingredient => ingredient.slice(0,1).toUpperCase()+ingredient.slice(1).toLowerCase())
                        .filter((ingredient, ingredientIndex, table) => table.findIndex(t => (t === ingredient)) === ingredientIndex)
                        .sort()

}

function tagsFactory(tag) {

    function getTagDOM() {
        
        const container = document.createElement('div')
        const tagName = document.createElement('div')
        tagName.textContent = tag
        const tagClose = document.createElement('div')
        const close = document.createElement('i')
        close.classList.add('fa-solid')
        close.classList.add('fa-xmark')
        close.style.color = '#1b1b1b'
        close.setAttribute('onclick', 'removeTag("'+tag+'")')

        container.appendChild(tagName)
        container.appendChild(tagClose)
        tagClose.appendChild(close)

        return (container)
    }

    return { getTagDOM }
}

function displayTags(tag) {
    const tagModel = tagsFactory(tag);
    const tagDOM = tagModel.getTagDOM();
    const tagsSection = document.querySelector('.tags-section')
    tagsSection.appendChild(tagDOM); //construire son affichage en tant que tag

    //remonter le tag sélectionné en haut de la liste
    const selectedTag = document.querySelector('li[data-name="'+tag+'"]')
    const tagType = selectedTag.parentNode.getAttribute('id').slice(0,-12)
    const selectedTagsList = document.getElementById('selected-'+tagType)
    selectedTagsList.appendChild(selectedTag)
    selectedTag.setAttribute('data-selected', 'true')
    selectedTag.setAttribute('onclick', 'removeTag("'+tag+'")')
}

function displayData(recipes) {
    const recipesSection = document.querySelector(".recipes-section");
    recipesSection.innerHTML = ''//réinitialiser la section des recettes
    const ingredientsList = document.getElementById("ingredients-slider-list");
    ingredientsList.innerHTML = ''//réinitialiser la liste des ingrédients

    recipes.map(recipe => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    })

    /*for (let i=0; i<recipes.length; i++) {
        const recipeModel = recipeFactory(recipes[i]);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    }*/

    ingredientsFilterUpdate(recipes)

    ingredientsFilter.map(ingredientFilter => {
        const ingredientModel = ingredientsFactory(ingredientFilter);
        const ingredientDOM = ingredientModel.getIngredientDOM();
        ingredientsList.appendChild(ingredientDOM);
    })
    
    /*for (let i=0; i<ingredientsFilter.length; i++) {
        const ingredientModel = ingredientsFactory(ingredientsFilter[i]);
        const ingredientDOM = ingredientModel.getIngredientDOM();
        ingredientsList.appendChild(ingredientDOM);
    }*/

}

function init() {
    displayData(recipes);
}

init();



