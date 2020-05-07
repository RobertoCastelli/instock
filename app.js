/**
 * TODO:
 * 2 decimali dopo la virgola
 * limitare numero lettere input
 */

// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBOEO8T6kPiKf4OQJhhQEC-3nojny4XlJQ",
  authDomain: "warehouse-e43ce.firebaseapp.com",
  itembaseURL: "https://warehouse-e43ce.firebaseio.com",
  projectId: "warehouse-e43ce",
  storageBucket: "warehouse-e43ce.appspot.com",
  messagingSenderId: "534322749344",
  appId: "1:534322749344:web:c62ae281264f1967f20ec5",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Global Variables
let table = document.querySelector("#table");
let inputSearch = document.getElementById("myInput");
let subtotal = document.querySelector("#subtotale");
let index = "";

// Buttons Variables
let btnModal = document.querySelector(".btn-open-modal");
let btnSend = document.querySelector(".btn-send");
let btnBack = document.querySelector(".btn-back");
let btnDelete = document.querySelector(".btn-delete");
let btnEdit = document.querySelector(".btn-edit");

// Modal Variables
let modal = document.querySelector(".modal-container");
let modalArticolo = document.querySelector("#modal-articolo");
let modalDescrizione = document.querySelector("#modal-descrizione");
let modalFornitore = document.querySelector("#modal-fornitore");
let modalDdt = document.querySelector("#modal-ddt");
let modalCantiere = document.querySelector("#modal-cantiere");
let modalEuro = document.querySelector("#modal-euro");
let modalQuantita = document.querySelector("#modal-quantita");

// Get TimeStamp from DB
let timeNow = new Date(
  firebase.firestore.Timestamp.now().seconds * 1000
).toLocaleDateString();

// Sum all column 8 import  TOTALE
function handleTotals() {
  let total = 0;
  let tds = table.querySelectorAll("#table > tbody > tr > td:nth-child(9)");
  tds.forEach((el) => (total += parseFloat(el.textContent)));
  subtotal.innerText = total;
}

// Get Data from DB
function getData() {
  db.collection("articoli")
    .orderBy("descrizione", "asc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        populateTable(doc.data(), doc.id);
      });
    })
    .then(handleTotals);
}
getData();

// Send Data to DB
btnSend.addEventListener("click", (e) => {
  e.preventDefault();
  db.collection("articoli")
    .add({
      articolo: modalArticolo.value.toUpperCase(),
      descrizione: modalDescrizione.value.toUpperCase(),
      fornitore: modalFornitore.value.toUpperCase(),
      ddt: modalDdt.value,
      time: timeNow,
      cantiere: modalCantiere.value.toUpperCase(),
      euro: modalEuro.value,
      quantita: modalQuantita.value,
    })
    .then(() => {
      modal.style.display = "none";
      location.reload();
    })
    .catch((err) => console.log(err.message));
});

// Populate Table with DB Data
const populateTable = (data, id) => {
  let tableBody = table.querySelector("tbody");
  let tableData = [
    `<tbody>
      <tr id=${id}>
        <td>${data.articolo.toUpperCase()}</td>
        <td>${data.descrizione.toUpperCase()}</td>
        <td>${data.fornitore.toUpperCase()}</td>
        <td>${data.ddt.toUpperCase()}</td>
        <td>${data.cantiere.toUpperCase()}</td>
        <td>${data.time}</td>
        <td>${data.quantita}</td>
        <td>${data.euro}</td>
        <td class="totale">${data.quantita * data.euro}</td>
      </tr>  
    </tbody>`,
  ];
  tableBody.innerHTML += tableData;
};

// Modal ON button
btnModal.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

// Modal OFF button
btnBack.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "none";
  location.reload();
});

// Modal DELETE button
btnDelete.addEventListener("click", (e) => {
  e.preventDefault();
  db.collection("articoli")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id == index) {
          db.collection("articoli")
            .doc(doc.id)
            .delete()
            .then(() => {
              modal.style.display = "none";
              location.reload();
            })
            .catch((err) => console.log(err.messaggio));
        }
      });
    });
});

// Modal EDIT button
btnEdit.addEventListener("click", (e) => {
  e.preventDefault();
  db.collection("articoli")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id == index) {
          db.collection("articoli")
            .doc(doc.id)
            .set({
              articolo: modalArticolo.value.toUpperCase(),
              descrizione: modalDescrizione.value.toUpperCase(),
              fornitore: modalFornitore.value.toUpperCase(),
              ddt: modalDdt.value,
              cantiere: modalCantiere.value.toUpperCase(),
              euro: modalEuro.value,
              quantita: modalQuantita.value,
              time: timeNow,
            })
            .then(() => {
              modal.style.display = "none";
              location.reload();
            })
            .catch((err) => console.log(err.messaggio));
        }
      });
    });
});

// Modal Import Data from Table
table.addEventListener("click", (e) => {
  let tr = e.target.closest("tr");
  index += tr.id;
  db.collection("articoli")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        if (doc.id == index) {
          modal.style.display = "flex";
          modalArticolo.value = doc.data().articolo;
          modalDescrizione.value = doc.data().descrizione;
          modalFornitore.value = doc.data().fornitore;
          modalDdt.value = doc.data().ddt;
          modalCantiere.value = doc.data().cantiere;
          modalEuro.value = doc.data().euro;
          modalQuantita.value = doc.data().quantita;
        }
      });
    });
});

// Search-Filter Data from Table
inputSearch.onkeyup = () => {
  let total = [];
  let filter = inputSearch.value.toUpperCase();
  const trs = document.querySelectorAll(
    "#table tr:not(.table-header):not(.table-footer)"
  );
  trs.forEach((tr) => {
    if (
      // Find input in TDs
      [...tr.children].find((td) => td.innerHTML.toUpperCase().includes(filter))
    ) {
      // Display if filtered
      tr.style.display = "";
      // Get all TDs import of column 8
      let tds = parseInt(tr.children[8].textContent);
      total.push(tds);
    } else {
      // Don't display if not filtered
      tr.style.display = "none";
      subtotal.innerText = "Nessun articolo in lista";
    }
  });
  // Sum all TDs import column 8
  subtotal.innerText = total.reduce((a, b) => a + b);
};
