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

function tagsListsFactory(name, type) {

    function getIngredientDOM() {
        
        const li = document.createElement('li')
        li.setAttribute('data-selected', 'false')
        li.setAttribute('data-name', name)
        li.setAttribute('data-type', type)
        li.setAttribute('onclick', 'search("'+name+'", "'+type+'-list")')
        li.textContent = name

        return (li)
    }

    return { getIngredientDOM }
}

//construire le tableau des ingrédients à filtrer
let ingredientsFilter = []
let appliancesFilter = []
let ustensilsFilter = []

const tagsFilterUpdate = (displayedRecipes) => {
    const selectedIngredients = document.querySelectorAll('.tags-section > div[tag-source="ingredients"]')
    let ingredientDuplicates = []
    selectedIngredients.forEach(tag => ingredientDuplicates.push(tag.getAttribute('tag-name')))

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
                        //éliminer les tags déjà sélectionnés
                        .filter(ingredient => !ingredientDuplicates.includes(ingredient))
                        //ranger par ordre alphabétique
                        .sort()
                        
                        :

                        displayedRecipes.map(recipe => recipe.ingredients.map(ingredients => ingredients.ingredient))
                        .reduce((allIngredients, ingredient) => allIngredients + ',' + ingredient)
                        //pas de .split si 1 seule recette en résultat
                        .map(ingredient => ingredient.slice(0,1).toUpperCase()+ingredient.slice(1).toLowerCase())
                        .filter((ingredient, ingredientIndex, table) => table.findIndex(t => (t === ingredient)) === ingredientIndex)
                        .filter(ingredient => !ingredientDuplicates.includes(ingredient))
                        .sort()

    const selectedAppliances = document.querySelectorAll('.tags-section > div[tag-source="appliance"]')
    let applianceDuplicates = []
    selectedAppliances.forEach(tag => applianceDuplicates.push(tag.getAttribute('tag-name')))

    appliancesFilter =  displayedRecipes.map(recipe => recipe.appliance)
                        .map(appliance => appliance.slice(0,1).toUpperCase()+appliance.slice(1).toLowerCase())
                        .filter((appliance, applianceIndex, table) => table.findIndex(t => (t === appliance)) === applianceIndex)
                        .filter(appliance => !applianceDuplicates.includes(appliance))
                        .sort()

    const selectedUstensils = document.querySelectorAll('.tags-section > div[tag-source="ustensils"]')
    let ustensilDuplicates = []
    selectedUstensils.forEach(tag => ustensilDuplicates.push(tag.getAttribute('tag-name')))

    ustensilsFilter =  displayedRecipes.length > 1 ?
                        displayedRecipes.map(recipe => recipe.ustensils)
                        .reduce((allUstensils, ustensil) => allUstensils + ',' + ustensil)
                        .split(',')
                        .map(ustensil => ustensil.slice(0,1).toUpperCase()+ustensil.slice(1).toLowerCase())
                        .filter((ustensil, ustensilIndex, table) => table.findIndex(t => (t === ustensil)) === ustensilIndex)
                        .filter(ustensil => !ustensilDuplicates.includes(ustensil))
                        .sort()
                        
                        :

                        displayedRecipes.map(recipe => recipe.ustensils)
                        .reduce((allUstensils, ustensil) => allUstensils + ',' + ustensil)
                        .map(ustensil => ustensil.slice(0,1).toUpperCase()+ustensil.slice(1).toLowerCase())
                        .filter((ustensil, ustensilIndex, table) => table.findIndex(t => (t === ustensil)) === ustensilIndex)
                        .filter(ustensil => !ustensilDuplicates.includes(ustensil))
                        .sort()
}

const removeTag = (tag) => {
    const tagToRemove = document.querySelector('.tags-section > div[tag-name="'+tag+'"]')
    const tagType = tagToRemove.getAttribute('tag-type')
    //redescendre le filtre dans la liste des filtres non sélectionnés
    const moveToList = document.getElementById(tagType+'-slider-list')
    const filterToMove = document.querySelector('li[data-selected="true"][data-name="'+tag+'"][data-type="'+tagType+'"]')
    moveToList.appendChild(filterToMove)
    filterToMove.setAttribute('data-selected', 'false')
    filterToMove.setAttribute('onclick', 'search("'+tag+'", "'+tagType+'-list'+'")')
    //effacer le tag
    tagToRemove.remove()

    //relancer un search
    search('', 'remove')
}

function tagsFactory(tag, source) {

    let tagType = ''
    switch (source) {
        case 'ingredients-list':
            source = 'ingredients'
            tagType = 'ingredients'
            break
        
        case 'appliances-list':
            source = 'appliance'
            tagType = 'appliances'
            break

        case 'ustensils-list':
            source = 'ustensils'
            tagType = 'ustensils'
            break
        default:
            source = 'error'
            tagType = 'error'
            break
    }

    function getTagDOM() {
        
        const container = document.createElement('div')
        container.setAttribute('tag-name', tag)
        container.setAttribute('tag-source', source)
        container.setAttribute('tag-type', tagType)
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

function displayTags(tag, source) {
    const tagModel = tagsFactory(tag, source);
    const tagDOM = tagModel.getTagDOM();
    const tagsSection = document.querySelector('.tags-section')
    tagsSection.appendChild(tagDOM); //construire son affichage en tant que tag

    //remonter le tag sélectionné en haut de la liste
    const tagType = source.slice(0,-5)
    const selectedTag = document.querySelector('li[data-name="'+tag+'"][data-type="'+tagType+'"]')
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
    const appliancesList = document.getElementById("appliances-slider-list");
    appliancesList.innerHTML = ''//réinitialiser la liste des appareils
    const ustensilsList = document.getElementById("ustensils-slider-list");
    ustensilsList.innerHTML = ''//réinitialiser la liste des ustensils

    recipes.map(recipe => {
        const recipeModel = recipeFactory(recipe);
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    })

    tagsFilterUpdate(recipes)

    ingredientsFilter.map(ingredientFilter => {
        const ingredientModel = tagsListsFactory(ingredientFilter, 'ingredients');
        const ingredientDOM = ingredientModel.getIngredientDOM();
        ingredientsList.appendChild(ingredientDOM);
    })

    appliancesFilter.map(applianceFilter => {
        const applianceModel = tagsListsFactory(applianceFilter, 'appliances');
        const applianceDOM = applianceModel.getIngredientDOM();
        appliancesList.appendChild(applianceDOM);
    })

    ustensilsFilter.map(ustensilFilter => {
        const ustensilModel = tagsListsFactory(ustensilFilter, 'ustensils');
        const ustensilDOM = ustensilModel.getIngredientDOM();
        ustensilsList.appendChild(ustensilDOM);
    })

}

function init() {
    displayData(recipes);
}

init();



