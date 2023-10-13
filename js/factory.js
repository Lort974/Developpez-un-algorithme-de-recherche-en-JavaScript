/**FOR LOOP VERSION */

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
    const listLength = slider.children[2].children[0].children.length + slider.children[2].children[1].children.length
    let sliderHeight = listLength > 6 ? 

                        315
                        
                        :

                        130 + 31*listLength

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

    //fonction de formatage des filtres (1re lettre en maj et le reste en min)
    const filterFormat = (filter) => {
        const formatedFilter = filter.substring(0, 1).toUpperCase() + filter.substring(1).toLowerCase()
        return formatedFilter
    }

    //vider la liste des ingrédients
    ingredientsFilter = []
    
        //extraire tous les ingrédients existants
        for (let i = 0; i < displayedRecipes.length; i++) {
            for (let j = 0; j < displayedRecipes[i]['ingredients'].length; j++) {
                const ingredient = filterFormat(displayedRecipes[i]['ingredients'][j]['ingredient'])
                ingredientsFilter.push(ingredient)
            }
        }

        //les ranger dans l'ordre alphabétique
        ingredientsFilter.sort()

        /**
         * SUPPRIMER LES DOUBLONS
         */
        //créer un tableau pour les ingrédients doublons
        let ingredientsDuplicates = []
        //le remplir des doublons trouvés en comparant chaque élément du tableau à l'élément suivant
        for (let i = 0; i < ingredientsFilter.length; i++) {
            if (ingredientsFilter[i] === ingredientsFilter[i+1]) {
                ingredientsDuplicates.push(ingredientsFilter[i])
            }
        }
        //y ajouter les tags déjà sélectionnés pour les effacer de la liste sélectionnable
        const selectedIngredients = document.querySelectorAll('.tags-section > div[tag-source="ingredients"]')
        selectedIngredients.forEach(tag => ingredientsDuplicates.push(tag.getAttribute('tag-name')))
        //pour chaque ingrédient,
        for (let i = 0; i < ingredientsFilter.length; i++) {
            //le comparer avec les doublons
            for (let j = 0; j < ingredientsDuplicates.length; j++) {
                //et s'il porte le même nom
                if (ingredientsFilter[i] === ingredientsDuplicates[j]) {
                    //le supprimer
                    ingredientsFilter.splice(i, 1)
                }
            }
        }


    appliancesFilter = []

        for (let i = 0; i < displayedRecipes.length; i++) {
            const appliance = filterFormat(displayedRecipes[i]['appliance'])
            appliancesFilter.push(appliance)
        }

        appliancesFilter.sort()

        let applianceDuplicates = []

        for (let i = 0; i < appliancesFilter.length; i++) {
            if (appliancesFilter[i] === appliancesFilter[i+1]) {
                applianceDuplicates.push(appliancesFilter[i])
            }
        }
        const selectedAppliances = document.querySelectorAll('.tags-section > div[tag-source="appliance"]')
        selectedAppliances.forEach(tag => applianceDuplicates.push(tag.getAttribute('tag-name')))
        for (let i = 0; i < appliancesFilter.length; i++) {
            for (let j = 0; j < applianceDuplicates.length; j++) {
                if (appliancesFilter[i] === applianceDuplicates[j]) {
                    appliancesFilter.splice(i, 1)
                }
            }
        }


    ustensilsFilter = []

        for (let i = 0; i < displayedRecipes.length; i++) {
            for (let j = 0; j < displayedRecipes[i]['ustensils'].length; j++) {
                const ustensil = filterFormat(displayedRecipes[i]['ustensils'][j])
                ustensilsFilter.push(ustensil)
            }
        }

        ustensilsFilter.sort()

        let ustensilsDuplicates = []

        for (let i = 0; i < ustensilsFilter.length; i++) {
            if (ustensilsFilter[i] === ustensilsFilter[i+1]) {
                ustensilsDuplicates.push(ustensilsFilter[i])
            }
        }
        const selectedUstensils = document.querySelectorAll('.tags-section > div[tag-source="ustensils"]')
        selectedUstensils.forEach(tag => ustensilsDuplicates.push(tag.getAttribute('tag-name')))
        for (let i = 0; i < ustensilsFilter.length; i++) {
            for (let j = 0; j < ustensilsDuplicates.length; j++) {
                if (ustensilsFilter[i] === ustensilsDuplicates[j]) {
                    ustensilsFilter.splice(i, 1)
                }
            }
        }

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

    for (let i = 0; i < recipes.length; i++) {
        const recipeModel = recipeFactory(recipes[i])
        const recipeCardDOM = recipeModel.getRecipeCardDOM();
        recipesSection.appendChild(recipeCardDOM);
    }

    tagsFilterUpdate(recipes)

    for (let i = 0; i < ingredientsFilter.length; i++) {
        const ingredientModel = tagsListsFactory(ingredientsFilter[i], 'ingredients');
        const ingredientDOM = ingredientModel.getIngredientDOM();
        ingredientsList.appendChild(ingredientDOM);
    }

    for (let i = 0; i < appliancesFilter.length; i++) {
        const applianceModel = tagsListsFactory(appliancesFilter[i], 'appliances');
        const applianceDOM = applianceModel.getIngredientDOM();
        appliancesList.appendChild(applianceDOM);
    }

    for (let i = 0; i < ustensilsFilter.length; i++) {
        const ustensilModel = tagsListsFactory(ustensilsFilter[i], 'ustensils');
        const ustensilDOM = ustensilModel.getIngredientDOM();
        ustensilsList.appendChild(ustensilDOM);
    }

}

function init() {
    displayData(recipes);
}

init();



