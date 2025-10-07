import Navbar from "../components/Navbar";
import "./Pagos.scss";

function Pagos() {
  return (
    <div className="pagos-page">
      <Navbar />

      <div className="pagos-container">
        {/* Sección izquierda */}
        <div className="pagos-left">
          <h3>
            <i className="fa-regular fa-credit-card"></i> Realizar Pago
          </h3>
          <p className="subtitulo">
            Selecciona el tipo de pago que deseas realizar
          </p>

          <p className="titulo-seccion">Tipo de Pago</p>

          <div className="pago-item">
            <div>
              <p className="nombre">Cuota Social Mensual</p>
              <p className="descripcion">Cuota mensual del club</p>
            </div>
            <span className="monto">$25.000</span>
          </div>

          <div className="pago-item">
            <div>
              <p className="nombre">Cuota Social Anual</p>
              <p className="descripcion">
                Cuota anual del club (descuento 17%)
              </p>
            </div>
            <span className="monto">$250.000</span>
          </div>

          <div className="pago-item">
            <div>
              <p className="nombre">Pase de Invitado</p>
              <p className="descripcion">Acceso de invitado por día</p>
            </div>
            <span className="monto">$5.000</span>
          </div>

          <div className="pago-item">
            <div>
              <p className="nombre">Monto Personalizado</p>
              <p className="descripcion">
                Ingresa el monto que deseas pagar
              </p>
            </div>
          </div>
        </div>

        {/* Sección derecha */}
        <div className="pagos-right">
          <h3>
            <i className="fa-regular fa-file-lines"></i> Historial de Pagos
          </h3>
          <p className="subtitulo">Tus últimos pagos realizados</p>

          <div className="historial-item">
            <div className="info">
              <p className="nombre">Cuota Social Anual</p>
              <div className="meta">
                <i className="fa-regular fa-calendar"></i> 30-09-2025
                <span className="id">ID: g20u8u7j</span>
              </div>
            </div>
            <div className="estado">
              <span className="badge verde">Completado</span>
              <span className="monto">$250.000</span>
              <p className="metodo">Card</p>
            </div>
          </div>

          <div className="historial-item">
            <div className="info">
              <p className="nombre">Pase de Invitado</p>
              <div className="meta">
                <i className="fa-regular fa-calendar"></i> 30-09-2025
                <span className="id">ID: 2e7o7iqw</span>
              </div>
            </div>
            <div className="estado">
              <span className="badge verde">Completado</span>
              <span className="monto">$5.000</span>
              <p className="metodo">Card</p>
            </div>
          </div>

          <div className="historial-item">
            <div className="info">
              <p className="nombre">Cuota Social Mensual</p>
              <div className="meta">
                <i className="fa-regular fa-calendar"></i> 30-09-2025
                <span className="id">ID: 9x69j27i</span>
              </div>
            </div>
            <div className="estado">
              <span className="badge verde">Completado</span>
              <span className="monto">$25.000</span>
              <p className="metodo">Card</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Pagos;
