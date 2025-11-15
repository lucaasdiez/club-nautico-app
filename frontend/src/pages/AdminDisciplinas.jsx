import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// ✅ IMPORTAMOS TODOS LOS SERVICIOS
import {
  getDisciplinas,
  deleteDisciplina,
  createDisciplina,
  updateDisciplina, // <-- IMPORTADO
} from "../services/disciplinaService";
import "./AdminDisciplinas.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Componente helper para el ícono de 'X'
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Objeto inicial para resetear el formulario
const initialDisciplinaState = {
  nombre: "",
  descripcion: "",
  precioMensual: "",
  cupoMaximo: "",
  horarios: [],
};

const diasSemana = ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO"];

function AdminDisciplinas() {
  const [disciplinas, setDisciplinas] = useState([]);
  const MySwal = withReactContent(Swal);
  const navigate = useNavigate(); // Sigue aquí por si lo necesitas a futuro

  // --- ESTADOS UNIFICADOS PARA EL MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create"); // 'create' o 'edit'
  const [currentDisciplina, setCurrentDisciplina] = useState(initialDisciplinaState);
  const [editingNombre, setEditingNombre] = useState(null); // Para guardar el ID original al editar

  // --- LÓGICA DE CARGA DE DATOS ---
  const cargarDisciplinas = async () => {
    try {
      const res = await getDisciplinas();
      setDisciplinas(res.data || []);
    } catch (err) {
      console.error("Error al cargar disciplinas:", err);
      MySwal.fire("Error al Cargar", "No se pudieron cargar las disciplinas.", "error");
    }
  };

  useEffect(() => {
    cargarDisciplinas();
    // ... (tu lógica de bienvenida)
  }, []);

  // --- LÓGICA DEL CRUD (DELETE) ---
  const handleDelete = async (nombre) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro?`,
      text: `Se eliminará permanentemente la disciplina: ${nombre}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, ¡eliminar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteDisciplina(nombre);
        setDisciplinas(disciplinas.filter((d) => d.nombre !== nombre));
        MySwal.fire("¡Eliminada!", "La disciplina ha sido eliminada.", "success");
      } catch (error) {
        console.error("Error al eliminar:", error);
        MySwal.fire("Error", "No se pudo eliminar la disciplina.", "error");
      }
    }
  };

  // --- LÓGICA DEL FORMULARIO (MODIFICADA) ---

  // Abre el modal para CREAR
  const handleCreate = () => {
    setModalMode("create");
    setCurrentDisciplina(initialDisciplinaState);
    setEditingNombre(null);
    setIsModalOpen(true);
  };

  // ✅ NUEVA FUNCIÓN: Abre el modal para EDITAR
  const handleEdit = (nombre) => {
    const disciplinaAEditar = disciplinas.find((d) => d.nombre === nombre);
    if (!disciplinaAEditar) return;

    setModalMode("edit");
    // Aseguramos que los horarios no sean null
    setCurrentDisciplina({ ...disciplinaAEditar, horarios: disciplinaAEditar.horarios || [] }); 
    setEditingNombre(disciplinaAEditar.nombre); // Guardamos el nombre original
    setIsModalOpen(true);
  };

  // Cierra el modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Maneja cambios en los inputs (sin cambios)
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentDisciplina((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- LÓGICA DE HORARIOS (Sin cambios) ---
  const handleAddHorario = () => {
    setCurrentDisciplina((prev) => ({
      ...prev,
      horarios: [
        ...prev.horarios,
        { dia: "LUNES", horaInicio: "09:00", horaFin: "10:00" },
      ],
    }));
  };

  const handleRemoveHorario = (indexToRemove) => {
    setCurrentDisciplina((prev) => ({
      ...prev,
      horarios: prev.horarios.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleHorarioChange = (index, e) => {
    const { name, value } = e.target;
    const updatedHorarios = [...currentDisciplina.horarios];
    updatedHorarios[index] = { ...updatedHorarios[index], [name]: value };
    setCurrentDisciplina((prev) => ({ ...prev, horarios: updatedHorarios }));
  };

  // ✅ NUEVA FUNCIÓN: Envía el formulario (Crear O Editar)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación
    if (!currentDisciplina.nombre || !currentDisciplina.precioMensual || !currentDisciplina.cupoMaximo) {
      MySwal.fire("Campos incompletos", "Nombre, Precio y Cupo son obligatorios.", "warning");
      return;
    }

    try {
      if (modalMode === "create") {
        // --- Lógica de CREAR ---
        await createDisciplina(currentDisciplina);
        MySwal.fire("¡Éxito!", "Disciplina creada correctamente.", "success");
      } else {
        // --- Lógica de EDITAR ---
        await updateDisciplina(editingNombre, currentDisciplina);
        MySwal.fire("¡Éxito!", "Disciplina actualizada correctamente.", "success");
      }
      
      setIsModalOpen(false); // Cierra el modal
      cargarDisciplinas(); // Recarga la lista

    } catch (error) {
      console.error("Error al guardar disciplina:", error);
      const msg = modalMode === 'create' ? "crear" : "actualizar";
      MySwal.fire("Error", `No se pudo ${msg} la disciplina. ` + (error.response?.data?.message || ""), "error");
    }
  };

  // --- RENDERIZADO ---
  return (
    <div className="disciplinas-admin-page">
      <img
        src="/logo-png-redondo-297x300.png"
        alt="Logo institucional"
        className="disciplinas-admin-logo"
      />

      <div className="disciplinas-admin-card">
        <h1>Gestión de Disciplinas</h1>

        <div className="header-actions">
          <button className="btn-crear" onClick={handleCreate}>
            + Crear Nueva Disciplina
          </button>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Precio Mensual</th>
                <th>Cupo Máximo</th>
                <th>Estado</th>
                <th className="acciones-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {disciplinas.length > 0 ? (
                disciplinas.map((d) => (
                  <tr key={d.nombre}>
                    <td>{d.nombre}</td>
                    <td>${d.precioMensual}</td>
                    <td>{d.cupoMaximo}</td>
                    <td>
                      <span className={`status-badge ${d.estado?.toLowerCase()}`}>
                        {d.estado}
                      </span>
                    </td>
                    <td className="acciones-cell">
                      {/* ✅ ONCLICK ACTUALIZADO */}
                      <button className="btn-edit" onClick={() => handleEdit(d.nombre)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => handleDelete(d.nombre)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No hay disciplinas registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button className="back-btn" onClick={() => (window.location.href = "/admin")}>
          ⬅ Volver al Panel de Administración
        </button>
      </div>

      {/* --- MODAL UNIFICADO (CREAR/EDITAR) --- */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={handleCloseModal}>
              <CloseIcon />
            </button>
            
            {/* ✅ TÍTULO DINÁMICO */}
            <h2>{modalMode === 'create' ? 'Crear Nueva Disciplina' : 'Editar Disciplina'}</h2>
            
            {/* ✅ ONSUBMIT ACTUALIZADO */}
            <form className="create-form" onSubmit={handleSubmit}>
              
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="nombre">Nombre</label>
                  {/* Usamos 'currentDisciplina' en lugar de 'newDisciplina' */}
                  <input type="text" id="nombre" name="nombre" value={currentDisciplina.nombre} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="precioMensual">Precio Mensual</label>
                  <input type="number" id="precioMensual" name="precioMensual" value={currentDisciplina.precioMensual} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="cupoMaximo">Cupo Máximo</label>
                  <input type="number" id="cupoMaximo" name="cupoMaximo" value={currentDisciplina.cupoMaximo} onChange={handleFormChange} required />
                </div>
                <div className="form-group full-width">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea id="descripcion" name="descripcion" value={currentDisciplina.descripcion} onChange={handleFormChange} rows="3"></textarea>
                </div>
              </div>

              <h4>Horarios</h4>
              <div className="horarios-editor">
                {currentDisciplina.horarios.map((horario, index) => (
                  <div className="horario-item" key={index}>
                    <div className="form-group">
                      <label>Día</label>
                      <select name="dia" value={horario.dia} onChange={(e) => handleHorarioChange(index, e)}>
                        {diasSemana.map(dia => <option key={dia} value={dia}>{dia}</option>)}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Inicio</label>
                      <input type="time" name="horaInicio" value={horario.horaInicio} onChange={(e) => handleHorarioChange(index, e)} />
                    </div>
                    <div className="form-group">
                      <label>Fin</label>
                      <input type="time" name="horaFin" value={horario.horaFin} onChange={(e) => handleHorarioChange(index, e)} />
                    </div>
                    <button type="button" className="btn-remove-horario" onClick={() => handleRemoveHorario(index)}>
                      &times;
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-add-horario" onClick={handleAddHorario}>
                  + Añadir Horario
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancelar
                </button>
                {/* ✅ BOTÓN DINÁMICO */}
                <button type="submit" className="btn-submit-create">
                  {modalMode === 'create' ? 'Crear Disciplina' : 'Guardar Cambios'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDisciplinas;