import Navbar from "../components/Navbar";
import "./Acceso.scss";
import QRious from "qrious";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import '../styles/_container.scss';
import { QrCode, Copy, RefreshCw, Shield, CheckCircle, Clock, AlertCircle, XCircle, Camera } from "lucide-react";
import { generarCodigoAcceso, validarCodigoAcceso } from "../services/codigoAccesoService";
import { getNroSocio, getUserName } from "../services/authService";
import QRScanner from "../components/QRScanner/QRScanner";

function Acceso() {
  const qrRef = useRef(null);
  const [codigoData, setCodigoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState("");
  const [showScanner, setShowScanner] = useState(false);

  // Generar código al cargar el componente
  useEffect(() => {
    generarNuevoCodigo();
  }, []);

  // Actualizar tiempo restante cada minuto
  useEffect(() => {
    if (!codigoData) return;

    const interval = setInterval(() => {
      calcularTiempoRestante();
    }, 60000); // Actualizar cada minuto

    calcularTiempoRestante(); // Calcular inmediatamente

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

      // Generar QR con el token
      new QRious({
        element: qrRef.current,
        value: token,
        size: 180,
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

  const copiarCodigo = () => {
    if (!codigoData) return;
    
    navigator.clipboard.writeText(codigoData.token);
    Swal.fire({
      icon: "success",
      title: "Código copiado",
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
        // Código válido
        Swal.fire({
          icon: "success",
          title: "✅ Acceso Autorizado",
          html: `
            <div style="text-align: left; padding: 20px;">
              <p style="margin: 10px 0;"><strong>Socio:</strong> ${validacionData.socioNombre}</p>
              <p style="margin: 10px 0;"><strong>Número:</strong> ${validacionData.socioNumero}</p>
              <p style="margin: 10px 0;"><strong>Estado:</strong> ${validacionData.mensaje}</p>
              ${validacionData.expiraEn ? `<p style="margin: 10px 0;"><strong>Código expira:</strong> ${new Date(validacionData.expiraEn).toLocaleString()}</p>` : ''}
            </div>
          `,
          confirmButtonColor: "#16a34a",
          confirmButtonText: "Autorizar Ingreso",
        });
      } else {
        // Código inválido
        Swal.fire({
          icon: "error",
          title: "❌ Acceso Denegado",
          html: `
            <div style="text-align: left; padding: 20px;">
              <p style="margin: 10px 0;"><strong>Motivo:</strong> ${validacionData.mensaje}</p>
              ${validacionData.socioNombre ? `<p style="margin: 10px 0;"><strong>Socio:</strong> ${validacionData.socioNombre}</p>` : ''}
              ${validacionData.socioNumero ? `<p style="margin: 10px 0;"><strong>Número:</strong> ${validacionData.socioNumero}</p>` : ''}
            </div>
          `,
          confirmButtonColor: "#dc2626",
          confirmButtonText: "Entendido",
        });
      }

      // Limpiar el campo después de validar
      document.getElementById("codigoValidar").value = "";

    } catch (error) {
      console.error("Error al validar código:", error);
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: error.message || "No se pudo validar el código de acceso",
        confirmButtonColor: "#b91c1c",
      });
    }
  };

  // Función para simular un escaneo (útil para demostración)
  const simularEscaneo = async () => {
    if (!codigoData) {
      Swal.fire({
        icon: "warning",
        title: "No hay código",
        text: "Primero generá un código QR",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    // Simular delay de escaneo
    Swal.fire({
      title: "Escaneando código...",
      html: '<div class="scanner-animation"></div>',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      customClass: {
        popup: 'scanner-popup'
      }
    });

    setTimeout(async () => {
      // Auto-rellenar el campo de validación
      document.getElementById("codigoValidar").value = codigoData.token;
      // Validar automáticamente
      await validarCodigo();
    }, 1500);
  };

  // Función para abrir el escáner de cámara
  const abrirEscaner = () => {
    setShowScanner(true);
  };

  // Función para manejar el código escaneado
  const handleScanSuccess = async (codigoEscaneado) => {
    setShowScanner(false);
    
    // Auto-rellenar el campo de validación
    document.getElementById("codigoValidar").value = codigoEscaneado;
    
    // Validar automáticamente
    await validarCodigo();
  };

  return (
    <div className="page-background ">
      <Navbar />
      <div className="page-container animate-fade">
        {/* Panel Izquierdo */}
        <div className="panel-izquierdo">
          <div className="header-with-icon">
            <QrCode size={28} />
            <h3>Tu Código QR de Acceso</h3>
          </div>
          <p className="subtitulo">Presentá este código en la entrada del club</p>

          <canvas ref={qrRef}></canvas>

          <div className="estado">
            {codigoData && tiempoRestante !== "Código expirado" ? (
              <>
                <span className="valido">
                  <CheckCircle size={16} />
                  Código válido
                </span>
                <p className="tiempo">
                  <Clock size={14} />
                  Válido por {tiempoRestante} más
                </p>
              </>
            ) : (
              <span className="expirado">
                <XCircle size={16} />
                Código expirado
              </span>
            )}
          </div>

          <div className="acciones">
            <button 
              onClick={generarNuevoCodigo} 
              className="btn-generar"
              disabled={loading}
            >
              <RefreshCw size={18} className={loading ? "spinning" : ""} />
              {loading ? "Generando..." : "Generar Nuevo Código"}
            </button>
            <button 
              onClick={copiarCodigo} 
              className="btn-copiar"
              disabled={!codigoData}
            >
              <Copy size={18} />
              Copiar Código
            </button>
          </div>

          {/* Botón para simular escaneo */}
          <div className="simulacion">
            <button 
              onClick={simularEscaneo} 
              className="btn-simular"
              disabled={!codigoData}
            >
              <QrCode size={18} />
              🎬 Simular Escaneo (Demo)
            </button>
          </div>

          <div className="info-codigo">
            <h4>Información del Código</h4>
            <p>
              <strong>Socio:</strong> {getUserName()}
            </p>
            <p>
              <strong>Número:</strong> #{getNroSocio()}
            </p>
            <p>
              <strong>Estado:</strong> <span className="activo">Activo</span>
            </p>
            {codigoData && (
              <>
                <p>
                  <strong>Generado:</strong> {codigoData.generado}
                </p>
                <p>
                  <strong>Expira:</strong> {new Date(codigoData.expiraEn).toLocaleString()}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="panel-derecho">
          <div className="instrucciones">
            <h3>Instrucciones de Uso</h3>
            <ol>
              <li>Mostrá el código QR al personal de seguridad en la entrada.</li>
              <li>El personal escaneará tu código para validar el acceso.</li>
              <li>Una vez validado, podrás ingresar y disfrutar de las instalaciones.</li>
            </ol>
            <p className="nota">
              <RefreshCw size={14} />
              Los códigos QR son válidos por 24h y pueden regenerarse en cualquier momento.
            </p>
          </div>

          <div className="validacion">
            <div className="header-with-icon">
              <Shield size={24} />
              <h3>Validar Código QR</h3>
            </div>
            <p>Para personal autorizado: validar códigos de acceso</p>
            
            {/* Botón para escanear con cámara */}
            <button onClick={abrirEscaner} className="btn-escanear">
              <Camera size={18} />
              📷 Escanear con Cámara
            </button>

            <div className="separador">
              <span>o ingresá manualmente</span>
            </div>

            <input
              id="codigoValidar"
              type="text"
              placeholder="Pegá o escribí el código QR aquí"
            />
            <button onClick={validarCodigo} className="btn-validar">
              <CheckCircle size={18} />
              Validar Código
            </button>
          </div>
        </div>
      </div>

      {/* Sección inferior de seguridad */}
      <div className="seguridad">
        <div className="header-with-icon">
          <Shield size={20} />
          <h4>Seguridad y Privacidad</h4>
        </div>
        <p>
          Tus códigos QR son únicos y seguros. Nunca los compartas con otras personas.
          Se generan con encriptación y tienen validez temporal para mayor seguridad.
        </p>
      </div>

      {/* Modal del escáner de QR */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      <style jsx>{`
        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .btn-simular {
          width: 100%;
          margin-top: 10px;
          padding: 12px;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .btn-simular:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }

        .btn-simular:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .expirado {
          color: #dc2626;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
        }

        .scanner-animation {
          width: 200px;
          height: 200px;
          margin: 20px auto;
          border: 3px solid #1e3a8a;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
        }

        .scanner-animation::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #1e3a8a, transparent);
          animation: scan 1.5s ease-in-out infinite;
        }

        @keyframes scan {
          0% { transform: translateY(0); }
          100% { transform: translateY(200px); }
        }
      `}</style>
    </div>
  );
}

export default Acceso;