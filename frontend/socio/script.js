// =========================================
// SISTEMA INTERACTIVO DE PAGOS
// Portal del Socio - Club Social
// =========================================

// Estado global de la aplicación (en memoria)
const appState = {
    socio: {
        id: '1234',
        nombre: 'Lucio Borda',
        iniciales: 'LB'
    },
    membresia: {
        tipo: 'Mensual',
        estado: 'pendiente', // 'pendiente', 'paid', 'overdue'
        fechaInicio: '01-10-2025',
        fechaVencimiento: '08-10-2025',
        montoMensual: 25000,
        diasRestantes: 5
    },
    pagos: [
        {
            id: '2qyela9q',
            fecha: '03-09-2025',
            concepto: 'Cuota Social Mensual - Septiembre',
            monto: 25000,
            estado: 'completed',
            metodo: 'Card',
            vencimiento: '08-09-2025'
        },
        {
            id: 'xk77wpz8',
            fecha: '10-08-2025',
            concepto: 'Cuota Social Mensual - Agosto',
            monto: 27500,
            estado: 'overdue',
            metodo: 'Card',
            vencimiento: '08-08-2025'
        },
        {
            id: 'kg99mkq5',
            fecha: '15-07-2025',
            concepto: 'Pase de Invitado',
            monto: 5000,
            estado: 'completed',
            metodo: 'Card',
            vencimiento: null
        }
    ],
    tiposPago: [
        {
            id: 'mensual',
            nombre: 'Cuota Social Mensual',
            descripcion: 'Cuota mensual del club',
            monto: 25000
        },
        {
            id: 'anual',
            nombre: 'Cuota Social Anual',
            descripcion: 'Cuota anual del club (descuento 17%)',
            monto: 250000
        },
        {
            id: 'invitado',
            nombre: 'Pase de Invitado',
            descripcion: 'Acceso de invitado por día',
            monto: 5000
        }
    ]
};

// =========================================
// INICIALIZACIÓN
// =========================================
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initPagosModule();
});

// =========================================
// NAVEGACIÓN DE PESTAÑAS
// =========================================
function initTabNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            sections.forEach(section => section.classList.remove('active'));
            const activeSection = document.getElementById(`${tabName}-content`);
            if (activeSection) activeSection.classList.add('active');
        });
    });

    const logoutBtn = document.querySelector('.header__logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

function handleLogout() {
    mostrarModalLogout();
}

function mostrarModalLogout() {
    const modal = document.createElement('div');
    modal.id = 'modal-logout';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s ease;';
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 400px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: slideUp 0.3s ease;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem; color: #111827;">Cerrar Sesión</h3>
            <p style="margin: 0 0 1.5rem 0; color: #4b5563;">¿Estás seguro que deseas cerrar sesión?</p>
            <div style="display: flex; gap: 0.75rem;">
                <button id="btn-cancelar-logout" style="flex: 1; padding: 0.75rem; background: #e5e7eb; color: #374151; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 150ms;">
                    Cancelar
                </button>
                <button id="btn-confirmar-logout" style="flex: 1; padding: 0.75rem; background: #ef4444; color: white; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 150ms;">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    document.getElementById('btn-cancelar-logout').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => modal.remove(), 200);
    });

    document.getElementById('btn-confirmar-logout').addEventListener('click', () => {
        modal.remove();
        console.log('Cerrando sesión...');
        showSuccessMessage('Sesión cerrada exitosamente');
        // Aquí puedes agregar: window.location.href = '/login';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        }
    });
}

// =========================================
// MÓDULO DE PAGOS
// =========================================
function initPagosModule() {
    renderPagosSection();
}

// Renderizar toda la sección de pagos
function renderPagosSection() {
    const section = document.getElementById('pagos-content');
    if (!section) return;

    section.innerHTML = `
        <!-- Estado de Membresía -->
        <div class="membership-status-container"></div>

        <!-- Grid de 2 columnas -->
        <div class="pagos-grid">
            <!-- Columna izquierda: Realizar Pago -->
            <div class="content-card">
                <div class="card-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    <h2>Realizar Pago</h2>
                </div>
                <p class="card-subtitle">Selecciona el tipo de pago que deseas realizar</p>
                <h3 class="section-title">Tipo de Pago</h3>
                <div class="payment-options"></div>
            </div>

            <!-- Columna derecha: Historial de Pagos -->
            <div class="content-card">
                <div class="card-header">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <h2>Historial de Pagos</h2>
                </div>
                <p class="card-subtitle">Tus últimos pagos realizados</p>
                <div class="payment-history"></div>
            </div>
        </div>

        <!-- Tarjetas de resumen -->
        <div class="summary-cards"></div>
    `;

    // Renderizar componentes individuales
    renderPaymentOptions();
    renderPaymentHistory();
    updateSummaryCards();
    updateMembershipStatus();
}

// Renderizar opciones de pago
function renderPaymentOptions() {
    const container = document.querySelector('.payment-options');
    if (!container) return;

    container.innerHTML = appState.tiposPago.map(tipo => `
        <div class="payment-option" data-tipo="${tipo.id}" data-monto="${tipo.monto}">
            <div class="payment-info">
                <h4>${tipo.nombre}</h4>
                <p>${tipo.descripcion}</p>
            </div>
            <span class="payment-price">${formatMoney(tipo.monto)}</span>
        </div>
    `).join('');

    // Agregar event listeners
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', handlePaymentSelection);
    });
}

// Manejar selección de tipo de pago
function handlePaymentSelection(e) {
    const option = e.currentTarget;
    const tipo = option.dataset.tipo;
    const monto = parseInt(option.dataset.monto);

    // Resaltar opción seleccionada
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.style.borderColor = '#e5e7eb';
        opt.style.backgroundColor = 'transparent';
        // Remover botón de pago si existe
        const existingBtn = opt.querySelector('.btn-pagar-ahora');
        if (existingBtn) existingBtn.remove();
    });
    
    option.style.borderColor = '#2563eb';
    option.style.backgroundColor = '#f9fafb';

    // Agregar botón "Pagar Ahora" si no existe
    if (!option.querySelector('.btn-pagar-ahora')) {
        const btnPagar = document.createElement('button');
        btnPagar.className = 'btn-pagar-ahora';
        btnPagar.textContent = 'Pagar Ahora';
        btnPagar.onclick = (event) => {
            event.stopPropagation();
            mostrarModalConfirmacion(tipo, monto);
        };
        option.appendChild(btnPagar);
    }
}

// Mostrar modal de confirmación personalizado
function mostrarModalConfirmacion(tipo, monto) {
    const tipoInfo = appState.tiposPago.find(t => t.id === tipo);
    const concepto = tipoInfo ? tipoInfo.nombre : 'Pago Personalizado';

    const modal = document.createElement('div');
    modal.id = 'modal-confirmacion';
    modal.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s ease;';
    
    modal.innerHTML = `
        <div style="background: white; padding: 2rem; border-radius: 1rem; max-width: 400px; width: 90%; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); animation: slideUp 0.3s ease;">
            <h3 style="margin: 0 0 1rem 0; font-size: 1.25rem; color: #111827;">Confirmar Pago</h3>
            <p style="margin: 0 0 0.5rem 0; color: #4b5563;">¿Deseas realizar el siguiente pago?</p>
            <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin: 1rem 0;">
                <p style="margin: 0 0 0.25rem 0; color: #6b7280; font-size: 0.875rem;">Concepto</p>
                <p style="margin: 0 0 0.75rem 0; color: #111827; font-weight: 600;">${concepto}</p>
                <p style="margin: 0 0 0.25rem 0; color: #6b7280; font-size: 0.875rem;">Monto</p>
                <p style="margin: 0; color: #111827; font-weight: 700; font-size: 1.5rem;">${formatMoney(monto)}</p>
            </div>
            <div style="display: flex; gap: 0.75rem; margin-top: 1.5rem;">
                <button id="btn-cancelar-pago" style="flex: 1; padding: 0.75rem; background: #e5e7eb; color: #374151; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 150ms;">
                    Cancelar
                </button>
                <button id="btn-confirmar-pago" style="flex: 1; padding: 0.75rem; background: #2563eb; color: white; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer; transition: all 150ms;">
                    Confirmar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Event listeners
    document.getElementById('btn-cancelar-pago').addEventListener('click', () => {
        modal.style.animation = 'fadeOut 0.2s ease';
        setTimeout(() => modal.remove(), 200);
    });

    document.getElementById('btn-confirmar-pago').addEventListener('click', () => {
        modal.remove();
        procesarPago(tipo, monto);
    });

    // Cerrar al hacer click fuera del modal
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.animation = 'fadeOut 0.2s ease';
            setTimeout(() => modal.remove(), 200);
        }
    });
}

// Procesar pago
function procesarPago(tipo, monto) {
    const tipoInfo = appState.tiposPago.find(t => t.id === tipo);
    const concepto = tipoInfo ? tipoInfo.nombre : 'Pago Personalizado';

        // Mostrar loading
        showLoadingPayment();

        // Simular proceso de pago (2 segundos)
        setTimeout(() => {
            const nuevoPago = {
                id: generatePaymentId(),
                fecha: getCurrentDate(),
                concepto: `${concepto} - ${getCurrentMonth()}`,
                monto: monto,
                estado: 'completed',
                metodo: 'Card',
                vencimiento: tipo === 'mensual' ? getNextMonthDueDate() : null
            };

            // Agregar pago al historial
            appState.pagos.unshift(nuevoPago);

            // Actualizar estado de membresía si es cuota mensual
            if (tipo === 'mensual') {
                appState.membresia.estado = 'paid';
                appState.membresia.fechaVencimiento = getNextMonthDueDate();
                appState.membresia.diasRestantes = 30;
            }

            // Actualizar UI
            renderPaymentHistory();
            updateSummaryCards();
            updateMembershipStatus();
            hideLoadingPayment();

            // Mensaje de éxito
            showSuccessMessage('¡Pago procesado exitosamente!');

            // Quitar resaltado y botones
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.style.borderColor = '#e5e7eb';
                opt.style.backgroundColor = 'transparent';
                const btn = opt.querySelector('.btn-pagar-ahora');
                if (btn) btn.remove();
            });
        }, 2000);
    
}

// Renderizar historial de pagos
function renderPaymentHistory() {
    const container = document.querySelector('.payment-history');
    if (!container) return;

    if (appState.pagos.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No hay pagos registrados</p>';
        return;
    }

    container.innerHTML = appState.pagos.map(pago => `
        <div class="payment-item">
            <div class="payment-details">
                <h4>${pago.concepto}</h4>
                <div class="payment-meta">
                    <span>📅 ${pago.fecha}</span>
                    <span>ID: ${pago.id}</span>
                    ${pago.vencimiento ? `<span>Venc: ${pago.vencimiento}</span>` : ''}
                </div>
            </div>
            <div class="payment-status">
                <span class="status-badge ${pago.estado}">${getStatusText(pago.estado)}</span>
                <span class="payment-amount">$${formatMoney(pago.monto)}</span>
                <span class="payment-method">${pago.metodo}</span>
            </div>
        </div>
    `).join('');
}

// Actualizar tarjetas de resumen
function updateSummaryCards() {
    const totalPagado = appState.pagos.reduce((sum, p) => sum + p.monto, 0);
    const ultimoPago = appState.pagos.length > 0 ? appState.pagos[0].fecha : '-';
    const totalPagos = appState.pagos.length;

    document.querySelector('.summary-cards').innerHTML = `
        <div class="summary-card">
            <div class="summary-icon" style="color: #10b981;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            </div>
            <div class="summary-info">
                <p class="summary-label">Total Pagado</p>
                <h3 class="summary-value">$${formatMoney(totalPagado)}</h3>
            </div>
        </div>
        <div class="summary-card">
            <div class="summary-icon" style="color: #3b82f6;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
            </div>
            <div class="summary-info">
                <p class="summary-label">Último Pago</p>
                <h3 class="summary-value">${ultimoPago}</h3>
            </div>
        </div>
        <div class="summary-card">
            <div class="summary-icon" style="color: #8b5cf6;">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            </div>
            <div class="summary-info">
                <p class="summary-label">Total Pagos</p>
                <h3 class="summary-value">${totalPagos}</h3>
            </div>
        </div>
    `;
}

// Actualizar estado de membresía
function updateMembershipStatus() {
    const container = document.querySelector('.membership-status-container');
    if (!container) return;

    const { estado, fechaInicio, fechaVencimiento, diasRestantes, montoMensual } = appState.membresia;

    container.innerHTML = `
        <div class="membership-status ${estado}">
            <div class="membership-header">
                <h3>Membresía Mensual</h3>
                <span class="status-badge ${estado}">${getStatusText(estado)}</span>
            </div>
            <div class="membership-details">
                <div class="detail-item">
                    <span class="detail-label">Fecha Inicio</span>
                    <span class="detail-value">${fechaInicio}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Vencimiento</span>
                    <span class="detail-value ${estado === 'pending' || estado === 'overdue' ? 'warning' : 'success'}">${fechaVencimiento}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Días Restantes</span>
                    <span class="detail-value ${diasRestantes <= 5 ? 'warning' : 'success'}">${diasRestantes} días</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Monto ${estado === 'paid' ? 'Pagado' : 'a Pagar'}</span>
                    <span class="detail-value">${formatMoney(montoMensual)}</span>
                </div>
            </div>
        </div>
    `;
}

// =========================================
// FUNCIONES AUXILIARES
// =========================================
function formatMoney(amount) {
    return amount.toLocaleString('es-AR');
}

function getCurrentDate() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function getCurrentMonth() {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return meses[new Date().getMonth()];
}

function getNextMonthDueDate() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(8); // Vencimiento el día 8
    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
}

function generatePaymentId() {
    return Math.random().toString(36).substring(2, 10);
}

function getStatusText(status) {
    const statusMap = {
        'completed': 'Pagado',
        'pending': 'Pendiente',
        'overdue': 'Vencido +10%',
        'paid': 'Al Día'
    };
    return statusMap[status] || status;
}

function showLoadingPayment() {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 9999;';
    overlay.innerHTML = '<div style="background: white; padding: 2rem; border-radius: 0.75rem; text-align: center;"><h3 style="margin: 0 0 1rem 0;">Procesando pago...</h3><p style="color: #6b7280; margin: 0;">Por favor espere</p></div>';
    document.body.appendChild(overlay);
}

function hideLoadingPayment() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
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

// Agregar animaciones CSS y estilos adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    @keyframes slideUp {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    /* Scroll en el historial de pagos */
    .payment-history {
        max-height: 500px;
        overflow-y: auto;
        padding-right: 0.5rem;
    }
    
    /* Estilo del scrollbar */
    .payment-history::-webkit-scrollbar {
        width: 8px;
    }
    
    .payment-history::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
    }
    
    .payment-history::-webkit-scrollbar-thumb {
        background: #888;
        border-radius: 4px;
    }
    
    .payment-history::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
    
    /* Botón Pagar Ahora */
    .btn-pagar-ahora {
        background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
        color: white;
        padding: 0.625rem 1.5rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.9375rem;
        cursor: pointer;
        transition: all 200ms ease;
        box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3);
        margin-top: 0.5rem;
        width: 100%;
    }
    
    .btn-pagar-ahora:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px -2px rgba(37, 99, 235, 0.4);
        background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
    }
    
    .btn-pagar-ahora:active {
        transform: translateY(0);
    }
    
    /* Fijar scrollbar para evitar saltos */
    html {
        overflow-y: scroll;
    }
    
    /* Hover effects para botones del modal */
    #btn-cancelar-pago:hover {
        background: #d1d5db !important;
    }
    
    #btn-confirmar-pago:hover {
        background: #1d4ed8 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
    }
    
    #btn-confirmar-logout:hover {
        background: #dc2626 !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 6px rgba(239, 68, 68, 0.3);
    }
`;
document.head.appendChild(style);