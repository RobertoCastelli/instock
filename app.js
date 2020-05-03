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

// Variables
let table = document.getElementById("table");
let inputSearch = document.getElementById("myInput");
let index = "";

let btnModal = document.querySelector(".btn-open-modal");
let btnSend = document.querySelector(".btn-send");
let btnBack = document.querySelector(".btn-back");
let btnDelete = document.querySelector(".btn-delete");
let btnEdit = document.querySelector(".btn-edit");

let modal = document.querySelector(".modal-container");
let modalArticolo = document.querySelector("#modal-articolo");
let modalDescrizione = document.querySelector("#modal-descrizione");
let modalFornitore = document.querySelector("#modal-fornitore");
let modalDdt = document.querySelector("#modal-ddt");
let modalEuro = document.querySelector("#modal-euro");
let modalQuantita = document.querySelector("#modal-quantita");

// Get Data from DB
function getData() {
  db.collection("articoli")
    .orderBy("descrizione", "desc")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        populateTable(doc.data(), doc.id);
      });
    });
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
      euro: modalEuro.value,
      quantita: modalQuantita.value,
    })
    .then(() => {
      modal.style.display = "none";
      location.reload();
    })
    .catch((err) => console.log(err.message));
});

// Populate Table with DB
const populateTable = (data, id) => {
  let row = table.insertRow(1);
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  let cell3 = row.insertCell(2);
  let cell4 = row.insertCell(3);
  let cell5 = row.insertCell(4);
  let cell6 = row.insertCell(5);
  let cell7 = row.insertCell(6);
  row.setAttribute("id", id);
  cell1.innerHTML = data.articolo.toUpperCase();
  cell2.innerHTML = data.descrizione.toUpperCase();
  cell3.innerHTML = data.fornitore.toUpperCase();
  cell4.innerHTML = data.ddt.toUpperCase();
  cell5.innerHTML = data.euro;
  cell6.innerHTML = data.quantita;
  cell7.innerHTML = data.euro * data.quantita;
};

// Modal Button ON
btnModal.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "flex";
});

// Modal Button OFF
btnBack.addEventListener("click", (e) => {
  e.preventDefault();
  modal.style.display = "none";
  location.reload();
});

// Modal Button DELETE
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

// Modal Button EDIT
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
              euro: modalEuro.value,
              quantita: modalQuantita.value,
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

// Modal Import Data
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
          modalEuro.value = doc.data().euro;
          modalQuantita.value = doc.data().quantita;
        }
      });
    });
});

inputSearch.onkeyup = () => {
  let filter = inputSearch.value.toUpperCase();
  const trs = document.querySelectorAll("#table tr:not(.table-header)");
  trs.forEach(
    (tr) =>
      (tr.style.display = [...tr.children].find((td) =>
        td.innerHTML.toUpperCase().includes(filter)
      )
        ? ""
        : "none")
  );
};

// input.onkeyup = () => {
//   let tr = document.querySelectorAll("tr");
//   tr.forEach((item) => {
//     console.log(item.textContent.toUpperCase().indexOf(input));
//     if (item.textContent.toUpperCase().indexOf(filter) !== -1) {
//       item.closest("tr").style.display = "";
//     } else {
//       item.closest("tr").style.display = "none";
//     }
//   });
// };
