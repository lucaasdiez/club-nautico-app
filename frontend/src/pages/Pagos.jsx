import "./Pagos.scss";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import '../styles/_container.scss';
function Pagos() {
  const MySwal = withReactContent(Swal);
  const [historial, setHistorial] = useState([
    { id: "1", tipo: "Cuota Social Mensual", monto: 25000, fecha: "30-09-2025" },
    { id: "2", tipo: "Cuota Social Anual", monto: 250000, fecha: "15-08-2025" },
  ]);

  useEffect(() => {
    const hasWelcomed = sessionStorage.getItem("pagosWelcome");
    const nombre = localStorage.getItem("userName") || "socio";

    if (!hasWelcomed) {
      MySwal.fire({
        title: `¡Hola, ${nombre.split(" ")[0]}! 💳`,
        text: "Desde aquí podés gestionar tus pagos y ver tu historial.",
        icon: "info",
        confirmButtonColor: "#1e3a8a",
        background: "#f8f9fb",
        color: "#333",
        timer: 2300,
        showConfirmButton: false,
      });
      sessionStorage.setItem("pagosWelcome", "true");
    }
  }, []);

  const realizarPago = (tipo, monto) => {
    MySwal.fire({
      title: `¿Confirmar pago de ${tipo}?`,
      text: `Monto: $${monto.toLocaleString()}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#b91c1c",
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevoPago = {
          id: Math.random().toString(36).substr(2, 8),
          tipo,
          monto,
          fecha: new Date().toLocaleDateString(),
        };
        setHistorial([nuevoPago, ...historial]);
        MySwal.fire({
          title: "✅ Pago exitoso",
          text: `${tipo} abonado correctamente.`,
          icon: "success",
          confirmButtonColor: "#1e3a8a",
        });
      }
    });
  };

  return (
    <div className="page-background">
      <Navbar />
<div className="page-container animate-fade">
  <div className="pagos-content">

          <h1 className="titulo-principal">Gestión de Pagos</h1>

          {/* Cards resumen */}
          <div className="cards-summary">
            <div className="card">
              <p className="label">CUOTA ACTUAL</p>
              <h3 className="value">$25.000</h3>
            </div>

            <div className="card">
              <p className="label">PRÓXIMO VENCIMIENTO</p>
              <h3 className="value">30-10-2025</h3>
            </div>

            <div className="card">
              <p className="label">ESTADO DE CUENTA</p>
              <h3 className="value active">Al día</h3>
            </div>
          </div>

          {/* Sección principal */}
          <div className="main-section">
            {/* PANEL DE PAGO */}
            <div className="info-card">
              <h2>Realizar Pago</h2>
              <p className="subtitle">Seleccioná el tipo de pago que deseas realizar:</p>

              <div className="pago-opciones">
                <div className="pago-item" onClick={() => realizarPago("Cuota Social Mensual", 25000)}>
                  <div>
                    <h4>Cuota Social Mensual</h4>
                    <p>Pago regular del socio activo</p>
                  </div>
                  <span>$25.000</span>
                </div>

                <div className="pago-item" onClick={() => realizarPago("Cuota Social Anual", 250000)}>
                  <div>
                    <h4>Cuota Social Anual</h4>
                    <p>Incluye descuento del 15%</p>
                  </div>
                  <span>$250.000</span>
                </div>

                <div className="pago-item" onClick={() => realizarPago("Pase de Invitado", 5000)}>
                  <div>
                    <h4>Pase de Invitado</h4>
                    <p>Acceso diario a instalaciones</p>
                  </div>
                  <span>$5.000</span>
                </div>
              </div>
            </div>

            {/* HISTORIAL DE PAGOS */}
            <div className="disciplines-card">
              <div className="historial-header">
                <h2>Historial de Pagos</h2>
                <p className="subtitle">Últimos movimientos registrados</p>
              </div>

              {historial.length > 0 ? (
                <div className="historial-lista">
                  {historial.map((pago, index) => (
                    <div className="pago-item historial" key={index}>
                      <div>
                        <h4>{pago.tipo}</h4>
                        <p>
                          <i className="fa-regular fa-calendar"></i> {pago.fecha}
                        </p>
                      </div>
                      <div className="precio">
                        <span>${pago.monto.toLocaleString()}</span>
                        <small>completado</small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-pagos">No hay pagos registrados.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagos;