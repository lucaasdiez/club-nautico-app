import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, CheckCircle } from "lucide-react";
import "./QRScanner.scss";

function QRScanner({ onScanSuccess, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const html5QrCodeRef = useRef(null);
  const isInitialized = useRef(false);
  const hasScanned = useRef(false); // ✅ NUEVO: Evitar escaneos múltiples

  useEffect(() => {
    // Evitar doble inicialización en React StrictMode
    if (isInitialized.current) return;
    isInitialized.current = true;

    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setScanning(true);
      setError("");

      // Crear instancia del escáner solo si no existe
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode("qr-reader");
      }

      // Configuración del escáner
      const config = {
        fps: 5,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      };

      // Iniciar el escáner
      await html5QrCodeRef.current.start(
        { facingMode: "environment" },
        config,
        (decodedText, decodedResult) => {
          // ✅ Si ya procesamos, NO hacer nada (ni log)
          if (hasScanned.current) {
            return;
          }

          console.log("✅ QR escaneado UNA VEZ:", decodedText);
          
          // ✅ Marcar INMEDIATAMENTE
          hasScanned.current = true;
          
          // ✅ LLAMAR AL CALLBACK PRIMERO (antes de detener)
          console.log("📞 Llamando a onScanSuccess con:", decodedText);
          onScanSuccess(decodedText);
          
          // ✅ LUEGO detener el escáner
          if (html5QrCodeRef.current) {
            console.log("🛑 Deteniendo escáner...");
            // Pausar inmediatamente
            html5QrCodeRef.current.pause(true);
            
            // Stop completo de forma asíncrona
            html5QrCodeRef.current.stop()
              .then(() => {
                console.log("🛑 Escáner detenido completamente");
                html5QrCodeRef.current.clear();
                html5QrCodeRef.current = null;
                setScanning(false);
              })
              .catch(err => {
                console.error("Error deteniendo:", err);
              });
          }
        },
        (errorMessage) => {
          // Errores normales de escaneo - no mostrar
        }
      );
    } catch (err) {
      console.error("❌ Error al iniciar escáner:", err);
      setError(
        "No se pudo acceder a la cámara. Asegurate de dar permisos en tu navegador."
      );
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        const state = html5QrCodeRef.current.getState();
        if (state === 2) { // 2 = SCANNING
          await html5QrCodeRef.current.stop();
        }
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      } catch (err) {
        console.error("Error al detener escáner:", err);
      }
    }
    setScanning(false);
  };

  const handleClose = async () => {
    await stopScanner();
    isInitialized.current = false;
    hasScanned.current = false; // ✅ Resetear el flag
    onClose();
  };

  return (
    <div className="qr-scanner-overlay">
      <div className="qr-scanner-modal">
        <div className="scanner-header">
          <div className="header-title">
            <Camera size={24} />
            <h3>Escanear Código QR</h3>
          </div>
          <button onClick={handleClose} className="btn-close">
            <X size={24} />
          </button>
        </div>

        <div className="scanner-body">
          {error && (
            <div className="scanner-error">
              <p>{error}</p>
            </div>
          )}

          <div id="qr-reader" className="qr-reader"></div>

          {scanning && !error && (
            <div className="scanner-instructions">
              <CheckCircle size={20} />
              <p>Apuntá la cámara al código QR</p>
              <p className="tip">
                Asegurate de que el código esté bien iluminado y centrado
              </p>
            </div>
          )}
        </div>

        <div className="scanner-footer">
          <button onClick={handleClose} className="btn-cancel">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default QRScanner;