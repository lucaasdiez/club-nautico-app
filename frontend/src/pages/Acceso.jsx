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
        generado: new Date().toLocaleString(),
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
    <div className="acceso-page page-background">
      <Navbar />
      <div className="acceso-container ">
        {/* PANEL IZQUIERDO */}
        <div className="panel-izquierdo">
          <h3>
            <QrCode size={24} />
            Tu Código QR de Acceso
          </h3>
          <p className="subtitulo">Presentá este código en la entrada del club</p>

          <canvas ref={qrRef}></canvas>

          <div className="estado">
            <p>
              <Clock size={16} /> {tiempoRestante ? `Expira en: ${tiempoRestante}` : ""}
            </p>
            <span className={tiempoRestante === "Código expirado" ? "expirado" : "valido"}>
              {tiempoRestante === "Código expirado" ? "Expirado" : "Válido"}
            </span>
          </div>

          <div className="acciones">
            <button
              className="btn-generar"
              onClick={generarNuevoCodigo}
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              {loading ? "Generando..." : "Generar Nuevo Código"}
            </button>
          </div>

          <div className="info-codigo">
            <h4>Información del socio</h4>
            <p>
              <strong>Socio:</strong> {getUserName()}
            </p>
            <p>
              <strong>Número:</strong> #{getNroSocio()}
            </p>
            {codigoData && (
              <>
                <p>
                  <strong>Generado:</strong> {codigoData.generado}
                </p>
                <p>
                  <strong>Expira:</strong>{" "}
                  {new Date(codigoData.expiraEn).toLocaleString()}
                </p>
              </>
            )}
          </div>

          <div className="seguridad">
            <Shield size={16} />
            <p>Este código es único y personal. No lo compartas con nadie.</p>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="panel-derecho">
          <div className="instrucciones">
            <h3>Instrucciones</h3>
            <ol>
              <li>Presenta tu código QR al ingresar al club.</li>
              <li>El código tiene una validez limitada, revisa el tiempo restante.</li>
              <li>No compartas tu código con otros socios.</li>
            </ol>
          </div>

          <div className="validacion">
            <h3>Validación manual</h3>
            <p>Si el lector de QR falla, podés ingresar el código manualmente:</p>
            <input type="text" placeholder="Ingresar código de acceso" />
            <button className="btn-validar">Validar Código</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default Acceso;
