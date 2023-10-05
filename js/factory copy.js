//Ouvrir les champs de recherche avancée
const sliders = document.querySelectorAll('.filter-slider')
sliders.forEach((e) => {
    const sliderId = e.getAttribute('id')
    e.addEventListener('click', event => {
        if (e.getAttribute('data-slide') === "up")
        {
            const listId = sliderId+'-list'
            sliderResize(listId, sliderId)
        }
        else if (e.getAttribute('data-slide') === "down")
        {
            closeSlider(sliderId) 
        }
    })
})

const sliderResize = (listId, sliderId) => {
    const slider = document.getElementById(sliderId)
    const childrenList = document.getElementById(listId).childNodes
    let elementsNbr = 0
    for (let i=1; i<childrenList.length; i++) { //commencer par 1 car le 0 est un "text"
        if (childrenList[i].getAttribute('data-display') === 'true') {
            elementsNbr++
        }
    }
    elementsNbr >= 7 ? ulHeight = 186 : ulHeight = 31*elementsNbr
    let divHeight = ulHeight + 112
    const children = slider.childNodes
    for (let i=0; i<children.length; i++) {
        if (children[i].nodeName === "I") {
            children[i].style.transform = 'rotate(180deg)'
        }
    }
    slider.parentNode.style.height = divHeight+"px"
    document.getElementById(sliderId+'-list').style.height = ulHeight+"px"
    slider.setAttribute('data-slide', 'down')
}

const closeSlider = (sliderId) => {
    const slider = document.getElementById(sliderId)
    const children = slider.childNodes
    for (let i=0; i<children.length; i++) {
        if (children[i].nodeName === "I") {
            children[i].style.transform = 'rotate(0deg)'
        }
    }
    slider.parentNode.style.height = "55px"
    slider.setAttribute('data-slide', 'up')
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
        li.setAttribute('data-display', 'true')
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
                        ingredientsFilter = displayedRecipes.map(recipe => recipe.ingredients.map(ingredients => ingredients.ingredient))
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
}

function displayData(recipes) {
    const recipesSection = document.querySelector(".recipes-section");
    recipesSection.innerHTML = ''//réinitialiser la section des recettes
    const ingredientsList = document.getElementById("ingredients-slider-list");
    ingredientsList.innerHTML = ''//réinitialiser la liste des ingrédients

    for (let i=0; i<recipes.length; i++) {
        const recipeModel = recipeFactory(recipes[i]);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    }

    ingredientsFilterUpdate(recipes)
    
    for (let i=0; i<ingredientsFilter.length; i++) {
        const ingredientModel = ingredientsFactory(ingredientsFilter[i]);
        const ingredientDOM = ingredientModel.getIngredientDOM();
        ingredientsList.appendChild(ingredientDOM);
    }

}

function init() {
    displayData(recipes);
}

init();



