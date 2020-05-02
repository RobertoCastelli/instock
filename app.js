// Firebase configuration
var firebaseConfig = {
apiKey: "AIzaSyBOEO8T6kPiKf4OQJhhQEC-3nojny4XlJQ",
authDomain: "warehouse-e43ce.firebaseapp.com",
itembaseURL: "https://warehouse-e43ce.firebaseio.com",
projectId: "warehouse-e43ce",
storageBucket: "warehouse-e43ce.appspot.com",
messagingSenderId: "534322749344",
appId: "1:534322749344:web:c62ae281264f1967f20ec5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore() 



// Variables
let table = document.getElementById('table')
// Modal
let btnModal = document.querySelector('.btn-open-modal')
let btnInvia = document.querySelector('.btn-invia')
let btnIndietro = document.querySelector('.btn-back')
let modal = document.querySelector('.modal-container')
let modalArticolo = document.querySelector('#modal-articolo')
let modalDescrizione = document.querySelector('#modal-descrizione')
let modalFornitore = document.querySelector('#modal-fornitore')
let modalDdt= document.querySelector('#modal-ddt')
let modalEuro = document.querySelector('#modal-euro')
let modalQuantita = document.querySelector('#modal-quantita')

// Get Data from DB
function getData() {
    db.collection('articoli').get().then(snapshot => {
        snapshot.forEach(doc => {
            populateTable(doc.data())
        })
    })
}
getData()

// Send Data to DB
btnInvia.addEventListener('click', e => {
    e.preventDefault()
    db.collection('articoli').add({
        articolo: modalArticolo.value,
        descrizione: modalDescrizione.value,
        fornitore: modalFornitore.value,
        ddt: modalDdt.value,
        euro: modalEuro.value,
        quantita: modalQuantita.value
    })
        .then(() => {
            console.log('dati inviati correttamente')
            modal.style.display = 'none'            
        })
        .catch(err => console.log(err.message))
})

// Populate table with DB
const populateTable = data => {
    let row = table.insertRow(1)
    let cell1 = row.insertCell(0)
    let cell2 = row.insertCell(1)
    let cell3 = row.insertCell(2)
    let cell4 = row.insertCell(3)
    let cell5 = row.insertCell(4)
    let cell6 = row.insertCell(5)
    let cell7 = row.insertCell(6)
    cell1.innerHTML = data.articolo
    cell2.innerHTML = data.descrizione
    cell3.innerHTML = data.fornitore
    cell4.innerHTML = data.ddt
    cell5.innerHTML = data.euro
    cell6.innerHTML = data.quantita
    cell7.innerHTML = data.euro * data.quantita
}

// Modal handle
btnModal.addEventListener('click', () => {
    modal.style.display = 'flex'
})
btnIndietro.addEventListener('click', () => {
    modal.style.display = 'none'
})

