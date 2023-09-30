const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer'); // Importa multer
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
    if (typeof data['etiquetas'] === 'string') {
      etiquetasArray = data['etiquetas'].split(',').filter(tag => tag.trim() !== ' ');
    }
    // Agregar el campo id-usuario (temporalmente, reemplazar con el valor correcto)
    const idUsuario = 777; // Cambia este valor con el ID de usuario correcto

    // Realiza la inserción en la base de datos usando los datos del formulario y la ID generada
    const insertQuery = `
      INSERT INTO resumenes (usuario_id, id, titulo_resumen, etiquetas, descripcion_resumen, materia_ciclo, lugar_estudios)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
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

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
