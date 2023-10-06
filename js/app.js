const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer'); // Importa multer
const pdf = require('pdfkit');
const fs = require('fs');
const app = express();
const port = 3000;

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'submmitupdb',
  password: '72512570',
  port: 5432,
});

// Middleware para analizar solicitudes JSON
app.use(express.json());

// Configura cors para permitir todas las solicitudes
app.use(cors());

const crypto = require('crypto'); // Importa el módulo crypto para generar IDs aleatorias

// Configura multer para manejar la subida de archivos
const storage = multer.memoryStorage(); // Almacena el archivo en memoria
const upload = multer({ storage: storage });





//LEFT JOIN archivos_resumenes a ON r.id = a.resumen_id
// En app.js (servidor)
app.post('/buscar-resumenes', async (req, res) => {
  try {
    const filtro = req.body; // Los criterios de filtrado se encuentran en req.body
    const { filtroTexto } = filtro; // Nuevo campo "filtroTexto" para buscar por tema

    // Utilizamos la función para buscar resúmenes por tema
    const result = await buscarResumenesPorTema(filtroTexto);

    if (result.length > 0) {
      console.log('Se encontraron resúmenes:', result);
      res.status(200).json({ resumenes: result });
    } else {
      console.log('No se encontraron resúmenes.');
      res.status(404).json({ error: 'No se encontraron resúmenes.' });
    }
  } catch (error) {
    console.error('Error al filtrar resúmenes:', error);
    res.status(500).json({ error: 'Error al filtrar resúmenes' });
  }
});

// Función para buscar resúmenes por tema en la base de datos
async function buscarResumenesPorTema(tema) {
  try {
    const query = `
      SELECT r.id, r.titulo_resumen, r.descripcion_resumen, r.etiquetas, r.materia_ciclo, r.lugar_estudios
      FROM resumenes r
      WHERE
        r.titulo_resumen ILIKE '%' || $1 || '%' OR
        r.descripcion_resumen ILIKE '%' || $1 || '%' OR
        r.materia_ciclo ILIKE '%' || $1 || '%' OR
        r.lugar_estudios ILIKE '%' || $1 || '%'
    `;

    const result = await pool.query(query, [`%${tema}%`]);

    return result.rows;
  } catch (error) {
    console.error('Error al buscar resúmenes por tema:', error);
    throw error;
  }
}
/*
app.get('/descargar-pdf-main/:id', async (req, res) => {
  const resumenId = req.params.id; // Obtenemos el ID del resumen desde la URL

  try {
    // Consultar si el resumen existe
    const resumenQuery = 'SELECT * FROM resumenes WHERE id = $1';
    const resumenResult = await pool.query(resumenQuery, [resumenId]);

    if (resumenResult.rows.length === 0) {
      return res.status(404).json({ error: 'El resumen no existe.' }); // Si no se encuentra un resumen
    }

    // Obtén el tema del resumen actual
    const tema = resumenResult.rows[0].tema; // Suponiendo que el campo se llama "tema"

    // Utiliza la función buscarResumenesPorTema para encontrar resúmenes por el tema
    const resumenesPorTema = await buscarResumenesPorTema(tema);

    if (resumenesPorTema.length === 0) {
      return res.status(404).json({ error: 'No se encontraron resúmenes relacionados con el tema.' });
    }

    // Consultar el archivo PDF correspondiente al resumen
    const query = 'SELECT archivo FROM archivos_resumenes WHERE resumen_id = $1';
    const result = await pool.query(query, [resumenId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'El resumen no tiene un archivo PDF asociado.' }); // Si no se encuentra un archivo PDF asociado
    }

    const pdfData = result.rows[0].archivo;

    // Configurar los encabezados para la descarga del PDF
    res.setHeader('Content-Disposition', `attachment; filename=resumen_${resumenId}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Enviar el archivo PDF al navegador
    res.send(pdfData);
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
    res.status(500).json({ error: 'Error al descargar el PDF' });
  }
});

*/


// Ruta para manejar la solicitud POST desde el formulario
app.post('/guardar-resumen', upload.single('archivo-resumen'), async (req, res) => {
  try {
    const data = JSON.parse(req.body.data); // Los datos del formulario se encuentran en req.body.data
    const archivoSubida = req.file; // El archivo de subida se encuentra en req.file
    
    console.log('Datos del formulario:', data);

    // El archivo de subida se encuentra en req.file
    console.log('Archivo de subida:', archivoSubida);


    // Genera una ID aleatoria para el resumen
    const resumenIdHex = crypto.randomBytes(2).toString('hex'); // Genera una cadena hexadecimal
    const resumenId = parseInt(resumenIdHex, 16); // Convierte la cadena a un número entero


    // Convierte las etiquetas en un array aquí
      
    let etiquetasArray = [];
    if (typeof data['etiquetas'] === Array) {
      etiquetasArray = data['etiquetas'].split(',').filter(tag => tag.trim() !== ' ');
    }
    // Agregar el campo id-usuario (temporalmente, reemplazar con el valor correcto)
    const idUsuario = 777; // Cambia este valor con el ID de usuario correcto

    // Realiza la inserción en la base de datos usando los datos del formulario y la ID generada
    const insertQuery = `
      INSERT INTO resumenes (usuario_id, id, titulo_resumen, etiquetas, descripcion_resumen, materia_ciclo, lugar_estudios)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    //      etiquetasArray, // Envía el array de etiquetas aquí

    await pool.query(insertQuery, [
      idUsuario, // Agrega el id-usuario aquí
      resumenId, // Agrega la ID generada aquí
      data['titulo-resumen'],
      etiquetasArray, // Envía el array de etiquetas aquí
      data['descripcion-resumen'],
      data['materia-ciclo'],
      data['lugar-estudios'],
    ]);

    /// Genera una ID aleatoria única para la tabla "archivos_resumenes"
        const archivoIdHex = crypto.randomBytes(2).toString('hex'); // Genera una cadena hexadecimal
        const archivoId = parseInt(archivoIdHex, 16); // Convierte la cadena a un número entero


    // Realiza la inserción en la tabla "archivos_resumenes" con los datos adecuados
    const insertQueryArchivos = `
      INSERT INTO archivos_resumenes (id, resumen_id, archivo)
      VALUES ($1, $2, $3)
    `;
    await pool.query(insertQueryArchivos, [
      archivoId, // Agrega la ID aleatoria única aquí
      resumenId, // Utiliza la misma resumenId generada anteriormente
      archivoSubida.buffer, // Agrega el contenido del archivo desde req.file.buffer
    ]);

    res.status(200).json({ message: 'Resumen guardado con éxito' });
  } catch (error) {
    console.error('Error al guardar el resumen:', error);
    res.status(500).json({ error: 'Error al guardar el resumen' });
  }
});

// node js/app.js
app.post('/filtrar-resumenes', async (req, res) => {
  try {
    const filtros = req.body; // Los criterios de filtrado se encuentran en req.body

    // Utilizamos la función para buscar resúmenes por múltiples criterios
    const result = await buscarResumenes(filtros);

    if (result.length > 0) {
      console.log('Se encontraron resúmenes:', result);
      res.status(200).json({ resumenes: result });
    } else {
      console.log('No se encontraron resúmenes.');
      res.status(200).json({ resumenes: [] }); // Devuelve un array vacío como resumenes
    }
  } catch (error) {
    console.error('Error al filtrar resúmenes:', error);
    res.status(500).json({ error: 'Error al filtrar resúmenes' });
  }
});

async function buscarResumenes(filtros) {
  try {
    // Desestructura los filtros desde el objeto filtros
    const { tema, materia, anioAcademico, anios, carreras, universidades } = filtros;

    // Consulta base que busca por tema y otros criterios
    let query = `
      SELECT r.id, r.titulo_resumen, r.descripcion_resumen, r.etiquetas, r.materia_ciclo, r.lugar_estudios
      FROM resumenes r
      WHERE`;

    const queryParams = [];

    // Agrega condiciones para cada campo
    if (tema) {
      query += ` r.titulo_resumen ILIKE '%' || $${queryParams.length + 1} || '%' OR`;
      queryParams.push(tema);
    }

    if (materia) {
      query += ` r.materia_ciclo ILIKE '%' || $${queryParams.length + 1} || '%' OR`;
      queryParams.push(materia);
    }

    if (anioAcademico) {
      query += ` $${queryParams.length + 1} = ANY (r.etiquetas) OR`;
      queryParams.push(anioAcademico);
    }

    if (anios.length > 0) {
      query += ` r.anio = ANY ($${queryParams.length + 1}::integer[]) OR`;
      queryParams.push(anios);
    }

    if (carreras.length > 0) {
      query += ` r.carrera = ANY ($${queryParams.length + 1}::text[]) OR`;
      queryParams.push(carreras);
    }

    if (universidades.length > 0) {
      // Utiliza ILIKE para buscar cualquier coincidencia de caracteres en el campo de universidad
      query += ` r.universidad ILIKE '%' || $${queryParams.length + 1} || '%' OR`;
      queryParams.push(universidades);
    }

    // Elimina el último "OR" redundante
    query = query.slice(0, -2);

    const result = await pool.query(query, queryParams);

    return result.rows;
  } catch (error) {
    console.error('Error al buscar resúmenes por múltiples criterios:', error);
    throw error;
  }
}


app.get('/descargar-pdf/:id', async (req, res) => {
  const resumenId = req.params.id; // Obtenemos el ID del resumen desde la URL

  try {
    // Consultar el archivo PDF correspondiente al resumen
    const query = 'SELECT archivo FROM archivos_resumenes WHERE resumen_id = $1';
    const result = await pool.query(query, [resumenId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'El resumen no tiene un archivo PDF asociado.' }); // Si no se encuentra un archivo PDF asociado
    }

    const pdfData = result.rows[0].archivo;

    // Configurar los encabezados para la descarga del PDF
    res.setHeader('Content-Disposition', `attachment; filename=resumen_${resumenId}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');

    // Enviar el archivo PDF al navegador
    res.send(pdfData);
  } catch (error) {
    console.error('Error al descargar el PDF:', error);
    res.status(500).json({ error: 'Error al descargar el PDF' });
  }
});











app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
