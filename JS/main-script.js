/*Déclaration des variables globales*/

let teddiesURL = "http://localhost:3000/api/teddies/";
let furnitureURL = "http://localhost:3000/api/furniture/";
let camerasURL = "http://localhost:3000/api/cameras";
let urlList = ["http://localhost:3000/api/teddies/"];
let sendUrl = "http://localhost:3000/api/teddies/order";

let objectIdLocal;
let totalPriceLocal = 0;
let unitPriceArray = [];
let basketNameArray = [];

let categories = {
    teddies: [teddiesURL, "Ours en Peluche", "couleurs disponibles"],
    /*furniture: [furnitureURL, "Meubles en Chêne", "vernis disponibles"],
    cameras: [camerasURL, "Caméras", "lentilles disponibles"]*/
};
let objectChoice = {
    categoriesUrl: "",
    objectIndex: "",
};

let localProduct = [];

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


/*Récupération des éléments du DOM checkup.html*/

let checkupSection = document.getElementById("checkup-section");
let checkupPrice = document.getElementById("checkup-price");
let checkupOrderId = document.getElementById("checkup-order-id");
let checkupName = document.getElementById("checkup-name");
let checkupEmail = document.getElementById("checkup-email");

/*Fonction affichant une erreur si problème avec le server*/

function errorDisplay(section){
    section.innerHTML = '<div class="card container text-center mx-auto">'+
    '<div class="card-body">'+
    '<h2 class="card-title text-center">Désolé pour le dérangement !</h2>'+
    '<p class="card-text text-center">Une erreur avec le servie est survenue<br/> Veuillez réessayer ulterieurement <br/> Merci pour votre compréhension</p>'+
    '</div>';

}

/*Fonction de communication avec l'API avec utilisation de la fonction de création de carte produit*/

function indexDataRecuperation(urlList){
    for (i in urlList) {
        let url = urlList[i];
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
            .catch(function(){
                errorDisplay(indexSection)
            })
        }
    }
}


/*Fonction de communication avec l'API prenant comme argument le numéro de l'objet à récupêrer et l'URL*/

function dataRecuperationByNumber(url, objectNumber){
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
/*Fonction de calcul du prix total des articles et stockage dans LocalStorage*/

function priceTotalizer(price) {
    totalPriceLocal += price;
    console.log(totalPriceLocal);
    localStorage.removeItem('totalPrice');
    localStorage.setItem('totalPrice', totalPriceLocal);
}
/*Fonction de création de carte produit sur la page d'acceuil*/

function indexProductCardConstructor(object, objectIndex) {
    let newCard = document.createElement("div");
    let indexSectionFirstChild = indexSection.firstChild;
    indexSection.insertBefore(newCard, indexSectionFirstChild);
    newCard.innerHTML = '<div class="card col bg-light product-card">'+
    '<img src="'+ object.imageUrl +'" class="card-img-top img-fluid img-resize"/>'+
    '<div class="card-body">'+
    '<h3 class="card-title text-center">' + object.name + '</h3>'+
    '<p class="card-text text-center">' + object.description + '<br/><strong>Prix: ' + object.price + '</strong></p>' +
    '<a href="product.html" class="btn btn-primary" role="button" id="'+object._id+'">Voir la fiche produit<i class="fas fa-arrow-right"></i></a>';
    let productPageLinkButton = document.getElementById(object._id);
    productPageLinkButton.addEventListener('click',function(event){
        localStorage.setItem("objectId", object._id);
        productPageParameter = objectIndex;
        console.log(objectIdLocal);
        event.stopPropagation();
    });
}
/*Fonction de création de menu déroulant sur page produit*/
function productPageSelectMenuConstructor(categories){
    /*Création du menu déroulant des catégories*/
    /*let categoriesStock;
    for (let i in categories) {
        categoriesStock = categories[i];
        let newSelectCategories = document.createElement("option");
        let productSelectCategoriesFirstChild = productSelectCategories.firstChild;
        productSelectCategories.insertBefore(newSelectCategories, productSelectCategoriesFirstChild);
        newSelectCategories.setAttribute("value", categoriesStock[0]);
        newSelectCategories.innerHTML = categoriesStock[1];
    }*/
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
    /* A DECOMMENTER SI PLUSIEURES CATEGORIES Récupération du choix de la catégorie et création du menu de choix de produit*/
    /*let categoriesChoice;
    productSelectCategories.addEventListener('change', function(event){
        categoriesChoice = productSelectCategories.value;
        productMenuConstructor(categoriesChoice);
        productSelectCategoriesDefault.remove();
    });*/
    productMenuConstructor(urlList);
    /*Récupération du choix de produit et stockage dans l'objet objectChoice et "vidage" des élément d'attente de choix*/
    productSelectProduct.addEventListener('change',function(event){
        objectChoice.categoriesUrl = urlList; /*a remplacer par categoriesChoice si plusieures categories*/
        objectChoice.objectIndex = productSelectProduct.value;
        productPageChoiceText.innerHTML = "";
        productSelectProductDefault.remove();
        productOrderButton.innerHTML = "Choississez votre option !";
        productPageCardConstructor(objectChoice);
    });

}
/*Fonction d'envoi des produit vers l'API*/
function orderSend(contact, products) {
    fetch("http://localhost:3000/api/teddies/order",
                {
                    headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({contact, products})
                })

}
/*Fonction de création de carte produit sur page produit*/
function linkProductPageCardConstructor (objectIdLocal) {
    /*Récuperation des éléments HTML de la carte produit*/
    let productImage = document.getElementById("product-image");
    let productName = document.getElementById("product-name");
    let productDescription = document.getElementById("product-description");
    let productPrice = document.getElementById("product-price");
    let productCustomizeLabel = document.getElementById("product-customize-label");
    let productCustomizeChoice = document.getElementById("product-customize-choice");
    let productCustomizeDefault = document.getElementById("product-customize-default");
    productOrderButton.innerHTML = "Ajouter au panier ?"
    fetch("http://localhost:3000/api/teddies/"+objectIdLocal)
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function(value){
        /*Remplissage de la carte de produit*/
        let objectShow = value;
        console.log(objectShow);
        productImage.setAttribute("src", objectShow.imageUrl);
        productName.innerHTML = objectShow.name;
        productDescription.innerHTML = objectShow.description;
        productPrice.innerHTML = "Prix : &nbsp" + objectShow.price;
          /*Création des options de personnalisation*/
        let customizeOption;
            productCustomizeLabel.innerHTML = "Couleurs disponibles :";
        for (i in customizeOption) {
            let newCustomizeOption = document.createElement("option");
            let productCustomizeChoiceFirstChild = productCustomizeChoice.firstChild;
            productCustomizeChoice.insertBefore(newCustomizeOption, productCustomizeChoiceFirstChild);
            newCustomizeOption.setAttribute("value", customizeOption[i]);
            newCustomizeOption.innerHTML = customizeOption[i];
        }
        productCustomizeChoice.addEventListener('change', function(event){
            productCustomizeDefault.remove();
            productOrderButton.innerHTML = "Ajouter au panier ?";
        });

})
.catch(function(){
    errorDisplay(productSelectSection);
});
};

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
        productPrice.innerHTML = "Prix : &nbsp" + objectShow.price;
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
            localProduct.push(objectShow._id);
            /*localProduct.setItem(objectShow.name);*/
            console.log(localProduct);
            event.preventDefault();
            localStorage.setItem('basket', localProduct);
            priceTotalizer(objectShow.price);
            unitPriceArray.push(objectShow.price);
            basketNameArray.push(objectShow.name);
            console.log('array', unitPriceArray)
            localStorage.setItem('unitPrice', unitPriceArray);
            localStorage.setItem('basketName', basketNameArray);
            let tempBasketName = localStorage.getItem('basketName');
            let tempUnitPrice = localStorage.getItem('unitPrice');
            let tempBasket = localStorage.getItem('basket');
            let tempPrice = localStorage.getItem('totalPrice');
            console.log(tempBasket, tempPrice);
            console.log(tempBasketName, tempUnitPrice);
            /*Mise à jour du badge de comptage d'élément dans le panier à l'ajout de nouveaux éléments*/
            itemCounterFiller();
        }) 

    })   
}
/*Fonction de découpage de la valeurs basket dans localStorage*/
function localStorageSplitter(keyName){
    let temp = localStorage.getItem(keyName);
    let array = temp.split(',');
    return array;
}
/*Création de la liste du panier sur basket.html*/
function basketListConstructor(){
    let basketList = document.getElementById("basket-list");
    let basket = localStorageSplitter('basketName');
    let unitPrice = localStorageSplitter('unitPrice');
    let basketListFirstChild = basketList.firstChild;
    /*Création de la liste des produits dans le panier*/
    for (let i in basket) {
        let newBasketProduct = document.createElement("div");
        basketList.insertBefore(newBasketProduct, basketListFirstChild);
        newBasketProduct.innerHTML = '<div class="basket-list-block card mb-2"'+
        '<div class="card-body">'+
        '<div class="basket-list-name card-title ms-5 pt-3"><p class="h3">' + basket[i] + '</p></div>'+
        '<div class="basket-list-price mb-3 card-text text-end h4 pe-5"><strong>PU : '+ unitPrice[i] +'</strong></div>'+
        '</div></div>';
    }
    /*Création des boutons de vidage de panier*/
    let newBasketListDeleteElement = document.createElement("div");
    basketList.insertBefore(newBasketListDeleteElement, basketListFirstChild);
    newBasketListDeleteElement.innerHTML ='<button id="basket-delete-button"class="btn btn-primary container-fluid my-5"><i class="fas fa-trash"></i>&nbsp Vider le panier ?</button>'+
    '<div id="delete-alert-container"></div>';

    /*Affichage du prix total*/
    let newTotalPrice = document.createElement("div");
    basketList.insertBefore(newTotalPrice, basketListFirstChild);
    newTotalPrice.innerHTML = '<p class="mb-5 h2"><strong>Prix total du panier : ' + localStorage.getItem('totalPrice') + '</strong></p>'
}

/*Fonction d'affichage de la validation checkup.html*/
function checkupDisplay(order){
    checkupOrderId.innerHTML = order.orderId;
}

/*Fonction de remplissage du badge comptant le nombre d'éléments dans le panier*/
function itemCounterFiller() {
    let itemBadge = document.getElementById("basket-item-counter");
    let itemCounter = localStorage.getItem('basket').split(',');
    itemBadge.innerHTML = itemCounter.length;
}

/*Fonction d'envoi de commande */
function sendOrdertoApi() {
    let basketForm = document.getElementById("basket-form");
    let firstName = document.getElementById("first-name");
    let lastName = document.getElementById("last-name");
    let city = document.getElementById("city");
    let address = document.getElementById("address");
    let email = document.getElementById("email");
    let formAlert = document.getElementById("form-alert");

    /*Mise en tableau des élément dans panier*/
    let products = [];
    let temp = localStorage.getItem("basket").split(',');
    for (i in temp){
        products.push(temp[i])
        console.log(products);
    }
    /*Création et remplissage de la constante order à envoyer à l'API*/
    const order = {
        contact: {
            firstName : firstName.value,
            lastName : lastName.value,
            address: address.value,
            city: city.value,
            email: email.value
        },
        products: products,
    }
    /*Stockage dans le localStorage pour affichage sur checkup.html*/
    localStorage.setItem("firstName", firstName.value)

    /*Constante parametre requête*/
    const parameter = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {"Content-Type": "application/Json"}
    }
    /*Envoi des élément à l'API*/
    console.log(order);
    fetch("http://localhost:3000/api/teddies/order", parameter)
    .then(function(res){
        if(res.ok) {
            formAlert.innerHTML = '<div class="alert alert-succes">'+
            '<p>Votre commande a bien été enregistrée, cliquez sur le bouton ci-dessous pour accéder à votre numéro de commande</p>'+
            '<a href="checkup.html"><button id="checkup-button"class="btn btn-success">Aller vers la page de confirmation</button></a>'+
            '</div>';
            return res.json();
        }
    })
    .then(function(value){
        localStorage.setItem("orderId", value.orderId);
    })
    .catch(function(){
        formAlert.innerHTML = '<div class="alert alert-danger">'+
        '<p>Une erreur est survenue veuillez réessayer ultérieurement</p>'+
        '</div>';
    })
}
/*Execution des fonction d'affichage des produit sur la page d'acceuil avec test pour verifier si utilisateur sur index.html*/

if (!!document.getElementById("index-section") == true){
    localStorage.removeItem("objectId");
    let temp = localStorage.getItem("objectId");
    console.log(temp);
    indexDataRecuperation(urlList);
}

/*Execution de la fonction d'affichage du produit sur la page produit avec test pour verifier si utilisateur sur product.html*/

if(!!document.getElementById("product-select-section") == true){
    objectIdLocal = localStorage.getItem("objectId");
    console.log(objectIdLocal);
    if (objectIdLocal != null) {
        linkProductPageCardConstructor(objectIdLocal);
    }
    productPageSelectMenuConstructor(categories);
    /*La fonction de création de detail produit est executée lors du choix dans la fonction précédente*/
}

/*Execution de la fonction de récupération des données du formulaire sur basket.html*/

if(!!document.getElementById("basket-list") == true){
    let basketList = document.getElementById("basket-list");
    /*Fonction d'affichage de message si panier vide*/
    function emptyBasketMessage(){
        basketList.innerHTML= '';
        basketList.innerHTML = '<p class="h3 mb-3 text-center">Votre panier est vide</p>'+
        '<a href="product.html"><button class="btn btn-primary container-fluid mt-3">Allez sur la page produit &nbsp; <i class="fas fa-arrow-right"></i></button></a>';
    }
    if(localStorage.getItem('basket') == null) {
        emptyBasketMessage();
    }
    else {
        basketListConstructor();
    }
    if(!!document.getElementById("basket-delete-button") == true) {
        document.getElementById("basket-delete-button").addEventListener('click', function(event){
            event.preventDefault;
            let deleteAlertContainer = document.getElementById("delete-alert-container");
            deleteAlertContainer.innerHTML = '<div class="alert alert-danger">'+
            '<p>Voulez vous vraiment supprimer le panier ?</p>'+
            '<button id="yes-button"class="btn btn-success">Oui</button>'+
            '</div>';
            let yesButton = document.getElementById("yes-button");
            yesButton.addEventListener('click', function(event){
                localStorage.clear();
                deleteAlertContainer.innerHTML = '<div class="alert alert-success"> Votre panier à bien été supprimé !'+
                '<div>';
                emptyBasketMessage();
            });
            
        });
    }
    let submitButton = document.getElementById("form-submit");
    submitButton.addEventListener('click', function(){
        sendOrdertoApi();
    });
}

/*Execution de la fonction d'affichage checkup.html*/

if(!!document.getElementById("checkup-section") == true){
    checkupPrice.innerHTML = localStorage.getItem("totalPrice");
    checkupName.innerHTML = localStorage.getItem("firstName");
    checkupOrderId.innerHTML = localStorage.getItem("orderId");
    
    document.getElementById("checkup-index-button").addEventListener('click', function(){
        localStorage.clear();
        window.location = "index.html";
    });
}

/*Execution de la fonction de remlpissage du badge de quantité d'éléments dans le panier*/

itemCounterFiller();
