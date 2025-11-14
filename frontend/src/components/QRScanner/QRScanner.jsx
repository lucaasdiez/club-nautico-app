import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, X, CheckCircle } from "lucide-react";
import "./QRScanner.scss";

function QRScanner({ onScanSuccess, onClose }) {
  const scannerRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setScanning(true);
      setError("");

      // Crear instancia del escáner
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      // Configuración del escáner
      const config = {
        fps: 10, // Frames por segundo
        qrbox: { width: 250, height: 250 }, // Tamaño del área de escaneo
        aspectRatio: 1.0,
      };

      // Iniciar el escáner con la cámara trasera (si está disponible)
      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, // Usar cámara trasera en móviles
        config,
        (decodedText, decodedResult) => {
          // Cuando se escanea exitosamente
          console.log("QR escaneado:", decodedText);
          
          // Detener el escáner
          stopScanner();
          
          // Llamar al callback con el código escaneado
          onScanSuccess(decodedText);
        },
        (errorMessage) => {
          // Errores de escaneo (normal cuando no hay QR en vista)
          // No los mostramos porque son continuos
        }
      );
    } catch (err) {
      console.error("Error al iniciar escáner:", err);
      setError(
        "No se pudo acceder a la cámara. Asegurate de dar permisos en tu navegador."
      );
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error al detener escáner:", err);
      }
    }
    setScanning(false);
  };

  const handleClose = async () => {
    await stopScanner();
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

          <div id="qr-reader" ref={scannerRef} className="qr-reader"></div>

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