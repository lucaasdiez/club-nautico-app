import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Certificados.scss";
import Swal from "sweetalert2";

function Certificados() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [discipline, setDiscipline] = useState("tenis");
  const [expiryDate, setExpiryDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [medicalFiles, setMedicalFiles] = useState([]);
  const [certificates] = useState([
    {
      id: 1,
      type: "Certificado de Socio",
      memberNumber: "CNE-1234",
      issueDate: "2024-01-15",
      driveLink: "https://drive.google.com/file/d/1DwlsOfhfp2Yu6IWFY1pRJIqo9j2UTMZz/view?usp=drive_link",
    },
    {
      id: 2,
      type: "Certificado de Disciplinas",
      memberNumber: "CNE-1234",
      issueDate: "2024-01-15",
      driveLink: "https://drive.google.com/file/d/1cQsS1nYAtxp8c_LvKIXowxD9wTMsCMZ0/view?usp=drive_link",
    },
  ]);

  const disciplines = [
    "Tenis",
    "Fútbol",
    "Paddle",
    "Baile",
    "Natación",
    "Vela",
    "Remo",
    "Gimnasio",
  ];

  useEffect(() => {
    loadMedicalFiles();
  }, []);

  const loadMedicalFiles = () => {
    const storedFiles = localStorage.getItem("medicalFiles");
    if (storedFiles) {
      setMedicalFiles(JSON.parse(storedFiles));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (
        fileType === "application/pdf" ||
        fileType === "image/jpeg" ||
        fileType === "image/png" ||
        fileType === "image/jpg"
      ) {
        setSelectedFile(file);
      } else {
        Swal.fire({
          icon: "error",
          title: "Formato no válido",
          text: "Solo se permiten archivos PDF, JPG o PNG",
          confirmButtonColor: "#b91c1c",
        });
        // Limpiar el input
        e.target.value = "";
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !expiryDate) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Por favor selecciona un archivo y una fecha de vencimiento",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileData = {
        id: Date.now(),
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileData: e.target.result,
        discipline: discipline,
        expiryDate: expiryDate,
        uploadDate: new Date().toISOString(),
        status: "active",
      };

      const updatedFiles = [...medicalFiles, fileData];
      setMedicalFiles(updatedFiles);
      localStorage.setItem("medicalFiles", JSON.stringify(updatedFiles));

      Swal.fire({
        icon: "success",
        title: "¡Archivo subido!",
        text: "El parte médico se guardó correctamente",
        confirmButtonColor: "#1e3a8a",
        timer: 2500,
        showConfirmButton: false,
      });
      
      setSelectedFile(null);
      setExpiryDate("");

      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";

      setUploading(false);
    };

    reader.onerror = () => {
      Swal.fire({
        icon: "error",
        title: "Error al leer el archivo",
        text: "Por favor intenta con otro archivo",
        confirmButtonColor: "#b91c1c",
      });
      setUploading(false);
    };

    reader.readAsDataURL(selectedFile);
  };

  // Nueva función con confirmación
  const confirmDeleteFile = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Una vez eliminado, no podrás recuperar este archivo",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#1e3a8a",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedFiles = medicalFiles.filter((file) => file.id !== id);
        setMedicalFiles(updatedFiles);
        localStorage.setItem("medicalFiles", JSON.stringify(updatedFiles));

        Swal.fire({
          icon: "success",
          title: "Archivo eliminado",
          text: "El archivo fue borrado correctamente",
          confirmButtonColor: "#1e3a8a",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    });
  };


  const downloadFile = (file) => {
    const link = document.createElement("a");
    link.href = file.fileData;
    link.download = file.fileName;
    link.click();
  };

  const openDriveLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="certificados-page page-background">
      <Navbar />

      <div className="certificados-container">
        <div className="certificados-left">
          <h3>
            <i className="fa-solid fa-file-arrow-up"></i> Subir Parte Médico
          </h3>
          <p className="subtitulo">
            Sube tu parte médico para poder realizar actividades deportivas
          </p>

          <div className="form-group">
            <label>Disciplina</label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="input-field"
            >
              {disciplines.map((d) => (
                <option key={d} value={d.toLowerCase()}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Fecha de Vencimiento</label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Archivo (PDF, JPG, PNG)</label>
            <div className="file-upload">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                id="file-input"
              />
              <label htmlFor="file-input" className="file-label">
                <i className="fa-solid fa-cloud-arrow-up"></i>
                {selectedFile ? selectedFile.name : "Seleccionar archivo"}
              </label>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Subiendo...
              </>
            ) : (
              <>
                <i className="fa-solid fa-upload"></i> Subir Archivo
              </>
            )}
          </button>

          <div className="archivos-list">
            <h4>Partes Médicos Subidos</h4>
            {medicalFiles.length === 0 ? (
              <p className="empty-state">No hay archivos subidos</p>
            ) : (
              medicalFiles.map((file) => (
                <div key={file.id} className="archivo-item">
                  <div className="archivo-info">
                    <i
                      className={`fa-solid ${
                        file.fileType === "application/pdf"
                          ? "fa-file-pdf"
                          : "fa-image"
                      }`}
                    ></i>
                    <div>
                      <p className="nombre">{file.discipline}</p>
                      <p className="meta">
                        {file.fileName} | Vence:{" "}
                        {new Date(file.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="archivo-actions">
                    <button
                      onClick={() => downloadFile(file)}
                      className="btn-download"
                      title="Descargar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => confirmDeleteFile(file.id)}
                      className="btn-delete"
                      title="Eliminar"
                    >

                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="certificados-right">
          <h3>
            <i className="fa-solid fa-certificate"></i> Certificados de Socio
          </h3>
          <p className="subtitulo">
            Descarga tus certificados de membresía desde Google Drive
          </p>

          <div className="certificado-preview">
            <div className="preview-card">
              <h4>Club Náutico Ensenada</h4>
              <p className="cert-type">Certificado de Socio</p>
              <div className="cert-info">
                <p>
                  <strong>Número de Socio:</strong> CNE-1234
                </p>
                <p>
                  <strong>Válido hasta:</strong>{" "}
                  {new Date(
                    Date.now() + 365 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()}
                </p>
                <p>
                  <strong>Disciplinas autorizadas:</strong>
                </p>
                <div className="disciplines-tags">
                  <span className="tag">Tenis</span>
                  <span className="tag">Paddle</span>
                  <span className="tag">Natación</span>
                </div>
              </div>
            </div>
          </div>

          <div className="certificados-list">
            <h4>Certificados Disponibles</h4>
            {certificates.length === 0 ? (
              <p className="empty-state">No hay certificados disponibles</p>
            ) : (
              certificates.map((cert) => (
                <div key={cert.id} className="certificado-item">
                  <div className="cert-item-info">
                    <i className="fa-solid fa-award"></i>
                    <div>
                      <p className="nombre">{cert.type}</p>
                      <p className="meta">
                        Socio: {cert.memberNumber} | Emitido:{" "}
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => openDriveLink(cert.driveLink)}
                    className="btn-drive"
                    title="Abrir en Google Drive"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Certificados;