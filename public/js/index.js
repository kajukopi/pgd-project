const db = firebase.database();

const formAddKaryawan = document.getElementById("form-add-karyawan");
const formEditKaryawan = document.getElementById("form-edit-karyawan");

const tableKaryawan = document.getElementById("table-karyawan");
const tableKaryawanBody = tableKaryawan.querySelector("tbody");

const modalKaryawan = new bootstrap.Modal(document.getElementById("modalKaryawan"), {
  backdrop: "static",
  keyboard: false,
  focus: true,
});

function modalHide() {
  modalKaryawan.toggle();
}

function editKaryawan(id) {
  formEditKaryawan.setAttribute("data-id", id);
  modalKaryawan.toggle();
  const ref = db.ref(`data-karyawan/${id}/`);
  ref.once("value", function (snap) {
    formEditKaryawan.querySelector("#jenisKelaminEdit").value = snap.val().jenisKelamin;
    formEditKaryawan.querySelector("#tanggalLahirEdit").value = snap.val().tanggalLahir;
    formEditKaryawan.querySelector("#namaKaryawanEdit").value = snap.val().namaKaryawan;
  });
}

function deleteKaryawan(id) {
  const updates = {};
  updates[`data-karyawan/${id}/`] = null;
  firebase
    .database()
    .ref()
    .update(updates)
    .then(() => {
      document.getElementById(`${id}`).remove();
    });
}

const checkIndex = db.ref("data-karyawan").limitToLast(1);

formAddKaryawan.addEventListener("submit", function (e) {
  e.preventDefault();
  const namaKaryawan = e.target.elements.namaKaryawan;
  const tanggalLahir = e.target.elements.tanggalLahir;
  const jenisKelamin = e.target.elements.jenisKelamin;

  checkIndex.once("value", function (snap) {
    // Cek id untuk data terakhir
    const id = snap.val() !== null ? parseFloat(Object.keys(snap.val())[0]) + 1 : 1;

    // object json
    const data = {};

    // insert data ke object
    data[`data-karyawan/${id}/`] = {
      namaKaryawan: namaKaryawan.value,
      tanggalLahir: tanggalLahir.value,
      jenisKelamin: jenisKelamin.value,
    };

    // code untuk mengupdate object json yang sudah di isi sebelumnya

    db.ref()
      .update(data)
      .then(function () {
        alert("Document saved!");
        formAddKaryawan.reset();
        namaKaryawan.focus();
      })
      .catch(function (error) {
        alert(error);
        namaKaryawan.focus();
      });
  });

  return false;
});

formEditKaryawan.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = formEditKaryawan.getAttribute("data-id");

  // object json
  const data = {};

  // insert data ke object
  data[`data-karyawan/${id}/`] = {
    namaKaryawan: formEditKaryawan.querySelector("#namaKaryawanEdit").value,
    tanggalLahir: formEditKaryawan.querySelector("#tanggalLahirEdit").value,
    jenisKelamin: formEditKaryawan.querySelector("#jenisKelaminEdit").value,
  };

  db.ref()
    .update(data)
    .then(function () {
      alert("Document saved!");
      formEditKaryawan.reset();
      modalHide();
      namaKaryawan.focus();
    })
    .catch(function (error) {
      alert(error);
      formEditKaryawan.querySelector("#namaKaryawanEdit").focus();
    });

  return false;
});

const listening = db.ref("data-karyawan");

listening.on("child_added", function (snap) {
  const sex = snap.val().jenisKelamin === "m" ? "Pria" : "Wanita";
  tableKaryawanBody.insertAdjacentHTML(
    "beforeend",
    `
  <tr id="${snap.key}">
    <th class="text-center" scope="row">${snap.key}</th>
    <td  style="white-space:nowrap;">${snap.val().namaKaryawan}</td>
    <td class="text-center" style="white-space:nowrap;">${snap.val().tanggalLahir}</td>
    <td class="text-center" style="white-space:nowrap;">${sex}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-warning btn-sm" onclick="(editKaryawan(${snap.key}))">Edit</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="(deleteKaryawan(${snap.key}))">Delete</button>
      </div>
    </td>
  </tr>
  `
  );
});

listening.on("child_changed", function (snap) {
  const sex = snap.val().jenisKelamin === "m" ? "Pria" : "Wanita";

  document.getElementById(`${snap.key}`).innerHTML = `
    <th class="text-center" scope="row">${snap.key}</th>
    <td  style="white-space:nowrap;">${snap.val().namaKaryawan}</td>
    <td class="text-center"  style="white-space:nowrap;">${snap.val().tanggalLahir}</td>
    <td class="text-center"  style="white-space:nowrap;">${sex}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-warning btn-sm" onclick="(editKaryawan(${snap.key}))">Edit</button>
        <button type="button" class="btn btn-danger btn-sm" onclick="(deleteKaryawan(${snap.key}))">Delete</button>
      </div>
    </td>
  `;
});
