import { useEffect, useState } from "react";
import { getSocios, deleteSocio, updateSocio } from "../services/sociosService";
import "./Socios.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24" height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// 👇 ahora matchea el SocioDTO
const initialSocioState = {
  username: "",
  password: "",
  nroSocio: "",
  dni: "",
  nombre: "",
  apellido: "",
  email: "",
  telefono: "",
};

function Socios() {
  const [socios, setSocios] = useState([]);
  const MySwal = withReactContent(Swal);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSocio, setCurrentSocio] = useState(initialSocioState);
  const [editingNroSocio, setEditingNroSocio] = useState(null);

  const cargarSocios = async () => {
    try {
      const res = await getSocios();
      setSocios(res.data.data || []);

      const shown = sessionStorage.getItem("sociosWelcomed");
      if (!shown) {
        MySwal.fire({
          title: "¡Bienvenido, Admin!",
          text: "Desde aquí puedes gestionar todos los socios del sistema.",
          icon: "info",
          timer: 2000,
          showConfirmButton: false,
        });
        sessionStorage.setItem("sociosWelcomed", "true");
      }
    } catch (err) {
      console.error("¡ERROR EN EL CATCH!", err);
      MySwal.fire({
        title: "Error al Cargar",
        text: "No se pudieron cargar los socios. Revisa la consola o la conexión.",
        icon: "error",
      });
    }
  };

  useEffect(() => {
    cargarSocios();
  }, []);

  const handleDelete = async (nroSocio, nombre, apellido) => {
    const result = await MySwal.fire({
      title: `¿Estás seguro?`,
      text: `Se eliminará permanentemente al socio: ${nombre} ${apellido} (Nro. ${nroSocio}).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, ¡eliminar!",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await deleteSocio(nroSocio);
        setSocios((prev) => prev.filter((s) => s.nroSocio !== nroSocio));
        MySwal.fire("¡Eliminado!", "El socio ha sido eliminado.", "success");
      } catch (error) {
        console.error("Error al eliminar:", error);
        MySwal.fire(
          "Error",
          "No se pudo eliminar al socio. " + (error.response?.data?.message || ""),
          "error"
        );
      }
    }
  };

  // Abrir modal para EDITAR
  const handleEdit = (nroSocio) => {
    const socioAEditar = socios.find((s) => s.nroSocio === nroSocio);
    if (!socioAEditar) return;

    setCurrentSocio({
      username: socioAEditar.username || "",
      password: "", // no traemos la real; si la llenás, se cambia
      nroSocio: socioAEditar.nroSocio || "",
      dni: socioAEditar.dni || "",
      nombre: socioAEditar.nombre || "",
      apellido: socioAEditar.apellido || "",
      email: socioAEditar.email || "",
      telefono: socioAEditar.telefono || "",
    });
    setEditingNroSocio(socioAEditar.nroSocio);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentSocio((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !currentSocio.nombre ||
      !currentSocio.apellido ||
      !currentSocio.dni ||
      !currentSocio.email ||
      !currentSocio.username
    ) {
      MySwal.fire(
        "Campos incompletos",
        "Username, Nombre, Apellido, DNI y Email son obligatorios.",
        "warning"
      );
      return;
    }

    try {
      // armamos payload a partir del estado
      const payload = { ...currentSocio };

      // si dejás password vacío, NO mandamos el campo (para no pisarla con vacío)
      if (!payload.password) {
        delete payload.password;
      }

      await updateSocio(editingNroSocio, payload);
      MySwal.fire("¡Éxito!", "Socio actualizado correctamente.", "success");

      setIsModalOpen(false);
      cargarSocios();
    } catch (error) {
      console.error("Error al actualizar socio:", error);
      MySwal.fire(
        "Error",
        "No se pudo actualizar el socio. " + (error.response?.data?.message || ""),
        "error"
      );
    }
  };

  return (
    <div className="socios-page">
      <img
        src="/logo-png-redondo-297x300.png"
        alt="Logo institucional"
        className="socios-logo"
      />

      <div className="socios-card">
        <h1>Gestión de Socios</h1>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nro. Socio</th>
                <th>Nombre Completo</th>
                <th>DNI</th>
                <th>Email</th>
                <th className="acciones-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {socios.length > 0 ? (
                socios.map((s) => (
                  <tr key={s.nroSocio || s.id}>
                    <td>{s.nroSocio}</td>
                    <td>
                      {s.nombre} {s.apellido}
                    </td>
                    <td>{s.dni}</td>
                    <td>{s.email}</td>
                    <td className="acciones-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(s.nroSocio)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() =>
                          handleDelete(s.nroSocio, s.nombre, s.apellido)
                        }
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No hay socios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button
          className="back-btn"
          onClick={() => (window.location.href = "/admin")}
        >
          ⬅ Volver al Panel de Administración
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="modal-close-btn" onClick={handleCloseModal}>
              <CloseIcon />
            </button>

            <h2>Editar Socio</h2>

            <form className="create-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nroSocio">Nro. Socio</label>
                  <input
                    type="text"
                    id="nroSocio"
                    name="nroSocio"
                    value={currentSocio.nroSocio}
                    onChange={handleFormChange}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="username">Usuario</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={currentSocio.username}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="dni">DNI</label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={currentSocio.dni}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={currentSocio.nombre}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="apellido">Apellido</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={currentSocio.apellido}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={currentSocio.telefono}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentSocio.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="password">
                    Nueva contraseña (opcional)
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={currentSocio.password}
                    onChange={handleFormChange}
                    placeholder="Dejar en blanco para no cambiarla"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-submit-create">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Socios;
