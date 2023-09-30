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
    
  
    
  
  
/*
node js/consultas.js


// Ejemplo de uso
const comandoSQL = `
INSERT INTO usuarios (id, nombre_usuario, email, contrasena)
VALUES (777, 'Usuario777', 'usuario777@example.com', 'contrasena777');
`;

ejecutarComandoSQL(comandoSQL);
*/
/* */
// Llamar a la función para obtener y mostrar los datos de todas las tablas
getAllDataFromAllTables()
    .catch((error) => {
        console.error('Error:', error);
    });


/* 
node js/consultas.js
*/