// =========================================
// MÓDULO DE ADMINISTRACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initSociosModule();
    initModals();
});

function initTabNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            sections.forEach(section => {
                section.classList.remove('active');
            });

            const activeSection = document.getElementById(`${tabName}-content`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
        });
    });

    const logoutBtn = document.querySelector('.header__logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Cerrando sesión...');
        });
    }
}

// =========================================
// MÓDULO: GESTIÓN DE SOCIOS
// =========================================
let sociosData = [
    {
        nombre: 'lucio',
        apellido: 'borda',
        numero: '#1234',
        dni: '12345678',
        email: 'lucio.borda@email.com',
        telefono: '+5491112345678',
        fechaNacimiento: '1990-01-15',
        direccion: 'Calle Falsa 123',
        estado: 'Al día'
    },
    {
        nombre: 'Franco',
        apellido: 'García',
        numero: '#123456',
        dni: '87654321',
        email: 'franco.garcia@email.com',
        telefono: '+5491187654321',
        fechaNacimiento: '1985-05-20',
        direccion: 'Av. Siempre Viva 456',
        estado: 'Pendiente'
    },
    {
        nombre: 'María',
        apellido: 'López',
        numero: '#5678',
        dni: '23456789',
        email: 'maria.lopez@email.com',
        telefono: '+5491123456789',
        fechaNacimiento: '1992-03-10',
        direccion: 'Calle Principal 789',
        estado: 'Al día'
    },
    {
        nombre: 'Juan',
        apellido: 'Pérez',
        numero: '#9012',
        dni: '34567890',
        email: 'juan.perez@email.com',
        telefono: '+5491134567890',
        fechaNacimiento: '1988-07-25',
        direccion: 'Av. Libertador 321',
        estado: 'Vencida'
    },
    {
        nombre: 'Ana',
        apellido: 'Martínez',
        numero: '#3456',
        dni: '45678901',
        email: 'ana.martinez@email.com',
        telefono: '+5491145678901',
        fechaNacimiento: '1995-11-30',
        direccion: 'Calle Central 654',
        estado: 'Al día'
    }
];

let filteredData = [...sociosData];
let socioAEliminar = null;

function initSociosModule() {
    const searchInput = document.getElementById('searchSocio');
    const filterEstado = document.getElementById('filterEstado');

    if (searchInput) {
        searchInput.addEventListener('input', filterData);
    }

    if (filterEstado) {
        filterEstado.addEventListener('change', filterData);
    }

    renderTable(sociosData);
}

function renderTable(data) {
    const tableBody = document.getElementById('sociosTableBody');
    const totalSocios = document.getElementById('totalSocios');

    if (!tableBody) return;

    tableBody.innerHTML = '';

    data.forEach(socio => {
        const tr = document.createElement('tr');

        let badgeClass = '';
        if (socio.estado === 'Al día') {
            badgeClass = 'status-badge completed';
        } else if (socio.estado === 'Pendiente') {
            badgeClass = 'status-badge pending';
        } else if (socio.estado === 'Vencida') {
            badgeClass = 'status-badge overdue';
        }

        tr.innerHTML = `
            <td>${socio.nombre} ${socio.apellido}</td>
            <td>${socio.numero}</td>
            <td>${socio.dni}</td>
            <td>${socio.email}</td>
            <td>${formatearTelefonoVisual(socio.telefono)}</td>
            <td><span class="${badgeClass}">${socio.estado}</span></td>
            <td>
                <button class="btn-edit" onclick="abrirModalEditar('${socio.numero}')">Editar</button>
                <button class="btn-delete" onclick="abrirModalEliminar('${socio.numero}')">Eliminar</button>
            </td>
        `;

        tableBody.appendChild(tr);
    });

    if (totalSocios) {
        totalSocios.textContent = data.length;
    }
}

function filterData() {
    const searchInput = document.getElementById('searchSocio');
    const filterEstado = document.getElementById('filterEstado');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const estadoFilter = filterEstado ? filterEstado.value : '';

    filteredData = sociosData.filter(socio => {
        const nombreCompleto = `${socio.nombre} ${socio.apellido}`.toLowerCase();
        const matchesSearch =
            nombreCompleto.includes(searchTerm) ||
            socio.dni.includes(searchTerm) ||
            socio.numero.toLowerCase().includes(searchTerm);

        const matchesEstado = !estadoFilter || socio.estado === estadoFilter;

        return matchesSearch && matchesEstado;
    });

    renderTable(filteredData);
}

function generarNumeroSocio() {
    const max = Math.max(...sociosData.map(s => parseInt(s.numero.replace('#', ''))));
    return `#${max + 1}`;
}

function obtenerEstadoAleatorio() {
    const estados = ['Al día', 'Pendiente', 'Vencida'];
    return estados[Math.floor(Math.random() * estados.length)];
}

function formatearTelefonoVisual(telefonoE164) {
    if (!telefonoE164) return '';
    let numeros = telefonoE164.replace(/\D/g, '');

    if (numeros.startsWith('54')) {
        numeros = numeros.substring(2);
    }

    if (numeros.length >= 1) {
        const caracteristica = numeros[0];
        const area = numeros.substring(1, 3);
        const numero = numeros.substring(3);

        if (numero.length > 4) {
            return `+54 ${caracteristica} ${area} ${numero.substring(0, 4)}-${numero.substring(4)}`;
        }
        return `+54 ${caracteristica} ${area} ${numero}`;
    }

    return telefonoE164;
}

function separarTelefono(telefonoE164) {
    if (!telefonoE164) return { area: '', numero: '' };

    let numeros = telefonoE164.replace(/\D/g, '');

    if (numeros.startsWith('54')) {
        numeros = numeros.substring(2);
    }

    if (numeros.length >= 1) {
        const caracteristica = numeros[0];
        const area = numeros.substring(1, 3);
        const numero = numeros.substring(3);

        const numeroFormateado = numero.length > 4 ?
            numero.substring(0, 4) + '-' + numero.substring(4) :
            numero;

        return {
            area: caracteristica + area,
            numero: numeroFormateado
        };
    }

    return { area: '', numero: '' };
}

function combinarTelefono(codigoPais, area, numero) {
    const numerosArea = area.replace(/\D/g, '');
    const numerosNumero = numero.replace(/\D/g, '');

    if (!numerosArea && !numerosNumero) return '';

    return `${codigoPais}${numerosArea}${numerosNumero}`;
}

function formatearNumeroConGuion(input) {
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 4) {
        valor = valor.substring(0, 4) + '-' + valor.substring(4, 8);
    }

    input.value = valor;
}

function aplicarFormatoTelefono() {
    const inputsArea = document.querySelectorAll('.phone-area');
    const inputsNumero = document.querySelectorAll('.phone-number');

    inputsArea.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    });

    inputsNumero.forEach(input => {
        input.addEventListener('input', (e) => {
            formatearNumeroConGuion(e.target);
        });
    });
}

// =========================================
// GESTIÓN DE MODALES
// =========================================
function initModals() {
    const btnAltaSocio = document.getElementById('btnAltaSocio');
    const modalAlta = document.getElementById('modalAltaSocio');
    const modalEditar = document.getElementById('modalEditarSocio');
    const modalEliminar = document.getElementById('modalEliminar');

    const closeModalAlta = document.getElementById('closeModalAlta');
    const cancelAlta = document.getElementById('cancelAlta');

    const closeModalEditar = document.getElementById('closeModalEditar');
    const cancelEditar = document.getElementById('cancelEditar');

    const closeModalEliminar = document.getElementById('closeModalEliminar');
    const cancelEliminar = document.getElementById('cancelEliminar');

    const formAlta = document.getElementById('formAltaSocio');
    const formEditar = document.getElementById('formEditarSocio');
    const confirmarEliminarBtn = document.getElementById('confirmarEliminar');

    if (btnAltaSocio) {
        btnAltaSocio.addEventListener('click', () => {
            modalAlta.style.display = 'flex';
        });
    }

    if (closeModalAlta) {
        closeModalAlta.addEventListener('click', () => {
            modalAlta.style.display = 'none';
            formAlta.reset();
        });
    }

    if (cancelAlta) {
        cancelAlta.addEventListener('click', () => {
            modalAlta.style.display = 'none';
            formAlta.reset();
        });
    }

    if (closeModalEditar) {
        closeModalEditar.addEventListener('click', () => {
            modalEditar.style.display = 'none';
        });
    }

    if (cancelEditar) {
        cancelEditar.addEventListener('click', () => {
            modalEditar.style.display = 'none';
        });
    }

    if (closeModalEliminar) {
        closeModalEliminar.addEventListener('click', () => {
            modalEliminar.style.display = 'none';
        });
    }

    if (cancelEliminar) {
        cancelEliminar.addEventListener('click', () => {
            modalEliminar.style.display = 'none';
        });
    }

    aplicarFormatoTelefono();

    if (formAlta) {
        formAlta.addEventListener('submit', (e) => {
            e.preventDefault();

            const codigoPais = document.getElementById('altaCodigoPais').value;
            const codigoArea = document.getElementById('altaCodigoArea').value;
            const numeroTel = document.getElementById('altaNumero').value;

            const nuevoSocio = {
                nombre: document.getElementById('altaNombre').value,
                apellido: document.getElementById('altaApellido').value,
                numero: generarNumeroSocio(),
                dni: document.getElementById('altaDni').value,
                email: document.getElementById('altaEmail').value,
                telefono: combinarTelefono(codigoPais, codigoArea, numeroTel),
                fechaNacimiento: document.getElementById('altaFechaNacimiento').value,
                direccion: document.getElementById('altaDireccion').value,
                estado: obtenerEstadoAleatorio()
            };

            sociosData.push(nuevoSocio);
            filterData();

            modalAlta.style.display = 'none';
            formAlta.reset();
        });
    }

    if (formEditar) {
        formEditar.addEventListener('submit', (e) => {
            e.preventDefault();

            const numero = document.getElementById('editarNumeroSocio').value;
            const index = sociosData.findIndex(s => s.numero === numero);

            if (index !== -1) {
                const codigoPais = document.getElementById('editarCodigoPais').value;
                const codigoArea = document.getElementById('editarCodigoArea').value;
                const numeroTel = document.getElementById('editarNumeroTel').value;

                sociosData[index] = {
                    ...sociosData[index],
                    nombre: document.getElementById('editarNombre').value,
                    apellido: document.getElementById('editarApellido').value,
                    dni: document.getElementById('editarDni').value,
                    email: document.getElementById('editarEmail').value,
                    telefono: combinarTelefono(codigoPais, codigoArea, numeroTel),
                    fechaNacimiento: document.getElementById('editarFechaNacimiento').value,
                    direccion: document.getElementById('editarDireccion').value
                };

                filterData();
            }

            modalEditar.style.display = 'none';
        });
    }

    if (confirmarEliminarBtn) {
        confirmarEliminarBtn.addEventListener('click', () => {
            if (socioAEliminar) {
                sociosData = sociosData.filter(s => s.numero !== socioAEliminar);
                filterData();
                socioAEliminar = null;
            }

            modalEliminar.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modalAlta) {
            modalAlta.style.display = 'none';
            formAlta.reset();
        }
        if (e.target === modalEditar) {
            modalEditar.style.display = 'none';
        }
        if (e.target === modalEliminar) {
            modalEliminar.style.display = 'none';
        }
    });
}

function abrirModalEditar(numero) {
    const socio = sociosData.find(s => s.numero === numero);
    if (!socio) return;

    const telSeparado = separarTelefono(socio.telefono);

    document.getElementById('editarNumeroSocio').value = socio.numero;
    document.getElementById('editarNombre').value = socio.nombre;
    document.getElementById('editarApellido').value = socio.apellido;
    document.getElementById('editarDni').value = socio.dni;
    document.getElementById('editarEmail').value = socio.email;
    document.getElementById('editarCodigoArea').value = telSeparado.area;
    document.getElementById('editarNumeroTel').value = telSeparado.numero;
    document.getElementById('editarFechaNacimiento').value = socio.fechaNacimiento || '';
    document.getElementById('editarDireccion').value = socio.direccion || '';

    document.getElementById('modalEditarSocio').style.display = 'flex';
}

function abrirModalEliminar(numero) {
    const socio = sociosData.find(s => s.numero === numero);
    if (!socio) return;

    socioAEliminar = numero;
    document.getElementById('eliminarNombreSocio').textContent = `${socio.nombre} ${socio.apellido} (${socio.numero})`;

    document.getElementById('modalEliminar').style.display = 'flex';
}
