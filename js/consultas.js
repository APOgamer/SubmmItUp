//conexion
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'submmitupdb',
    password: '72512570',
    port: 5432,
  });


//-------------------------------------------------------
async function getAllDataFromAllTables() {
  const client = await pool.connect();

  try {
    // Consulta SQL para obtener la lista de todas las tablas en el esquema "public"
    const tablesQuery = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `;

    const tablesResult = await client.query(tablesQuery);

    // Iterar sobre las tablas y obtener los datos de cada una
    for (const tableRow of tablesResult.rows) {
      const tableName = tableRow.table_name;

      // Verificar si la tabla es 'archivos_resumenes' y omitirla si lo es
      if (tableName === 'archivos_resumenes') {
        continue; // Salta al siguiente ciclo de iteración
      }

      console.log(`Datos de la tabla "${tableName}":`);

      const dataQuery = `SELECT * FROM ${tableName}`;
      const dataResult = await client.query(dataQuery);
      const tableData = dataResult.rows;

      // Mostrar los datos en filas y atributos en columnas
      for (const row of tableData) {
        console.log(`${tableName}:`);
        for (const attribute in row) {
          console.log(`  ${attribute}: ${row[attribute]}`);
        }
      }
    }
  } catch (error) {
    console.error('Error al obtener los datos de las tablas:', error);
    throw error; // Propagar el error hacia arriba
  } finally {
    client.release(); // Liberar el cliente de la pool cuando hayamos terminado
  }
}





// Función para ejecutar un comando SQL
function ejecutarComandoSQL(comando) {
  pool.connect((err, client, done) => {
    if (err) {
      console.error('Error al conectarse a la base de datos:', err);
      return;
    }

    client.query(comando, (err, result) => {
      done(); // Libera el cliente de la conexión

      if (err) {
        console.error('Error al ejecutar el comando SQL:', err);
      } else {
        console.log('Comando SQL ejecutado correctamente');
        // Aquí puedes manejar el resultado del comando si es necesario
      }

      // Cierra la conexión al pool
      pool.end();
    });
  });
}


// Función para mostrar todas las tablas en la base de datos
async function showAllTables() {
    const client = await pool.connect();
    try {
      // Consulta SQL para recuperar la lista de todas las tablas
      const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
      `;
  
      const result = await client.query(query);
  
      // Imprime los nombres de las tablas
      console.log('Tablas en la base de datos:');
      result.rows.forEach(row => {
        console.log(row.table_name);
      });
    } finally {
      client.release();
    }
  }
  
  async function showAllTablesPlus() {
    const client = await pool.connect();
    try {
      // Consulta SQL para recuperar la lista de todas las tablas
      const query = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
      `;
  
      const result = await client.query(query);
  
      // Recorrer cada tabla y obtener información detallada
      for (const row of result.rows) {
        const tableName = row.table_name;
        console.log(`Tabla: ${tableName}`);
  
        // Consulta SQL para obtener información sobre los atributos de la tabla
        const attributeQuery = `
          SELECT column_name, data_type
          FROM information_schema.columns
          WHERE table_name = $1;
        `;
  
        const attributeResult = await client.query(attributeQuery, [tableName]);
  
        // Encuentra el atributo más largo para calcular espaciado
        let maxAttributeNameLength = 0;
        attributeResult.rows.forEach(attrRow => {
          const attributeName = attrRow.column_name;
          if (attributeName.length > maxAttributeNameLength) {
            maxAttributeNameLength = attributeName.length;
          }
        });
  
        // Consulta SQL para obtener información sobre las claves primarias
        const primaryKeyQuery = `
          SELECT column_name
          FROM information_schema.key_column_usage
          WHERE table_name = $1 AND constraint_name = (
            SELECT constraint_name
            FROM information_schema.table_constraints
            WHERE table_name = $1 AND constraint_type = 'PRIMARY KEY'
          );
        `;
  
        const primaryKeyResult = await client.query(primaryKeyQuery, [tableName]);
        const primaryKeyColumns = primaryKeyResult.rows.map(row => row.column_name);
  
        // Imprime los atributos y tipos de datos con espaciado perfecto
        attributeResult.rows.forEach(attrRow => {
          const attributeName = attrRow.column_name;
          const dataType = attrRow.data_type;
          const spacing = ' '.repeat(maxAttributeNameLength - attributeName.length);
          const isPrimaryKey = primaryKeyColumns.includes(attributeName) ? ' (Primary Key)' : '';
          console.log(`  Atributo: ${attributeName}${spacing}  Tipo de dato: ${dataType}${isPrimaryKey}`);
        });
  
        console.log('\n'); // Separador entre tablas
      }
    } finally {
      client.release();
    }
  }
  


// Llama a la función showAllTablesPlus

  showAllTablesPlus()
    .catch(err => {
      console.error('Error al mostrar las tablas y atributos:', err);
    });
 /*  */
   
    
  
  
/*
node js/consultas.js
*/

// Ejemplo de uso
const comandoSQL = `

`;

//ejecutarComandoSQL(comandoSQL);

 
  // Llamar a la función para obtener y mostrar los datos de todas las tablas
 /*
getAllDataFromAllTables()
    .catch((error) => {
        console.error('Error:', error);
    });
 
*/

/* 
node js/consultas.js
*/

async function buscarResumenesPorTema(tema) {
  try {
    const query = `
      SELECT r.id, r.titulo_resumen, r.descripcion_resumen, r.etiquetas, r.materia_ciclo, r.lugar_estudios
      FROM resumenes r
      WHERE
        r.titulo_resumen ILIKE $1 OR
        r.descripcion_resumen ILIKE $1 OR
        r.materia_ciclo ILIKE $1 OR
        r.lugar_estudios ILIKE $1
    `;

    const result = await pool.query(query, [`%${tema}%`]);

    if (result.rows.length > 0) {
      console.log('Se encontraron resúmenes:');
      result.rows.forEach((resumen) => {
        console.log('ID:', resumen.id);
        console.log('Título:', resumen.titulo_resumen);
        console.log('Descripción:', resumen.descripcion_resumen);
        console.log('Etiquetas:', resumen.etiquetas);
        console.log('Materia Ciclo:', resumen.materia_ciclo);
        console.log('Lugar de Estudios:', resumen.lugar_estudios);
        console.log('----------------------');
      });
    } else {
      console.log('No se encontraron resúmenes.');
    }
  } catch (error) {
    console.error('Error al buscar resúmenes:', error);
  }
}

// Ejemplo de uso
const tema = 'PDF'; // Cambia 'PDF' al valor que deseas buscar en todos los campos de la tabla resumenes
//buscarResumenesPorTema(tema);

