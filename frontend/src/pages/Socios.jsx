import { useEffect, useState } from "react";
import { getSocios } from "../services/sociosService";
import "./Socios.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Socios() {
  const [socios, setSocios] = useState([]);
  const MySwal = withReactContent(Swal);

  useEffect(() => {
    getSocios()
      .then((res) => {
        setSocios(res.data);
        // ✅ mensaje de carga exitosa solo la primera vez
        const shown = sessionStorage.getItem("sociosWelcomed");
        if (!shown) {
          MySwal.fire({
            title: "Gestión de Socios 👥",
            text: "Aquí podés ver la información de todos los socios activos.",
            icon: "info",
            timer: 2500,
            showConfirmButton: false,
            background: "#f8f9fb",
            color: "#333",
          });
          sessionStorage.setItem("sociosWelcomed", "true");
        }
      })
      .catch(() =>
        MySwal.fire({
          title: "Error",
          text: "No se pudieron cargar los socios.",
          icon: "error",
          confirmButtonColor: "#b91c1c",
        })
      );
  }, []);

  return (
    <div className="socios-page">
      {/* ✅ Logo institucional arriba */}
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
                <th>ID</th>
                <th>Nombre</th>
                <th>DNI</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {socios.length > 0 ? (
                socios.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.nombre}</td>
                    <td>{s.dni}</td>
                    <td>{s.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No hay socios registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Botón volver al menú */}
        <button
          className="back-btn"
          onClick={() => (window.location.href = "/admin")}
        >
          ⬅ Volver al Panel de Administración
        </button>
      </div>
    </div>
  );
}

export default Socios;
