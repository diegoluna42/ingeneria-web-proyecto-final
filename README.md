# EduSmart — Servicios web REST y SOAP

## 1. Propósito
Proyecto demostrativo para ilustrar el diseño y la ejecución local de servicios web REST y SOAP asociados a EduSmart.

## 2. Requisitos
- Node.js (versión LTS recomendada).
- npm (se instala junto con Node.js).
- Postman para probar las solicitudes (opcional).
- Navegador para consultar Swagger UI.

## 3. Instalación
Abra una terminal en la carpeta raíz `EDUSMART_SERVICIOS_WEB` y ejecute:

```bash
npm install
npm start
```

El servidor queda disponible en `http://localhost:3000`.

## 4. Direcciones
- Inicio: http://localhost:3000/
- REST: http://localhost:3000/api/v1/recursos
- Swagger: http://localhost:3000/api-docs
- WSDL: http://localhost:3000/soap?wsdl

## 5. Servicios REST incluidos
| Método | Ruta | Función |
|---|---|---|
| GET | /api/v1/recursos | Lista recursos; acepta categoria y buscar |
| GET | /api/v1/recursos/:id | Consulta un recurso |
| GET | /api/v1/categorias | Lista categorías |
| GET | /api/v1/necesidades | Lista necesidades |
| POST | /api/v1/estudiantes/:id/necesidades | Registra una necesidad |
| GET | /api/v1/estudiantes/:id/necesidades | Consulta necesidades de estudiante |
| GET | /api/v1/recomendaciones?necesidadId=N001 | Consulta recomendaciones |
| GET | /api/v1/relaciones?necesidadId=N001 | Consulta relaciones semánticas |
| POST | /api/v1/recursos | Crea un recurso |
| PATCH | /api/v1/recursos/:id | Actualiza parcialmente un recurso |
| DELETE | /api/v1/recursos/:id | Desactiva un recurso |
| GET | /api/v1/servicios-academicos | Lista servicios académicos |

## 6. Pruebas con Postman
1. Abra Postman.
2. Seleccione Import.
3. Importe `04_PRUEBAS_POSTMAN/EduSmart_API.postman_collection.json`.
4. Ejecute primero las consultas GET.
5. Pruebe POST, PATCH y DELETE teniendo presente que los datos están en memoria.
6. Para SOAP, cree una solicitud POST a `http://localhost:3000/soap`, con `Content-Type: text/xml` y el contenido de `03_SOAP_WSDL/solicitud.xml`.

## 7. Prueba SOAP
El servicio publicado contiene la operación `ObtenerRecomendaciones`.
El WSDL se encuentra en `03_SOAP_WSDL/EduSmart.wsdl` y se publica desde el servidor en `/soap?wsdl`.

## 8. Datos y límites de la demostración
- La información está almacenada en arreglos dentro de `server.js`.
- Los cambios se pierden al reiniciar el servidor.
- No se implementan autenticación, autorización ni conexión a una base de datos.
- No existe conexión efectiva con Protégé ni Neo4j en este prototipo.
- La ontología OWL y el grafo de conocimiento son componentes propuestos para una etapa posterior.
- Antes de un uso real deben añadirse persistencia, controles de seguridad, validación ampliada, pruebas automatizadas y configuración de despliegue.

## 9. Códigos HTTP principales
- 200: solicitud atendida.
- 201: recurso creado.
- 204: recurso desactivado sin cuerpo de respuesta.
- 400: solicitud incompleta o inválida.
- 404: elemento no encontrado.
- 500: error interno no controlado.

## 10. Diagramas
La carpeta `05_IMAGENES` contiene diagramas editables en formato SVG. Pueden insertarse en Word o convertirse a PNG para la entrega.
