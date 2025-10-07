import Navbar from "../components/Navbar";
import "./Acceso.scss";
import { useEffect, useRef, useState } from "react";
import QRious from "qrious";

function Acceso() {
  const qrRef = useRef(null);
  const [codigo, setCodigo] = useState("");
  const [generado, setGenerado] = useState("");

  useEffect(() => {
    generarNuevoCodigo();
  }, []);

  const generarNuevoCodigo = () => {
    const nuevoCodigo = `SOCIO: Juan Manuel Semper - ID: #30802 - ${new Date().toLocaleString()}`;
    setCodigo(nuevoCodigo);
    setGenerado(new Date().toLocaleString());
    new QRious({
      element: qrRef.current,
      value: nuevoCodigo,
      size: 180,
      level: "H",
    });
  };

  const copiarCodigo = () => {
    navigator.clipboard.writeText(codigo);
    alert("Código copiado al portapapeles ✅");
  };

  return (
    <div className="acceso-page">
      <Navbar />

      <div className="container-principal">
        <div className="acceso-grid">
          {/* Columna izquierda: QR */}
          <div className="qr-card">
            <h3>Tu Código QR de Acceso</h3>
            <p className="subtitulo">Presenta este código en la entrada del club</p>

            <canvas ref={qrRef}></canvas>

            <div className="estado">
              <span className="valido">🟢 Código Válido</span>
              <p>Válido por 23h 59m más</p>
            </div>

            <div className="acciones">
              <button onClick={generarNuevoCodigo} className="btn-generar">
                ↻ Generar Nuevo Código
              </button>
              <button onClick={copiarCodigo} className="btn-copiar">
                📋 Copiar Código
              </button>
            </div>

            <div className="info-codigo">
              <h4>Información del Código</h4>
              <p><strong>Socio:</strong> Juan Manuel Semper</p>
              <p><strong>Número:</strong> #30802</p>
              <p><strong>Estado:</strong> Activo</p>
              <p><strong>Generado:</strong> {generado}</p>
            </div>

            <div className="seguridad">
              <h4>🔒 Seguridad y Privacidad</h4>
              <p>
                Tus códigos QR son únicos y seguros. Nunca los compartas con otras personas.
                Se generan con encriptación y tienen validez temporal para mayor seguridad.
              </p>
            </div>
          </div>

          {/* Columna derecha: instrucciones */}
          <div className="instrucciones-card">
            <h3>📋 Instrucciones de Uso</h3>
            <ol>
              <li><strong>Presenta tu código:</strong> muestra el QR al personal de seguridad en la entrada.</li>
              <li><strong>Validación automática:</strong> el personal escaneará tu código para validar el acceso.</li>
              <li><strong>Acceso autorizado:</strong> una vez validado, podrás ingresar y disfrutar de las instalaciones.</li>
            </ol>

            <div className="nota">
              <p>Los códigos QR son válidos por 24 horas y se pueden regenerar en cualquier momento.</p>
            </div>

            <div className="validacion">
              <h4>🔐 Validar Código QR</h4>
              <p>Para personal autorizado: valida códigos de acceso</p>
              <input placeholder="Pega o escribe el código QR aquí" />
              <button>Validar Código</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Acceso;
