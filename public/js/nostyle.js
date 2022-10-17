const form = document.getElementById("form-add");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const nama = e.target.elements.nama;
  const telp = e.target.elements.telp;
  const ukuran = e.target.elements.ukuran;
  const ref = firebase.database().ref("data-pelanggan").limitToLast(1);
  ref.once("value", function (snap) {
    const id = snap.val() !== null ? parseFloat(snap.key) + 1 : 1;
    const data = {};
    data[`data-pelanggan/${id}/`] = { nama: nama.value, telp: telp.value, ukuran: ukuran.value };
    firebase.database().ref().update(data).then(()=>{
      console.log('Document saved!');
      form.reset()
      nama.focus()
    });
  });
  return false;
});
