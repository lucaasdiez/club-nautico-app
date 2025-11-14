import Navbar from "../components/Navbar";
import "./Acceso.scss";
import QRious from "qrious";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { QrCode, Copy, RefreshCw, Shield, CheckCircle, Clock } from "lucide-react";

function Acceso() {
  const qrRef = useRef(null);
  const [codigo, setCodigo] = useState("");
  const [generado, setGenerado] = useState("");

  // Generar QR al cargar
  useEffect(() => {
    generarNuevoCodigo();
  }, []);

  const generarNuevoCodigo = () => {
    const userName = localStorage.getItem("userName") || "Socio";
    const userId = "#30802";
    const nuevoCodigo = `SOCIO: ${userName} - ID: ${userId} - ${new Date().toLocaleString()}`;
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
    Swal.fire({
      icon: "success",
      title: "Código copiado",
      text: "El código fue copiado al portapapeles.",
      confirmButtonColor: "#1e3a8a",
    });
  };

  const validarCodigo = () => {
    const input = document.getElementById("codigoValidar").value.trim();
    if (input === codigo) {
      Swal.fire({
        icon: "success",
        title: "Código válido",
        text: "El código coincide con el generado.",
        confirmButtonColor: "#1e3a8a",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Código inválido",
        text: "El código no coincide o expiró.",
        confirmButtonColor: "#b91c1c",
      });
    }
  };

  return (
    <div className="acceso-page">
      <Navbar />
      <div className="acceso-container">
        {/* Panel Izquierdo */}
        <div className="panel-izquierdo">
          <div className="header-with-icon">
            <QrCode size={28} />
            <h3>Tu Código QR de Acceso</h3>
          </div>
          <p className="subtitulo">Presentá este código en la entrada del club</p>

          <canvas ref={qrRef}></canvas>

          <div className="estado">
            <span className="valido">
              <CheckCircle size={16} />
              Código válido
            </span>
            <p className="tiempo">
              <Clock size={14} />
              Válido por 23h 59m más
            </p>
          </div>

          <div className="acciones">
            <button onClick={generarNuevoCodigo} className="btn-generar">
              <RefreshCw size={18} />
              Generar Nuevo Código
            </button>
            <button onClick={copiarCodigo} className="btn-copiar">
              <Copy size={18} />
              Copiar Código
            </button>
          </div>

          <div className="info-codigo">
            <h4>Información del Código</h4>
            <p>
              <strong>Socio:</strong> {localStorage.getItem("userName") || "Juan Manuel Semper"}
            </p>
            <p>
              <strong>Número:</strong> #30802
            </p>
            <p>
              <strong>Estado:</strong> <span className="activo">Activo</span>
            </p>
            <p>
              <strong>Generado:</strong> {generado}
            </p>
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
            <input
              id="codigoValidar"
              type="text"
              placeholder="Pega o escribí el código QR aquí"
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
    </div>
  );
}

export default Acceso;
