import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// 🗂️ Archivo de datos
const DATA_FILE = "./data.json";

// 🔄 Cargar datos del archivo
const loadData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.log("📁 No se encontró data.json, creando uno nuevo...");
    return { disciplinas: [], inscripciones: {} };
  }
};

// 💾 Guardar datos en el archivo
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Inicialización con datos por defecto
let { disciplinas, inscripciones } = loadData();
if (disciplinas.length === 0) {
  disciplinas = [
    {
      id: 1,
      nombre: "Tenis",
      descripcion: "Entrenamientos personalizados para todos los niveles.",
      horario: "Lunes a Viernes 9:00 a 18:00",
      precio: "$15.000 / mes",
      cupos: 20,
      inscritos: 12,
    },
    {
      id: 2,
      nombre: "Natación",
      descripcion: "Clases de nado libre, estilo y resistencia.",
      horario: "Lunes a Sábado 7:00 a 21:00",
      precio: "$12.000 / mes",
      cupos: 30,
      inscritos: 25,
    },
    {
      id: 3,
      nombre: "Gimnasio",
      descripcion: "Acceso completo al gimnasio con clases grupales.",
      horario: "Lunes a Domingo 8:00 a 22:00",
      precio: "$8.000 / mes",
      cupos: 50,
      inscritos: 32,
    },
    {
      id: 4,
      nombre: "Fútbol",
      descripcion: "Entrenamientos y partidos amistosos semanales.",
      horario: "Martes y Jueves 19:00 a 21:00",
      precio: "$10.000 / mes",
      cupos: 25,
      inscritos: 10,
    },
  ];
  saveData({ disciplinas, inscripciones });
}

// === GET /api/disciplinas ===
app.get("/api/disciplinas", (req, res) => {
  const data = loadData();
  res.json(data.disciplinas);
});

// === GET /api/inscripciones?email= ===
app.get("/api/inscripciones", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "Email requerido" });

  const data = loadData();
  const userInscripciones = data.inscripciones[email] || [];
  res.json(userInscripciones);
});

// === POST /api/inscripciones ===
app.post("/api/inscripciones", (req, res) => {
  const { email, disciplinaId } = req.body;
  if (!email || !disciplinaId)
    return res.status(400).json({ error: "Faltan datos" });

  const data = loadData();
  const disciplina = data.disciplinas.find((d) => d.id === disciplinaId);
  if (!disciplina)
    return res.status(404).json({ error: "Disciplina no encontrada" });

  // Evitar duplicados
  data.inscripciones[email] = data.inscripciones[email] || [];
  const yaInscripto = data.inscripciones[email].some(
    (i) => i.idDisciplina === disciplinaId
  );
  if (yaInscripto)
    return res.status(409).json({ error: "Ya estás inscripto en esta disciplina" });

  // Controlar cupos
  if (disciplina.inscritos >= disciplina.cupos)
    return res.status(400).json({ error: "No hay cupos disponibles" });

  const nuevaInscripcion = {
    idDisciplina: disciplinaId,
    nombre: disciplina.nombre,
    precio: disciplina.precio,
    fecha: new Date().toLocaleDateString(),
  };

  data.inscripciones[email].push(nuevaInscripcion);
  disciplina.inscritos++;

  saveData(data);

  res.status(201).json({
    mensaje: "Inscripción exitosa",
    inscripcion: nuevaInscripcion,
  });
});

// === DELETE /api/inscripciones/:id?email= ===
app.delete("/api/inscripciones/:id", (req, res) => {
  const { id } = req.params;
  const { email } = req.query;
  if (!email || !id)
    return res.status(400).json({ error: "Datos incompletos" });

  const data = loadData();
  const userInscripciones = data.inscripciones[email] || [];
  const index = userInscripciones.findIndex(
    (i) => i.idDisciplina === parseInt(id)
  );

  if (index === -1)
    return res.status(404).json({ error: "Inscripción no encontrada" });

  const disciplinaEliminada = userInscripciones[index];
  userInscripciones.splice(index, 1);

  const disciplina = data.disciplinas.find(
    (d) => d.id === parseInt(id)
  );
  if (disciplina && disciplina.inscritos > 0) disciplina.inscritos--;

  data.inscripciones[email] = userInscripciones;
  saveData(data);

  res.json({ mensaje: `Desinscripto de ${disciplinaEliminada.nombre}` });
});

// === Servidor ===
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
