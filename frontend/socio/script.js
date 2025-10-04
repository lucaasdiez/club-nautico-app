// =========================================
// MÓDULO 1: NAVEGACIÓN DE PESTAÑAS
// (Compartido por todos)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initPagosModule();

    // Cargar el módulo de disciplinas si existe
    if (typeof initDisciplinasModule === 'function') {
        initDisciplinasModule();
    }
});

function initTabNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');

            // Remover clase active de todos los tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Agregar clase active al tab clickeado
            tab.classList.add('active');

            // Ocultar todas las secciones
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Mostrar la sección correspondiente
            const activeSection = document.getElementById(`${tabName}-content`);
            if (activeSection) {
                activeSection.classList.add('active');
            }
        });
    });

    // Manejo del botón de logout
    const logoutBtn = document.querySelector('.header__logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Cerrando sesión...');
            // Aquí agregar lógica de logout
            // window.location.href = '/logout';
        });
    }
}

// =========================================
// MÓDULO 2: GESTIÓN DE PAGOS
// (Tu sección - Lucio)
// =========================================
function initPagosModule() {
    // Aquí va toda la lógica de historial de pagos
    console.log('Módulo de pagos inicializado');
    
    // Ejemplo: Array de pagos (en el futuro vendrá del backend)
    let pagos = [
        {
            id: 1,
            fecha: '15/03/2024',
            concepto: 'Cuota Mensual - Marzo',
            monto: 5000,
            estado: 'pagado'
        },
        {
            id: 2,
            fecha: '15/02/2024',
            concepto: 'Cuota Mensual - Febrero',
            monto: 5000,
            estado: 'pagado'
        },
        {
            id: 3,
            fecha: '15/01/2024',
            concepto: 'Cuota Mensual - Enero',
            monto: 5000,
            estado: 'pendiente'
        }
    ];

    // Aquí puedes agregar funciones para:
    // - Filtrar pagos por estado
    // - Buscar pagos por fecha
    // - Registrar nuevos pagos
    // - Ver comprobantes
    // - etc.
}

// =========================================
// MÓDULO 3: RESUMEN
// (Para tus compañeros)
// =========================================
// function initResumenModule() {
//     // Código del módulo de resumen
// }

// =========================================
// =========================================
// MÓDULO 4: DISCIPLINAS
// =========================================
// El código del módulo está en js/disciplinas.js
// Se carga e inicializa más abajo

// =========================================
// MÓDULO 5: ACCESO
// (Para tus compañeros)
// =========================================
// function initAccesoModule() {
//     // Código del módulo de acceso
// }