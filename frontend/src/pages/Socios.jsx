import { useEffect, useState } from "react";
import { getSocios } from "../services/sociosService";
import "./Socios.scss";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Socios() {
  const [socios, setSocios] = useState([]);
  const MySwal = withReactContent(Swal);
useEffect(() => {
    
    console.log("1. Cargando componente Socios..."); // Para ver si el componente carga

    getSocios()
      .then((res) => { 
        
        // --- ¡VAMOS A ESPIAR AQUÍ! ---
        console.log("2. Respuesta COMPLETA de la API (res):", res);
        console.log("3. El 'res.data' (ApiResponse) es:", res.data);
        console.log("4. El 'res.data.data' (el array) es:", res.data.data);
        // --- FIN DE LA INSPECCIÓN ---

        setSocios(res.data.data); // Esta línea sigue siendo la correcta

        const shown = sessionStorage.getItem("sociosWelcomed");
        if (!shown) {
          MySwal.fire({
            // ... (tu alerta)
          });
          sessionStorage.setItem("sociosWelcomed", "true");
        }
      })
      .catch((err) => { // <-- ¡IMPORTANTE! Agregá (err) aquí
        console.error("¡ERROR EN EL CATCH!", err); // 5. Para ver si la API está fallando
        MySwal.fire({
          // ... (tu alerta de error)
        })
      }
    );
  }, []);

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
