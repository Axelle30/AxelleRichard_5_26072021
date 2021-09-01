/*Variable d'envoi de test A SUPPRIMER QUAND FONCTION SEND OK*/

/*let orderTest = {
    contact: {
        firstName: "Axelle",
        lastName: "Richard",
        address: "Rue",
        city: "Har",
        email: "Efdeznoi@gzmeo.com",
    },
    products: ["5beaaf2e1c9d440000a57d9a", "5beaaf2e1c9d440000a57d9a", "5beaaf2e1c9d440000a57d9a"]

};*/
let contact = {
    firstName: "",
        lastName: "",
        address: "",
        city: "",
        email: "",
} 
/*let products = ["5beaaf2e1c9d440000a57d9a", "5beaaf2e1c9d440000a57d9a", "5beaaf2e1c9d440000a57d9a"];*/


/*Récupération des éléments du DOM basket.html*/

let basketForm = document.getElementById("basket-form");
let basketList = document.getElementById("basket-list");

/*Fonction de récuperation des données du formulaire*/

function formDataStorage(){
    /*Récuperation des éléments DOM du formulaire*/
    let firstName = document.getElementById("first-name");
    let lastName = document.getElementById("last-name");
    let city = document.getElementById("city");
    let address = document.getElementById("address");
    let email = document.getElementById("email");
    let submitButton = document.getElementById("form-submit");
    /*Ecoute du clic sur le bouton submit*/
    submitButton.addEventListener('click', function(event){
        contact.firstName = firstName.value;
        contact.lastName = lastName.value;
        contact.city = city.value;
        contact.address = address.value;
        contact.email = email.value;
        event.preventDefault();
        console.log(contact);
    })
}

formDataStorage();


