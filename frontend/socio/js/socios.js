// =========================================
// GESTIÓN DE SOCIOS (ADMIN)
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initSociosModule();
});

function initSociosModule() {
    // Referencias a elementos del DOM
    const form = document.getElementById('socio-form');
    const tableBody = document.getElementById('socio-table-body');
    const idField = document.getElementById('id');
    const errorDiv = document.getElementById('error-message');

    // Array para guardar socios en memoria (simulación sin backend)
    let socios = [];

    // Manejar envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const socio = {
            id: idField.value || Date.now(),
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            dni: document.getElementById('dni').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            direccion: document.getElementById('direccion').value,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
        };

        // Validación de duplicados (DNI o Email)
        const duplicado = socios.find(
            (s) =>
                (s.dni === socio.dni || s.email === socio.email) &&
                s.id != socio.id
        );

        if (duplicado) {
            errorDiv.textContent = "⚠️ Ya existe un socio con este DNI o Email.";
            return;
        }

        errorDiv.textContent = "";

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
        
        if (socios.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #6b7280;">No hay socios registrados</td></tr>';
            return;
        }

        socios.forEach((socio) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${socio.nombre}</td>
                <td>${socio.apellido}</td>
                <td>${socio.dni}</td>
                <td>${socio.email}</td>
                <td>${socio.telefono || '-'}</td>
                <td>
                    <button onclick="editSocio(${socio.id})" class="btn-edit">Editar</button>
                    <button onclick="deleteSocio(${socio.id})" class="btn-delete">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Exponer funciones al scope global
    window.editSocio = function(id) {
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

        // Scroll al formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.deleteSocio = function(id) {
        if (confirm('¿Estás seguro de eliminar este socio?')) {
            socios = socios.filter((s) => s.id != id);
            renderTable();
        }
    };

    window.resetForm = function() {
        form.reset();
        idField.value = '';
        errorDiv.textContent = "";
    };

    // Renderizar tabla inicial (vacía)
    renderTable();

    // Manejo del botón de logout
    const logoutBtn = document.querySelector('.header__logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Cerrando sesión...');
            // window.location.href = '/logout';
        });
    }
}