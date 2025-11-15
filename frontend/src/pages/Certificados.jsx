import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Certificados.scss";
import Swal from "sweetalert2";
import '../styles/_container.scss';

import { getDisciplinas } from "../services/disciplinaService";
import { getParteMedicos, subirParteMedico } from "../services/parteMedicoService";
import api from "../services/api.js";

function Certificados() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [discipline, setDiscipline] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [uploading, setUploading] = useState(false);

  const [medicalFiles, setMedicalFiles] = useState([]);
  const [disciplines, setDisciplines] = useState([]);

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

  const NRO_SOCIO_ACTUAL = localStorage.getItem("userNroSocio");

  useEffect(() => {
    if (NRO_SOCIO_ACTUAL) {
      loadMedicalFiles();
    }
    fetchDisciplinas();
  }, [NRO_SOCIO_ACTUAL]); 

  const fetchDisciplinas = async () => {
    try {
      const response = await getDisciplinas();

      if (response && response.data) {
        setDisciplines(response.data);
        if (response.data.length > 0) {
          setDiscipline(response.data[0].nombre); 
        }
      }
    } catch (error) {
      console.error("Error al cargar disciplinas:", error);
      Swal.fire({
        icon: "error",
        title: "Error de red",
        text: "No se pudieron cargar las disciplinas desde el servidor.",
        confirmButtonColor: "#b91c1c",
      });
    }
  };

  const loadMedicalFiles = async () => {
    if (!NRO_SOCIO_ACTUAL) return;

    try {
      const response = await getParteMedicos(NRO_SOCIO_ACTUAL);
      if (response && response.data) {
        setMedicalFiles(response.data);
      }
    } catch (error) {
      console.error("Error al cargar partes médicos:", error);
      setMedicalFiles([]);
    }
  };

  // SIN CAMBIOS
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
        e.target.value = "";
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !expiryDate || !discipline) {
      Swal.fire({
        icon: "warning",
        title: "Datos incompletos",
        text: "Por favor selecciona una disciplina, un archivo y una fecha de vencimiento",
        confirmButtonColor: "#1e3a8a",
      });
      return;
    }

    setUploading(true);

    const parteMedicoData = {
      nroSocio: NRO_SOCIO_ACTUAL,
      nombreDisciplina: discipline,
      fechaVencimiento: expiryDate,
    };

    const formData = new FormData();
    formData.append("archivo", selectedFile);
    formData.append(
      "parteMedico",
      new Blob([JSON.stringify(parteMedicoData)], {
        type: "application/json",
      })
    );

    try {
      await subirParteMedico(formData);

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
      if (disciplines.length > 0) setDiscipline(disciplines[0].nombre);

      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";

      loadMedicalFiles();
    } catch (error) {
      console.error("Error al subir el archivo:", error);
      Swal.fire({
        icon: "error",
        title: "Error al subir",
        text: "No se pudo guardar el parte médico. Intenta de nuevo.",
        confirmButtonColor: "#b91c1c",
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = (archivoId) => {
    const baseUrl = "http://localhost:8080";
    const downloadUrl = `${baseUrl}/archivos/archivo/descargar/${archivoId}`;
    window.open(downloadUrl, "_blank");
  };

  const confirmDeleteFile = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción es permanente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b91c1c",
      cancelButtonColor: "#1e3a8a",
      confirmButtonText: "Sí, borrar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: "info",
          title: "Función no implementada",
          text: "El endpoint de borrado aún no está implementado en el backend.",
          confirmButtonColor: "#1e3a8a",
        });
      }
    });
  };

  const openDriveLink = (url) => {
    window.open(url, "_blank");
  };

  return (
<<<<<<< HEAD
    <div className="page-background">
      <Navbar />

      <div className="certificados-container page-container animate-fade">
=======
    <div className="certificados-page">
      <Navbar />

      <div className="certificados-container">
>>>>>>> master
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
              {disciplines.length === 0 && <option>Cargando...</option>}
              {disciplines.map((d) => (
                <option key={d.id} value={d.nombre}>
                  {d.nombre}
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
              // 'file' es cada objeto del array 'data', ej:
              // { nroSocio: "...", nombreDisciplina: "...", archivo: { id: 2, nombre: "..." } }
              medicalFiles.map((file) => (
                
                // ❗️ CORRECCIÓN 1: Usar una key única (el id del archivo)
                // 'file.id' no existe, pero 'file.archivo.id' sí.
                <div key={file.archivo.id} className="archivo-item">
                  <div className="archivo-info">
                    <i
                      className={`fa-solid ${
                        // ❗️ CORRECCIÓN 2: Adivinar el tipo por el nombre
                        // 'file.tipoArchivo' no existe, pero podemos usar el nombre.
                        file.archivo.nombre.endsWith(".pdf")
                          ? "fa-file-pdf"
                          : "fa-image"
                      }`}
                    ></i>
                    <div>
                      {/* Esto está bien, es el nombre de la disciplina */}
                      <p className="nombre">{file.nombreDisciplina}</p>
                      <p className="meta">
                        {/* ❗️ CORRECCIÓN 3: La principal (Nombre del Archivo) ❗️ */}
                        {file.archivo.nombre} | Vence:{" "}
                        {new Date(file.fechaVencimiento).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="archivo-actions">
                    <button
                      // ❗️ CORRECCIÓN 4: El ID del archivo para descargar
                      onClick={() => downloadFile(file.archivo.id)}
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
                      // ❗️ CORRECCIÓN 5: El ID para borrar (¡Leer nota abajo!)
                      onClick={() => confirmDeleteFile(file.archivo.id)}
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

        {/* --- LADO DERECHO (Sin cambios) --- */}
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
                  <strong>Número de Socio:</strong> {NRO_SOCIO_ACTUAL || "CNE-1234"}
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