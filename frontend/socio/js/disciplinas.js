// ============================================
// DATOS MOCK - Disciplinas del Club
// ============================================

const disciplinasMock = [
    {
        id: '1',
        nombre: 'Fútbol',
        descripcion: 'Entrenamiento de fútbol para todas las categorías. Desarrollo de técnica, táctica y físico.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Martes', 'Jueves'],
        horario: '18:00 - 20:00',
        profesor: 'Carlos Pérez',
        cupoMaximo: 30
    },
    {
        id: '2',
        nombre: 'Natación',
        descripcion: 'Clases de natación para niños y adultos. Todos los niveles desde principiantes hasta avanzados.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Lunes', 'Miércoles', 'Viernes'],
        horario: '17:00 - 19:00',
        profesor: 'Ana García',
        cupoMaximo: 20
    },
    {
        id: '3',
        nombre: 'Tenis',
        descripcion: 'Clases de tenis individuales y grupales. Mejorá tu técnica con profesionales.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Lunes', 'Martes', 'Jueves'],
        horario: '16:00 - 18:00',
        profesor: 'Juan Martínez',
        cupoMaximo: 15
    },
    {
        id: '4',
        nombre: 'Paddle',
        descripcion: 'Alquiler de canchas y clases grupales. Disfruta del deporte que más crece.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        horario: '14:00 - 22:00',
        profesor: 'Roberto Silva',
        cupoMaximo: 8
    },
    {
        id: '5',
        nombre: 'Yoga',
        descripcion: 'Clases de yoga para todos los niveles. Equilibrio, flexibilidad y relajación.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Miércoles', 'Viernes'],
        horario: '19:00 - 20:30',
        profesor: 'María López',
        cupoMaximo: 25
    },
    {
        id: '6',
        nombre: 'Gimnasio',
        descripcion: 'Sala de musculación completamente equipada con instructor personalizado.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
        horario: '08:00 - 22:00',
        profesor: 'Diego Fernández',
        cupoMaximo: 50
    },
    {
        id: '7',
        nombre: 'Vóley Playa',
        descripcion: 'Vóley en la arena de nuestra cancha de playa. Diversión asegurada bajo el sol.',
        disponible: true,
        temporada: 'Verano',
        dias: ['Sábado', 'Domingo'],
        horario: '10:00 - 18:00',
        profesor: null,
        cupoMaximo: 16
    },
    {
        id: '8',
        nombre: 'Hockey',
        descripcion: 'Entrenamiento de hockey sobre césped. Todas las categorías.',
        disponible: false,
        temporada: 'Cerrado por mantenimiento',
        dias: [],
        horario: null,
        profesor: 'Laura Gómez',
        cupoMaximo: 25
    },
    {
        id: '9',
        nombre: 'Básquet',
        descripcion: 'Entrenamiento de básquetbol en nuestra cancha cubierta.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Martes', 'Jueves', 'Sábado'],
        horario: '17:00 - 19:00',
        profesor: 'Martín Rodríguez',
        cupoMaximo: 20
    },
    {
        id: '10',
        nombre: 'Pilates',
        descripcion: 'Clases de pilates para fortalecer el core y mejorar la postura.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Lunes', 'Viernes'],
        horario: '18:00 - 19:00',
        profesor: 'Sofía Méndez',
        cupoMaximo: 15
    },
    {
        id: '11',
        nombre: 'Spinning',
        descripcion: 'Clases de spinning de alta intensidad con música motivadora.',
        disponible: false,
        temporada: 'Mantenimiento de bicicletas',
        dias: ['Lunes', 'Miércoles', 'Viernes'],
        horario: '19:00 - 20:00',
        profesor: 'Lucas Torres',
        cupoMaximo: 20
    },
    {
        id: '12',
        nombre: 'Funcional',
        descripcion: 'Entrenamiento funcional al aire libre. Trabajo de fuerza, resistencia y movilidad.',
        disponible: true,
        temporada: 'Todo el año',
        dias: ['Martes', 'Jueves', 'Sábado'],
        horario: '08:00 - 09:00',
        profesor: 'Facundo Gómez',
        cupoMaximo: 30
    }
];

// ============================================
// VARIABLES GLOBALES
// ============================================

let todasLasDisciplinas = [...disciplinasMock];
let filtroActual = 'todas';

// ============================================
// FUNCIONES DE RENDERIZADO
// ============================================

/**
 * Renderiza las disciplinas en el grid
 * @param {Array} disciplinas - Array de objetos disciplina
 */
function renderizarDisciplinas(disciplinas) {
    const grid = document.getElementById('disciplinasGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid) {
        console.error('❌ No se encontró el elemento #disciplinasGrid');
        return;
    }

    // Si no hay disciplinas, mostrar estado vacío
    if (!disciplinas || disciplinas.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    // Ocultar estado vacío y renderizar cards
    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = disciplinas.map(disciplina => crearCardHTML(disciplina)).join('');
}

/**
 * Crea el HTML de una card de disciplina
 * @param {Object} disciplina - Objeto con los datos de la disciplina
 * @returns {string} HTML de la card
 */
function crearCardHTML(disciplina) {
    const disponible = disciplina.disponible;
    const badgeClass = disponible ? 'disponible' : 'no-disponible';
    const badgeText = disponible ? 'Disponible' : 'No disponible';
    const cardClass = disponible ? '' : 'card-disabled';

    // Formatear días
    const dias = disciplina.dias && disciplina.dias.length > 0
        ? disciplina.dias.join(', ')
        : 'No especificado';

    return `
        <div class="disciplina-card ${cardClass}" data-id="${disciplina.id}">
            <div class="card-header-disciplina">
                <h3>${disciplina.nombre}</h3>
                <span class="badge ${badgeClass}">
                    ${badgeText}
                </span>
            </div>

            <div class="card-body-disciplina">
                <p class="descripcion">${disciplina.descripcion || 'Sin descripción'}</p>

                <div class="info-list">
                    ${disciplina.profesor ? `
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profesor: ${disciplina.profesor}</span>
                        </div>
                    ` : ''}

                    ${disciplina.horario ? `
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>${disciplina.horario}</span>
                        </div>
                    ` : ''}

                    <div class="info-item">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>${dias}</span>
                    </div>

                    ${disciplina.temporada ? `
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <span>${disciplina.temporada}</span>
                        </div>
                    ` : ''}

                    ${disciplina.cupoMaximo ? `
                        <div class="info-item">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Cupo máximo: ${disciplina.cupoMaximo} personas</span>
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="card-footer-disciplina">
                <button
                    class="btn ${disponible ? 'btn-primary' : 'btn-disabled'}"
                    onclick="verMasInfoDisciplina('${disciplina.id}')"
                    ${!disponible ? 'disabled' : ''}
                >
                    ${disponible ? 'Más información' : 'No disponible'}
                </button>
            </div>
        </div>
    `;
}

// ============================================
// FUNCIONES DE FILTRADO
// ============================================

/**
 * Filtra disciplinas según el criterio seleccionado
 * @param {string} filtro - 'todas' | 'disponibles' | 'no-disponibles'
 */
function filtrarDisciplinas(filtro) {
    filtroActual = filtro;
    let disciplinasFiltradas = [...todasLasDisciplinas];

    if (filtro === 'disponibles') {
        disciplinasFiltradas = disciplinasFiltradas.filter(d => d.disponible === true);
    } else if (filtro === 'no-disponibles') {
        disciplinasFiltradas = disciplinasFiltradas.filter(d => d.disponible === false);
    }

    renderizarDisciplinas(disciplinasFiltradas);

    console.log(`🔍 Filtro aplicado: ${filtro}`);
    console.log(`📊 Resultados: ${disciplinasFiltradas.length} disciplinas`);
}

// ============================================
// FUNCIONES DE INTERACCIÓN
// ============================================

/**
 * Muestra más información sobre una disciplina
 * @param {string} disciplinaId - ID de la disciplina
 */
function verMasInfoDisciplina(disciplinaId) {
    const disciplina = todasLasDisciplinas.find(d => d.id === disciplinaId);

    if (!disciplina) {
        alert('Disciplina no encontrada');
        return;
    }

    // Aquí podrías abrir un modal, navegar a otra página, etc.
    // Por ahora mostramos un alert con la información
    const info = `
📋 INFORMACIÓN DETALLADA

Disciplina: ${disciplina.nombre}
Profesor: ${disciplina.profesor || 'Sin asignar'}
Horario: ${disciplina.horario || 'No especificado'}
Días: ${disciplina.dias.join(', ') || 'No especificado'}
Temporada: ${disciplina.temporada}
Cupo: ${disciplina.cupoMaximo} personas

${disciplina.descripcion}

${disciplina.disponible ? '✅ Esta disciplina está disponible para inscripción' : '❌ Esta disciplina no está disponible actualmente'}
    `.trim();

    alert(info);

    console.log(`ℹ️ Ver info de: ${disciplina.nombre}`);
}

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================

/**
 * Inicializa el módulo de disciplinas
 * Esta función es llamada desde script.js cuando el DOM está listo
 */
function initDisciplinasModule() {
    console.log('🎾 Inicializando módulo de disciplinas...');
    console.log(`📊 Total de disciplinas: ${todasLasDisciplinas.length}`);

    // Renderizar todas las disciplinas por defecto
    renderizarDisciplinas(todasLasDisciplinas);

    // Configurar event listeners para los filtros
    const radioButtons = document.querySelectorAll('input[name="filterDisponibilidad"]');
    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            filtrarDisciplinas(e.target.value);
        });
    });

    console.log('✅ Módulo de disciplinas cargado correctamente');
}

// Exportar la función de inicialización para uso global
window.initDisciplinasModule = initDisciplinasModule;