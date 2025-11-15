import Navbar from "../components/Navbar";
import "./Acceso.scss";
import QRious from "qrious";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { generarCodigoAcceso, validarCodigoAcceso } from "../services/codigoAccesoService";
import { getNroSocio, getUserName } from "../services/authService";

function Acceso() {
  const qrRef = useRef(null);
  const [codigoData, setCodigoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState("");

  useEffect(() => {
    generarNuevoCodigo();
  }, []);

  useEffect(() => {
    if (!codigoData) return;
    const interval = setInterval(() => calcularTiempoRestante(), 60000);
    calcularTiempoRestante();
    return () => clearInterval(interval);
  }, [codigoData]);

  const calcularTiempoRestante = () => {
    if (!codigoData?.expiraEn) return;
    const expiracion = new Date(codigoData.expiraEn);
    const ahora = new Date();
    const diff = expiracion - ahora;

    if (diff <= 0) {
      setTiempoRestante("expirado");
      return;
    }

    const horas = Math.floor(diff / (1000 * 60 * 60));
    const minutos = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTiempoRestante(`${horas}h ${minutos}m`);
  };

  const generarNuevoCodigo = async () => {
    setLoading(true);
    try {
      const nroSocio = getNroSocio();
      if (!nroSocio) throw new Error("No se encontró el número de socio");

      const response = await generarCodigoAcceso(nroSocio);
      const { token, expiraEn } = response.data;

      setCodigoData({
        token,
        expiraEn,
        generado: new Date().toLocaleString()
      });

      new QRious({
        element: qrRef.current,
        value: token,
        size: 180,
        level: "H",
      });

      Swal.fire({
        icon: "success",
        title: "Código generado ✅",
        text: "Tu código QR de acceso ha sido generado exitosamente.",
        confirmButtonColor: "#1e3a8a",
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      console.error("Error al generar código:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "No se pudo generar el código de acceso",
        confirmButtonColor: "#b91c1c",
      });
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = () => {
    if (!codigoData) return;
    navigator.clipboard.writeText(codigoData.token);
    Swal.fire({
      icon: "success",
      title: "Código copiado ✅",
      text: "El código fue copiado al portapapeles.",
      confirmButtonColor: "#1e3a8a",
      timer: 1500,
      timerProgressBar: true,
    });
  };

  const validarCodigo = async () => {
    const input = document.getElementById("codigoValidar").value.trim();
    if (!input) {
      Swal.fire({
        icon: "warning",
        title: "Campo vacío",
        text: "Por favor, ingresá un código para validar.",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    try {
      const response = await validarCodigoAcceso(input);
      const validacionData = response.data;

      if (validacionData.valido) {
        Swal.fire({
          icon: "success",
          title: "✅ Código válido",
          text: "El código es válido y está activo.",
          confirmButtonColor: "#1e3a8a",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ Código inválido",
          text: "El código no es válido o expiró.",
          confirmButtonColor: "#b91c1c",
        });
      }
      document.getElementById("codigoValidar").value = "";
    } catch (error) {
      console.error("Error al validar código:", error);
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: "No se pudo validar el código de acceso",
        confirmButtonColor: "#b91c1c",
      });
    }
  };

  return (
    <div className="acceso-page page-background">
      <Navbar />
      <div className="acceso-container">
        {/* Panel Izquierdo */}
        <div className="panel-izquierdo">
          <h3>📱 Tu Código QR de Acceso</h3>
          <p className="subtitulo">Presentá este código en la entrada del club</p>

          <canvas ref={qrRef}></canvas>

          <div className="estado">
            {codigoData && tiempoRestante !== "expirado" ? (
              <>
                <span className="valido">🟢 Código válido</span>
                <p>Válido por {tiempoRestante} más</p>
              </>
            ) : (
              <span className="expirado">🔴 Código expirado</span>
            )}
          </div>

          <div className="acciones">
            <button onClick={generarNuevoCodigo} className="btn-generar" disabled={loading}>
              {loading ? "⏳ Generando..." : "↻ Generar Nuevo Código"}
            </button>
            <button onClick={copiarCodigo} className="btn-copiar" disabled={!codigoData}>
              📋 Copiar Código
            </button>
          </div>

          <div className="info-codigo">
            <h4>🧾 Información del Código</h4>
            <p><strong>Socio:</strong> {getUserName()}</p>
            <p><strong>Número:</strong> #{getNroSocio()}</p>
            <p><strong>Estado:</strong> <span className="activo">Activo</span></p>
            {codigoData && (
              <>
                <p><strong>Generado:</strong> {codigoData.generado}</p>
                <p><strong>Expira:</strong> {new Date(codigoData.expiraEn).toLocaleString()}</p>
              </>
            )}
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="panel-derecho">
          <div className="instrucciones">
            <h3>📋 Instrucciones de Uso</h3>
            <ol>
              <li>Mostrá el código QR al personal de seguridad en la entrada.</li>
              <li>El personal escaneará tu código para validar el acceso.</li>
              <li>Una vez validado, podrás ingresar y disfrutar de las instalaciones.</li>
            </ol>
            <p className="nota">🔄 Los códigos QR son válidos por 24h y pueden regenerarse en cualquier momento.</p>
          </div>

          <div className="validacion">
            <h3>🧍‍♂️ Validar Código QR</h3>
            <p>Para personal autorizado: validar códigos de acceso</p>
            <input
              id="codigoValidar"
              type="text"
              placeholder="Pegá o escribí el código QR aquí"
            />
            <button onClick={validarCodigo} className="btn-validar">
              👁️ Validar Código
            </button>
          </div>
        </div>
      </div>

      {/* Sección inferior de seguridad */}
      <div className="seguridad">
        <h4>🔒 Seguridad y Privacidad</h4>
        <p>
          Tus códigos QR son únicos y seguros. Nunca los compartas con otras personas.
          Se generan con encriptación y tienen validez temporal para mayor seguridad.
        </p>
      </div>
    </div>
  );
}

export default Acceso;