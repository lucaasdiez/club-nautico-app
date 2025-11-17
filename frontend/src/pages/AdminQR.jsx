import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import QRScanner from "../components/QRScanner/QRScanner";
import Swal from "sweetalert2";
import {
  CheckCircle,
  Shield,
  AlertCircle,
  XCircle,
  Clock,
  User,
  Hash,
  Calendar,
  QrCode,
  ArrowLeft,
} from "lucide-react";
import { validarCodigoAcceso } from "../services/codigoAccesoService";
import "./AdminQR.scss";
import AdminNavbar from "../components/AdminNavbar"; // 🔹 Importamos AdminNavbar

function AdminQR() {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [ultimasValidaciones, setUltimasValidaciones] = useState([]);
  const isValidating = useRef(false);

  const validarCodigo = async (codigoInput) => {
    if (isValidating.current) return;

    if (!codigoInput) return;

    try {
      isValidating.current = true;
      const response = await validarCodigoAcceso(codigoInput);
      const validacionData = response.data;

      const nuevaValidacion = {
        timestamp: new Date().toLocaleString(),
        valido: validacionData.valido,
        socioNombre: validacionData.socioNombre || "N/A",
        socioNumero: validacionData.socioNumero || "N/A",
        mensaje: validacionData.mensaje,
        expiraEn: validacionData.expiraEn,
      };

      setUltimasValidaciones(prev => [nuevaValidacion, ...prev].slice(0, 10));

      if (validacionData.valido) {
        Swal.fire({
          icon: "success",
          title: "✅ Acceso Autorizado",
          html: `<div style="text-align: left; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 4px solid #16a34a;">
                  <p><strong>👤 Socio:</strong> ${validacionData.socioNombre}</p>
                  <p><strong>#️⃣ Número:</strong> ${validacionData.socioNumero}</p>
                  <p><strong>📋 Estado:</strong> <span style="color: #16a34a;">${validacionData.mensaje}</span></p>
                  ${validacionData.expiraEn ? `<p><strong>⏰ Expira:</strong> ${new Date(validacionData.expiraEn).toLocaleString()}</p>` : ''}
                </div>`,
          confirmButtonColor: "#16a34a",
          confirmButtonText: "✓ Autorizar Ingreso",
          width: 600,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "❌ Acceso Denegado",
          html: `<div style="text-align: left; padding: 20px; background: #fef2f2; border-radius: 8px; border-left: 4px solid #dc2626;">
                  <p><strong>⚠️ Motivo:</strong> <span style="color: #dc2626;">${validacionData.mensaje}</span></p>
                  ${validacionData.socioNombre ? `<p><strong>👤 Socio:</strong> ${validacionData.socioNombre}</p>` : ''}
                  ${validacionData.socioNumero ? `<p><strong>#️⃣ Número:</strong> ${validacionData.socioNumero}</p>` : ''}
                </div>`,
          confirmButtonColor: "#dc2626",
          confirmButtonText: "Entendido",
          width: 600,
        });
      }

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error de validación",
        text: error.message || "No se pudo validar el código de acceso",
        confirmButtonColor: "#b91c1c",
      });
    } finally {
      setTimeout(() => {
        isValidating.current = false;
      }, 1000);
    }
  };

  const abrirEscaner = () => setShowScanner(true);

  const handleScanSuccess = async (codigoEscaneado) => {
    setShowScanner(false);
    setTimeout(async () => {
      if (!isValidating.current) await validarCodigo(codigoEscaneado);
    }, 300);
  };

  const handleBack = () => navigate("/admin");

  const getIconoEstado = (valido) =>
    valido ? <CheckCircle className="icono-valido" size={20} /> : <XCircle className="icono-invalido" size={20} />;

  return (
    <div className="admin-qr-page">
      {/* 🔹 Usamos AdminNavbar */}
      <AdminNavbar />

      <div className="admin-qr-container">
        <div className="content-grid">
          <div className="panel-validacion">
            <div className="validacion-card">
              <div className="card-header">
                <QrCode size={28} />
                <h2>Validar Código QR</h2>
              </div>

              <div className="instrucciones">
                <AlertCircle size={20} />
                <div>
                  <p>Para validar el acceso de un socio:</p>
                  <ul>
                    <li>Presioná el botón "Escanear Código QR"</li>
                    <li>Apuntá la cámara al código QR del socio</li>
                    <li>El sistema validará automáticamente el acceso</li>
                  </ul>
                </div>
              </div>

              <button onClick={abrirEscaner} className="btn-escanear">
                <QrCode size={24} />
                Escanear Código QR
              </button>
            </div>

            <div className="indicadores-estado">
              <div className="indicador valido">
                <CheckCircle size={20} />
                <div>
                  <h4>Acceso Autorizado</h4>
                  <p>Socio con cuota al día</p>
                </div>
              </div>
              <div className="indicador alerta">
                <AlertCircle size={20} />
                <div>
                  <h4>Cuota por Vencer</h4>
                  <p>Vence en menos de 5 días</p>
                </div>
              </div>
              <div className="indicador invalido">
                <XCircle size={20} />
                <div>
                  <h4>Acceso Denegado</h4>
                  <p>Cuota vencida o código inválido</p>
                </div>
              </div>
            </div>
          </div>

          <div className="panel-historial">
            <div className="historial-header">
              <Clock size={20} />
              <h2>Últimas Validaciones</h2>
            </div>

            {ultimasValidaciones.length === 0 ? (
              <div className="historial-vacio">
                <AlertCircle size={48} />
                <p>No hay validaciones recientes</p>
                <span>Los últimos 10 accesos validados aparecerán aquí</span>
              </div>
            ) : (
              <div className="historial-lista">
                {ultimasValidaciones.map((validacion, index) => (
                  <div
                    key={index}
                    className={`validacion-item ${validacion.valido ? 'valido' : 'invalido'}`}
                  >
                    <div className="validacion-icono">{getIconoEstado(validacion.valido)}</div>
                    <div className="validacion-info">
                      <div className="info-principal">
                        <span className="socio-nombre">
                          <User size={16} /> {validacion.socioNombre}
                        </span>
                        <span className="socio-numero">
                          <Hash size={16} /> {validacion.socioNumero}
                        </span>
                      </div>
                      <div className="info-secundaria">
                        <span className="mensaje">{validacion.mensaje}</span>
                        <span className="timestamp">
                          <Calendar size={14} /> {validacion.timestamp}
                        </span>
                      </div>
                    </div>
                    <div className={`estado-badge ${validacion.valido ? 'autorizado' : 'denegado'}`}>
                      {validacion.valido ? 'AUTORIZADO' : 'DENEGADO'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="seguridad-footer">
          <Shield size={20} />
          <div>
            <h4>Sistema de Seguridad</h4>
            <p>
              Los códigos QR son únicos por socio, tienen validez temporal y se
              verifican contra el estado de cuenta en tiempo real.
            </p>
          </div>
        </div>
      </div>

      <div className="admin-qr-footer">
        <button className="btn-back" onClick={handleBack}>
          <ArrowLeft size={18} /> Volver al Panel
        </button>
      </div>

      {showScanner && (
        <QRScanner onScanSuccess={handleScanSuccess} onClose={() => setShowScanner(false)} />
      )}
    </div>
  );
}

export default AdminQR;
