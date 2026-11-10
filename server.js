const express = require("express");
const fs = require("fs");
const path = require("path");
const soap = require("soap");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yaml");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Datos demostrativos en memoria. Se reinician cuando se detiene el servidor.
let recursos = [
  { id: 1, nombre: "Guía de técnicas de estudio", categoria: "Aprendizaje",
    descripcion: "Material para fortalecer los hábitos de estudio.", activo: true },
  { id: 2, nombre: "Organización del tiempo", categoria: "Organización",
    descripcion: "Estrategias para planificar las actividades académicas.", activo: true },
  { id: 3, nombre: "Lectura crítica", categoria: "Comprensión lectora",
    descripcion: "Ejercicios para analizar textos académicos.", activo: true }
];

const categorias = [
  { id: "CAT01", nombre: "Aprendizaje" },
  { id: "CAT02", nombre: "Organización" },
  { id: "CAT03", nombre: "Comprensión lectora" }
];

const necesidades = [
  { id: "N001", nombre: "Dificultad para organizar el tiempo" },
  { id: "N002", nombre: "Dificultad de comprensión lectora" },
  { id: "N003", nombre: "Necesidad de fortalecer hábitos de estudio" }
];

let necesidadesEstudiantes = [
  { estudianteId: "EST001", necesidadId: "N001", fechaRegistro: "2026-11-07" }
];

const recomendaciones = {
  N001: [
    { recursoId: 2, nombre: "Organización del tiempo",
      motivo: "Apoya la planificación de actividades y horarios." },
    { recursoId: 1, nombre: "Guía de técnicas de estudio",
      motivo: "Complementa la organización con hábitos de estudio." }
  ],
  N002: [
    { recursoId: 3, nombre: "Lectura crítica",
      motivo: "Propone ejercicios de análisis y comprensión de textos." }
  ],
  N003: [
    { recursoId: 1, nombre: "Guía de técnicas de estudio",
      motivo: "Ofrece estrategias para fortalecer los hábitos de estudio." }
  ]
};

const relaciones = {
  N001: [
    { origen: "Necesidad académica", relacion: "se atiende mediante", destino: "Organización del tiempo" },
    { origen: "Organización del tiempo", relacion: "se complementa con", destino: "Técnicas de estudio" }
  ],
  N002: [
    { origen: "Comprensión lectora", relacion: "se fortalece mediante", destino: "Lectura crítica" }
  ],
  N003: [
    { origen: "Hábitos de estudio", relacion: "se apoyan con", destino: "Guía de técnicas de estudio" }
  ]
};

const serviciosAcademicos = [
  { id: "SA01", nombre: "Asesoría académica", descripcion: "Orientación individual para necesidades de aprendizaje." },
  { id: "SA02", nombre: "Acompañamiento estudiantil", descripcion: "Seguimiento a procesos de adaptación y permanencia." }
];

function buscarRecurso(id) {
  return recursos.find(r => r.id === Number(id) && r.activo);
}

// Página de bienvenida y estado del servidor
app.get("/", (req, res) => {
  res.json({
    sistema: "EduSmart",
    mensaje: "Servidor de demostración REST y SOAP activo",
    documentacion: "/api-docs",
    serviciosRest: "/api/v1",
    servicioSoap: "/soap"
  });
});

// 1. Consultar recursos
app.get("/api/v1/recursos", (req, res) => {
  const { categoria, buscar } = req.query;
  let resultado = recursos.filter(r => r.activo);
  if (categoria) resultado = resultado.filter(r => r.categoria.toLowerCase() === String(categoria).toLowerCase());
  if (buscar) resultado = resultado.filter(r => r.nombre.toLowerCase().includes(String(buscar).toLowerCase()));
  res.status(200).json({ total: resultado.length, datos: resultado });
});

// 2. Consultar un recurso
app.get("/api/v1/recursos/:id", (req, res) => {
  const recurso = buscarRecurso(req.params.id);
  if (!recurso) return res.status(404).json({ error: "Recurso no encontrado." });
  res.status(200).json(recurso);
});

// 3. Consultar categorías
app.get("/api/v1/categorias", (req, res) => {
  res.status(200).json({ total: categorias.length, datos: categorias });
});

// 4a. Consultar catálogo de necesidades
app.get("/api/v1/necesidades", (req, res) => {
  res.status(200).json({ total: necesidades.length, datos: necesidades });
});

// 4b. Registrar necesidad de un estudiante
app.post("/api/v1/estudiantes/:id/necesidades", (req, res) => {
  const estudianteId = String(req.params.id).trim();
  const { necesidadId } = req.body;
  if (!estudianteId || !necesidadId) {
    return res.status(400).json({ error: "Debe enviar estudianteId en la ruta y necesidadId en el cuerpo." });
  }
  if (!necesidades.some(n => n.id === necesidadId)) {
    return res.status(404).json({ error: "La necesidad académica indicada no existe." });
  }
  const registro = { estudianteId, necesidadId, fechaRegistro: new Date().toISOString() };
  necesidadesEstudiantes.push(registro);
  res.status(201).json({ mensaje: "Necesidad registrada.", datos: registro });
});

// Consultar necesidades registradas para un estudiante
app.get("/api/v1/estudiantes/:id/necesidades", (req, res) => {
  const datos = necesidadesEstudiantes.filter(n => n.estudianteId === req.params.id);
  res.status(200).json({ total: datos.length, datos });
});

// 5. Consultar recomendaciones
app.get("/api/v1/recomendaciones", (req, res) => {
  const { necesidadId } = req.query;
  if (!necesidadId) return res.status(400).json({ error: "El parámetro necesidadId es obligatorio." });
  if (!necesidades.some(n => n.id === necesidadId)) {
    return res.status(404).json({ error: "Necesidad académica no encontrada." });
  }
  res.status(200).json({ necesidadId, datos: recomendaciones[necesidadId] || [] });
});

// 6. Consultar relaciones semánticas
app.get("/api/v1/relaciones", (req, res) => {
  const { necesidadId } = req.query;
  if (!necesidadId) return res.status(400).json({ error: "El parámetro necesidadId es obligatorio." });
  if (!necesidades.some(n => n.id === necesidadId)) {
    return res.status(404).json({ error: "Necesidad académica no encontrada." });
  }
  res.status(200).json({ necesidadId, datos: relaciones[necesidadId] || [] });
});

// 7. Crear recurso
app.post("/api/v1/recursos", (req, res) => {
  const { nombre, categoria, descripcion } = req.body;
  if (!nombre || !categoria || !descripcion) {
    return res.status(400).json({ error: "nombre, categoria y descripcion son obligatorios." });
  }
  const nuevo = {
    id: recursos.reduce((max, r) => Math.max(max, r.id), 0) + 1,
    nombre: String(nombre).trim(),
    categoria: String(categoria).trim(),
    descripcion: String(descripcion).trim(),
    activo: true
  };
  recursos.push(nuevo);
  res.status(201).json({ mensaje: "Recurso creado.", datos: nuevo });
});

// 8. Actualizar parcialmente un recurso
app.patch("/api/v1/recursos/:id", (req, res) => {
  const recurso = buscarRecurso(req.params.id);
  if (!recurso) return res.status(404).json({ error: "Recurso no encontrado." });
  const camposPermitidos = ["nombre", "categoria", "descripcion"];
  for (const campo of camposPermitidos) {
    if (req.body[campo] !== undefined) recurso[campo] = String(req.body[campo]).trim();
  }
  res.status(200).json({ mensaje: "Recurso actualizado.", datos: recurso });
});

// 9. Eliminar lógicamente un recurso
app.delete("/api/v1/recursos/:id", (req, res) => {
  const recurso = buscarRecurso(req.params.id);
  if (!recurso) return res.status(404).json({ error: "Recurso no encontrado." });
  recurso.activo = false;
  res.status(204).send();
});

// 10. Consultar servicios académicos
app.get("/api/v1/servicios-academicos", (req, res) => {
  res.status(200).json({ total: serviciosAcademicos.length, datos: serviciosAcademicos });
});

// Documentación Swagger/OpenAPI
const openapiPath = path.join(__dirname, "02_DOCUMENTACION", "edusmart-api.yaml");
const openapiDocument = YAML.parse(fs.readFileSync(openapiPath, "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiDocument));

// Servicio SOAP implementado mediante la biblioteca soap
const soapService = {
  EduSmartService: {
    EduSmartPort: {
      ObtenerRecomendaciones(args) {
        const necesidadId = String(args.necesidadId || "");
        const lista = recomendaciones[necesidadId] || [];
        return {
          necesidadId,
          total: lista.length,
          recomendaciones: {
            recomendacion: lista.map(item => ({
              recursoId: String(item.recursoId),
              nombre: item.nombre,
              motivo: item.motivo
            }))
          }
        };
      }
    }
  }
};

const wsdlPath = path.join(__dirname, "03_SOAP_WSDL", "EduSmart.wsdl");

async function iniciarServidor() {
  const server = app.listen(PORT, () => {
    console.log(`EduSmart REST: http://localhost:${PORT}`);
    console.log(`Swagger: http://localhost:${PORT}/api-docs`);
  });

  soap.listen(server, "/soap", soapService, fs.readFileSync(wsdlPath, "utf8"));
  console.log(`EduSmart SOAP: http://localhost:${PORT}/soap`);
}

iniciarServidor().catch(error => {
  console.error("No fue posible iniciar EduSmart:", error);
  process.exit(1);
});