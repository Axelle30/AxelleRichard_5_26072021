/*Déclaration des variables globales*/

let teddiesURL = "http://localhost:3000/api/teddies/";
let furnitureURL = "http://localhost:3000/api/furniture/";
let camerasURL = "http://localhost:3000/api/cameras";
let sendToApiURL = "http://localhost:3000/api/teddies/order";

let categories = {
    teddies: [teddiesURL, "Ours en Peluche"],
    furniture: [furnitureURL, "Meubles en Chêne"],
    cameras: [camerasURL, "Caméras"]
};
let objectChoice = {
    categoriesUrl: "",
    objectIndex: "",
};

let order = {
    firstName: "",
    lastName: "",
    adress: "",
    city: "",
    email: "",
    products: []
};





/*Récupération des éléments du DOM index.html*/

let indexSection = document.getElementById("index-section");

/*Récupération des éléments du DOM product.html*/

let productDetailsSection = document.getElementById("product-details-section");
let productSelectSection = document.getElementById("product-select-section");
let productSelectCategories = document.getElementById("product-select-categories");
let productSelectProduct = document.getElementById("product-select-product");
let productPageChoiceText = document.getElementById("choice-text");
let productSelectProductDefault = document.getElementById("product-default-choice");
let productSelectCategoriesDefault = document.getElementById("categories-default-choice");
let productOrderButton = document.getElementById("product-order-button");

/*Fonction de communication avec l'API avec utilisation de la fonction de création de carte produit*/

function dataRecuperationByCategory(url){
    for (let i = 0; i < 5; i++){
        fetch(url)
        .then(function(res){
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(value){
            let object = value[i];
            let objectIndex = [i, url];
            indexProductCardConstructor(object, objectIndex);
        })
    }
}

/*Fonction de communication avec l'API prenant comme argument le numéro de l'objet à récupêrer et l'URL*/

function dataRecuperationByNumber(url, objectNumber){
    let output;
    fetch(url)
    .then(function(res){
        if (res.ok) {
            return res.json();
        }
    })
    .then(function(value){
        let object = value[objectNumber];
    })
}

/*Fonction de création de carte produit sur la page d'acceuil*/

function indexProductCardConstructor(object, objectIndex) {
    let newCard = document.createElement("div");
    let indexSectionFirstChild = indexSection.firstChild;
    indexSection.insertBefore(newCard, indexSectionFirstChild);
    newCard.innerHTML = '<div class="card col-3 bg-light">'+
    '<img src="'+ object.imageUrl +'" class="card-img-top"/>'+
    '<div class="card-body">'+
    '<h3 class="card-title text-center">' + object.name + '</h3>'+
    '<p class="card-text text-center">' + object.description + '<br/><strong>Prix: ' + object.price + '</strong>' +
    '<a href="product.html" class="btn btn-primary" role="button" id="'+object._id+'">Voir la fiche produit<i class="fas fa-arrow-right"></i></a>';
    let productPageLinkButton = document.getElementById(object._id);
    console.log(productPageLinkButton);
    productPageLinkButton.addEventListener('click',function(event){
        productPageParameter = objectIndex;
        console.log(objectIndex);
        event.stopPropagation();
        return productPageParameter;
    });
}
/*Fonction de création de menu déroulant sur page produit*/
function productPageSelectMenuConstructor(categories){
    /*Création du menu déroulant des catégories*/
    let categoriesStock;
    for (let i in categories) {
        categoriesStock = categories[i];
        let newSelectCategories = document.createElement("option");
        let productSelectCategoriesFirstChild = productSelectCategories.firstChild;
        productSelectCategories.insertBefore(newSelectCategories, productSelectCategoriesFirstChild);
        newSelectCategories.setAttribute("value", categoriesStock[0]);
        newSelectCategories.innerHTML = categoriesStock[1];
    }
    /*Fonction de création de menu déroulant de produit*/
    function productMenuConstructor(categoriesChoice){
        for(let i = 0; i < 5; i++){
            fetch(categoriesChoice)
            .then(function(res){
                if(res.ok){
                    return res.json();
                }
            })
            .then(function(value){
            let objectOption = value[i];
            let newSelectProduct = document.createElement("option");
            let productSelectProductFirstChild = productSelectProduct.firstChild;
            productSelectProduct.insertBefore(newSelectProduct, productSelectProductFirstChild);
            newSelectProduct.setAttribute("value",i);
            newSelectProduct.innerHTML = objectOption.name;
            })
            
        }
    }
    /*Récupération du choix de la catégorie et création du menu de choix de produit*/
    let categoriesChoice;
    productSelectCategories.addEventListener('change', function(event){
        categoriesChoice = productSelectCategories.value;
        productMenuConstructor(categoriesChoice);
        productSelectCategoriesDefault.remove();
    });
    /*Récupération du choix de produit et stockage dans l'objet objectChoice et "vidage" des élément d'attente de choix*/
    productSelectProduct.addEventListener('change',function(event){
        objectChoice.categoriesUrl = categoriesChoice;
        objectChoice.objectIndex = productSelectProduct.value;
        productPageChoiceText.innerHTML = "";
        productSelectProductDefault.remove();
        productOrderButton.innerHTML = "Choississez votre option !";
        productPageCardConstructor(objectChoice);
    });
}
/*Fonction d'envoi des produit vers l'API*/
function OrderSend(order){
    fetch(sendToApiURL, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body : JSON.stringify(order)
    });
}
/*Fonction de création de carte produit sur page produit*/

function productPageCardConstructor(object) {
    /*Récuperation des éléments HTML de la carte produit*/
    let productImage = document.getElementById("product-image");
    let productName = document.getElementById("product-name");
    let productDescription = document.getElementById("product-description");
    let productPrice = document.getElementById("product-price");
    let productCustomizeLabel = document.getElementById("product-customize-label");
    let productCustomizeChoice = document.getElementById("product-customize-choice");
    let productCustomizeDefault = document.getElementById("product-customize-default");
    
    /*Requete de récuperation de l'objet séléctionné*/
    fetch(object.categoriesUrl)
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function(value){
        /*Remplissage de la carte de produit*/
        let objectShow = value[object.objectIndex];
        console.log(objectShow);
        productImage.setAttribute("src", objectShow.imageUrl);
        productName.innerHTML = objectShow.name;
        productDescription.innerHTML = objectShow.description;
        productPrice.innerHTML = objectShow.price;
          /*Création des options de personnalisation*/
        let customizeOption;
        if (object.categoriesUrl == teddiesURL){
            customizeOption = objectShow.colors;
            productCustomizeLabel.innerHTML = "Couleurs disponibles :";
        } else if (object.categoriesUrl == camerasURL)  {
            customizeOption = objectShow.lenses;
            productCustomizeLabel.innerHTML = "Lentilles disponibles :";
        } else if (object.categoriesUrl == furnitureURL) {
            customizeOption = objectShow.varnish;
            productCustomizeLabel.innerHTML = "Vernis disponibles :";
        }
        for (i in customizeOption) {
            let newCustomizeOption = document.createElement("option");
            let productCustomizeChoiceFirstChild = productCustomizeChoice.firstChild;
            productCustomizeChoice.insertBefore(newCustomizeOption, productCustomizeChoiceFirstChild);
            newCustomizeOption.setAttribute("value", customizeOption[i]);
            newCustomizeOption.innerHTML = customizeOption[i];
        }
        if (customizeOption.length == 1){
            productCustomizeDefault.remove();
        }
        productCustomizeChoice.addEventListener('change', function(event){
            productCustomizeDefault.remove();
            productOrderButton.innerHTML = "Ajouter au panier ?";
        });
        /*Ecoute du clic du bouton et stockage de la commande dans le panier*/
        productOrderButton.addEventListener('click',function(event){
            order.products.push(objectShow.name);
            console.log(order);
        }) 

    })   
}

/*Execution des fonction d'affichage des produit sur la page d'acceuil avec test pour verifier si utilisateur sur index.html*/

if (!!document.getElementById("index-section") == true){
    dataRecuperationByCategory(teddiesURL);
    dataRecuperationByCategory(camerasURL);
    dataRecuperationByCategory(furnitureURL);
}

/*Execution de la fonction d'affichage du produit sur la page produit avec test pour verifier si utilisateur sur product.html*/

if(!!document.getElementById("product-select-section") == true){
    productPageSelectMenuConstructor(categories);
    /*La fonction de création de detail produit est executée lors du choix dans la fonction précédente*/
}

