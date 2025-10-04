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
// =========================================
// DATOS MOCK - Formato Backend
// =========================================
let sociosData = [
    {
        username: "lucioborda",
        password: "********",
        nroSocio: "00000001",
        dni: "38456789",
        nombre: "Lucio",
        apellido: "Borda",
        email: "lucio.borda@gmail.com",
        telefono: "1145678901",
        fechaAlta: "2023-01-15",
        activo: true,
        estadoCuota: "AL_DIA",
        mesesAdeudados: 0,
        ultimoPagado: "2025-10-01"
    },
    {
        username: "francogarcia",
        password: "********",
        nroSocio: "00000002",
        dni: "42123456",
        nombre: "Franco",
        apellido: "García",
        email: "franco.garcia@outlook.com",
        telefono: "1156789012",
        fechaAlta: "2023-03-20",
        activo: true,
        estadoCuota: "PENDIENTE",
        mesesAdeudados: 2,
        ultimoPagado: "2025-08-15"
    },
    {
        username: "marialopez",
        password: "********",
        nroSocio: "00000003",
        dni: "39876543",
        nombre: "María",
        apellido: "López",
        email: "maria.lopez@hotmail.com",
        telefono: "1167890123",
        fechaAlta: "2023-05-10",
        activo: true,
        estadoCuota: "AL_DIA",
        mesesAdeudados: 0,
        ultimoPagado: "2025-10-03"
    },
    {
        username: "juanperez",
        password: "********",
        nroSocio: "00000004",
        dni: "40123456",
        nombre: "Juan",
        apellido: "Pérez",
        email: "juan.perez@gmail.com",
        telefono: "1178901234",
        fechaAlta: "2023-07-25",
        activo: true,
        estadoCuota: "VENCIDA",
        mesesAdeudados: 4,
        ultimoPagado: "2025-06-10"
    },
    {
        username: "anamartinez",
        password: "********",
        nroSocio: "00000005",
        dni: "41234567",
        nombre: "Ana",
        apellido: "Martínez",
        email: "ana.martinez@yahoo.com.ar",
        telefono: "1189012345",
        fechaAlta: "2023-11-30",
        activo: true,
        estadoCuota: "AL_DIA",
        mesesAdeudados: 0,
        ultimoPagado: "2025-10-02"
    },
    {
        username: "carlosrodriguez",
        password: "********",
        nroSocio: "00000006",
        dni: "37654321",
        nombre: "Carlos",
        apellido: "Rodríguez",
        email: "carlos.rodriguez@gmail.com",
        telefono: "1190123456",
        fechaAlta: "2024-02-14",
        activo: true,
        estadoCuota: "AL_DIA",
        mesesAdeudados: 0,
        ultimoPagado: "2025-10-01"
    },
    {
        username: "lauragonzalez",
        password: "********",
        nroSocio: "00000007",
        dni: "43567890",
        nombre: "Laura",
        apellido: "González",
        email: "laura.gonzalez@outlook.com",
        telefono: "1101234567",
        fechaAlta: "2024-04-05",
        activo: true,
        estadoCuota: "PENDIENTE",
        mesesAdeudados: 1,
        ultimoPagado: "2025-09-01"
    },
    {
        username: "diegofernandez",
        password: "********",
        nroSocio: "00000008",
        dni: "39123987",
        nombre: "Diego",
        apellido: "Fernández",
        email: "diego.fernandez@gmail.com",
        telefono: "1112345678",
        fechaAlta: "2024-06-20",
        activo: false,
        estadoCuota: "VENCIDA",
        mesesAdeudados: 6,
        ultimoPagado: "2025-04-15"
    },
    {
        username: "sofiatorres",
        password: "********",
        nroSocio: "00000009",
        dni: "44789012",
        nombre: "Sofía",
        apellido: "Torres",
        email: "sofia.torres@hotmail.com",
        telefono: "1123456789",
        fechaAlta: "2024-08-12",
        activo: true,
        estadoCuota: "AL_DIA",
        mesesAdeudados: 0,
        ultimoPagado: "2025-10-03"
    },
    {
        username: "martinruiz",
        password: "********",
        nroSocio: "00000010",
        dni: "40987654",
        nombre: "Martín",
        apellido: "Ruiz",
        email: "martin.ruiz@gmail.com",
        telefono: "1134567890",
        fechaAlta: "2024-09-28",
        activo: true,
        estadoCuota: "PENDIENTE",
        mesesAdeudados: 1,
        ultimoPagado: "2025-09-05"
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

        // Agregar clase para hacer la fila clickeable (excepto en acciones)
        tr.classList.add('clickable-row');

        // Agregar atributo data para identificar el socio
        tr.setAttribute('data-socio-numero', socio.nroSocio);

        let badgeClass = '';
        let estadoTexto = '';

        // Mapeo visual del estado
        if (socio.estadoCuota === 'AL_DIA') {
            badgeClass = 'status-badge completed';
            estadoTexto = 'Al día';
        } else if (socio.estadoCuota === 'PENDIENTE') {
            badgeClass = 'status-badge pending';
            estadoTexto = 'Pendiente';
        } else if (socio.estadoCuota === 'VENCIDA') {
            badgeClass = 'status-badge overdue';
            estadoTexto = 'Vencida';
        }

        tr.innerHTML = `
            <td class="clickable-cell">${socio.nombre} ${socio.apellido}</td>
            <td class="clickable-cell">#${socio.nroSocio}</td>
            <td class="clickable-cell"><span class="${badgeClass}">${estadoTexto}</span></td>
            <td class="action-cell">
                <button class="btn-edit" onclick="abrirModalEditar('${socio.nroSocio}')">Editar</button>
                <button class="btn-delete" onclick="abrirModalEliminar('${socio.nroSocio}')">Eliminar</button>
            </td>
        `;

        // Agregar event listener al hacer click en las celdas clickeables
        const clickableCells = tr.querySelectorAll('.clickable-cell');
        clickableCells.forEach(cell => {
            cell.addEventListener('click', () => {
                abrirModalVerSocio(socio.nroSocio);
            });
        });

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
            socio.nroSocio.includes(searchTerm);

        // Convertir el filtro visual al enum del backend
        let estadoBackend = '';
        if (estadoFilter === 'Al día') estadoBackend = 'AL_DIA';
        else if (estadoFilter === 'Pendiente') estadoBackend = 'PENDIENTE';
        else if (estadoFilter === 'Vencida') estadoBackend = 'VENCIDA';

        const matchesEstado = !estadoBackend || socio.estadoCuota === estadoBackend;

        return matchesSearch && matchesEstado;
    });

    renderTable(filteredData);
}

function generarNumeroSocio() {
    const max = Math.max(...sociosData.map(s => parseInt(s.nroSocio)));
    const siguiente = max + 1;
    return siguiente.toString().padStart(8, '0');
}

function formatearTelefonoVisual(telefono) {
    if (!telefono) return '';

    // El backend guarda: "1145678901" (10 dígitos)
    // Formato visual: "+54 11 4567-8901"
    const codigoArea = telefono.substring(0, 2);
    const parte1 = telefono.substring(2, 6);
    const parte2 = telefono.substring(6, 10);

    return `+54 ${codigoArea} ${parte1}-${parte2}`;
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

    // Elementos del modal Ver Socio
    const modalVerSocio = document.getElementById('modalVerSocio');
    const closeModalVer = document.getElementById('closeModalVer');
    const cerrarModalVer = document.getElementById('cerrarModalVer');
    const editarDesdeMod = document.getElementById('editarDesdeMod');

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

            const nombre = document.getElementById('altaNombre').value;
            const apellido = document.getElementById('altaApellido').value;
            const codigoArea = document.getElementById('altaCodigoArea').value;
            const numeroTel = document.getElementById('altaNumero').value.replace('-', '');

            // Generar username automáticamente
            const username = (nombre + apellido).toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // Obtener fecha actual
            const hoy = new Date();
            const fechaHoy = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;

            const nuevoSocio = {
                username: username,
                password: "********",
                nroSocio: generarNumeroSocio(),
                dni: document.getElementById('altaDni').value,
                nombre: nombre,
                apellido: apellido,
                email: document.getElementById('altaEmail').value,
                telefono: codigoArea + numeroTel,
                fechaAlta: fechaHoy,
                activo: true,
                estadoCuota: "AL_DIA",
                mesesAdeudados: 0,
                ultimoPagado: fechaHoy
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

            const nroSocio = document.getElementById('editarNumeroSocio').value;
            const index = sociosData.findIndex(s => s.nroSocio === nroSocio);

            if (index !== -1) {
                const nombre = document.getElementById('editarNombre').value;
                const apellido = document.getElementById('editarApellido').value;
                const codigoArea = document.getElementById('editarCodigoArea').value;
                const numeroTel = document.getElementById('editarNumeroTel').value.replace('-', '');

                // Generar nuevo username
                const username = (nombre + apellido).toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                sociosData[index] = {
                    ...sociosData[index],
                    username: username,
                    nombre: nombre,
                    apellido: apellido,
                    dni: document.getElementById('editarDni').value,
                    email: document.getElementById('editarEmail').value,
                    telefono: codigoArea + numeroTel
                };

                filterData();
            }

            modalEditar.style.display = 'none';
        });
    }

    if (confirmarEliminarBtn) {
        confirmarEliminarBtn.addEventListener('click', () => {
            if (socioAEliminar) {
                sociosData = sociosData.filter(s => s.nroSocio !== socioAEliminar);
                filterData();
                socioAEliminar = null;
            }

            modalEliminar.style.display = 'none';
        });
    }

    // Event listeners para modal Ver Socio
    if (closeModalVer) {
        closeModalVer.addEventListener('click', () => {
            modalVerSocio.style.display = 'none';
        });
    }

    if (cerrarModalVer) {
        cerrarModalVer.addEventListener('click', () => {
            modalVerSocio.style.display = 'none';
        });
    }

    if (editarDesdeMod) {
        editarDesdeMod.addEventListener('click', () => {
            const nroSocio = editarDesdeMod.getAttribute('data-socio-numero');
            modalVerSocio.style.display = 'none';
            abrirModalEditar(nroSocio);
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
        if (e.target === modalVerSocio) {
            modalVerSocio.style.display = 'none';
        }
    });
}

function abrirModalEditar(nroSocio) {
    const socio = sociosData.find(s => s.nroSocio === nroSocio);
    if (!socio) return;

    // Separar teléfono: "1145678901" → área: "11", número: "45678901"
    const codigoArea = socio.telefono.substring(0, 2);
    const numeroTel = socio.telefono.substring(2);

    // Formatear número con guion: "45678901" → "4567-8901"
    const numeroFormateado = numeroTel.substring(0, 4) + '-' + numeroTel.substring(4);

    document.getElementById('editarNumeroSocio').value = socio.nroSocio;
    document.getElementById('editarNombre').value = socio.nombre;
    document.getElementById('editarApellido').value = socio.apellido;
    document.getElementById('editarDni').value = socio.dni;
    document.getElementById('editarEmail').value = socio.email;
    document.getElementById('editarCodigoArea').value = codigoArea;
    document.getElementById('editarNumeroTel').value = numeroFormateado;
    document.getElementById('editarFechaNacimiento').value = socio.fechaAlta || '';
    document.getElementById('editarDireccion').value = socio.username || '';

    document.getElementById('modalEditarSocio').style.display = 'flex';
}

function abrirModalEliminar(nroSocio) {
    const socio = sociosData.find(s => s.nroSocio === nroSocio);
    if (!socio) return;

    socioAEliminar = nroSocio;
    document.getElementById('eliminarNombreSocio').textContent = `${socio.nombre} ${socio.apellido} (#${socio.nroSocio})`;

    document.getElementById('modalEliminar').style.display = 'flex';
}

// =========================================
// MODAL VER DETALLES DEL SOCIO
// =========================================
function abrirModalVerSocio(nroSocio) {
    const socio = sociosData.find(s => s.nroSocio === nroSocio);
    if (!socio) return;

    // Llenar datos de acceso
    document.getElementById('verUsername').textContent = socio.username || '-';
    document.getElementById('verPassword').textContent = socio.password || '********';

    // Llenar datos personales
    document.getElementById('verNombreCompleto').textContent = `${socio.nombre} ${socio.apellido}`;
    document.getElementById('verNumeroSocio').textContent = `#${socio.nroSocio}`;
    document.getElementById('verDni').textContent = socio.dni || '-';
    document.getElementById('verFechaAlta').textContent = formatearFecha(socio.fechaAlta);

    // Llenar datos de contacto
    document.getElementById('verEmail').textContent = socio.email || '-';
    document.getElementById('verTelefono').textContent = formatearTelefonoVisual(socio.telefono);
    document.getElementById('verDireccion').textContent = '-';

    // Llenar estado de cuota
    const estadoCuotaBadge = document.getElementById('verEstadoCuota');
    let estadoCuotaTexto = '';

    if (socio.estadoCuota === 'AL_DIA') {
        estadoCuotaTexto = 'Al día';
        estadoCuotaBadge.className = 'status-badge completed';
    } else if (socio.estadoCuota === 'PENDIENTE') {
        estadoCuotaTexto = 'Pendiente';
        estadoCuotaBadge.className = 'status-badge pending';
    } else if (socio.estadoCuota === 'VENCIDA') {
        estadoCuotaTexto = 'Vencida';
        estadoCuotaBadge.className = 'status-badge overdue';
    }

    estadoCuotaBadge.textContent = estadoCuotaTexto;

    // Llenar estado activo
    const estadoActivoBadge = document.getElementById('verEstadoActivo');
    if (socio.activo) {
        estadoActivoBadge.textContent = 'Activo';
        estadoActivoBadge.className = 'status-badge completed';
    } else {
        estadoActivoBadge.textContent = 'Inactivo';
        estadoActivoBadge.className = 'status-badge overdue';
    }

    // Llenar meses adeudados y último pago
    document.getElementById('verMesesAdeudados').textContent = socio.mesesAdeudados || '0';
    document.getElementById('verUltimoPagado').textContent = formatearFecha(socio.ultimoPagado);

    // Guardar número de socio para el botón "Editar"
    document.getElementById('editarDesdeMod').setAttribute('data-socio-numero', nroSocio);

    // Mostrar modal
    document.getElementById('modalVerSocio').style.display = 'flex';
}

function formatearFecha(fecha) {
    if (!fecha) return '-';
    const [año, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${año}`;
}
