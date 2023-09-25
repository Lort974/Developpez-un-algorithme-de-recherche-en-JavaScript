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

//construire le tableau des ingrédients à filtrer
let ingredientsFilter = []

function ingredientsFactory(ingredients) {

    function getIngredientDOM() {
        
        const li = document.createElement('li')
        li.setAttribute('data-display', 'true')
        li.setAttribute('data-name', ingredients)
        li.textContent = ingredients

        return (li)
    }

    return { getIngredientDOM }
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
    tagsSection.appendChild(tagDOM); //construire son affichage en tant que tag
    document.querySelector('li[data-name="'+tag+'"]').style.display = 'none'//et l'effacer de la liste puisqu'il est déjà sélectionné
}

function displayData(recipes) {
    const recipesSection = document.querySelector(".recipes-section");
    const ingredientsList = document.getElementById("ingredients-slider-list");

    for (let i=0; i<recipes.length; i++) {
        const recipeModel = recipeFactory(recipes[i]);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    }

    ingredientsFilterUpdate()
    closeSlider('ingredients-slider')
    
    for (let i=0; i<ingredientsFilter.length; i++) {
        const ingredientModel = ingredientsFactory(ingredientsFilter[i]);
        const ingredientDOM = ingredientModel.getIngredientDOM();
        ingredientsList.appendChild(ingredientDOM);
    }

}

const ingredientsFilterUpdate = () => {
    //déterminer les tags déjà actifs
    const displayedTags = document.querySelectorAll('.tags-section > div > div:nth-child(1)')
    let activeTags = []
    displayedTags.forEach((e) => {
        activeTags.push(e.textContent)
    })
    /*recipes.forEach((e) => { //pour chaque recette
        let recipeArticle = document.querySelector('article[data-id="'+e['id']+'"]')
        for (let i=0; i<e['ingredients'].length; i++) { //parcourir sa liste d'ingrédients
            //Formater le texte pour ignorer la casse (1re lettre en maj, le reste en minuscule)
            let formatedIngredient =    e['ingredients'][i]['ingredient'].charAt(0).toUpperCase()
                                        + e['ingredients'][i]['ingredient'].slice(1).toLowerCase()
            //et si l'ingrédient analysé n'est pas déjà présent dans le tableau et que sa recette est affichée
            if (!ingredientsFilter.includes(formatedIngredient) && recipeArticle.style.display === 'block') { 
                ingredientsFilter.push(formatedIngredient) //on l'ajoute
            }
            else if (recipeArticle.style.display === 'none' && recipe.includes(formatedIngredient)) { //sinon, si sa recette n'est pas affichée
                ingredientsFilter = ingredientsFilter.filter(item => item !== formatedIngredient); //supprimer l'ingrédient
            }
        }
    })*/
    ingredientsFilter = [] //réinitialiser la liste des ingrédients
    //sélectionner toutes les recettes affichées
    const displayedRecipes = document.querySelectorAll('.recipes-section > article[data-display="true"]')
    //pour chacune d'entre elles
    displayedRecipes.forEach((e) => {
        //en extraire l'id
        const recipeId = parseInt(e.getAttribute('data-id'))
        //parcourir toutes les recettes
        recipes.forEach((recipe) => {
            //lorsque l'on tombe sur une recette qui est affichée
            if (recipe['id'] === recipeId) {
                //en extraire les ingrédients
                for (let i=0; i<recipe['ingredients'].length; i++) {
                    //les formater pour ignorer la casse
                    let formatedIngredient =    recipe['ingredients'][i]['ingredient'].charAt(0).toUpperCase()
                                                + recipe['ingredients'][i]['ingredient'].slice(1).toLowerCase()
                    //et s'ils ne sont pas déjà dans le tableau, les y insérer
                    if (!ingredientsFilter.includes(formatedIngredient)) {
                        ingredientsFilter.push(formatedIngredient)
                    }
                }
            }
        })
    })
    ingredientsFilter.sort() //trier ce tableau par ordre alphabétique
    //puis mettre à jour la liste des ingrédients affichés
    const ingredientsList = document.querySelectorAll('.ing-list > li')
    ingredientsList.forEach((e) => {
        //e.style.display = ingredientsFilter.includes(e.getAttribute('data-name')) ? 'block' : 'none'
        //si l'ingrédient est dans la liste à afficher ET s'il n'est pas dans les tags actifs
        if (ingredientsFilter.includes(e.getAttribute('data-name')) && !activeTags.includes(e.getAttribute('data-name'))) {
            e.style.display = 'block'
        }
        else {
            e.style.display = 'none'
        }
    })
    if (document.getElementById('ingredients-slider').getAttribute('data-slide') === 'down') {
        sliderResize('ingredients-slider-list', 'ingredients-slider') //redimensionner le container s'il est ouvert
    }
}

function init() {
    displayData(recipes);
}

init();

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

