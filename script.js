/* =========================================
   EDUSMART - SISTEMA DE ORIENTACIÓN
   ========================================= */

/* 1. CATÁLOGO INICIAL DE RECURSOS */

const resources = [
  {
    id: "R01",
    name: "Guía de técnicas de estudio",
    category: "Aprendizaje",
    topic: "Hábitos de estudio",
    description:
      "Material de ejemplo sobre planificación, organización y seguimiento del aprendizaje.",
    needs: ["organizacion"]
  },
  {
    id: "R02",
    name: "Plantilla de planificación semanal",
    category: "Aprendizaje",
    topic: "Organización del tiempo",
    description:
      "Formato orientativo para distribuir actividades y tiempos de estudio.",
    needs: ["organizacion"]
  },
  {
    id: "R03",
    name: "Estrategias de lectura crítica",
    category: "Aprendizaje",
    topic: "Comprensión lectora",
    description:
      "Recurso de ejemplo para identificar ideas principales y analizar textos.",
    needs: ["lectura"]
  },
  {
    id: "R04",
    name: "Guía de herramientas digitales",
    category: "Competencias digitales",
    topic: "Competencias digitales",
    description:
      "Introducción a herramientas digitales de apoyo al trabajo académico.",
    needs: ["digital"]
  },
  {
    id: "R05",
    name: "Pausas y hábitos saludables",
    category: "Bienestar académico",
    topic: "Autocuidado",
    description:
      "Material informativo ficticio sobre pausas y organización de actividades.",
    needs: ["estres"]
  },
  {
    id: "R06",
    name: "Métodos de resumen",
    category: "Aprendizaje",
    topic: "Comprensión lectora",
    description:
      "Técnicas de ejemplo para sintetizar y organizar información.",
    needs: ["lectura"]
  }
];


/* 2. NOMBRES DE LAS NECESIDADES */

const needNames = {
  organizacion: "Mejorar la organización del estudio",
  lectura: "Fortalecer la comprensión lectora",
  digital: "Desarrollar competencias digitales",
  estres: "Manejar la carga académica"
};


/* 3. VARIABLES GENERALES */

let selectedNeed = "organizacion";

const $ = selector => document.querySelector(selector);


/* 4. NAVEGACIÓN ENTRE PÁGINAS */

function showPage(id) {

  document.querySelectorAll(".page").forEach(page => {
    page.classList.toggle("active", page.id === id);
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === id
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* 5. EVENTOS DEL MENÚ */

document.querySelectorAll("[data-page]").forEach(button => {

  button.addEventListener("click", () => {
    showPage(button.dataset.page);
  });

});


/* 6. BOTONES DE NAVEGACIÓN INTERNA */

document.querySelectorAll("[data-go]").forEach(button => {

  button.addEventListener("click", () => {
    showPage(button.dataset.go);
  });

});


/* 7. PROTECCIÓN DE TEXTO HTML */

function escapeHtml(value) {

  return String(value).replace(/[&<>"']/g, character => {

    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });

}


/* 8. CREACIÓN DE TARJETAS DE RECURSOS */

function card(resource) {

  return `
    <article class="resource-card">

      <span class="tag">
        ${escapeHtml(resource.category)}
      </span>

      <h3>
        ${escapeHtml(resource.name)}
      </h3>

      <p>
        ${escapeHtml(resource.description)}
      </p>

      <small>
        <b>Tema:</b>
        ${escapeHtml(resource.topic)}
      </small>

      <br>

      <button data-detail="${escapeHtml(resource.id)}">
        Ver información
      </button>

    </article>
  `;
}


/* 9. MOSTRAR Y FILTRAR RECURSOS */

function renderResources() {

  const query = $("#searchInput").value.toLowerCase();

  const category = $("#categoryFilter").value;

  const filtered = resources.filter(resource => {

    const matchesCategory =
      !category || resource.category === category;

    const searchableText =
      `${resource.name} ${resource.topic} ${resource.description}`
      .toLowerCase();

    const matchesSearch =
      searchableText.includes(query);

    return matchesCategory && matchesSearch;

  });

  $("#resourceList").innerHTML =
    filtered.map(card).join("") ||
    "<p>No se encontraron recursos con esos criterios.</p>";

  $("#resourceCount").textContent = resources.length;
}


/* 10. GENERAR RECOMENDACIONES */

function renderRecommendations() {

  const found = resources.filter(resource =>
    resource.needs.includes(selectedNeed)
  );

  const heading = `
    <div class="panel">
      <b>Necesidad seleccionada</b>

      <span>
        ${escapeHtml(needNames[selectedNeed])}
      </span>

      <small>
        Los siguientes recursos están asociados a esta
        necesidad en los datos de demostración.
      </small>
    </div>
  `;

  const results = found.map(card).join("");

  $("#recommendationList").innerHTML =
    heading +
    (results || "<p>No hay recursos asociados a esta necesidad.</p>");
}


/* 11. EVENTOS DE BÚSQUEDA */

$("#searchInput").addEventListener(
  "input",
  renderResources
);

$("#categoryFilter").addEventListener(
  "change",
  renderResources
);


/* 12. SELECCIÓN DE NECESIDAD */

$("#needSelect").addEventListener("change", event => {

  selectedNeed = event.target.value;

});


/* 13. CONSULTAR RECOMENDACIONES */

$("#recommendBtn").addEventListener("click", () => {

  selectedNeed = $("#needSelect").value;

  renderRecommendations();

  showPage("recomendaciones");

});


/* 14. AGREGAR RECURSOS */

$("#resourceForm").addEventListener("submit", event => {

  event.preventDefault();

  const item = {

    id: "R" + String(resources.length + 1).padStart(2, "0"),

    name: $("#resourceName").value.trim(),

    category: $("#resourceCategory").value,

    topic: $("#resourceTopic").value.trim(),

    description: $("#resourceDescription").value.trim(),

    needs: []

  };

  resources.push(item);

  $("#formMessage").textContent =
    "Recurso agregado a la demostración local.";

  event.target.reset();

  renderResources();

});


/* 15. CONSULTAR DETALLE DE UN RECURSO */

document.addEventListener("click", event => {

  const button = event.target.closest("[data-detail]");

  if (!button) return;

  const resource = resources.find(item =>
    item.id === button.dataset.detail
  );

  if (!resource) return;

  alert(
    `${resource.name}\n` +
    `Categoría: ${resource.category}\n` +
    `Tema: ${resource.topic}\n\n` +
    `${resource.description}`
  );

});


/* 16. INICIALIZACIÓN DEL SISTEMA */

renderResources();

renderRecommendations();