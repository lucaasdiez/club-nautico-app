import Navbar from "../components/Navbar";
import "./Acceso.scss";
import QRious from "qrious";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { QrCode, RefreshCw, Shield, Clock } from "lucide-react";
import { generarCodigoAcceso } from "../services/codigoAccesoService";
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

    const interval = setInterval(() => {
      calcularTiempoRestante();
    }, 60000);

    calcularTiempoRestante();

    return () => clearInterval(interval);
  }, [codigoData]);

  const calcularTiempoRestante = () => {
    if (!codigoData || !codigoData.expiraEn) return;

    const expiracion = new Date(codigoData.expiraEn);
    const ahora = new Date();
    const diff = expiracion - ahora;

    if (diff <= 0) {
      setTiempoRestante("Código expirado");
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

      if (!nroSocio) {
        throw new Error("No se encontró el número de socio");
      }

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
        size: 220,
        level: "H",
      });

      Swal.fire({
        icon: "success",
        title: "Código generado",
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

  return (
    <div className="acceso-page">
      <Navbar />
      <div className="acceso-container">
        <div className="qr-card">
          <div className="card-header">
            <QrCode size={32} />
            <div>
              <h2>Tu Código QR de Acceso</h2>
              <p className="subtitulo">Presentá este código en la entrada del club</p>
            </div>
          </div>

          <div className="qr-wrapper">
            <canvas ref={qrRef}></canvas>
          </div>

          {tiempoRestante && (
            <div className="tiempo-expiracion">
              <Clock size={18} />
              <span>Expira en: {tiempoRestante}</span>
            </div>
          )}

          <button
            onClick={generarNuevoCodigo}
            className="btn-generar"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? "spinning" : ""} />
            {loading ? "Generando..." : "Generar Nuevo Código"}
          </button>

          <div className="info-socio">
            <div className="info-item">
              <span className="label">Socio:</span>
              <span className="value">{getUserName()}</span>
            </div>
            <div className="info-item">
              <span className="label">Número:</span>
              <span className="value">#{getNroSocio()}</span>
            </div>
            {codigoData && (
              <>
                <div className="info-item">
                  <span className="label">Generado:</span>
                  <span className="value">{codigoData.generado}</span>
                </div>
                <div className="info-item">
                  <span className="label">Expira:</span>
                  <span className="value">{new Date(codigoData.expiraEn).toLocaleString()}</span>
                </div>
              </>
            )}
          </div>

          <div className="seguridad-info">
            <Shield size={18} />
            <p>Este código es único y personal. No lo compartas con nadie.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Acceso;
