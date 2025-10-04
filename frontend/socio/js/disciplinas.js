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

function renderizarDisciplinas(disciplinas) {
    const grid = document.getElementById('disciplinasGrid');
    const emptyState = document.getElementById('emptyState');

    if (!grid) {
        console.error('No se encontró el elemento #disciplinasGrid');
        return;
    }

    if (!disciplinas || disciplinas.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'flex';
        return;
    }

    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = disciplinas.map(disciplina => crearCardHTML(disciplina)).join('');
}

function crearCardHTML(disciplina) {
    const disponible = disciplina.disponible;
    const badgeClass = disponible ? 'disponible' : 'no-disponible';
    const badgeText = disponible ? 'Disponible' : 'No disponible';
    const cardClass = disponible ? '' : 'card-disabled';

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

function filtrarDisciplinas(filtro) {
    filtroActual = filtro;
    let disciplinasFiltradas = [...todasLasDisciplinas];

    if (filtro === 'disponibles') {
        disciplinasFiltradas = disciplinasFiltradas.filter(d => d.disponible === true);
    } else if (filtro === 'no-disponibles') {
        disciplinasFiltradas = disciplinasFiltradas.filter(d => d.disponible === false);
    }

    renderizarDisciplinas(disciplinasFiltradas);

    console.log(`Filtro aplicado: ${filtro}`);
    console.log(`Resultados: ${disciplinasFiltradas.length} disciplinas`);
}

// ============================================
// FUNCIONES DE INTERACCIÓN
// ============================================

function verMasInfoDisciplina(disciplinaId) {
    const disciplina = todasLasDisciplinas.find(d => d.id === disciplinaId);

    if (!disciplina) {
        alert('Disciplina no encontrada');
        return;
    }

    // Crear modal
    const modal = document.createElement('div');
    modal.id = 'modal-disciplina';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s ease;';
    
    modal.innerHTML = `
        <div style="background: white; padding: 0; border-radius: 1rem; max-width: 500px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: slideUp 0.3s ease; max-height: 90vh; overflow-y: auto;">
            <!-- Header del Modal -->
            <div style="padding: 1.5rem; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 1.5rem; color: #111827; font-weight: 600;">${disciplina.nombre}</h3>
                <button id="btn-cerrar-modal" style="background: none; border: none; font-size: 1.5rem; color: #6b7280; cursor: pointer; padding: 0.25rem; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; border-radius: 0.375rem; transition: all 150ms;">
                    ✕
                </button>
            </div>
            
            <!-- Body del Modal -->
            <div style="padding: 1.5rem;">
                <span class="badge ${disciplina.disponible ? 'disponible' : 'no-disponible'}" style="display: inline-block; margin-bottom: 1rem;">
                    ${disciplina.disponible ? '✓ Disponible' : '✗ No disponible'}
                </span>
                
                <p style="color: #6b7280; margin-bottom: 1.5rem; line-height: 1.6;">${disciplina.descripcion}</p>
                
                <div style="background: #f9fafb; padding: 1.25rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    ${disciplina.profesor ? `
                        <div style="margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;">Profesor</span>
                            <p style="margin: 0.25rem 0 0 0; color: #111827; font-weight: 600;">${disciplina.profesor}</p>
                        </div>
                    ` : ''}
                    
                    ${disciplina.horario ? `
                        <div style="margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;">Horario</span>
                            <p style="margin: 0.25rem 0 0 0; color: #111827; font-weight: 600;">${disciplina.horario}</p>
                        </div>
                    ` : ''}
                    
                    <div style="margin-bottom: 0.75rem;">
                        <span style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;">Días</span>
                        <p style="margin: 0.25rem 0 0 0; color: #111827; font-weight: 600;">${disciplina.dias.join(', ') || 'No especificado'}</p>
                    </div>
                    
                    ${disciplina.temporada ? `
                        <div style="margin-bottom: 0.75rem;">
                            <span style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;">Temporada</span>
                            <p style="margin: 0.25rem 0 0 0; color: #111827; font-weight: 600;">${disciplina.temporada}</p>
                        </div>
                    ` : ''}
                    
                    ${disciplina.cupoMaximo ? `
                        <div>
                            <span style="font-size: 0.75rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 500;">Cupo Máximo</span>
                            <p style="margin: 0.25rem 0 0 0; color: #111827; font-weight: 600;">${disciplina.cupoMaximo} personas</p>
                        </div>
                    ` : ''}
                </div>
                
                <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                    <button id="btn-cancelar-disciplina" style="flex: 1; padding: 0.75rem; background: #e5e7eb; color: #374151; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 150ms;">
                        Cerrar
                    </button>
                    ${disciplina.disponible ? `
                        <button id="btn-inscribirse" style="flex: 1; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 150ms;">
                            Inscribirse
                        </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Event listeners
    const cerrarModal = () => {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => modal.remove(), 200);
    };

    document.getElementById('btn-cerrar-modal').addEventListener('click', cerrarModal);
    document.getElementById('btn-cancelar-disciplina').addEventListener('click', cerrarModal);
    
    const btnInscribirse = document.getElementById('btn-inscribirse');
    if (btnInscribirse) {
        btnInscribirse.addEventListener('click', () => {
            modal.remove();
            showSuccessMessage('¡Inscripción exitosa a ' + disciplina.nombre + '!');
        });
    }

    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            cerrarModal();
        }
    });

    // Hover effect para botón cerrar
    document.getElementById('btn-cerrar-modal').addEventListener('mouseenter', (e) => {
        e.target.style.background = '#f3f4f6';
    });
    document.getElementById('btn-cerrar-modal').addEventListener('mouseleave', (e) => {
        e.target.style.background = 'none';
    });

    console.log(`Modal abierto para: ${disciplina.nombre}`);
}

function showSuccessMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = 'position: fixed; top: 2rem; right: 2rem; background: #10b981; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 10000; animation: slideIn 0.3s ease;';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// INICIALIZACIÓN DEL MÓDULO
// ============================================

function initDisciplinasModule() {
    console.log('Inicializando módulo de disciplinas...');
    console.log(`Total de disciplinas: ${todasLasDisciplinas.length}`);

    const grid = document.getElementById('disciplinasGrid');
    if (!grid) {
        console.error('ERROR: No se encontró el elemento #disciplinasGrid. Verifica que el HTML tenga este ID.');
        return;
    }

    renderizarDisciplinas(todasLasDisciplinas);

    const radioButtons = document.querySelectorAll('input[name="filterDisponibilidad"]');
    if (radioButtons.length === 0) {
        console.warn('ADVERTENCIA: No se encontraron filtros de disponibilidad');
    }

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            filtrarDisciplinas(e.target.value);
        });
    });

    console.log('Módulo de disciplinas cargado correctamente ✓');
}

if (typeof window !== 'undefined') {
    window.initDisciplinasModule = initDisciplinasModule;
}