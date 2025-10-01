// Referencias a elementos del DOM
const form = document.getElementById('socio-form');
const tableBody = document.getElementById('socio-table-body');
const idField = document.getElementById('id');
const errorDiv = document.getElementById('error-message'); // 🔴 mensaje de error

// Array para guardar socios en memoria (simulación sin backend)
let socios = [];

// Manejar envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const socio = {
    id: idField.value || Date.now(), // Si no hay id, generar uno
    nombre: document.getElementById('nombre').value,
    apellido: document.getElementById('apellido').value,
    dni: document.getElementById('dni').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    direccion: document.getElementById('direccion').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
  };

  // 🔴 Validación de duplicados (DNI o Email)
  const duplicado = socios.find(
    (s) =>
      (s.dni === socio.dni || s.email === socio.email) &&
      s.id != socio.id // excluir al mismo si es edición
  );

  if (duplicado) {
    errorDiv.textContent = "⚠️ Ya existe un socio con este DNI o Email.";
    return; // detener creación
  }

  errorDiv.textContent = ""; // limpiar mensajes previos

  if (idField.value) {
    // Editar socio existente
    socios = socios.map((s) => (s.id == socio.id ? socio : s));
  } else {
    // Agregar nuevo socio
    socios.push(socio);
  }

  renderTable();
  resetForm();
});

// Renderizar la tabla
function renderTable() {
  tableBody.innerHTML = '';
  socios.forEach((socio) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${socio.nombre}</td>
      <td>${socio.apellido}</td>
      <td>${socio.dni}</td>
      <td>${socio.email}</td>
      <td>
        <button onclick="editSocio(${socio.id})">Editar</button>
        <button onclick="deleteSocio(${socio.id})">Eliminar</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Editar socio
function editSocio(id) {
  const socio = socios.find((s) => s.id == id);
  if (!socio) return;

  idField.value = socio.id;
  document.getElementById('nombre').value = socio.nombre;
  document.getElementById('apellido').value = socio.apellido;
  document.getElementById('dni').value = socio.dni;
  document.getElementById('email').value = socio.email;
  document.getElementById('telefono').value = socio.telefono;
  document.getElementById('direccion').value = socio.direccion;
  document.getElementById('fechaNacimiento').value = socio.fechaNacimiento;
}

// Eliminar socio
function deleteSocio(id) {
  socios = socios.filter((s) => s.id != id);
  renderTable();
}

// Resetear formulario
function resetForm() {
  form.reset();
  idField.value = '';
  errorDiv.textContent = ""; // limpiar error al resetear
}
